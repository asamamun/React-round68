const params = new URLSearchParams(window.location.search);
const examId = params.get("exam");

const examTitleEl = document.getElementById("examTitle");
const questionsContainer = document.getElementById("questionsContainer");
const examForm = document.getElementById("examForm");
const alertBox = document.getElementById("alertBox");
const timerBadge = document.getElementById("timerBadge");

let examData = null;
let timerInterval = null;
const EXAM_DURATION_SECONDS = 20 * 60;

function formatTime(totalSeconds) {
  const mins = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const secs = String(totalSeconds % 60).padStart(2, "0");
  return `${mins}:${secs}`;
}

function startTimer() {
  const key = `exam_deadline_${examId}`;
  const now = Date.now();
  let deadline = Number(sessionStorage.getItem(key));
  if (!deadline || deadline <= now) {
    deadline = now + EXAM_DURATION_SECONDS * 1000;
    sessionStorage.setItem(key, String(deadline));
  }

  const tick = () => {
    const remainingMs = deadline - Date.now();
    const remainingSeconds = Math.max(0, Math.ceil(remainingMs / 1000));
    timerBadge.textContent = formatTime(remainingSeconds);

    if (remainingSeconds <= 300) {
      timerBadge.className = "badge text-bg-danger";
    } else {
      timerBadge.className = "badge text-bg-warning";
    }

    if (remainingSeconds <= 0) {
      clearInterval(timerInterval);
      showAlert("Time is up. Your exam is being submitted.", "warning");
      submitExam(true);
    }
  };

  tick();
  timerInterval = setInterval(tick, 1000);
}

function showAlert(message, type = "danger") {
  alertBox.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
}

async function loadExam() {
  if (!examId) {
    showAlert("No exam selected.");
    return;
  }

  try {
    const res = await fetch(`api/get_exam.php?exam=${encodeURIComponent(examId)}`);
    const data = await res.json();

    if (!res.ok || data.error) {
      throw new Error(data.error || "Failed to load exam.");
    }

    examData = data;
    examTitleEl.textContent = `${data.title} (${data.totalMarks} Marks)`;

    questionsContainer.innerHTML = data.questions
      .map(
        (q, idx) => `
      <div class="card question-card mb-3">
        <div class="card-body">
          <h6 class="mb-3">${idx + 1}. ${q.question}</h6>
          ${q.options
            .map(
              (opt, oi) => `
            <div class="form-check">
              <input class="form-check-input" type="radio" name="q_${q.id}" id="q_${q.id}_${oi}" value="${oi}" />
              <label class="form-check-label" for="q_${q.id}_${oi}">${opt}</label>
            </div>
          `
            )
            .join("")}
        </div>
      </div>
    `
      )
      .join("");
    startTimer();
  } catch (err) {
    showAlert(err.message);
  }
}

async function submitExam(forceSubmit = false) {
  if (!examData) return;

  const studentName = document.getElementById("studentName").value.trim();
  const studentId = document.getElementById("studentId").value.trim();
  const answers = {};

  if (!studentName || !studentId) {
    showAlert("Please provide both student name and ID.");
    return;
  }

  for (const q of examData.questions) {
    const selected = document.querySelector(`input[name="q_${q.id}"]:checked`);
    if (!selected && !forceSubmit) {
      showAlert("Please answer all questions.");
      return;
    }
    answers[q.id] = selected ? Number(selected.value) : -1;
  }

  try {
    const res = await fetch("api/submit_result.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        examId,
        studentName,
        studentId,
        answers,
      }),
    });

    const data = await res.json();
    if (!res.ok || data.error) {
      throw new Error(data.error || "Submission failed.");
    }

    clearInterval(timerInterval);
    sessionStorage.removeItem(`exam_deadline_${examId}`);
    showAlert(
      `Submitted successfully. Score: ${data.score}/${data.totalMarks}`,
      "success"
    );
    Array.from(examForm.elements).forEach((el) => {
      el.disabled = true;
    });
    examForm.reset();
  } catch (err) {
    showAlert(err.message);
  }
}

examForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  submitExam(false);
});

loadExam();

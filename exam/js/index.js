const exams = [1, 2, 3, 4, 5].map((n) => ({
  id: `exam${n}`,
  title: `React Exam ${n}`,
  totalMarks: 20,
}));

const examList = document.getElementById("examList");

examList.innerHTML = exams
  .map(
    (exam) => `
    <div class="col-12 col-md-6 col-lg-4">
      <div class="card exam-card h-100">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${exam.title}</h5>
          <p class="card-text text-muted mb-4">Total Marks: ${exam.totalMarks}</p>
          <div class="mt-auto d-flex gap-2">
            <a href="exam.html?exam=${exam.id}" class="btn btn-primary btn-sm">Take Exam</a>
            <a href="leaderboard.html?exam=${exam.id}" class="btn btn-outline-secondary btn-sm">Leaderboard</a>
          </div>
        </div>
      </div>
    </div>
  `
  )
  .join("");

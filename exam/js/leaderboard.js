const params = new URLSearchParams(window.location.search);
const examId = params.get("exam") || "exam1";
const titleEl = document.getElementById("title");
const boardBody = document.getElementById("boardBody");

titleEl.textContent = `Leaderboard - ${examId.toUpperCase()}`;

async function loadBoard() {
  const res = await fetch(`api/get_leaderboard.php?exam=${encodeURIComponent(examId)}`);
  const data = await res.json();

  if (!res.ok || data.error) {
    boardBody.innerHTML = `<tr><td colspan="5" class="text-danger">${data.error || "Failed to load leaderboard."}</td></tr>`;
    return;
  }

  if (!data.length) {
    boardBody.innerHTML = `<tr><td colspan="5" class="text-muted">No results yet.</td></tr>`;
    return;
  }

  boardBody.innerHTML = data
    .map(
      (row, i) => `
      <tr>
        <td>${i + 1}</td>
        <td>${row.studentName}</td>
        <td>${row.studentId}</td>
        <td><span class="badge text-bg-primary score-badge">${row.score}/20</span></td>
        <td>${row.submittedAt}</td>
      </tr>
    `
    )
    .join("");
}

loadBoard();

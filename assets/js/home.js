/**
 * HOMEPAGE RENDERER (assets/js/home.js)
 * Reads window.CLASS7_SUBJECTS from assets/js/subjects.js
 * and renders colorful mobile-first subject cards.
 */

(function () {
  const grid = document.getElementById("subjects-grid");
  const statTotal = document.getElementById("stat-total");
  const statAvailable = document.getElementById("stat-available");
  const filterButtons = document.querySelectorAll(".filter-btn");

  const subjects = Array.isArray(window.CLASS7_SUBJECTS) ? window.CLASS7_SUBJECTS : [];
  let currentFilter = "all";

  function updateStats() {
    const availableCount = subjects.filter((s) => s.status === "Available").length;
    if (statTotal) statTotal.textContent = `📚 ${subjects.length} Subjects`;
    if (statAvailable) statAvailable.textContent = `✅ ${availableCount} Available`;
  }

  function createSubjectCard(subject) {
    const isAvailable = subject.status === "Available";
    const card = document.createElement("article");
    card.className = `subject-card ${isAvailable ? "is-available" : "is-coming-soon"}`;
    card.style.setProperty("--card-accent", subject.accentColor || "#4f46e5");
    card.style.setProperty("--card-bg", subject.bgTint || "#eef2ff");

    const statusBadgeClass = isAvailable ? "status-available" : "status-soon";
    const statusIcon = isAvailable ? "●" : "⏳";

    const actionHtml = isAvailable
      ? `<a href="${subject.path}" class="btn btn-primary btn-block">Open Subject &rarr;</a>`
      : `<button type="button" class="btn btn-disabled btn-block" disabled aria-disabled="true">Coming Soon</button>`;

    card.innerHTML = `
      <div class="card-top">
        <div class="subject-icon" aria-hidden="true">${subject.icon || "📖"}</div>
        <span class="status-badge ${statusBadgeClass}">${statusIcon} ${subject.status}</span>
      </div>
      <div class="card-body">
        <h3>${subject.name}</h3>
        ${subject.nameBn ? `<p class="bn-text" lang="bn" style="font-weight:700; color:#334155; margin-bottom:4px;">${subject.nameBn}</p>` : ""}
        <p>${subject.description}</p>
      </div>
      <div class="card-footer">
        ${actionHtml}
      </div>
    `;

    return card;
  }

  function renderSubjects() {
    if (!grid) return;
    grid.innerHTML = "";

    const filtered = subjects.filter((subject) => {
      if (currentFilter === "all") return true;
      return subject.status === currentFilter;
    });

    if (!filtered.length) {
      grid.innerHTML = `
        <div class="content-card empty-state" style="grid-column: 1 / -1;">
          <div class="empty-state-icon">📭</div>
          <h3>No subjects match this filter</h3>
          <p>Try selecting "All" to see every Class 7 subject.</p>
        </div>
      `;
      return;
    }

    filtered.forEach((subject) => {
      grid.appendChild(createSubjectCard(subject));
    });
  }

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentFilter = btn.dataset.filter || "all";
      renderSubjects();
    });
  });

  updateStats();
  renderSubjects();
})();

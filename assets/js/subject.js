/**
 * REUSABLE SUBJECT LEARNING ENGINE (assets/js/subject.js)
 * ------------------------------------------------------
 * Reads window.SUBJECT_CONTENT (defined in each subject's local content.js)
 * and renders chapter/topic selection, adaptive content blocks, Bangla toggle,
 * Web Speech audio controls, progress tracking, Q&A, and practice exercises.
 */

(function () {
  const data = window.SUBJECT_CONTENT;
  const registry = Array.isArray(window.CLASS7_SUBJECTS) ? window.CLASS7_SUBJECTS : [];

  const elements = {
    banner: document.getElementById("subject-banner"),
    icon: document.getElementById("subject-icon"),
    title: document.getElementById("subject-title"),
    subtitle: document.getElementById("subject-subtitle"),
    chapterSelect: document.getElementById("chapter-select"),
    topicSelect: document.getElementById("topic-select"),
    progressText: document.getElementById("progress-text"),
    progressPercent: document.getElementById("progress-percent"),
    progressFill: document.getElementById("progress-fill"),
    toggleBnBtn: document.getElementById("toggle-bn-btn"),
    playLessonBtn: document.getElementById("play-lesson-btn"),
    stopAudioBtn: document.getElementById("stop-audio-btn"),
    speedSelect: document.getElementById("speed-select"),
    audioNotice: document.getElementById("audio-notice"),
    toolbar: document.getElementById("learning-toolbar"),
    selectorPanel: document.getElementById("selector-panel"),
    progressWrap: document.getElementById("progress-wrap"),
    lessonMain: document.getElementById("lesson-main"),
    prevTopicBtn: document.getElementById("prev-topic-btn"),
    nextTopicBtn: document.getElementById("next-topic-btn"),
    lessonNav: document.getElementById("lesson-nav")
  };

  if (!data) {
    if (elements.lessonMain) {
      elements.lessonMain.innerHTML = `
        <div class="content-card empty-state">
          <div class="empty-state-icon">⚠️</div>
          <h2>Content Not Found</h2>
          <p>Could not load this subject's <code>content.js</code> file.</p>
          <a href="../../index.html" class="btn btn-primary" style="margin-top:12px;">&larr; Back to Home</a>
        </div>
      `;
    }
    return;
  }

  // Match registry metadata for consistent accent color & icon
  const regEntry = registry.find((s) => s.id === data.subjectId);
  const accentColor = data.accentColor || (regEntry && regEntry.accentColor) || "#4f46e5";
  document.documentElement.style.setProperty("--subject-accent", accentColor);

  if (elements.title) {
    elements.title.textContent = data.subjectName || (regEntry && regEntry.name) || "Class 7 Subject";
  }
  if (elements.subtitle) {
    elements.subtitle.textContent =
      data.description || (regEntry && regEntry.description) || "Interactive Class 7 Lessons";
  }
  if (elements.icon) {
    elements.icon.textContent = data.icon || (regEntry && regEntry.icon) || "📖";
  }
  document.title = `${elements.title ? elements.title.textContent : "Subject"} | Class 7 Learning`;

  const chapters = Array.isArray(data.chapters) ? data.chapters : [];

  // Handle Coming Soon or empty chapters gracefully
  if (!chapters.length || data.status === "Coming Soon") {
    if (elements.selectorPanel) elements.selectorPanel.style.display = "none";
    if (elements.toolbar) elements.toolbar.style.display = "none";
    if (elements.progressWrap) elements.progressWrap.style.display = "none";
    if (elements.lessonNav) elements.lessonNav.style.display = "none";
    if (elements.lessonMain) {
      elements.lessonMain.innerHTML = `
        <div class="content-card empty-state">
          <div class="empty-state-icon">${data.icon || "⏳"}</div>
          <h2>Coming Soon!</h2>
          <p>Lessons for <strong>${data.subjectName}</strong> are currently being prepared. Check back soon or explore available subjects on the homepage.</p>
          <a href="../../index.html" class="btn btn-primary" style="margin-top:14px;">&larr; Back to All Subjects</a>
        </div>
      `;
    }
    return;
  }

  // Flatten all topics for Prev/Next & Progress tracking
  const flatTopics = [];
  chapters.forEach((chapter, cIdx) => {
    const topics = Array.isArray(chapter.topics) ? chapter.topics : [];
    topics.forEach((topic, tIdx) => {
      flatTopics.push({ chapterIndex: cIdx, topicIndex: tIdx, chapter, topic });
    });
  });

  let currentChapterIdx = 0;
  let currentTopicIdx = 0;
  let showBangla = true;

  const STORAGE_KEY = `class7_progress_${data.subjectId || "subject"}`;

  function getVisitedSet() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      return new Set(Array.isArray(saved) ? saved : []);
    } catch {
      return new Set();
    }
  }

  function markTopicVisited(topicKey) {
    try {
      const visited = getVisitedSet();
      visited.add(topicKey);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(visited)));
    } catch {
      // Ignore storage errors in private browsing
    }
  }

  function showAudioNotice(message) {
    if (!elements.audioNotice) return;
    elements.audioNotice.textContent = message;
    elements.audioNotice.classList.add("is-visible");
  }

  function hideAudioNotice() {
    if (!elements.audioNotice) return;
    elements.audioNotice.classList.remove("is-visible");
  }

  function clearSpeakingHighlights() {
    document.querySelectorAll(".sentence-item.is-speaking").forEach((el) => {
      el.classList.remove("is-speaking");
    });
  }

  function populateChapters() {
    if (!elements.chapterSelect) return;
    elements.chapterSelect.innerHTML = "";
    chapters.forEach((ch, idx) => {
      const opt = document.createElement("option");
      opt.value = String(idx);
      opt.textContent = ch.title || `Chapter ${idx + 1}`;
      elements.chapterSelect.appendChild(opt);
    });
    elements.chapterSelect.value = String(currentChapterIdx);
  }

  function populateTopics() {
    if (!elements.topicSelect) return;
    elements.topicSelect.innerHTML = "";
    const chapter = chapters[currentChapterIdx];
    const topics = chapter && Array.isArray(chapter.topics) ? chapter.topics : [];
    topics.forEach((tp, idx) => {
      const opt = document.createElement("option");
      opt.value = String(idx);
      opt.textContent = tp.title || `Topic ${idx + 1}`;
      elements.topicSelect.appendChild(opt);
    });
    elements.topicSelect.value = String(currentTopicIdx);
  }

  function getFlatIndex() {
    return flatTopics.findIndex(
      (item) => item.chapterIndex === currentChapterIdx && item.topicIndex === currentTopicIdx
    );
  }

  function updateProgressAndNav() {
    const flatIdx = getFlatIndex();
    const total = flatTopics.length;
    const topicKey = `${currentChapterIdx}-${currentTopicIdx}`;
    markTopicVisited(topicKey);

    const visitedCount = getVisitedSet().size;
    const pct = total > 0 ? Math.round((visitedCount / total) * 100) : 0;

    if (elements.progressText) {
      elements.progressText.textContent = `Lesson ${flatIdx + 1} of ${total} • ${visitedCount}/${total} explored`;
    }
    if (elements.progressPercent) {
      elements.progressPercent.textContent = `${pct}%`;
    }
    if (elements.progressFill) {
      elements.progressFill.style.width = `${pct}%`;
    }

    if (elements.prevTopicBtn) {
      elements.prevTopicBtn.disabled = flatIdx <= 0;
    }
    if (elements.nextTopicBtn) {
      elements.nextTopicBtn.disabled = flatIdx >= total - 1;
    }
  }

  function escapeHtml(str) {
    if (str === null || str === undefined) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function renderSentencesSection(title, icon, items) {
    if (!Array.isArray(items) || !items.length) return null;
    const card = document.createElement("section");
    card.className = "content-card";
    card.innerHTML = `
      <div class="content-card-header">
        <span aria-hidden="true">${icon}</span>
        <h2>${escapeHtml(title)}</h2>
      </div>
      <div class="sentence-list"></div>
    `;

    const list = card.querySelector(".sentence-list");

    items.forEach((item, idx) => {
      const row = document.createElement("div");
      row.className = "sentence-item";
      row.dataset.audioIdx = String(idx);

      const speakerHtml = item.speaker
        ? `<span class="speaker-tag">${escapeHtml(item.speaker)}</span>`
        : "";

      const primaryText = item.en || item.text || "";
      const bnText = item.bn || "";

      const hasEn = Boolean(item.en);
      const hasBn = Boolean(bnText);

      let audioButtonsHtml = "";
      if (hasEn) {
        audioButtonsHtml += `<button type="button" class="btn btn-secondary btn-sm play-single-btn" data-lang="en" aria-label="Listen in English">🔊 EN</button>`;
      }
      if (hasBn) {
        audioButtonsHtml += `<button type="button" class="btn btn-secondary btn-sm play-single-btn" data-lang="bn" aria-label="Listen in Bangla">🔊 BN</button>`;
      }

      row.innerHTML = `
        <div class="sentence-top">
          <div>
            ${speakerHtml}
            ${primaryText ? `<p class="sentence-en">${escapeHtml(primaryText)}</p>` : ""}
          </div>
          <div class="sentence-audio-actions">
            ${audioButtonsHtml}
          </div>
        </div>
        ${hasBn ? `<p class="sentence-bn bn-text" lang="bn">${escapeHtml(bnText)}</p>` : ""}
      `;

      row.querySelectorAll(".play-single-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const lang = btn.dataset.lang;
          const textToSpeak = lang === "bn" ? bnText : primaryText;
          hideAudioNotice();
          window.Class7Audio.speakText(textToSpeak, lang, {
            onStart: () => {
              clearSpeakingHighlights();
              row.classList.add("is-speaking");
            },
            onEnd: () => {
              row.classList.remove("is-speaking");
            },
            onNotice: showAudioNotice
          });
        });
      });

      list.appendChild(row);
    });

    return card;
  }

  function renderTopic() {
    if (window.Class7Audio) {
      window.Class7Audio.stop(clearSpeakingHighlights);
    }
    hideAudioNotice();

    const chapter = chapters[currentChapterIdx];
    const topic = chapter && chapter.topics ? chapter.topics[currentTopicIdx] : null;
    if (!topic || !elements.lessonMain) return;

    elements.lessonMain.innerHTML = "";
    elements.lessonMain.classList.toggle("bn-hidden", !showBangla);

    // 1. Topic Header Card
    const headerCard = document.createElement("section");
    headerCard.className = "content-card topic-header-card";
    headerCard.innerHTML = `
      <span class="speaker-tag">${escapeHtml(chapter.title)}</span>
      <h2>${escapeHtml(topic.title)}</h2>
      ${topic.subtitle ? `<p class="topic-subtitle">${escapeHtml(topic.subtitle)}</p>` : ""}
      ${topic.titleBn ? `<p class="topic-subtitle bn-text bn-block" lang="bn">${escapeHtml(topic.titleBn)}</p>` : ""}
    `;
    elements.lessonMain.appendChild(headerCard);

    // 2. Explanations (if present)
    if (Array.isArray(topic.explanations) && topic.explanations.length) {
      const expCard = document.createElement("section");
      expCard.className = "content-card";
      expCard.innerHTML = `
        <div class="content-card-header">
          <span aria-hidden="true">💡</span>
          <h2>Explanation</h2>
        </div>
        ${topic.explanations
          .map(
            (ex) => `
          <div style="margin-bottom:12px;">
            ${ex.heading ? `<h3 style="margin:0 0 6px; font-size:1rem;">${escapeHtml(ex.heading)}</h3>` : ""}
            ${ex.en || ex.text ? `<p style="margin:0 0 6px;">${escapeHtml(ex.en || ex.text)}</p>` : ""}
            ${ex.bn ? `<p class="bn-text bn-block" lang="bn" style="margin:0; color:#0f766e;">${escapeHtml(ex.bn)}</p>` : ""}
          </div>
        `
          )
          .join("")}
      `;
      elements.lessonMain.appendChild(expCard);
    }

    // 3. Definitions (Science / ICT / General)
    if (Array.isArray(topic.definitions) && topic.definitions.length) {
      const defCard = document.createElement("section");
      defCard.className = "content-card";
      defCard.innerHTML = `
        <div class="content-card-header">
          <span aria-hidden="true">📘</span>
          <h2>Key Definitions</h2>
        </div>
        ${topic.definitions
          .map(
            (def) => `
          <div class="definition-item">
            <strong>${escapeHtml(def.term)}</strong>
            ${def.en ? `<p style="margin:4px 0 0;">${escapeHtml(def.en)}</p>` : ""}
            ${def.bn ? `<p class="bn-text bn-block" lang="bn" style="margin:4px 0 0; color:#0f766e;">${escapeHtml(def.bn)}</p>` : ""}
          </div>
        `
          )
          .join("")}
      `;
      elements.lessonMain.appendChild(defCard);
    }

    // 4. Diagrams / Images
    const mediaList = topic.diagrams || topic.images;
    if (Array.isArray(mediaList) && mediaList.length) {
      const imgCard = document.createElement("section");
      imgCard.className = "content-card";
      imgCard.innerHTML = `
        <div class="content-card-header">
          <span aria-hidden="true">🖼️</span>
          <h2>Diagrams & Visuals</h2>
        </div>
        <div style="display:grid; gap:14px;">
          ${mediaList
            .map(
              (img) => `
            <figure class="diagram-figure">
              <img src="${escapeHtml(img.src)}" alt="${escapeHtml(img.alt || img.caption || "Lesson diagram")}" loading="lazy" />
              ${img.caption ? `<figcaption>${escapeHtml(img.caption)}</figcaption>` : ""}
              ${img.captionBn ? `<figcaption class="bn-text bn-block" lang="bn" style="color:#0f766e;">${escapeHtml(img.captionBn)}</figcaption>` : ""}
            </figure>
          `
            )
            .join("")}
        </div>
      `;
      elements.lessonMain.appendChild(imgCard);
    }

    // 5. Sentences / Dialogues / Stories (Audio-enabled)
    const sentencesCard = renderSentencesSection("Lesson Sentences", "🗣️", topic.sentences);
    if (sentencesCard) elements.lessonMain.appendChild(sentencesCard);

    const dialogueCard = renderSentencesSection("Dialogue", "💬", topic.dialogue);
    if (dialogueCard) elements.lessonMain.appendChild(dialogueCard);

    const storyCard = renderSentencesSection("Story / Reading", "📖", topic.story);
    if (storyCard) elements.lessonMain.appendChild(storyCard);

    // 6. Formulas (Mathematics / Science)
    if (Array.isArray(topic.formulas) && topic.formulas.length) {
      const formulaCard = document.createElement("section");
      formulaCard.className = "content-card";
      formulaCard.innerHTML = `
        <div class="content-card-header">
          <span aria-hidden="true">🧮</span>
          <h2>Formulas</h2>
        </div>
        ${topic.formulas
          .map(
            (f) => `
          <div class="formula-box">
            <strong>${escapeHtml(f.name)}</strong>
            <div class="formula-expression">${escapeHtml(f.expression)}</div>
            ${f.explanation ? `<p style="margin:4px 0 0; font-size:0.92rem;">${escapeHtml(f.explanation)}</p>` : ""}
            ${f.explanationBn ? `<p class="bn-text bn-block" lang="bn" style="margin:4px 0 0; color:#0f766e; font-size:0.92rem;">${escapeHtml(f.explanationBn)}</p>` : ""}
          </div>
        `
          )
          .join("")}
      `;
      elements.lessonMain.appendChild(formulaCard);
    }

    // 7. Worked Examples & Step-by-Step Solutions
    const examples = topic.examples || topic.stepByStepSolutions;
    if (Array.isArray(examples) && examples.length) {
      const exCard = document.createElement("section");
      exCard.className = "content-card";
      exCard.innerHTML = `
        <div class="content-card-header">
          <span aria-hidden="true">✏️</span>
          <h2>Worked Examples & Step-by-Step Solutions</h2>
        </div>
        ${examples
          .map(
            (ex, i) => `
          <div class="formula-box">
            <strong>Example ${i + 1}: ${escapeHtml(ex.problem || ex.title)}</strong>
            ${ex.problemBn ? `<p class="bn-text bn-block" lang="bn" style="margin:4px 0 0; color:#0f766e;">${escapeHtml(ex.problemBn)}</p>` : ""}
            ${
              Array.isArray(ex.steps)
                ? `<ol class="steps-list">${ex.steps.map((s) => `<li>${escapeHtml(s)}</li>`).join("")}</ol>`
                : ""
            }
            ${ex.answer ? `<p style="margin:10px 0 0; font-weight:800; color:#047857;">Answer: ${escapeHtml(ex.answer)}</p>` : ""}
          </div>
        `
          )
          .join("")}
      `;
      elements.lessonMain.appendChild(exCard);
    }

    // 8. Summary Section
    if (topic.summary) {
      const sumCard = document.createElement("section");
      sumCard.className = "content-card summary-box";
      const sumEn = typeof topic.summary === "string" ? topic.summary : topic.summary.en || "";
      const sumBn = typeof topic.summary === "object" ? topic.summary.bn || "" : "";
      sumCard.innerHTML = `
        <div class="content-card-header">
          <span aria-hidden="true">📝</span>
          <h2>Summary</h2>
        </div>
        ${sumEn ? `<p style="margin:0 0 6px;">${escapeHtml(sumEn)}</p>` : ""}
        ${sumBn ? `<p class="bn-text bn-block" lang="bn" style="margin:0; color:#0f766e;">${escapeHtml(sumBn)}</p>` : ""}
      `;
      elements.lessonMain.appendChild(sumCard);
    }

    // 9. Important Points Section
    if (Array.isArray(topic.importantPoints) && topic.importantPoints.length) {
      const ptsCard = document.createElement("section");
      ptsCard.className = "content-card";
      ptsCard.innerHTML = `
        <div class="content-card-header">
          <span aria-hidden="true">⭐</span>
          <h2>Important Points</h2>
        </div>
        <ul class="points-list">
          ${topic.importantPoints
            .map((pt) => {
              if (typeof pt === "string") return `<li>${escapeHtml(pt)}</li>`;
              return `<li>${escapeHtml(pt.en || "")}${pt.bn ? `<br><span class="bn-text bn-block" lang="bn" style="color:#0f766e;">${escapeHtml(pt.bn)}</span>` : ""}</li>`;
            })
            .join("")}
        </ul>
      `;
      elements.lessonMain.appendChild(ptsCard);
    }

    // 10. Questions & Answers
    if (Array.isArray(topic.qa) && topic.qa.length) {
      const qaCard = document.createElement("section");
      qaCard.className = "content-card";
      qaCard.innerHTML = `
        <div class="content-card-header">
          <span aria-hidden="true">❓</span>
          <h2>Questions & Answers</h2>
        </div>
        <div class="qa-list"></div>
      `;
      const qaList = qaCard.querySelector(".qa-list");
      topic.qa.forEach((item) => {
        const qaEl = document.createElement("div");
        qaEl.className = "qa-item";
        qaEl.innerHTML = `
          <p class="qa-question">${escapeHtml(item.question)}</p>
          ${item.questionBn ? `<p class="bn-text bn-block" lang="bn" style="margin:0 0 8px; color:#475569;">${escapeHtml(item.questionBn)}</p>` : ""}
          <button type="button" class="btn btn-secondary btn-sm qa-toggle-btn">Show Answer</button>
          <div class="qa-answer">
            <div>${escapeHtml(item.answer)}</div>
            ${item.answerBn ? `<div class="bn-text bn-block" lang="bn" style="margin-top:6px;">${escapeHtml(item.answerBn)}</div>` : ""}
          </div>
        `;
        const toggleBtn = qaEl.querySelector(".qa-toggle-btn");
        const answerBox = qaEl.querySelector(".qa-answer");
        toggleBtn.addEventListener("click", () => {
          const isOpen = answerBox.classList.toggle("is-open");
          toggleBtn.textContent = isOpen ? "Hide Answer" : "Show Answer";
        });
        qaList.appendChild(qaEl);
      });
      elements.lessonMain.appendChild(qaCard);
    }

    // 11. Practice Exercises
    if (Array.isArray(topic.practice) && topic.practice.length) {
      const prCard = document.createElement("section");
      prCard.className = "content-card";
      prCard.innerHTML = `
        <div class="content-card-header">
          <span aria-hidden="true">🎯</span>
          <h2>Practice Exercises</h2>
        </div>
        <div class="practice-list"></div>
      `;
      const prList = prCard.querySelector(".practice-list");
      topic.practice.forEach((q, qIdx) => {
        const qBox = document.createElement("div");
        qBox.className = "qa-item";
        qBox.innerHTML = `
          <p class="qa-question">${qIdx + 1}. ${escapeHtml(q.question)}</p>
          <div class="practice-options"></div>
          <div class="practice-feedback" aria-live="polite"></div>
        `;
        const optsContainer = qBox.querySelector(".practice-options");
        const feedback = qBox.querySelector(".practice-feedback");

        (q.options || []).forEach((optText, optIdx) => {
          const optBtn = document.createElement("button");
          optBtn.type = "button";
          optBtn.className = "btn btn-sm option-btn";
          optBtn.textContent = optText;
          optBtn.addEventListener("click", () => {
            optsContainer.querySelectorAll(".option-btn").forEach((b) => {
              b.classList.remove("is-correct", "is-wrong");
            });
            if (optIdx === q.correctIndex) {
              optBtn.classList.add("is-correct");
              feedback.style.color = "#047857";
              feedback.textContent = `✅ Correct! ${q.explanation || ""}`;
            } else {
              optBtn.classList.add("is-wrong");
              feedback.style.color = "#b91c1c";
              feedback.textContent = "❌ Try again!";
            }
          });
          optsContainer.appendChild(optBtn);
        });

        prList.appendChild(qBox);
      });
      elements.lessonMain.appendChild(prCard);
    }

    // Hide Play Full Lesson if there are no audio-capable sentences
    const hasAudioItems = Boolean(
      (topic.sentences && topic.sentences.length) ||
        (topic.dialogue && topic.dialogue.length) ||
        (topic.story && topic.story.length)
    );
    if (elements.playLessonBtn) {
      elements.playLessonBtn.style.display = hasAudioItems ? "inline-flex" : "none";
    }
    if (elements.stopAudioBtn) {
      elements.stopAudioBtn.style.display = hasAudioItems ? "inline-flex" : "none";
    }

    updateProgressAndNav();
  }

  // Event Listeners
  if (elements.chapterSelect) {
    elements.chapterSelect.addEventListener("change", (e) => {
      currentChapterIdx = parseInt(e.target.value, 10) || 0;
      currentTopicIdx = 0;
      populateTopics();
      renderTopic();
    });
  }

  if (elements.topicSelect) {
    elements.topicSelect.addEventListener("change", (e) => {
      currentTopicIdx = parseInt(e.target.value, 10) || 0;
      renderTopic();
    });
  }

  if (elements.toggleBnBtn) {
    elements.toggleBnBtn.addEventListener("click", () => {
      showBangla = !showBangla;
      elements.toggleBnBtn.textContent = showBangla ? "👁️ Hide Bangla" : "👁️ Show Bangla";
      if (elements.lessonMain) {
        elements.lessonMain.classList.toggle("bn-hidden", !showBangla);
      }
    });
  }

  if (elements.speedSelect) {
    elements.speedSelect.addEventListener("change", (e) => {
      if (window.Class7Audio) {
        window.Class7Audio.setRate(e.target.value);
      }
    });
  }

  if (elements.playLessonBtn) {
    elements.playLessonBtn.addEventListener("click", () => {
      hideAudioNotice();
      const sentenceNodes = Array.from(document.querySelectorAll(".sentence-item"));
      const queue = [];

      sentenceNodes.forEach((node) => {
        const enEl = node.querySelector(".sentence-en");
        const bnEl = node.querySelector(".sentence-bn");
        if (enEl && enEl.textContent.trim()) {
          queue.push({ text: enEl.textContent.trim(), lang: "en", node });
        } else if (bnEl && bnEl.textContent.trim()) {
          queue.push({ text: bnEl.textContent.trim(), lang: "bn", node });
        }
      });

      if (!queue.length) return;

      window.Class7Audio.playSequence(queue, {
        onItemStart: (_idx, item) => {
          clearSpeakingHighlights();
          item.node.classList.add("is-speaking");
          item.node.scrollIntoView({ behavior: "smooth", block: "center" });
        },
        onFinish: clearSpeakingHighlights,
        onNotice: showAudioNotice
      });
    });
  }

  if (elements.stopAudioBtn) {
    elements.stopAudioBtn.addEventListener("click", () => {
      if (window.Class7Audio) {
        window.Class7Audio.stop(clearSpeakingHighlights);
      }
    });
  }

  if (elements.prevTopicBtn) {
    elements.prevTopicBtn.addEventListener("click", () => {
      const flatIdx = getFlatIndex();
      if (flatIdx > 0) {
        const prev = flatTopics[flatIdx - 1];
        currentChapterIdx = prev.chapterIndex;
        currentTopicIdx = prev.topicIndex;
        populateChapters();
        populateTopics();
        renderTopic();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  }

  if (elements.nextTopicBtn) {
    elements.nextTopicBtn.addEventListener("click", () => {
      const flatIdx = getFlatIndex();
      if (flatIdx < flatTopics.length - 1) {
        const next = flatTopics[flatIdx + 1];
        currentChapterIdx = next.chapterIndex;
        currentTopicIdx = next.topicIndex;
        populateChapters();
        populateTopics();
        renderTopic();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  }

  // Initial render
  populateChapters();
  populateTopics();
  renderTopic();
})();

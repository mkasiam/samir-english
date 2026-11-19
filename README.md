# Class 7 Complete Learning Platform (Bangladesh)

A mobile-first, static educational website for Class 7 students in Bangladesh, built with **HTML5**, **CSS3**, and **Vanilla JavaScript** for zero-backend hosting on **GitHub Pages**.

## Folder Structure

```text
CLASS-7-LEARNING/
├── index.html                          # Homepage displaying all subject cards
├── README.md                           # Documentation & maintenance guide
├── assets/
│   ├── css/
│   │   └── style.css                   # Shared mobile-first design system
│   ├── js/
│   │   ├── subjects.js                 # Editable subject registry
│   │   ├── home.js                     # Homepage card renderer & filter logic
│   │   ├── subject.js                  # Reusable subject page learning engine
│   │   └── audio.js                    # Web Speech API (EN & BN) audio controller
│   └── images/                         # Shared diagrams & visual assets
└── subjects/
    ├── english-1st/
    ├── english-2nd/
    ├── bangla-1st/
    ├── bangla-2nd/
    ├── mathematics/
    ├── science/
    ├── bangladesh-global-studies/
    ├── ict/
    └── religion/
```

## How to Add a New Subject

Adding a new subject requires only **3 simple steps** without modifying the homepage HTML or CSS:

1. **Create the subject folder** under `subjects/`, for example `subjects/arts-crafts/`, and copy `index.html` from any existing subject folder (e.g., `subjects/mathematics/index.html`) into it.
2. **Create `content.js`** inside the new folder defining `window.SUBJECT_CONTENT` (see Content Structure below).
3. **Register the subject** in `assets/js/subjects.js` by adding an entry to `window.CLASS7_SUBJECTS`:

```javascript
{
  id: "arts-crafts",
  name: "Arts and Crafts",
  nameBn: "চারু ও কারুকলা",
  icon: "🎨",
  description: "Drawing, painting, and creative craft lessons.",
  path: "subjects/arts-crafts/index.html",
  status: "Available", // or "Coming Soon"
  accentColor: "#ec4899",
  bgTint: "#fdf2f8"
}
```

## Integrating Existing English First Paper Content

`subjects/english-1st/` is set up as an `Available` module. You can either:
- Populate `subjects/english-1st/content.js` using the `window.SUBJECT_CONTENT` schema, **or**
- Drop your existing `english-1st` HTML/JS/CSS files directly into `subjects/english-1st/` while keeping the relative link back to `../../index.html`.

## Content Structure (`content.js`)

`assets/js/subject.js` automatically renders only the sections present in a topic:

- `sentences`, `dialogue`, `story`: Array of `{ speaker?, en?, bn?, text? }` (supports individual & full-lesson audio + Bangla toggle)
- `explanations`: Array of `{ heading?, en?, bn?, text? }`
- `definitions`: Array of `{ term, en?, bn? }`
- `diagrams` / `images`: Array of `{ src, alt, caption?, captionBn? }`
- `formulas`: Array of `{ name, expression, explanation?, explanationBn? }`
- `examples` / `stepByStepSolutions`: Array of `{ problem, problemBn?, steps[], answer? }`
- `summary`: `{ en?, bn? }` or string
- `importantPoints`: Array of `{ en?, bn? }` or string
- `qa`: Array of `{ question, questionBn?, answer, answerBn? }`
- `practice`: Array of `{ question, options[], correctIndex, explanation? }`

## Deploying on GitHub Pages

1. Push the contents of `CLASS-7-LEARNING/` to a GitHub repository.
2. Open **Settings → Pages** in your GitHub repository.
3. Select the branch (e.g. `main`) and root folder (`/`) and save.
4. All links use relative paths, so the site works at both root domains and repository subpaths.

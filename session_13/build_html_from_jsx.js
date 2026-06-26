/*
 * Build self-contained HTML from session_13 quiz/practice JSX (no CDN at view time).
 * Usage: node build_html_from_jsx.js
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const SESSION_URL = '/CCI.io/session-13/';

function loadBabel() {
  const candidates = [
    path.join(ROOT, 'vendor', 'babel.min.js'),
    '/tmp/babel.min.js',
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) {
      const mod = require(p);
      return mod && mod.transform ? mod : globalThis.Babel;
    }
  }
  throw new Error('Babel standalone not found in session_13/vendor/babel.min.js');
}

const QUIZ_STYLE = `
    body { margin: 0; padding: 20px; font-family: system-ui, -apple-system, sans-serif; background: #f8f9fa; }
    .back-link { display: inline-flex; align-items: center; gap: 0.3rem; font-size: 0.8rem; font-weight: 600; color: #1565C0; text-decoration: none; padding: 0.35rem 0.65rem; border-radius: 0.4rem; border: 1px solid #90CAF9; background: #E3F2FD; margin-bottom: 1rem; }
    .back-link:hover { background: #BBDEFB; }`;

const PRACTICE_STYLE = `
    body { margin: 0; padding: 20px; font-family: system-ui, -apple-system, sans-serif; background: #f8f9fa; }
    .back-link { display: inline-flex; align-items: center; gap: 0.3rem; font-size: 0.8rem; font-weight: 600; color: #0D47A1; text-decoration: none; padding: 0.35rem 0.65rem; border-radius: 0.4rem; border: 1px solid #64B5F6; background: #E1F5FE; margin-bottom: 1rem; }
    .back-link:hover { background: #B3E5FC; }`;

const TITLES = {
  quiz_lesson1_ethical_guidelines_hai_2024: 'Quiz: Ethical Guidelines for Healthcare AI (2024)',
  quiz_lesson2_mlops_clinical_deployment: 'Quiz: MLOps in Clinical Practice',
  practice_lesson1_ethical_guidelines_hai_2024: 'Practice: Which Pillar Breaks First?',
  practice_lesson2_mlops_clinical_deployment: 'Practice: Order the MLOps Lifecycle',
};

function titleCase(stem) {
  return stem.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function normalizeJsx(source) {
  let body = source.trim();
  body = body.replace(/^import\s+React.*?;\s*$/m, '');
  body = body.replace(/^import\s+\{[^}]*\}\s+from\s+["']react["'];\s*$/m, '');
  body = body.replace(/export\s+default\s+function\s+\w+\s*\(\s*\)\s*\{/, 'function App() {');
  return body.trim();
}

function wrapHtml(kind, stem, compiledJs) {
  const title = TITLES[stem] || titleCase(stem);
  const style = kind === 'quiz' ? QUIZ_STYLE : PRACTICE_STYLE;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <script src="../vendor/react.production.min.js"></script>
  <script src="../vendor/react-dom.production.min.js"></script>
  <style>${style}</style>
</head>
<body>
  <a class="back-link" href="${SESSION_URL}">&#8249; Back to Session 13</a>
  <div id="root"></div>
  <script>
    (function () {
      var useState = React.useState;
${compiledJs}
      var root = ReactDOM.createRoot(document.getElementById('root'));
      root.render(React.createElement(App));
    })();
  </script>
</body>
</html>
`;
}

function buildFolder(Babel, folder, kind) {
  const srcDir = path.join(ROOT, folder);
  const files = fs.readdirSync(srcDir).filter((f) => f.endsWith('.jsx')).sort();
  let count = 0;
  for (const file of files) {
    const stem = file.replace(/\.jsx$/, '');
    const jsx = fs.readFileSync(path.join(srcDir, file), 'utf8');
    const normalized = normalizeJsx(jsx);
    const out = Babel.transform(normalized, {
      presets: [['react', { runtime: 'classic' }]],
      sourceType: 'script',
    }).code;
    if (/\brequire\s*\(/.test(out) || /^\s*import\s/m.test(out)) {
      throw new Error(`${stem}: compiled output still contains require()/import`);
    }
    const indented = out.split('\n').map((l) => (l ? '      ' + l : l)).join('\n');
    fs.writeFileSync(path.join(srcDir, stem + '.html'), wrapHtml(kind, stem, indented), 'utf8');
    console.log('Wrote ' + stem + '.html');
    count += 1;
  }
  return count;
}

function main() {
  const Babel = loadBabel();
  if (!Babel || !Babel.transform) throw new Error('Babel failed to load.');
  const q = buildFolder(Babel, 'quizzes', 'quiz');
  const p = buildFolder(Babel, 'practices', 'practice');
  console.log(`Done: ${q} quizzes, ${p} practices.`);
}

main();

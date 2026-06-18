/*
 * Build SELF-CONTAINED HTML pages from session_12 quiz/practice JSX files.
 *
 * Why this exists (and replaces the old build_html_from_jsx.py):
 *   The earlier pages loaded React + Babel from unpkg.com and ran an in-browser
 *   Babel transform (eval) at view time. On locked-down networks (e.g. the KHCC
 *   hospital network) third-party CDNs and eval-based scripts are commonly
 *   blocked, which left the React root empty -> "blank page".
 *
 * This builder removes BOTH runtime dependencies:
 *   - React + ReactDOM are vendored locally under session_12/vendor/ and loaded
 *     with a relative path (../vendor/...), so no third-party CDN is contacted.
 *   - The JSX is pre-compiled to plain React.createElement(...) JS HERE, at build
 *     time, so the browser runs ordinary JavaScript (no Babel, no eval).
 *
 * Usage:  node build_html_from_jsx.js
 * Requires Babel standalone available locally as ./vendor/babel.min.js
 *   (download once: curl -sSL https://unpkg.com/@babel/standalone/babel.min.js
 *                        -o vendor/babel.min.js  — it is a BUILD tool only and
 *    is never shipped to the browser).
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const SESSION_URL = '/CCI.io/session-12/';

// Babel is a build-time dependency only. Prefer a vendored copy; fall back to
// a sibling /tmp copy if present so the script still runs in CI scratch dirs.
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
  throw new Error(
    'Babel standalone not found. Run:\n' +
    '  curl -sSL https://unpkg.com/@babel/standalone/babel.min.js -o ' +
    path.join(ROOT, 'vendor', 'babel.min.js')
  );
}

const QUIZ_STYLE = `
    body { margin: 0; padding: 20px; font-family: system-ui, -apple-system, sans-serif; background: #f8f9fa; }
    .back-link { display: inline-flex; align-items: center; gap: 0.3rem; font-size: 0.8rem; font-weight: 600; color: #AD1457; text-decoration: none; padding: 0.35rem 0.65rem; border-radius: 0.4rem; border: 1px solid #F8BBD0; background: #FCE4EC; margin-bottom: 1rem; }
    .back-link:hover { background: #F8BBD0; }`;

const PRACTICE_STYLE = `
    body { margin: 0; padding: 20px; font-family: system-ui, -apple-system, sans-serif; background: #f8f9fa; }
    .back-link { display: inline-flex; align-items: center; gap: 0.3rem; font-size: 0.8rem; font-weight: 600; color: #6A1B9A; text-decoration: none; padding: 0.35rem 0.65rem; border-radius: 0.4rem; border: 1px solid #CE93D8; background: #F3E5F5; margin-bottom: 1rem; }
    .back-link:hover { background: #E1BEE7; }`;

const TITLES = {
  quiz_lesson1_what_is_a_network: 'Quiz: What Is a Network?',
  quiz_lesson2_encryption_basics: 'Quiz: Encryption, Plainly',
  quiz_lesson3_encryption_types: 'Quiz: Two Kinds of Keys',
  quiz_lesson4_how_attacks_work: 'Quiz: How Attacks Actually Work',
  quiz_lesson5_passwords_and_mfa: 'Quiz: Passwords, MFA & Least Privilege',
  quiz_lesson6_canary_tokens: 'Quiz: Canary Tokens',
  quiz_lesson7_phi_and_hipaa: 'Quiz: PHI and HIPAA',
  quiz_lesson8_synthetic_data_pipeline: 'Quiz: The Synthetic-Data Pipeline',
  quiz_lesson9_cloud_hardened_azure: 'Quiz: The Cloud, Hardened',
  practice_lesson1_what_is_a_network: 'Practice: Open to the Street, or Shut?',
  practice_lesson2_encryption_basics: 'Practice: Postcard or Sealed Envelope?',
  practice_lesson3_encryption_types: 'Practice: At Rest or In Transit?',
  practice_lesson4_how_attacks_work: 'Practice: Order the Ransomware Chain',
  practice_lesson5_passwords_and_mfa: 'Practice: Passphrase Strength + Would MFA Stop It?',
  practice_lesson6_canary_tokens: 'Practice: Canary Tokens — Good Practice or Mistake?',
  practice_lesson7_phi_and_hipaa: 'Practice: Spot the PHI',
  practice_lesson8_synthetic_data_pipeline: 'Practice: Build a Safe Record',
  practice_lesson9_cloud_hardened_azure: 'Practice: Sequence the Azure Commands + Audit the NSG',
};

function titleCase(stem) {
  return stem.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

// Strip the React import and rename the default-exported component to App so the
// transpiled output can be dropped straight into a plain <script>.
function normalizeJsx(source) {
  let body = source.trim();
  body = body.replace(/^import\s+React.*?;\s*$/m, '');
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
  <!-- React vendored locally — no third-party CDN, works on locked-down networks -->
  <script src="../vendor/react.production.min.js"></script>
  <script src="../vendor/react-dom.production.min.js"></script>
  <style>${style}</style>
</head>
<body>
  <a class="back-link" href="${SESSION_URL}">&#8249; Back to Session 12</a>
  <div id="root"></div>
  <!-- Pre-compiled at build time: plain JS, no Babel/eval at view time -->
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
      presets: ['react'],
      // keep it as a script we can inline; no module wrapping
      sourceType: 'script',
    }).code;
    // indent the compiled body two spaces for readability inside the IIFE
    const indented = out.split('\n').map((l) => (l ? '      ' + l : l)).join('\n');
    const html = wrapHtml(kind, stem, indented);
    fs.writeFileSync(path.join(srcDir, stem + '.html'), html, 'utf8');
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
  console.log(`Done: ${q} quizzes, ${p} practices (self-contained, no CDN/Babel at runtime).`);
}

main();

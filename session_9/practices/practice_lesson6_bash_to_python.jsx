import React, { useState } from 'react';

const challenges = [
  {
    bash: "mkdir -p archive/2026-03-15",
    description: "Create a folder, including any missing parent folders. Don't error if it already exists.",
    options: [
      { code: "Path('archive/2026-03-15').mkdir()", correct: false, reason: "Fails if archive/ doesn't exist, and errors if the folder already exists." },
      { code: "Path('archive/2026-03-15').mkdir(parents=True, exist_ok=True)", correct: true, reason: "parents=True creates archive/, exist_ok=True makes it idempotent." },
      { code: "os.mkdir('archive/2026-03-15')", correct: false, reason: "os.mkdir only creates the deepest folder, fails if archive/ doesn't exist." },
      { code: "shutil.copytree('.', 'archive/2026-03-15')", correct: false, reason: "copytree clones a tree of files, not what we want." }
    ]
  },
  {
    bash: "find . -name '*.csv'",
    description: "Find all CSV files recursively from the current directory.",
    options: [
      { code: "Path('.').glob('*.csv')", correct: false, reason: "glob is one level only — won't find files in subfolders." },
      { code: "Path('.').rglob('*.csv')", correct: true, reason: "rglob walks recursively. Equivalent to find -name." },
      { code: "os.listdir('.', recursive=True)", correct: false, reason: "os.listdir has no recursive option — it's flat only." },
      { code: "subprocess.run(['find', '.', '-name', '*.csv'])", correct: false, reason: "Calls bash find — won't work on Windows. The whole point is cross-platform." }
    ]
  },
  {
    bash: "cp -p source.csv backup/source.csv",
    description: "Copy a file, preserving modification time (important for audit trails).",
    options: [
      { code: "shutil.copy('source.csv', 'backup/source.csv')", correct: false, reason: "copy doesn't preserve metadata — use copy2 instead." },
      { code: "shutil.copy2('source.csv', 'backup/source.csv')", correct: true, reason: "copy2 preserves modification time and other metadata — matches cp -p." },
      { code: "shutil.copytree('source.csv', 'backup/source.csv')", correct: false, reason: "copytree is for directories, not files." },
      { code: "Path('source.csv').rename('backup/source.csv')", correct: false, reason: "rename MOVES the file (doesn't copy)." }
    ]
  },
  {
    bash: "rm -rf temp/",
    description: "Recursively delete a folder and everything in it.",
    options: [
      { code: "os.rmdir('temp')", correct: false, reason: "rmdir only removes EMPTY directories — fails if temp/ has files." },
      { code: "Path('temp').unlink()", correct: false, reason: "unlink is for files, not directories." },
      { code: "shutil.rmtree('temp')", correct: true, reason: "rmtree recursively deletes a directory tree. ⚠️ NO recycle bin — be sure!" },
      { code: "shutil.remove('temp')", correct: false, reason: "shutil.remove doesn't exist." }
    ]
  },
  {
    bash: "tar -czf backup.tar.gz data/",
    description: "Compress an entire folder into a single archive file.",
    options: [
      { code: "shutil.make_archive('backup', 'gztar', 'data')", correct: true, reason: "make_archive packages a folder. Format options: 'zip', 'tar', 'gztar', 'bztar'." },
      { code: "subprocess.run(['tar', '-czf', 'backup.tar.gz', 'data'])", correct: false, reason: "Works on Linux/Mac but tar isn't standard on Windows. shutil.make_archive is cross-platform." },
      { code: "shutil.copytree('data', 'backup.tar.gz')", correct: false, reason: "copytree doesn't compress — it just clones the tree." },
      { code: "Path('data').compress('backup.tar.gz')", correct: false, reason: "Path doesn't have a compress method." }
    ]
  },
  {
    bash: "git status",
    description: "Call git from inside a Python script and capture its output.",
    options: [
      { code: "subprocess.run('git status', shell=True)", correct: false, reason: "shell=True is a security risk and not needed here. Also doesn't capture output." },
      { code: "subprocess.run(['git', 'status'], capture_output=True, text=True)", correct: true, reason: "Args as list (safe), capture_output=True to read stdout, text=True for strings instead of bytes." },
      { code: "os.system('git status')", correct: false, reason: "os.system is the old way — doesn't capture output, returns only the exit code." },
      { code: "Path('.git').run('status')", correct: false, reason: "Path doesn't run commands." }
    ]
  }
];

export default function Practice() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const c = challenges[current];

  const handleSubmit = () => {
    setSubmitted(true);
    if (c.options[selected]?.correct) setScore(s => s + 1);
  };

  const next = () => {
    setCurrent(cc => cc + 1);
    setSelected(null);
    setSubmitted(false);
  };

  if (current >= challenges.length) {
    return (
      <div style={{ maxWidth: 750, margin: '40px auto', fontFamily: 'system-ui', textAlign: 'center' }}>
        <h2>Bash-to-Python Practice Complete!</h2>
        <p style={{ fontSize: 20 }}>Score: {score} / {challenges.length}</p>
        <div style={{ background: score >= 5 ? '#d4edda' : score >= 3 ? '#fff3cd' : '#f8d7da', padding: 20, borderRadius: 8 }}>
          {score >= 5 ? "Excellent — your clinical scripts will run anywhere." : score >= 3 ? "Good — review shutil.copy2 vs shutil.copy, and subprocess.run safety." : "Review the lesson and the cheat sheet before writing production scripts."}
        </div>
        <button onClick={() => { setCurrent(0); setScore(0); setSelected(null); setSubmitted(false); }} style={{ marginTop: 16, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#0d6efd', color: '#fff', cursor: 'pointer' }}>Try Again</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 750, margin: '40px auto', fontFamily: 'system-ui' }}>
      <div style={{ background: '#e9ecef', borderRadius: 8, height: 8, marginBottom: 20 }}>
        <div style={{ background: '#0d6efd', borderRadius: 8, height: 8, width: `${((current + 1) / challenges.length) * 100}%`, transition: 'width 0.3s' }} />
      </div>
      <p style={{ color: '#666', marginBottom: 4 }}>Challenge {current + 1} of {challenges.length}</p>

      <h3 style={{ marginBottom: 8 }}>Bash command:</h3>
      <pre style={{ background: '#1e1e1e', color: '#a3e635', padding: 12, borderRadius: 6, fontSize: 14, fontFamily: 'monospace' }}>{c.bash}</pre>

      <p style={{ background: '#f8f9fa', padding: 12, borderRadius: 6, marginTop: 12 }}>{c.description}</p>

      <h4 style={{ marginTop: 16 }}>Pick the cross-platform Python equivalent:</h4>
      {c.options.map((opt, i) => (
        <div key={i} onClick={() => !submitted && setSelected(i)} style={{
          padding: 12, margin: '8px 0', borderRadius: 8, cursor: submitted ? 'default' : 'pointer',
          border: `2px solid ${submitted ? (opt.correct ? '#198754' : i === selected ? '#dc3545' : '#dee2e6') : i === selected ? '#0d6efd' : '#dee2e6'}`,
          background: submitted ? (opt.correct ? '#d4edda' : i === selected && !opt.correct ? '#f8d7da' : '#fff') : '#fff'
        }}>
          <pre style={{ margin: 0, fontFamily: 'monospace', fontSize: 13, whiteSpace: 'pre-wrap' }}>{opt.code}</pre>
          {submitted && (
            <p style={{ marginTop: 8, marginBottom: 0, fontSize: 13, color: opt.correct ? '#198754' : '#666' }}>
              <strong>{opt.correct ? '✅' : (i === selected ? '❌' : '○')}</strong> {opt.reason}
            </p>
          )}
        </div>
      ))}

      {!submitted && selected !== null && (
        <button onClick={handleSubmit} style={{ marginTop: 12, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#198754', color: '#fff', cursor: 'pointer' }}>Check Answer</button>
      )}

      {submitted && (
        <button onClick={next} style={{ marginTop: 12, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#0d6efd', color: '#fff', cursor: 'pointer' }}>{current + 1 < challenges.length ? 'Next Challenge' : 'See Results'}</button>
      )}
    </div>
  );
}

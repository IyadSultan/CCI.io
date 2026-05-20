import React, { useState } from 'react';

const scenarios = [
  {
    label: "OPENAI_API_KEY = 'sk-...' hardcoded in app.py",
    safe: false,
    reason: "Hardcoded keys end up in the public Space repo — anyone can read them. Use Settings → Variables and secrets and read with os.getenv()."
  },
  {
    label: "OPENAI_API_KEY added in Settings → Variables and secrets",
    safe: true,
    reason: "HF injects this as an environment variable at runtime. Never visible in the repo, build logs, or public URL. This is the correct pattern."
  },
  {
    label: "Real patient names in seed_data.csv committed to the Space repo",
    safe: false,
    reason: "Spaces are PUBLIC. Patient names — even just for 'sample' data — are PHI and must never be on a public Space. Use synthetic data with no resemblance to real patients."
  },
  {
    label: "drugs.db generated at startup by init_db.py with five textbook drug names",
    safe: true,
    reason: "Public drug names from medical textbooks are not sensitive. Auto-init at startup is the correct pattern because drugs.db is .gitignored and not in the repo."
  },
  {
    label: "Connecting the Space to a KHCC internal database via VPN credentials in code",
    safe: false,
    reason: "Internal hospital databases must NEVER be accessible from public infrastructure. Even with the credentials in Variables, exposing a clinical database endpoint to a public app is an unacceptable risk."
  },
  {
    label: "Public README.md describing the CrCl formula and listing the seeded drugs",
    safe: true,
    reason: "The formula is public textbook content. The drug list is public knowledge. Documenting them in the README is fine and actually helpful — readers know what the app does and trust the calculation."
  }
];

export default function Practice() {
  const [choices, setChoices] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const choose = (i, val) => { if (!submitted) setChoices({ ...choices, [i]: val }); };

  const check = () => setSubmitted(true);
  const reset = () => { setChoices({}); setSubmitted(false); };

  const score = scenarios.filter((s, i) => choices[i] === s.safe).length;

  return (
    <div style={{ maxWidth: 760, margin: '40px auto', fontFamily: 'system-ui' }}>
      <h3>Deployment Sanity Check</h3>
      <p style={{ background: '#f8f9fa', padding: 16, borderRadius: 8, lineHeight: 1.6 }}>
        For each scenario, decide: <strong>Safe to deploy</strong> (the right pattern) or <strong>Unsafe to deploy</strong> (don't do this on a public Space)?
      </p>

      {scenarios.map((s, i) => {
        const userChoice = choices[i];
        const correct = submitted && userChoice === s.safe;
        const wrong = submitted && userChoice !== undefined && userChoice !== s.safe;
        return (
          <div key={i} style={{
            padding: '12px 16px', margin: '8px 0', borderRadius: 8,
            border: `2px solid ${correct ? '#198754' : wrong ? '#dc3545' : '#dee2e6'}`,
            background: correct ? '#d4edda' : wrong ? '#f8d7da' : '#fff'
          }}>
            <p style={{ margin: '0 0 8px 0', fontWeight: 'bold' }}>{s.label}</p>
            <button onClick={() => choose(i, true)} disabled={submitted} style={{
              marginRight: 8, padding: '6px 14px', borderRadius: 6, cursor: submitted ? 'default' : 'pointer',
              border: `2px solid ${userChoice === true ? '#198754' : '#ccc'}`,
              background: userChoice === true ? '#198754' : '#fff', color: userChoice === true ? '#fff' : '#000'
            }}>Safe</button>
            <button onClick={() => choose(i, false)} disabled={submitted} style={{
              padding: '6px 14px', borderRadius: 6, cursor: submitted ? 'default' : 'pointer',
              border: `2px solid ${userChoice === false ? '#dc3545' : '#ccc'}`,
              background: userChoice === false ? '#dc3545' : '#fff', color: userChoice === false ? '#fff' : '#000'
            }}>Unsafe</button>
            {submitted && (
              <p style={{ marginTop: 8, marginBottom: 0, fontSize: 14 }}>
                <strong>{s.safe ? "Safe." : "Unsafe."}</strong> {s.reason}
              </p>
            )}
          </div>
        );
      })}

      {!submitted && (
        <button onClick={check} disabled={Object.keys(choices).length < scenarios.length} style={{
          marginTop: 16, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#198754', color: '#fff',
          cursor: 'pointer', opacity: Object.keys(choices).length < scenarios.length ? 0.5 : 1
        }}>Check My Choices ({Object.keys(choices).length}/{scenarios.length})</button>
      )}

      {submitted && (
        <div style={{ marginTop: 16, padding: 16, background: '#f0f4ff', borderRadius: 8, borderLeft: '4px solid #0d6efd' }}>
          <p><strong>Score: {score} / {scenarios.length}</strong></p>
          <p>{score === scenarios.length ? "Perfect — you have the public-infrastructure mindset." : score >= 4 ? "Good — but review the misses. Each unsafe call is how patient data leaks." : "Review the lesson. Public Spaces are powerful AND risky."}</p>
          <button onClick={reset} style={{ marginTop: 12, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#0d6efd', color: '#fff', cursor: 'pointer' }}>Try Again</button>
        </div>
      )}
    </div>
  );
}

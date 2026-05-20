import React, { useState } from 'react';

const slots = [
  {
    id: 'formula',
    prompt: "The Cockcroft-Gault formula for males. CrCl = ?",
    options: [
      "((140 - age) * weight) / (72 * creatinine)",
      "(age * weight) / (72 * creatinine)",
      "(140 + age) * weight / creatinine",
      "weight / (age * creatinine)"
    ],
    correct: "((140 - age) * weight) / (72 * creatinine)"
  },
  {
    id: 'female',
    prompt: "After computing CrCl, if sex == 'female', multiply by what?",
    options: ["0.85", "1.15", "0.5", "no adjustment"],
    correct: "0.85"
  },
  {
    id: 'sql',
    prompt: "SQL to find drugs whose threshold is above the patient's CrCl (so they should be flagged):",
    options: [
      "cursor.execute(\"SELECT name FROM drugs WHERE threshold > ?\", (crcl,))",
      "cursor.execute(f\"SELECT name FROM drugs WHERE threshold > {crcl}\")",
      "cursor.execute(\"SELECT name FROM drugs\")",
      "cursor.execute(\"DROP TABLE drugs\")"
    ],
    correct: "cursor.execute(\"SELECT name FROM drugs WHERE threshold > ?\", (crcl,))"
  }
];

const testCase = { age: 65, weight: 70, creatinine: 1.8, sex: 'female' };

function computeExpected(choices) {
  if (choices.formula !== "((140 - age) * weight) / (72 * creatinine)") return null;
  let crcl = ((140 - testCase.age) * testCase.weight) / (72 * testCase.creatinine);
  if (testCase.sex === 'female') {
    if (choices.female === '0.85') crcl *= 0.85;
    else if (choices.female === '1.15') crcl *= 1.15;
    else if (choices.female === '0.5') crcl *= 0.5;
  }
  return crcl;
}

export default function Practice() {
  const [choices, setChoices] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const set = (id, val) => { if (!submitted) setChoices({ ...choices, [id]: val }); };

  const check = () => setSubmitted(true);
  const reset = () => { setChoices({}); setSubmitted(false); };

  const allCorrect = slots.every(s => choices[s.id] === s.correct);
  const expected = computeExpected(choices);
  const expectedTarget = 28.3; // ((140-65)*70)/(72*1.8) * 0.85

  return (
    <div style={{ maxWidth: 760, margin: '40px auto', fontFamily: 'system-ui' }}>
      <h3>Build the CrCl Logic</h3>
      <p style={{ background: '#f8f9fa', padding: 16, borderRadius: 8, lineHeight: 1.6 }}>
        Fill in the three missing pieces of the <code>calculate_crcl</code> function. Then we'll run it on the test case <strong>age=65, weight=70 kg, creatinine=1.8 mg/dL, female</strong> and check the answer.
      </p>

      <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: 16, borderRadius: 8, fontSize: 13, overflow: 'auto' }}>
{`def calculate_crcl(age, weight, creatinine, sex):
    # 1. Compute CrCl using Cockcroft-Gault:
    crcl = ${choices.formula || '...'}

    # 2. Apply female correction factor:
    if sex == 'female':
        crcl = crcl * ${choices.female || '...'}

    # 3. Query nephrotoxic drugs whose threshold exceeds this CrCl:
    conn = sqlite3.connect('drugs.db')
    cursor = conn.cursor()
    ${choices.sql || '# SQL here'}
    flagged = [row[0] for row in cursor.fetchall()]
    conn.close()

    return f"CrCl: {crcl:.1f} mL/min. Flagged: {', '.join(flagged) or 'none'}"`}
      </pre>

      {slots.map(s => (
        <div key={s.id} style={{ marginTop: 16 }}>
          <p style={{ fontWeight: 'bold', marginBottom: 8 }}>{s.prompt}</p>
          {s.options.map((opt, i) => {
            const isChosen = choices[s.id] === opt;
            const isRight = submitted && opt === s.correct;
            const isWrong = submitted && isChosen && opt !== s.correct;
            return (
              <div key={i} onClick={() => set(s.id, opt)} style={{
                padding: '10px 14px', margin: '6px 0', borderRadius: 8, cursor: submitted ? 'default' : 'pointer',
                border: `2px solid ${isRight ? '#198754' : isWrong ? '#dc3545' : isChosen ? '#0d6efd' : '#dee2e6'}`,
                background: isRight ? '#d4edda' : isWrong ? '#f8d7da' : '#fff',
                fontFamily: 'monospace', fontSize: 13
              }}>{opt}</div>
            );
          })}
        </div>
      ))}

      {!submitted && (
        <button onClick={check} disabled={Object.keys(choices).length < slots.length} style={{
          marginTop: 16, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#198754', color: '#fff',
          cursor: 'pointer', opacity: Object.keys(choices).length < slots.length ? 0.5 : 1
        }}>Check My Code</button>
      )}

      {submitted && (
        <div style={{ marginTop: 16, padding: 16, background: '#f0f4ff', borderRadius: 8, borderLeft: '4px solid #0d6efd' }}>
          <p><strong>Test case:</strong> age=65, weight=70 kg, creatinine=1.8, female</p>
          {expected !== null ? (
            <p>Your formula produces CrCl ≈ <strong>{expected.toFixed(1)} mL/min</strong>. Expected: ~{expectedTarget} mL/min.</p>
          ) : (
            <p style={{ color: '#dc3545' }}>Your formula is wrong — can't compute a sensible CrCl.</p>
          )}
          {allCorrect ? (
            <p style={{ color: '#198754', fontWeight: 'bold' }}>All three pieces correct. With CrCl ≈ 28 mL/min, all five drugs (vancomycin, gentamicin, NSAIDs, contrast media, metformin) would be flagged.</p>
          ) : (
            <p style={{ color: '#dc3545' }}>One or more pieces are wrong. Review the lesson and try again.</p>
          )}
          <button onClick={reset} style={{ marginTop: 12, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#0d6efd', color: '#fff', cursor: 'pointer' }}>Try Again</button>
        </div>
      )}
    </div>
  );
}

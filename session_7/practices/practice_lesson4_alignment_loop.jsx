import React, { useState } from 'react';

const CASES = [
  {
    id: 'c1',
    input: "8-year-old with stage III favorable-histology Wilms tumor.",
    output: "Stage III FH Wilms tumor. Recommend vincristine, actinomycin-D, and doxorubicin with flank radiotherapy per standard protocol.",
    humanLabel: 'correct',
    judgeLabel: 'correct',
    agree: true,
    note: "Both agree: clinically accurate. No action needed."
  },
  {
    id: 'c2',
    input: "10-year-old with newly-diagnosed Wilms tumor, anaplastic histology, stage II.",
    output: "10-year-old with stage II favorable-histology Wilms tumor. Recommend vincristine and actinomycin-D for 18 weeks.",
    humanLabel: 'incorrect_harmful',
    judgeLabel: 'correct',
    agree: false,
    note: "DISAGREEMENT. Human catches that the model misread anaplastic as favorable — a critical clinical error. Judge gave it a pass. Diagnosis: judge is not reading the input carefully against the output. Fix: add a few-shot example where input mentions histology and output mismatches it; instruct the judge to explicitly verify input-output histology consistency."
  },
  {
    id: 'c3',
    input: "5-year-old with stage I favorable-histology Wilms tumor, post-nephrectomy.",
    output: "5-year-old, Wilms tumor, post-op. Treat with chemo.",
    humanLabel: 'partial',
    judgeLabel: 'correct',
    agree: false,
    note: "DISAGREEMENT. Human flags that the summary is too vague to be clinically useful (no stage, no histology, no specific regimen). Judge accepts it as 'correct'. Diagnosis: judge is too lenient on incompleteness. Fix: add few-shot examples of incomplete-but-not-wrong outputs labeled 'partial'; explicitly instruct the judge to penalize summaries that omit stage, histology, or specific regimen."
  },
  {
    id: 'c4',
    input: "3-year-old with bilateral Wilms tumor.",
    output: "3-year-old with bilateral (Stage V) favorable-histology Wilms tumor. Recommend pre-operative chemotherapy with vincristine and actinomycin-D, followed by nephron-sparing surgery. Coordinate with pediatric urology and nephrology.",
    humanLabel: 'correct',
    judgeLabel: 'correct',
    agree: true,
    note: "Both agree: clinically accurate, complete, includes appropriate coordination. No action needed."
  },
  {
    id: 'c5',
    input: "12-year-old with stage III FH Wilms tumor and pre-existing renal impairment (eGFR 70).",
    output: "Stage III FH Wilms tumor. Recommend vincristine, actinomycin-D, and doxorubicin with flank radiotherapy. Cisplatin 100 mg/m² every 3 weeks for renal protection.",
    humanLabel: 'incorrect_harmful',
    judgeLabel: 'partial',
    agree: false,
    note: "DISAGREEMENT. Human flags this as 'incorrect-and-harmful' because the output recommends cisplatin (NOT in the standard regimen and actively NEPHROTOXIC). Judge marks it 'partial' — treating the cisplatin recommendation as a small error rather than a safety event. Diagnosis: judge is not weighting safety failures correctly. Fix: explicitly define 'incorrect-and-harmful' in the rubric as 'any recommendation that could harm the patient', with examples of nephrotoxic-in-renal-impairment cases."
  }
];

export default function Practice() {
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [agreementCount, setAgreementCount] = useState(0);

  const c = CASES[idx];

  const reveal = () => {
    if (c.agree) setAgreementCount(a => a + 1);
    setRevealed(true);
  };

  const next = () => { setIdx(i => i + 1); setRevealed(false); };
  const reset = () => { setIdx(0); setRevealed(false); setAgreementCount(0); };

  if (idx >= CASES.length) {
    return (
      <div style={{ maxWidth: 800, margin: '40px auto', fontFamily: 'system-ui' }}>
        <h2 style={{ textAlign: 'center' }}>Alignment Run Complete!</h2>
        <p style={{ background: '#fff3cd', padding: 16, borderRadius: 8 }}>
          <strong>Raw agreement:</strong> {agreementCount} / {CASES.length} ({(agreementCount / CASES.length * 100).toFixed(0)}%)
        </p>
        <div style={{ background: '#f0f4ff', padding: 16, borderRadius: 8 }}>
          <p><strong>Diagnosis summary across the disagreements:</strong></p>
          <ul>
            <li>The judge does not check input-output consistency on histology (Case 2)</li>
            <li>The judge is too lenient on incompleteness (Case 3)</li>
            <li>The judge is not weighting safety failures correctly (Case 5)</li>
          </ul>
          <p><strong>Next action:</strong> refine the judge prompt with targeted few-shot examples for each pattern, then re-run on the same baseline. Iterate until agreement crosses your threshold.</p>
        </div>
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <button onClick={reset} style={{ padding: '10px 24px', borderRadius: 6, border: 'none', background: '#0d6efd', color: '#fff', cursor: 'pointer' }}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 850, margin: '40px auto', fontFamily: 'system-ui' }}>
      <h3>Run the Alignment Loop</h3>
      <div style={{ background: '#e9ecef', borderRadius: 8, height: 8, marginBottom: 20 }}>
        <div style={{ background: '#0d6efd', borderRadius: 8, height: 8, width: `${((idx + 1) / CASES.length) * 100}%` }} />
      </div>
      <p style={{ background: '#fff3cd', padding: 12, borderRadius: 8, fontSize: 14 }}><strong>Case {idx + 1} input:</strong> {c.input}</p>
      <p style={{ background: '#e7f1ff', padding: 12, borderRadius: 8, fontSize: 14 }}><strong>Tool output:</strong> {c.output}</p>

      {!revealed && (
        <button onClick={reveal} style={{ marginTop: 12, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#198754', color: '#fff', cursor: 'pointer' }}>Reveal human + judge labels</button>
      )}

      {revealed && (
        <div style={{ marginTop: 12 }}>
          <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
            <div style={{ flex: 1, padding: 12, background: '#d4edda', borderRadius: 8 }}>
              <strong>Human label:</strong> {c.humanLabel}
            </div>
            <div style={{ flex: 1, padding: 12, background: c.agree ? '#d4edda' : '#f8d7da', borderRadius: 8 }}>
              <strong>Judge label:</strong> {c.judgeLabel}
            </div>
          </div>
          <div style={{ padding: 16, background: '#f0f4ff', borderRadius: 8, borderLeft: '4px solid #0d6efd' }}>
            <p>{c.note}</p>
            <button onClick={next} style={{ marginTop: 8, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#0d6efd', color: '#fff', cursor: 'pointer' }}>{idx + 1 < CASES.length ? 'Next Case' : 'See Summary'}</button>
          </div>
        </div>
      )}
    </div>
  );
}

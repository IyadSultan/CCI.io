import React, { useState } from 'react';

const PAGES = [
  { id: 'index', name: 'index.md', desc: 'Table of contents linking to every entity page', correct: true },
  { id: 'log', name: 'log.md', desc: 'Chronological journal of ingested sources and edits', correct: true },
  { id: 'staging', name: 'staging.md', desc: 'Wilms tumor staging system (Stage I–V) with criteria', correct: true },
  { id: 'histology', name: 'histology.md', desc: 'Favorable vs anaplastic histology, prognostic implications', correct: true },
  { id: 'drug-vincristine', name: 'drug-vincristine.md', desc: 'Vincristine: dosing, mechanism, side effects, cross-refs to regimens', correct: true },
  { id: 'drug-actd', name: 'drug-actinomycin-d.md', desc: 'Actinomycin-D: dosing, modifications, side effects', correct: true },
  { id: 'drug-dox', name: 'drug-doxorubicin.md', desc: 'Doxorubicin: dosing, cardiotoxicity monitoring, cross-refs', correct: true },
  { id: 'regimen-3fh', name: 'regimen-stage-III-FH.md', desc: 'Standard regimen for stage III favorable histology', correct: true },
  { id: 'se-cardio', name: 'side-effect-cardiotoxicity.md', desc: 'Cardiotoxicity: causes, monitoring, drugs that cause it', correct: true },
  { id: 'se-neuro', name: 'side-effect-neuropathy.md', desc: 'Peripheral neuropathy: causes, drugs', correct: true },
  { id: 'proc-nephrectomy', name: 'procedure-nephrectomy.md', desc: 'Surgical approach including nephron-sparing in bilateral disease', correct: true },
  { id: 'pediatric', name: 'pediatric-considerations.md', desc: 'Age-specific dosing and monitoring', correct: true },
  { id: 'breast-cancer', name: 'disease-breast-cancer.md', desc: 'Breast cancer staging and treatment', correct: false },
  { id: 'covid', name: 'disease-covid.md', desc: 'COVID-19 protocols', correct: false },
  { id: 'random-news', name: 'news-2024.md', desc: 'General news headlines from 2024', correct: false }
];

export default function Practice() {
  const [picked, setPicked] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const toggle = (id) => { if (!submitted) setPicked(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]); };
  const submit = () => setSubmitted(true);
  const reset = () => { setPicked([]); setSubmitted(false); };

  const correctIncluded = PAGES.filter(p => p.correct && picked.includes(p.id)).length;
  const wrongIncluded = PAGES.filter(p => !p.correct && picked.includes(p.id)).length;
  const missed = PAGES.filter(p => p.correct && !picked.includes(p.id)).length;

  return (
    <div style={{ maxWidth: 800, margin: '40px auto', fontFamily: 'system-ui' }}>
      <h3>Design Your Wiki</h3>
      <p style={{ background: '#f8f9fa', padding: 16, borderRadius: 8, lineHeight: 1.6 }}>
        <strong>Scenario:</strong> You are designing a Karpathy-style wiki for the National Wilms Tumor treatment guidelines. The corpus covers staging, histology, drugs, regimens, side effects, and surgical procedures. Pick the pages that belong in this wiki and reject those that do not.
      </p>

      {PAGES.map(p => {
        const isPicked = picked.includes(p.id);
        const showCorrect = submitted && p.correct;
        const showWrong = submitted && isPicked && !p.correct;
        const showMissed = submitted && p.correct && !isPicked;
        return (
          <div key={p.id} onClick={() => toggle(p.id)} style={{
            padding: 12, margin: '6px 0', borderRadius: 8, cursor: submitted ? 'default' : 'pointer',
            border: `2px solid ${showCorrect ? '#198754' : showWrong ? '#dc3545' : showMissed ? '#ffc107' : isPicked ? '#0d6efd' : '#dee2e6'}`,
            background: showCorrect ? '#d4edda' : showWrong ? '#f8d7da' : showMissed ? '#fff3cd' : isPicked ? '#e7f1ff' : '#fff'
          }}>
            <div style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{p.name}</div>
            <div style={{ fontSize: 13, color: '#555' }}>{p.desc}</div>
          </div>
        );
      })}

      {!submitted && <button onClick={submit} disabled={picked.length === 0} style={{ marginTop: 12, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#198754', color: '#fff', cursor: picked.length === 0 ? 'default' : 'pointer', opacity: picked.length === 0 ? 0.5 : 1 }}>Lock in Wiki Design</button>}

      {submitted && (
        <div style={{ marginTop: 12, padding: 16, background: '#f0f4ff', borderRadius: 8, borderLeft: '4px solid #0d6efd' }}>
          <p><strong>Included correctly:</strong> {correctIncluded} / {PAGES.filter(p => p.correct).length} <strong>Wrongly included:</strong> {wrongIncluded} <strong>Missed:</strong> {missed}</p>
          <p style={{ fontSize: 13 }}>Every entity page should be a stable concept your domain queries return to repeatedly: staging, histology, each drug, each regimen, each major side effect, each procedure, plus pediatric considerations. Index and log are mandatory infrastructure. Pages about unrelated diseases (breast cancer, COVID) or generic news pollute the wiki — at ingest time the maintainer LLM should refuse to create these.</p>
          <p style={{ fontSize: 13 }}><strong>Cross-reference example:</strong> regimen-stage-III-FH.md should link to drug-vincristine, drug-actinomycin-d, drug-doxorubicin, staging, histology, side-effect-cardiotoxicity, side-effect-neuropathy. The links ARE the graph.</p>
          <button onClick={reset} style={{ marginTop: 8, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#0d6efd', color: '#fff', cursor: 'pointer' }}>Try Again</button>
        </div>
      )}
    </div>
  );
}

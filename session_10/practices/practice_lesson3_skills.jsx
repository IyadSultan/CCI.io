import React, { useState } from 'react';

// Stage 1: pick the best description for the skill frontmatter
const descriptionOptions = [
  {
    text: "Use this skill for clinical work.",
    correct: false,
    feedback: "Far too vague. 'Clinical work' matches everything — every question a clinician asks Claude in any KHCC repo would fire this skill. It would become noise and Claude would learn to ignore it."
  },
  {
    text: "Pathology extraction skill.",
    correct: false,
    feedback: "Describes WHAT the skill is, not WHEN to use it. Claude needs trigger phrases — the kinds of requests that should pull this playbook in. A label is not a trigger."
  },
  {
    text: "Use when the user asks to extract structured fields (tumor size, T-stage, N-stage, margins, grade, histology) from a free-text pathology report at KHCC. Applies AI Office conventions — GPT-4.1-mini via PydanticAI, eval against the deceased-patient cohort before shipping.",
    correct: true,
    feedback: "Correct. Names the exact triggers (extract structured fields from a path report), the specific fields (tumor size, T-stage, etc.), the institutional context (KHCC, AI Office conventions), and the constraints (PydanticAI, eval gate). Specific enough to fire when it should and stay quiet when it shouldn't."
  },
  {
    text: "Use whenever the user mentions pathology, tumors, cancer, oncology, surgery, biopsy, slides, microscopy, or any related medical concept.",
    correct: false,
    feedback: "Trigger-shaped but far too broad. 'Mentions pathology or oncology' matches almost any clinical question at KHCC. The skill would fire on tumor board summaries, chemo orders, survival analyses — situations where it has nothing useful to add."
  }
];

// Stage 2: which files belong in the skill folder
const fileOptions = [
  { name: "SKILL.md", belongs: true, reason: "The spine. Required. Holds the frontmatter (name + description) and the playbook." },
  { name: "references/tumor-staging-pitfalls.md", belongs: true, reason: "Long-form reference Claude reads only when SKILL.md points at it mid-task. Classic skill structure." },
  { name: "templates/pydantic-schema.py", belongs: true, reason: "Starter template Claude copies as a base for the extraction schema. Templates are a normal part of a skill folder." },
  { name: ".env", belongs: false, reason: "Secrets never belong in a skill folder. Skills are checked into git and shared with the team. API keys, database passwords, and Fernet keys live in the environment, not in the repo." },
  { name: "node_modules/", belongs: false, reason: "Installed dependencies do not belong in a skill. Skills are documentation + small helper scripts, not full software projects. If your skill needs a library, document the install step." },
  { name: "patient_data_sample.csv", belongs: false, reason: "PHI never belongs in a skill folder. Even de-identified patient data does not. Skills are shared with the team and checked into git — that is the wrong place for any clinical data, full stop." }
];

export default function Practice() {
  const [stage, setStage] = useState(1); // 1 = description, 2 = files, 3 = done
  const [descSelected, setDescSelected] = useState(null);
  const [descSubmitted, setDescSubmitted] = useState(false);
  const [fileChoices, setFileChoices] = useState({}); // {filename: 'in' | 'out'}
  const [fileSubmitted, setFileSubmitted] = useState(false);

  const checkDesc = () => setDescSubmitted(true);
  const nextStage = () => { setStage(2); };

  const setFile = (name, choice) => {
    if (fileSubmitted) return;
    setFileChoices({ ...fileChoices, [name]: choice });
  };

  const checkFiles = () => setFileSubmitted(true);

  const finish = () => setStage(3);

  const reset = () => {
    setStage(1); setDescSelected(null); setDescSubmitted(false); setFileChoices({}); setFileSubmitted(false);
  };

  const allFilesAnswered = fileOptions.every(f => fileChoices[f.name]);
  const fileScore = fileOptions.filter(f => (fileChoices[f.name] === 'in') === f.belongs).length;
  const descCorrect = descSubmitted && descriptionOptions[descSelected]?.correct;

  if (stage === 3) {
    const total = (descCorrect ? 1 : 0) + fileScore;
    const max = 1 + fileOptions.length;
    return (
      <div style={{ maxWidth: 760, margin: '40px auto', fontFamily: 'system-ui', textAlign: 'center' }}>
        <h2>Skill-Builder Practice Complete</h2>
        <p style={{ fontSize: 20 }}>Score: {total} / {max}</p>
        <div style={{ background: total >= max - 1 ? '#d4edda' : total >= 4 ? '#fff3cd' : '#f8d7da', padding: 20, borderRadius: 8, margin: 20 }}>
          {total >= max - 1
            ? "Excellent. You can pick a sharp description and you know what belongs in a skill folder vs what doesn't."
            : total >= 4
            ? "Good — review the file-sorting items you missed. Secrets, dependencies, and PHI never belong in a skill."
            : "Re-read the lesson, especially the section on description-as-contract and the disk layout."}
        </div>
        <button onClick={reset} style={{ padding: '10px 24px', fontSize: 16, cursor: 'pointer', borderRadius: 6, border: 'none', background: '#0d6efd', color: '#fff' }}>Try Again</button>
      </div>
    );
  }

  if (stage === 1) {
    return (
      <div style={{ maxWidth: 760, margin: '40px auto', fontFamily: 'system-ui' }}>
        <h2>Stage 1 of 2 — Fix the Description</h2>
        <p style={{ background: '#f8f9fa', padding: 12, borderRadius: 8, color: '#444' }}>
          You're building a <code>pathology-extraction</code> skill. Here is the SKILL.md so far — the description field is wrong.
          Pick the best replacement.
        </p>
        <pre style={{ background: '#0d1117', color: '#c9d1d9', padding: 16, borderRadius: 8, fontSize: 13, overflowX: 'auto' }}>{`---
name: pathology-extraction
description: <YOU PICK THIS>
---

# Pathology Extraction Skill
Reads a free-text pathology report and produces a structured row...`}</pre>

        {descriptionOptions.map((opt, i) => (
          <div key={i} onClick={() => !descSubmitted && setDescSelected(i)} style={{
            padding: '12px 16px', margin: '8px 0', borderRadius: 8, cursor: descSubmitted ? 'default' : 'pointer',
            border: `2px solid ${descSubmitted ? (opt.correct ? '#198754' : i === descSelected ? '#dc3545' : '#dee2e6') : descSelected === i ? '#0d6efd' : '#dee2e6'}`,
            background: descSubmitted ? (opt.correct ? '#d4edda' : i === descSelected && !opt.correct ? '#f8d7da' : '#fff') : '#fff',
            fontSize: 14
          }}>{opt.text}</div>
        ))}

        {!descSubmitted && (
          <button onClick={checkDesc} disabled={descSelected === null} style={{
            marginTop: 16, padding: '10px 24px', borderRadius: 6, border: 'none',
            background: '#198754', color: '#fff', cursor: 'pointer', opacity: descSelected === null ? 0.5 : 1
          }}>Submit</button>
        )}

        {descSubmitted && (
          <div style={{ marginTop: 16, padding: 16, background: '#f0f4ff', borderRadius: 8, borderLeft: '4px solid #0d6efd' }}>
            <p><strong>{descCorrect ? 'Correct!' : 'Not quite.'}</strong></p>
            <p>{descriptionOptions[descSelected].feedback}</p>
            {!descCorrect && (
              <p style={{ marginTop: 8 }}>
                <strong>The right answer:</strong> {descriptionOptions.find(o => o.correct).text}
              </p>
            )}
            <button onClick={nextStage} style={{ marginTop: 12, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#0d6efd', color: '#fff', cursor: 'pointer' }}>
              Next: Sort the Files
            </button>
          </div>
        )}
      </div>
    );
  }

  // Stage 2: file sorting
  return (
    <div style={{ maxWidth: 760, margin: '40px auto', fontFamily: 'system-ui' }}>
      <h2>Stage 2 of 2 — Sort the Files</h2>
      <p style={{ background: '#f8f9fa', padding: 12, borderRadius: 8, color: '#444' }}>
        Below are six files your colleague is considering putting inside <code>.claude/skills/pathology-extraction/</code>.
        For each one, decide whether it belongs in the skill folder ("In") or doesn't ("Out").
      </p>

      {fileOptions.map((f) => {
        const choice = fileChoices[f.name];
        const correctAfterSubmit = fileSubmitted && (choice === 'in') === f.belongs;
        const wrongAfterSubmit = fileSubmitted && choice && (choice === 'in') !== f.belongs;
        return (
          <div key={f.name} style={{
            padding: '12px 16px', margin: '8px 0', borderRadius: 8,
            border: `2px solid ${correctAfterSubmit ? '#198754' : wrongAfterSubmit ? '#dc3545' : '#dee2e6'}`,
            background: correctAfterSubmit ? '#d4edda' : wrongAfterSubmit ? '#f8d7da' : '#fff'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
              <code style={{ fontSize: 13 }}>{f.name}</code>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setFile(f.name, 'in')} disabled={fileSubmitted} style={{
                  padding: '6px 14px', borderRadius: 6, border: 'none', cursor: fileSubmitted ? 'default' : 'pointer',
                  background: choice === 'in' ? '#0d6efd' : '#e9ecef',
                  color: choice === 'in' ? '#fff' : '#444'
                }}>In</button>
                <button onClick={() => setFile(f.name, 'out')} disabled={fileSubmitted} style={{
                  padding: '6px 14px', borderRadius: 6, border: 'none', cursor: fileSubmitted ? 'default' : 'pointer',
                  background: choice === 'out' ? '#0d6efd' : '#e9ecef',
                  color: choice === 'out' ? '#fff' : '#444'
                }}>Out</button>
              </div>
            </div>
            {fileSubmitted && (
              <p style={{ marginTop: 8, fontSize: 13, color: '#444' }}>
                <strong>{f.belongs ? 'In' : 'Out'}.</strong> {f.reason}
              </p>
            )}
          </div>
        );
      })}

      {!fileSubmitted && (
        <button onClick={checkFiles} disabled={!allFilesAnswered} style={{
          marginTop: 16, padding: '10px 24px', borderRadius: 6, border: 'none',
          background: '#198754', color: '#fff', cursor: 'pointer', opacity: allFilesAnswered ? 1 : 0.5
        }}>Submit</button>
      )}

      {fileSubmitted && (
        <div style={{ marginTop: 16, padding: 16, background: '#f0f4ff', borderRadius: 8, borderLeft: '4px solid #0d6efd' }}>
          <p><strong>You got {fileScore} of {fileOptions.length} correct.</strong></p>
          <p>The general rule: skills are documentation + small helper scripts. Secrets, big dependencies, and patient data never belong in a skill folder — those folders are checked into git and shared with the team.</p>
          <button onClick={finish} style={{ marginTop: 12, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#0d6efd', color: '#fff', cursor: 'pointer' }}>See Final Score</button>
        </div>
      )}
    </div>
  );
}

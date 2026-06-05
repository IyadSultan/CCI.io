import React, { useState } from 'react';

const pitches = [
  {
    id: 'aki-sms',
    pitch: "A daily Databricks job that scans VISTA_LAB creatinine trends, applies KDIGO staging, and sends an SMS to the on-call nephrology fellow for every new stage 2 or 3 AKI in adult inpatients.",
    template: 'aidi',
    expectedProblemKeywords: ['aki', 'kidney', 'kdigo', 'creatinine', 'missed', 'late', 'inpatient'],
    expectedUserKeywords: ['nephrology', 'fellow', 'on-call', 'consultant'],
  },
  {
    id: 'pubmed-ext',
    pitch: "A Chrome extension that summarizes PubMed abstracts into PICO bullet points when a clinician hovers over the abstract on pubmed.ncbi.nlm.nih.gov.",
    template: 'generic',
    expectedProblemKeywords: ['pubmed', 'abstract', 'summarize', 'time', 'reading', 'literature'],
    expectedUserKeywords: ['clinician', 'doctor', 'researcher', 'physician'],
  },
  {
    id: 'chemo-check',
    pitch: "A pre-dispense check inside the chemotherapy order workflow that re-computes BSA, checks Cockcroft-Gault clearance against nephrotoxic-agent thresholds, and verifies lifetime doxorubicin against the cumulative dose ceiling.",
    template: 'aidi',
    expectedProblemKeywords: ['chemotherapy', 'dose', 'error', 'dosing', 'harm', 'overdose', 'renal'],
    expectedUserKeywords: ['pharmacist', 'oncologist', 'prescriber', 'pharmacy'],
  },
  {
    id: 'meeting-bot',
    pitch: "A Slack bot that joins our weekly research meeting, transcribes it, and posts a summary with action items to the team channel afterwards.",
    template: 'generic',
    expectedProblemKeywords: ['meeting', 'notes', 'action', 'forget', 'minutes', 'transcrip'],
    expectedUserKeywords: ['team', 'researcher', 'member', 'attendee', 'staff'],
  }
];

function gradeText(text, keywords) {
  if (!text || text.trim().length < 15) return { ok: false, msg: "Too short — at least 15 characters." };
  const lower = text.toLowerCase();
  const hit = keywords.some(k => lower.includes(k));
  if (!hit) return { ok: false, msg: `Missing a domain keyword. Try referencing one of: ${keywords.slice(0,4).join(', ')}.` };
  return { ok: true, msg: "Structure looks right." };
}

function gradeStory(text) {
  if (!text || text.trim().length < 20) return { ok: false, msg: "Too short — write at least one full sentence." };
  const lower = text.toLowerCase();
  const hasRole = /as a |as an /.test(lower);
  const hasWant = /i want|i need|so that|so i can/.test(lower);
  if (!hasRole) return { ok: false, msg: "User story should start with 'As a [role]...'" };
  if (!hasWant) return { ok: false, msg: "User story should include 'I want...' or 'so that...'" };
  return { ok: true, msg: "Recognizable user story shape." };
}

export default function Practice() {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState({});

  const setField = (id, field, val) => {
    if (submitted[id]) return;
    setAnswers(a => ({ ...a, [id]: { ...(a[id] || {}), [field]: val } }));
  };

  const check = (id) => setSubmitted(s => ({ ...s, [id]: true }));
  const reset = (id) => {
    setAnswers(a => ({ ...a, [id]: {} }));
    setSubmitted(s => ({ ...s, [id]: false }));
  };

  return (
    <div style={{ maxWidth: 780, margin: '40px auto', fontFamily: 'system-ui' }}>
      <h3>PRD Triage Practice</h3>
      <p style={{ background: '#f8f9fa', padding: 16, borderRadius: 8, lineHeight: 1.6 }}>
        For each one-sentence product pitch below: (1) decide whether the PRD-Builder skill should use the <strong>AIDI clinical</strong> template or the <strong>generic</strong> template, (2) write a 2-sentence problem statement, and (3) write one user story in the form <em>"As a [role], I want [action], so that [outcome]."</em> Auto-grading checks structure (keywords + recognizable shape), not exact wording.
      </p>

      {pitches.map(p => {
        const a = answers[p.id] || {};
        const isSubmitted = submitted[p.id];
        const templateCorrect = isSubmitted && a.template === p.template;
        const templateWrong = isSubmitted && a.template && a.template !== p.template;
        const problemGrade = isSubmitted ? gradeText(a.problem, p.expectedProblemKeywords) : null;
        const storyGrade = isSubmitted ? gradeStory(a.story) : null;
        const userGrade = isSubmitted ? gradeText(a.story, p.expectedUserKeywords) : null;
        const allGood = isSubmitted && templateCorrect && problemGrade?.ok && storyGrade?.ok && userGrade?.ok;

        return (
          <div key={p.id} style={{
            padding: 16, margin: '16px 0', borderRadius: 8,
            border: `2px solid ${allGood ? '#198754' : isSubmitted ? '#dc3545' : '#dee2e6'}`,
            background: '#fff'
          }}>
            <p style={{ fontStyle: 'italic', borderLeft: '3px solid #0d6efd', paddingLeft: 12, margin: 0 }}>
              {p.pitch}
            </p>

            <div style={{ marginTop: 16 }}>
              <strong>Template choice:</strong>
              <div style={{ marginTop: 8 }}>
                <button onClick={() => setField(p.id, 'template', 'aidi')} disabled={isSubmitted} style={{
                  marginRight: 8, padding: '6px 14px', borderRadius: 6, cursor: isSubmitted ? 'default' : 'pointer',
                  border: `2px solid ${a.template === 'aidi' ? '#0d6efd' : '#ccc'}`,
                  background: a.template === 'aidi' ? '#0d6efd' : '#fff', color: a.template === 'aidi' ? '#fff' : '#000'
                }}>AIDI clinical</button>
                <button onClick={() => setField(p.id, 'template', 'generic')} disabled={isSubmitted} style={{
                  padding: '6px 14px', borderRadius: 6, cursor: isSubmitted ? 'default' : 'pointer',
                  border: `2px solid ${a.template === 'generic' ? '#0d6efd' : '#ccc'}`,
                  background: a.template === 'generic' ? '#0d6efd' : '#fff', color: a.template === 'generic' ? '#fff' : '#000'
                }}>Generic</button>
              </div>
              {isSubmitted && (
                <p style={{ marginTop: 8, fontSize: 14, color: templateCorrect ? '#198754' : '#dc3545' }}>
                  {templateCorrect ? "Correct." : `Expected: ${p.template === 'aidi' ? 'AIDI clinical' : 'Generic'}.`}
                </p>
              )}
            </div>

            <div style={{ marginTop: 12 }}>
              <strong>Problem statement (2 sentences):</strong>
              <textarea
                value={a.problem || ''}
                onChange={e => setField(p.id, 'problem', e.target.value)}
                disabled={isSubmitted}
                rows={3}
                style={{ width: '100%', marginTop: 6, padding: 8, borderRadius: 6, border: '1px solid #ccc', fontFamily: 'system-ui', fontSize: 14 }}
                placeholder="What hurts today, for whom, and at what cost?"
              />
              {problemGrade && (
                <p style={{ marginTop: 4, fontSize: 14, color: problemGrade.ok ? '#198754' : '#dc3545' }}>{problemGrade.msg}</p>
              )}
            </div>

            <div style={{ marginTop: 12 }}>
              <strong>One user story:</strong>
              <textarea
                value={a.story || ''}
                onChange={e => setField(p.id, 'story', e.target.value)}
                disabled={isSubmitted}
                rows={2}
                style={{ width: '100%', marginTop: 6, padding: 8, borderRadius: 6, border: '1px solid #ccc', fontFamily: 'system-ui', fontSize: 14 }}
                placeholder="As a [role], I want [action], so that [outcome]."
              />
              {storyGrade && (
                <p style={{ marginTop: 4, fontSize: 14, color: storyGrade.ok ? '#198754' : '#dc3545' }}>{storyGrade.msg}</p>
              )}
              {userGrade && !userGrade.ok && (
                <p style={{ marginTop: 2, fontSize: 14, color: '#dc3545' }}>{userGrade.msg}</p>
              )}
            </div>

            <div style={{ marginTop: 12 }}>
              {!isSubmitted ? (
                <button onClick={() => check(p.id)} disabled={!a.template || !a.problem || !a.story} style={{
                  padding: '8px 18px', borderRadius: 6, border: 'none',
                  background: '#198754', color: '#fff',
                  cursor: (!a.template || !a.problem || !a.story) ? 'default' : 'pointer',
                  opacity: (!a.template || !a.problem || !a.story) ? 0.5 : 1
                }}>Check</button>
              ) : (
                <button onClick={() => reset(p.id)} style={{
                  padding: '8px 18px', borderRadius: 6, border: 'none',
                  background: '#0d6efd', color: '#fff', cursor: 'pointer'
                }}>Try Again</button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

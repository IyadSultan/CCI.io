import React, { useState } from 'react';

const questions = [
  {
    question: 'What are the five steps of the loop for adding a feature as a new Django app?',
    options: [
      'migrate, runserver, test, commit, push',
      'startapp, register in INSTALLED_APPS, write the view, write the template, wire the URL',
      'write CSS, write JS, write HTML, deploy, celebrate',
      'create a model, a form, a migration, a test, a fixture',
    ],
    correct: 1,
    explanation: 'The loop is: startapp to create the app, add it to INSTALLED_APPS, write the view, write the template, and wire the URL (app urls.py plus a project include). This is the entire rhythm of extending a Django application, identical even for features that write data.',
  },
  {
    question: 'After running startapp dashboard, why does the app still do nothing until you edit settings.py?',
    options: [
      'The app needs to be compiled first',
      'startapp creates the folder on disk, but the project does not know about it until you add it to INSTALLED_APPS',
      'You must run migrate before any app works',
      'The browser caches the empty app',
    ],
    correct: 1,
    explanation: 'startapp makes the app exist on disk, but the project does not know about it yet. Adding "dashboard" to INSTALLED_APPS is the line that connects the app to the project — and it is the step everyone forgets. Django does not look inside apps it has not been told about.',
  },
  {
    question: 'The dashboard view starts with: from triage.models import TriageEvent. What does this show?',
    options: [
      'The dashboard must define its own copy of the TriageEvent model',
      'Apps in the same project can share each other’s models and one database — the dashboard reads/counts triage data, creating no new model',
      'Importing across apps is forbidden and will crash',
      'The dashboard needs a second database to work',
    ],
    correct: 1,
    explanation: 'Apps in one project share models and one database. The dashboard reaches into the triage app to read its TriageEvent model, creating no new data and no new model — it is just a new lens on data the triage app already collects. That shared structure is the payoff of the project/app design.',
  },
  {
    question: 'You want to add a "recall last triage" screen to the existing triage feature. Do you need a new app?',
    options: [
      'Yes — every new screen always needs its own app',
      'No — a new screen within an existing feature is just a new view, URL, and template',
      'Yes — but only if it reads the database',
      'No — you only need to edit INSTALLED_APPS',
    ],
    correct: 1,
    explanation: 'Not every feature needs a new app. A new screen within an existing feature is just a new view plus URL plus template, and can live in the current app. A new app is reserved for something conceptually its own thing, like the dashboard, which is a different view onto the same data.',
  },
  {
    question: 'When a Django change "does nothing" or throws TemplateDoesNotExist, what are the two usual culprits?',
    options: [
      'A missing semicolon and a typo in the model',
      'The database is empty and the server is off',
      'Forgetting INSTALLED_APPS, and a wrong doubled-template-folder path',
      'Wrong Python version and a missing virtual environment',
    ],
    correct: 2,
    explanation: 'The two failure modes that catch everyone are forgetting to register the app in INSTALLED_APPS, and putting the template at the wrong doubled-folder path (it must be dashboard/templates/dashboard/dashboard.html). Both errors are loud and both are fixed in one line — check them before debugging anything deeper. Also remember to link by route name with {% url \'name\' %}, never hardcode the path.',
  },
];

export default function Quiz() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const handleSelect = (idx) => {
    if (showExplanation) return;
    setSelected(idx);
    setShowExplanation(true);
    if (idx === questions[current].correct) setScore(s => s + 1);
  };

  const next = () => {
    if (current + 1 >= questions.length) { setFinished(true); return; }
    setCurrent(c => c + 1);
    setSelected(null);
    setShowExplanation(false);
  };

  const restart = () => {
    setCurrent(0); setSelected(null); setShowExplanation(false); setScore(0); setFinished(false);
  };

  if (finished) {
    return (
      <div style={{ maxWidth: 700, margin: '40px auto', fontFamily: 'system-ui', textAlign: 'center' }}>
        <h2>Quiz Complete!</h2>
        <p style={{ fontSize: 24 }}>Score: {score} / {questions.length}</p>
        <div style={{ background: score >= 4 ? '#d4edda' : score >= 3 ? '#fff3cd' : '#f8d7da', padding: 20, borderRadius: 8, margin: 20 }}>
          {score >= 4 ? "Excellent! You own the five-step feature loop — startapp, INSTALLED_APPS, view, template, URL — and you know the two failure modes that catch everyone." : score >= 3 ? "Good start. Review the five-step loop and the two snags: forgetting INSTALLED_APPS and the wrong doubled-template-folder path." : "Review the lesson — the five-step loop for adding a feature and why INSTALLED_APPS is the step everyone forgets."}
        </div>
        <button onClick={restart} style={{ padding: '10px 24px', fontSize: 16, cursor: 'pointer', borderRadius: 6, border: 'none', background: '#0d6efd', color: '#fff' }}>Retry Quiz</button>
      </div>
    );
  }

  const q = questions[current];
  return (
    <div style={{ maxWidth: 700, margin: '40px auto', fontFamily: 'system-ui' }}>
      <div style={{ background: '#e9ecef', borderRadius: 8, height: 8, marginBottom: 20 }}>
        <div style={{ background: '#0d6efd', borderRadius: 8, height: 8, width: `${((current + 1) / questions.length) * 100}%`, transition: 'width 0.3s' }} />
      </div>
      <p style={{ color: '#666', marginBottom: 4 }}>Question {current + 1} of {questions.length}</p>
      <h3 style={{ marginBottom: 16 }}>{q.question}</h3>
      {q.options.map((opt, i) => (
        <div key={i} onClick={() => handleSelect(i)} style={{
          padding: '12px 16px', margin: '8px 0', borderRadius: 8, cursor: showExplanation ? 'default' : 'pointer',
          border: `2px solid ${showExplanation ? (i === q.correct ? '#198754' : i === selected ? '#dc3545' : '#dee2e6') : selected === i ? '#0d6efd' : '#dee2e6'}`,
          background: showExplanation ? (i === q.correct ? '#d4edda' : i === selected && i !== q.correct ? '#f8d7da' : '#fff') : '#fff'
        }}>{opt}</div>
      ))}
      {showExplanation && (
        <div style={{ background: '#f0f4ff', padding: 16, borderRadius: 8, marginTop: 12, borderLeft: '4px solid #0d6efd' }}>
          <strong>Explanation:</strong> {q.explanation}
        </div>
      )}
      {showExplanation && <button onClick={next} style={{ marginTop: 16, padding: '10px 24px', fontSize: 16, cursor: 'pointer', borderRadius: 6, border: 'none', background: '#0d6efd', color: '#fff' }}>{current + 1 < questions.length ? 'Next Question' : 'See Results'}</button>}
    </div>
  );
}

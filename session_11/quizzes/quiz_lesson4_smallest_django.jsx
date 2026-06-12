import React, { useState } from 'react';

const questions = [
  {
    question: 'What is the difference between a Django project and a Django app?',
    options: [
      'A project is one feature; an app is the whole website',
      'A project is the whole website; an app is one feature inside it, and one project contains many apps',
      'They are two names for the same thing',
      'A project runs in the browser; an app runs on the server',
    ],
    correct: 1,
    explanation: 'A Django project is the whole website — its settings and database config. An app is one feature inside the project, such as triage, billing, or dashboard. One project contains many apps, which is why you create one of each and watch the difference.',
  },
  {
    question: 'Which command creates a new app (one feature) inside an existing project?',
    options: [
      'django-admin startproject mysite .',
      'python manage.py runserver',
      'python manage.py startapp pages',
      'python manage.py migrate',
    ],
    correct: 2,
    explanation: 'python manage.py startapp pages creates a new app folder with its familiar files. startproject creates the whole site, migrate sets up the database, and runserver launches the local server — each is a different job run through manage.py.',
  },
  {
    question: 'What are the three moves needed to serve a page in Django?',
    options: [
      'Register the app in INSTALLED_APPS, write a view, and connect a URL',
      'Run migrate, runserver, and startproject',
      'Write CSS, write JavaScript, and open the browser',
      'Create a model, a form, and a database table',
    ],
    correct: 0,
    explanation: 'The three moves are: register the app in INSTALLED_APPS in settings.py, write a view (a Python function: request in, response out), and connect a URL in urls.py. The rhythm is URL → view → response, and everything else is a more elaborate version of these three.',
  },
  {
    question: 'When you run runserver and visit 127.0.0.1:8000, what does that address mean?',
    options: [
      'A public server on the internet that anyone can reach',
      'localhost — this very computer',
      'Render’s hosting service',
      'The database file on disk',
    ],
    correct: 1,
    explanation: '127.0.0.1, also called localhost, means "this very computer." runserver starts a small web server on your own machine, so the app is reachable only by you. Deployment (Lesson 7) is what moves it to an always-on, internet-reachable address.',
  },
  {
    question: 'Why must a template live in the doubled folder, e.g. pages/templates/pages/home.html?',
    options: [
      'Django requires every folder name to be repeated for no reason',
      'It makes the file load faster in the browser',
      'Django pools all apps’ templates/ folders together, so namespacing under the app name prevents two apps’ files from colliding',
      'Only the inner folder matters; the outer one is ignored',
    ],
    correct: 2,
    explanation: 'Django searches every app’s templates/ folder and pools them together. If two apps each had a home.html, they would collide. Namespacing each template under its app’s name keeps them distinct — it looks redundant but prevents real bugs, and the real ER-triage app does exactly this.',
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
          {score >= 4 ? "Excellent! You can name every file in a Django skeleton and run the three moves — register the app, write the view, connect the URL — the rhythm of all Django work." : score >= 3 ? "Good start. Review the project/app distinction and the three moves: INSTALLED_APPS, the view, and the URL." : "Review the lesson — project vs app, the URL → view → response rhythm, and the doubled template folder."}
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

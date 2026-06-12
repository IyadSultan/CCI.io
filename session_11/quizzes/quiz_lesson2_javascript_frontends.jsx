import React, { useState } from 'react';

const questions = [
  {
    question: "HTML, CSS, and JavaScript divide the frontend into three jobs. Which is which?",
    options: [
      "HTML = behavior, CSS = structure, JavaScript = appearance",
      "HTML = structure, CSS = appearance, JavaScript = behavior",
      "HTML = appearance, CSS = behavior, JavaScript = structure",
      "They all do the same thing; the names are historical"
    ],
    correct: 1,
    explanation: "HTML names the structure (this is a form, this is a heading). CSS controls appearance (fonts, colors, spacing). JavaScript adds behavior (respond to a click, check a value, update the page). When a page has structure but 'does nothing' on click, it is missing JavaScript."
  },
  {
    question: "In `onclick=\"greet()\"` on a button, what is happening?",
    options: [
      "The button is being named 'greet'",
      "An event (the click) is wired to trigger a function (greet) — when the button is clicked, greet runs",
      "The button will only work if the user types 'greet'",
      "greet is a CSS style applied to the button"
    ],
    correct: 1,
    explanation: "onclick is an event handler: it says 'when this is clicked, run greet().' An event (the click) triggering a function is the core of all interactivity. Inside the function you typically read a value with getElementById(...).value, compute something, and write a result back into the page."
  },
  {
    question: "Your JavaScript checks a temperature and shows a febrile warning, all in the browser. Why is this NOT acceptable as the official clinical decision?",
    options: [
      "JavaScript is too slow for clinical math",
      "It runs entirely in the browser, on the user's machine, where anyone can open the developer tools and change it — trusted clinical logic must run on the backend",
      "Browsers cannot compare numbers reliably",
      "It would work fine; there is no problem"
    ],
    correct: 1,
    explanation: "Frontend code runs on the user's own machine and can be inspected and altered by anyone. A browser-side check is fine as a convenience warning, but anything that must be true — the acuity that goes in the record, real validation — has to be enforced on the backend, on a server the user cannot reach into. This is the whole reason Lesson 3 exists."
  },
  {
    question: "What problem do frontend frameworks like React, Vue, and Angular exist to solve?",
    options: [
      "They make pages load faster on slow internet",
      "They let you write HTML without learning HTML",
      "They manage the complexity of keeping a screen and its underlying data in sync when there are many interacting parts — you describe what the screen should look like for given data, and the framework keeps them matched",
      "They are required for any website to work in a modern browser"
    ],
    correct: 2,
    explanation: "On a simple page, manual getElementById updates are fine. On a complex screen — hundreds of fields, live-updating values, panels that must stay in sync — that becomes a tangle, because data lives in two places at once. Frameworks share one idea: you describe the UI for a given set of data and the framework keeps the screen and data synced. They differ in syntax, not in that core purpose."
  },
  {
    question: "Why does this course deliberately NOT use a frontend framework for its clinical apps?",
    options: [
      "Frameworks are obsolete and no longer used in industry",
      "The ER-triage app has a form and a queue, not hundreds of live-syncing fields — Django renders the HTML on the server and a little plain JavaScript suffices, so a framework's complexity is not justified",
      "Frameworks cannot handle medical data",
      "The instructor does not know React"
    ],
    correct: 1,
    explanation: "Reaching for a framework is an engineering judgment: pay its complexity only when the screen's complexity justifies it. The triage app is server-rendered by Django with minimal JavaScript and no build step — simpler to build, secure, and maintain. Many production hospital internal tools are exactly this. (The course's quizzes and practices ARE written in React, so a .jsx file is a React file.)"
  }
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
          {score >= 4 ? "Excellent — you understand the three frontend languages, events, the browser-trust boundary, and what frameworks are for." : score >= 3 ? "Good — review why browser-side logic can't be trusted and what frameworks solve." : "Review the lesson — HTML/CSS/JS are the frontend, and the backend is where trust lives."}
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

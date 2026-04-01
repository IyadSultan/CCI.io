import React, { useState } from 'react';

const challenges = [
  {
    title: "Fix the Patient Dictionary",
    broken: `patient = {"name": "Ahmad", "age" 45, "diagnosis": "CML"}
print(patient["name"])`,
    hint: "Look at the dictionary syntax — every key-value pair needs a separator.",
    answer: `patient = {"name": "Ahmad", "age": 45, "diagnosis": "CML"}
print(patient["name"])`,
    explanation: "Missing colon after \"age\". Dictionary entries use key: value format."
  },
  {
    title: "Fix the Lab Check Loop",
    broken: `lab_results = [12.5, 9.1, 14.2, 7.8, 11.0]
for hgb in lab_results
  if hgb < 10:
    print("Low hemoglobin:", hgb)`,
    hint: "Python for-loops need something at the end of the line. Also check indentation.",
    answer: `lab_results = [12.5, 9.1, 14.2, 7.8, 11.0]
for hgb in lab_results:
  if hgb < 10:
    print("Low hemoglobin:", hgb)`,
    explanation: "Missing colon at end of 'for' line. Python requires ':' after for, if, while, def, and class statements."
  },
  {
    title: "Fix the Condition Check",
    broken: `platelets = 120
on_chemo = True
if platelets < 150 or on_chemo = True:
    print("Monitor closely")`,
    hint: "There are two issues: the logical check and the comparison operator.",
    answer: `platelets = 120
on_chemo = True
if platelets < 150 and on_chemo == True:
    print("Monitor closely")`,
    explanation: "Two fixes: (1) 'or' should be 'and' — we want BOTH conditions true. (2) Single '=' is assignment, '==' is comparison."
  }
];

export default function CodeFixer() {
  const [current, setCurrent] = useState(0);
  const [userCode, setUserCode] = useState(challenges[0].broken);
  const [showHint, setShowHint] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [solved, setSolved] = useState(0);

  const check = () => {
    const normalized = userCode.replace(/\s+/g, ' ').trim();
    const expected = challenges[current].answer.replace(/\s+/g, ' ').trim();
    if (normalized === expected) {
      setSolved(s => s + 1);
      setShowAnswer(true);
    } else {
      setShowHint(true);
    }
  };

  const next = () => {
    if (current + 1 < challenges.length) {
      setCurrent(c => c + 1);
      setUserCode(challenges[current + 1].broken);
      setShowHint(false);
      setShowAnswer(false);
    }
  };

  const c = challenges[current];
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-xl font-bold mb-2">Code Fixer: {c.title}</h2>
      <p className="text-sm text-gray-500 mb-4">Challenge {current+1} of {challenges.length} | Solved: {solved}</p>
      <textarea value={userCode} onChange={e => setUserCode(e.target.value)}
        className="w-full h-32 font-mono text-sm p-3 border rounded bg-gray-900 text-green-400"
        spellCheck={false} />
      <div className="flex gap-2 mt-3">
        <button onClick={check} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Check</button>
        <button onClick={() => setShowHint(true)} className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">Hint</button>
        <button onClick={() => { setShowAnswer(true); setUserCode(c.answer); }} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">Show Answer</button>
      </div>
      {showHint && !showAnswer && <p className="mt-3 p-3 bg-yellow-50 rounded text-sm">{c.hint}</p>}
      {showAnswer && (
        <div className="mt-3 p-3 bg-green-50 rounded">
          <p className="text-sm font-semibold text-green-800">Correct!</p>
          <p className="text-sm mt-1">{c.explanation}</p>
          {current + 1 < challenges.length && (
            <button onClick={next} className="mt-2 px-4 py-2 bg-green-500 text-white rounded">Next Challenge</button>
          )}
        </div>
      )}
    </div>
  );
}

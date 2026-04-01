import React, { useState } from 'react';

const scenarios = [
  {
    title: "Combining patient demographics with lab results",
    description: "You have 500 patients in demographics and 450 lab records. You want all 500 patients in your output, even if some don't have labs yet.",
    options: ["Inner Join", "Left Join", "Outer Join", "Concat"],
    correct: 1,
    explanation: "Left join keeps all rows from the left (demographics) table. Patients without labs will have NaN in lab columns — which you can then flag as 'labs pending'."
  },
  {
    title: "Merging oncology registry with pharmacy data",
    description: "You only want patients who appear in BOTH the oncology registry AND the pharmacy system (to analyze chemo patients specifically).",
    options: ["Inner Join", "Left Join", "Outer Join", "Concat"],
    correct: 0,
    explanation: "Inner join returns only rows with matching keys in both tables — exactly the patients who are in both registry and pharmacy."
  },
  {
    title: "Stacking quarterly lab exports",
    description: "You have 4 CSV files (Q1, Q2, Q3, Q4) with identical columns. You want one big table with all records.",
    options: ["Inner Join", "Left Join", "Outer Join", "Concat"],
    correct: 3,
    explanation: "Concat stacks DataFrames vertically. Since all files have the same columns, concat([q1, q2, q3, q4]) produces a single unified table."
  },
  {
    title: "Building a complete patient view from 3 systems",
    description: "You want every patient from ALL three systems (EMR, lab, pharmacy), even if they only appear in one system.",
    options: ["Inner Join", "Left Join", "Outer Join", "Concat"],
    correct: 2,
    explanation: "Outer join keeps all rows from both tables. Patients missing from one system will have NaN in those columns — useful for identifying data gaps."
  }
];

export default function MergeDecisionTree() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const handleSelect = (idx) => {
    if (selected !== null) return;
    setSelected(idx);
    if (idx === scenarios[current].correct) setScore(s => s + 1);
    setShowResult(true);
  };

  const next = () => {
    if (current + 1 < scenarios.length) {
      setCurrent(c => c + 1);
      setSelected(null);
      setShowResult(false);
    }
  };

  if (current >= scenarios.length) return null;
  const s = scenarios[current];

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-xl font-bold mb-2">Choose the Right Merge</h2>
      <p className="text-sm text-gray-500 mb-4">Scenario {current+1} of {scenarios.length} | Score: {score}</p>
      <div className="p-4 bg-blue-50 rounded mb-4">
        <h3 className="font-semibold">{s.title}</h3>
        <p className="text-sm mt-1">{s.description}</p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {s.options.map((opt, idx) => (
          <button key={idx} onClick={() => handleSelect(idx)}
            className={`p-3 rounded border text-center ${
              selected === null ? 'hover:bg-gray-50 border-gray-300' :
              idx === s.correct ? 'bg-green-100 border-green-500' :
              idx === selected ? 'bg-red-100 border-red-500' : 'border-gray-200'
            }`}>
            {opt}
          </button>
        ))}
      </div>
      {showResult && (
        <div className="mt-4 p-3 bg-green-50 rounded">
          <p className="text-sm">{s.explanation}</p>
          {current + 1 < scenarios.length && (
            <button onClick={next} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">Next Scenario</button>
          )}
          {current + 1 >= scenarios.length && (
            <p className="mt-2 font-semibold">Complete! Score: {score}/{scenarios.length}</p>
          )}
        </div>
      )}
    </div>
  );
}

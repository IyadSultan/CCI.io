import React, { useState } from 'react';

const correctOrder = [
  "Package Installations (!pip install ...)",
  "Imports (import pandas, import os, ...)",
  "Configuration (API keys, thresholds, paths)",
  "Prompts (LLM prompt templates)",
  "Functions (def flag_labs(), def generate_report(), ...)",
  "Main Code (execute pipeline)",
  "Build CSV (export results to file)",
  "Email (send results via SMTP/Azure)",
  "Markdown Summary (document what was done)"
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function NotebookOrderer() {
  const [items, setItems] = useState(() => shuffle(correctOrder));
  const [dragIdx, setDragIdx] = useState(null);
  const [checked, setChecked] = useState(false);

  const moveItem = (from, to) => {
    const newItems = [...items];
    const [moved] = newItems.splice(from, 1);
    newItems.splice(to, 0, moved);
    setItems(newItems);
    setChecked(false);
  };

  const isCorrect = items.every((item, idx) => item === correctOrder[idx]);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-xl font-bold mb-2">Notebook Section Organizer</h2>
      <p className="text-sm text-gray-600 mb-4">Drag the sections into the correct order for a clinical Python notebook. Use the arrow buttons to move items up/down.</p>
      <div className="space-y-2">
        {items.map((item, idx) => (
          <div key={item} className={`flex items-center gap-2 p-3 rounded border ${
            checked ? (item === correctOrder[idx] ? 'bg-green-50 border-green-400' : 'bg-red-50 border-red-400') : 'bg-white border-gray-300'
          }`}>
            <span className="text-gray-400 font-mono w-6">{idx + 1}.</span>
            <span className="flex-1 text-sm">{item}</span>
            <div className="flex flex-col">
              <button onClick={() => idx > 0 && moveItem(idx, idx-1)} className="text-xs px-1 hover:bg-gray-100 rounded" disabled={idx === 0}>▲</button>
              <button onClick={() => idx < items.length-1 && moveItem(idx, idx+1)} className="text-xs px-1 hover:bg-gray-100 rounded" disabled={idx === items.length-1}>▼</button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2 mt-4">
        <button onClick={() => setChecked(true)} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Check Order</button>
        <button onClick={() => { setItems(shuffle(correctOrder)); setChecked(false); }} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">Shuffle</button>
      </div>
      {checked && isCorrect && <p className="mt-3 p-3 bg-green-100 rounded text-green-800 font-semibold">Perfect! This is the standard clinical notebook template.</p>}
      {checked && !isCorrect && <p className="mt-3 p-3 bg-yellow-100 rounded text-yellow-800">Not quite — look at the red items and think about dependencies. Installations must come before imports, imports before config, etc.</p>}
    </div>
  );
}

import React, { useState } from 'react';

const steps = [
  { id: 1, text: "Create a GitHub account at github.com", order: 1 },
  { id: 2, text: "Create a new repository (repo) on GitHub", order: 2 },
  { id: 3, text: "Add a README.md describing your project", order: 3 },
  { id: 4, text: "Add a .gitignore file (to exclude data files with PHI)", order: 4 },
  { id: 5, text: "Open your Colab notebook and make changes", order: 5 },
  { id: 6, text: "File → Save a copy in GitHub (select your repo)", order: 6 },
  { id: 7, text: "Write a clear commit message describing your changes", order: 7 },
  { id: 8, text: "Verify the commit appears in your GitHub repo's commit history", order: 8 },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function GitWorkflow() {
  const [items, setItems] = useState(() => shuffle(steps));
  const [checked, setChecked] = useState(false);

  const moveItem = (from, to) => {
    const newItems = [...items];
    const [moved] = newItems.splice(from, 1);
    newItems.splice(to, 0, moved);
    setItems(newItems);
    setChecked(false);
  };

  const isCorrect = items.every((item, idx) => item.order === idx + 1);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-xl font-bold mb-2">Git Workflow Organizer</h2>
      <p className="text-sm text-gray-600 mb-4">Put these steps in the correct order for pushing a Colab notebook to GitHub.</p>
      <div className="space-y-2">
        {items.map((item, idx) => (
          <div key={item.id} className={`flex items-center gap-2 p-3 rounded border ${
            checked ? (item.order === idx + 1 ? 'bg-green-50 border-green-400' : 'bg-red-50 border-red-400') : 'bg-white border-gray-300'
          }`}>
            <span className="text-gray-400 font-mono w-6">{idx + 1}.</span>
            <span className="flex-1 text-sm">{item.text}</span>
            <div className="flex flex-col">
              <button onClick={() => idx > 0 && moveItem(idx, idx-1)} className="text-xs px-1">▲</button>
              <button onClick={() => idx < items.length-1 && moveItem(idx, idx+1)} className="text-xs px-1">▼</button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2 mt-4">
        <button onClick={() => setChecked(true)} className="px-4 py-2 bg-blue-500 text-white rounded">Check Order</button>
        <button onClick={() => { setItems(shuffle(steps)); setChecked(false); }} className="px-4 py-2 bg-gray-500 text-white rounded">Shuffle</button>
      </div>
      {checked && isCorrect && <p className="mt-3 p-3 bg-green-100 rounded text-green-800 font-semibold">Perfect workflow!</p>}
      {checked && !isCorrect && <p className="mt-3 p-3 bg-yellow-100 rounded">Not quite — think about what needs to exist before each step can happen.</p>}
    </div>
  );
}

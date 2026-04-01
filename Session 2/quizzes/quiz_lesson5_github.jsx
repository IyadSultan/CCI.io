import React, { useState } from 'react';

const questions = [
  {
    question: "What is a 'commit' in Git?",
    options: [
      "Deleting a file from the repository",
      "A snapshot of your code at a specific point with a descriptive message",
      "Downloading code from GitHub",
      "Sharing your repository with someone"
    ],
    correct: 1,
    explanation: "A commit captures the state of all tracked files at that moment, tagged with a message like 'Added lab alert logic'. It's like a save point you can return to."
  },
  {
    question: "You accidentally deleted the functions section from your notebook last week. Your repo has 20 commits. What can you do?",
    options: [
      "Nothing — deleted code is gone forever",
      "Go back to a previous commit where the functions still existed and restore them",
      "Email GitHub support to recover the file",
      "Re-run the notebook to regenerate the functions"
    ],
    correct: 1,
    explanation: "Git preserves every version. You can view any previous commit and restore code from it — this is the core benefit of version control."
  },
  {
    question: "Which commit message is best for clinical code?",
    options: [
      "update",
      "fixed stuff",
      "Add hemoglobin threshold check for chemo patients",
      "commit 47"
    ],
    correct: 2,
    explanation: "Good commit messages describe WHAT changed and WHY. In clinical settings, this serves as an audit trail — reviewers need to understand each change without reading the code."
  },
  {
    question: "You have a CSV file with real patient MRNs in your project folder. What should you do before pushing to GitHub?",
    options: [
      "Push it — GitHub is private",
      "Add the CSV filename to .gitignore so it never gets uploaded",
      "Rename the file to hide it",
      "Encrypt the file and push the encrypted version"
    ],
    correct: 1,
    explanation: ".gitignore tells Git to ignore specific files. Patient data with PHI must NEVER be pushed to GitHub, even to private repositories. Always add data files to .gitignore."
  },
  {
    question: "In Colab, what is the easiest way to save your notebook to GitHub?",
    options: [
      "Download the .ipynb file and email it",
      "File → Save a copy in GitHub",
      "Copy-paste the code into a GitHub text editor",
      "Take screenshots of each cell"
    ],
    correct: 1,
    explanation: "Colab has built-in GitHub integration. 'Save a copy in GitHub' creates a commit directly from Colab — the simplest workflow for beginners."
  }
];

export default function Quiz() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [finished, setFinished] = useState(false);

  const handleSelect = (idx) => {
    if (selected !== null) return;
    setSelected(idx);
    if (idx === questions[current].correct) setScore(s => s + 1);
    setShowResult(true);
  };

  const next = () => {
    if (current + 1 < questions.length) {
      setCurrent(c => c + 1);
      setSelected(null);
      setShowResult(false);
    } else {
      setFinished(true);
    }
  };

  if (finished) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Quiz Complete!</h2>
        <p className="text-xl">Score: {score}/{questions.length}</p>
      </div>
    );
  }

  const q = questions[current];
  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-4">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-blue-500 h-2 rounded-full" style={{width: `${((current+1)/questions.length)*100}%`}}></div>
        </div>
        <p className="text-sm text-gray-500 mt-1">Question {current+1} of {questions.length}</p>
      </div>
      <h3 className="text-lg font-semibold mb-4">{q.question}</h3>
      <div className="space-y-2">
        {q.options.map((opt, idx) => (
          <button key={idx} onClick={() => handleSelect(idx)}
            className={`w-full text-left p-3 rounded border ${
              selected === null ? 'hover:bg-gray-50 border-gray-300' :
              idx === q.correct ? 'bg-green-100 border-green-500' :
              idx === selected ? 'bg-red-100 border-red-500' : 'border-gray-200'
            }`}>
            {opt}
          </button>
        ))}
      </div>
      {showResult && (
        <div className="mt-4 p-3 bg-blue-50 rounded">
          <p className="text-sm">{q.explanation}</p>
          <button onClick={next} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            {current + 1 < questions.length ? 'Next Question' : 'See Results'}
          </button>
        </div>
      )}
    </div>
  );
}

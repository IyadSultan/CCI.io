import React, { useState } from 'react';

const cards = [
  { front: "Class", back: "A blueprint for creating objects. Example: class Patient: defines what every patient object looks like." },
  { front: "__init__", back: "The constructor method — runs automatically when you create a new object. Sets up initial attributes like self.name, self.mrn." },
  { front: "self", back: "Refers to the specific instance calling the method. In p.is_critical(), self = p." },
  { front: "Instance variable", back: "Data stored on a specific object. self.hemoglobin = 12.5 means THIS patient's hemoglobin is 12.5." },
  { front: "Method", back: "A function defined inside a class. Example: def is_anemic(self): return self.hemoglobin < 10" },
  { front: "Inheritance", back: "A class can extend another. class OncologyPatient(Patient): inherits all Patient attributes and methods." },
  { front: "Encapsulation", back: "Bundling data and behavior together. A Patient object contains BOTH its data and the logic to check it." },
  { front: "Object / Instance", back: "A specific thing created from a class blueprint. p = Patient('Ahmad', 'P-1001') — p is an instance of Patient." }
];

export default function Flashcards() {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(0);

  const next = (isKnown) => {
    if (isKnown) setKnown(k => k + 1);
    setFlipped(false);
    setIdx(i => (i + 1) % cards.length);
  };

  return (
    <div className="max-w-md mx-auto p-6 text-center">
      <p className="text-sm text-gray-500 mb-2">Card {idx+1} of {cards.length} | Known: {known}</p>
      <div onClick={() => setFlipped(!flipped)}
        className="cursor-pointer border-2 rounded-lg p-8 min-h-[200px] flex items-center justify-center transition-all hover:shadow-lg"
        style={{backgroundColor: flipped ? '#f0fdf4' : '#eff6ff'}}>
        <div>
          <p className="text-xs text-gray-400 mb-2">{flipped ? 'DEFINITION' : 'TERM'}</p>
          <p className={`${flipped ? 'text-base' : 'text-2xl font-bold'}`}>
            {flipped ? cards[idx].back : cards[idx].front}
          </p>
          {!flipped && <p className="text-xs text-gray-400 mt-4">Click to flip</p>}
        </div>
      </div>
      {flipped && (
        <div className="flex gap-2 justify-center mt-4">
          <button onClick={() => next(false)} className="px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200">Still Learning</button>
          <button onClick={() => next(true)} className="px-4 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200">Got It!</button>
        </div>
      )}
    </div>
  );
}

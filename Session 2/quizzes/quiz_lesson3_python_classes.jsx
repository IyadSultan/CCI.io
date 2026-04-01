import React, { useState } from 'react';

const questions = [
  {
    question: "What does 'self' refer to inside a Python class method?",
    options: [
      "The class definition itself",
      "The specific instance (object) calling the method",
      "The Python interpreter",
      "The parent class"
    ],
    correct: 1,
    explanation: "'self' refers to the specific instance of the class. When you write patient1.is_critical(), 'self' inside the method points to patient1's data."
  },
  {
    question: "You define: class Patient: and then def __init__(self, name, mrn):. What happens when you write p = Patient('Ahmad', 'P-1001')?",
    options: [
      "Python defines a new class called 'p'",
      "Python calls __init__ and creates a new Patient object with name='Ahmad' and mrn='P-1001'",
      "Python prints the patient information",
      "An error occurs because you need to call __init__ directly"
    ],
    correct: 1,
    explanation: "Patient('Ahmad', 'P-1001') calls __init__ automatically, creating a new Patient instance. You never call __init__ directly."
  },
  {
    question: "Inside a Patient class, you write: def is_anemic(self): return self.hemoglobin < 10. How do you use this for patient p?",
    options: [
      "is_anemic(p)",
      "Patient.is_anemic(p.hemoglobin)",
      "p.is_anemic()",
      "p.is_anemic(self)"
    ],
    correct: 2,
    explanation: "Instance methods are called with dot notation: p.is_anemic(). Python automatically passes 'p' as 'self' — you don't pass it yourself."
  },
  {
    question: "Why is a Patient class better than a dictionary for representing complex patient data?",
    options: [
      "Classes use less memory",
      "Classes enforce structure, prevent typos in field names, and bundle data with behavior",
      "Dictionaries can't store numbers",
      "Classes run faster than dictionaries"
    ],
    correct: 1,
    explanation: "Classes define a fixed structure (what attributes exist), provide validation in __init__, and attach methods (behavior) to the data. Dictionaries are flexible but unstructured."
  },
  {
    question: "An OncologyPatient class inherits from Patient. Which statement is correct?",
    options: [
      "OncologyPatient cannot have its own methods",
      "OncologyPatient gets all Patient methods and can add cancer-specific ones like tumor_stage()",
      "Patient and OncologyPatient share the same __init__",
      "Inheritance means both classes are identical"
    ],
    correct: 1,
    explanation: "Inheritance means OncologyPatient starts with everything Patient has, then adds or overrides methods for oncology-specific needs."
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

import React, { useState } from 'react';

const questions = [
  {
    question: "What does MCP stand for, and what is it?",
    options: [
      "Multi-Cloud Provider — a way to deploy Claude across AWS and Azure",
      "Model Context Protocol — an open standard for how an AI agent connects to external tools and data sources",
      "Managed Compute Platform — Anthropic's hosting service",
      "Medical Code Parser — a clinical NLP library"
    ],
    correct: 1,
    explanation: "MCP is the Model Context Protocol — Anthropic-authored, open standard. It is the wire format an AI agent uses to discover and call tools exposed by external systems (databases, Slack, Figma, your own custom server). It does not make Claude smarter; it makes Claude's reach longer."
  },
  {
    question: "What is the difference between an Anthropic Connector and a custom MCP server?",
    options: [
      "Connectors run on the cloud; MCP servers run locally — that is the only difference",
      "Connectors are Anthropic's productised integrations (Slack, Gmail, Notion, etc.) installed one-click in Claude.ai with OAuth and scopes; custom MCP servers are anything you or anyone else writes, added via `claude mcp add`. Both speak the same protocol; the difference is curation, ease of install, and trust",
      "Connectors are paid; MCP servers are free",
      "Connectors are for clinical data; MCP servers are for code"
    ],
    correct: 1,
    explanation: "Both are MCP under the hood. Anthropic Connectors are vetted, OAuth-flow, one-click installs for popular services (Slack, Gmail, Google Drive, Notion, Linear, GitHub). Custom MCP servers are anything else — written by you or by third parties — added from the CLI. Prefer a Connector when one exists for the service; use a custom server for the things only your team can build."
  },
  {
    question: "Which scope would you use to share an Azure SQL MCP connection with everyone on the AI Office team?",
    options: [
      "Local scope — each developer installs it in each folder separately",
      "User scope — each developer installs it once on their machine",
      "Project scope — committed to `.mcp.json` in the repo so everyone gets it on the next `git pull`",
      "There is no team-sharing mechanism; each person must rebuild it"
    ],
    correct: 2,
    explanation: "Project scope writes the MCP definition to `.mcp.json` at the repo root. Anyone who clones the repo and runs Claude Code there gets the same connection. Use user scope for personal accounts (your Notion), local scope for one-off experiments, and project scope for team-shared infrastructure like AIDI-DB. Credentials never live in `.mcp.json` — only the connection details."
  },
  {
    question: "What does 'read-only by default' mean for a clinical-data MCP server?",
    options: [
      "Claude can only read the server's tool descriptions, not call them",
      "The server's own code refuses any verb other than SELECT/READ — the LLM is never trusted to decide whether a destructive query is safe",
      "The server runs but logs every query",
      "Only senior staff can use it"
    ],
    correct: 1,
    explanation: "The deterministic safeguard lives in the server's handler code: any query that does not start with `SELECT` (or the equivalent read verb) is rejected before it reaches the database. The LLM is never given the choice. The day someone types 'delete all invalid rows' into a prompt is the day you learn why this rule exists. Writes go through a separate, audited, narrowly-scoped server."
  },
  {
    question: "Why does the lesson say a CLI tool (like `gh` or `psql`) often beats an MCP server that does the same job?",
    options: [
      "CLIs are faster on the network",
      "Every installed MCP server registers its tool definitions into Claude's context window on every single turn — even tools you never call. CLIs cost zero context tokens until Claude actually runs them",
      "CLIs are more secure",
      "MCP servers cannot be scripted"
    ],
    correct: 1,
    explanation: "MCP context cost is the surprise. Installed MCP servers add tool definitions (name, description, argument schema) to every session, on every turn. Ten servers with eight tools each is eighty definitions Claude re-reads every message. A CLI tool like `gh pr create` or `psql -c '...'` costs nothing until called. Use MCP when you genuinely need typed arguments or stateful access; use CLIs for everything a command answers."
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
          {score >= 4 ? "Excellent — you understand the MCP trade-offs." : score >= 3 ? "Good — re-read the CLI-beats-MCP rule and the read-only convention." : "Review the lesson before moving on; the context-cost trade-off matters."}
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

import React, { useState } from 'react';

// Three blanks the student fills in to assemble a working .claude/settings.json hooks block.
const blanks = [
  {
    id: "event1",
    label: "Hook A — Block destructive bash commands. Which lifecycle event?",
    options: ["PreToolUse", "PostToolUse", "Stop", "SessionEnd"],
    correct: "PreToolUse",
    why: "PreToolUse fires before the tool runs and can refuse the action by exiting non-zero. PostToolUse fires after — too late to block a destructive `rm -rf`."
  },
  {
    id: "matcher1",
    label: "Hook A — Which matcher narrows this hook to bash commands only?",
    options: ["Edit|Write", "Bash", ".*", "Read"],
    correct: "Bash",
    why: "The matcher is a regex against the tool name. `Bash` matches every shell command Claude tries to run; `.*` would also match Edit/Write/Read and slow every action down."
  },
  {
    id: "event2",
    label: "Hook B — Auto-format Python files with `ruff format` after Claude edits or writes them. Which event?",
    options: ["PreToolUse", "PostToolUse", "Stop", "SessionStart"],
    correct: "PostToolUse",
    why: "The file already exists — you want to react after it's written, not refuse the action before it happens. PostToolUse is the auto-formatter slot."
  },
  {
    id: "matcher2",
    label: "Hook B — Which matcher catches both file edits and new file writes?",
    options: ["Bash", "Edit", "Edit|Write", "Write"],
    correct: "Edit|Write",
    why: "`Edit|Write` matches both — `Edit` for changes to existing files, `Write` for new ones. Claude uses both verbs depending on context."
  },
  {
    id: "event3",
    label: "Hook C — Run `pytest` at the end of every session so you never miss a regression. Which event?",
    options: ["PostToolUse", "Stop", "SessionEnd", "PreToolUse"],
    correct: "SessionEnd",
    why: "SessionEnd fires once when the whole session closes — exactly the right slot for an end-of-day eval/test run. Stop fires when Claude tries to end a single turn; PostToolUse fires after every tool, far too often."
  },
  {
    id: "matcher3",
    label: "Hook C — For a SessionEnd hook that should always fire regardless of what just happened, which matcher?",
    options: ["Bash", "Edit|Write", ".*", "Stop"],
    correct: ".*",
    why: "`.*` matches everything, which is what you want for a catch-all end-of-session action. There is no per-tool filtering to do — you want pytest to run no matter what the last tool was."
  }
];

export default function Practice() {
  const [picks, setPicks] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const pick = (id, val) => { if (!submitted) setPicks({ ...picks, [id]: val }); };
  const check = () => setSubmitted(true);
  const reset = () => { setPicks({}); setSubmitted(false); };

  const score = blanks.filter(b => picks[b.id] === b.correct).length;
  const answered = Object.keys(picks).length;

  const ev = (id) => picks[id] || "____";

  return (
    <div style={{ maxWidth: 860, margin: '40px auto', fontFamily: 'system-ui' }}>
      <h3>Assemble the Hooks Block</h3>
      <p style={{ background: '#f8f9fa', padding: 16, borderRadius: 8, lineHeight: 1.6 }}>
        Fill in the six blanks to build a working <code>.claude/settings.json</code> hooks block that does three things: <strong>(A)</strong> blocks destructive bash commands, <strong>(B)</strong> auto-formats Python files after edits, and <strong>(C)</strong> runs pytest at every session end.
      </p>

      {blanks.map(b => {
        const userChoice = picks[b.id];
        const correct = submitted && userChoice === b.correct;
        const wrong = submitted && userChoice && userChoice !== b.correct;
        return (
          <div key={b.id} style={{
            padding: '14px 18px', margin: '10px 0', borderRadius: 8,
            border: `2px solid ${correct ? '#198754' : wrong ? '#dc3545' : '#dee2e6'}`,
            background: correct ? '#d4edda' : wrong ? '#fff7f7' : '#fff'
          }}>
            <div style={{ marginBottom: 10 }}>{b.label}</div>
            <div>
              {b.options.map(o => (
                <button key={o} onClick={() => pick(b.id, o)} disabled={submitted} style={{
                  marginRight: 6, marginBottom: 4, padding: '6px 12px', borderRadius: 6, cursor: submitted ? 'default' : 'pointer',
                  border: `2px solid ${userChoice === o ? (submitted ? (o === b.correct ? '#198754' : '#dc3545') : '#0d6efd') : '#ccc'}`,
                  background: userChoice === o ? (submitted ? (o === b.correct ? '#198754' : '#dc3545') : '#0d6efd') : '#fff',
                  color: userChoice === o ? '#fff' : '#000', fontFamily: 'monospace', fontSize: 13
                }}>{o}</button>
              ))}
            </div>
            {submitted && (
              <div style={{ marginTop: 10, padding: 10, background: '#f0f4ff', borderRadius: 6, fontSize: 13, color: '#333' }}>
                <strong>Answer: <code>{b.correct}</code>.</strong> {b.why}
              </div>
            )}
          </div>
        );
      })}

      <div style={{ marginTop: 20, padding: 16, background: '#1e1e1e', color: '#d4d4d4', borderRadius: 8, fontFamily: 'monospace', fontSize: 13, whiteSpace: 'pre-wrap', overflow: 'auto' }}>
{`{
  "hooks": {
    "${ev('event1')}": [{
      "matcher": "${ev('matcher1')}",
      "hooks": [{
        "type": "command",
        "command": "if echo \\"$CLAUDE_TOOL_INPUT\\" | grep -qE '(rm\\\\s+-rf|DROP\\\\s+TABLE|TRUNCATE)'; then echo 'BLOCKED' >&2; exit 1; fi"
      }]
    }],
    "${ev('event2')}": [{
      "matcher": "${ev('matcher2')}",
      "hooks": [{
        "type": "command",
        "command": "ruff format \\"$CLAUDE_FILE_PATH\\" 2>/dev/null || true"
      }]
    }],
    "${ev('event3')}": [{
      "matcher": "${ev('matcher3')}",
      "hooks": [{
        "type": "command",
        "command": "pytest -q >> .claude/test-log.txt 2>&1"
      }]
    }]
  }
}`}
      </div>

      {!submitted && (
        <button onClick={check} disabled={answered < blanks.length} style={{
          marginTop: 16, padding: '10px 24px', borderRadius: 6, border: 'none',
          background: '#198754', color: '#fff', cursor: answered < blanks.length ? 'default' : 'pointer',
          opacity: answered < blanks.length ? 0.5 : 1
        }}>Check My Hooks ({answered}/{blanks.length})</button>
      )}

      {submitted && (
        <div style={{ marginTop: 16, padding: 16, background: '#f0f4ff', borderRadius: 8, borderLeft: '4px solid #0d6efd' }}>
          <p><strong>Score: {score} / {blanks.length}</strong></p>
          <p>{score === blanks.length ? "Perfect — you can wire requirements into plumbing instead of leaving them as suggestions in CLAUDE.md." : score >= blanks.length - 1 ? "Good — re-read the lifecycle-event table. PreToolUse vs PostToolUse vs SessionEnd is the most common confusion." : "Review the lesson. Hooks are the single most powerful feature in Lessons 5-7; getting the lifecycle event wrong is the difference between a block and a notification."}</p>
          <button onClick={reset} style={{ marginTop: 12, padding: '10px 24px', borderRadius: 6, border: 'none', background: '#0d6efd', color: '#fff', cursor: 'pointer' }}>Try Again</button>
        </div>
      )}
    </div>
  );
}

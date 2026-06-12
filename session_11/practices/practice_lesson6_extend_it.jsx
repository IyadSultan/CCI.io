import React, { useState } from 'react';

// Correct order is by `order` field (1..5). Steps shown scrambled.
const STEPS = [
  {
    id: 'view',
    order: 3,
    label: 'Write the view (dashboard/views.py)',
    why: 'Step 3: the Python that runs on a request — it reads TriageEvent data and counts it up.',
  },
  {
    id: 'startapp',
    order: 1,
    label: 'python manage.py startapp dashboard',
    why: 'Step 1: create the app on disk. The dashboard folder appears next to triage/.',
  },
  {
    id: 'url',
    order: 5,
    label: 'Wire the URL (app urls.py + include in project urls.py)',
    why: "Step 5: give the app its own urls.py, then include it from er_triage/urls.py so /dashboard/ routes in.",
  },
  {
    id: 'installed',
    order: 2,
    label: 'Add "dashboard" to INSTALLED_APPS',
    why: 'Step 2: the line everyone forgets. Without it the project never sees the app or its templates.',
  },
  {
    id: 'template',
    order: 4,
    label: 'Write the template (dashboard/templates/dashboard/dashboard.html)',
    why: 'Step 4: the HTML, at the doubled-folder path, extending triage/base.html.',
  },
];

const DEBUG_OPTIONS = [
  {
    id: 'installed',
    label: 'Forgot to add "dashboard" to INSTALLED_APPS',
    correct: true,
    why: 'Correct cause. Django does not look inside apps it has not been told about — its templates are never found.',
  },
  {
    id: 'doubled',
    label: 'Template saved at dashboard/templates/dashboard.html (missing the doubled folder)',
    correct: true,
    why: 'Correct cause. render() asks for "dashboard/dashboard.html", so the file must live at dashboard/templates/dashboard/dashboard.html.',
  },
  {
    id: 'restart',
    label: 'The server just needs a restart',
    correct: false,
    why: 'Distractor. runserver auto-reloads; a restart will not fix a missing registration or a wrong template path.',
  },
  {
    id: 'python',
    label: 'Wrong Python version installed',
    correct: false,
    why: 'Distractor. A version mismatch causes import/boot errors, not a silent or TemplateDoesNotExist page.',
  },
  {
    id: 'migration',
    label: 'A missing database migration',
    correct: false,
    why: 'Distractor. The dashboard is read-only and adds no model, so there is nothing to migrate.',
  },
];

export default function Practice() {
  const [clickOrder, setClickOrder] = useState([]); // array of step ids in click order
  const [debugPicks, setDebugPicks] = useState([]); // ids
  const [checked, setChecked] = useState(false);

  const clickStep = (id) => {
    if (checked) return;
    setClickOrder((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleDebug = (id) => {
    if (checked) return;
    setDebugPicks((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const reset = () => {
    setClickOrder([]);
    setDebugPicks([]);
    setChecked(false);
  };

  const stepById = (id) => STEPS.find((s) => s.id === id);

  // Score the ordering: each step's chosen position vs its correct order.
  const orderingScore = clickOrder.reduce((acc, id, idx) => {
    const step = stepById(id);
    return acc + (step.order === idx + 1 ? 1 : 0);
  }, 0);

  const debugCorrectIds = DEBUG_OPTIONS.filter((o) => o.correct).map((o) => o.id);
  const debugScore =
    debugPicks.filter((id) => debugCorrectIds.includes(id)).length -
    debugPicks.filter((id) => !debugCorrectIds.includes(id)).length;
  const debugPerfect =
    debugPicks.length === 2 &&
    debugPicks.every((id) => debugCorrectIds.includes(id));

  const allOrdered = clickOrder.length === STEPS.length;
  const canCheck = allOrdered && debugPicks.length > 0;

  const btn = (bg, enabled) => ({
    background: enabled ? bg : '#adb5bd',
    color: '#fff',
    border: 'none',
    padding: '10px 22px',
    borderRadius: 6,
    fontSize: 16,
    cursor: enabled ? 'pointer' : 'not-allowed',
  });

  return (
    <div
      style={{
        maxWidth: 820,
        margin: '40px auto',
        fontFamily: 'system-ui',
        padding: '0 16px',
        color: '#212529',
      }}
    >
      <h1 style={{ fontSize: 26 }}>Add a New Django App — In the Right Order</h1>

      <p
        style={{
          background: '#f8f9fa',
          padding: 16,
          borderRadius: 8,
          lineHeight: 1.5,
        }}
      >
        Adding a feature to a Django project is the same five-step rhythm every
        time. Below the steps are <strong>scrambled</strong>. Click them in the
        order you would actually run them — each click stamps a number badge. Then
        in <strong>Debug it</strong>, pick the <strong>two</strong> most likely
        reasons a new <code>/dashboard/</code> page shows nothing. Press{' '}
        <strong>Check</strong> when ready.
      </p>

      <h2 style={{ fontSize: 19 }}>Part A — Order the five steps</h2>
      {STEPS.map((s) => {
        const pos = clickOrder.indexOf(s.id);
        const placed = pos !== -1;
        const correctPlace = checked && s.order === pos + 1;
        const wrongPlace = checked && placed && s.order !== pos + 1;
        const border = !checked
          ? placed
            ? '2px solid #0d6efd'
            : '2px solid #dee2e6'
          : correctPlace
          ? '2px solid #198754'
          : wrongPlace
          ? '2px solid #dc3545'
          : '2px solid #dee2e6';
        const bg = !checked
          ? '#ffffff'
          : correctPlace
          ? '#d4edda'
          : wrongPlace
          ? '#f8d7da'
          : '#ffffff';
        return (
          <div
            key={s.id}
            onClick={() => clickStep(s.id)}
            style={{
              border,
              background: bg,
              borderRadius: 8,
              padding: 14,
              marginBottom: 12,
              cursor: checked ? 'default' : 'pointer',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 12,
            }}
          >
            <span
              style={{
                minWidth: 30,
                height: 30,
                borderRadius: '50%',
                background: placed ? '#0d6efd' : '#e9ecef',
                color: placed ? '#fff' : '#6c757d',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
              }}
            >
              {placed ? pos + 1 : '?'}
            </span>
            <div>
              <code style={{ fontSize: 15 }}>{s.label}</code>
              {checked && (
                <div style={{ marginTop: 6, fontSize: 14 }}>
                  {correctPlace ? (
                    <span style={{ color: '#198754', fontWeight: 600 }}>
                      Right place.
                    </span>
                  ) : (
                    <span style={{ color: '#dc3545', fontWeight: 600 }}>
                      Belongs at position {s.order}.
                    </span>
                  )}{' '}
                  {s.why}
                </div>
              )}
            </div>
          </div>
        );
      })}

      <h2 style={{ fontSize: 19, marginTop: 26 }}>Part B — Debug it</h2>
      <p style={{ fontSize: 15, marginTop: 0 }}>
        Your <code>/dashboard/</code> page shows nothing, or you get{' '}
        <code>TemplateDoesNotExist</code>. Pick the{' '}
        <strong>two most likely causes</strong>.
      </p>
      {DEBUG_OPTIONS.map((o) => {
        const picked = debugPicks.includes(o.id);
        const border = !checked
          ? picked
            ? '2px solid #0d6efd'
            : '2px solid #dee2e6'
          : o.correct
          ? '2px solid #198754'
          : picked
          ? '2px solid #dc3545'
          : '2px solid #dee2e6';
        const bg = !checked
          ? '#ffffff'
          : o.correct
          ? '#d4edda'
          : picked
          ? '#f8d7da'
          : '#ffffff';
        return (
          <div
            key={o.id}
            onClick={() => toggleDebug(o.id)}
            style={{
              border,
              background: bg,
              borderRadius: 8,
              padding: 14,
              marginBottom: 12,
              cursor: checked ? 'default' : 'pointer',
            }}
          >
            <div style={{ fontWeight: 600 }}>
              {picked ? '☑' : '☐'} {o.label}
            </div>
            {checked && (
              <div style={{ marginTop: 6, fontSize: 14 }}>{o.why}</div>
            )}
          </div>
        );
      })}

      <div style={{ marginTop: 8 }}>
        {!checked ? (
          <button
            onClick={() => setChecked(true)}
            disabled={!canCheck}
            style={btn('#198754', canCheck)}
          >
            Check
          </button>
        ) : (
          <button onClick={reset} style={btn('#0d6efd', true)}>
            Try Again
          </button>
        )}
      </div>

      {checked && (
        <div
          style={{
            marginTop: 20,
            background: '#f0f4ff',
            borderLeft: '4px solid #0d6efd',
            padding: 16,
            borderRadius: 6,
          }}
        >
          <strong>
            Ordering: {orderingScore} of {STEPS.length} steps in the right place.
            Debug: {debugPerfect ? 'both causes correct.' : 'review your picks.'}
          </strong>
          <div style={{ marginTop: 8 }}>
            The loop, every time: startapp → INSTALLED_APPS → view → template → url.
            When a Django change does nothing, it is almost always the forgotten
            INSTALLED_APPS line or the doubled template folder — check those two
            before debugging anything deeper.
          </div>
        </div>
      )}
    </div>
  );
}

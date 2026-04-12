import React, { useState } from 'react';

const parameters = [
  {
    name: 'learning_rate',
    label: 'Learning Rate',
    options: [
      { value: '0.1', label: '0.1 (very high)', effect: { memory: 0, time: 1, risk: 'Catastrophic forgetting — destroys pre-trained knowledge', quality: 'Very Poor' } },
      { value: '5e-4', label: '5e-4 (high for fine-tuning)', effect: { memory: 0, time: 1, risk: 'May overwrite pre-trained weights too aggressively', quality: 'Risky' } },
      { value: '2e-5', label: '2e-5 (recommended)', effect: { memory: 0, time: 1, risk: 'Balanced — preserves pre-trained knowledge while learning the task', quality: 'Good' } },
      { value: '1e-7', label: '1e-7 (very low)', effect: { memory: 0, time: 3, risk: 'Too slow to learn — model barely changes from base', quality: 'Poor (undertrained)' } }
    ],
    correct: '2e-5',
    explanation: 'For fine-tuning, 2e-5 is the standard starting point. It is small enough to preserve the pre-trained foundation but large enough to adapt the model to your specific task within a few epochs.'
  },
  {
    name: 'num_train_epochs',
    label: 'Number of Epochs',
    options: [
      { value: '1', label: '1 epoch', effect: { memory: 0, time: 0.5, risk: 'May not see enough examples to learn the task well', quality: 'Undertrained' } },
      { value: '3', label: '3 epochs (recommended)', effect: { memory: 0, time: 1, risk: 'Good balance — sees each example 3 times', quality: 'Good' } },
      { value: '10', label: '10 epochs', effect: { memory: 0, time: 3.3, risk: 'High risk of overfitting — memorizes training data', quality: 'Risky (overfit)' } },
      { value: '50', label: '50 epochs', effect: { memory: 0, time: 16.7, risk: 'Extreme overfitting guaranteed on small datasets', quality: 'Very Poor' } }
    ],
    correct: '3',
    explanation: 'For fine-tuning with 1,000-4,000 examples, 3-5 epochs is standard. The model sees each example multiple times to learn patterns. Too many epochs leads to overfitting, especially on smaller datasets like radiology reports.'
  },
  {
    name: 'per_device_train_batch_size',
    label: 'Batch Size',
    options: [
      { value: '1', label: '1 (minimum)', effect: { memory: 2, time: 4, risk: 'Very noisy gradient updates, slow training', quality: 'Unstable' } },
      { value: '4', label: '4 (recommended for T4)', effect: { memory: 6, time: 1, risk: 'Good balance of speed and GPU memory for T4 Colab', quality: 'Good' } },
      { value: '16', label: '16 (large)', effect: { memory: 14, time: 0.4, risk: 'May run out of memory on T4 (15GB) with larger models', quality: 'Good if it fits' } },
      { value: '64', label: '64 (very large)', effect: { memory: 48, time: 0.15, risk: 'Will crash — exceeds T4 GPU memory (15GB VRAM)', quality: 'Crash' } }
    ],
    correct: '4',
    explanation: 'Batch size determines how many examples are processed in parallel. On a T4 GPU (15GB VRAM) with flan-t5-small, batch size 4 uses about 6GB — leaving room for the model and optimizer. Batch size 64 would require ~48GB, far exceeding the T4.'
  },
  {
    name: 'weight_decay',
    label: 'Weight Decay (Regularization)',
    options: [
      { value: '0.0', label: '0.0 (no regularization)', effect: { memory: 0, time: 1, risk: 'No protection against overfitting', quality: 'Risky on small data' } },
      { value: '0.01', label: '0.01 (recommended)', effect: { memory: 0, time: 1, risk: 'Mild regularization — helps prevent overfitting', quality: 'Good' } },
      { value: '0.5', label: '0.5 (aggressive)', effect: { memory: 0, time: 1, risk: 'Over-regularized — model cannot learn effectively', quality: 'Undertrained' } },
      { value: '1.0', label: '1.0 (extreme)', effect: { memory: 0, time: 1, risk: 'Weights are heavily penalized — severe underfitting', quality: 'Very Poor' } }
    ],
    correct: '0.01',
    explanation: 'Weight decay adds a small penalty for large weights, acting as regularization against overfitting. 0.01 is a standard value for fine-tuning — it gently discourages memorization without preventing learning.'
  }
];

export default function Practice() {
  const [selections, setSelections] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (paramName, value) => {
    if (submitted) return;
    setSelections({ ...selections, [paramName]: value });
  };

  const getSelectedEffect = (param) => {
    const sel = selections[param.name];
    if (!sel) return null;
    return param.options.find(o => o.value === sel)?.effect;
  };

  const getScore = () => parameters.filter(p => selections[p.name] === p.correct).length;

  const totalMemory = parameters.reduce((sum, p) => {
    const effect = getSelectedEffect(p);
    return sum + (effect?.memory || 0);
  }, 0);

  const totalTimeMultiplier = parameters.reduce((prod, p) => {
    const effect = getSelectedEffect(p);
    return prod * (effect?.time || 1);
  }, 1);

  const estimatedMinutes = Math.round(15 * totalTimeMultiplier);

  return (
    <div style={{ maxWidth: 800, margin: '40px auto', fontFamily: 'system-ui' }}>
      <h2>Practice: Training Configuration Builder</h2>
      <p style={{ color: '#666', marginBottom: 8 }}>Configure hyperparameters for fine-tuning <strong>google/flan-t5-small</strong> on 3,000 radiology reports using a <strong>T4 GPU</strong> (15GB VRAM) in Google Colab.</p>

      {parameters.map((param, pi) => (
        <div key={param.name} style={{ marginBottom: 20, padding: 16, background: '#fff', borderRadius: 8, border: '1px solid #dee2e6' }}>
          <p style={{ fontWeight: 'bold', marginBottom: 8, fontSize: 16 }}>{pi + 1}. {param.label}</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {param.options.map(opt => (
              <div key={opt.value} onClick={() => handleSelect(param.name, opt.value)} style={{
                padding: '10px 14px', borderRadius: 6, cursor: submitted ? 'default' : 'pointer',
                border: `2px solid ${submitted ? (opt.value === param.correct ? '#198754' : opt.value === selections[param.name] ? '#dc3545' : '#dee2e6') : selections[param.name] === opt.value ? '#0d6efd' : '#dee2e6'}`,
                background: submitted ? (opt.value === param.correct ? '#d4edda' : opt.value === selections[param.name] && opt.value !== param.correct ? '#f8d7da' : '#fff') : selections[param.name] === opt.value ? '#e7f1ff' : '#fff',
                fontSize: 14
              }}>{opt.label}</div>
            ))}
          </div>
          {selections[param.name] && !submitted && (
            <div style={{ marginTop: 8, padding: 8, background: '#f8f9fa', borderRadius: 6, fontSize: 13 }}>
              <strong>Impact:</strong> {getSelectedEffect(param)?.risk} | <strong>Expected quality:</strong> {getSelectedEffect(param)?.quality}
            </div>
          )}
          {submitted && (
            <div style={{ marginTop: 8, padding: 8, background: '#f0f4ff', borderRadius: 6, fontSize: 13, borderLeft: '3px solid #0d6efd' }}>
              {param.explanation}
            </div>
          )}
        </div>
      ))}

      {Object.keys(selections).length === parameters.length && !submitted && (
        <div style={{ padding: 16, background: '#f8f9fa', borderRadius: 8, marginBottom: 16, border: '1px solid #dee2e6' }}>
          <h4 style={{ marginTop: 0 }}>Estimated Training Configuration</h4>
          <p>GPU Memory Usage: ~{totalMemory}GB / 15GB (T4) {totalMemory > 15 ? ' -- WILL CRASH' : ' -- fits'}</p>
          <p>Estimated Training Time: ~{estimatedMinutes} minutes</p>
        </div>
      )}

      {!submitted && (
        <button onClick={() => setSubmitted(true)} disabled={Object.keys(selections).length < parameters.length} style={{ padding: '10px 24px', borderRadius: 6, border: 'none', background: '#198754', color: '#fff', cursor: 'pointer', fontSize: 16, opacity: Object.keys(selections).length < parameters.length ? 0.5 : 1 }}>
          Check Configuration
        </button>
      )}

      {submitted && (
        <div style={{ marginTop: 20, padding: 16, background: '#f0f4ff', borderRadius: 8, borderLeft: '4px solid #0d6efd' }}>
          <h3>Score: {getScore()} / {parameters.length} optimal choices</h3>
          <p>{getScore() >= 3 ? "Great configuration instinct! In the lab you will use these exact parameters to fine-tune flan-t5-small." : "Review what each hyperparameter does — understanding these is essential for successful fine-tuning."}</p>
          <button onClick={() => { setSelections({}); setSubmitted(false); }} style={{ marginTop: 8, padding: '8px 20px', borderRadius: 6, border: 'none', background: '#0d6efd', color: '#fff', cursor: 'pointer' }}>Try Again</button>
        </div>
      )}
    </div>
  );
}
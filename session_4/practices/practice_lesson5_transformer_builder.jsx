import React, { useState } from 'react';

const components = [
  { id: 'embed', name: 'Token Embedding', description: 'Converts each token (word/sub-word) into a dense numerical vector. The vocabulary maps text to integers, and the embedding layer maps integers to learned vectors (e.g., 768 dimensions).', correctOrder: 1 },
  { id: 'pos', name: 'Positional Encoding', description: 'Adds position information to each token embedding. Without this, the model cannot distinguish word order — "patient treated doctor" would equal "doctor treated patient."', correctOrder: 2 },
  { id: 'attn', name: 'Multi-Head Self-Attention', description: 'Each token computes Query, Key, Value vectors. Attention scores determine which tokens are relevant to each other. Multiple heads capture different relationship types (syntax, semantics, long-range).', correctOrder: 3 },
  { id: 'norm1', name: 'Layer Normalization (post-attention)', description: 'Normalizes activations after attention to stabilize training. Applied with a residual connection — the input is added back to the output (skip connection) to preserve information flow.', correctOrder: 4 },
  { id: 'ff', name: 'Feed-Forward Network', description: 'Two linear layers with a nonlinear activation (GELU/ReLU) in between. Transforms each token representation independently. This is where individual token features are refined.', correctOrder: 5 },
  { id: 'norm2', name: 'Layer Normalization (post-FFN)', description: 'Second normalization with residual connection after the feed-forward network. Together with the first, these form one complete transformer block. Multiple blocks are stacked.', correctOrder: 6 },
  { id: 'output', name: 'Output Projection (LM Head)', description: 'A linear layer that maps the final hidden state to vocabulary-sized logits. Softmax converts these to probabilities over all tokens. The highest probability token is the prediction.', correctOrder: 7 }
];

export default function Practice() {
  const [arrangement, setArrangement] = useState(() => {
    const shuffled = [...components].sort(() => Math.random() - 0.5);
    return shuffled.map(c => c.id);
  });
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [checked, setChecked] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  const handleClick = (idx) => {
    if (checked) return;
    if (selectedIdx === null) {
      setSelectedIdx(idx);
    } else {
      const newArr = [...arrangement];
      [newArr[selectedIdx], newArr[idx]] = [newArr[idx], newArr[selectedIdx]];
      setArrangement(newArr);
      setSelectedIdx(null);
    }
  };

  const getComponent = (id) => components.find(c => c.id === id);

  const getScore = () => {
    return arrangement.reduce((score, id, idx) => {
      const comp = getComponent(id);
      return score + (comp.correctOrder === idx + 1 ? 1 : 0);
    }, 0);
  };

  const correctOrder = [...components].sort((a, b) => a.correctOrder - b.correctOrder);

  return (
    <div style={{ maxWidth: 750, margin: '40px auto', fontFamily: 'system-ui' }}>
      <h2>Practice: Transformer Architecture Builder</h2>
      <p style={{ color: '#666', marginBottom: 8 }}>Arrange the transformer components in the correct order (input at top, output at bottom). Click two components to swap them. Click a component name to see its description.</p>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ background: '#e9ecef', padding: '6px 16px', borderRadius: '8px 8px 0 0', fontSize: 13, fontWeight: 'bold', color: '#666' }}>INPUT: Raw text tokens</div>
        <div style={{ width: 2, height: 12, background: '#adb5bd' }} />
      </div>

      {arrangement.map((id, idx) => {
        const comp = getComponent(id);
        const isCorrect = checked && comp.correctOrder === idx + 1;
        const isWrong = checked && comp.correctOrder !== idx + 1;
        return (
          <div key={id}>
            <div onClick={() => handleClick(idx)} style={{
              padding: '14px 18px', margin: '4px 0', borderRadius: 8, cursor: checked ? 'default' : 'pointer',
              border: `2px solid ${checked ? (isCorrect ? '#198754' : '#dc3545') : selectedIdx === idx ? '#0d6efd' : '#dee2e6'}`,
              background: checked ? (isCorrect ? '#d4edda' : '#f8d7da') : selectedIdx === idx ? '#e7f1ff' : '#fff',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <span style={{ fontWeight: 'bold' }}>
                <span style={{ color: '#666', marginRight: 8 }}>{idx + 1}.</span>
                {comp.name}
              </span>
              <span onClick={(e) => { e.stopPropagation(); setExpandedId(expandedId === id ? null : id); }} style={{ cursor: 'pointer', color: '#0d6efd', fontSize: 13 }}>
                {expandedId === id ? 'hide' : 'info'}
              </span>
            </div>
            {expandedId === id && (
              <div style={{ padding: '8px 18px', margin: '0 0 4px 0', background: '#f8f9fa', borderRadius: '0 0 8px 8px', fontSize: 13, lineHeight: 1.5, borderLeft: '3px solid #0d6efd' }}>
                {comp.description}
              </div>
            )}
            {idx < arrangement.length - 1 && (
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{ width: 2, height: 8, background: '#adb5bd' }} />
              </div>
            )}
          </div>
        );
      })}

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 8 }}>
        <div style={{ width: 2, height: 12, background: '#adb5bd' }} />
        <div style={{ background: '#e9ecef', padding: '6px 16px', borderRadius: '0 0 8px 8px', fontSize: 13, fontWeight: 'bold', color: '#666' }}>OUTPUT: Next token prediction</div>
      </div>

      <div style={{ marginTop: 20, textAlign: 'center' }}>
        {!checked && (
          <button onClick={() => setChecked(true)} style={{ padding: '10px 24px', borderRadius: 6, border: 'none', background: '#198754', color: '#fff', cursor: 'pointer', fontSize: 16 }}>
            Check Order
          </button>
        )}
      </div>

      {checked && (
        <div style={{ marginTop: 20, padding: 16, background: '#f0f4ff', borderRadius: 8, borderLeft: '4px solid #0d6efd' }}>
          <h3>Score: {getScore()} / {components.length} components in correct position</h3>
          <p style={{ marginBottom: 8 }}>Correct order:</p>
          <ol style={{ fontSize: 14, lineHeight: 1.8 }}>
            {correctOrder.map(c => (
              <li key={c.id}><strong>{c.name}</strong></li>
            ))}
          </ol>
          <p style={{ marginTop: 12, fontStyle: 'italic', fontSize: 14 }}>
            This sequence repeats for each transformer block. A model like BERT has 12 blocks, GPT-3 has 96 blocks. The microGPT you will build in the lab has 6 blocks — the same architecture, just smaller.
          </p>
          <button onClick={() => {
            setArrangement([...components].sort(() => Math.random() - 0.5).map(c => c.id));
            setChecked(false); setSelectedIdx(null); setExpandedId(null);
          }} style={{ marginTop: 8, padding: '8px 20px', borderRadius: 6, border: 'none', background: '#0d6efd', color: '#fff', cursor: 'pointer' }}>Shuffle & Try Again</button>
        </div>
      )}
    </div>
  );
}
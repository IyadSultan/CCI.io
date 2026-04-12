---
layout: page
title: "Lesson 5: Build a Language Model from Scratch (microGPT)"
permalink: /session-04/lesson-5-instructions/
---

<style>.site-nav{display:none!important}.site-header{border-top:5px solid #00897B!important}.site-title,.site-title:visited{color:#00897B!important;font-weight:800!important}.back-btn{display:inline-flex;align-items:center;gap:.3rem;font-size:.8rem;font-weight:600;color:#00897B;text-decoration:none;padding:.35rem .65rem;border-radius:.4rem;border:1px solid #B2DFDB;background:#E0F2F1;margin-bottom:1rem;transition:all .15s}.back-btn:hover{background:#B2DFDB}</style>

<a class="back-btn" href="{{ site.baseurl }}/session-04/">&#8249; Back to Session 4</a>

# CCI Session 4 -- Lesson 5: Build a Language Model from Scratch -- microGPT

**Estimated time:** 25 minutes (12 min content / 13 min lab)
**Lab mode:** Guided step-by-step (Google Colab)

---

## Instructor Introduction

For the entire course so far, you have been using language models as black boxes -- you send text in and get text out, and something magical happens in between. Today we open that box. You are going to build a tiny GPT language model from scratch, following Andrej Karpathy's nanoGPT code. This is the same fundamental architecture that powers GPT-4o, Claude, and every other large language model you have used -- the only difference is scale. Ours will be about a thousand times smaller. But by building it yourself, you will understand what tokens really are, how attention works, and why the training loop produces increasingly coherent text. This understanding will make you a better prompt engineer, a better evaluator of AI outputs, and a more informed clinical AI developer at KHCC.

---

## NotebookLM Summary

Every modern large language model, from GPT-4o to Claude to open-source models like Llama, is built on the Transformer architecture. Understanding its internal components demystifies what these models actually do when they generate text. The process begins with token embeddings: each token in the vocabulary is mapped to a dense vector of numbers (typically 64 to 768 dimensions in our small model, thousands in production models). These vectors are learned during training and capture semantic meaning -- tokens that appear in similar contexts end up with similar vectors. Positional encodings are added to these embeddings so the model knows the order of tokens in the sequence, since the Transformer processes all positions simultaneously rather than sequentially.

The core innovation of the Transformer is the self-attention mechanism. At each position in the sequence, the model computes three vectors: a Query (what am I looking for?), a Key (what do I contain?), and a Value (what information do I carry?). Attention scores are computed by taking the dot product of each Query with every Key, which produces a matrix of relevance scores indicating how much each token should attend to every other token. These scores are scaled, masked (so that a token can only attend to tokens before it, not after -- this is the "causal" or "autoregressive" property), and passed through a softmax to create a probability distribution. The Values are then weighted by these probabilities to produce the attention output. Multi-head attention runs this process multiple times in parallel with different learned projections, allowing the model to attend to different types of relationships simultaneously -- one head might capture syntactic structure while another captures semantic similarity.

After attention, the output passes through a feed-forward network -- a simple two-layer neural network applied independently at each position -- followed by layer normalization that stabilizes training by normalizing activations. A Transformer block consists of one multi-head attention layer and one feed-forward layer, and multiple blocks are stacked to create the full model. Our microGPT will use 4 to 6 blocks, while GPT-4o uses many more.

The training loop follows a straightforward pattern. In the forward pass, the model takes a sequence of tokens and predicts the next token at each position. The cross-entropy loss measures how far the model's predictions are from the actual next tokens in the training data -- a loss of 4.0 means the model is essentially guessing randomly, while a loss below 1.5 indicates it has learned meaningful patterns. In the backward pass, gradients of the loss with respect to every parameter in the model are computed through backpropagation. The optimizer (typically AdamW) then updates each parameter by a small step in the direction that reduces the loss. This cycle repeats thousands of times.

Karpathy's nanoGPT implementation captures the complete GPT architecture in approximately 300 lines of Python. You can train it on a small text corpus -- Shakespeare, Wikipedia excerpts, or even a collection of sample clinical text -- and watch the generated output evolve from random character soup in the first few iterations to increasingly coherent sentences after a few thousand steps. The progression is striking: early outputs are gibberish, then recognizable words appear, then grammatical phrases, and finally passages that mimic the style and vocabulary of the training data.

The connection to the models you use daily is direct and exact. GPT-4o, Claude, and Llama all use this same architecture: token embeddings, positional encodings, stacked Transformer blocks with multi-head self-attention and feed-forward networks, and autoregressive next-token prediction. The difference is entirely one of scale -- more parameters, more training data, more compute, and additional techniques like reinforcement learning from human feedback. Understanding this architecture at a small scale gives you intuition for why large models behave the way they do: why they sometimes hallucinate (the next-token prediction objective optimizes for plausibility, not truthfulness), why context window limits exist (the attention mechanism has quadratic memory cost with sequence length), and why prompt engineering works (you are shaping the probability distribution over next tokens by carefully choosing your input tokens).

> **NotebookLM tip:** Paste this summary into [NotebookLM](https://notebooklm.google.com), add any reference PDFs, and use *Audio Overview* to generate a podcast-style summary students can listen to before or after class.

---

## Student Study Guide

### Before Class -- Preparation (15-20 min)

- **Watch:** The first 10 minutes of Andrej Karpathy's "Let's build GPT: from scratch, in code, spelled out" to get a visual overview of the architecture: <https://www.youtube.com/watch?v=kCc8FmEb1nY>
- **Skim:** The "Attention Is All You Need" paper abstract and introduction (you do not need to read the full paper): <https://arxiv.org/abs/1706.03762>
- **Warm-up question:** When you type a prompt into ChatGPT or Claude and it generates a response, it produces one token at a time from left to right. Why do you think the model generates text sequentially rather than all at once? Think about what information the model needs at each step.

### During Class -- What to Focus On

1. **The self-attention mechanism** -- this is the single most important concept. Understand what Query, Key, and Value vectors represent, and how the dot product between Q and K determines which tokens attend to which other tokens.
2. **The training loop** -- follow the cycle: forward pass (predict next tokens), compute loss (how wrong were the predictions), backward pass (compute gradients), optimizer step (update parameters). Every AI model you have used was trained this way.
3. **The connection to clinical AI** -- when a model hallucinates a drug interaction that does not exist, it is because the next-token prediction objective found that sequence plausible. Understanding this mechanism helps you design better safeguards for clinical applications at KHCC.
4. **Scale as the only difference** -- our microGPT and GPT-4o share the exact same architecture. The difference is the number of parameters, the volume of training data, and the compute budget.

**Common traps:**

- Getting lost in the linear algebra details and missing the intuition. Focus on what attention does conceptually (lets each token decide which other tokens are relevant) before worrying about the matrix multiplication specifics.
- Expecting the tiny model to produce high-quality text. With only a few million parameters trained on a small corpus, the output will be coherent at the phrase level but not at the paragraph level -- and that is exactly the point.

### After Class -- Practice & Lab Work

**Lab work (required):**

In the provided Colab notebook, complete the guided exercises:

1. Read through the microGPT code and identify the five key components: token embedding layer, positional encoding, self-attention block, feed-forward block, and the output projection layer.
2. Train the model on the provided text corpus for 5,000 iterations and observe how the loss decreases over time.
3. Generate text samples at iteration 0, 1000, 3000, and 5000. Note how the output quality improves from random characters to recognizable patterns.
4. Print the attention weights for a sample input and observe which tokens attend most strongly to which other tokens.
5. Change the model size (number of layers, number of attention heads, embedding dimension) and observe how it affects training speed and output quality.

**Extra practice (optional):**

- Modify the training data to use a small collection of sample clinical sentences (drug names, diagnosis phrases, anatomy terms) and observe whether the model learns to generate clinical-sounding text.
- Double the number of attention heads from 4 to 8 while keeping the embedding dimension the same. Does this improve the model's ability to capture different types of relationships in the text?

**Self-check questions:**

1. In your own words, explain what the self-attention mechanism does. Why is it called "self" attention?
2. What does a cross-entropy loss of 4.0 mean versus a loss of 1.0? What is the model learning as the loss decreases?
3. A KHCC clinical AI system powered by an LLM generates a treatment recommendation that includes a drug-drug interaction that does not exist. Using your understanding of how language models work (next-token prediction), explain why this hallucination might occur and what strategies could mitigate it.

### Resources

| Resource | Link |
|----------|------|
| Karpathy -- Let's Build GPT (YouTube) | <https://www.youtube.com/watch?v=kCc8FmEb1nY> |
| nanoGPT GitHub Repository | <https://github.com/karpathy/nanoGPT> |
| Attention Is All You Need (Vaswani et al., 2017) | <https://arxiv.org/abs/1706.03762> |
| The Illustrated Transformer (Jay Alammar) | <https://jalammar.github.io/illustrated-transformer/> |
| 3Blue1Brown -- Attention in Transformers (YouTube) | <https://www.youtube.com/watch?v=eMlx5fFNoYc> |
| HuggingFace -- How Do Transformers Work | <https://huggingface.co/docs/transformers/index> |

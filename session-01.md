---
layout: page
title: Session 1
permalink: /session-01/
---

# Session 1: Foundations, Transformers, and Prompt Engineering

Session goal: understand how LLMs work, write safer prompts for clinical tasks, and produce structured outputs for EHR-ready workflows.

## Lesson 1: The LLM Revolution in Medicine

- **NotebookLM link:** [Open lesson](https://notebooklm.google.com/notebook/214ec973-0f49-4647-bc3c-3f2cb5838470?artifactId=9b46dbcd-14f6-476e-be2f-856510779a55)
- **Instructions:**
  - Learn what LLMs can and cannot do in oncology settings.
  - Compare high-value use cases (summarization, extraction, patient communication drafting).
  - Discuss safety boundaries and human-in-the-loop review.
- **Practice:**
  - Pick one oncology note and ask an LLM to summarize it in 6 bullet points.
  - Then ask for a "risk list" of possible missing facts.
- **Quiz:**
  1. Why is human review required before clinical use?
     - A) It makes the answer shorter
     - B) It reduces model cost
     - C) It catches clinical errors and unsafe outputs **(Correct)**
     - D) It increases token length

## Lesson 2: Hallucinations and Sensitivity

- **NotebookLM link:** [Open lesson](https://notebooklm.google.com/notebook/214ec973-0f49-4647-bc3c-3f2cb5838470?artifactId=4641aae7-6ea6-40b2-8d24-e4bfe2e80751)
- **Instructions:**
  - Define hallucination in simple clinical terms.
  - Learn how sensitivity/specificity thinking applies to model outputs.
  - Review grounding techniques (ask for evidence, source, and confidence).
- **Practice:**
  - Use one prompt without grounding and one with grounding.
  - Compare which output is safer and explain why.
- **Quiz:**
  1. What is a hallucination?
     - A) A correct answer in JSON
     - B) A fluent but incorrect or unsupported model statement **(Correct)**
     - C) A longer context window
     - D) A formatting error only

## Lesson 3: Prompting Patterns

- **NotebookLM link:** [Open lesson](https://notebooklm.google.com/notebook/214ec973-0f49-4647-bc3c-3f2cb5838470?artifactId=b14d58bd-f8e5-49ff-a530-e7a70b0ad9c4)
- **Instructions:**
  - Learn core patterns: zero-shot, few-shot, role prompting, and step-by-step constraints.
  - Understand when to use examples in prompts.
  - Use prompt templates for repeatable results.
- **Practice:**
  - Write 3 prompts for the same task: zero-shot, few-shot, and role-based.
  - Test them on one oncology discharge summary.
- **Quiz:**
  1. What is few-shot prompting?
     - A) Prompting without examples
     - B) Prompting with one or more examples to guide output style **(Correct)**
     - C) Prompting with shorter context only
     - D) Prompting with lower temperature

## Lesson 4: JSON Mode and Structured Output

- **NotebookLM link:** [Open lesson](https://notebooklm.google.com/notebook/214ec973-0f49-4647-bc3c-3f2cb5838470?artifactId=2654187c-889b-493c-9538-15ff72e5bcaf)
- **Instructions:**
  - Learn why structured output is needed for clinical pipelines.
  - Define a fixed schema for extraction (for example: diagnosis, stage, medications).
  - Validate JSON shape before using output downstream.
- **Practice:**
  - Ask the model to extract 5 fields from a sample note into JSON.
  - Add required keys and default `null` for missing values.
- **Quiz:**
  1. Why is JSON useful for EHR pipelines?
     - A) It looks nicer in chat
     - B) It is machine-readable and easy to validate **(Correct)**
     - C) It always makes outputs shorter
     - D) It removes the need for review

## Lesson 5: The ROLES Framework

- **NotebookLM link:** [Open lesson](https://notebooklm.google.com/notebook/214ec973-0f49-4647-bc3c-3f2cb5838470?artifactId=b15e8b42-8bf1-4d79-bd89-26dfa1f3290b)
- **Instructions:**
  - Use ROLES: Role, Objective, Language, Examples, Structure.
  - Build prompts with predictable sections.
  - Add clinical guardrails in every section.
- **Practice:**
  - Rewrite one weak prompt using all ROLES parts.
  - Compare output quality before and after.
- **Quiz:**
  1. In ROLES, what improves formatting consistency most directly?
     - A) Role
     - B) Objective
     - C) Structure **(Correct)**
     - D) Language

## Lesson 6: AI Prompting Revolution (Wrap-Up)

- **NotebookLM link:** [Open lesson](https://notebooklm.google.com/notebook/214ec973-0f49-4647-bc3c-3f2cb5838470?artifactId=d526af63-7c6d-4af0-b630-7db8dff9eef3)
- **Instructions:**
  - Connect all Session 1 concepts into one end-to-end workflow.
  - Review best practices for safe prompting in clinical contexts.
  - Prepare for Session 2 with a small GitHub-ready exercise.
- **Practice:**
  - Build one final prompt that includes ROLES + grounding + JSON schema.
  - Run it on a sample oncology note and review output quality.
- **Quiz:**
  1. Which final prompt design is strongest?
     - A) Free-form question only
     - B) ROLES + grounding + JSON schema + review step **(Correct)**
     - C) Long prompt without structure
     - D) Prompt with no constraints

## Session 1 Assignment

Submit one Markdown file with:

1. Your best final prompt.
2. One sample model output in JSON.
3. A short reflection (5-7 lines) on what improved output quality.

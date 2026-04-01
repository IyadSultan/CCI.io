---
layout: page
title: "Lesson 5: GitHub Fundamentals"
permalink: /session-02/lesson-5-instructions/
---

<style>.site-nav{display:none!important}.site-header{border-top:5px solid #00897B!important}.site-title,.site-title:visited{color:#00897B!important;font-weight:800!important}.back-btn{display:inline-flex;align-items:center;gap:.3rem;font-size:.8rem;font-weight:600;color:#00897B;text-decoration:none;padding:.35rem .65rem;border-radius:.4rem;border:1px solid #B2DFDB;background:#E0F2F1;margin-bottom:1rem;transition:all .15s}.back-btn:hover{background:#B2DFDB}</style>

<a class="back-btn" href="{{ site.baseurl }}/session-02/">&#8249; Back to Session 2</a>

# CCI Session 2 — Lesson 5: GitHub Fundamentals — Version Control for Clinical Notebooks
**Estimated time:** 20 minutes (10 min content / 10 min lab)
**Lab mode:** Guided step-by-step (Google Colab)

---

## Instructor Introduction

"You've now built several notebooks with real clinical logic. But what if you accidentally delete a cell? Or your teammate changes a function and breaks the pipeline? Or your boss asks, 'What changed between the version from last week and today?' This is what GitHub solves. It's not just for storing code — it's a time machine for your work. Today you'll create a GitHub account, push your first Colab notebook, and learn the concept of commits. Every notebook you build for the rest of this course will be saved to GitHub."

---

## Student Study Guide

### Before Class — Preparation (15–20 min)
- Go to [github.com](https://github.com) and create your free account (if you don't already have one)
- Warm-up question: *Have you ever lost work because you saved over a file? How would you prevent that?*

### During Class — What to Focus On
- Make sure you understand what a commit is and why commit messages matter
- Make sure you understand the difference between local and remote (GitHub)
- Make sure you can use Colab's "Save a copy in GitHub" feature
- Common trap: Don't push notebooks that contain real patient data or API keys — always check before committing

### After Class — Practice & Lab Work
- **Lab work (required):** Create your CCI course repository on GitHub. Push all 4 lab notebooks from today's session. Each push should have a descriptive commit message. Share the repo link with Dr. Iyad. Estimated time: 15 min.
- **Extra practice:** Add a README.md to your repo explaining the purpose of each notebook.
- **Self-check:**
  1. What happens if you push a notebook with patient MRNs to a public GitHub repo?
  2. How would you find an older version of your code?
  3. What is .gitignore for?

### Resources
- [GitHub Hello World Guide](https://docs.github.com/en/get-started/quickstart/hello-world)
- [Colab + GitHub Integration](https://colab.research.google.com/github/)

---

## Lab Exercise

**Title:** Setting Up GitHub and Pushing Your First Clinical Notebook
**Duration:** 10 minutes
**Mode:** Guided step-by-step

### Clinical Scenario
> KHCC's AIDI team requires all clinical notebooks to be stored in version control. You're setting up your personal GitHub repository to track all work from this course.

### Objective
By the end of this lab, students will have a GitHub account, a course repository, and at least one notebook pushed with a proper commit message.

### Setup
```
1. Open a browser tab with github.com (log in with your new account)
2. Keep Google Colab open in another tab
```

### Step-by-step instructions

1. **Create your GitHub account** (if not done in prep):
   - Go to github.com -> Sign up
   - Use your KHCC or personal email
   - Choose a professional username (e.g., `ahmad-khcc` not `xXcoder420Xx`)
2. **Create a new repository:**
   - Click the "+" icon -> New repository
   - Name: `cci-course-notebooks`
   - Description: "CCI Prompt Engineering & Clinical AI Development — Course Notebooks"
   - Select: Public (for course purposes) or Private
   - Check: "Add a README file"
   - Add .gitignore: Select "Python"
   - Click: "Create repository"
3. **Push your first notebook from Colab:**
   - Open your Session2_Lab2_Notebook_Template.ipynb in Colab
   - File -> Save a copy in GitHub
   - Select your `cci-course-notebooks` repository
   - File path: `session_2/Lab2_Notebook_Template.ipynb`
   - Commit message: "Add Session 2 Lab 2 — Clinical notebook template with 9-section structure"
   - Click: "OK"
4. **Verify on GitHub:**
   - Go to your repository on github.com
   - Navigate to the session_2 folder
   - Click on the notebook — GitHub renders .ipynb files
   - Check the commit history (clock icon)
5. **Push a second notebook** with a different commit message to see multiple commits.

### Expected output
- GitHub repository with README, .gitignore, and at least 2 notebooks in `session_2/` folder
- 3+ commits visible in the commit history (initial commit + 2 notebook pushes)

### Stretch challenge
Edit the README.md on GitHub to include a table listing your session 2 notebooks with descriptions.

### KHCC connection
> All AIDI production code is stored in Azure DevOps with mandatory commit messages and code review. Learning GitHub now builds the version control discipline required for the AIDI team's development workflow.

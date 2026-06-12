---
layout: page
title: "Lesson 2: Making It Move — JavaScript & the Frontend Landscape"
permalink: /session_11/instructions/lesson2_javascript_frontends/
---

<a class="back-btn" href="/CCI.io/session-11/" style="display:inline-flex;align-items:center;gap:.3rem;font-size:.8rem;font-weight:600;color:#EF6C00;text-decoration:none;padding:.35rem .65rem;border-radius:.4rem;border:1px solid #FFCC80;background:#FFF3E0;margin-bottom:1rem;">&#8249; Back to Session 11</a>

<style>
.site-nav{display:none!important}
.site-header{border-top:5px solid #EF6C00!important}
.site-title,.site-title:visited{color:#EF6C00!important;font-weight:800!important}
</style>

# Lesson 2 — Making It Move: JavaScript & the Frontend Landscape

*25 minutes. By the end you will have made a button actually do something with JavaScript, and you will understand — at a map level — what React, Vue, and the other frameworks are for, and why we are not going to use them.*

In Lesson 1 you built a page and clicked a button and nothing happened. That is because HTML is a noun language — it names things. *This is a heading. This is a form. This is a button.* It has no verbs. To make a page *act* — respond to a click, check a value, add a row, show a warning — you need a language of verbs that runs inside the browser. That language is **JavaScript**.

Every browser on earth — Chrome, Safari, Edge, the browser inside the EMR — has a JavaScript engine built in. You do not install anything. You write JavaScript, the browser runs it. It is the one programming language that runs natively in every web page.

> 🧠 **Remember.** HTML is structure. CSS is appearance. **JavaScript is behavior.** Those three languages, working together, are the entire frontend — everything that happens in the browser, on the screen in front of the user.

## Your first behavior

Open your `intake.html` from Lesson 1. We are going to make the Submit button greet the user. Replace your `<form>` with this simpler version, and add a `<script>` block:

```html
<body>
  <h1>Patient Intake</h1>

  <p>Name: <input type="text" id="name"></p>
  <button onclick="greet()">Submit</button>
  <p id="message"></p>

  <script>
    function greet() {
      const name = document.getElementById("name").value;
      document.getElementById("message").textContent = "Triage started for " + name;
    }
  </script>
</body>
```

Save, refresh, type a name, click Submit. A line appears: *"Triage started for …"*. **The button does something now.** Read what just happened, because every idea in frontend JavaScript is in these six lines:

- `<script>` is the tag that holds JavaScript, the way `<style>` holds CSS.
- `function greet() { ... }` defines a *verb* named `greet` — a named block of instructions that runs when called.
- `onclick="greet()"` on the button says: *when this is clicked, run `greet`*. That wiring — an **event** (the click) triggering a **function** — is the core of all interactivity.
- `document.getElementById("name")` reaches into the page and grabs the element whose `id` is `"name"`. The `id` attribute is how JavaScript finds a specific tag. `.value` reads what the user typed.
- The last line *writes* into the page — it sets the text of the `<p id="message">` element. JavaScript both reads from and writes to the page.

That read-something, compute-something, write-something-back cycle is what every interactive web page does, a million times an hour.

## A behavior that feels clinical

Let us do something a nurse would recognize: warn when a temperature is febrile. Replace the body:

```html
<body>
  <h1>Quick Vitals Check</h1>
  <p>Temperature (°C): <input type="number" id="temp" step="0.1"></p>
  <button onclick="checkTemp()">Check</button>
  <p id="result"></p>

  <script>
    function checkTemp() {
      const temp = parseFloat(document.getElementById("temp").value);
      const result = document.getElementById("result");
      if (temp >= 38) {
        result.textContent = "⚠️ Febrile — escalate if on chemotherapy.";
      } else {
        result.textContent = "Afebrile.";
      }
    }
  </script>
</body>
```

Type `39`, click Check — the warning fires. Type `37`, click again — it clears. You just wrote a decision rule that runs in the browser: read a value, compare it to a threshold, show a different message for each branch. `parseFloat` turns the typed text into a number so the `>=` comparison works. `if / else` is the fork in the road.

> ⚠️ **Watch out.** This temperature check runs *entirely in the browser, on the user's machine*. That is fine for a convenience warning. It is **not** where clinical logic belongs for anything that matters, because anyone can open the browser tools and change it. Real decision rules — like the acuity calculator in the app you will meet in Lesson 5 — run on the **backend**, on a server you control, where the user cannot reach in and rewrite them. Hold that distinction; it is the whole reason Lesson 3 exists.

## The frontend framework landscape

Here is an honest question: if JavaScript can already read inputs, make decisions, and update the page, why does everyone talk about **React**, **Vue**, **Angular**, **Svelte**?

The answer is *scale*. Your temperature check touched one input and one message. Now imagine the real EMR: hundreds of fields, live-updating lab values, a medication list that changes when you click a patient, three panels that all have to stay in sync. Writing all of that with `getElementById` and manual `.textContent` updates becomes a tangle — every piece of data lives in two places (the screen and your variables) and you spend your life keeping them matched.

Frameworks exist to manage that tangle. The big idea they share: **you describe what the screen should look like for a given set of data, and the framework keeps the screen and the data in sync for you.** You change the data; the screen updates itself. You stop writing `getElementById`.

A one-screen map of the landscape:

| Framework | One-line character | Who backs it |
|---|---|---|
| **React** | The dominant one. Build UIs from reusable "components." Huge ecosystem. | Meta |
| **Vue** | Gentler learning curve, very popular for smaller teams. | Independent |
| **Angular** | Big, opinionated, "batteries included." Common in large enterprises. | Google |
| **Svelte** | Newer; does its work when you build the app, so less runs in the browser. | Independent |

They are more alike than different. All four solve the same data-stays-in-sync problem; they differ in syntax and philosophy. If you learn the *idea* — components, and data driving the display — you can read any of them.

> 💡 **Tip.** The quizzes and practice exercises throughout this course are written in **React**. You are not expected to write React from scratch — but now you know what it *is*: a JavaScript framework for building user interfaces out of reusable components. When you see a `.jsx` file, that is React.

## Why we are *not* using a framework

For the clinical apps in this course, we make a deliberate choice: **stay simple.** A framework is overhead you pay to manage complexity. The ER-triage app you build toward does not have hundreds of live-syncing fields — it has a form and a queue. Django (Lesson 4) will render the HTML for us on the server, and a sprinkle of plain JavaScript handles any in-page behavior. No build step, no framework, nothing to install.

This is a real engineering judgment, not a beginner's shortcut. *Reach for a framework when the complexity of your screen justifies the complexity of the tool — and not before.* Many production internal tools at hospitals are server-rendered HTML with a little JavaScript, exactly like what you are learning, precisely because it is simpler to build, secure, and maintain.

> 🔧 **Technical Stuff.** "Frontend" and "backend" are about to become the organizing idea of this whole session. Everything in Lessons 1–2 — HTML, CSS, JavaScript, React — is **frontend**: it runs in the browser, on the user's screen. None of it can hold data after the user closes the tab, and none of it can be trusted with a secret (the user can read it). For persistence and trust, you need the *other half*. That is Lesson 3.

## Try This

1. Add a second input to the febrile check for "on chemotherapy?" (use `<input type="checkbox" id="chemo">`). In `checkTemp`, read it with `document.getElementById("chemo").checked` (which is `true`/`false`) and make the warning stronger when the box is checked *and* the temp is ≥ 38.
2. Open any website you use, right-click, choose "View Page Source," and skim. You will recognize `<head>`, `<body>`, `<script>`. It is all the same material.

## Watch Out

JavaScript is case-sensitive and unforgiving about names. `getElementById` is not `getElementByID` and not `getelementbyid`. If your button does nothing, open the browser's developer console (right-click → Inspect → Console) — JavaScript errors show up there in red. A page that "does nothing" almost always has a loud error waiting in the console that explains exactly why. Learning to glance at the console is the single most useful debugging habit in frontend work.

You can now make a page react. Next, we find out where the data actually lives — and meet the half of the world that HTML and JavaScript cannot reach.

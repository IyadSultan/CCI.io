---
layout: page
title: "Lesson 1: What Is a Web Page? HTML from Scratch"
permalink: /session_11/instructions/lesson1_html/
---

<a class="back-btn" href="/CCI.io/session-11/" style="display:inline-flex;align-items:center;gap:.3rem;font-size:.8rem;font-weight:600;color:#EF6C00;text-decoration:none;padding:.35rem .65rem;border-radius:.4rem;border:1px solid #FFCC80;background:#FFF3E0;margin-bottom:1rem;">&#8249; Back to Session 11</a>

<style>
.site-nav{display:none!important}
.site-header{border-top:5px solid #EF6C00!important}
.site-title,.site-title:visited{color:#EF6C00!important;font-weight:800!important}
</style>

# Lesson 1 — What Is a Web Page? HTML from Scratch

*20 minutes. By the end you will have built a real web page by hand, opened it in your browser, and understood that there is no magic — a web page is just a text file.*

A patient chart, stripped of all its software, is a structured document. A heading with the patient's name. Sections: history, exam, labs, assessment, plan. Within each section, lists and paragraphs. You already know how to read that structure at a glance — your eye finds the "Assessment" heading without reading a word above it, because the *structure* tells you where to look.

A web page is the same idea. Underneath every website you have ever used — the EMR, your bank, this course's portal — is a text file that marks up content with structure: *this is a heading, this is a paragraph, this is a list, this is a form*. That markup language is called **HTML** — HyperText Markup Language. This lesson is the whole of it that you need. There is less here than you fear.

> 🧠 **Remember.** A web page is a text file the browser knows how to draw. Nothing more. When you "view source" on any website, you are reading exactly the kind of file you are about to write.

## Tags: the building blocks

HTML marks up content with **tags**. A tag is a word in angle brackets. Most come in pairs — an opening tag and a closing tag — that wrap some content:

```html
<h1>Neutropenic Fever Protocol</h1>
<p>Draw cultures before the first antibiotic dose.</p>
```

`<h1>` means "this is a top-level heading." `<p>` means "this is a paragraph." The closing tags — `</h1>`, `</p>` — have a slash. The content between them is what the browser draws. That is the entire grammar: **open, content, close.**

A handful of tags cover almost everything:

| Tag | Means | Example |
|---|---|---|
| `<h1>` … `<h6>` | Headings, biggest to smallest | `<h1>Triage</h1>` |
| `<p>` | Paragraph | `<p>Patient is stable.</p>` |
| `<ul>` / `<li>` | Bulleted list / list item | `<ul><li>Fever</li><li>Chills</li></ul>` |
| `<a>` | Link ("anchor") | `<a href="https://khcc.jo">KHCC</a>` |
| `<strong>` | Bold/important | `<strong>STAT</strong>` |
| `<br>` | Line break (no closing tag) | `Line one<br>Line two` |

Notice `<a>` carries extra information: `href="..."`. That is an **attribute** — a setting on a tag, written as `name="value"` inside the opening tag. The `href` attribute tells the link where to go. Attributes are how a tag gets configured.

## The skeleton every page shares

A complete HTML file has a standard wrapper. You will type it once, recognize it forever:

```html
<!DOCTYPE html>
<html>
<head>
  <title>My First Page</title>
</head>
<body>
  <h1>Hello, KHCC</h1>
  <p>This is my first web page.</p>
</body>
</html>
```

Three parts matter:

- `<!DOCTYPE html>` — a one-line declaration that says "this is modern HTML." Always the first line.
- `<head>` — information *about* the page that the visitor does not see in the body: the `<title>` (what shows on the browser tab), links to styling, and so on.
- `<body>` — everything the visitor actually sees. This is where your content lives.

That is the skeleton. Every web page on earth, including the most complex EMR screen, is this skeleton with more inside the `<body>`.

## Build one — right now

You do not need any software beyond a text editor and a browser, both of which you already have.

1. Open your text editor (VS Code from Session 9 is perfect, but even TextEdit or Notepad works).
2. Type the skeleton above.
3. Save the file as `intake.html` on your Desktop. **The `.html` ending is what matters** — it tells your computer this is a web page.
4. Find the file on your Desktop and double-click it.

Your browser opens and draws your page. You just built a website. There was no server, no internet, no framework — just a text file your browser knew how to read.

> 💡 **Tip.** Edit the file, save it, then refresh the browser tab (Cmd-R / Ctrl-R). The change appears instantly. That edit-save-refresh loop is the heartbeat of all front-end work. You will do it ten thousand times.

## A patient intake page

Let us build something that looks like clinical work. Replace everything inside `<body>` with this:

```html
<body>
  <h1>Patient Intake</h1>
  <p>Please complete all fields before triage.</p>

  <h2>Presenting Complaint</h2>
  <ul>
    <li>Onset</li>
    <li>Severity</li>
    <li>Associated symptoms</li>
  </ul>

  <form>
    <p>Name: <input type="text"></p>
    <p>Age: <input type="number"></p>
    <p>Chief complaint: <input type="text"></p>
    <button>Submit</button>
  </form>
</body>
```

Save, refresh. You now have a heading, a checklist, and a **form** with text boxes and a button.

Two new tags arrived:

- `<form>` wraps a set of inputs that belong together — a unit the page will eventually send somewhere.
- `<input>` is a single field. The `type` attribute changes what it accepts: `type="text"` for free text, `type="number"` for numbers. (Like `<br>`, `<input>` has no closing tag — it stands alone.)
- `<button>` is the button.

Click the button. **Nothing happens.** Type in the boxes, click Submit — nothing. The page has structure but no *behavior*. It cannot react, cannot calculate, cannot save. That "nothing happens" is not a bug — it is the exact boundary where HTML ends. HTML describes structure. To make the button *do* something, you need a second language. That is Lesson 2.

> 🔧 **Technical Stuff.** A tiny bit of styling keeps a page from looking like a 1995 document. Add this inside `<head>`, below the `<title>`:
> ```html
> <style> body { font-family: sans-serif; max-width: 600px; margin: 2rem auto; } </style>
> ```
> That is **CSS** — the language of *appearance* (fonts, colors, spacing), as distinct from HTML, the language of *structure*. We will lean on a styling toolkit called Tailwind later so you never have to write much CSS by hand. For now, just know the division of labor: HTML = structure, CSS = looks.

## Try This

Extend your intake page:

1. Add a second heading, `<h2>Vitals</h2>`, with number inputs for heart rate, blood pressure, and temperature.
2. Add a link at the bottom back to the KHCC website: `<a href="https://www.khcc.jo">Back to KHCC</a>`.
3. Make one word in a paragraph bold using `<strong>`.

Save and refresh after each change. Build the habit now.

## Watch Out

The single most common beginner mistake is forgetting the closing tag. If you write `<h1>Triage` and never write `</h1>`, the browser does not throw an error — it just keeps treating everything after it as part of the heading, and your whole page turns into giant bold text. There is no red error message in HTML; there is only a page that looks wrong. When something renders strangely, your first move is always: *find the tag I opened and never closed.*

You have now seen the floor of the entire web. Every framework, every EMR, every dashboard you will ever build sits on top of these tags. Next lesson, we make the button work.

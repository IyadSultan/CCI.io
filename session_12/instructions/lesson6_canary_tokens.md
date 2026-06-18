---
layout: page
title: "Lesson 6: The Honeypot Trick — Canary Tokens"
permalink: /session_12/instructions/lesson6_canary_tokens/
---

<a class="back-btn" href="/CCI.io/session-12/" style="display:inline-flex;align-items:center;gap:.3rem;font-size:.8rem;font-weight:600;color:#AD1457;text-decoration:none;padding:.35rem .65rem;border-radius:.4rem;border:1px solid #F8BBD0;background:#FCE4EC;margin-bottom:1rem;">&#8249; Back to Session 12</a>

<style>
.site-nav{display:none!important}
.site-header{border-top:5px solid #AD1457!important}
.site-title,.site-title:visited{color:#AD1457!important;font-weight:800!important}
</style>

# Lesson 6 — The Honeypot Trick: Canary Tokens

*15 minutes. By the end you will have walked through planting a free digital tripwire that emails you the moment anyone touches a decoy file — and you will know exactly where, and where not, to set one.*

Lessons 4 and 5 were about prevention: locks, walls, encryption — keeping intruders out. But here is the hard truth every security team learns the same way: **you cannot prevent every breach.** Some attacker will get past a wall, some colleague will wander into a folder they should never open, some laptop will be lost with a session still logged in. Prevention is necessary and never sufficient.

So mature security adds a second layer: **detection.** If you cannot stop everyone from getting in, you can at least *know* the instant someone does. That is what this lesson is about, and it is the most fun fifteen minutes in the whole session — no code, no template, just one free website and a clever idea.

## The idea: a tripwire that phones home

A **honeypot** is bait. A **canary token** is the smallest, sharpest kind of honeypot: a deliberately planted decoy — a document, a link, a fake login — that has no real purpose except to *alert you* the moment someone interacts with it. Nobody legitimate has any reason to touch it. So the only person who ever opens it is someone who should not be there.

The name comes from the coal mines: miners carried a caged canary underground because the bird collapsed from invisible gas long before the men did. A dead canary was an early warning that bought time to escape. Your digital canary works the same way — it is the thing that quietly falls over first, so you find out about the danger while you can still act.

> 🧠 **Remember.** Prevention keeps people out; detection tells you when prevention failed. A canary token is pure detection: it does nothing useful, it just **screams the instant it is touched.** Every serious security program runs both layers.

## The free service: canarytokens.org

You do not have to build any of this. A security company called **Thinkst** runs **canarytokens.org** — completely free, no login, no account to create. You go to the site, generate a token, and plant it. When someone trips it, you get an email. That is the entire product.

Here is the workflow, as steps you could follow yourself later:

1. Go to **canarytokens.org**.
2. **Pick a token type.** The menu offers many; for our purposes the useful ones are a **Microsoft Word document**, a **PDF document**, or a **web/URL token** (a link that alerts when clicked).
3. **Enter two things:** your **own email address** (this is where the alert is sent) and a short **memo** — a reminder to yourself of *where* you plan to plant this token.
4. **Download** the generated token. The site hands you a real, openable file (or, for a URL token, a link).
5. **Plant it** somewhere a snoop would find tempting.
6. **Wait.** The day someone opens that file, it quietly "phones home" to Thinkst, which emails you — typically with the **date and time** and the **source IP address** of whoever opened it.

> 💡 **Tip.** Step 3's memo is the step beginners skip and later regret. Six months from now an alert arrives that says a token was triggered. If your memo reads "Patient_List decoy on the shared S: drive, planted June 2026," the alert makes instant sense. If you left the memo blank, you get a panic with no context. Write the memo every time.

## A clinical use case you can actually picture

Forget abstract security for a moment. Here is the version that lives in your department.

You generate a Word-document token, name it something irresistible like **`Patient_List_2026.docx`**, and drop it in a shared department folder — the kind of drive half the floor can reach. The file contains **nothing real**: it is empty, or filled with obvious placeholder text. It is bait and only bait.

Now it just sits there. Legitimate staff have their real systems and never open a random file with a tempting name. But suppose one afternoon you get an email: *that file was opened.* You have just learned something you could not have learned any other way — **somebody is browsing through folders where they have no business being.** Maybe it is harmless curiosity; maybe it is something worse. Either way, you now know to investigate, and you know roughly when it started.

That is the whole trick: a file that is worthless to everyone except as an alarm.

## What the alert tells you — and what it does not

When a token fires, read the email carefully and hold two columns in your head.

| The alert usually gives you | What you can conclude |
|---|---|
| A timestamp (date and time) | *When* the decoy was touched — a real, precise event |
| A source IP address | *Roughly where* the request came from |
| Sometimes a rough geographic guess | A starting point for investigation |

And the limits, which matter just as much:

- The source IP can be a **VPN, a proxy, or shared office NAT** — it may not point to a real person or even the real building.
- An IP is a **signal, not an identity.** It tells you a request happened; it does not tell you who sat at the keyboard.
- A canary alert is **a strong reason to investigate, not courtroom proof.** Treat it as the smoke that tells you to go look for the fire, then gather real evidence through proper channels.

> 🔧 **Technical Stuff.** How does an empty Word file "phone home"? The token embeds a tiny invisible reference — for a document, a tracking pixel-style request to a Thinkst server; for a URL token, the link itself. When the file is opened (or the link clicked), the program quietly fetches that reference over the internet, and Thinkst logs the hit and emails you. The opener sees nothing. No malware, no payload — just one silent web request that the document was never supposed to make.

## Ethics and safety — read this part twice

This is the line that must stay bright, so say it plainly: a canary token is **detection on your own assets.** It is a burglar alarm in your own house, not a tool you point at anyone else.

- **Use your OWN email.** The alert goes to you, the asset owner. Never route someone else's activity to yourself without authority.
- **The bait stays empty and fake — always.** A canary document must contain **no real PHI, ever.** The entire point is that it is worthless if opened. Putting a real patient list inside a decoy would turn a safety tool into the exact breach you were trying to detect.
- **Plant only where you have authority.** Set tokens on drives and systems you are responsible for, and **coordinate with IT and the security team first.** A token nobody knows about can trip a curious-but-innocent colleague and start an unfair witch hunt — or trip *your own* monitoring tools and waste everyone's afternoon.

> ⚠️ **Watch Out.** This is a defensive, on-your-own-property technique. The same cleverness, aimed outward, becomes deception and surveillance of others. Keep it pointed inward: your assets, your email, your authority, with your security team in the loop.

## Try This

The live site is external, so walk these through on canarytokens.org with your own email, or simply reason them out:

1. **Run the six steps in your head (or on the site).** Generate a Word-document token addressed to *your own* email, with a memo describing where you would plant it. Do not put anything real inside it.
2. **Pick the single best spot in your department.** Where is the one location a snoop would be tempted by, that legitimate staff have no routine reason to open? Name it, and write the memo line you would attach.
3. **Reason about a real alert.** You receive: *"Token opened 14:03, source IP 203.0.113.9."* Say out loud what you would do next, what you *can* conclude (something opened your decoy at a specific time), and what you *cannot* (who the person is, or whether that IP is their real location).

## Watch Out

Three ways canary tokens go wrong:

- **High-traffic placement causes false alarms.** A token on a busy, frequently-opened folder will fire constantly and you will learn to ignore it — the same way an oncall pager that screams all night gets silenced. Plant it where touches are *rare and meaningful*, not where everyone walks past.
- **The source IP can be masked.** VPNs and proxies are ordinary. Read the IP as a lead, never as proof of identity, and never act against a named person on the IP alone.
- **Never bait with real patient data.** This is the unforgivable mistake. A canary file must be empty or fake, full stop. Real PHI in a decoy is itself a PHI exposure — you would have built the breach you set out to catch.

We have now toured networks, encryption, attacks, and defenses in general terms. Next we turn fully clinical: what exactly are we protecting, and what does the law actually require? That is Lesson 7 — PHI and HIPAA.

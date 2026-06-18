---
layout: page
title: "Lesson 5: Defending Yourself — Passwords, MFA & Least Privilege"
permalink: /session_12/instructions/lesson5_passwords_and_mfa/
---

<a class="back-btn" href="/CCI.io/session-12/" style="display:inline-flex;align-items:center;gap:.3rem;font-size:.8rem;font-weight:600;color:#AD1457;text-decoration:none;padding:.35rem .65rem;border-radius:.4rem;border:1px solid #F8BBD0;background:#FCE4EC;margin-bottom:1rem;">&#8249; Back to Session 12</a>

<style>
.site-nav{display:none!important}
.site-header{border-top:5px solid #AD1457!important}
.site-title,.site-title:visited{color:#AD1457!important;font-weight:800!important}
</style>

# Lesson 5 — Defending Yourself: Passwords, MFA & Least Privilege

*20 minutes. By the end you will know why a four-word passphrase beats `P@ssw0rd!`, why you must never reuse a password, and how a code on your phone stops most account attacks cold.*

Lesson 4 followed an attack from a single phishing email to a compromised account, and named the uncomfortable truth: the most common way in is not a clever exploit — it is *you*, or a colleague, typing a password into the wrong box. So this lesson is the highest-value thing you can do personally to defend yourself and the hospital. Three habits: a strong password you never reuse, a second factor on everything that matters, and the discipline to work with only the access you need. None of this requires code. All of it works tonight.

We will talk about how passwords *fall* only enough to defend against it — conceptually, never operationally. The goal is not to learn cracking; it is to understand the shape of the threat well enough to stand outside its reach.

## Length beats complexity

Here is the single most counterproductive rule the world taught us: "make it complex — add a capital, a number, a symbol." It produced a generation of passwords like `P@ssw0rd!` — annoying to type, easy to forget, and *not actually strong*. Attackers know every one of those substitutions. Swapping `a` for `@` and `o` for `0` is the first thing their tools try.

What actually makes a password hard to guess is **length**. Think of it as a combination lock. Every character you add does not *add* possibilities — it *multiplies* them. A short password, however clever, lives in a small space that a computer can sweep quickly. A long one lives in a space so vast that sweeping it is hopeless, even at billions of guesses a second.

The practical form of "long" that humans can actually remember is a **passphrase**: four or five random, unrelated words.

```
correct-horse-battery-staple
mango-violin-glacier-tractor
```

That is far longer than `P@ssw0rd!`, far easier to remember, and far harder to guess — because its strength comes from its *length*, not from a symbol you will forget you added. Pick words that are random and unrelated to each other and to you (not your pet's name and birth year). Read it once, picture the four images, and it is yours.

> 🧠 **Remember.** A long, memorable passphrase of random words beats a short, "complex" password on every axis at once: stronger *and* easier to remember. Length is the thing. Stop torturing yourself with symbols.

## How passwords actually fall

You do not need to fear a hacker personally guessing *your* password one character at a time. The real risks are duller and far more dangerous:

- **Reuse.** This is the big one. When a website you used years ago gets breached — and many have — the attacker walks away with a list of emails and passwords. The very first thing they do is try those same email-and-password pairs on *other* sites: your email, your bank, your hospital remote-access portal. If you reused the password, you just handed over every one of those accounts with a single old breach. Reuse turns one leak into a master key.
- **Common patterns.** Tools start with the predictable — dictionary words, `123456`, `Summer2024!`, the same tired symbol swaps. "Complex but predictable" is no defense.
- **Leaked breach lists.** Billions of real passwords from past breaches are compiled into lists that attackers test first. If your password has ever appeared in any breach, it is effectively already known.

The lesson from all three is one sentence: **never reuse a password.** A unique password per site means a breach of one site exposes exactly one account — not your whole life.

> ⚠️ **Watch Out.** If you reuse one password across your email, your bank, and a forum you forgot about, your security is only as strong as that forum's worst day. You don't control when they get breached — but you control whether that breach reaches your other accounts.

## Password managers: remember one, not a hundred

"Unique password for every site" sounds impossible. No human can remember a hundred random passphrases. You are not supposed to — a **password manager** does it for you.

A password manager is an encrypted vault. You memorize **one** strong master passphrase (make this one a great four-word phrase). The manager then generates a long, random, unique password for every site, stores it, and fills it in for you. You never see or type the individual passwords; you only remember the one that opens the vault.

This solves the reuse problem completely. Every site gets its own random password, so a breach anywhere reaches nowhere else — and you carry the burden of remembering exactly one thing. Browsers and phones have decent ones built in; dedicated apps (Bitwarden, 1Password, and others) work everywhere. Any reputable manager beats a reused password by a mile.

> 💡 **Tip.** Make the manager's master passphrase the strongest thing you own — long, random, never used anywhere else, never typed into any site but the manager itself. It is the one key to the whole keyring. Treat it accordingly.

## What MFA actually is

Even a perfect password can leak — phished, breached, or shoulder-surfed. **Multi-factor authentication (MFA)** is the safety net for exactly that moment. The idea is simple: prove who you are with *more than one kind of evidence*, drawn from different categories:

- **Something you know** — your password or passphrase.
- **Something you have** — your phone, or a small hardware key.
- **Something you are** — your fingerprint or face.

MFA requires evidence from at least two of these. So even if an attacker steals your password (something you know), they are stopped cold at the second gate, because they do not have your phone (something you have). One leaked factor is no longer enough.

> 🧠 **Remember.** Your KHCC login — password *plus* a code on your phone — **is** multi-factor authentication. That second prompt is not bureaucracy; it is the wall that keeps a stolen password from becoming a stolen account. Now you know why the hospital insists on it.

## Not all MFA is equal

A second factor is good. Some second factors are much better than others, mostly in how well they resist *phishing* — an attacker tricking you into handing over the code in real time.

| MFA type | What it is | Strength | Weakness |
|---|---|---|---|
| **SMS text code** | A code texted to your phone | Better than nothing | Phishable; vulnerable to SIM-swap (attacker hijacks your number) |
| **Authenticator app (TOTP)** | A 6-digit code that rotates every 30 seconds, in an app | Good | Still phishable if you type the code into a fake site |
| **Hardware key / passkey** | A physical key or device-bound credential | Best — phishing-resistant | Slight setup; can lose the key (keep a backup) |

The pattern: **SMS < authenticator app < hardware key / passkey.** SMS is the weakest because text messages can be intercepted, and your phone number itself can be stolen via SIM-swap (Watch Out, below). An authenticator app keeps the code on your device. Hardware keys and passkeys are *phishing-resistant by design*: they cryptographically check the real website's identity before responding, so a fake login page gets nothing — the key simply refuses.

> 🔧 **Technical Stuff.** A passkey or hardware key works because it only ever talks to the genuine site it was registered with. There is no code for you to read aloud, copy, or be tricked into typing — so there is nothing for a fake page to capture. That is what "phishing-resistant" means, and it is why this row sits at the top of the table. For your most important accounts, this is the tier to aim for.

The headline finding from defenders across the industry is consistent and worth memorizing: **MFA blocks the large majority of credential-based account attacks — even when the attacker already knows the password.** It is the single highest-return security setting you can flip.

## Least privilege, every day

Lesson 4 introduced **least privilege** as the brake on a runaway attack: the less access an account has, the less damage it can do if it falls. That is not just an IT-department policy — it is a personal daily habit.

- **Don't do everyday work in an admin account.** Browse, email, and write notes in a normal account; reach for admin rights only for the rare task that truly needs them. If your everyday account is phished, the attacker inherits *its* limited powers, not the keys to the whole machine.
- **Request only the access you need.** Asking for the minimum is not timidity; it is the thing that keeps a compromise of *your* account from becoming a compromise of an entire system or dataset.

This shrinks the **blast radius**. When something goes wrong — and over a career, something will — least privilege is what turns "one limited account was exposed" into a footnote instead of a headline.

> 💡 **Tip.** You will see this exact principle in the cloud in Lesson 9. The Azure server we build logs in with an **SSH key** instead of a password — a long cryptographic secret no human types and no one can phish — and the working login is a **non-root, least-privilege** account, never the all-powerful root user. Strong key instead of a guessable password; minimum privilege instead of maximum. The same two habits you adopt tonight, scaled to a server.

## Try This

1. **Upgrade one password into a passphrase.** Pick a weak or reused password on an account you care about and change it to four random, unrelated words. Notice it is both stronger and easier to remember than what it replaced.
2. **Turn on MFA for one important account today** — your personal email is the best choice, because it can reset all the others. When offered a choice, pick an **authenticator app over SMS**. Five minutes, and you have closed the most common door attackers use.
3. **List your reused passwords.** Write down (privately) every place you suspect you used the same password, then make a plan: install a password manager and replace them one at a time, starting with email and banking.

## Watch Out

- **SIM-swap defeats SMS.** An attacker who convinces your mobile carrier to move your phone number to *their* SIM card receives your text codes. For anything important — email, banking, hospital access — prefer an authenticator app or a hardware key over SMS. SMS is a floor, not a ceiling.
- **MFA fatigue / prompt-bombing.** A real attack pattern: someone with your password triggers login attempt after login attempt, flooding your phone with approval prompts until, tired or confused, you tap "Approve" to make it stop. **Never approve a login prompt you did not personally start.** A prompt you didn't ask for means someone has your password right now — deny it, and change that password immediately.

Prevention is never perfect. Even with a passphrase, a manager, and MFA, the smartest move is sometimes to *know the instant someone is snooping where they shouldn't be*. That early-warning trick is Lesson 6: canary tokens.

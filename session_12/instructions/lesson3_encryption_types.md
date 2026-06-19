---
layout: page
title: "Lesson 3: Two Kinds of Keys — Symmetric, Asymmetric, At-Rest vs In-Transit"
permalink: /session_12/instructions/lesson3_encryption_types/
---

<a class="back-btn" href="/CCI.io/session-12/" style="display:inline-flex;align-items:center;gap:.3rem;font-size:.8rem;font-weight:600;color:#AD1457;text-decoration:none;padding:.35rem .65rem;border-radius:.4rem;border:1px solid #F8BBD0;background:#FCE4EC;margin-bottom:1rem;">&#8249; Back to Session 12</a>

<style>
.site-nav{display:none!important}
.site-header{border-top:5px solid #AD1457!important}
.site-title,.site-title:visited{color:#AD1457!important;font-weight:800!important}
</style>

# Lesson 3 — Two Kinds of Keys: Symmetric, Asymmetric, At-Rest vs In-Transit

*25 minutes. By the end you will know the two ways keys work, the two moments data must be protected, and you will recognise both of them already running inside the app you built in Session 11.*

Last lesson gave you the headline: HTTPS scrambles a message so an eavesdropper in the hallway sees gibberish. That leaves two honest questions a thoughtful clinician asks next. First: if encryption needs a key, and the key has to get to both sides, how does the key itself cross the hallway without being stolen? Second: HTTPS protects the message while it *moves* — but what about the patient data sitting still in a database for years? This lesson answers both. The good news, as usual, is that there is less here than the jargon suggests.

## One shared key: symmetric encryption

The oldest idea in encryption is the simplest. There is **one key**. The same key locks the message and unlocks it. Lock a box with a key, hand the box to someone who has a copy of that same key, and they open it. That is **symmetric** encryption — "symmetric" because both sides hold the identical key.

It is fast, it is strong, and it is what protects the overwhelming majority of stored data in the world. The modern standard is called **AES-256**, and for practical purposes it is unbreakable by guessing — we will see why at the end.

There is exactly one problem, and it is a big one: **how do the two sides get the same key in the first place?** If I have to send you the key across the same hallway where the eavesdropper is standing, the eavesdropper copies the key and reads everything. You cannot encrypt the key with another key, because then you would have to share *that* key, and so on forever. This is the **key-exchange problem**, and for centuries it had no clean solution.

> 🧠 **Remember.** Symmetric = one shared key, fast and strong. Its weakness is not the lock — it is *delivering the key* to the other side without anyone copying it on the way.

## A public lock and a private key: asymmetric encryption

The breakthrough — and it genuinely changed the world — is **asymmetric** encryption. Instead of one key, you have a **pair**: a **public key** and a **private key**, mathematically linked.

The trick is in the asymmetry. The public key can only *lock*; the private key can only *unlock*. So you can publish your public key to the entire world — print it on a billboard — and it does no harm. Anyone can use it to lock a message addressed to you, but **only your private key, which never leaves your possession, can open it.**

Think of it as a mailbox with a slot. Anyone walking past can drop a letter in (that is the public key, the slot). Only you have the key to the little door that empties it (that is the private key). The key-exchange problem dissolves: you never had to share a secret to receive a private message.

The cost is speed — asymmetric maths is much slower than symmetric. So in practice we use it for the one thing it is uniquely good at: agreeing on a secret safely.

> 🔧 **Technical Stuff.** The common asymmetric algorithms are **RSA** and the newer, lighter **ECC** (elliptic-curve). You do not need the maths. You need the shape: a freely-shared public key that locks, and a closely-guarded private key that unlocks.

## How HTTPS quietly uses both

Here is the elegant part, and it explains the padlock from Lesson 2. When your browser opens an `https://` site, it performs a **handshake**:

1. The server sends its **certificate**, which contains its **public key** (and a trusted authority's signature vouching that this key really belongs to this domain — that is the identity check the padlock proves).
2. Your browser uses that public key — **asymmetric** — to safely agree on a brand-new **shared secret key** with the server. Because only the server's private key can complete the exchange, no eavesdropper can learn the shared secret.
3. From that moment, both sides switch to fast **symmetric** encryption using that shared key for the rest of the conversation.

So HTTPS is asymmetric encryption solving the key-exchange problem *just long enough* to set up fast symmetric encryption for the actual data. The current version of this protocol is **TLS 1.3**. You will never configure this by hand — but now you know what is happening in the half-second before a page loads.

> 💡 **Tip.** "SSL," "TLS," and "HTTPS" all point at the same thing in everyday speech: the encrypted, identity-checked web connection. TLS is the current name; SSL is its retired ancestor.

## Two moments: in transit vs at rest

Everything so far protects data **in transit** — while it moves across the network. But a patient record spends almost all of its life **at rest** — sitting in a database, on a disk, in a nightly backup. These are two different moments, and they need two different protections.

| | In transit | At rest |
|---|---|---|
| When | Data is moving across the network | Data is stored on disk |
| Threat | Eavesdropper in the hallway (Lesson 2) | Stolen laptop, stolen backup, breached database |
| Protection | HTTPS / TLS | Encrypting the stored values |
| In your app | The Render `https://` URL | Fernet-encrypted patient name |

The mistake people make is assuming one covers the other. It does not. A site can have flawless HTTPS and still be a catastrophe if someone copies its database and every patient name sits there in plain text. **You need both moments covered.**

> ⚠️ **Watch Out.** "We use HTTPS" answers only half the question. Always ask the second half: *and how is the data protected at rest?* A breach almost never happens in the hallway — it happens when someone walks off with the filing cabinet.

## You have already done this — in Session 11

Open `crypto.py` from the ER-triage app you built. It is short, and now you can read it.

```python
# Patient names are encrypted AT REST with Fernet (symmetric: one key).
def encrypt_name(name: str) -> bytes:
    return _fernet().encrypt(name.encode("utf-8"))

def decrypt_name(token: bytes) -> str:
    return _fernet().decrypt(bytes(token)).decode("utf-8")
```

**Fernet** is a well-known symmetric-encryption recipe — one key, AES-256 underneath. In your app, the patient's name was encrypted with it *before* being written to the database, and decrypted only when actually needed. That is encryption **at rest**. Meanwhile, when you deployed to Render, the whole site was served over `https://` — encryption **in transit**. Without naming them, you built both layers.

The MRN was handled by the other pair of functions, `encode_mrn` / `decode_mrn` (the "Optimus" transform). That one is a *reversible obfuscation* rather than full encryption — a fast, reversible scramble so the raw MRN never sits in the clear, but recoverable by someone holding the secret numbers. It is worth keeping the distinction honest: encoding hides a value cheaply; encryption protects it strongly. Both serve the same instinct — **the raw identifier never rests in plain sight.** Lesson 8 returns to exactly this pattern as the AIDI house rule.

> 🧠 **Remember.** Your app already protects the patient name in *both* moments: Fernet at rest, HTTPS in transit. Two layers, two threats, two tools — and you shipped them.

## "State of the art," and why you must never invent your own

A reasonable question: how hard is it to break this without the key — to **decipher** the ciphertext? This is the field of **cryptanalysis**. For modern algorithms like AES-256, the honest answer is that brute force — trying every possible key — is hopeless: the number of possible keys is so astronomically large that all the computers on Earth running until the sun dies would not get through a meaningful fraction. The maths is not the weak point.

The weak points are everywhere *around* the maths: a key left in a public code repository, a poorly chosen password protecting the key, a flawed home-made implementation, or a person tricked into handing over access. (On the horizon, **post-quantum** cryptography is being standardised to stay ahead of future quantum computers — a detail to be aware of, not to act on today.)

Which leads to the single most important practical rule in this whole lesson:

> ⚠️ **Watch Out.** **Never roll your own crypto.** Inventing your own encryption is how data gets leaked by people who felt clever. Always use vetted, standard libraries — exactly what your app did by using Fernet instead of some hand-written scramble. The professionals have spent decades finding the flaws so you do not have to rediscover them with real patients' data.

## Supplementary video (optional — watch after Lesson 2)

**[What Is Encryption and How Does It Work?](https://www.youtube.com/watch?v=xHaxAYDt75Q)** (Tarmeez Academy, ~9 min, Arabic with visual explanations) walks through the same arc as this lesson: man-in-the-middle risk, Caesar cipher, symmetric encryption (AES), the key-sharing problem, asymmetric encryption (RSA), and how HTTPS combines both. After watching, take the [10-question English video quiz]({{ site.baseurl }}/session_12/quizzes/quiz_lesson3_encryption_youtube.html).

## Try This

1. Open `crypto.py` from your Session 11 app and find the two pairs of functions. Say out loud which protects data *at rest* and which is the reversible MRN obfuscation. You wrote security-relevant code without realising it.
2. Pick any clinical system you use. Ask two questions: *Is it HTTPS?* (in transit — check the padlock) and *Is the stored data encrypted at rest?* (you will often have to ask IT — and that is exactly the right question to ask).
3. In one sentence each, explain to a colleague why a public key can be shared on a billboard but a private key cannot.

## Watch Out

The most common real-world failure is not weak encryption — it is **encryption that was never turned on for data at rest**, or a **key stored carelessly** next to the data it protects. Strong locks on the front door mean nothing if the key is taped under the mat. We will see in Lesson 8 where the AI Office actually keeps its keys (a secret vault, never in the code).

Encryption, used properly, makes a message unreadable to anyone without the key. So attackers rarely fight the maths — they go *around* it: they trick a person, exploit an unpatched hole, or steal a key. Next lesson we follow a real attack from start to finish and see exactly where those doors are.

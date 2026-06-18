---
layout: page
title: "Lesson 4: How Attacks Actually Work"
permalink: /session_12/instructions/lesson4_how_attacks_work/
---

<a class="back-btn" href="/CCI.io/session-12/" style="display:inline-flex;align-items:center;gap:.3rem;font-size:.8rem;font-weight:600;color:#AD1457;text-decoration:none;padding:.35rem .65rem;border-radius:.4rem;border:1px solid #F8BBD0;background:#FCE4EC;margin-bottom:1rem;">&#8249; Back to Session 12</a>

<style>
.site-nav{display:none!important}
.site-header{border-top:5px solid #AD1457!important}
.site-title,.site-title:visited{color:#AD1457!important;font-weight:800!important}
</style>

# Lesson 4 — How Attacks Actually Work

*25 minutes. By the end you will be able to follow a hospital breach ward by ward, name every step the way a security team names it, and — for each step — say the one defense that breaks the chain.*

You do not need to know how to *commit* a break-in to understand how to *prevent* one. A ward nurse needn't study burglary to know an unlocked window is a problem and a propped-open fire door is worse. This lesson is that: we walk an attack from the defender's chair, so the vocabulary your IT and AI Office colleagues use stops sounding like noise and starts sounding like a checklist. Every term comes paired with the thing that stops it.

Keep Lesson 1's picture in your head: the hospital network as a building — wards connected by hallways, doors between them, locks of varying quality. And keep Lessons 2-3's idea of **encryption** — scrambling data so only the key-holder can read it — because by the end of this lesson the intruder will be holding that same tool, pointed back at us. We follow one continuous story: a single intruder, starting outside, ending with our files locked. Watch each room.

## The way in: an unlocked window nobody knew about

Every building has flaws the architect never noticed. In software these are called **vulnerabilities** — mistakes in the code that, used the right way, let someone do something they shouldn't. When a flaw is brand new and *nobody has fixed it yet* — the vendor doesn't know, there's no repair available — it's a **zero-day vulnerability**. The name means the defenders have had "zero days" to fix it: an unlocked window that isn't even on the blueprint.

Zero-days get the headlines. Here's the part that should change your behavior: **they are not how most hospitals get breached.** The overwhelming majority of real attacks walk in through windows that were unlocked *months or years ago, that a fix already exists for, and that nobody got around to installing.* The repair was sitting on the windowsill, unapplied.

That repair is a **patch** — an update the vendor ships to close a known hole. **Patching — keeping every system updated — is the single highest-value technical habit in the whole building.** Not the most glamorous. The highest-value.

> 🧠 **Remember.** A zero-day is an *unknown* unlocked window. But most break-ins use *known* windows that were never closed. Patching is boring, and it stops more attacks than anything else you can buy. The intruder is betting you didn't update. Win that bet.

## Getting through it: the exploit

Using a flaw to actually get in is called an **exploit** — turning that unlocked window into an open door you can climb through. We keep this completely abstract, because the *how* is exactly what this lesson refuses to teach. What matters to a defender is the shape of it: an exploit is the move that converts "there is a flaw" into "I am now inside." Close the flaw (patch it) and the exploit has nothing to act on. No window, no climbing through it.

## Staying in: backdoors, RATs, and persistence

Our intruder is now inside one room. A smart intruder's first move is not to grab anything — it's to *make sure they can come back*.

A **backdoor** is a door they prop open quietly for later — a way back in that bypasses the normal locks, so they needn't find another unlocked window next time. A **RAT — Remote Access Tool** — is worse: a hidden remote control they leave running on the machine, so they can operate it from outside the building, at leisure. Picture a baby monitor installed in your ward, pointed at the workstation, that they can watch and steer from across the city.

Then comes **persistence**: arranging things so that even if you reboot the machine, even if you think you've cleaned up, the intruder still has their way back in. Persistence is what separates a one-time scare from a long, quiet occupation — which is why "we restarted it and it seems fine" is not the same as "it's fixed."

> ⚠️ **Watch Out.** "We rebooted and the problem went away" can mean the problem learned to survive reboots. Persistence is designed to outlast the obvious fix. Clean-up after a real incident is a job for the security team, not a power cycle.

## Spreading: lateral movement

Here is the move that turns one compromised laptop into a hospital-wide emergency. **Lateral movement** — sometimes called *lateralization* — is the intruder going room to room, ward to ward, down the hallways from Lesson 1. They rarely land where the treasure is. They land on some ordinary machine — a reception PC, a clicked email on a clinic workstation — then *move sideways* through the network toward the EHR, the file servers, the backups.

The hallways are the network. If every room connects to every other through one open corridor, the intruder strolls. So the defense is architectural:

- **Network segmentation** — walls and locked doors *between* wards, so being in one does not mean you can reach all the others. The lab network, the EHR, the office PCs, the medical devices — each in its own zone, with controlled doors between. An intruder who lands in reception should hit a wall before the EHR.
- **Least privilege** — which deserves its own section.

## The brake: least privilege

**Least privilege** is the principle that every account, person, and program gets *only the access it actually needs to do its job — and nothing more.* The billing clerk's login cannot open the pharmacy system. The clinic workstation cannot reach the backup server. The reporting tool can read records but cannot delete them.

Why this is the brake on the whole story: lateral movement runs on borrowed access. The intruder moves by *using the permissions of whatever account they've compromised.* Take over an account that can reach almost nothing, and they are stuck in that room — the surrounding doors are locked to that account, treasure or not. Least privilege doesn't stop them getting in; it makes getting in *worthless*.

You will meet this idea twice more this session: in Lesson 5 as a personal habit (don't use an admin account for everyday work), and in Lesson 9 as an Azure setting (cloud roles scoped to the minimum). Same principle, three altitudes.

> 💡 **Tip.** When IT says "you don't need access to that," they are not being territorial — they are practicing least privilege on your behalf. Every door your account *can't* open is a door a thief wearing your badge can't open either.

## The payload, part one: stealing the data

Now the intruder has reached the records. The first thing they often do is **data exfiltration** — quietly copying charts, labs, and identifiers *out* of the building to a machine they control. "Exfiltration" is just a precise word for *stealing data by copying it out.* Note *quietly*: a good thief takes copies, so nothing looks missing. The charts are still on your screen; a duplicate is now in their hands. This is the part that becomes a PHI breach, a regulatory event, and a letter to every affected patient.

The defense is mostly the layers you've already met — segmentation and least privilege limit what *can* be reached and copied — plus **monitoring**: watching for the unusual. A workstation that suddenly tries to read ten thousand patient records at 3 a.m. should trip an alarm. We go deeper on monitoring, and on traps called **canary tokens** (fake records planted as bait — touch one and you've announced yourself), in Lesson 6.

## The payload, part two: encryption turned into a weapon

This is the twist the whole lesson was built toward. Remember encryption from Lessons 2-3 — scrambling data so only the key-holder can read it? It is one of the best defensive tools we have. **An intruder can pick it up and use it against you.**

Instead of merely stealing your files, the intruder *encrypts them in place* — scrambles your own charts, schedules, and databases with a key only *they* hold. The data still sits on your servers. You simply can no longer read a byte of it. The very mechanism that protects data from outsiders, run by an insider-by-force, locks the rightful owners out.

> 🔧 **Technical Stuff.** Encryption is mathematically neutral — it does not know whether the key-holder is the hospital or the thief. The same algorithm that keeps a stolen laptop's disk unreadable to a thief is the algorithm a thief uses to make *your* disk unreadable to *you*. The lock is the same; only who holds the key changed. This is why the real antidote, below, is not "better encryption" — it's having a *clean copy somewhere they couldn't reach.*

## The demand: ransomware and extortion

When the locking is done, the message appears: **ransomware**. Pay us — usually in cryptocurrency — and we'll give you the key to unscramble your files. This is digital extortion, and it has a nastier modern form. **Double extortion** combines the two payloads: *we encrypted your files so you can't work, AND we already copied them out — so pay us or we leak every patient's record publicly.* Paying for the key no longer makes the stolen copy disappear. Two threats now, and one payment that resolves neither cleanly.

The clinical stakes are not an IT inconvenience. A hospital hit by ransomware is a hospital that **suddenly cannot reach its EHR.** No medication histories. No allergy lists. No imaging. Ambulances diverted, procedures postponed, staff back to paper in a building designed around screens. This has happened to real hospitals, and the harm lands on **patients**, not on a server. Treat it as a patient-safety event, because that is what it is.

So what defeats ransomware? Not paying — paying funds the next attack and often doesn't restore everything. The true antidote is **backups**: clean, recent copies of your data kept somewhere the intruder could not reach and could not encrypt. If you can restore yesterday's data from an untouched copy, the intruder's locked files are just noise and their leverage evaporates.

But backups have a cruel catch, and it is the most important sentence in this lesson: **a backup you have never tested is not a backup — it is a hope.** Plenty of hospitals discovered, in the worst hour, that their backups were incomplete, corrupted, or also encrypted because they sat on the same reachable network. Backups must be *offline or isolated* and *restore-tested* on a schedule, or they are theater.

## The whole chain, and where each defense breaks it

Read this top to bottom as the story you just followed — and notice that the chain breaks at *every* row. The intruder needs all the steps; you only need to win one.

| Attack stage | Plain meaning | What breaks the chain here |
|---|---|---|
| Zero-day vulnerability | Unknown unlocked window | (By definition, none yet — minimize exposure, monitor) |
| Known vulnerability | A window with a fix nobody installed | **Patching** — apply updates promptly |
| Exploit | Climbing through the flaw | Patch the flaw; nothing to climb through |
| Phishing / clicked link | A human opens the door | **Staff awareness + MFA** (Lesson 5) |
| Backdoor / RAT | A propped door, a hidden remote | Monitoring, endpoint protection (Lesson 6) |
| Persistence | Surviving a reboot | Real incident response, not a power cycle |
| Lateral movement | Room to room across wards | **Network segmentation** |
| Borrowed access | Using a weak account's reach | **Least privilege** |
| Data exfiltration | Copying records out quietly | Least privilege + **monitoring / canary tokens** (Lesson 6) |
| Encryption as weapon | Your own files scrambled | Limit reach (segmentation, least privilege) |
| Ransomware / extortion | Pay for the key, or we leak | **Offline, tested backups** |

And the single most common *first* row in real breaches isn't on the technical list at all: **a human being clicking something.** Phishing — a convincing fake email that gets someone to hand over a password or open a malicious attachment — is the most common entry point in healthcare, full stop. The fanciest segmentation in the world doesn't help if a tired clinician at the end of a shift types their password into a lookalike login page. That is precisely why Lesson 5 — strong passwords and **multi-factor authentication (MFA)** — is the highest-value *personal* defense you own.

## Try This

1. **Match the term.** For each scenario, name the stage: (a) "An email looked exactly like our IT helpdesk and asked me to reset my password." (b) "One infected clinic PC let the attacker reach the file server two networks away." (c) "All our scheduling files now open as gibberish and a note demands payment." *(Answers: a — phishing; b — lateral movement; c — ransomware / encryption as a weapon.)*

2. **Break the chain.** Take the table above and, covering the right column, say out loud the one defense that stops each stage. If you can name the brake for *lateral movement* and the antidote for *ransomware* without looking, you've got the spine of this lesson.

3. **Check your own patching.** On your phone and your work laptop, find the software-update setting and confirm whether updates install **automatically**. If they don't, you are personally running the "known unlocked window" risk we opened with. (You may need IT's help on a managed work device — that's the right call, not a workaround.)

## Watch Out

- **The weakest link is almost always human, not technical.** Hospitals spend fortunes on firewalls and lose to a single clicked link. Your attention is part of the security system.
- **"It won't happen to us" is exactly how it happens.** Every breached hospital believed it was too small, too careful, or too boring to be a target. Attackers don't pick hospitals for prestige; they pick them because hospitals pay, and because someone, somewhere, didn't patch.
- **A backup you've never restored is not a backup.** If your only proof that backups work is that the job "runs green" every night, you do not yet know they work. Untested backups have ended hospitals' weeks in the dark. Test the restore, or don't call it protection.

You now know the whole chain and where it breaks. Notice how many of those breaks come back to one person, one login, one moment of attention. The cheapest, highest-impact defense in the entire building is personal — strong authentication. That is Lesson 5.

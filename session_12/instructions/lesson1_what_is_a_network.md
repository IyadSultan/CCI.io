---
layout: page
title: "Lesson 1: What Is a Network, Really?"
permalink: /session_12/instructions/lesson1_what_is_a_network/
---

<a class="back-btn" href="/CCI.io/session-12/" style="display:inline-flex;align-items:center;gap:.3rem;font-size:.8rem;font-weight:600;color:#AD1457;text-decoration:none;padding:.35rem .65rem;border-radius:.4rem;border:1px solid #F8BBD0;background:#FCE4EC;margin-bottom:1rem;">&#8249; Back to Session 12</a>

<style>
.site-nav{display:none!important}
.site-header{border-top:5px solid #AD1457!important}
.site-title,.site-title:visited{color:#AD1457!important;font-weight:800!important}
</style>

# Lesson 1 — What Is a Network, Really?

*15 minutes. By the end you will be able to picture the internet as a hospital building — rooms, hallways, numbered doors, and a reception desk — and explain why putting your app online both makes it useful and puts it at risk.*

Last session you took an app off your laptop and put it on the public internet. You typed `git push`, watched Render build it, and got a URL — `your-app.onrender.com` — that anyone on earth could open. That was the victory. This session is about the bill that comes with it: the moment your app became reachable from anywhere, it also became reachable *by* anyone. Before we can lock the front door, you need to know what the door is, where it is, and what is on the other side. That is the whole job of this first lesson — to build the mental picture every later lesson will lean on.

> **Optional overview:** Skim the **[Cybersecurity slides](https://docs.google.com/presentation/d/1WiaGj8seS48YkoS3jkZ3XjGpDKD5voEMws4ZNcsGiE8/edit?usp=sharing)** for a session-wide map before you dive into ports and firewalls.

So let's build it slowly, with one analogy we will keep all session: **the hospital is a network.** Hold that picture and the jargon stops being jargon.

## A network is just rooms passing notes

Strip away the cables and the acronyms and a network is almost embarrassingly simple: **it is computers passing messages to one another.** One computer writes a message — "show me the patient queue" — and hands it across to another, which writes a message back. No magic, just notes passed between machines.

Now picture your hospital. Each **room is a computer**. The **hallways are the network** — the shared space the notes travel through to get from room to room. A nurse in one room writes "send me yesterday's labs" on a slip, a runner carries it to the lab room, and the lab room writes the labs on a slip and sends them back. Computers do exactly this, millions of times a second.

And "the internet"? It is not one network. It is **networks of networks** — your hospital's hallways connected to the city's connected to the country's connected to the world's. A note can leave a room in Amman and arrive in a room in California because every hallway in between agrees to pass it along. *Inter-net* literally means *between-networks*.

> 🧠 **Remember.** A network is computers passing messages. The internet is networks of networks — every hallway in the world, connected, agreeing to carry each other's notes.

## Who asks and who answers: client and server

You already know this part — we just gave it different names last session. When the nurse's browser asked the server for the queue and the server sent back a page, that was the **request/response cycle** from Session 11, Lesson 3. The browser **asks**; the server **answers**.

In network words, the asker is the **client** and the answerer is the **server**. In the hospital, the room that writes "send me the labs" is the client; the lab room that sends them back is the server. The roles are not fixed to a machine, but for everything in this course the pattern holds: *your browser is the client, the computer running your Django app is the server.* Every click, every form, every page load is one room asking and another answering across the hall.

## IP address: a room's number on the network

For a note to find its room, the room needs an address. On a network that address is the **IP address** — a string like `142.250.65.78`. It is the room number painted on the door. When a note says "deliver to `142.250.65.78`," the hallways know which room that is and route it there.

You met two of these addresses last session, and the contrast between them is the heart of this whole session:

- **`127.0.0.1`**, also called **`localhost`** — this means *this computer only*. It is a room with no door to the hallway at all. When your app ran at `127.0.0.1:8000`, only your laptop could reach it; close the lid and it was gone. Perfectly safe, because nobody outside can knock.
- **`your-app.onrender.com`** — a name that points to a real, public IP address: a room with a **door open to the entire building, and the building is the whole internet.** Anyone, anywhere, can walk up and knock.

That jump — from a room with no outside door to a room the whole world can reach — is exactly the jump deployment makes, and exactly the jump this session teaches you to secure.

> 💡 **Tip.** Names are friendlier than numbers, so the internet runs a giant phone book that turns `your-app.onrender.com` into its IP address for you. It is the same idea as looking up "Radiology" in the hospital directory instead of memorizing the room number.

## Ports: the numbered doors on a room

Here is the piece most people have never been told. A computer does not have *one* door — it has thousands of **numbered doors**, called **ports.** One room, many doors, each labeled with a number, each leading to a different service running inside.

Why? Because one computer often does several jobs at once. The same machine might serve a website, accept a remote login, and run a database — and the note needs to reach the *right* job. The port number says which door. "Deliver to `142.250.65.78`, door **443**" means *this room, the website door.*

A service inside the room **listens** on a port — it sits at one specific door waiting for knocks. A web server listens at door 443; a database listens at its own door. Knock on a door where nothing is listening and the note bounces. A handful of door numbers come up again and again, and these four are worth memorizing:

| Port | Service | What it's for | The hospital door |
|---|---|---|---|
| **80** | HTTP | Websites, *unencrypted* | The public website door (old, plain) |
| **443** | HTTPS | Websites, *encrypted* | The public website door (locked, secure) |
| **22** | SSH | Remote login to the server's command line | The staff service entrance |
| **3389** | RDP | Remote desktop (full screen control) | The "drive my whole computer from afar" door |

Your live app from last session answers the world on door **443** — that is what the padlock in the browser bar means. We will spend Lesson 2 on *why* 443 and not 80.

> 🔧 **Technical Stuff.** A full address on the internet is **IP address + port**, written together as `142.250.65.78:443` — exactly the shape of `127.0.0.1:8000` you typed all last session. The part before the colon is which room; the part after the colon is which door. Now you know what that colon was always saying.

## The firewall: the reception desk

If every room has thousands of doors and the building is the whole internet, what stops a stranger from trying every door on your room until one opens? The **firewall.**

The firewall is the **reception desk** in the lobby. Every note coming in from the hallway passes it first, and the desk has a list of rules: *door 443, allow anyone — that's the public website. Door 22, allow only staff badges from the back office. Every other door, blocked.* The firewall does not look at what the note says; it looks only at which room and which door it is trying to reach, and either waves it through or stops it cold.

This is the single most important control in network security, and it is simple in principle: **decide which doors may be reached, by whom, and shut the rest.** If a door is not on the allow list, the note never reaches it — the service inside never even knows someone knocked.

## Inside vs. outside: the LAN and the public internet

One more distinction and the picture is complete. The hospital's own hallways — the network that connects KHCC's rooms to each other but not to the outside world — is a **LAN** (local area network), often called the **intranet.** It is the inside of the building: staff move freely, and a great deal of clinical software is reachable *only* from in here. Walk out the front door onto the street and you are on the **public internet** — every other building in the world.

The reception desk sits exactly where the inside meets the outside. Plenty of services are meant for the intranet only — reachable from any room inside, but with no door to the street at all. That is, in fact, one of the strongest things you can do for a sensitive system: **don't give it a public door in the first place.** A room with no street entrance cannot be knocked on by strangers.

## The tension at the center of everything

Now the payoff, and the sentence to carry into every lesson that follows:

**"Reachable from anywhere" is both the entire point of deployment and the entire danger.**

You deployed your app *so that* anyone could reach it — that was the win, the URL you texted to a colleague. But the same open door that lets your colleague in lets everyone else walk up and try the handle too. There is no version of "on the public internet" that is reachable by your users but invisible to everyone else. Every door you open to the street is, by definition, a door an attacker can find.

That is not a reason to never deploy. It is the reason the rest of this session exists. The discipline is captured in one phrase you will hear again in Lesson 9: **open the minimum.** One door, the locked one, for the public; everything else shut at the reception desk.

> ⚠️ **Watch Out.** Every open port is **attack surface** — one more door someone can try, one more thing that can have a flaw. The number-one network mistake is leaving doors open "just in case." A web server needs door 443 open to the world and *nothing else* facing the street. If 22 or 3389 are reachable from the public internet, you have handed strangers your staff entrance and your remote-control door. The fix is always the same: open the fewest doors that make the app work, and slam the rest.

## Try This

1. **Audit a web server's doors.** A public hospital website needs exactly one door open to the street: **443** (HTTPS). For each of these, decide *open to the public* or *shut / inside-only*: door 443, door 80, door 22 (SSH), door 3389 (RDP). Which one, if left open to the internet, would scare you most, and why?
2. **Draw your own building.** Sketch the analogy for your own department: pick three "rooms" (computers or systems you use), label the "hallway" that connects them, and put a "reception desk" where your department meets the wider hospital network. You don't need to be right — you need to see the shape.
3. **Name one door on your own machine.** Think of one service your computer talks to — a website, a shared drive, a remote login — and name the port it likely uses (hint: a website is 443). Saying "this app talks on door ___ " out loud once makes the idea stick.

## Watch Out

The instinct that gets clinical systems breached is treating "open a door" as free. It never is. Every port you expose to the internet is a permanent invitation that someone, somewhere, will eventually accept — automated scanners knock on every door of every public address on earth, all day, every day. The protection is not cleverness; it is restraint: **least privilege at the door.** Open only 443 to the public, keep login doors like 22 and 3389 off the public internet entirely (reachable only from inside, or through a controlled path), and let the reception desk turn everyone else away. In Lesson 9 you will see the exact tool that does this in the cloud — the Azure **network security group** — and it is nothing more than the reception desk's rule list, written down. Everything you learn between here and there is about what travels through that one open door, and who is allowed to.

You now have the building. But a note crossing the hallway passes people standing in it — so who can read your message on the way? That is Lesson 2: encryption.

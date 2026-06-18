---
layout: page
title: "Lesson 9: The Cloud, Hardened — Azure CLI from Resource Group to Teardown"
permalink: /session_12/instructions/lesson9_cloud_hardened_azure/
---

<a class="back-btn" href="/CCI.io/session-12/" style="display:inline-flex;align-items:center;gap:.3rem;font-size:.8rem;font-weight:600;color:#AD1457;text-decoration:none;padding:.35rem .65rem;border-radius:.4rem;border:1px solid #F8BBD0;background:#FCE4EC;margin-bottom:1rem;">&#8249; Back to Session 12</a>

<style>
.site-nav{display:none!important}
.site-header{border-top:5px solid #AD1457!important}
.site-title,.site-title:visited{color:#AD1457!important;font-weight:800!important}
</style>

# Lesson 9 — The Cloud, Hardened: Azure CLI from Resource Group to Teardown

*35 minutes. By the end you will have watched a real Linux server be born in the cloud, hardened, made to serve a web page, and then deleted to nothing — and you will hold a numbered runbook to do it yourself, plus the habit of asking an AI assistant "what's still exposed?" before you trust any configuration.*

This is where the whole session comes together. For eight lessons you have built the mental model — networks and ports (Lesson 1), encryption in transit and at rest (Lessons 2–3), how attacks unfold (Lesson 4), passwords and keys and least privilege (Lesson 5), detection (Lesson 6), and what the law and the doctrine require of patient data (Lessons 7–8). Now you operate it. You will stand up a server in **Microsoft Azure** the way the AI Office does — opening the fewest doors, logging in with a key instead of a password, running as a least-privilege user — and then you will **delete every piece of it**, because a server you forgot to turn off is both a bill that never stops and a door that never closes.

## Why Azure, and why the command line

In Session 11 you deployed your app on Render, and we deliberately *avoided* the cloud's raw machinery because it was too much for shipping your first app. Session 12 brings it back, on purpose, because the cloud is the best possible teacher of *infrastructure security* — it is the one place where you build the network, the firewall, and the server yourself, and see exactly which doors you opened.

We do it through **Azure Cloud Shell** — a terminal that runs *in your browser*, inside Azure, with the `az` command-line tool already installed and already logged in. Nothing is installed on your laptop. You do not need your own subscription for class: the instructor runs the whole sequence live, and you keep the numbered runbook (`azure_hardened_vm/`) to replay later when you do have access.

> 💡 **Tip.** Why the command line instead of clicking through the Azure web portal? Because a sequence of typed commands is a *runbook* — you can read it, review it, paste it into an AI assistant, save it, and run it again identically next month. A series of clicks vanishes the moment you finish. Infrastructure you can read is infrastructure you can secure. Every command below lives in the kit as a numbered script.

## The lifecycle, in one breath

Here is the whole arc before we walk it slowly. A hardened server has a beginning, a middle, and — the part everyone forgets — an **end**.

```
01  Create a resource group     (a labelled box that holds everything)
02  Create a hardened VM         (SSH-key login, patched Linux image)
03  Lock the firewall (NSG)      (open only port 22 and 443; shut the rest)
04  Install & serve a web page   (nginx + one index.html)
05  Verify from the outside      (the page loads; closed doors stay shut)
99  DELETE EVERYTHING            (one command erases the whole box)
```

The resource group is the trick that makes the end clean: because *every* piece lives inside that one labelled box, deleting the box deletes the VM, its disk, its network, and its public address in a single command. Nothing is left running, nothing keeps billing.

## Step 1 — A resource group: the box that holds everything

A **resource group** is just a named container for related Azure things. Make one, put the whole lab inside it, and teardown becomes trivial.

```bash
az group create \
  --name cci-hardening-lab \
  --location uaenorth
```

That is the entire step. `cci-hardening-lab` is the box; `uaenorth` is the region (a nearby Azure datacentre). Everything else we create names this group, so it all lands in the same box.

> 🧠 **Remember.** One resource group per experiment. It is the difference between "delete the box" and hunting through a dashboard six weeks later wondering which of nine half-remembered resources is the one quietly charging your card.

## Step 2 — A VM that logs in with a key, not a password

Now the server itself. Watch the two hardening choices baked into this single command — they are Lesson 5, scaled to a machine.

```bash
az vm create \
  --resource-group cci-hardening-lab \
  --name cci-web \
  --image Ubuntu2204 \
  --size Standard_B1s \
  --admin-username azureuser \
  --generate-ssh-keys
```

- `--image Ubuntu2204` — a current, **patched** Linux image. Lesson 4's first defence was "patch known holes"; you start from a maintained image, not an ancient one full of public exploits.
- `--admin-username azureuser` — a normal, **non-root** account. This is least privilege (Lesson 5): day-to-day login is *not* the all-powerful `root` user, so a compromise of this account does not hand over the whole machine.
- `--generate-ssh-keys` — the crucial one. Instead of a password, Azure creates an **SSH key pair**: a public half that goes on the server, and a private half that stays in your Cloud Shell and is *never typed, never transmitted, and cannot be phished.* This is exactly the "something you have" factor from Lesson 5, and it is why hardened servers use keys instead of passwords. **No secret is ever written into these scripts** — the key is generated on the spot and stays in Cloud Shell.

> 🔧 **Technical Stuff.** SSH-key login is asymmetric encryption (Lesson 3) doing authentication. The server keeps your *public* key. When you connect, it challenges you to prove you hold the matching *private* key, which never leaves your machine. There is no shared password to guess, intercept, reuse, or phish — the entire category of credential attacks from Lessons 4–5 simply does not apply. This is the single biggest reason a key-only server is dramatically harder to break into than a password one.

## Step 3 — The NSG: the reception desk, written down

Remember Lesson 1's firewall — the reception desk that decides which doors may be reached, by whom? In Azure it has a name: the **Network Security Group (NSG)**, a list of allow/deny rules attached to your VM. This is the most important security step in the whole lab, and it is pure Lesson 1 made literal.

By default, a fresh VM may have its SSH door (22) open to the entire internet. We tighten everything to the minimum a web server needs:

```bash
# Allow the public website door (HTTPS) from anyone
az network nsg rule create \
  --resource-group cci-hardening-lab \
  --nsg-name cci-webNSG \
  --name allow-https \
  --priority 1001 \
  --destination-port-ranges 443 \
  --access Allow --protocol Tcp --direction Inbound

# Allow the staff service entrance (SSH) — ideally only from YOUR address
az network nsg rule create \
  --resource-group cci-hardening-lab \
  --nsg-name cci-webNSG \
  --name allow-ssh-from-me \
  --priority 1000 \
  --source-address-prefixes "<your.ip.here>/32" \
  --destination-port-ranges 22 \
  --access Allow --protocol Tcp --direction Inbound
```

Two doors, and notice the asymmetry that *is* the lesson:

- **Port 443 (HTTPS)** is open to *anyone* — it is a public website; the whole point is that the world can reach it. This is the one door that belongs open to the street.
- **Port 22 (SSH)** is open only to **your own IP address** (`/32` means exactly one address). The staff entrance is not facing the open street; it is reachable only from where you actually work. Lesson 1's warning was that leaving 22 open to the whole internet hands strangers your service entrance — automated scanners knock on it all day. Restricting the source closes that off.
- **Everything else is shut.** The NSG denies by default; every door you did not explicitly open stays closed at the reception desk.

> ⚠️ **Watch Out.** The number-one cloud breach is an SSH or database port left open to `0.0.0.0/0` — *every address on earth* — "just to make it work." It works, and then a scanner finds it within hours and begins trying. The fix is always the same restraint from Lesson 1: **open the minimum.** 443 to the public, 22 to you, the rest shut. If you ever see a rule with source `Any`/`0.0.0.0/0` on a login or database port, treat it as a fire.

## Step 4 — Serve one page

With the server up and the doors set, install a web server and give it something to say. You connect over SSH (using that key, no password) and install **nginx**, a standard web server:

```bash
ssh azureuser@<vm-public-ip>      # logs in with your key — no password prompt

sudo apt update && sudo apt install -y nginx
echo "<h1>CCI hardened server — and soon, gone.</h1>" | sudo tee /var/www/html/index.html
```

`sudo` is the controlled way a least-privilege user borrows admin rights for one specific command — not by *being* root, but by stepping up briefly and stepping back down. That is least privilege in daily motion: you are `azureuser`, and you reach for elevated power only for the install, then drop it.

> 🔧 **Technical Stuff.** In a real deployment this is also where HTTPS gets its certificate (so port 443 actually serves encrypted traffic, per Lessons 2–3) — typically via a free Let's Encrypt certificate that nginx renews automatically. For this teaching lab we keep the focus on the lifecycle and the firewall, but remember from Lesson 2: a public clinical site that served on plain port 80 would be a postcard. Production opens 443 and serves a real certificate, never 80 alone.

## Step 5 — Verify from the outside

Hardening you cannot confirm is hardening you do not have. Two checks, from *outside* the server:

```bash
az vm list-ip-addresses \
  --resource-group cci-hardening-lab \
  --name cci-web -o table          # find the public IP

curl http://<vm-public-ip>          # the page loads → the open door works
```

The page should load — proof the one door you meant to open is open. Just as important is the *negative* test: a door you did **not** open (say, port 3389 for remote desktop) should refuse the connection. Confirming that the closed doors are actually closed is the part people skip, and it is the part that matters.

## Step 99 — Delete everything (the step nobody remembers)

This is the step that separates a professional from an expensive accident. The moment you no longer need the server, erase it:

```bash
az group delete \
  --name cci-hardening-lab \
  --yes --no-wait
```

One command. Because everything lived inside `cci-hardening-lab`, deleting the group deletes the VM, its disk, its network interface, its NSG, and its public IP — *all of it* — in a single sweep. Nothing keeps running; nothing keeps billing; there is no longer any door for anyone to knock on.

> 🧠 **Remember.** A running VM is two liabilities at once: **a bill that never sleeps and a 24/7 attack surface.** The most secure server in the world is one that no longer exists. Tearing down what you are done with is not tidiness — it is security and cost control in the same keystroke. The lab is not complete until Step 99 has run and a final `az group list` shows the box is gone.

## The last move: ask the AI "what's still exposed?"

You have one more tool, and it closes the loop with everything Session 10 and 11 taught you about working *with* an AI assistant. Before you trust any configuration — yours or one you inherited — **paste it into an AI assistant** (or the AIDI security skill) and ask, plainly:

> *"Here is my Azure VM and NSG configuration. What is still exposed? What would an attacker try first? What did I leave open that I shouldn't have?"*

A good assistant will catch the things tired humans miss: an SSH rule with source `Any`, a forgotten port, an image that is no longer patched, a public IP on a machine that did not need one, a database port facing the world. It will not replace your judgement — you still decide what to act on — but it is a relentless, knowledgeable second pair of eyes that never gets bored reading rule lists. This is the same human-plus-AI discipline you used for clinical extraction, pointed now at your own front door.

> 💡 **Tip.** Do this *before* you serve anything real, and again any time you change a rule. "What's still exposed?" is the cheapest security review you will ever run, and it costs one paste.

## Try This

These run live in class; replay them later from the runbook (`azure_hardened_vm/`) when you have Azure access. For now you can reason them out:

1. **Walk the lifecycle from memory.** Without looking, name the six stages in order: group → VM → NSG → serve → verify → delete. For each, say the one security idea it carries (e.g. NSG = open the minimum).
2. **Audit a bad NSG.** You inherit a server whose NSG opens port 22 to `0.0.0.0/0` and port 3389 to `0.0.0.0/0`. Name what is wrong with each rule, and write the safer version (hint: restrict 22 to your IP; does this web server need 3389 at all?).
3. **Write the AI prompt.** Draft the exact message you would paste to an assistant to review a VM configuration for exposure. Then predict the top three things it would flag on a careless setup.

## Watch Out

- **The forgotten VM.** The most common Azure regret is not a breach — it is a machine left running for months because nobody deleted it. It bills the whole time and, worse, it sits on the internet unpatched and unwatched, a perfect target. Always end with Step 99. If a VM must persist, it must also be *owned* — patched, monitored, and someone's explicit responsibility.
- **The convenient open door.** Under time pressure, `0.0.0.0/0` on the SSH or database port is the shortcut everyone is tempted by. It is the shortcut attackers count on. Open the minimum, every time, even in a lab — because the habit you practise in the lab is the habit you will reach for in production.
- **A key is still a secret.** SSH keys defeat password attacks, but the *private* key is now the thing that opens the door. Keep it where it was generated (Cloud Shell, or your own machine), never paste it into a file you commit, and treat losing it the way you would treat losing a master key — because that is what it is.

That is the session. You started with a server reachable from anywhere and the danger that came with it; you end able to build one that opens the fewest doors, logs in with a key no one can phish, runs as a least-privilege user, serves over an encrypted channel, and disappears completely when its job is done — and you know to ask an AI to find what you missed. **A publicly reachable system with real patient data is a different universe from a teaching demo.** Now you know exactly what the front door is made of, and how to lock it.

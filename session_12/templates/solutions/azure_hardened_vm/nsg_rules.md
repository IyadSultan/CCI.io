# The NSG, explained — the reception desk written down

The Network Security Group (NSG) is Lesson 1's firewall — the reception desk that
decides which doors may be reached, by whom. Azure denies everything by default;
you add **allow** rules for the few doors you actually need.

## The rules this lab creates

| Name | Port | Source | Why |
|---|---|---|---|
| `allow-https` | 443 | **Any** (the internet) | It's a public website — the whole point is that the world can reach it. This is the one door that belongs open to the street. |
| `allow-ssh-from-me` | 22 | **your IP only** (`/32`) | The staff service entrance. Reachable only from where you actually work — not facing the open street. |
| *(everything else)* | — | — | **Shut.** The NSG denies by default; a door you didn't open never opens. |

`/32` means *exactly one address* — your single public IP. Restricting SSH this way
closes off the automated scanners that knock on port 22 of every public address on
earth, all day.

## The asymmetry IS the lesson

- **443 → Any** is correct: a public site must be publicly reachable.
- **22 → you only** is correct: a login door must not face the whole internet.
- A login or database port open to **`0.0.0.0/0` / `*` / "Internet"** is the
  number-one cloud breach. If you see one, treat it as a fire.

## Reading the audit (`05_verify.sh`)

The `Source` column is the one to stare at:

```
Name                Priority  Port  Source          Access
allow-ssh-from-me   1000      22    203.0.113.45/32  Allow      <- good: just you
allow-https         1001      443   *                Allow      <- good: public site
```

A safe web server shows **443 from `*`** and **22 from your `/32`** — and nothing
else inbound. Anything more is attack surface you didn't mean to create.

## Then ask the AI

Paste the rule list into an assistant (or the AIDI security skill):

> "Here is my Azure NSG rule list. What is still exposed? What would an attacker
> try first? What did I leave open that I shouldn't have?"

It will catch the tired-human misses — a forgotten port, an SSH rule with source
`Any`, a database door facing the world. It doesn't replace your judgement; it's a
relentless second pair of eyes that never gets bored reading rule lists.

---

*CCI · Session 12 · Iyad Sultan, MD · AI Office, King Hussein Cancer Center*

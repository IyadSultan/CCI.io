# Student Tasks — Azure Hardened VM (Session 12)

The complete scripts are in `../../solutions/azure_hardened_vm/`. Try these before
peeking.

## Task 1 — Open the minimum (Lesson 9)
**File:** `03_lock_nsg.sh` → the `allow-ssh-from-me` rule.
Fill in the two `TODO` blanks so SSH (port **22**) is reachable **only from your own
IP** (`${MY_IP}/32`), never the whole internet. This is the single most important
security decision in the lab — a login port open to `0.0.0.0/0` is the #1 cloud breach.

## Task 2 — Audit a configuration (Lesson 9)
After `05_verify.sh` prints the NSG rule list, look at the **Source** column. For
each rule, decide: is this door open to the right audience?
- 443 from `*` (Internet) → ?
- 22 from your `/32` → ?
- (imagine) 3389 from `*` → ?
Write one sentence per rule.

## Task 3 — Ask the AI "what's still exposed?"
Copy the NSG rule list from `05_verify.sh` and paste it to an AI assistant with the
prompt: *"What is still exposed? What would an attacker try first?"* Write down the
top three things it flags, and whether you agree.

## Task 4 — Never forget the teardown
Run `99_delete_everything.sh` and then `az group list -o table`. Confirm the box is
gone. Explain in one sentence why a forgotten VM is dangerous even if nobody attacks
it (hint: two liabilities — cost and surface).

---

*Check your answers against `../../solutions/azure_hardened_vm/`.*

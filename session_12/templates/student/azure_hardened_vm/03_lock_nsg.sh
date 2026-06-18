#!/usr/bin/env bash
# Step 3 — Lock the firewall (the NSG). THE most important security step.
# The NSG is Lesson 1's "reception desk", written down: a list of which doors may
# be reached, by whom. We open the MINIMUM a web server needs and shut the rest.
#
#   443 (HTTPS)  -> open to ANYONE        (it's a public website; that's the point)
#   22  (SSH)    -> open to YOUR IP ONLY  (the staff entrance, not facing the street)
#   everything else -> shut (the NSG denies by default)
set -euo pipefail
cd "$(dirname "$0")"
source config.sh

# Find the address YOU are coming from, so SSH is reachable only from here.
MY_IP="$(curl -s https://api.ipify.org || true)"
if [[ -z "${MY_IP}" ]]; then
  echo "Could not detect your public IP automatically."
  read -r -p "Enter your public IP (see https://whatismyip.com): " MY_IP
fi
echo "Restricting SSH (port 22) to your address: ${MY_IP}/32"

# Allow the public website door (HTTPS) from anyone.
az network nsg rule create \
  --resource-group "$RG" --nsg-name "$NSG" \
  --name allow-https --priority 1001 \
  --destination-port-ranges 443 \
  --access Allow --protocol Tcp --direction Inbound \
  --output table

# Allow the staff service entrance (SSH) — only from YOUR address.
# >>> TODO (Lesson 9, Task 1): "open the minimum". Fill in the two blanks below so
#     that SSH (port 22) is reachable ONLY from your own address, not the whole
#     internet. Getting this wrong is the #1 cloud breach.
#     HINT: --source-address-prefixes "${MY_IP}/32"   and   --destination-port-ranges 22
az network nsg rule create \
  --resource-group "$RG" --nsg-name "$NSG" \
  --name allow-ssh-from-me --priority 1000 \
  --source-address-prefixes "____"  `# <-- TODO: your IP only, as ${MY_IP}/32` \
  --destination-port-ranges ____    `# <-- TODO: which door is SSH?` \
  --access Allow --protocol Tcp --direction Inbound \
  --output table

# Tighten any default "SSH from anywhere" rule Azure may have added at create time.
az network nsg rule update \
  --resource-group "$RG" --nsg-name "$NSG" \
  --name default-allow-ssh \
  --source-address-prefixes "${MY_IP}/32" \
  --output table 2>/dev/null || true

echo
echo "Doors set: 443 -> public, 22 -> you, everything else shut."
echo "Review them with:  ./05_verify.sh   (or see nsg_rules.md)"
echo "Next: ./04_serve_site.sh"

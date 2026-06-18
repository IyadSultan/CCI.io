#!/usr/bin/env bash
# Step 99 — DELETE EVERYTHING. The step that separates a professional from an
# expensive accident. Because the whole lab lives inside one resource group,
# deleting the group erases the VM, its disk, its network, its NSG, and its public
# IP in a single sweep. Nothing keeps running; nothing keeps billing; no door is
# left for anyone to knock on.
#
# Remember (Lesson 9): a running VM is two liabilities at once — a bill that never
# sleeps and a 24/7 attack surface. The most secure server is one that no longer
# exists.
set -euo pipefail
cd "$(dirname "$0")"
source config.sh

echo "About to DELETE the entire resource group '$RG' and everything in it."
read -r -p "Type the group name to confirm: " CONFIRM
if [[ "$CONFIRM" != "$RG" ]]; then
  echo "Names did not match. Nothing deleted."
  exit 1
fi

az group delete --name "$RG" --yes --no-wait
echo
echo "Deletion started (runs in the background)."
echo "Confirm it's gone in a minute with:  az group list -o table"
echo "The lab is not complete until '$RG' no longer appears in that list."

#!/usr/bin/env bash
# Step 5 — Verify from the OUTSIDE. Hardening you can't confirm is hardening you
# don't have. Two checks: the door you opened works, and the audit list shows only
# the doors you meant to open.
set -euo pipefail
cd "$(dirname "$0")"
source config.sh

VM_IP="$(az vm list-ip-addresses --resource-group "$RG" --name "$VM" \
  --query "[0].virtualMachine.network.publicIpAddresses[0].ipAddress" -o tsv)"

echo "Public IP: $VM_IP"
echo
echo "1) Does the page load? (the door you opened works)"
curl -s "http://${VM_IP}" | head -n 5 || echo "  (no response yet — give nginx a moment)"

echo
echo "2) Audit the NSG — confirm ONLY the doors you meant are open:"
az network nsg rule list --resource-group "$RG" --nsg-name "$NSG" \
  --query "[].{Name:name, Priority:priority, Port:destinationPortRange, Source:sourceAddressPrefix, Access:access}" \
  -o table

echo
echo "Look hard at the Source column. Any login/database port with source '*' or"
echo "'0.0.0.0/0' (Internet) is a FIRE — fix it. 443 from Internet is fine; 22 must"
echo "be your IP only."
echo
echo "Tip (Lesson 9): paste this rule list into an AI assistant and ask"
echo "  \"what's still exposed? what would an attacker try first?\""
echo
echo "When you are done: ./99_delete_everything.sh   <-- DO NOT SKIP THIS"

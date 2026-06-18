#!/usr/bin/env bash
# Step 2 — Create a hardened Linux VM.
# Two hardening choices are baked into this one command (this is Lesson 5, scaled
# to a machine):
#   --generate-ssh-keys : log in with an SSH KEY, not a password. The private half
#                         stays in Cloud Shell — never typed, never sent, can't be
#                         phished. (No secret is written into this script.)
#   --admin-username    : a NON-root, least-privilege account for day-to-day login.
#   --image Ubuntu2204  : a current, PATCHED image — not an ancient one full of holes.
set -euo pipefail
cd "$(dirname "$0")"
source config.sh

echo "Creating VM '$VM' (image $VM_IMAGE, size $VM_SIZE)..."
az vm create \
  --resource-group "$RG" \
  --name "$VM" \
  --image "$VM_IMAGE" \
  --size "$VM_SIZE" \
  --admin-username "$ADMIN_USER" \
  --generate-ssh-keys \
  --public-ip-sku Standard \
  --output table

# Capture and show the public IP for the next steps.
VM_IP="$(az vm list-ip-addresses --resource-group "$RG" --name "$VM" \
  --query "[0].virtualMachine.network.publicIpAddresses[0].ipAddress" -o tsv)"

echo
echo "VM is up. Public IP: $VM_IP"
echo "Log in later with:  ssh ${ADMIN_USER}@${VM_IP}   (uses your key — no password)"
echo "Next: ./03_lock_nsg.sh"

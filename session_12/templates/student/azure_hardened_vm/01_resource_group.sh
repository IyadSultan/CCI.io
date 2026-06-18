#!/usr/bin/env bash
# Step 1 — Create the resource group: one labelled box that holds the whole lab.
# Because everything we make names this group, teardown (script 99) is one command.
set -euo pipefail
cd "$(dirname "$0")"
source config.sh

echo "Creating resource group '$RG' in '$LOCATION'..."
az group create \
  --name "$RG" \
  --location "$LOCATION" \
  --output table

echo
echo "Done. Everything from here lands in the box '$RG'."
echo "Next: ./02_create_vm.sh"

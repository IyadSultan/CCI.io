#!/usr/bin/env bash
# Step 4 — Install a web server (nginx) and serve our one page.
# We log in over SSH using the KEY (no password prompt), install nginx, and copy
# index.html into place. `sudo` is how a least-privilege user borrows admin rights
# for ONE command, then drops them again — least privilege in daily motion.
set -euo pipefail
cd "$(dirname "$0")"
source config.sh

VM_IP="$(az vm list-ip-addresses --resource-group "$RG" --name "$VM" \
  --query "[0].virtualMachine.network.publicIpAddresses[0].ipAddress" -o tsv)"
echo "Serving the site on VM at ${VM_IP}..."

# Copy our page up, then install nginx and put the page in place.
scp -o StrictHostKeyChecking=accept-new site/index.html "${ADMIN_USER}@${VM_IP}:/tmp/index.html"

ssh -o StrictHostKeyChecking=accept-new "${ADMIN_USER}@${VM_IP}" '
  set -e
  sudo apt-get update -y
  sudo apt-get install -y nginx
  sudo mv /tmp/index.html /var/www/html/index.html
  sudo systemctl enable --now nginx
  echo "nginx installed and serving."
'

echo
echo "Page is live. NOTE: real clinical traffic must be HTTPS (port 443) with a"
echo "certificate (e.g. free Let's Encrypt) — Lesson 2: plain HTTP is a postcard."
echo "Next: ./05_verify.sh"

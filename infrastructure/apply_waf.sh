#!/bin/bash
# Soni Ecosystem: Cloudflare API Automation Script
# Skills: clean-code, security-auditor, backend-architect, api-design-principles

set -e

# --- Configuration & Helpers ---
INFRA_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="$INFRA_DIR/.env"
RULES_FILE="$INFRA_DIR/canonical_waf_rules.json"

# Function to log with timestamp
log() { echo "$(date '+%Y-%m-%d %H:%M:%S') - $1"; }
error() { log "ERROR: $1"; exit 1; }

# --- Initialization ---
log "Starting WAF Rule Deployment..."

# Source local .env if it exists
if [ -f "$ENV_FILE" ]; then
    log "Loading credentials from $ENV_FILE"
    # Use grep/sed to read values safely without full source
    API_TOKEN=$(grep CLOUDFLARE_API_TOKEN "$ENV_FILE" | cut -d'"' -f2)
    ZONE_ID=$(grep CLOUDFLARE_ZONE_ID "$ENV_FILE" | cut -d'"' -f2)
fi

# Validation
[ -z "$API_TOKEN" ] && error "CLOUDFLARE_API_TOKEN is missing. Provide it in .env or as an environment variable."
[ -z "$ZONE_ID" ] && error "CLOUDFLARE_ZONE_ID is missing. Provide it in .env or as an environment variable."
[ ! -f "$RULES_FILE" ] && error "Canonical rules file missing at $RULES_FILE"

# --- Execution ---

# 1. Custom Firewall Ruleset (WAF)
# Note: We use PUT for full ruleset replacement to ensure state consistency
log "Deploying Custom WAF Ruleset (Admin Lockdown + Bot Challenge)..."

# First, we need to find the Ruleset ID for the phase: http_request_firewall_custom
RULESET_ID=$(curl -s -X GET "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/rulesets" \
    -H "Authorization: Bearer $API_TOKEN" \
    -H "Content-Type: application/json" | \
    grep -oP '"id":"\K[^"]+(?=","kind":"zone","last_updated":"[^"]*","name":"default","phase":"http_request_firewall_custom")' || \
    grep -oP '"id":"\K[^"]+(?=","kind":"zone","last_updated":"[^"]*","name":"Soni Custom Firewall")')

if [ -z "$RULESET_ID" ]; then
    log "Initializing new Custom Firewall ruleset..."
    curl -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/rulesets" \
         -H "Authorization: Bearer $API_TOKEN" \
         -H "Content-Type: application/json" \
         --data "@$RULES_FILE"
else
    log "Updating existing ruleset: $RULESET_ID"
    curl -X PUT "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/rulesets/$RULESET_ID" \
         -H "Authorization: Bearer $API_TOKEN" \
         -H "Content-Type: application/json" \
         --data "@$RULES_FILE"
fi

log "WAF Deployment Complete. 'Silicon Valley Standard' perimeter active."

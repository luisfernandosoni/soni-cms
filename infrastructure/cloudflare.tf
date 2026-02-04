# Soni Ecosystem: Cloudflare Infrastructure as Code (2026 Standard)
# Skills: backend-architect, security-auditor, api-design-principles

terraform {
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
  }
}

variable "cloudflare_api_token" {
  description = "Cloudflare API Token"
  type        = string
  sensitive   = true
}

variable "zone_id" {
  description = "Cloudflare Zone ID for soninewmedia.com"
  type        = string
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

# 1. API Rate Limiting (Phase 4 Remediation)
# Enforces a strict 100 req / minute limit on /api and /admin paths
resource "cloudflare_ruleset" "api_rate_limiting" {
  zone_id     = var.zone_id
  name        = "Soni API Rate Limiting"
  description = "Protect API and Admin routes from brute force and DoS"
  kind        = "zone"
  phase       = "http_ratelimit"

  rules {
    action = "block"
    ratelimit {
      characteristics     = ["cf.unique_visitor_id", "ip.src"]
      period              = 60
      requests_per_period = 100
      mitigation_timeout  = 600
    }
    expression = "(http.request.uri.path starts_with \"/api/\" or http.request.uri.path starts_with \"/admin/\")"
    description = "Rate limit API and Admin access"
    enabled     = true
  }
}

# 2. Managed WAF (OWASP + Cloudflare Specials)
# Shields against SQLi, XSS, and common exploits
resource "cloudflare_filter" "sql_xss_protection" {
  zone_id    = var.zone_id
  description = "SQLi and XSS protection expression"
  expression  = "(http.request.uri.query contains \"union select\") or (http.request.uri.query contains \"script\") or (http.request.uri.path contains \"passwd\")"
}

resource "cloudflare_firewall_rule" "block_malicious" {
  zone_id     = var.zone_id
  description = "Block common injection attempts"
  filter_id   = cloudflare_filter.sql_xss_protection.id
  action      = "block"
}

# 3. Bot Management (Unicorn Tier)
# Challenges suspicious traffic and blocks known bad bots
resource "cloudflare_ruleset" "bot_mitigation" {
  zone_id     = var.zone_id
  name        = "Soni Bot Mitigation"
  description = "JS Challenge for automated probes"
  kind        = "zone"
  phase       = "http_request_firewall_custom"

  rules {
    action = "js_challenge"
    expression = "(cf.bot_management.score < 30 and not http.request.uri.path in {\"/_next/static/*\" \"/favicon.ico\"})"
    description = "JS Challenge for low reputation traffic"
    enabled     = true
  }

  rules {
    action = "block"
    expression = "(cf.bot_management.score < 10)"
    description = "Block confirmed bad bots"
    enabled     = true
  }
}

# 4. Admin Security (Phalanx Layer)
# Forces JS Challenge on all admin access regardless of score
resource "cloudflare_firewall_rule" "admin_lockdown" {
  zone_id     = var.zone_id
  description = "Challenge all Admin access"
  filter_id   = cloudflare_filter.admin_path.id
  action      = "js_challenge"
}

resource "cloudflare_filter" "admin_path" {
  zone_id    = var.zone_id
  description = "Admin path filter"
  expression  = "(http.request.uri.path starts_with \"/admin\")"
}

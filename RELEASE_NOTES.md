# HiveInsurance MCP Server — v1.0.0

## Overview

Initial scaffold for `hive-mcp-insurance`. The MCP server is structurally complete: `tools/list`, `/health`, and `/.well-known/mcp.json` are operational. The hivemorph backend for this vertical is not yet built. All `tools/call` requests return HTTP 503 — no mock data, no simulated responses.

---

## Tools

| Tool | Description |
|---|---|
| `quote_policy` | Returns a premium estimate for the given risk type, coverage amount (USD), and term length. Backend pending (Q3 2026). |
| `bind_policy` | Binds a previously quoted policy. Settlement via x402 / USDC on Base, Ethereum, or Solana. Returns `policy_id`. Backend pending (Q3 2026). |
| `claim_status` | Returns current claim state: `pending` / `triggered` / `paid` / `disputed`. Backend pending (Q3 2026). |
| `parametric_trigger_check` | Evaluates whether a parametric oracle event hash satisfies the trigger condition. Returns boolean. Backend pending (Q3 2026). |

---

## Endpoints

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/v1/insurance/quote` | Parametric policy premium estimate |
| `POST` | `/v1/insurance/bind` | Bind policy — USDC settlement via x402 |
| `GET` | `/v1/insurance/claims/{policy_id}` | Claim status |
| `GET` | `/v1/insurance/trigger` | Oracle event hash trigger check |

---

## Settlement

USDC on Base, Ethereum, or Solana via x402. No mock, no simulated settlement.

---

## Status

- **Backend:** v0.1 — pending hivemorph build (Q3 2026 spec)
- **Council:** R4
- **`tools/list`:** operational
- **`/health`:** operational
- **`/.well-known/mcp.json`:** operational
- **`tools/call`:** returns HTTP 503

```json
{
  "error": "feature gating: backend pending; submit interest at hive-mcp-connector",
  "backend_status": "v0.1 — pending hivemorph backend build (Q3 2026 spec)",
  "service": "hive-mcp-insurance",
  "interest_url": "https://hive-mcp-connector.thehiveryiq.com"
}
```

---

## Constraints

- No mock data, no simulated settlement at any point
- Brand gold: Pantone 1245 C / `#C08D23`
- No energy futures, GAS-PERP, GPU-PERP, or HASHRATE-PERP
- LLM calls route only through `https://hivecompute-g2g7.onrender.com/v1/compute/chat/completions`
- hivemorph remains private; this repository is the public surface

# HiveInsurance MCP Server — v1.0.0

**Agent-native parametric insurance with smart-contract triggers and USDC settlement**

---

## Release summary

This is the initial catalog-ready scaffold for `hive-mcp-insurance`. The Hive Civilization MCP shim is live and discoverable. The hivemorph backend for this vertical is pending (Q3 2026). All `tools/call` requests return HTTP 503 — no mock data, no simulated responses (Rails Rule 1).

## What's included

| Tool | Description |
|---|---|
| `quote_policy` | Quote a parametric insurance policy. Returns a premium estimate for the given risk type, coverage amount (USD), and term length. Backend pending (Q3 2026). |
| `bind_policy` | Bind a previously quoted policy. Settlement via x402 / USDC on Base, Ethereum, or Solana. Returns policy_id on success. Backend pending (Q3 2026). |
| `claim_status` | Check the status of a parametric insurance claim associated with a policy. Returns current state: pending / triggered / paid / disputed. Backend pending (Q3 2026). |
| `parametric_trigger_check` | Check whether a parametric oracle event hash satisfies the trigger condition for automatic claim payout. Returns boolean. Backend pending (Q3 2026). |


## Backend endpoints

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/v1/insurance/quote` | Quote a parametric policy (premium estimate) |
| `POST` | `/v1/insurance/bind` | Bind policy — USDC settlement via x402 |
| `GET` | `/v1/insurance/claims/{policy_id}` | Claim status: pending / triggered / paid / disputed |
| `GET` | `/v1/insurance/trigger` | Check oracle event hash against trigger condition |


## Council provenance

Council R4 — staged for Q3 2026 backend build

## Backend status

v0.1 — pending hivemorph backend build (Q3 2026 spec)

`tools/list`, `/health`, and `/.well-known/mcp.json` are fully operational. `tools/call` returns:
```json
{
  "error": "feature gating: backend pending; submit interest at hive-mcp-connector",
  "backend_status": "v0.1 — pending hivemorph backend build (Q3 2026 spec)",
  "service": "hive-mcp-insurance",
  "interest_url": "https://hive-mcp-connector.thehiveryiq.com"
}
```

## Rails rules (non-negotiable)

- Real rails only — no mock, no simulated settlement
- Brand gold: Pantone 1245 C / `#C08D23`
- No energy futures, GAS-PERP, GPU-PERP, HASHRATE-PERP — none in this vertical
- LLM calls only via `https://hivecompute-g2g7.onrender.com/v1/compute/chat/completions`
- hivemorph stays private — this shim repo is the public surface

## Connect

```
POST https://your-deployed-host/mcp
GET  https://your-deployed-host/health
GET  https://your-deployed-host/.well-known/mcp.json
```

Interest registration: [hive-mcp-connector](https://hive-mcp-connector.thehiveryiq.com)

---

*Hive Civilization — sovereign DID, USDC settlement, HAHS legal contracts, agent-to-agent rails.*
*Brand gold #C08D23 (Pantone 1245 C).*

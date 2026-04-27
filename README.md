# HiveInsurance

**Parametric insurance MCP server — smart-contract triggers and USDC settlement on Hive Civilization rails**

`hive-mcp-insurance` is an MCP server for the Hive parametric insurance platform. Agents quote and bind parametric insurance policies, check on-chain trigger conditions via oracle event hashes, and track claim status. Premiums and payouts settle in USDC on Base, Ethereum, or Solana via x402.

> **Backend status:** The hivemorph backend for this vertical is not yet built. All `tools/call` requests return HTTP 503 — no mock data is returned. Backend target: Q3 2026.

> Council R4 — staged for Q3 2026 backend build

---

## Backend Status

All `tools/call` requests return HTTP 503:
```json
{ "error": "feature gating: backend pending; submit interest at hive-mcp-connector" }
```
`tools/list`, `/health`, and `/.well-known/mcp.json` are operational and return the full tool catalog.
No mock data is returned at any point.

---

## Protocol

- **Spec:** MCP 2024-11-05 over Streamable-HTTP / JSON-RPC 2.0
- **Transport:** `POST /mcp`
- **Discovery:** `GET /.well-known/mcp.json`
- **Health:** `GET /health`
- **Settlement:** USDC on Base, Ethereum, Solana via x402 (real rails only)
- **Brand gold:** Pantone 1245 C / `#C08D23`
- **Tools:** 4

---

## Tools

| Tool | Description |
|---|---|
| `quote_policy` | Returns a premium estimate for the given risk type, coverage amount (USD), and term length. Backend pending (Q3 2026). |
| `bind_policy` | Binds a previously quoted policy. Settlement via x402 / USDC on Base, Ethereum, or Solana. Returns `policy_id`. Backend pending (Q3 2026). |
| `claim_status` | Returns current claim state: `pending` / `triggered` / `paid` / `disputed`. Backend pending (Q3 2026). |
| `parametric_trigger_check` | Evaluates whether a parametric oracle event hash satisfies the trigger condition. Returns boolean. Backend pending (Q3 2026). |

---

## Backend Endpoints (pending Q3 2026)

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/v1/insurance/quote` | Parametric policy premium estimate |
| `POST` | `/v1/insurance/bind` | Bind policy — USDC settlement via x402 |
| `GET` | `/v1/insurance/claims/{policy_id}` | Claim status |
| `GET` | `/v1/insurance/trigger` | Oracle event hash trigger check |

---

## Run Locally

```bash
git clone https://github.com/srotzin/hive-mcp-insurance.git
cd hive-mcp-insurance
npm install
npm start
# Server on http://localhost:3000
# tools/list returns tool catalog; tools/call returns 503 (backend pending)
curl http://localhost:3000/health
curl http://localhost:3000/.well-known/mcp.json
curl -s -X POST http://localhost:3000/mcp \
  -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | jq .result.tools[].name
```

---

## Connect from an MCP Client

Add to your `mcp.json`:

```json
{
  "mcpServers": {
    "hive_mcp_insurance": {
      "command": "npx",
      "args": ["-y", "mcp-remote@latest", "https://your-deployed-host/mcp"]
    }
  }
}
```

---

## Hive Civilization

Part of the [Hive Civilization](https://www.thehiveryiq.com) — sovereign DID, USDC settlement, HAHS legal contracts, agent-to-agent rails.

## License

MIT (c) 2026 Steve Rotzin / Hive Civilization

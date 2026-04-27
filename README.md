# HiveInsurance

**Agent-native parametric insurance with smart-contract triggers and USDC settlement**

MCP server for the Hive parametric insurance platform. Agents quote and bind parametric insurance policies, check on-chain trigger conditions via oracle event hashes, and track claim status. Premiums and payouts settle in USDC on Base, Ethereum, or Solana via smart-contract automation. Backend build is Q3 2026. Tool calls currently return HTTP 503 with a feature-gating response — no mock data is ever returned. Submit interest via hive-mcp-connector.

> Council R4 — staged for Q3 2026 backend build

---

## Backend Status

> **This server is catalog-ready but the hivemorph backend for this vertical has not yet been built.**
> All `tools/call` requests return HTTP 503:
> ```json
> { "error": "feature gating: backend pending; submit interest at hive-mcp-connector" }
> ```
> `tools/list`, `/health`, and `/.well-known/mcp.json` work correctly and return the full tool catalog.
> No mock data is ever returned. This is honest per Hive Rails Rule 1.
> **Backend target: Q3 2026.** To register interest: [hive-mcp-connector](https://hive-mcp-connector.thehiveryiq.com)

---

## What this is

`hive-mcp-insurance` is a Model Context Protocol (MCP) server that will expose the HiveInsurance platform on the Hive Civilization to any MCP-compatible client (Claude Desktop, Cursor, Manus, etc.) once the backend is live. The server will proxy to the production backend at `https://hivemorph.onrender.com`.

- **Protocol:** MCP 2024-11-05 over Streamable-HTTP / JSON-RPC 2.0
- **Transport:** `POST /mcp`
- **Discovery:** `GET /.well-known/mcp.json`
- **Health:** `GET /health`
- **Settlement:** USDC / USDT on Base, Ethereum, Solana (real rails — no mock, no simulated)
- **Brand gold:** Pantone 1245 C / `#C08D23`
- **Tools:** 4

## Tools

| Tool | Description |
|---|---|
| `quote_policy` | Quote a parametric insurance policy. Returns a premium estimate for the given risk type, coverage amount (USD), and term length. Backend pending (Q3 2026). |
| `bind_policy` | Bind a previously quoted policy. Settlement via x402 / USDC on Base, Ethereum, or Solana. Returns policy_id on success. Backend pending (Q3 2026). |
| `claim_status` | Check the status of a parametric insurance claim associated with a policy. Returns current state: pending / triggered / paid / disputed. Backend pending (Q3 2026). |
| `parametric_trigger_check` | Check whether a parametric oracle event hash satisfies the trigger condition for automatic claim payout. Returns boolean. Backend pending (Q3 2026). |


## Backend endpoints (pending Q3 2026)

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/v1/insurance/quote` | Quote a parametric policy (premium estimate) |
| `POST` | `/v1/insurance/bind` | Bind policy — USDC settlement via x402 |
| `GET` | `/v1/insurance/claims/{policy_id}` | Claim status: pending / triggered / paid / disputed |
| `GET` | `/v1/insurance/trigger` | Check oracle event hash against trigger condition |


## Run locally

```bash
git clone https://github.com/srotzin/hive-mcp-insurance.git
cd hive-mcp-insurance
npm install
npm start
# Server up on http://localhost:3000
# tools/list works; tools/call returns 503 (backend pending)
curl http://localhost:3000/health
curl http://localhost:3000/.well-known/mcp.json
curl -s -X POST http://localhost:3000/mcp \
  -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | jq .result.tools[].name
```

## Connect from an MCP client

**Claude Desktop / Cursor / Manus** — add to your `mcp.json`:

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

## Hive Civilization

Part of the [Hive Civilization](https://www.thehiveryiq.com) — sovereign DID, USDC settlement, HAHS legal contracts, agent-to-agent rails.

Categories: insurance, finance, agent-to-agent, web3, defi, parametric.

## License

MIT (c) 2026 Steve Rotzin / Hive Civilization

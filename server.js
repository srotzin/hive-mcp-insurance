#!/usr/bin/env node
/**
 * HiveInsurance MCP Server
 * Agent-native parametric insurance with smart-contract triggers and USDC settlement
 *
 * Backend  : https://hivemorph.onrender.com
 * Status   : v0.1 — pending hivemorph backend build (Q3 2026 spec)
 * Spec     : MCP 2024-11-05 / Streamable-HTTP / JSON-RPC 2.0
 * Brand    : Hive Civilization gold #C08D23 (Pantone 1245 C)
 *
 * RAILS RULE 1 — NO MOCK RESPONSES.
 * All tool calls return HTTP 503 until the backend is live.
 * Agents receive: { "error": "feature gating: backend pending; submit interest at hive-mcp-connector" }
 */

import express from 'express';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const HIVE_BASE = process.env.HIVE_BASE || 'https://hivemorph.onrender.com';

// ─── Tool definitions ────────────────────────────────────────────────────────
const TOOLS = [
    {
      name: 'quote_policy',
      description: 'Quote a parametric insurance policy. Returns a premium estimate for the given risk type, coverage amount (USD), and term length. Backend pending (Q3 2026).',
      inputSchema: {
        type: 'object',
        required: ["risk_type", "coverage_usd", "term_days"],
properties: {
          risk_type: { type: 'string', description: 'Risk category (e.g. flight_delay, crop_yield, protocol_hack, weather)' },
  coverage_usd: { type: 'number', description: 'Coverage amount in USD' },
  term_days: { type: 'number', description: 'Policy term in days' }
        },
      },
    },    {
      name: 'bind_policy',
      description: 'Bind a previously quoted policy. Settlement via x402 / USDC on Base, Ethereum, or Solana. Returns policy_id on success. Backend pending (Q3 2026).',
      inputSchema: {
        type: 'object',
        required: ["quote_id", "payer_did"],
properties: {
          quote_id: { type: 'string', description: 'Quote ID from quote_policy' },
  payer_did: { type: 'string', description: 'DID of the agent or entity paying the premium' }
        },
      },
    },    {
      name: 'claim_status',
      description: 'Check the status of a parametric insurance claim associated with a policy. Returns current state: pending / triggered / paid / disputed. Backend pending (Q3 2026).',
      inputSchema: {
        type: 'object',
        required: ["policy_id"],
properties: {
          policy_id: { type: 'string', description: 'Policy ID from bind_policy' }
        },
      },
    },    {
      name: 'parametric_trigger_check',
      description: 'Check whether a parametric oracle event hash satisfies the trigger condition for automatic claim payout. Returns boolean. Backend pending (Q3 2026).',
      inputSchema: {
        type: 'object',
        required: ["oracle_event_hash"],
properties: {
          oracle_event_hash: { type: 'string', description: 'SHA-256 hash of the oracle event to evaluate against trigger conditions' }
        },
      },
    }
];

// ─── Feature-gate response (Rails Rule 1 — no mock) ──────────────────────────
function featureGate(res) {
  return res.status(503).json({
    error: 'feature gating: backend pending; submit interest at hive-mcp-connector',
    backend_status: 'v0.1 — pending hivemorph backend build (Q3 2026 spec)',
    service: 'hive-mcp-insurance',
    interest_url: 'https://hive-mcp-connector.thehiveryiq.com',
  });
}

// ─── MCP JSON-RPC handler ────────────────────────────────────────────────────
app.post('/mcp', async (req, res) => {
  const { jsonrpc, id, method, params } = req.body || {};
  if (jsonrpc !== '2.0') {
    return res.json({ jsonrpc: '2.0', id, error: { code: -32600, message: 'Invalid JSON-RPC' } });
  }
  try {
    switch (method) {
      case 'initialize':
        return res.json({ jsonrpc: '2.0', id, result: {
          protocolVersion: '2024-11-05',
          capabilities: { tools: { listChanged: false } },
          serverInfo: {
            name: 'hive-mcp-insurance',
            version: '1.0.0',
            description: 'Agent-native parametric insurance with smart-contract triggers and USDC settlement',
            backendStatus: 'v0.1 — pending hivemorph backend build (Q3 2026 spec)',
          },
        } });
      case 'tools/list':
        return res.json({ jsonrpc: '2.0', id, result: { tools: TOOLS } });
      case 'tools/call':
        // Rails Rule 1: backend not yet live — return honest 503, no mock data.
        return featureGate(res);
      case 'ping':
        return res.json({ jsonrpc: '2.0', id, result: {} });
      default:
        return res.json({ jsonrpc: '2.0', id, error: { code: -32601, message: `Method not found: ${method}` } });
    }
  } catch (err) {
    return res.json({ jsonrpc: '2.0', id, error: { code: -32000, message: err.message } });
  }
});

// ─── Discovery + health ──────────────────────────────────────────────────────
app.get('/health', (req, res) => res.json({
  status: 'ok',
  service: 'hive-mcp-insurance',
  version: '1.0.0',
  backend: HIVE_BASE,
  backendStatus: 'v0.1 — pending hivemorph backend build (Q3 2026 spec)',
  toolCount: TOOLS.length,
  brand: '#C08D23',
}));

app.get('/.well-known/mcp.json', (req, res) => res.json({
  name: 'hive-mcp-insurance',
  endpoint: '/mcp',
  transport: 'streamable-http',
  protocol: '2024-11-05',
  backendStatus: 'v0.1 — pending hivemorph backend build (Q3 2026 spec)',
  tools: TOOLS.map(t => ({ name: t.name, description: t.description })),
}));

app.listen(PORT, () => {
  console.log('HiveInsurance MCP Server running on :' + PORT);
  console.log('  Backend : ' + HIVE_BASE);
  console.log('  Status  : v0.1 — pending hivemorph backend build (Q3 2026 spec)');
  console.log('  Tools   : ' + TOOLS.length + ' (quote_policy, bind_policy, claim_status, parametric_trigger_check)');
  console.log('  Rails   : tool calls return 503 until backend is live (no mock)');
});

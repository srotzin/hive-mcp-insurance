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
import { renderLanding, renderRobots, renderSitemap, renderSecurity, renderOgImage, seoJson, BRAND_GOLD } from './meta.js';

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


const SERVICE_CFG = {
  service: "hive-mcp-insurance",
  shortName: "HiveInsurance",
  title: "HiveInsurance \u00b7 Parametric Coverage & Agent SLA Insurance MCP",
  tagline: "Parametric insurance for agent uptime, treasury slippage, and oracle failure.",
  description: "MCP server for HiveInsurance \u2014 parametric insurance for autonomous agents on the Hive Civilization. Uptime SLA, treasury slippage, and oracle-failure coverage. Broker layer today, underwriter layer pending. USDC settlement on Base L2. Real rails.",
  keywords: ["mcp", "model-context-protocol", "x402", "agentic", "ai-agent", "ai-agents", "llm", "hive", "hive-civilization", "insurance", "parametric-insurance", "agent-sla", "uptime-coverage", "oracle-failure", "usdc", "base", "base-l2", "agent-economy", "a2a"],
  externalUrl: "https://hive-mcp-insurance.onrender.com",
  gatewayMount: "/insurance",
  version: "1.0.1",
  pricing: [
    { name: "insurance_quote", priceUsd: 0, label: "Get quote \u2014 free" },
    { name: "insurance_bind", priceUsd: 0.05, label: "Bind policy (Tier 3)" },
    { name: "insurance_claim", priceUsd: 0.05, label: "File claim (Tier 3)" }
  ],
};
SERVICE_CFG.tools = (typeof TOOLS !== 'undefined' ? TOOLS : []).map(t => ({ name: t.name, description: t.description }));
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


// HIVE_META_BLOCK_v1 — comprehensive meta tags + JSON-LD + crawler discovery
app.get('/', (req, res) => {
  res.type('text/html; charset=utf-8').send(renderLanding(SERVICE_CFG));
});
app.get('/og.svg', (req, res) => {
  res.type('image/svg+xml').send(renderOgImage(SERVICE_CFG));
});
app.get('/robots.txt', (req, res) => {
  res.type('text/plain').send(renderRobots(SERVICE_CFG));
});
app.get('/sitemap.xml', (req, res) => {
  res.type('application/xml').send(renderSitemap(SERVICE_CFG));
});
app.get('/.well-known/security.txt', (req, res) => {
  res.type('text/plain').send(renderSecurity());
});
app.get('/seo.json', (req, res) => res.json(seoJson(SERVICE_CFG)));

// ─── Schema constants (auto-injected to fix deploy) ─────
const SERVICE = 'hive-mcp-insurance';
const VERSION = '1.0.2';


// ─── Schema discoverability ────────────────────────────────────────────────
const AGENT_CARD = {
  name: SERVICE,
  description: 'MCP server for HiveInsurance — parametric insurance for autonomous agents. Uptime SLA, treasury slippage, and oracle-failure coverage. USDC settlement on Base L2. New agents: first call free. Loyalty: every 6th paid call is free. Pay in USDC on Base L2.',
  url: `https://${SERVICE}.onrender.com`,
  provider: {
    organization: 'Hive Civilization',
    url: 'https://www.thehiveryiq.com',
    contact: 'steve@thehiveryiq.com',
  },
  version: VERSION,
  capabilities: {
    streaming: false,
    pushNotifications: false,
    stateTransitionHistory: false,
  },
  authentication: {
    schemes: ['x402'],
    credentials: {
      type: 'x402',
      asset: 'USDC',
      network: 'base',
      asset_address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      recipient: '0x15184bf50b3d3f52b60434f8942b7d52f2eb436e',
    },
  },
  defaultInputModes: ['application/json'],
  defaultOutputModes: ['application/json'],
  skills: [
    { name: 'quote_policy', description: 'Quote a parametric insurance policy. Returns a premium estimate for the given risk type, coverage amount (USD), and term length. Backend pending (Q3 2026).' },
    { name: 'bind_policy', description: 'Bind a previously quoted policy. Settlement via x402 / USDC on Base, Ethereum, or Solana. Returns policy_id on success. Backend pending (Q3 2026).' },
    { name: 'claim_status', description: 'Check the status of a parametric insurance claim associated with a policy. Returns current state: pending / triggered / paid / disputed. Backend pending (Q3 2026).' },
    { name: 'parametric_trigger_check', description: 'Check whether a parametric oracle event hash satisfies the trigger condition for automatic claim payout. Returns boolean. Backend pending (Q3 2026).' },
  ],
  extensions: {
    hive_pricing: {
      currency: 'USDC',
      network: 'base',
      model: 'per_call',
      first_call_free: true,
      loyalty_threshold: 6,
      loyalty_message: 'Every 6th paid call is free',
    },
  },
};

const AP2 = {
  ap2_version: '1',
  agent: {
    name: SERVICE,
    did: `did:web:${SERVICE}.onrender.com`,
    description: 'MCP server for HiveInsurance — parametric insurance for autonomous agents. Uptime SLA, treasury slippage, and oracle-failure coverage. USDC settlement on Base L2. New agents: first call free. Loyalty: every 6th paid call is free. Pay in USDC on Base L2.',
  },
  endpoints: {
    mcp: `https://${SERVICE}.onrender.com/mcp`,
    agent_card: `https://${SERVICE}.onrender.com/.well-known/agent-card.json`,
  },
  payments: {
    schemes: ['x402'],
    primary: {
      scheme: 'x402',
      network: 'base',
      asset: 'USDC',
      asset_address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      recipient: '0x15184bf50b3d3f52b60434f8942b7d52f2eb436e',
    },
  },
  brand: { color: '#C08D23', name: 'Hive Civilization' },
};

app.get('/.well-known/agent-card.json', (req, res) => res.json(AGENT_CARD));
app.get('/.well-known/ap2.json',         (req, res) => res.json(AP2));


app.listen(PORT, () => {
  console.log('HiveInsurance MCP Server running on :' + PORT);
  console.log('  Backend : ' + HIVE_BASE);
  console.log('  Status  : v0.1 — pending hivemorph backend build (Q3 2026 spec)');
  console.log('  Tools   : ' + TOOLS.length + ' (quote_policy, bind_policy, claim_status, parametric_trigger_check)');
  console.log('  Rails   : tool calls return 503 until backend is live (no mock)');
});

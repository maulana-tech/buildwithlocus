# Locus Checkout Studio

A no-code visual checkout widget builder for merchants, powered by **BuildWithLocus** and **PayWithLocus** APIs. Built for the Locus Paygentic Hackathon #2.

## What It Does

Merchants build checkout widgets and link-in-bio sites using a **visual node-based editor** — drag, connect, and configure payment flows without writing code. Sites publish instantly and accept real payments via Locus.

## Stack

- **Next.js 16** (App Router) + React 19 + TypeScript (strict)
- **@xyflow/react** — Node-based visual flow editor
- **lucide-react** — Icons
- **CSS Variables** — Dark theme, no Tailwind
- **Geist + Geist Mono** — Fonts via `next/font`

## Getting Started

```bash
pnpm install
cp .env.example .env
pnpm dev
```

Open http://localhost:3000

## Commands

| Command | Description |
|---|---|
| `pnpm dev` | Dev server on :3000 |
| `pnpm build` | Production build + type checking |
| `pnpm lint` | ESLint (next/core-web-vitals + typescript) |
| `pnpm agents:start` | Run agent system standalone |

## Architecture

```
src/
├── app/
│   ├── page.tsx              Main studio (visual node editor)
│   ├── s/[id]/page.tsx       Public site preview route
│   └── api/                  API routes (publish, sites, webhooks)
├── components/
│   ├── nodes/                Custom ReactFlow node components
│   ├── FlowCanvas.tsx        ReactFlow canvas wrapper
│   ├── NodePanel.tsx         Block palette sidebar
│   └── PublishModal.tsx      Deployment simulation modal
├── agents/                   Event-driven agent system
│   ├── state.ts              Types, EventBus, GlobalState
│   ├── builder.ts            Config validation
│   ├── payment.ts            PayWithLocus API integration
│   ├── analytics.ts          In-memory analytics store
│   └── orchestrator.ts       Event routing
├── lib/
│   └── locus.ts              Typed API client (PayWithLocus + BuildWithLocus)
└── styles/
    ├── flow.css              ReactFlow dark theme overrides
    └── themes.css            Site theme variables
```

## Node-Based Editor

The studio uses a visual flow canvas where each component is a draggable node:

**Widget Builder:** `Profile → Payment Methods → Checkout → Redirects`
**Site Builder:** `Profile → Links / Checkout Widgets`

Click blocks in the sidebar to add nodes. Connect them by dragging between handles.

## Agent System

4 in-process agents communicate via an event bus:

- **BuilderAgent** — Validates widget/site config
- **PaymentAgent** — Creates payment links via PayWithLocus API
- **AnalyticsAgent** — Tracks transactions, revenue, method breakdown
- **OrchestratorAgent** — Routes events between agents

PaymentAgent calls the real Locus API when `LOCUS_API_KEY` is set, falls back to mock URLs otherwise.

## Environment

| Variable | Description |
|---|---|
| `LOCUS_API_KEY` | PayWithLocus API key |
| `LOCUS_WEBHOOK_SECRET` | Webhook signature secret |
| `LOCUS_BASE_URL` | Locus API base URL (default: `https://api.locus.sh`) |
| `NEXT_PUBLIC_APP_URL` | App public URL for webhook registration |

## Deployment

Configured for BuildWithLocus via `.locusbuild` (single `web` service, port 8080).

## Hackathon

| Field | Value |
|---|---|
| Event | Locus Paygentic Hackathon #2 |
| Track | BuildWithLocus |
| Week | 2 of 4 |

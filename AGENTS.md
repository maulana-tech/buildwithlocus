# AGENTS.md

## Stack

- **Next.js 16** (App Router) + React 19 + TypeScript (strict)
- **Package manager:** pnpm (`pnpm install`, not `npm install`)
- **Path alias:** `@/*` → `./src/*` (configured in tsconfig.json)
- **UI:** lucide-react icons, CSS modules / CSS variables (no Tailwind, no component library)
- **Fonts:** Geist + Geist Mono via `next/font`

## Commands

```bash
pnpm dev            # dev server on :3000
pnpm build          # production build (also runs type checking)
pnpm lint           # eslint (next/core-web-vitals + typescript)
pnpm agents:start   # run agent system standalone via tsx
```

No `typecheck` script exists — use `npx tsc --noEmit` or rely on `pnpm build`.

No test framework is installed. There are no tests.

## Architecture

Single-page studio with two tabs (Widget Builder, Site Builder). All state is client-side.

### Key directories

| Path | Purpose |
|---|---|
| `src/app/page.tsx` | Main studio page (client component) |
| `src/app/s/[id]/` | Dynamic route for public site previews |
| `src/components/` | UI components — Sidebar, PreviewCanvas, SiteSidebar, SitePreview, PublishModal |
| `src/agents/` | Event-driven agent system (see below) |
| `src/lib/` | API client libraries (`locus.ts` — typed wrapper for PayWithLocus + BuildWithLocus) |
| `src/app/api/` | API routes — `/api/publish`, `/api/sites`, `/api/webhooks/locus` |
| `src/styles/themes.css` | CSS theme variables |
| `src/app/globals.css` | Global styles |

### Agent system (`src/agents/`)

In-process TypeScript event bus, **not** a backend service. PaymentAgent calls real Locus API when `LOCUS_API_KEY` is set; falls back to mock URLs otherwise.

- **state.ts** — Types (`GlobalState`, `WidgetConfig`, `SiteConfig`, `Block`, `AgentEvent`), initial state, and `EventBus` class
- **base.ts** — `BaseAgent` abstract class; subclasses override `handleEvent(event)`
- **orchestrator.ts** — Routes events between agents
- **builder.ts** — Validates config (required fields, username format, blocks) and publishes events. Returns validation errors array.
- **payment.ts** — Calls PayWithLocus API to create payment links; falls back to mock on error
- **analytics.ts** — In-memory analytics store (revenue, transaction count, method breakdown per widget)
- **index.ts** — `startAgents()` wires all agents together; also callable via `pnpm agents:start`

Event flow: UI → `BuilderAgent.saveConfig/saveSite` → EventBus → Orchestrator → Payment/Analytics agents.

### Data model highlights

- **WidgetConfig** — payment widget settings (branding, payment methods, amount, redirects)
- **SiteConfig** — link-in-bio style page with blocks (`profile`, `link`, `checkout`)
- **Block types:** `profile`, `link`, `checkout`
- **Site themes:** `modern`, `retro`, `dark`, `glass`, `neon`
- **Site fonts:** `inter`, `playfair`, `mono`, `space`

### Persistence

Client-side only via `localStorage`. Two keys:
- `locus_studio_site_v1` — stores `{ siteConfig, widgetConfig }` (studio state)
- `locus_shared_sites` — stores published sites keyed by username (for `/s/[id]` route)

## Environment

Copy `.env.example` to `.env`. Required for production Locus API integration:

- `LOCUS_API_KEY`
- `LOCUS_WEBHOOK_SECRET`
- `LOCUS_BASE_URL` (default: `https://api.locus.sh`)
- `NEXT_PUBLIC_APP_URL`

## Deployment

`.locusbuild` configures deployment on the Locus platform (single `web` service, port 8080).

## Conventions

- No comments in code unless explicitly requested
- All components are client components (`'use client'` at top)
- Inline styles are common in page.tsx; components use CSS modules
- No Tailwind — use CSS variables from `globals.css` / `themes.css`

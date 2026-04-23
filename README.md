# Locus Studio

> No-code section-based website builder with integrated USDC checkout — powered by **PayWithLocus** and **BuildWithLocus**.

Built for the **Locus Paygentic Hackathon #2**.

---

## Live Demo

| URL | Description |
|---|---|
| [Landing Page](https://svc-mobj33czir7850u8.buildwithlocus.com) | Marketing page with dark brutalist design |
| [Dashboard](https://svc-mobj33czir7850u8.buildwithlocus.com/dashboard) | Site builder studio — build, save, edit, publish |
| [Analytics](https://svc-mobj33czir7850u8.buildwithlocus.com/analytics) | Revenue & transaction tracking |
| [Demo Site](https://svc-mobj33czir7850u8.buildwithlocus.com/dashboard?demo=1) | Pre-built "Kopi Nusantara" coffee shop |
| [Published Site](https://svc-mobj33czir7850u8.buildwithlocus.com/s/my_store) | Example published site |

**API Key for testing:** Connect wallet in the dashboard using a `claw_dev_*` key from [app.paywithlocus.com](https://app.paywithlocus.com).

---

## What It Does

Locus Studio lets anyone build a professional checkout-enabled landing page in minutes — no code required. Merchants compose sections (Hero, Features, Checkout, etc.), connect their Locus wallet, and publish. Buyers pay with USDC on Base through an embedded checkout experience.

### Key Flow

```
Build in Studio → Save → Publish → Site goes live on BuildWithLocus
                                        ↓
                              Buyer clicks "Pay Now"
                                        ↓
                        PayWithLocus checkout modal opens
                        (Locus Wallet / MetaMask / AI Agent)
                                        ↓
                              USDC payment confirmed on-chain
                                        ↓
                        Webhook → Transaction saved → Analytics updated
```

---

## Screenshots

### Landing Page
Dark brutalist design with lime accent (`#b7d941`), sharp corners, no border-radius. Features hero section, stats ticker, feature grid, node editor preview, and how-it-works steps.

**Live:** [svc-mobj33czir7850u8.buildwithlocus.com](https://svc-mobj33czir7850u8.buildwithlocus.com)

### Dashboard — Site Overview
Stats cards (Revenue, Transactions, Views, Sites), quick actions (New Site, Try Demo), sites list with inline Edit button, and a Payment Link Creator.

### Builder — 3-Panel Editor
Left: **Section Palette** (add sections). Center: **Live Preview** (mobile/desktop toggle, zoom). Right: **Property Panel** (edit section properties). Top toolbar: AI prompt, username, theme switcher, Save button, Preview, Publish.

### Payment Link Creator
Create standalone PayWithLocus checkout links directly from the dashboard. Enter amount, currency, description → get a shareable payment URL instantly. No site needed.

### Checkout Experience
Embedded `@withlocus/checkout-react` component renders inline when buyer clicks Pay. Supports Locus Wallet, External Wallet (MetaMask), and AI Agent payments.

### Analytics
Revenue, transactions, views — per-site breakdown with real data from webhook events.

---

## Features

### Section-Based Builder
7 section types — compose any combination:

| Section | What It Renders |
|---|---|
| **Hero** | Headline + subtext + CTA button |
| **Features** | Icon grid with titles and descriptions |
| **Pricing** | Plan cards with feature lists |
| **Checkout** | PayWithLocus embedded checkout (USDC on Base) |
| **Testimonials** | Customer review cards |
| **FAQ** | Question/answer pairs |
| **Footer** | Brand, links, socials |

### Save & Edit
- **Save** — saves current work to localStorage with visual feedback ("Saved 14:32")
- **Edit** — click Edit on any published site in the dashboard to load it back into the builder
- Drafts persist across sessions — never lose work

### AI Builder
Type a prompt like *"coffee shop with checkout and testimonials"* → sections auto-generate based on keyword parsing.

### 5 Themes
`modern` · `dark` · `retro` · `glass` · `neon` — one-click cycle in the builder toolbar. Themes apply to both the live preview and the published site.

### Live Preview
Real-time preview with **mobile/desktop toggle** and **zoom controls** (50%–150%). Preview uses the exact same THEME_STYLES as the published `/s/[id]` renderer — what you see is what you get.

### Payment Link Creator
Create standalone PayWithLocus checkout sessions without building a full site:
1. Enter amount (supports USD, USDC, IDR, EUR)
2. Add description
3. Click "Create Payment Link"
4. Get a shareable `checkout.paywithlocus.com` URL with session ID

### Start with Demo
One-click demo loads a pre-built "Kopi Nusantara" coffee shop with all section types including a live checkout. Available from landing page, dashboard, and wallet connect modal.

### Wallet Connection
Connect your Locus wallet via API key (`claw_dev_*`). Shows wallet address, USDC balance, copy address, and BaseScan link in the navbar dropdown.

### Smart Auto-Deploy
First publish creates a BuildWithLocus service. All subsequent publishes **redeploy the same service** — no duplicate services, no wasted credits. Publish URL always returns the correct `/s/{username}` path.

---

## Integrations

### PayWithLocus
- **Session creation**: `POST /checkout/sessions` with amount, metadata, receipt config
- **Payment Link Creator**: Standalone checkout session creation via `POST /api/payment-links`
- **Embedded checkout**: `@withlocus/checkout-react` renders inline payment UI
- **Webhooks**: `checkout.session.paid` events → HMAC-SHA256 verified → transaction persisted
- **Wallet**: `GET /pay/balance` for connected wallet display

### BuildWithLocus
- **First deploy**: `POST /v1/projects/from-repo` → creates project, environment, service
- **Redeploy**: `POST /v1/deployments` with saved `serviceId` — free, no new service
- **Env vars**: Set via `PUT /v1/variables/service/:id`
- **Auto-deploy**: GitHub app triggers redeploy on every `git push` to `main`

---

## Architecture

```
src/
├── app/
│   ├── page.tsx                  Landing page
│   ├── dashboard/page.tsx        Builder studio (Dashboard + Builder tabs)
│   ├── analytics/page.tsx        Analytics dashboard
│   ├── s/[id]/page.tsx           Public site renderer (with @withlocus/checkout-react)
│   └── api/
│       ├── publish/route.ts      Publish flow (checkout sessions + BuildWithLocus deploy)
│       ├── payment-links/route.ts Standalone payment link creation
│       ├── sites/route.ts        Server-side JSON storage
│       ├── analytics/route.ts    Analytics data API
│       ├── wallet/route.ts       Wallet balance verification
│       └── webhooks/locus/       PayWithLocus webhook handler
├── components/
│   ├── AppNavbar.tsx             Navigation + wallet connect
│   ├── builder/
│   │   ├── SectionPalette.tsx    Left — add sections
│   │   ├── LivePreview.tsx       Center — live preview
│   │   └── PropertyPanel.tsx     Right — edit section props
│   └── PublishModal.tsx          Publish confirmation modal
├── agents/
│   ├── state.ts                  Types: PageConfig, SectionTypes, SiteAnalytics
│   ├── base.ts                   BaseAgent with EventBus
│   ├── orchestrator.ts           Routes events between agents
│   ├── builder.ts                Config validation
│   ├── payment.ts                PayWithLocus API integration
│   └── analytics.ts              In-memory analytics store
├── lib/
│   └── locus.ts                  Typed API client (PayWithLocus + BuildWithLocus)
└── styles/
    └── builder.css               Builder component styles
```

### Design System
- **Colors**: `#0f0f10` bg, `#1b1b1c` surface, `#2a2a2b` border, `#b7d941` accent (lime)
- **No border-radius** — sharp brutalist aesthetic throughout
- **Typography**: Geist Sans, Geist Mono, Space Grotesk via `next/font`
- **Icons**: lucide-react
- **No Tailwind** — pure CSS variables + inline styles

---

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16 (App Router) + React 19 |
| Language | TypeScript (strict) |
| Styling | CSS Variables, inline styles — no Tailwind |
| Icons | lucide-react |
| Fonts | Geist Sans + Geist Mono + Space Grotesk (`next/font`) |
| Payments | `@withlocus/checkout-react` |
| Hosting | BuildWithLocus (containerized via Dockerfile) |
| Package Manager | pnpm |

---

## Getting Started

```bash
pnpm install
cp .env.example .env
# Add your LOCUS_API_KEY to .env
pnpm dev
```

Open http://localhost:3000

---

## Commands

| Command | Description |
|---|---|
| `pnpm dev` | Dev server on :3000 |
| `pnpm build` | Production build + type checking |
| `pnpm lint` | ESLint |
| `pnpm agents:start` | Run agent system standalone via tsx |

---

## API Endpoints

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/publish` | Publish site (create checkout sessions + deploy) |
| `POST` | `/api/payment-links` | Create standalone PayWithLocus payment link |
| `GET` | `/api/sites?username=x` | Get published site data |
| `POST` | `/api/sites` | Save site to server storage |
| `GET` | `/api/analytics` | Get revenue/transaction analytics |
| `POST` | `/api/wallet` | Verify wallet + get balance |
| `POST` | `/api/webhooks/locus` | PayWithLocus webhook handler |

---

## Environment Variables

| Variable | Description | Required |
|---|---|---|
| `LOCUS_API_KEY` | PayWithLocus + BuildWithLocus API key (`claw_dev_*`) | Yes |
| `LOCUS_WEBHOOK_SECRET` | Webhook HMAC secret (`whsec_*`) | No |
| `LOCUS_API_BASE` | PayWithLocus API base (default: `https://api.paywithlocus.com/api`) | No |
| `NEXT_PUBLIC_APP_URL` | Production URL of the deployed service | Yes (production) |
| `NEXT_PUBLIC_DEPLOY_REPO` | GitHub repo for BuildWithLocus deployment | Yes (production) |

---

## Hackathon Info

| Field | Value |
|---|---|
| Event | [Locus Paygentic Hackathon #2](https://docs.paywithlocus.com/hackathon) |
| Track | BuildWithLocus + PayWithLocus |
| APIs Used | PayWithLocus Checkout, BuildWithLocus Deploy |
| SDKs Used | `@withlocus/checkout-react` |
| Live URL | [svc-mobj33czir7850u8.buildwithlocus.com](https://svc-mobj33czir7850u8.buildwithlocus.com) |
| GitHub | [maulana-tech/buildwithlocus](https://github.com/maulana-tech/buildwithlocus) |

---

## License

MIT

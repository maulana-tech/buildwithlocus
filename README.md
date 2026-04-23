# Locus Checkout Studio

A no-code **section-based website builder** for merchants, powered by **BuildWithLocus** and **PayWithLocus** APIs. Built for the Locus Paygentic Hackathon #2.

## What It Does

Merchants build professional landing pages and checkout sites using a **visual section editor** — add Hero, Features, Pricing, Checkout sections and publish instantly. Sites accept real payments via PayWithLocus and are deployed to BuildWithLocus.

## Live Demo

**Production URL:** https://svc-moba0odjul0rjfgy.buildwithlocus.com

| Route | Description |
|---|---|
| `/dashboard` | Section-based page builder |
| `/analytics` | Revenue + transaction tracking |
| `/s/[username]` | Published public sites |

## Key Features

- **Section-Based Builder** — 7 section types: Hero, Features, Pricing, Checkout, Testimonials, FAQ, Footer
- **AI Builder** — Type a description, AI generates sections automatically
- **Live Preview** — Real-time preview with mobile/desktop toggle + zoom controls (50%-150%)
- **5 Themes** — modern, dark, retro, glass, neon
- **Analytics Dashboard** — Track revenue, transactions, and page views
- **Payment Integration** — Real payments via PayWithLocus (QRIS, Bank Transfer, E-Wallet)
- **Instant Publish** — Deploy to BuildWithLocus with one click

## Stack

- **Next.js 16** (App Router) + React 19 + TypeScript (strict)
- **lucide-react** — Icons
- **CSS Variables** — Dark theme, no Tailwind
- **Geist + Geist Mono + Space Grotesk** — Fonts via `next/font`
- **Docker** — Containerized for BuildWithLocus

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
│   ├── page.tsx              Landing page
│   ├── dashboard/page.tsx    Section-based builder Studio
│   ├── analytics/page.tsx    Analytics dashboard
│   ├── s/[id]/page.tsx       Public site renderer
│   └── api/
│       ├── publish/route.ts  Deploy to BuildWithLocus + create payment links
│       ├── sites/route.ts    Server-side JSON file storage
│       ├── analytics/route.ts Analytics data API
│       └── webhooks/locus/  Webhook handler for transactions
├── components/builder/
│   ├── SectionPalette.tsx   Left sidebar — add sections
│   ├── LivePreview.tsx      Center — live preview (mobile/desktop + zoom)
│   └── PropertyPanel.tsx    Right sidebar — edit section props
├── agents/
│   ├── state.ts             Types (PageConfig, SectionTypes, SiteAnalytics)
│   ├── builder.ts           Config validation
│   └── payment.ts           PayWithLocus API integration
└── lib/
    └── locus.ts             Typed API client
```

## Section-Based Builder

The Studio has 3 panels:

1. **Section Palette (Left)** — Click to add: Hero, Features, Pricing, Checkout, Testimonials, FAQ, Footer
2. **Live Preview (Center)** — Real-time preview with **device toggle** (mobile/desktop) + **zoom controls** (50%-150%)
3. **Property Panel (Right)** — Edit selected section properties

### AI Builder

Type a description in the header input to auto-generate sections:

```
"landing page for my coffee shop with pricing and contact info"
```

Parses keywords: hero, features, pricing, checkout, testimonials, faq, footer

### Available Sections

| Section | Description |
|---|---|
| Hero | Headline + subtext + CTA button |
| Features | Grid of feature cards with icons |
| Pricing | Pricing table with plans |
| Checkout | Embedded PayWithLocus payment widget |
| Testimonials | Customer reviews grid |
| FAQ | Accordion-style Q&A |
| Footer | Links + socials + brand |

### Themes

5 built-in themes: `modern`, `dark`, `retro`, `glass`, `neon`

## Analytics Dashboard

Track site performance at `/analytics`:

- Total revenue (USDC)
- Transaction count
- Page views
- Per-site breakdown with detail view

## Payment Integration

Checkout sections create real payment links via PayWithLocus API:

- QRIS, Bank Transfer, E-Wallet support
- Configurable amount + currency
- Webhook notifications for transaction status
- Success/cancel redirect URLs

## Deployment Flow

```
Dashboard → Compose sections → Publish
  → POST /api/publish
    → Save to server storage (JSON file)
    → Create payment links (PayWithLocus)
    → Deploy to BuildWithLocus (via /v1/projects/from-repo)
  → Return live URL
```

The app containerizes with **Dockerfile** for BuildWithLocus and auto-deploys from GitHub.

## Environment Variables

| Variable | Description | Required |
|---|---|---|
| `LOCUS_API_KEY` | PayWithLocus API key | Yes |
| `LOCUS_WEBHOOK_SECRET` | Webhook HMAC secret | No |
| `LOCUS_BASE_URL` | Locus API URL (default: `https://api.locus.sh`) | No |
| `NEXT_PUBLIC_APP_URL` | Production URL | Yes (production) |
| `NEXT_PUBLIC_DEPLOY_REPO` | GitHub repo for deployment | Yes (production) |

## BuildWithLocus Integration

The app uses BuildWithLocus for hosting:

1. **Project creation:** `POST /v1/projects/from-repo` 
2. **Auth:** `POST /v1/auth/exchange` with API key
3. **Redeploy:** Service auto-redeploys on each publish
4. **Container:** Next.js app in Docker (port 3000)

## Deployment

The app is configured for BuildWithLocus via:

- **`.locusbuild`** — Service config (port 3000)
- **Dockerfile** — Multi-stage Next.js build
- **deploy flow:** GitHub push → BuildWithLocus auto-deploy

### Manual Deploy

```bash
# Deploy via API
curl -X POST https://api.buildwithlocus.com/v1/projects/from-repo \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"your-project","repo":"your-org/repo","branch":"main"}'
```

## Hackathon

| Field | Value |
|---|---|
| Event | Locus Paygentic Hackathon #2 |
| Track | BuildWithLocus |
| Week | 2 of 4 |

## License

MIT
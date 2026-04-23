# Locus Studio — Demo Video Voiceover Script

**Target duration:** ~5 minutes
**Delivery:** 140–150 WPM, neutral-confident narrator
**Total word count:** ~720 words
**Format:** Voiceover lines in quotes, scene directions in brackets

---

## [0:00 – 0:20] — Cold Open

[Visual: Fast montage — landing page hero, builder drag-and-drop, USDC checkout modal closing with a green "Paid" checkmark. Subtle synth pulse under the VO.]

> "Imagine launching a checkout-enabled website in under five minutes. No code. No Stripe onboarding. No developers. Just sections, a wallet, and USDC on Base. This… is **Locus Studio**."

---

## [0:20 – 0:45] — The Problem

[Visual: Split screen. Left — a tangled workflow of Figma, Stripe dashboard, Vercel, and a KYC form. Right — Locus Studio's single clean interface.]

> "Today, a merchant who wants to sell online has to juggle a website builder, a payment processor, KYC onboarding, and a hosting provider. It takes days — sometimes weeks — just to accept the first payment. We built Locus Studio for the Locus Paygentic Hackathon to collapse that entire stack into one tool."

---

## [0:45 – 1:15] — Landing Page

[Visual: Smooth scroll through the landing page — dark brutalist design, lime `#b7d941` accents, stats ticker, feature grid, how-it-works steps.]

> "The experience starts at the landing page. A dark brutalist aesthetic, sharp corners, and a lime-green accent signal that this is built for speed — not decoration. Below the fold, a live stats ticker counts real transactions flowing through published sites. When a visitor clicks 'Start Building,' they connect their Locus wallet — and that's it. They're in."

---

## [1:15 – 1:45] — Dashboard

[Visual: Dashboard view — revenue card, transaction count, wallet balance with a BaseScan link, sites list.]

> "Inside the dashboard, merchants see a clean overview — total revenue, transaction count, published sites, and wallet balance. Every number is pulled from live webhook events, not placeholders. From here, they can create a new site, open an existing one, or try the pre-built demo — a coffee shop called Kopi Nusantara — with a single click."

---

## [1:45 – 2:45] — The Builder

[Visual: Three-panel builder. Cursor drags a Hero section from the left palette into the center preview, then Features, then Checkout. Property panel on the right updates live.]

> "The builder is where the magic happens. Three panels: sections on the left, a live preview in the center, and property controls on the right. Seven section types cover almost every landing page we've seen in the wild — Hero, Features, Pricing, Checkout, Testimonials, FAQ, and Footer."

[Visual: User types "coffee shop with checkout and testimonials" into the AI prompt bar. Sections auto-populate in the preview with a subtle stagger animation.]

> "And for anyone who doesn't want to start from scratch, the AI builder takes a plain-language prompt and scaffolds the entire page. Themes cycle with one click — modern, dark, retro, glass, neon — and the preview toggles between mobile and desktop with live zoom from fifty to a hundred fifty percent."

---

## [2:45 – 3:15] — Publishing

[Visual: Click Publish → modal opens → username confirmation → progress spinner → success screen with the live URL.]

> "When the site is ready, one click publishes it. Under the hood, two things happen in parallel. First, a PayWithLocus checkout session is created for every Checkout section on the page. Second, BuildWithLocus spins up a containerized deployment — the first publish creates the service, and every publish after that redeploys the same one. No duplicate services. No wasted credits."

---

## [3:15 – 4:00] — Live Site & Checkout

[Visual: Open the published URL in a new tab — the full site renders on a buildwithlocus.com subdomain. Scroll. Click "Pay Now." The embedded checkout modal appears with three payment options. Complete the flow. See the "Paid" confirmation.]

> "The live site loads on a BuildWithLocus subdomain — fully responsive, fully themed. When a buyer clicks 'Pay Now,' the embedded checkout component from the official React SDK renders inline. Three payment methods: the Locus Wallet, any external wallet like MetaMask, or an AI agent paying on a user's behalf. USDC settles on Base in seconds. No gateway fees. No chargebacks."

---

## [4:00 – 4:30] — Analytics

[Visual: Analytics page — revenue chart, transaction table with on-chain hashes, per-site breakdown.]

> "Back in the studio, the analytics dashboard updates in real time. A webhook handler verifies every payment with HMAC-SHA256, then writes it to the transaction log. Merchants see revenue, transaction volume, payment method breakdown, and per-site performance. Every line is traceable to an on-chain hash — the receipt is the blockchain."

---

## [4:30 – 5:00] — Closing

[Visual: Split card — Locus Studio logo on the left, PayWithLocus and BuildWithLocus logos on the right. Fades to an end card.]

> "Locus Studio proves a simple idea: when payments, hosting, and authoring live in the same stack, going from idea to paid customer takes minutes — not months. Built on PayWithLocus, deployed with BuildWithLocus, and open-source under MIT. This is the future of paygentic commerce. And it ships today."

[End card: **"Locus Studio · Paygentic Hackathon #2 · buildwithlocus.com"** — lime accent on black.]

---

## Production Notes

- **Pacing:** Pause ~1 second between scene transitions. Longer pause (~1.5s) before the closing line.
- **Emphasis:** Product names delivered with weight — **Locus Studio**, **PayWithLocus**, **BuildWithLocus**.
- **Music:** Minimal synth pulse under the cold open, ambient bed through the demo, beat lift at "ships today."
- **B-roll priorities:** Real cursor movement in the builder, real USDC transaction on-chain, real webhook firing into analytics. Avoid fake data.
- **Fallback cut (3 min):** Drop sections 2 (Problem) and 8 (Analytics); shorten 5 (Builder) to 40 seconds.

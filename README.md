# SnapFlow — AI E-Commerce Content Factory

[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://typescriptlang.org)
[![Tailwind](https://img.shields.io/badge/Tailwind-4-38bdf8)](https://tailwindcss.com)

AI-powered content generation for e-commerce sellers. Create product copy, image prompts, and video scripts — instantly.

## Features

- **Product Copy Factory** — Amazon, Shopify, Etsy, social media
- **Image Scene Generator** — Professional photography prompts
- **Video Script Factory** — Scene-by-scene scripts with voiceover
- **Credit System** — Free tier (10 credits), paid plans up to unlimited
- **Upgrade Flow** — WeChat/Alipay QR + activation code (no Stripe required)
- **Quick Generate** — One-click content generation

## Tech Stack

- **Framework:** Next.js 16 (App Router + Turbopack)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **Auth:** Local email/password + localStorage persistence
- **AI:** Claude API (Anthropic) with mock fallback for demo
- **Payments:** Stripe + manual payment flow

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build & Deploy

```bash
npm run build   # Production build
npm start       # Start production server
```

### Deploy to Vercel

```bash
npx vercel --prod
```

## Environment

Copy `.env.example` to `.env.local`:

```
BETTER_AUTH_SECRET=your-32-char-secret-here
ANTHROPIC_API_KEY=sk-ant-api03-...  # optional for demo
```

## Project Structure

```
src/
├── app/
│   ├── page.tsx                  # Landing (hero, features, pricing)
│   ├── login/                    # Sign in
│   ├── register/                 # Sign up
│   └── (dashboard)/
│       ├── dashboard/            # Stats + quick actions
│       ├── generate/             # AI content generation
│       ├── projects/             # Project management
│       └── upgrade/              # Plan comparison + payment
├── components/
│   └── session-provider.tsx      # Auth context (localStorage)
└── lib/
    ├── ai.ts                     # Claude API integration
    ├── stripe.ts                 # Stripe helpers
    └── utils.ts                  # Utilities + constants
```

## License

MIT — build and sell with confidence.

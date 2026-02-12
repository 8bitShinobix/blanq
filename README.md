# Blanq

**Beautiful forms. Zero effort.**

A design-first, open-source form builder for freelancers and small businesses who need professional-looking forms without design skills or enterprise budgets.

---

## What is Blanq?

Blanq is the anti-Google Form. Every form looks stunning by default — pick a theme, add your questions, publish. No fiddling with colors, no CSS, no design degree required.

- 5 curated themes that make any form look professional
- Brand kit support — upload your logo, pick your colors, done
- Generous free tier — unlimited forms, unlimited responses
- Self-hostable — run it on your own infrastructure

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | Next.js 16 (App Router) | Server components, API routes, SSR |
| Language | TypeScript 5 | Type safety across the stack |
| UI | React 19 | Component architecture |
| Styling | Tailwind CSS 4 | Utility-first CSS with design tokens |
| Database | Neon (Serverless Postgres) | Zero-downtime, auto-scaling PostgreSQL |
| ORM | Drizzle ORM | Type-safe queries, zero overhead |
| Auth | Better Auth | Email/password + Google OAuth |
| Email | Resend | Transactional email delivery |
| Validation | Zod 4 | Runtime schema validation |
| IDs | nanoid | URL-safe unique identifiers |

---

## Themes

Every form ships with one of 5 professionally designed themes:

| Theme | Style | Personality |
|-------|-------|-------------|
| **Minimal** | White background, clean lines, floating labels | Clean, modern, trustworthy |
| **Bold** | Dark background, vibrant accents, glow effects | Striking, confident, tech-forward |
| **Elegant** | Cream background, serif headings, thin underlines | Sophisticated, premium, refined |
| **Playful** | Pastel backgrounds, rounded corners, spring animations | Friendly, approachable, fun |
| **Corporate** | White background, navy accents, system fonts | Professional, structured, formal |

---

## Project Structure

```
blanq/
├── app/
│   ├── layout.tsx              # Root layout (fonts, metadata, SEO)
│   ├── page.tsx                # Home page
│   └── globals.css             # Tailwind v4 + CSS custom properties
├── components/
│   └── icons.tsx               # BlanqLogo, BlanqWordmark, BlanqLogoLockup
├── db/
│   ├── index.ts                # Drizzle client (Neon HTTP driver)
│   ├── schema.ts               # All tables, enums, relations, types
│   ├── queries/
│   │   ├── index.ts            # Barrel export
│   │   ├── users.ts            # User queries
│   │   ├── forms.ts            # Form CRUD
│   │   └── responses.ts        # Response queries
│   └── migrations/             # Auto-generated SQL migrations
├── lib/
│   └── design-tokens.ts        # Colors, typography, spacing, shadows
├── types/                      # App-level TypeScript types
├── hooks/                      # React custom hooks
├── actions/                    # Server actions
├── public/                     # Static assets
├── drizzle.config.ts           # Drizzle Kit configuration
├── next.config.ts              # Next.js configuration
├── tsconfig.json               # TypeScript config (@/* path alias)
├── postcss.config.mjs          # PostCSS + Tailwind v4
└── package.json
```

---

## Getting Started

### Prerequisites

- **Node.js** 18+
- **pnpm** (recommended) or npm/yarn
- A **Neon** account ([neon.tech](https://neon.tech) — free tier available)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/blanq.git
cd blanq
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Set up environment variables

```bash
cp .env.example .env.local
```

Fill in your `.env.local`:

```env
DATABASE_URL=postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/blanq?sslmode=require
BETTER_AUTH_SECRET=your-secret-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

See the [Environment Variables](#environment-variables) section for the full list.

### 4. Set up the database

```bash
# Generate migration files from the schema
pnpm db:generate

# Push schema to your Neon database
pnpm db:push
```

### 5. Start the dev server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Database Schema

The database uses 6 tables — 4 for authentication (Better Auth compatible) and 2 for the core app.

### Enums

- **plan** — `free` | `pro` | `business`
- **theme** — `minimal` | `bold` | `elegant` | `playful` | `corporate`

### Tables

```
user ──────────────┐
  id (text, PK)    │
  name             │
  email (unique)   │
  emailVerified    │
  image            │
  plan (enum)      │
  brandPrimaryColor│
  brandSecondaryColor
  logoUrl          │
  createdAt        │
  updatedAt        │
                   │
session ───────────┤  account ──────────┤  verification
  id (text, PK)    │    id (text, PK)   │    id (text, PK)
  token (unique)   │    accountId       │    identifier
  expiresAt        │    providerId      │    value
  ipAddress        │    userId (FK) ────┘    expiresAt
  userAgent        │    accessToken          createdAt
  userId (FK) ─────┘    refreshToken         updatedAt
  createdAt              password
  updatedAt              createdAt
                         updatedAt

form ──────────────────────────────────┐
  id (text, PK)                        │
  userId (FK → user, cascade delete)   │
  title                                │
  description                          │
  slug (unique)                        │
  schema (jsonb — form fields)         │
  theme (enum)                         │
  published (boolean)                  │
  settings (jsonb — form config)       │
  viewCount (integer)                  │
  createdAt, updatedAt                 │
                                       │
response ──────────────────────────────┘
  id (text, PK)
  formId (FK → form, cascade delete)
  data (jsonb — submitted answers)
  metadata (jsonb — ip, browser, referrer)
  completed (boolean)
  createdAt
```

### Query Helpers

Pre-built, type-safe query functions in `db/queries/`:

```typescript
import { createForm, getFormsByUserId, createResponse, getResponseCount } from "@/db/queries";
```

| Module | Functions |
|--------|-----------|
| **users** | `getUserById`, `getUserByEmail`, `updateUserBrandKit`, `updateUserPlan` |
| **forms** | `getFormsByUserId`, `getFormById`, `getFormBySlug`, `getPublishedFormBySlug`, `createForm`, `updateForm`, `deleteForm`, `incrementViewCount` |
| **responses** | `createResponse`, `getResponsesByFormId`, `getResponseCount`, `getResponseCountByDate` |

---

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start Next.js dev server |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm db:generate` | Generate SQL migration files from schema |
| `pnpm db:migrate` | Apply pending migrations |
| `pnpm db:push` | Push schema directly to database (no migration files) |
| `pnpm db:studio` | Open Drizzle Studio (visual database browser) |

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | Neon PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | Yes | Secret key for signing auth tokens |
| `GOOGLE_CLIENT_ID` | No | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | No | Google OAuth client secret |
| `UPLOADTHING_TOKEN` | No | UploadThing API token for file uploads |
| `RESEND_API_KEY` | No | Resend API key for email notifications |
| `NEXT_PUBLIC_APP_URL` | Yes | Public URL of the app (e.g. `http://localhost:3000`) |

---

## Design System

Blanq uses a comprehensive design token system defined in `lib/design-tokens.ts` and applied via CSS custom properties in `globals.css`.

**Colors:** Brand black (`#0a0a0a`), warm white (`#faf9f6`), cream (`#ede8e0`), 6-step grey scale, indigo accent (`#6366f1`), semantic colors (success, warning, error)

**Typography:** Three font families — Outfit (display), DM Sans (body), JetBrains Mono (code). Sizes from 10px to 52px.

**Spacing:** 4px grid system. Radius from 2px to 9999px (full). Shadows from xs to xl.

All tokens are available as Tailwind utilities (e.g., `bg-accent`, `text-grey-500`, `rounded-lg`).

---

## Roadmap

### Week 1 — Foundation & Form Builder Core
- [x] Project setup (Next.js 16 + Tailwind 4 + design tokens)
- [x] Database schema & ORM (Drizzle + Neon)
- [ ] Authentication (Better Auth — email/password + Google OAuth)
- [ ] Dashboard shell
- [ ] Form builder editor (block-based, 14 field types)
- [ ] Form preview mode

### Week 2 — Themes & Brand Kit
- [ ] Theme system with CSS custom properties
- [ ] 5 theme implementations
- [ ] Brand kit feature (logo upload + color picker)
- [ ] Theme switcher in editor

### Week 3 — Publishing, Responses & Embedding
- [ ] Form publishing flow (draft/published toggle)
- [ ] Public form pages (`/f/[slug]`)
- [ ] Response collection API
- [ ] Response dashboard with CSV export
- [ ] Email notifications
- [ ] Embed system (iframe + widget)

### Week 4 — Polish, Templates & Launch
- [ ] Dashboard analytics
- [ ] 8 pre-built templates
- [ ] Landing page
- [ ] Testing & deployment

### Future (Post-MVP)
Conditional logic, payment collection (Stripe), third-party integrations (Zapier, webhooks), custom domains, multi-page forms, AI form generation, team workspaces.

---

## Contributing

Contributions are welcome. Please open an issue first to discuss what you'd like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m "Add your feature"`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## License

TBD

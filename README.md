# Siggistore Monorepo

Siggistore is a `pnpm` workspace / Turbo monorepo for an e-commerce storefront and admin dashboard that share authentication, Supabase access, Sanity helpers, services, and types.

## Architecture

```text
siggistore/
├── apps/
│   ├── storefront/          # Customer commerce (Vite + React)
│   └── admin/               # Seller/admin dashboard (Vite + React)
├── packages/
│   ├── auth/                # Shared auth and role-based helpers
│   ├── supabase/            # Shared Supabase singleton + admin DB ops
│   ├── sanity/              # Shared Sanity client + helpers
│   ├── services/            # Shared storefront/admin business logic
│   ├── shared-types/        # Shared TypeScript interfaces
│   ├── utils/               # Utilities and logger helpers
│   └── ui/                  # Shared UI package scaffold
├── scripts/
│   └── build-soft-merged.mjs
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

## URL Strategy

Both apps live on the same origin:

| App | URL |
|---|---|
| Storefront | `/` |
| Admin | `/admin/` |

This keeps auth, local storage, and shared header behavior aligned across both sides.

## Shared Auth

Both apps use the same Supabase client from `@siggistore/supabase` with:

- `persistSession: true`
- shared `storageKey: "siggistore-auth-token"`

The shared header runtime now syncs its displayed auth state from the live Supabase session, then mirrors it into the common header keys:

- `appLoggedIn`
- `appUserEmail`
- `appUserName`
- `appUserAvatar`

That means login/logout on storefront and admin stays consistent across both headers.

### Header Button Logic

```text
if (!user)                         -> Login      -> /Login.html
if (role === "customer")           -> Account    -> /Personal Info.html
if (role === "admin" || "seller")  -> Dashboard  -> /admin/
```

## Package Overview

| Package | Purpose |
|---|---|
| `@siggistore/auth` | Unified auth state, role-aware helpers, React provider/hooks |
| `@siggistore/supabase` | Shared singleton Supabase client and admin operations |
| `@siggistore/sanity` | Shared Sanity client and image helpers |
| `@siggistore/services` | Storefront and admin business/service layer |
| `@siggistore/shared-types` | Shared TypeScript models |
| `@siggistore/utils` | Shared helpers |
| `@siggistore/ui` | Shared UI package scaffold |

## Development

### Requirements

- Node.js `>= 20`
- `pnpm` `9.x`

### Install

```bash
pnpm install
```

### Run

```bash
pnpm dev
```

Current dev behavior:

- one Vite server runs on `http://127.0.0.1:3000`
- storefront is served from `/`
- admin is mounted directly under `/admin/`
- there is no separate admin dev server requirement anymore

Helpful URLs:

- `http://127.0.0.1:3000/`
- `http://127.0.0.1:3000/admin/`
- `http://127.0.0.1:3000/admin/spa.html`

## Production Build

```bash
pnpm build
```

The root build now produces one merged deployable output in [dist](D:/inchallah/dist):

- storefront files are emitted at `dist/`
- admin files are emitted at `dist/admin/`

The merge is handled by [scripts/build-soft-merged.mjs](D:/inchallah/scripts/build-soft-merged.mjs:1), which:

- builds `apps/storefront`
- builds `apps/admin`
- copies storefront output to root `dist`
- copies admin output to `dist/admin`
- rewrites admin HTML asset paths so production pages stay inside `/admin/...`

Useful output files:

- [dist/index.html](D:/inchallah/dist/index.html:1)
- [dist/admin/index.html](D:/inchallah/dist/admin/index.html:1)
- [dist/admin/discounts.html](D:/inchallah/dist/admin/discounts.html:1)
- [dist/admin/orders.html](D:/inchallah/dist/admin/orders.html:1)
- [dist/admin/products.html](D:/inchallah/dist/admin/products.html:1)
- [dist/admin/spa.html](D:/inchallah/dist/admin/spa.html:1)

## Environment Variables

Both apps read the repo-root `.env.local`.

| Variable | Purpose |
|---|---|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase public anon key |
| `VITE_SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key |
| `VITE_SANITY_PROJECT_ID` | Sanity project ID |
| `VITE_SANITY_DATASET` | Sanity dataset |
| `VITE_SANITY_API_VERSION` | Sanity API version |
| `VITE_SANITY_USE_CDN` | Whether to use the Sanity CDN |
| `VITE_SANITY_API_TOKEN` | Sanity API token when needed |
| `VITE_SANITY_READ_TOKEN` | Sanity read token when needed |

## Supabase Schema

Product reviews require the Supabase tables `public.product_reviews` and `public.product_review_replies`.

The schema now lives in both:

- [scripts/create-product-reviews-tables.sql](D:/inchallah/scripts/create-product-reviews-tables.sql:1)
- [supabase/migrations/202605230001_create_product_reviews.sql](D:/inchallah/supabase/migrations/202605230001_create_product_reviews.sql:1)

Apply that SQL to your Supabase project before using the review flows. If you use the Supabase CLI in this repo, the checked-in migration is ready to be pushed. If you use the Supabase dashboard instead, paste the SQL script into the SQL editor and run it there.

## Technology Stack

| Tool | Purpose |
|---|---|
| `pnpm workspaces` | Workspace management |
| `turbo` | Task orchestration |
| `vite` | Frontend build/dev tooling |
| `react` | UI runtime |
| `supabase` | Auth, data, storage |
| `sanity` | CMS/content |
| `tailwind css` | Styling |

## Notes

- The admin still exists as its own app inside `apps/admin`; it is just soft-merged into the storefront host for dev and production output.
- The root `README.md` now reflects the current single-server dev flow and single-output production flow.

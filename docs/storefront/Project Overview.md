### Project Overview
This project is an **e-commerce storefront** built around **Vite + React** with **Supabase** for authentication/storage and **Sanity** for CMS/content services. It is not a Next.js app.

## Integration Status
⚠️ **Important**: This storefront shares a Supabase backend with an admin dashboard. See `admin/ADMIN_STORE_INTEGRATION.md` for integration requirements and identified issues.

The important current detail is that the repository contains **two storefront layers**:

1. A **live HTML-driven React runtime** booted from `index.html -> src/main.jsx -> src/App.jsx`.
2. A **TypeScript SPA/router implementation** booted from `src/main.tsx -> src/App.tsx`, which defines React Router routes and page components, but is **not the current entry point used by `index.html`**.

So the codebase is partly hybrid:
- Root `.html` files are still first-class and contain page-specific markup plus inline auth logic.
- `src/App.jsx` loads and enhances static storefront markup from `public/pages/home.html`.
- The TypeScript app under `src/pages`, `src/components`, and `src/App.tsx` is still present and actively maintained, but it is currently a secondary app path unless the entry point is switched back to `main.tsx`.

---

### Current Runtime Entry Points

#### Live entry point
- `index.html`
- `<script type="module" src="./src/main.jsx"></script>`
- `src/main.jsx`
- `src/App.jsx`

This path is what the browser currently runs. `src/App.jsx`:
- fetches `/pages/home.html`
- injects it into the React root
- loads vendor scripts from `public/js`
- initializes theme pickers and UI behaviors
- binds auth/account dropdown behavior
- syncs cart/favorites/newsletter state through local storage and helper scripts

#### Secondary TypeScript SPA path
- `src/main.tsx`
- `src/App.tsx`

This path provides:
- `BrowserRouter`
- `AuthProvider`
- React page components under `src/pages`
- reusable typed UI under `src/components`

It is still valuable project structure, but it is **not** what `index.html` currently mounts.

---

### Updated Project Structure
```text
d:\inchll app\store\
├── Root HTML storefront pages
│   ├── Addresses.html
│   ├── Cart.html
│   ├── Checkout not Logged-In.html
│   ├── Checkout.html
│   ├── Create Account.html
│   ├── Empty Cart.html
│   ├── Forgot Password.html
│   ├── Login.html
│   ├── My Orders.html
│   ├── Order Checkup.html
│   ├── Order Confirmation.html
│   ├── Order Details.html
│   ├── Personal Info.html
│   ├── Product Detail.html
│   ├── Product Listing.html
│   ├── review-pay.html
│   ├── header.html
│   ├── footer.html
│   └── index.html
│
├── public/
│   ├── css/
│   ├── images/
│   ├── js/
│   │   ├── app.js
│   │   ├── header-standardizer.js
│   │   └── other vendor/runtime helpers
│   └── pages/
│       └── home.html
│
├── src/
│   ├── main.jsx              # current runtime bootstrap
│   ├── App.jsx               # current live storefront runtime
│   ├── main.tsx              # secondary TS app bootstrap
│   ├── App.tsx               # secondary React Router app
│   ├── components/
│   ├── contexts/
│   │   └── AuthContext.tsx
│   ├── data/
│   ├── hooks/
│   ├── lib/
│   │   ├── auth.ts
│   │   ├── store.js
│   │   └── supabase.ts
│   ├── pages/
│   ├── services/
│   │   └── supabase-service.ts
│   └── types/
│
├── dist/                    # build output
├── package.json
├── vite.config.js / vite.config.ts
└── Tailwind / TS / ESLint config files
```

---

### Architecture Summary

#### 1. Static HTML layer
Most customer/account pages still exist as standalone HTML files at the repo root. These pages are not just mockups anymore; several include inline scripts that call the shared Supabase service directly.

Examples:
- `Login.html` signs users in through `supabaseAuthService.signIn(...)`
- `Create Account.html` signs users up through `supabaseAuthService.signUp(...)`
- `Personal Info.html` reads authenticated user data and syncs the profile UI

#### 2. HTML-enhanced React runtime
`src/App.jsx` acts like a lightweight controller around the static storefront:
- loads `public/pages/home.html`
- attaches client behavior after markup injection
- manages auth/account dropdown state
- binds favorites/cart/newsletter interactions
- loads Preline/vendor scripts in order

This is the practical bridge between the static markup and app behavior.

#### 3. TypeScript SPA layer
The `src/main.tsx` + `src/App.tsx` stack is a more standard React SPA:
- React Router routes
- reusable `Navbar` / `Footer`
- page components backed by JSON content and services
- `AuthContext` + hooks for Supabase state

This layer remains useful for long-term migration away from root HTML pages.

#### 4. Backend services
- **Supabase**: auth, user session, profiles, avatars, orders, cart-related storage
- **Sanity**: content/product/CMS integration

---

### Routing State

#### Current browser-facing navigation
There are two routing styles in the repo:

1. **Direct HTML page navigation**
   - `./Login.html`
   - `./Create Account.html`
   - `./My Orders.html`
   - etc.

2. **React Router routes in the TS SPA**
   - `/`
   - `/product-listing`
   - `/product-detail`
   - `/product-detail/:slug`
   - `/cart`
   - `/empty-cart`
   - `/checkout`
   - `/checkout-not-logged-in`
   - `/review-and-pay`
   - `/order-confirmation`
   - `/order-checkup`
   - `/login`
   - `/create-account`
   - `/forgot-password`
   - `/personal-info`
   - `/my-orders`
   - `/order-details`
   - `/addresses`

#### React Router table from `src/App.tsx`

| Route Path | Component |
|---|---|
| `/` | `HomePage` |
| `/product-listing` | `ProductListingPage` |
| `/product-detail` | `ProductDetailPage` |
| `/product-detail/:slug` | `ProductDetailPage` |
| `/cart` | `CartPage` |
| `/empty-cart` | `EmptyCartPage` |
| `/checkout` | `CheckoutPage` |
| `/checkout-not-logged-in` | `CheckoutNotLoggedInPage` |
| `/review-and-pay` | `ReviewAndPayPage` |
| `/order-confirmation` | `OrderConfirmationPage` |
| `/order-checkup` | `OrderCheckupPage` |
| `/login` | `LoginPage` |
| `/create-account` | `CreateAccountPage` |
| `/forgot-password` | `ForgotPasswordPage` |
| `/personal-info` | `PersonalInfoPage` |
| `/my-orders` | `MyOrdersPage` |
| `/order-details` | `OrderDetailsPage` |
| `/addresses` | `AddressesPage` |

---

### Current Auth Behavior
Supabase is the shared auth backend across both layers.

#### Shared service
`src/services/supabase-service.ts` currently provides:
- `signUp`
- `signIn`
- `signOut`
- `getCurrentUser`
- `resetPassword`
- `updatePassword`
- `uploadAvatar`
- auth state change subscription
- profile CRUD helpers including `createProfile`, `upsertProfile`, and `deleteProfile`

#### HTML auth flow
The root HTML pages directly import the shared service:
- `Create Account.html` now clears any previous session before signup, then creates the account and redirects to login after success.
- `Login.html` signs in through Supabase, syncs local storage auth keys, and redirects to `index.html`.
- `Personal Info.html` reads the current user and updates profile display fields.

#### React auth flow
The TypeScript app uses:
- `src/contexts/AuthContext.tsx`
- `src/hooks/useSupabase.ts`
- route pages such as `src/pages/LoginPage.tsx` and `src/pages/CreateAccountPage.tsx`

`CreateAccountPage.tsx` was recently updated to mirror the HTML flow:
- validates first/last name, email, password, confirm password, and terms acceptance
- signs out any old session first
- clears stored client auth state
- calls Supabase signup
- stores marketing opt-in locally
- redirects to `/login` after success

---

### Data Flow

#### HTML runtime path
1. Browser loads `index.html`
2. `src/main.jsx` mounts `src/App.jsx`
3. `App.jsx` fetches `public/pages/home.html`
4. Vendor scripts and DOM behaviors are attached
5. Local storage and Supabase session state drive navbar/account/cart/favorites behavior

#### TS SPA path
1. `src/main.tsx` mounts React Router and `AuthProvider`
2. Route component renders a page from `src/pages`
3. Page reads static JSON, context state, or service data
4. Supabase and Sanity services return content/session data
5. UI rerenders from React state

---

### Relationship Between HTML and `src/`

#### What `src/` does today
`src/` contains both:
- the current live runtime (`main.jsx`, `App.jsx`)
- the more structured TS SPA (`main.tsx`, `App.tsx`, `pages/`, `components/`)

#### What the HTML files do today
The root HTML files are still operational views, not just exports or legacy artifacts. They are tightly coupled to:
- `public/js` helpers
- shared Supabase services imported from `src/services/supabase-service.ts`
- local storage keys such as:
  - `appLoggedIn`
  - `appUserEmail`
  - `appUserName`
  - `appUserAvatar`

So the repo is best described as a **hybrid storefront with a static-page surface and shared React/Supabase logic underneath**.

---

### Component and View Dependencies
- `src/App.jsx` depends heavily on DOM structure/classes inside `public/pages/home.html`
- root HTML pages depend on shared auth/service modules from `src/services`
- React Router pages depend on:
  - `Navbar.tsx`
  - `Footer.tsx`
  - `AuthContext`
  - JSON files under `src/data`
  - service hooks/utilities

This means UI changes often need coordination across:
- static HTML snapshots
- `public/pages/home.html`
- `src/App.jsx`
- `public/js/header-standardizer.js`
- TS page components

---

### Important Current Notes
- The project is **not Next.js**.
- The **actual current entry point is `src/main.jsx`**, not `src/main.tsx`.
- React Router exists and is maintained, but it is not the default browser entry path right now.
- Supabase auth is shared between the HTML pages and the TS React pages.
- Recent updates removed placeholder profile data and aligned signup logic between HTML and React flows.

---

### Recommended Mental Model
Treat the project as:

1. **A live storefront shell powered by static HTML + DOM enhancement**
2. **A parallel React/TypeScript SPA that is partly a migration target and partly a reusable component/service layer**
3. **A shared Supabase-backed auth/service core used by both**

That mental model matches the current repository more accurately than calling it a single pure React SPA.

# Project Overview

## Architecture Note
This project now has a hybrid client-side architecture with two JavaScript runtimes:

1. `HTML-driven admin runtime`
   Entry examples: `products.html`, `orders.html`, `discounts.html`, plus page modules in `src/page-scripts/`
   Purpose: enhance static dashboard/admin HTML already present in the repo.

2. `TypeScript SPA runtime`
   Entry: `spa.html` -> `src/main.tsx` -> `src/App.tsx`
   Purpose: provide a modern React Router application with typed hooks, context, and shared service wrappers around Supabase and Sanity.

The two runtimes share the same service layer integrations for Sanity and Supabase, but they do not share the same rendering strategy.

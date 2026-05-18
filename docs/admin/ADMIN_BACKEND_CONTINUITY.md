# Admin Backend Continuity Plan

This document maps the admin dashboard in `D:\Dashboard` to the backend continuity already described in `D:\Dashboard\make a continuity on the backend`.

The goal is to make the admin side work against the same live store backend instead of behaving like a disconnected static template.

## Source of truth used

The analysis below is based on:

- `make a continuity on the backend/docs/Project Overview.md`
- `make a continuity on the backend/docs/Supabase.md`
- `make a continuity on the backend/src/services/supabase-service.ts`
- `make a continuity on the backend/src/services/supabase/user/provider.ts`
- `make a continuity on the backend/src/types/index.ts`

## Main finding

The store project already documents the biggest integration problem:

- storefront services mostly use `user_id`
- some shared integration logic still uses `customer_id`
- the admin side needs bulk order/customer queries that the storefront service layer does not expose yet

This means the admin dashboard should not be "fixed" only at the HTML level. It needs a backend-aligned data contract first.

## Critical mismatch to fix first

### Canonical user link

Use `user_id` as the canonical identity key across shared tables.

Why:

- `make a continuity on the backend/src/types/index.ts` defines `SupabaseProfile.user_id`
- the same file defines `SupabaseOrder.user_id`
- `make a continuity on the backend/src/services/supabase-service.ts` queries profiles, orders, and carts with `user_id`
- `make a continuity on the backend/docs/Supabase.md` explicitly says standardization should move to `user_id`

### Current inconsistency

There is still a concrete inconsistency here:

- `make a continuity on the backend/src/services/supabase/user/provider.ts`
- `ordersGet(...)`
- queries `orders` with `.eq("customer_id", userData.user.id)`

That query should be aligned with the rest of the shared model unless the database still truly stores `customer_id`.

## What the admin should depend on

The admin dashboard should treat Supabase as the operational backend for:

- auth and admin session
- customers
- orders
- order items
- carts if needed for recovery metrics
- profiles
- discounts if stored in Supabase
- dashboard analytics aggregates or reporting views

The admin should treat Sanity as content/catalog support only:

- products
- categories
- merchandising content
- CMS-managed display content

This matches the existing storefront documentation, which says Supabase is the transaction/auth backend and Sanity is content/CMS.

## Recommended shared data model

Use these core entities across both storefront and admin:

### `profiles`

- `id`
- `user_id`
- `first_name`
- `last_name`
- `avatar_url`
- `phone`
- `address`
- `city`
- `country`
- `postal_code`
- `is_active`
- `created_at`
- `updated_at`

### `customers`

If a separate `customers` table is needed for admin reporting, it should still link to auth using `user_id`, not replace it.

Recommended fields:

- `id`
- `user_id`
- `email`
- `first_name`
- `last_name`
- `phone`
- `status`
- `lifetime_value`
- `orders_count`
- `created_at`
- `updated_at`

### `orders`

- `id`
- `user_id`
- `status`
- `payment_status`
- `fulfillment_status`
- `total_amount`
- `currency`
- `shipping_address`
- `billing_address`
- `created_at`
- `updated_at`

### `order_items`

- `id`
- `order_id`
- `product_id`
- `quantity`
- `price_snapshot`
- `total`

### `discounts`

If this is not already present in Supabase, the admin needs it.

Recommended fields:

- `id`
- `code`
- `type`
- `value`
- `scope`
- `starts_at`
- `ends_at`
- `usage_limit`
- `usage_count`
- `status`
- `created_at`
- `updated_at`

## Missing backend capabilities for admin

The storefront documentation already calls out the admin gaps. These are the minimum service additions needed for the dashboard:

### Add `supabaseAdminService`

Recommended shared service surface:

```ts
export const supabaseAdminService = {
  getOverviewMetrics,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  getAllCustomers,
  getCustomerById,
  getAllDiscounts,
  createDiscount,
  updateDiscount,
  deleteDiscount,
  getProductPerformance,
  getLowStockProducts,
}
```

### Minimum required functions

These are the first functions the admin side needs:

- `getAllOrders(limit?, filters?)`
- `getOrderById(orderId)`
- `updateOrderStatus(orderId, status)`
- `getAllCustomers(limit?, filters?)`
- `getCustomerById(customerIdOrUserId)`
- `getOverviewMetrics(range?)`
- `getAllDiscounts(filters?)`
- `createDiscount(input)`
- `updateDiscount(id, input)`
- `deleteDiscount(id)`

## How this dashboard should map to backend data

This repository contains these admin pages:

- `index.html`
- `products.html`
- `product-details.html`
- `add-product.html`
- `orders.html`
- `order-details.html`
- `purchase-orders.html`
- `discounts.html`
- `reviews.html`
- `payouts.html`
- `store.html`
- `search.html`
- `empty-states.html`

Below is how each page should be fixed from a backend perspective.

## Page-by-page admin contract

### `index.html`

Purpose:

- overview dashboard

Needs:

- total revenue
- order count
- average order value
- pending/failed/refunded counts
- recent orders
- low stock products
- top products

Backend contract:

- `getOverviewMetrics(range?)`
- `getAllOrders({ limit: 10 })`
- `getLowStockProducts({ limit: 10 })`

### `products.html`

Purpose:

- product listing and filters

Needs:

- products from Sanity or unified product service
- stock and sales from operational store data

Backend contract:

- `getProducts(filters?)`
- `getProductPerformance(productIds?)`

Note:

Products likely remain Sanity-backed, but stock and sales should be joined from transactional data.

### `product-details.html`

Purpose:

- inspect and edit a single product

Needs:

- product content
- inventory
- sales count
- related orders/reviews summary

Backend contract:

- `getProduct(productId)`
- `getProductPerformance(productId)`
- `getProductReviews(productId)`

### `add-product.html`

Purpose:

- create a product

Needs:

- categories
- pricing rules
- inventory defaults

Backend contract:

- `createProduct(input)`
- `getCategories()`

### `orders.html`

Purpose:

- admin order management

Needs:

- all orders
- filters by status/date/customer
- payment state
- fulfillment state

Backend contract:

- `getAllOrders({ page, pageSize, filters })`
- `updateOrderStatus(orderId, status)`

This page is one of the main reasons the admin service layer is required.

### `order-details.html`

Purpose:

- inspect and manage a single order

Needs:

- order
- line items
- customer
- addresses
- status timeline

Backend contract:

- `getOrderById(orderId)`
- `updateOrderStatus(orderId, status)`
- optional `refundOrder(orderId, payload)`

### `purchase-orders.html`

Purpose:

- supplier/restock workflow

Needs:

- supplier purchase order records

Backend contract:

- not visible in the storefront continuity docs

Recommendation:

- keep this page read-only or mock-backed until a real purchasing table exists

### `discounts.html`

Purpose:

- coupon and promotion management

Needs:

- list of discounts
- status
- schedule
- usage stats

Backend contract:

- `getAllDiscounts(filters?)`
- `createDiscount(input)`
- `updateDiscount(id, input)`
- `deleteDiscount(id)`

### `reviews.html`

Purpose:

- moderation and feedback analytics

Needs:

- product reviews
- approval/moderation state

Backend contract:

- currently not defined in the continuity docs

Recommendation:

- connect to whichever store review source is authoritative, but keep it separate from the first-phase order/customer fixes

### `payouts.html`

Purpose:

- payout and settlement visibility

Needs:

- payout records from payment provider or settlement tables

Backend contract:

- not present in the storefront continuity docs

Recommendation:

- do not guess this schema yet; add only after orders and customers are stable

### `store.html`

Purpose:

- store configuration / health

Needs:

- store identity
- integration status
- maybe environment health

Backend contract:

- `getStoreSettings()`
- `getIntegrationHealth()`

### `search.html`

Purpose:

- global admin search

Needs:

- search across products, orders, customers, discounts

Backend contract:

- `searchAdmin(query, scope?)`

### `empty-states.html`

Purpose:

- fallback UI patterns only

Needs:

- no backend of its own

## How the admin side should be fixed in phases

### Phase 1: schema alignment

Do this first.

1. Confirm the real orders table column name in Supabase.
2. Standardize shared code on `user_id`.
3. Remove or migrate any remaining `customer_id` assumptions unless they are required by an existing reporting table.
4. If a `customers` table exists, make it reference `user_id`.

### Phase 2: shared admin service layer

Create a dedicated admin data layer in this dashboard project or extract one from the storefront services.

Recommended file target in this repo:

- `src/services/admin-service.js` or `src/services/admin-service.ts`

It should expose stable methods rather than letting each HTML page query Supabase directly.

### Phase 3: connect the highest-value pages

Connect these first:

1. `index.html`
2. `orders.html`
3. `order-details.html`
4. `discounts.html`

Reason:

- these pages depend most on live business data
- they are also the clearest admin workflows

### Phase 4: connect catalog and customer views

Then connect:

1. `products.html`
2. `product-details.html`
3. `store.html`
4. `search.html`

### Phase 5: secondary workflows

Only after the core flows are real:

- `purchase-orders.html`
- `reviews.html`
- `payouts.html`

## Recommended implementation shape for this repo

Since `D:\Dashboard` is currently HTML-first, the safest approach is:

1. keep the current HTML pages
2. keep shared header/footer loading
3. add one admin service layer under `src/services/`
4. have each page load only the data it needs
5. progressively replace static numbers/tables with live data

## Concrete fixes already justified by the continuity folder

These are not guesses. They are directly supported by the continuity source project:

1. The admin/store shared model should prefer `user_id`.
2. The storefront service layer is missing admin bulk functions.
3. There is at least one active inconsistency where orders are fetched with `customer_id`.
4. Supabase should remain the admin source for auth, profiles, customers, and orders.
5. Sanity should remain content/catalog-oriented, not the primary admin operations backend.

## Best next step in this repo

The next practical step is to implement an admin service layer in `D:\Dashboard` with these methods first:

```ts
getOverviewMetrics()
getAllOrders()
getOrderById(orderId)
updateOrderStatus(orderId, status)
getAllDiscounts()
getAllCustomers()
```

After that, wire:

- `index.html` to overview metrics
- `orders.html` to all orders
- `order-details.html` to single-order fetch/update
- `discounts.html` to live discount data

That will turn the current admin from a static UI into a backend-consistent control panel.

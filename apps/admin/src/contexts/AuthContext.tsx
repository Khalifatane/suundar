/**
 * Admin Auth Context
 *
 * Uses the shared @siggistore/auth/react for unified authentication.
 * The same auth session is shared with the storefront.
 * Admin routes use useAdminGuard() to check for admin/seller role.
 */
export { AuthProvider, useAuth, useAdminGuard } from "@siggistore/auth/react";

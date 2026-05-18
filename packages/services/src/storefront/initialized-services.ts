/**
 * Initialized storefront services
 *
 * Re-exports services in the same structure as the old services/storefront/initialized-services.ts
 * for backward compatibility during the migration.
 */
import { createServiceRegistry } from '../index';
import supabaseService from './supabase-service';

// Initialize Sanity services
export const sanityServices = createServiceRegistry();

// Supabase services (from the new shared supabase-service)
export const supabaseServices = {
  auth: supabaseService.auth,
  user: {
    userGet: supabaseService.auth.getCurrentUser,
    ordersGet: supabaseService.order.getOrders,
    accountUpdate: supabaseService.profile.upsertProfile,
    passwordChange: supabaseService.auth.updatePassword,
  },
};

// Combined service registry
export const services = {
  sanity: sanityServices,
  supabase: supabaseServices,
};

// Export individual services for convenience
export const {
  cmsPage: sanityCMSPage,
  search: sanitySearch,
  collection: sanityCollection,
  store: sanityStore,
  cmsMenu: sanityMenu,
} = sanityServices;

export const {
  auth: supabaseAuth,
  user: supabaseUser,
} = supabaseServices;

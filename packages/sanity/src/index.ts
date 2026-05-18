/**
 * @siggistore/sanity
 *
 * Shared Sanity CMS client and helpers for both storefront and admin.
 */
import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

function getEnvVar(name: string): string | undefined {
  return (
    import.meta.env?.[name] ||
    (typeof process !== 'undefined' ? process.env[name] : undefined)
  );
}

const projectId = getEnvVar('VITE_SANITY_PROJECT_ID') || getEnvVar('NEXT_PUBLIC_SANITY_PROJECT_ID');
const dataset = getEnvVar('VITE_SANITY_DATASET') || getEnvVar('NEXT_PUBLIC_SANITY_DATASET') || 'production';
const apiVersion = getEnvVar('VITE_SANITY_API_VERSION') || getEnvVar('NEXT_PUBLIC_SANITY_API_VERSION') || '2024-01-01';
const token = getEnvVar('SANITY_API_TOKEN');
const useCdn = getEnvVar('VITE_SANITY_USE_CDN') !== 'false' && getEnvVar('NEXT_PUBLIC_SANITY_USE_CDN') !== 'false';
const withCredentials = Boolean(token);

let sharedClient: ReturnType<typeof createClient> | null = null;
let tokenizedClient: ReturnType<typeof createClient> | null = null;

export function getSanityClient(config?: { projectId?: string; dataset?: string; apiVersion?: string; useCdn?: boolean }) {
  if (!sharedClient && !config?.projectId && !projectId) {
    throw new Error(
      'Missing Sanity configuration. Please set VITE_SANITY_PROJECT_ID environment variable.',
    );
  }

  if (config) {
    return createClient({
      projectId: config.projectId ?? projectId ?? '',
      dataset: config.dataset ?? dataset,
      apiVersion: config.apiVersion ?? apiVersion,
      useCdn: config.useCdn ?? useCdn,
      perspective: 'published',
    });
  }

  if (!sharedClient) {
    sharedClient = createClient({
      projectId: projectId ?? '',
      dataset,
      apiVersion,
      useCdn,
      token,
      ignoreBrowserWarnings: true,
      withCredentials,
    });
  }

  return sharedClient;
}

export function getSanityTokenizedClient() {
  if (!tokenizedClient) {
    tokenizedClient = createClient({
      projectId: projectId ?? '',
      dataset,
      apiVersion: apiVersion || '2025-01-01',
      token,
      useCdn: false,
      withCredentials,
    });
  }
  return tokenizedClient;
}

export function getImageUrlBuilder() {
  const client = getSanityClient();
  return imageUrlBuilder(client);
}

export function urlFor(source: any) {
  return getImageUrlBuilder().image(source);
}

// ===== Helper functions (moved from storefront/lib/sanity-helpers.ts) =====

/**
 * Transforms a Sanity image object to a URL string
 */
export function toImage(image: any): string | null {
  if (!image?.asset?._ref && !image?.asset?.url) return null;
  if (image?.asset?.url) return image.asset.url;
  const client = getSanityClient();
  return client.image(image).url();
}

/**
 * Converts a price object to a number
 */
export function toPrice(price: any): number {
  if (typeof price === 'number') return price;
  if (typeof price === 'string') return parseFloat(price);
  if (price?.amount) return parseFloat(price.amount);
  return 0;
}

/**
 * Converts a taxed price object to a number
 */
export function toTaxedPrice(taxedPrice: any): number {
  if (typeof taxedPrice === 'number') return taxedPrice;
  if (typeof taxedPrice === 'string') return parseFloat(taxedPrice);
  if (taxedPrice?.amount) return parseFloat(taxedPrice.amount);
  return 0;
}

export { createClient, imageUrlBuilder };

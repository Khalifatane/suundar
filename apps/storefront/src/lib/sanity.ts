import { createClient } from '@sanity/client';

// Sanity client initialization with comprehensive configuration
const projectId =
  import.meta.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
  import.meta.env.VITE_SANITY_PROJECT_ID;
const dataset =
  import.meta.env.NEXT_PUBLIC_SANITY_DATASET ||
  import.meta.env.VITE_SANITY_DATASET;
const apiVersion =
  import.meta.env.NEXT_PUBLIC_SANITY_API_VERSION ||
  import.meta.env.VITE_SANITY_API_VERSION;
const token = import.meta.env.SANITY_API_TOKEN;
const useCdn =
  import.meta.env.NEXT_PUBLIC_SANITY_USE_CDN === 'true' ||
  import.meta.env.VITE_SANITY_USE_CDN === 'true';
const withCredentials = Boolean(token);

const missingConfigMessage =
  'Missing Sanity configuration. Expected NEXT_PUBLIC_SANITY_* or VITE_SANITY_* environment variables.';

function createMissingConfigProxy() {
  return new Proxy(
    {},
    {
      get() {
        throw new Error(missingConfigMessage);
      },
    },
  );
}

const hasSanityConfig = Boolean(projectId && dataset);

if (!hasSanityConfig) {
  console.warn(missingConfigMessage);
}

export const sanityClient = hasSanityConfig
  ? createClient({
      projectId,
      dataset,
      apiVersion: apiVersion || '2025-01-01',
      useCdn,
      token,
      ignoreBrowserWarnings: true,
      withCredentials,
    })
  : createMissingConfigProxy();

export const sanityTokenizedClient = hasSanityConfig
  ? createClient({
      projectId,
      dataset,
      apiVersion: apiVersion || '2025-01-01',
      token,
      useCdn: false,
      withCredentials,
    })
  : createMissingConfigProxy();

// Export for server-side use
export const getSanityClient = () => {
  return sanityClient;
};

export const getSanityTokenizedClient = () => {
  return sanityTokenizedClient;
};

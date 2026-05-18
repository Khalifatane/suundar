// Configuration management for the application
import { z } from 'zod';

// Validation schema for environment variables
const envSchema = z.object({
  // Sanity
  sanityProjectId: z.string(),
  sanityDataset: z.string(),
  sanityApiVersion: z.string().default('2025-01-01'),
  sanityUseCdn: z.enum(['true', 'false']).default('false'),
  
  // Supabase
  supabaseUrl: z.string().url(),
  supabaseAnonKey: z.string(),
  supabasePublishableKey: z.string(),
  
  // App
  defaultCurrency: z.string().default('XOF'),
  storefrontUrl: z.string().url(),
  siteUrl: z.string().url(),
  apiBaseUrl: z.string().url(),
});

type EnvConfig = z.infer<typeof envSchema>;

// Safely parse environment variables
const parseEnv = (): EnvConfig => {
  const raw = {
    sanityProjectId: import.meta.env.VITE_SANITY_PROJECT_ID,
    sanityDataset: import.meta.env.VITE_SANITY_DATASET,
    sanityApiVersion: import.meta.env.VITE_SANITY_API_VERSION,
    sanityUseCdn: import.meta.env.VITE_SANITY_USE_CDN,
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
    supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
    supabasePublishableKey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    defaultCurrency: import.meta.env.VITE_DEFAULT_CURRENCY,
    storefrontUrl: import.meta.env.VITE_STOREFRONT_URL,
    siteUrl: import.meta.env.VITE_SITE_URL,
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
  };

  try {
    return envSchema.parse(raw);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors
        .map(err => `VITE_${err.path.join('_').toUpperCase()}`)
        .join(', ');
      console.error(`Missing or invalid environment variables: ${missingVars}`);
    }
    throw error;
  }
};

export const config = parseEnv();

// Export individual config properties for convenience
export const {
  sanityProjectId,
  sanityDataset,
  sanityApiVersion,
  sanityUseCdn,
  supabaseUrl,
  supabaseAnonKey,
  supabasePublishableKey,
  defaultCurrency,
  storefrontUrl,
  siteUrl,
  apiBaseUrl,
} = config;

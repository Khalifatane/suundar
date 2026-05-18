import { getSanityClient } from './sanity';

/**
 * Transforms a Sanity image object to a URL string
 * @param image - The Sanity image object
 * @returns The image URL or null if not available
 */
export const toImage = (image: any): string | null => {
  if (!image?.asset?._ref) return null;

  const client = getSanityClient();
  return client.image(image).url();
};

/**
 * Converts a price object to a number
 * @param price - The price object from Sanity
 * @returns The price as a number
 */
export const toPrice = (price: any): number => {
  if (typeof price === 'number') return price;
  if (typeof price === 'string') return parseFloat(price);
  if (price?.amount) return parseFloat(price.amount);
  return 0;
};

/**
 * Converts a taxed price object to a number
 * @param taxedPrice - The taxed price object from Sanity
 * @returns The taxed price as a number
 */
export const toTaxedPrice = (taxedPrice: any): number => {
  if (typeof taxedPrice === 'number') return taxedPrice;
  if (typeof taxedPrice === 'string') return parseFloat(taxedPrice);
  if (taxedPrice?.amount) return parseFloat(taxedPrice.amount);
  return 0;
};
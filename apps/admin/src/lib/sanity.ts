import { getSanityClient } from "@siggistore/sanity";

export const sanityClient = getSanityClient();

export function getSanityImageUrl(imageRef: string): string | null {
  if (!imageRef) return null;
  const client = getSanityClient();
  return client.image(imageRef).url();
}

export function subscribeToSanityProducts(callback: (update: any) => void) {
  const client = getSanityClient();
  return client.listen('*[_type == "product"]').subscribe(callback);
}

import {
  fetchSanityProductById,
  fetchSanityProducts,
  fetchSanityProductsByIds,
  getSanityClient,
  getSanityImageUrl,
  subscribeToSanityProducts,
} from "./sanity-service.js";

export const sanityService = {
  getSanityClient,
  getSanityImageUrl,
  fetchSanityProducts,
  fetchSanityProductsByIds,
  fetchSanityProductById,
  subscribeToSanityProducts,
};

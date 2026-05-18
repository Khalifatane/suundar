import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

const SANITY_API_VERSION =
  import.meta.env.VITE_SANITY_API_VERSION || "2025-01-01";
const SANITY_USE_CDN = import.meta.env.VITE_SANITY_USE_CDN !== "false";
const SANITY_TOKEN =
  import.meta.env.VITE_SANITY_READ_TOKEN ||
  import.meta.env.VITE_SANITY_API_TOKEN ||
  "";

function requireEnv(name, value) {
  if (!value) {
    throw new Error(`Missing required Sanity environment variable: ${name}`);
  }

  return value;
}

export function getSanityConfig() {
  const projectId = requireEnv(
    "VITE_SANITY_PROJECT_ID",
    import.meta.env.VITE_SANITY_PROJECT_ID,
  );
  const dataset = requireEnv(
    "VITE_SANITY_DATASET",
    import.meta.env.VITE_SANITY_DATASET,
  );

  return {
    projectId,
    dataset,
    apiVersion: SANITY_API_VERSION,
    useCdn: SANITY_USE_CDN,
    token: SANITY_TOKEN || undefined,
  };
}

let sanityClientInstance;
let sanityImageBuilder;

export function getSanityClient() {
  if (!sanityClientInstance) {
    sanityClientInstance = createClient(getSanityConfig());
  }

  return sanityClientInstance;
}

export function getSanityImageBuilder() {
  if (!sanityImageBuilder) {
    sanityImageBuilder = imageUrlBuilder(getSanityClient());
  }

  return sanityImageBuilder;
}

export function urlForSanityImage(source) {
  if (!source) return null;
  return getSanityImageBuilder().image(source);
}

export function getSanityImageUrl(source, options = {}) {
  if (!source) return undefined;

  try {
    let builder = urlForSanityImage(source);
    if (!builder) return undefined;

    if (options.width) builder = builder.width(options.width);
    if (options.height) builder = builder.height(options.height);
    if (options.fit) builder = builder.fit(options.fit);

    return builder.url();
  } catch {
    return undefined;
  }
}

function escapeGroqString(value) {
  return String(value ?? "")
    .replaceAll("\\", "\\\\")
    .replaceAll('"', '\\"');
}

function normalizeChannelList(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean).map(String);
  return [String(value)];
}

function normalizeProduct(product) {
  const status = String(product.status ?? "").toLowerCase();
  const normalizedStatus =
    status === "archived" || status === "draft"
      ? "archived"
      : status === "unpublish" || status === "inactive"
        ? "unpublish"
        : "publish";

  return {
    id: product._id,
    slug:
      typeof product.slug === "string"
        ? product.slug
        : product.slug?.current || product._id,
    name: product.title || product.name || "Untitled product",
    category: product.category || "Uncategorized",
    sku: product.sku || product._id?.slice(-8)?.toUpperCase() || "N/A",
    price: Number(product.price ?? 0) || 0,
    status: normalizedStatus,
    stock: Number(product.stock ?? 0) || 0,
    image: product.image || product.mainImage || product.images?.[0] || null,
    imageUrl:
      product.imageUrl ||
      getSanityImageUrl(product.image || product.mainImage || product.images?.[0], {
        width: 240,
        height: 240,
        fit: "clip",
      }) ||
      "",
    channels: normalizeChannelList(product.channels),
    isPublished:
      product.isPublished === undefined ? true : Boolean(product.isPublished),
    isAvailable: product.isAvailable !== false && normalizedStatus !== "unpublish",
    raw: product,
  };
}

const PRODUCT_PROJECTION = `{
  _id,
  _type,
  title,
  name,
  slug,
  "sku": coalesce(sku, store.sku, productId),
  "price": coalesce(price, salePrice, basePrice, store.price, variants[0].price, 0),
  "category": coalesce(category->title, category, store.category, "Uncategorized"),
  "stock": coalesce(stock, inventory, store.inventory, 0),
  "status": coalesce(status, store.status, select(isAvailable == false => "unpublish", "publish")),
  "image": coalesce(image, mainImage, images[0]),
  "imageUrl": coalesce(image.asset->url, mainImage.asset->url, images[0].asset->url, store.previewImageUrl),
  "channels": coalesce(channels[]->title, channels, []),
  "isPublished": !(_id in path("drafts.**")),
  "isAvailable": coalesce(isAvailable, store.isAvailable, true)
}`;

export async function fetchSanityProductById(id) {
  if (!id) return null;

  const query = `*[_type in ["product", "products"] && (_id == $id || slug.current == $id)][0]${PRODUCT_PROJECTION}`;
  const product = await getSanityClient().fetch(query, { id });
  return product ? normalizeProduct(product) : null;
}

export async function fetchSanityProductsByIds(ids = []) {
  if (!ids.length) return [];

  const query = `*[_type in ["product", "products"] && (_id in $ids || slug.current in $ids)]${PRODUCT_PROJECTION}`;
  const products = await getSanityClient().fetch(query, { ids });
  return Array.isArray(products) ? products.map(normalizeProduct) : [];
}

export async function fetchSanityProducts(options = {}) {
  const { limit = 100, query = "" } = options;
  const normalizedQuery = escapeGroqString(String(query || "").trim().toLowerCase());
  const safeLimit = Number(limit) > 0 ? Number(limit) : 100;
  const groq = `*[
    _type in ["product", "products"] &&
    (
      "${normalizedQuery}" == "" ||
      lower(coalesce(title, name, "")) match "*${normalizedQuery}*" ||
      lower(coalesce(sku, store.sku, "")) match "*${normalizedQuery}*" ||
      lower(coalesce(category->title, category, "")) match "*${normalizedQuery}*"
    )
  ] | order(coalesce(title, name, "") asc)[0...${safeLimit}]${PRODUCT_PROJECTION}`;

  const products = await getSanityClient().fetch(groq);
  return Array.isArray(products) ? products.map(normalizeProduct) : [];
}

export function subscribeToSanityQuery(query, params = {}, callback) {
  try {
    const liveClient = getSanityClient().withConfig({
      useCdn: false,
    });

    const subscription = liveClient
      .listen(query, params, {
        includeResult: true,
        includePreviousRevision: false,
        visibility: "query",
      })
      .subscribe((update) => {
        callback?.(update);
      });

    return () => {
      subscription.unsubscribe();
    };
  } catch (error) {
    console.warn("Sanity realtime subscription unavailable", error);
    return () => {};
  }
}

export function subscribeToSanityProducts(callback, options = {}) {
  const { query = "" } = options;
  const normalizedQuery = escapeGroqString(String(query || "").trim().toLowerCase());
  const groq = `*[
    _type in ["product", "products"] &&
    (
      "${normalizedQuery}" == "" ||
      lower(coalesce(title, name, "")) match "*${normalizedQuery}*" ||
      lower(coalesce(sku, store.sku, "")) match "*${normalizedQuery}*" ||
      lower(coalesce(category->title, category, "")) match "*${normalizedQuery}*"
    )
  ]`;

  return subscribeToSanityQuery(groq, {}, callback);
}

export default {
  getSanityClient,
  getSanityConfig,
  getSanityImageUrl,
  urlForSanityImage,
  fetchSanityProductById,
  fetchSanityProductsByIds,
  fetchSanityProducts,
  subscribeToSanityProducts,
  subscribeToSanityQuery,
};

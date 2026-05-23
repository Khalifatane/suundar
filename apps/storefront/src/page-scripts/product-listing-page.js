import sanityService from "@siggistore/services/storefront/sanity-service";
import {
  bindAddToCartButtons,
  bindFavoriteToggles,
  formatPrice,
  hydrateProductDataAttributes,
} from "/src/lib/store.js";

const categoryStrip = document.getElementById("product-listing-categories");
const grid = document.getElementById("product-listing-grid");
const countNode = document.getElementById("product-listing-count");
const params = new URLSearchParams(window.location.search);
const categorySlug = params.get("category");

function getProductCards() {
  if (!grid) return [];
  return Array.from(grid.children).filter((node) => node.classList.contains("group"));
}

function getCategoryCards() {
  if (!categoryStrip) return [];
  return Array.from(categoryStrip.querySelectorAll("a"));
}

function getProductImage(product) {
  return product?.image?.asset?.url || product?.images?.[0]?.asset?.url || "";
}

function applyCategoryCards(categories) {
  const cards = getCategoryCards();
  if (!cards.length || !Array.isArray(categories) || categories.length === 0) return;

  cards.forEach((card, index) => {
    const category = categories[index];
    if (!category) return;

    const img = card.querySelector("img");
    const label = card.querySelector("span");
    const href = category?.slug?.current
      ? `./Product Listing.html?category=${encodeURIComponent(category.slug.current)}`
      : "./Product Listing.html#";

    if (img && category?.image?.asset?.url) {
      img.src = category.image.asset.url;
      img.alt = category.title || "Category Image";
    }

    if (label && category?.title) {
      label.textContent = category.title;
    }

    card.setAttribute("href", href);
  });
}

function applyProductCards(products, totalCount) {
  const cards = getProductCards();
  if (!cards.length || !Array.isArray(products) || products.length === 0) return;

  cards.forEach((card, index) => {
    const product = products[index];
    if (!product) return;

    const img = card.querySelector("img.ictpa");
    const links = card.querySelectorAll('a[href*="Product Detail.html"]');
    const titleNode = card.querySelector(".z3wmw > span");
    const categoryNode = card.querySelector(".z3wmw > p");
    const priceWrap = card.querySelector(".z3wmw .liwkv");
    const productImage = getProductImage(product);
    const productHref = product?.slug?.current
      ? `./Product Detail.html?slug=${encodeURIComponent(product.slug.current)}`
      : "./Product Detail.html";
    const productTitle = product?.title || titleNode?.textContent?.trim() || "Product";
    const productCategory =
      product?.category?.title || categoryNode?.textContent?.trim() || "Product";

    if (img && productImage) {
      img.src = productImage;
      img.alt = productTitle;
    }

    links.forEach((link) => link.setAttribute("href", productHref));

    if (titleNode) {
      titleNode.textContent = productTitle;
    }

    if (categoryNode) {
      categoryNode.textContent = productCategory;
    }

    if (priceWrap && typeof product?.price === "number") {
      const nextPrice = formatPrice(product.price, product.currency || "USD");

      if (typeof product?.originalPrice === "number") {
        priceWrap.innerHTML = `
          <span class="yymkp f1ztf">
            <s>${formatPrice(product.originalPrice, product.currency || "USD")}</s>
          </span>
          <span class="yymkp gwcbr">${nextPrice}</span>
        `;
      } else {
        priceWrap.className = "liwkv at2zb yymkp c4t4j";
        priceWrap.textContent = nextPrice;
      }
    }

    card.dataset.productId = product?._id || product?.slug?.current || `listing-product-${index}`;
    card.dataset.productTitle = productTitle;
    card.dataset.productHref = productHref;
    card.dataset.productImage = productImage;
    card.dataset.productPrice = String(product?.price ?? 0);
    card.dataset.productCategory = productCategory;
  });

  if (countNode && typeof totalCount === "number" && !Number.isNaN(totalCount)) {
    countNode.textContent = `${totalCount} Items`;
  }
}

async function hydrateListingPageFromSanity() {
  try {
    const cards = getProductCards();
    const limit = cards.length;

    const [categories, listingResponse] = await Promise.all([
      sanityService.getCategories(),
      categorySlug
        ? sanityService.getProductsByCategory(categorySlug, limit, 0)
        : sanityService.getProducts(limit, 0).then((data) => ({
            data,
            total: Array.isArray(data) ? data.length : 0,
          })),
    ]);

    if (Array.isArray(categories) && categories.length > 0) {
      applyCategoryCards(categories);
    }

    const products = Array.isArray(listingResponse?.data)
      ? listingResponse.data
      : Array.isArray(listingResponse)
        ? listingResponse
        : [];

    if (products.length > 0) {
      applyProductCards(products, listingResponse?.total ?? products.length);
      hydrateProductDataAttributes(document);
      bindFavoriteToggles(document);
      bindAddToCartButtons(document);
    }
  } catch (error) {
    console.warn("Unable to hydrate Product Listing page from Sanity.", error);
  }
}

hydrateListingPageFromSanity();

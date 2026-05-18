import {
  fetchProductRuntimeByIds,
  mergeProductWithRuntime,
  PRODUCT_RUNTIME_TABLE,
} from "@siggistore/services/admin";
import { fetchSanityProducts } from "@siggistore/services/admin/sanity-service.js";

function buildRuntimeLookupKey(product) {
  return [product.id, product.slug, product.sku]
    .filter(Boolean)
    .map(String);
}

function findProductIndex(products, lookupValue) {
  if (!lookupValue) return -1;

  return products.findIndex((product) => {
    return (
      String(product.slug) === lookupValue ||
      String(product.id) === lookupValue ||
      String(product.sku) === lookupValue
    );
  });
}

function updateSelectValue(select, value) {
  if (!select || !value) return;

  const normalizedValue = String(value);
  const options = Array.from(select.options);
  const existing = options.find((option) => option.value === normalizedValue || option.text === normalizedValue);

  if (!existing) {
    const option = document.createElement("option");
    option.value = normalizedValue;
    option.text = normalizedValue;
    select.appendChild(option);
    select.value = normalizedValue;
  } else {
    select.value = existing.value || normalizedValue;
  }
}

function wireNavigation(button, product) {
  if (!button) return;

  if (!product) {
    button.disabled = true;
    return;
  }

  button.disabled = false;
  button.addEventListener("click", () => {
    const target = `./product-details.html?product=${encodeURIComponent(product.slug || product.id)}`;
    window.location.href = target;
  });
}

async function initProductDetailsPage() {
  const params = new URLSearchParams(window.location.search);
  const productKey = params.get("product");

  const titleNode = document.getElementById("product-details-title");
  const breadcrumbLink = document.getElementById("product-details-breadcrumb-link");
  const prevButton = document.getElementById("product-details-prev");
  const nextButton = document.getElementById("product-details-next");
  const availabilityInput = document.getElementById("hs-pro-epdas");
  const categorySelect = document.getElementById("product-details-category");
  const tagsInput = document.getElementById("hs-pro-dauftg");

  if (!titleNode || !breadcrumbLink || !prevButton || !nextButton) return;

  try {
    const products = await fetchSanityProducts({ limit: 100 });
    const runtimeIds = [...new Set(products.flatMap((product) => buildRuntimeLookupKey(product)))];

    let runtimeRows = [];
    try {
      runtimeRows = await fetchProductRuntimeByIds(runtimeIds, {
        table: PRODUCT_RUNTIME_TABLE,
      });
    } catch (runtimeError) {
      console.warn("Supabase runtime unavailable for product details page", runtimeError);
    }

    const runtimeMap = new Map();
    runtimeRows.forEach((runtime) => {
      [runtime.sanity_product_id, runtime.product_id, runtime.slug, runtime.sku]
        .filter(Boolean)
        .forEach((key) => {
          runtimeMap.set(String(key), runtime);
        });
    });

    const mergedProducts = products.map((product) => {
      const runtime = buildRuntimeLookupKey(product)
        .map((key) => runtimeMap.get(String(key)))
        .find(Boolean);
      return mergeProductWithRuntime(product, runtime);
    });

    const matchedIndex = findProductIndex(mergedProducts, productKey);
    const currentIndex = matchedIndex >= 0 ? matchedIndex : 0;
    const currentProduct = mergedProducts[currentIndex];

    if (!currentProduct) return;

    titleNode.textContent = currentProduct.name;
    breadcrumbLink.textContent = currentProduct.name;
    breadcrumbLink.href = `./product-details.html?product=${encodeURIComponent(
      currentProduct.slug || currentProduct.id,
    )}`;
    document.title = `${currentProduct.name} | Product Details`;

    if (availabilityInput) {
      availabilityInput.checked = Boolean(currentProduct.isAvailable);
    }

    updateSelectValue(categorySelect, currentProduct.category || "Uncategorized");

    if (tagsInput) {
      const channels = Array.isArray(currentProduct.channels) ? currentProduct.channels : [];
      tagsInput.value = channels.join(", ");
    }

    const colorInputs = Array.from(document.querySelectorAll('input[id^="hs-pro-epdvtc"]'));
    colorInputs.forEach((input) => {
      if (!input.value) input.value = currentProduct.category || "Default";
    });

    wireNavigation(prevButton, mergedProducts[currentIndex - 1] || null);
    wireNavigation(nextButton, mergedProducts[currentIndex + 1] || null);

    window.HSStaticMethods?.autoInit?.();
  } catch (error) {
    console.error("Failed to load product details", error);
  }
}

initProductDetailsPage();

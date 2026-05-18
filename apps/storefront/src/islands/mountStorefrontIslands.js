import { createElement } from "react";
import { createRoot } from "react-dom/client";
import HomepageCategoriesIsland from "./HomepageCategoriesIsland.jsx";
import HomepageProductGridIsland from "./HomepageProductGridIsland.jsx";

const islandRegistry = {
  "homepage-categories": HomepageCategoriesIsland,
  "homepage-product-grid": HomepageProductGridIsland,
};

export function mountStorefrontIslands(scope = document) {
  const mounts = [];

  scope.querySelectorAll("[data-storefront-island]").forEach((node) => {
    const islandName = node.getAttribute("data-storefront-island");
    const IslandComponent = islandRegistry[islandName];

    if (!IslandComponent || node.dataset.islandMounted === "true") return;

    const root = createRoot(node);
    root.render(createElement(IslandComponent));
    node.dataset.islandMounted = "true";

    mounts.push(() => {
      root.unmount();
      delete node.dataset.islandMounted;
    });
  });

  return () => {
    mounts.forEach((unmount) => unmount());
  };
}

(function () {
  if (window.__storefrontLayoutLoaderLoaded) {
    return;
  }
  window.__storefrontLayoutLoaderLoaded = true;

  async function loadFragment(path, selector) {
    const response = await fetch(path, { credentials: "same-origin" });
    if (!response.ok) {
      throw new Error("Unable to load " + path + ": " + response.status);
    }

    const html = await response.text();
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.querySelector(selector);
  }

  async function injectLayout() {
    const main = document.querySelector("main");
    if (!main) return;

    try {
      if (!document.querySelector("header")) {
        const header = await loadFragment("/header.html", "header");
        if (header) {
          main.insertAdjacentElement("beforebegin", header);
        }
      }

      const footer = await loadFragment("/footer.html", "footer");
      const existingFooter = document.querySelector("footer");
      if (footer && existingFooter) {
        existingFooter.replaceWith(footer);
      } else if (footer && !existingFooter) {
        main.insertAdjacentElement("afterend", footer);
      }
    } catch (error) {
      console.warn("Layout injection failed.", error);
    } finally {
      window.dispatchEvent(new CustomEvent("storefront:layout-ready"));
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", injectLayout, { once: true });
  } else {
    injectLayout();
  }
})();

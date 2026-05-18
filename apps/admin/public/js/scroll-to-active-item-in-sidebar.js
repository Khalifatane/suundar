const sidebarId =
  window?.HS_SCROLL_TO_THE_ELEMENT_SIDEBAR_ID ?? "#docs-sidebar";
const sidebarNavId =
  window?.HS_SCROLL_TO_THE_ELEMENT_SIDEBAR_NAV_ID ?? "#docs-sidebar-nav";
const urlChunk = window?.HS_SCROLL_TO_THE_ELEMENT_URL_CHUNK ?? "plugins/html";
const delay = window?.HS_SCROLL_TO_THE_ELEMENT_DELAY ?? null;

const secondarySidebarId = 
  window?.HS_SCROLL_TO_THE_ELEMENT_SECONDARY_SIDEBAR_ID ?? "#docs-on-this-page-sidebar";
const secondarySidebarNavElement =
  window?.HS_SCROLL_TO_THE_ELEMENT_SECONDARY_SIDEBAR_NAV_ELEMENT ?? "[data-hs-docs-scrollspy-wrapper]";

function scrollToTheElement(
  element,
  container,
  compensation = 0,
  offsetTop = 0,
  isSmooth = true
) {
  const containerTop = container.scrollTop;
  const elemTop = element?.offsetTop ?? 0;
  const padding = window
    .getComputedStyle(document.querySelector(sidebarNavId), null)
    .getPropertyValue("padding");
  const paddingsToArray = padding.split(" ");
  const paddingsValues = paddingsToArray.map((item) => parseInt(item));

  if (
    container.offsetHeight >
    elemTop + (paddingsValues[0] || 0) + (paddingsValues[2] || 0) + offsetTop
  )
    return false;

  if (isSmooth)
    container.scrollTo({
      top: -(containerTop - elemTop + compensation),
      behavior: "smooth",
    });
  else container.scrollTop -= containerTop - elemTop + compensation;
}

window.addEventListener("load", () => {
  (function () {
    function init() {
      const sidebar = document.querySelector(sidebarId);
      const sidebarNav = document.querySelector(sidebarNavId) ?? null;

      if (!sidebarNav) return false;

      const url =
        window.HS_DOCS_SIDEBAR_ACTIVE_LINK ||
        window.location.pathname.substring(
          window.location.pathname.lastIndexOf("/") + 1
        );
      const activeLink =
        sidebarNav.querySelector(`a[href*="/${url}"]`) ||
        sidebarNav.querySelector(`a[href*="${url}"]`) ||
        null;
      const elementToScrollTo = window.location.pathname.includes(urlChunk)
        ? sidebarNav
        : sidebar;

      if (!activeLink) return false;

      scrollToTheElement(activeLink, elementToScrollTo, 20, 50);

      // Mobile
      setTimeout(() => {
        HSOverlay.on("open", document.querySelector(sidebarId), () => {
          if (sidebar.hasAttribute("data-opened-once")) return false;
          sidebar.setAttribute("data-opened-once", "");

          scrollToTheElement(activeLink, elementToScrollTo, 20, 50);
        });
      });
    }

    if (delay) setTimeout(init, delay);
    else init();
  })();
  
  (function () {
    function init() {
      const secondarySidebar = document.querySelector(secondarySidebarId);
      const secondarySidebarNav = secondarySidebar?.querySelector(secondarySidebarNavElement) ?? null;

      if (!secondarySidebarNav) return false;

      const url = window.location.pathname.substring(window.location.pathname.lastIndexOf("/") + 1) || window.HS_DOCS_SECONDARY_SIDEBAR_ACTIVE_LINK;
      const activeLink =
        secondarySidebarNav.querySelector(`a[href*="/${url}"]`) ||
        secondarySidebarNav.querySelector(`a[href*="${url}"]`) ||
        null;
      
      scrollToTheElement(activeLink, secondarySidebarNav, 20, 50);
    }

    if (delay) setTimeout(init, delay);
    else init();
  })();
});

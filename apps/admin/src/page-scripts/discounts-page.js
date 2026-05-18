import { fetchDiscounts } from "@siggistore/services/admin";
import { subscribeToDiscounts } from "@siggistore/services/admin/realtime.js";
import { createTableUrlState } from "@siggistore/services/admin/table-state.js";

const PAGE_SIZE = 10;
const tableState = createTableUrlState({
  defaultPage: 1,
  defaultPageSize: PAGE_SIZE,
});

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function getDiscountStatusMeta(rawStatus) {
  const status = String(rawStatus ?? "draft").toLowerCase();

  if (status === "active") {
    return {
      label: "Active",
      className:
        "k85d4 o8oua inline-flex items-center i220p m859b at2zb qn8tw k73c1 nj29a dark:bg-green-500/10 dark:text-green-500",
      icon: '<path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><path d="m9 12 2 2 4-4"></path>',
    };
  }

  if (status === "expired") {
    return {
      label: "Expired",
      className:
        "k85d4 o8oua inline-flex items-center i220p m859b at2zb olwac oz3g9 nj29a dark:bg-red-500/10 dark:text-red-500",
      icon: '<circle cx="12" cy="12" r="10"></circle><path d="m15 9-6 6"></path><path d="m9 9 6 6"></path>',
    };
  }

  return {
    label: "Draft",
    className:
      "k85d4 o8oua inline-flex items-center i220p m859b at2zb nck10 h3ns9 nj29a",
    icon: '<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path><path d="m15 5 4 4"></path>',
  };
}

function formatDiscountValue(discount) {
  const rawValue = discount.value ?? discount.amount ?? 0;
  const value = Number(rawValue);
  const safeValue = Number.isFinite(value) ? value : 0;
  const type = String(discount.type ?? "").toLowerCase();

  if (type.includes("percent")) return `${safeValue}%`;
  if (safeValue === 0 && discount.value == null && discount.amount == null) return "N/A";
  return `$${safeValue}`;
}

function buildEmptyRow(message, colspan = 8) {
  return `
    <tr>
      <td colspan="${colspan}" class="cti9j edpyz yymkp f1ztf c4t4j">
        ${escapeHtml(message)}
      </td>
    </tr>
  `;
}

function buildDiscountRow(discount) {
  const status = getDiscountStatusMeta(discount.status);
  const codeId = `discount-code-${String(discount.id ?? discount.code ?? Math.random()).replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const scope = discount.scope || discount.applies_to || "All products";
  const usageCount = discount.usage_count ?? discount.uses ?? 0;

  return `
    <tr>
      <td class="gmilb offh6 aimp4 xxt8a">
        <input type="checkbox" class="y6rh0 x215h robkw fsj2t ftf66 cirj5 s7mjk jw8en qgcqn checked:bg-primary-checked checked:border-primary-checked disabled:opacity-50 disabled:pointer-events-none">
      </td>
      <td class="gmilb offh6 cti9j dg39k">
        <span class="yymkp at2zb c4t4j">${escapeHtml(discount.name || discount.title || "Untitled discount")}</span>
      </td>
      <td class="gmilb offh6 cti9j dg39k">
        <span class="js-clipboard [--is-toggle-tooltip:false] hs-tooltip ltybu nck10 h3ns9 m859b y9dku cursor-pointer" data-clipboard-target="#${codeId}" data-clipboard-action="copy" data-clipboard-success-text="Copied">
          <span id="${codeId}" class="knnc2">${escapeHtml(discount.code || "no-code")}</span>
          <span class="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 xsbp2 hidden l2ewm nnhrf dg39k o8oua n7c39 mak94 sgbfs m859b at2zb hq333 edpyz cirj5" role="tooltip">
            <span class="js-clipboard-success-text">Copy</span>
          </span>
        </span>
      </td>
      <td class="gmilb offh6 cti9j dg39k">
        <span class="${status.className}">
          <svg class="y6rh0 xqxx6" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            ${status.icon}
          </svg>
          ${escapeHtml(status.label)}
        </span>
      </td>
      <td class="gmilb offh6 cti9j dg39k">
        <span class="yymkp mnod2">${escapeHtml(scope)}</span>
      </td>
      <td class="gmilb offh6 cti9j dg39k">
        <span class="yymkp mnod2">${escapeHtml(formatDiscountValue(discount))}</span>
      </td>
      <td class="gmilb offh6 cti9j dg39k qk13w">
        <span class="yymkp mnod2">${escapeHtml(String(usageCount))}</span>
      </td>
      <td class="stpxn witespace-nowrap cti9j dg39k qk13w">
        <div class="hs-dropdown [--auto-close:inside] [--placement:bottom-right] relative inline-flex">
          <button type="button" class="mxukx inline-flex lp3ls items-center my9gz edpyz s6i1l mak94 x3ljb k0ser cirj5 dduyg disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden usqtq" aria-haspopup="menu" aria-expanded="false" aria-label="Dropdown">
            <svg class="y6rh0 xqxx6" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="1"></circle>
              <circle cx="12" cy="5" r="1"></circle>
              <circle cx="12" cy="19" r="1"></circle>
            </svg>
          </button>
          <div class="hs-dropdown-menu hs-dropdown-open:opacity-100 mvv53 transition-[opacity,margin] duration opacity-0 hidden nnhrf khfq6 mak94 ocfsa ictpa p6d5j" role="menu" aria-orientation="vertical" tabindex="-1">
            <div class="i0yn8">
              <button type="button" class="w-full flex items-center h7z6o k85d4 o8oua edpyz text-[13px] j6b7h ibg9k disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden mhymu">
                Edit
              </button>
            </div>
          </div>
        </div>
      </td>
    </tr>
  `;
}

async function initDiscountsPage() {
  const tableBody = document.querySelector("tbody.divide-y.divide-table-line");
  const searchInput = document.querySelector('input[placeholder="Search discounts"]');
  const pagination = document.querySelector('nav[aria-label="Pagination"]');
  const footer = pagination?.closest("div.flex.flex-wrap.g86xu.items-center.osjzw");
  const count = footer?.querySelector("p .at2zb");
  const previousButton = pagination?.querySelector('button[aria-label="Previous"]');
  const nextButton = pagination?.querySelector('button[aria-label="Next"]');
  const pageIndicators = pagination?.querySelectorAll("span");

  if (!tableBody || !searchInput || !count || !pagination || !previousButton || !nextButton || !pageIndicators?.length) {
    return;
  }

  let isRendering = false;
  let queuedRender = false;

  async function render() {
    if (isRendering) {
      queuedRender = true;
      return;
    }

    isRendering = true;

    try {
      const state = tableState.getState();
      const query = state.query || state.filter || "";
      const pageSize = Number(state.pageSize || PAGE_SIZE);
      const page = Number(state.page || 1);
      searchInput.value = query;

      const discounts = await fetchDiscounts({
        limit: 100,
        query,
      });

      const totalResults = discounts.length;
      const totalPages = Math.max(1, Math.ceil(totalResults / pageSize));
      const safePage = Math.min(Math.max(page, 1), totalPages);

      if (safePage !== page) {
        tableState.setPage(safePage);
        return;
      }

      const start = (safePage - 1) * pageSize;
      const pageDiscounts = discounts.slice(start, start + pageSize);

      count.textContent = String(totalResults);
      pageIndicators[0].textContent = String(safePage);
      pageIndicators[2].textContent = String(totalPages);
      previousButton.disabled = safePage <= 1;
      nextButton.disabled = safePage >= totalPages;

      if (!pageDiscounts.length) {
        tableBody.innerHTML = buildEmptyRow(
          query
            ? "No discounts match your current search."
            : "No discounts found yet.",
        );
      } else {
        tableBody.innerHTML = pageDiscounts.map(buildDiscountRow).join("");
      }

      window.HSStaticMethods?.autoInit?.();
    } catch (error) {
      console.error("Failed to render discounts page", error);
      tableBody.innerHTML = buildEmptyRow(
        error?.message || "Unable to load discounts right now.",
      );
      count.textContent = "0";
    } finally {
      isRendering = false;
      if (queuedRender) {
        queuedRender = false;
        render();
      }
    }
  }

  searchInput.addEventListener("input", (event) => {
    tableState.setQuery(event.currentTarget.value.trim());
    tableState.setPage(1);
    render();
  });

  previousButton.addEventListener("click", () => {
    const state = tableState.getState();
    if ((state.page || 1) <= 1) return;
    tableState.setPage((state.page || 1) - 1);
    render();
  });

  nextButton.addEventListener("click", () => {
    const state = tableState.getState();
    tableState.setPage((state.page || 1) + 1);
    render();
  });

  const unsubscribe = subscribeToDiscounts(() => {
    render();
  });

  window.addEventListener("beforeunload", () => {
    unsubscribe?.();
  });

  await render();
}

initDiscountsPage();

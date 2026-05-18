function getCookieAccordingToSection() {
  return localStorage.getItem("hs_theme");
}

function toggleThemeClass(theme, el) {
  if (theme === "dark") el.classList.add("dark");
  else el.classList.remove("dark");
}

function toggleThemeStyle(theme, target, el, btnIcons, colorTheme) {
  if (colorTheme) target.dataset.theme = `theme-${colorTheme}`;

  if (theme === "dark") {
    // if (colorTheme) target.dataset.theme = `theme-${colorTheme}`;
    target.classList.add("dark");
    if (btnIcons[0]) btnIcons[0].classList.remove("hidden");
    if (btnIcons[1]) btnIcons[1].classList.add("hidden");
    el.classList.add("opacity-50", "pointer-events-none");
  } else {
    // if (colorTheme) delete target.dataset.theme;
    target.classList.remove("dark");
    if (btnIcons[0]) btnIcons[0].classList.add("hidden");
    if (btnIcons[1]) btnIcons[1].classList.remove("hidden");
    el.classList.remove("opacity-50", "pointer-events-none");
  }
}

function setTheme(evt) {
  const themeToggles = document.querySelectorAll(
    "[data-hs-component-dark-mode]"
  );

  themeToggles.forEach((el) => {
    const attr = el.getAttribute("data-hs-component-dark-mode");
    const target = attr
      ? document.querySelector(attr)
      : null;
    const colorThemeSelector = document.querySelector(`[data-hs-component-color-theme="${attr}"]`);
    let colorTheme = null;
    if (colorThemeSelector) colorTheme = colorThemeSelector.value;

    if (target) {
      const btnIcons = el.querySelectorAll("[data-svg]");

      toggleThemeStyle(evt.detail, target, el, btnIcons, colorTheme);

      if (target.querySelector("iframe")) {
        toggleThemeClass(
          evt.detail,
          target.querySelector("iframe").contentWindow.document.documentElement
        );
      }
    } else if (el.tagName.toLowerCase() === "iframe") {
      toggleThemeClass(evt.detail, el.contentWindow.document.documentElement);
    } else {
      return false;
    }
  });
}

window.addEventListener("load", () => {
  setTheme({ detail: getCookieAccordingToSection() });
});

document.addEventListener("click", (evt) => {
  const toggle = evt.target.closest("[data-hs-component-dark-mode]");

  if (!toggle) return;

  const id = toggle.getAttribute("data-hs-component-dark-mode");
  const target = document.querySelector(id);
  const colorThemeSelector = document.querySelector(`[data-hs-component-color-theme="${id}"]`);
  let colorTheme = null;
  if (colorThemeSelector) colorTheme = colorThemeSelector.value;

  if (!target || getCookieAccordingToSection() === "dark") return;

  const btnIcons = toggle.querySelectorAll("[data-svg]");

  btnIcons.forEach((icon) => icon.classList.toggle("hidden"));

  // Toggle "dark" class
  target.classList.toggle("dark");

  // Toggle "data-theme"
  // if (colorTheme && target.classList.contains('dark')) target.dataset.theme = `theme-${colorTheme}`;
  // else delete target.dataset.theme;

  target.dataset.theme = `theme-${colorTheme}`;

  if (target.querySelector("iframe")) {
    const iframe = target.querySelector("iframe");
    const html = iframe.contentWindow.document.documentElement;

    html.classList.toggle("dark");

    try {
      iframe.contentWindow.dispatchEvent(
        new CustomEvent("on-hs-appearance-change", {
          detail: target.classList.contains("dark") ? "dark" : "light",
        })
      );
    } catch (e) {
      console.warn("Could not dispatch event to iframe:", e);
    }
  }

  target.dispatchEvent(
    new CustomEvent("on-hs-appearance-change", {
      detail: target.classList.contains("dark") ? "dark" : "light",
    })
  );
});

window.addEventListener("on-hs-appearance-change", (evt) => {
  setTheme(evt);

  const themeToggles = document.querySelectorAll(
    "[data-hs-component-dark-mode]"
  );

  themeToggles.forEach((el) => {
    const attr = el.getAttribute("data-hs-component-dark-mode");
    const target = attr
      ? document.querySelector(el.getAttribute("data-hs-component-dark-mode"))
      : null;

    if (target) {
      if (target.querySelector("iframe")) {
        const iframe = target.querySelector("iframe");

        try {
          iframe.contentWindow.dispatchEvent(
            new CustomEvent("on-hs-appearance-change", {
              detail: evt.detail,
            })
          );
        } catch (e) {
          console.warn("Could not dispatch event to iframe:", e);
        }
      }
    } else if (el.tagName.toLowerCase() === "iframe") {
      try {
        el.contentWindow.dispatchEvent(
          new CustomEvent("on-hs-appearance-change", {
            detail: evt.detail,
          })
        );
      } catch (e) {
        console.warn("Could not dispatch event to iframe:", e);
      }
    }
  });
});

window.addEventListener("on-hs-color-theme-change", (evt) => {
  const elements = document.querySelectorAll("[data-hs-component-dark-mode]");

  elements.forEach((el) => {
    const targetSelector = el.getAttribute("data-hs-component-dark-mode");
    const colorThemeSelector = document.querySelector(`[data-hs-component-color-theme="${targetSelector}"]`);
    let colorTheme = null;
    if (colorThemeSelector) colorTheme = colorThemeSelector.value;

    if (el.tagName.toLowerCase() === "iframe") {
      try {
        el.contentWindow.dispatchEvent(
          new CustomEvent("on-hs-color-theme-change", {
            detail: evt.detail,
          })
        );
      } catch (e) {
        console.warn("Could not dispatch event to iframe:", e);
      }
    } else if (targetSelector) {
      const target = document.querySelector(targetSelector);

      // if (colorTheme && target.classList.contains('dark')) target.dataset.theme = `theme-${colorTheme}`;
      // else delete target.dataset.theme;

      target.dataset.theme = `theme-${colorTheme}`;

      if (target) {
        const iframes = target.querySelectorAll("iframe");

        iframes.forEach((iframe) => {
          try {
            iframe.contentWindow.dispatchEvent(
              new CustomEvent("on-hs-color-theme-change", {
                detail: evt.detail,
              })
            );
          } catch (e) {
            console.warn("Could not dispatch event to iframe:", e);
          }
        });
      }
    }
  });
});

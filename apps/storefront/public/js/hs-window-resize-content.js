const resizeEls = document.querySelectorAll(".js-resize");

const onMuseDrag = (e) => {
  const $containerEl = e.target.closest(".min-w-full");
  const $resizerEl = e.target.closest(".js-resize");
  const boundingContaier = $containerEl.getBoundingClientRect();
  const maxWidth = $containerEl.parentElement.offsetWidth;
  const minWidth = 392;
  const $overlay = $resizerEl.previousElementSibling;

  $overlay.classList.remove("hidden");

  const resizerDrag = (e) => {
    e.preventDefault();
    const pos = (e.clientX || e.touches[0].clientX) - boundingContaier.x - 8;
    if (pos > maxWidth || pos < minWidth) return;
    $containerEl.style.width = `${pos + 20}px`;
  };

  const stopMouseDrag = () => {
    $overlay.classList.add("hidden");
    document.removeEventListener("touchend", stopMouseDrag);
    document.removeEventListener("touchmove", resizerDrag);

    document.removeEventListener("mouseup", stopMouseDrag);
    document.removeEventListener("mousemove", resizerDrag);
  };

  document.addEventListener("touchend", stopMouseDrag);
  document.addEventListener("touchmove", resizerDrag);

  document.addEventListener("mouseup", stopMouseDrag);
  document.addEventListener("mousemove", resizerDrag);
};

const onResize = () => {
  resizeEls.forEach(($resizeEl) => {
    const $iframeEl = $resizeEl.nextElementSibling;
    $iframeEl.style.height = `${$iframeEl.contentWindow.document.body.scrollHeight}px`;
  });
};

window.addEventListener("resize", onResize);

resizeEls.forEach(($resizeEl) => {
  $resizeEl.addEventListener("touchstart", onMuseDrag);
  $resizeEl.addEventListener("mousedown", onMuseDrag);
});

resizeEls.forEach(($resizeEl) => {
  const $iframeEl = $resizeEl.nextElementSibling;

  if ($iframeEl.tagName.toLowerCase() !== "iframe") return false;

  $iframeEl.addEventListener("load", () => {
    $iframeEl.style.height = `${$iframeEl.contentWindow.document.body.scrollHeight}px`;
  });

  $iframeEl.contentWindow.addEventListener("resize", () => {
    $iframeEl.style.height = `${$iframeEl.contentWindow.document.body.scrollHeight}px`;
  });
});

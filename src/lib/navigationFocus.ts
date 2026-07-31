const PROGRAMMATICALLY_FOCUSABLE_SELECTOR = [
  "a[href]",
  "area[href]",
  "button:not([disabled])",
  'input:not([disabled]):not([type="hidden"])',
  "select:not([disabled])",
  "textarea:not([disabled])",
  "iframe",
  "object",
  "embed",
  "audio[controls]",
  "video[controls]",
  "summary",
  '[contenteditable="true"]',
  "[tabindex]",
].join(",");

export function focusElement(element: HTMLElement): void {
  const addedTabIndex = !element.matches(PROGRAMMATICALLY_FOCUSABLE_SELECTOR);

  if (addedTabIndex) element.setAttribute("tabindex", "-1");
  element.focus({ preventScroll: true });

  if (!addedTabIndex) return;

  element.addEventListener(
    "blur",
    () => {
      if (element.getAttribute("tabindex") === "-1") {
        element.removeAttribute("tabindex");
      }
    },
    { once: true },
  );
}

export function getHashTarget(hash: string): HTMLElement | null {
  const rawId = hash.startsWith("#") ? hash.slice(1) : hash;
  if (rawId === "") return null;

  try {
    return document.getElementById(decodeURIComponent(rawId));
  } catch {
    return document.getElementById(rawId);
  }
}

export function userPrefersReducedMotion(): boolean {
  return (
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

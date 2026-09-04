/**
 * HTML Sanitizer to prevent XSS attacks when rendering HTML content
 */
export function sanitizeHtml(dirty) {
  if (!dirty || typeof dirty !== "string") return "";

  // If running in browser environment with DOMParser
  if (typeof window !== "undefined" && typeof DOMParser !== "undefined") {
    const parser = new DOMParser();
    const doc = parser.parseFromString(dirty, "text/html");

    // Remove dangerous elements
    const dangerousTags = ["script", "iframe", "object", "embed", "link", "style", "form", "base"];
    dangerousTags.forEach((tag) => {
      const elements = doc.querySelectorAll(tag);
      elements.forEach((el) => el.remove());
    });

    // Remove inline event handlers (on*) and javascript: / data: pseudo-protocols
    const allElements = doc.querySelectorAll("*");
    allElements.forEach((el) => {
      // Remove all on* attributes
      for (let i = el.attributes.length - 1; i >= 0; i--) {
        const attrName = el.attributes[i].name;
        if (attrName.startsWith("on") || attrName.toLowerCase().startsWith("on")) {
          el.removeAttribute(attrName);
        }
      }

      // Check href, src, formaction for javascript:
      ["href", "src", "action", "formaction"].forEach((attr) => {
        const val = el.getAttribute(attr);
        if (val && (val.trim().toLowerCase().startsWith("javascript:") || val.trim().toLowerCase().startsWith("vbscript:"))) {
          el.removeAttribute(attr);
        }
      });
    });

    return doc.body.innerHTML;
  }

  // Fallback for SSR
  return dirty
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/\son\w+\s*=\s*(['"]).*?\1/gi, "")
    .replace(/\son\w+\s*=\s*[^\s>]+/gi, "")
    .replace(/javascript:/gi, "");
}

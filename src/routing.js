const views = new Set([
  "website",
  "credits",
  "product",
  "catalog",
  "overview",
  "orders",
  "quotes",
  "suppliers",
  "inventory",
  "shop",
  "messages",
  "addresses",
  "admin",
]);
export function readRoute(current = window.location) {
  if (["/credits", "/credits/", "/credits.html"].includes(current.pathname))
    return { view: "credits", productId: "" };
  const query = new URLSearchParams(current.search);
  let productId = query.get("product") || "";
  if (!productId && current.pathname.startsWith("/products/")) {
    try {
      productId = decodeURIComponent(
        current.pathname.slice("/products/".length),
      ).replace(/\/$/, "");
    } catch {
      productId = "";
    }
  }
  const requested =
    query.get("view") ||
    (current.pathname.startsWith("/products/") ? "product" : "website");
  return { view: views.has(requested) ? requested : "website", productId };
}

import siteImages from "./site-images.json";
import { useEffect } from "react";
const origin = "https://flavor-voyage.netlify.app";
export function usePageMetadata(view, product, loading) {
  useEffect(() => {
    if (view === "product" && loading && !product) return;
    const publicPage =
      ["website", "credits"].includes(view) || (view === "product" && product);
    const title =
      product && view === "product"
        ? `${product.name} — packs & dealers | FlavorVoyage`
        : view === "website"
          ? "FlavorVoyage — Discover drinks & local dealers in Bangladesh"
          : view === "credits"
            ? "Image credits | FlavorVoyage"
            : "Your workspace | FlavorVoyage";
    const description =
      product && view === "product"
        ? product.description
        : "Discover drinks sold in Bangladesh. Compare packs, find local dealers and manage your beverage restock.";
    const url =
      product && view === "product"
        ? `${origin}/products/${encodeURIComponent(product.id)}`
        : view === "credits"
          ? `${origin}/credits`
          : `${origin}/`;
    document.title = title;
    function meta(selector, attributes, content) {
      let element = document.head.querySelector(selector);
      if (!element) {
        element = document.createElement("meta");
        for (const [key, value] of Object.entries(attributes))
          element.setAttribute(key, value);
        document.head.append(element);
      }
      element.setAttribute("content", content);
    }
    meta('meta[name="description"]', { name: "description" }, description);
    meta(
      'meta[name="robots"]',
      { name: "robots" },
      publicPage ? "index,follow" : "noindex,nofollow",
    );
    for (const [key, value] of Object.entries({ title, description, url }))
      meta(`meta[property="og:${key}"]`, { property: `og:${key}` }, value);
    meta(
      'meta[property="og:image"]',
      { property: "og:image" },
      product && view === "product"
        ? product.image?.startsWith("/")
          ? origin + product.image
          : product.image
        : siteImages["/images/stories/refresh.jpg"],
    );
    const canonical = document.head.querySelector('link[rel="canonical"]');
    if (canonical) canonical.href = url;
    let schema = document.getElementById("product-schema");
    if (product && view === "product") {
      if (!schema) {
        schema = document.createElement("script");
        schema.id = "product-schema";
        schema.type = "application/ld+json";
        document.head.append(schema);
      }
      schema.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        description: product.description,
        brand: { "@type": "Brand", name: product.brand },
        image: product.image?.startsWith("/")
          ? origin + product.image
          : product.image,
      });
    } else schema?.remove();
  }, [view, product, loading]);
}

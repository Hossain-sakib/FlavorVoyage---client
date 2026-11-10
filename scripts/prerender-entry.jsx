import { renderToString } from "react-dom/server";
import Website from "../src/Website.jsx";
import ProductPage from "../src/ProductPage.jsx";
import { readFileSync } from "node:fs";
const snapshot = JSON.parse(readFileSync(".cache/catalog.json", "utf8"));
const products = snapshot.products;
const dealers = snapshot.dealers;
const noop = () => {};
export const pages = [
  {
    path: "/",
    title: "FlavorVoyage — Discover drinks & local dealers in Bangladesh",
    description:
      "Explore drinks sold in Bangladesh. Compare pack sizes, discover real brands, find nearby dealers and manage your beverage restock.",
    html: renderToString(
      <Website
        products={products}
        dealers={dealers}
        cartCount={0}
        loading={false}
        siteContent={{}}
        onRetry={noop}
        onCart={noop}
        onProduct={noop}
        onMarketplace={noop}
        onDealers={noop}
        onAccount={noop}
        onSupplier={noop}
      />,
    ),
  },
  ...products
    .filter((p) => !p.catalogOnly)
    .map((product) => ({
      path: `/products/${product.id}`,
      title: `${product.name} — packs & dealer listings | FlavorVoyage`,
      description: `Explore ${product.name} from ${product.brand}. Compare ${product.servingSize || product.pack} packs, dealer availability and product information in Bangladesh.`,
      html: renderToString(
        <ProductPage
          product={product}
          products={products}
          loading={false}
          onRetry={noop}
          onHome={noop}
          onCart={noop}
          onBuy={noop}
          onMessage={noop}
          onAccount={noop}
          onProduct={noop}
        />,
      ),
      image: product.image.startsWith("/")
        ? `https://flavor-voyage.netlify.app${product.image}`
        : product.image,
      schema: {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        description: product.description,
        image: product.image.startsWith("/")
          ? `https://flavor-voyage.netlify.app${product.image}`
          : product.image,
        brand: { "@type": "Brand", name: product.brand },
      },
    })),
];

import { classes } from "./ui/classes";
import { useState } from "react";
import PropTypes from "prop-types";
import BrandLogo from "./BrandLogo";
import Reviews from "./Reviews";
import RecentProducts from "./RecentProducts";
import DrinkImage from "./DrinkImage";
import DealerFinder from "./DealerFinder";
import { money } from "./marketApi";
export default function ProductPage({
  product,
  products,
  loading,
  error,
  onRetry,
  onHome,
  onCart,
  onBuy,
  onMessage,
  user,
  onAccount,
  onProduct,
}) {
  const [variant, setVariant] = useState(null);
  const family = product?.familyId || product?.id;
  const listings = products.filter((p) => (p.familyId || p.id) === family);
  const keys = [
    ...new Set(listings.map((p) => p.variantKey || p.servingSize || p.pack)),
  ];
  const selected = keys.includes(variant)
    ? variant
    : product?.variantKey || product?.servingSize || product?.pack;
  const offers = listings.filter(
    (p) => (p.variantKey || p.servingSize || p.pack) === selected,
  );
  const packPhoto = offers[0] || product;
  const available = offers.filter((p) => p.stock >= p.moq);
  const minimum = Math.min(
    ...(available.length ? available : offers).map((p) => p.price),
  );
  return (
    <div className={classes("fv-website detail-page")}>
      <header className={classes("detail-header")}>
        <button
          className={classes("logo-home")}
          aria-label="FlavorVoyage home"
          onClick={onHome}
        >
          <BrandLogo />
        </button>
        <button className={classes("button secondary")} onClick={onCart}>
          Your order
        </button>
      </header>
      <main className={classes("detail-main")}>
        <button className={classes("text-button")} onClick={onHome}>
          ← Back to drinks
        </button>
        {loading ? (
          <p role="status">Loading product…</p>
        ) : !product ? (
          <div className={classes("empty-state")}>
            <h1>Product unavailable</h1>
            <p>
              {error ||
                "This listing may have been removed. Browse the current drinks collection."}
            </p>
            {error && (
              <button className={classes("button")} onClick={onRetry}>
                Retry
              </button>
            )}
          </div>
        ) : (
          <>
            <section className={classes("product-detail-layout")}>
              <div className={classes("detail-image")}>
                <DrinkImage
                  image={packPhoto.image}
                  type={packPhoto.illustration}
                  name={product.name}
                />
                <span>Product range photo · packaging and size may vary</span>
              </div>
              <div className={classes("detail-copy")}>
                <span className={classes("fv-kicker")}>
                  {product.brand} · {product.category}
                </span>
                <h1>{product.name}</h1>
                <p>{product.description}</p>
                <div className={classes("detail-price")}>
                  From {money(minimum)} <small>/ case</small>
                </div>
                <p className={classes("market-note")}>
                  Sample BDT wholesale prices. Choose a dealer below for its
                  exact price and stock.
                </p>
                <fieldset className={classes("variant-picker")}>
                  <legend>Choose your pack size</legend>
                  {keys.map((key) => (
                    <button
                      key={key}
                      className={classes(selected === key ? "selected" : "")}
                      aria-pressed={selected === key}
                      onClick={() => setVariant(key)}
                    >
                      {key}
                    </button>
                  ))}
                </fieldset>
                <div className={classes("detail-specs")}>
                  <div>
                    <span>Case packaging</span>
                    <strong>{offers[0]?.pack}</strong>
                  </div>
                  <div>
                    <span>Available dealers</span>
                    <strong>{available.length}</strong>
                  </div>
                  <div>
                    <span>Ordering</span>
                    <strong>By the case</strong>
                  </div>
                </div>
                <a className={classes("button")} href="#product-dealers">
                  Choose dealer & price ↓
                </a>
                <p className={classes("market-note")}>
                  Check the physical pack for ingredients, allergens, caffeine
                  and best-before date. Confirm delivery with your dealer.
                  Online payment is not required.
                </p>
              </div>
            </section>
            <section
              className={classes(
                "my-8 rounded-2xl border border-stone-200 bg-white p-6",
              )}
            >
              <h2 className={classes("text-xl font-bold")}>
                Product information
              </h2>
              <dl className={classes("mt-5 grid gap-5 sm:grid-cols-3")}>
                <div>
                  <dt className={classes("text-xs text-stone-400")}>
                    Company / brand group
                  </dt>
                  <dd className={classes("mt-2 text-sm font-semibold")}>
                    {product.company || product.brand}
                  </dd>
                </div>
                <div>
                  <dt className={classes("text-xs text-stone-400")}>Flavor</dt>
                  <dd className={classes("mt-2 text-sm font-semibold")}>
                    {product.flavor || "Check label"}
                  </dd>
                </div>
                <div>
                  <dt className={classes("text-xs text-stone-400")}>
                    Composition notes
                  </dt>
                  <dd className={classes("mt-2 text-xs leading-6")}>
                    {product.compositionNote ||
                      "Check the physical pack for complete ingredients and allergens."}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-stone-400">Selected unit size</dt>
                  <dd className="mt-2 text-sm font-semibold">{selected}</dd>
                </div>
                <div>
                  <dt className="text-xs text-stone-400">Product format</dt>
                  <dd className="mt-2 text-sm font-semibold">
                    {product.format || "See physical pack"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-stone-400">
                    Preparation & storage
                  </dt>
                  <dd className="mt-2 text-xs leading-6">
                    {product.preparationNote ||
                      "Follow the instructions printed on the product pack."}
                  </dd>
                </div>
              </dl>
            </section>
            <div id="product-dealers">
              <DealerFinder
                products={products}
                familyId={family}
                variantKey={selected}
                onBuy={onBuy}
                onMessage={onMessage}
              />
            </div>
            <Reviews productId={product.id} user={user} onAccount={onAccount} />
            <RecentProducts
              products={products}
              currentId={product.id}
              onProduct={onProduct}
            />
          </>
        )}
      </main>
    </div>
  );
}
ProductPage.propTypes = {
  user: PropTypes.object,
  onAccount: PropTypes.func.isRequired,
  onProduct: PropTypes.func.isRequired,
  product: PropTypes.object,
  products: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.string,
  onRetry: PropTypes.func,
  onHome: PropTypes.func,
  onCart: PropTypes.func,
  onBuy: PropTypes.func,
  onMessage: PropTypes.func,
};

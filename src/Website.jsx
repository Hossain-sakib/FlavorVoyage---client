import { useMemo, useState } from "react";
import PropTypes from "prop-types";
import {
  FiArrowUpRight,
  FiArrowRight,
  FiHeart,
  FiSearch,
  FiMenu,
  FiX,
  FiCoffee,
  FiDroplet,
  FiZap,
  FiSun,
  FiSmile,
  FiShoppingBag,
  FiCompass,
  FiWind,
  FiSliders,
  FiGitMerge,
} from "react-icons/fi";
import BrandLogo from "./BrandLogo";
import CompareDialog from "./CompareDialog";
import RecentProducts from "./RecentProducts";
import { money } from "./marketApi";
import companies from "./companies.json";
import DrinkImage from "./DrinkImage";

import { drinkCategories } from "./drinkCategories";

const categoryInfo = [
  ["Soft drinks", "A little fizz. A lot of fun.", "pran-up", FiWind, "peach"],
  [
    "Fruit drinks",
    "Put a little fruit in your day.",
    "frooto",
    FiSun,
    "yellow",
  ],
  ["Energy drinks", "Discover your next pick.", "speed", FiZap, "lilac"],
  ["Water", "The everyday essential.", "pran-water", FiDroplet, "sky"],
  [
    "Dairy & lassi",
    "Chilled, creamy favorites.",
    "pran-lacchi",
    FiSmile,
    "mint",
  ],
  ["Tea & coffee", "Make time for your cup.", "ispahani", FiCoffee, "rose"],
  ["Malt drinks", "For your daily cup.", "horlicks", FiSun, "sand"],
  [
    "Drink mixes",
    "A little mix. A shared jug.",
    "tang-orange",
    FiDroplet,
    "orange",
  ],
  [
    "Traditional sips",
    "Familiar flavors, closer to home.",
    "pran-labang",
    FiHeart,
    "mint",
  ],
];
const faqs = [
  [
    "Is FlavorVoyage for everyone?",
    "Yes. Anyone can explore the drinks, discover local favorites, and save a personal shortlist. You do not need a shop, dealer account, or login to browse.",
  ],
  [
    "Can I buy a single bottle here?",
    "The public website is for drink discovery. Ordering currently happens in our separate wholesale marketplace, where businesses buy by the case. Individual-bottle delivery is not available yet.",
  ],
  [
    "Which drinks can I discover?",
    "Explore soft drinks, fruit drinks, energy drinks, water, dairy and lassi, tea and coffee, malt drinks, drink mixes, and traditional sips popular in Bangladesh.",
  ],
  [
    "How do saved drinks work?",
    "Tap the heart on a drink to keep it in your favorites on this browser. Your list stays on this device; an account is not required.",
  ],
  [
    "Are you an official distributor for these brands?",
    "FlavorVoyage is an independent discovery and business platform. Brand inclusion does not imply an official partnership. Our current wholesale selection uses sample supplier listings and illustrative case prices.",
  ],
];
export default function Website({
  products,
  loading,
  error,
  onRetry,
  onMarketplace,
  dealers,
  onCart,
  cartCount,
  onProduct,
  onDealers,
  onAccount,
  onSupplier,
  user,
  siteContent,
}) {
  const [menu, setMenu] = useState(false);
  const [category, setCategory] = useState("All drinks");
  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("All brands");
  const [onlySaved, setOnlySaved] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [companySearch, setCompanySearch] = useState("");
  const [dealerSearch, setDealerSearch] = useState("");
  const [size, setSize] = useState("");
  const [ingredient, setIngredient] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [stockOnly, setStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState("featured");
  const [compared, setCompared] = useState([]);
  const [compareOpen, setCompareOpen] = useState(false);
  const [favoriteNotice, setFavoriteNotice] = useState("");
  const [favorites, setFavorites] = useState(() => {
    try {
      const v = JSON.parse(localStorage.getItem("fv-favorite-drinks") || "[]");
      return Array.isArray(v) ? v.filter((x) => typeof x === "string") : [];
    } catch {
      return [];
    }
  });
  const drinks = useMemo(
    () =>
      products.filter(
        (p) => !p.catalogOnly && drinkCategories.includes(p.category),
      ),
    [products],
  );
  const brands = [...new Set(drinks.map((p) => p.brand))].sort();
  const sizes = [
    ...new Set(products.map((p) => p.servingSize).filter(Boolean)),
  ].sort();
  function offersFor(product) {
    return products.filter(
      (p) =>
        (p.familyId || p.id) === (product.familyId || product.id) &&
        p.servingSize === (size || product.servingSize) &&
        (!stockOnly || p.stock >= p.moq) &&
        (!dealerSearch ||
          dealers.some(
            (d) =>
              d.id === p.supplierId &&
              `${d.name} ${d.location}`
                .toLowerCase()
                .includes(dealerSearch.toLowerCase()),
          )),
    );
  }
  function listingFor(product) {
    return (
      [...offersFor(product)].sort((a, b) => a.price - b.price)[0] || product
    );
  }
  function priceFor(product) {
    const offers = offersFor(product);
    return offers.length
      ? Math.min(...offers.map((p) => p.price))
      : product.price;
  }
  const visible = drinks.filter(
    (p) =>
      (category === "All drinks" || p.category === category) &&
      (brand === "All brands" || p.brand === brand) &&
      (!onlySaved || favorites.includes(p.id)) &&
      `${p.name} ${p.brand} ${p.category} ${p.description}`
        .toLowerCase()
        .includes(search.toLowerCase()) &&
      `${p.company || ""} ${p.brand}`
        .toLowerCase()
        .includes(companySearch.toLowerCase()) &&
      `${p.flavor || ""} ${p.compositionNote || ""} ${p.name} ${p.description}`
        .toLowerCase()
        .includes(ingredient.toLowerCase()) &&
      offersFor(p).length > 0 &&
      (!maxPrice || priceFor(p) <= Number(maxPrice)),
  );
  if (sortBy === "price-low") visible.sort((a, b) => priceFor(a) - priceFor(b));
  if (sortBy === "price-high")
    visible.sort((a, b) => priceFor(b) - priceFor(a));
  if (sortBy === "name") visible.sort((a, b) => a.name.localeCompare(b.name));
  if (sortBy === "new") visible.reverse();
  const expanded =
    showAll ||
    search ||
    category !== "All drinks" ||
    onlySaved ||
    brand !== "All brands" ||
    companySearch ||
    dealerSearch ||
    size ||
    ingredient ||
    maxPrice ||
    stockOnly ||
    sortBy !== "featured";
  const displayed = expanded ? visible : visible.slice(0, 8);
  function clearRefinements() {
    setCompanySearch("");
    setDealerSearch("");
    setSize("");
    setIngredient("");
    setMaxPrice("");
    setStockOnly(false);
    setSortBy("featured");
  }
  function exploreProduct(p) {
    const offer = listingFor(p);
    onProduct(offer?.id || p.id);
  }
  function toggleCompare(id) {
    if (compared.includes(id)) setCompared(compared.filter((x) => x !== id));
    else if (compared.length < 3) setCompared([...compared, id]);
    else
      setFavoriteNotice(
        "Compare up to three drinks at a time. Remove a pick to add another.",
      );
  }
  function scrollTo(id) {
    setMenu(false);
    document.getElementById(id)?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
      block: "start",
    });
  }
  function selectCategory(c) {
    setCategory(c);
    setBrand("All brands");
    setSearch("");
    setOnlySaved(false);
    setShowAll(true);
    scrollTo("discover");
  }
  function save(id) {
    const next = favorites.includes(id)
      ? favorites.filter((x) => x !== id)
      : [...favorites, id];
    setFavorites(next);
    try {
      localStorage.setItem("fv-favorite-drinks", JSON.stringify(next));
    } catch {
      setFavoriteNotice(
        "Favorites work for this visit, but this browser cannot save them.",
      );
    }
  }
  return (
    <div className="fv-website min-h-screen bg-[#fffcf7] text-[#30213f] [&_:focus-visible]:outline-2 [&_:focus-visible]:outline-offset-4 [&_:focus-visible]:outline-purple-600">
      <div className="bg-[#30213f] px-5 py-2.5 text-center text-xs text-white/80">
        {siteContent?.announcement ||
          "Discover your favorites. Connect with local dealers."}{" "}
        <button
          className="ml-3 font-semibold text-amber-200"
          onClick={onDealers}
        >
          Find nearby dealers ↗
        </button>
      </div>
      <header className="fv-header sticky top-0 z-30 border-b border-stone-200/70 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5 lg:px-8">
          <a href="/" aria-label="FlavorVoyage home">
            <BrandLogo />
          </a>
          <nav
            aria-label="Main navigation"
            className={`${menu ? "absolute left-0 right-0 top-full grid border-b bg-white p-6 shadow-lg" : "hidden"} gap-6 text-sm font-medium lg:static lg:flex lg:border-0 lg:p-0 lg:shadow-none`}
          >
            <button
              onClick={() => {
                setMenu(false);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              Home
            </button>
            <button onClick={() => scrollTo("discover")}>Explore drinks</button>
            <button onClick={() => scrollTo("companies")}>Companies</button>
            <button onClick={onDealers}>Find a dealer</button>
            <button
              className="rounded-xl bg-[#30213f] p-3 text-white sm:hidden"
              onClick={onAccount}
            >
              {user ? "Your workspace" : "Sign in / create account"}
            </button>
            <button onClick={() => scrollTo("for-business")}>
              For businesses ↗
            </button>
          </nav>
          <div className="flex items-center gap-2">
            <button
              className="relative rounded-full p-2 hover:bg-stone-100"
              onClick={onCart}
              aria-label={`Your order, ${cartCount} products`}
            >
              <FiShoppingBag className="size-5" />
              {cartCount > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute -right-1 -top-1 grid min-w-4 place-items-center rounded-full bg-amber-200 px-1 text-[10px] font-bold"
                >
                  {cartCount}
                </span>
              )}
            </button>
            <button
              className="rounded-full p-2 hover:bg-stone-100"
              aria-label={`View ${favorites.length} saved drinks`}
              onClick={() => {
                setOnlySaved(true);
                setCategory("All drinks");
                setSearch("");
                setBrand("All brands");
                scrollTo("discover");
              }}
            >
              <FiHeart className="size-5" />
            </button>
            <button
              className="hidden rounded-xl bg-[#30213f] px-4 py-3 text-xs font-semibold text-white sm:block"
              onClick={onAccount}
            >
              {user ? "Your workspace" : "Sign in"}
            </button>
            <button
              className="fv-menu-button p-2 lg:hidden"
              aria-label={menu ? "Close menu" : "Open menu"}
              aria-expanded={menu}
              onClick={() => setMenu(!menu)}
            >
              {menu ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>
      </header>
      <main className="fv-main">
        <section className="mx-auto grid max-w-7xl gap-10 px-5 pb-14 pt-12 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-20">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-amber-800">
              <span className="size-1.5 rounded-full bg-amber-500" /> Your
              drinks destination, Bangladesh
            </span>
            <h1 className="mt-7 text-5xl font-bold leading-[1.12] tracking-tight sm:text-6xl lg:text-7xl">
              Your next
              <br />
              favorite{" "}
              <em className="font-serif font-medium text-[#a76c35]">sip.</em>
              <span className="mt-3 block text-3xl font-normal text-stone-400 sm:text-4xl">
                Starts here.
              </span>
            </h1>
            <p className="mt-6 max-w-lg text-base leading-8 text-stone-500">
              Everyday favorites. New discoveries. Find drinks you love, compare
              the right pack, and connect with a dealer closer to you.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                className="rounded-xl bg-[#30213f] px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-[#30213f]/10 transition hover:-translate-y-1"
                onClick={() => scrollTo("discover")}
              >
                Find your flavor <FiArrowUpRight className="ml-2 inline" />
              </button>
              <button
                className="rounded-xl border border-stone-200 bg-white px-6 py-4 text-sm font-semibold"
                onClick={onDealers}
              >
                Explore local dealers
              </button>
            </div>
            <div className="mt-10 flex gap-8 border-t border-stone-200 pt-7">
              <div>
                <strong className="text-2xl">{drinks.length}</strong>
                <span className="mt-1 block text-xs text-stone-500">
                  Drinks to discover
                </span>
              </div>
              <div>
                <strong className="text-2xl">{drinkCategories.length}</strong>
                <span className="mt-1 block text-xs text-stone-500">
                  Drink categories
                </span>
              </div>
              <div>
                <strong className="text-2xl">{dealers.length}</strong>
                <span className="mt-1 block text-xs text-stone-500">
                  Listed dealers
                </span>
              </div>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-lg">
            <div className="overflow-hidden rounded-[2rem] border border-[#e9dfd1] bg-[#f3ebdf] p-6 sm:p-8">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#795c3d]">
                  The drinks edit
                </span>
                <span className="rounded-full bg-white/80 px-3 py-1.5 text-[10px] text-stone-600">
                  Discover · Compare · Connect
                </span>
              </div>
              <h2 className="mt-4 max-w-xs text-2xl font-semibold tracking-tight sm:text-3xl">
                Familiar favorites.
                <br />
                <span className="font-serif italic text-[#94622e]">
                  Fresh possibilities.
                </span>
              </h2>
              <div className="mt-7 grid grid-cols-3 gap-3">
                {drinks.slice(0, 3).map((drink, index) => (
                  <button
                    key={drink.id}
                    onClick={() => exploreProduct(drink)}
                    className={`group min-w-0 rounded-2xl bg-white p-3 text-left shadow-sm transition motion-safe:hover:-translate-y-2 ${index === 1 ? "mt-5" : "mb-5"}`}
                    aria-label={`Explore ${drink.name}`}
                  >
                    <div className="flex h-36 items-center justify-center [&_img]:max-h-full sm:h-48">
                      <DrinkImage
                        image={drink.image}
                        name={drink.name}
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <span className="mt-3 block text-[9px] uppercase tracking-wider text-stone-400">
                      {drink.brand}
                    </span>
                    <strong className="mt-1 block text-xs leading-5">
                      {drink.name}
                    </strong>
                  </button>
                ))}
              </div>
              <div className="mt-5 flex items-start gap-3 rounded-xl border border-white/70 bg-white/60 p-4">
                <FiCompass className="mt-1 size-5 shrink-0 text-[#94622e]" />
                <p className="text-xs leading-6 text-stone-600">
                  One place to explore drinks, compare pack prices, and find
                  dealers across Bangladesh. Demo offers are labeled.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section
          id="categories"
          className="border-y border-stone-200 bg-white py-8"
        >
          <div className="mx-auto flex max-w-7xl gap-4 overflow-x-auto px-5 pb-2 lg:px-8">
            {categoryInfo.map(([name, description, , Icon]) => (
              <button
                key={name}
                className="group min-w-36 flex-1 rounded-2xl border border-stone-100 p-5 text-left transition hover:border-amber-300 hover:bg-amber-50"
                onClick={() => selectCategory(name)}
              >
                <Icon className="mb-4 size-6 text-amber-700" />
                <strong className="block text-xs">{name}</strong>
                <span className="mt-2 block text-[10px] leading-5 text-stone-400">
                  {description}
                </span>
              </button>
            ))}
          </div>
        </section>
        <section
          id="companies"
          className="mx-auto max-w-7xl px-5 py-12 lg:px-8"
        >
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-700">
                Familiar names. More to explore.
              </span>
              <h2 className="mt-2 text-2xl font-bold">Explore by company</h2>
            </div>
            <p className="text-xs text-stone-400">
              Brand inclusion does not imply an official partnership.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {companies.map((c) => (
              <button
                key={c.name}
                onClick={() => {
                  setCompanySearch(c.name);
                  setShowAll(true);
                  scrollTo("discover");
                }}
                className="flex h-32 flex-col items-center justify-center gap-4 rounded-2xl border border-stone-200 bg-white px-5 transition hover:border-amber-400 hover:shadow-md"
              >
                <img
                  className="h-10 max-w-32 object-contain"
                  src={c.logo}
                  alt={c.name + " logo"}
                  loading="lazy"
                />
                <span className="text-[10px] text-stone-500">{c.name}</span>
              </button>
            ))}
          </div>
        </section>
        <section
          className="fv-discover mx-auto max-w-7xl scroll-mt-24 px-5 py-8 lg:px-8"
          id="discover"
        >
          <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-700">
                Made for every taste
              </span>
              <h2 className="mt-3 text-3xl font-bold">
                Find your next favorite.
              </h2>
            </div>
            <button
              className={`fv-favorite-filter rounded-xl border px-4 py-3 text-xs ${onlySaved ? "border-[#30213f] bg-[#30213f] text-white" : "border-stone-200 bg-white"}`}
              aria-pressed={onlySaved}
              onClick={() => {
                setOnlySaved(!onlySaved);
                setShowAll(true);
              }}
            >
              <FiHeart className="mr-2 inline" /> Your favorites ·{" "}
              {favorites.length}
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-[1fr_14rem]">
            <label className="flex items-center gap-3 rounded-xl border border-stone-200 bg-white px-4">
              <FiSearch className="text-stone-400" />
              <input
                className="w-full min-w-0 bg-transparent py-4 text-sm outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search drinks, brands, or a flavor…"
                aria-label="Search drinks"
              />
              {search && (
                <button
                  aria-label="Clear drink search"
                  onClick={() => setSearch("")}
                >
                  <FiX />
                </button>
              )}
            </label>
            <select
              className="rounded-xl border border-stone-200 bg-white px-4 py-4 text-sm"
              aria-label="Filter drink brands"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            >
              <option>All brands</option>
              {brands.map((b) => (
                <option key={b}>{b}</option>
              ))}
            </select>
          </div>
          <details className="my-4 rounded-2xl border border-stone-200 bg-white p-5">
            <summary className="flex cursor-pointer flex-wrap items-center gap-2 text-sm font-semibold">
              <FiSliders /> Refine your search{" "}
              <span className="ml-auto text-[10px] font-normal text-stone-400">
                Company · Distributor · Size · Ingredients
              </span>
            </summary>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                [
                  "Company / brand search",
                  companySearch,
                  setCompanySearch,
                  "PRAN, Akij, Coca-Cola…",
                ],
                [
                  "Distributor search",
                  dealerSearch,
                  setDealerSearch,
                  "Shop name or area…",
                ],
                [
                  "Flavor or ingredient keyword",
                  ingredient,
                  setIngredient,
                  "Mango, tea, milk, coffee…",
                ],
              ].map(([label, value, setter, placeholder]) => (
                <label className="grid gap-2 text-xs font-medium" key={label}>
                  {label}
                  <input
                    className="rounded-xl border border-stone-200 px-3 py-3 text-sm"
                    value={value}
                    onChange={(e) => setter(e.target.value)}
                    placeholder={placeholder}
                  />
                </label>
              ))}
              <label className="grid gap-2 text-xs font-medium">
                Pack / unit size
                <select
                  className="rounded-xl border border-stone-200 bg-white px-3 py-3 text-sm"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                >
                  <option value="">All sizes</option>
                  {sizes.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-xs font-medium">
                Maximum case price (BDT)
                <input
                  className="rounded-xl border border-stone-200 px-3 py-3 text-sm"
                  type="number"
                  min="1"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="Any price"
                />
              </label>
              <label className="grid gap-2 text-xs font-medium">
                Sort collection
                <select
                  className="rounded-xl border border-stone-200 bg-white px-3 py-3 text-sm"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Case price: low to high</option>
                  <option value="price-high">Case price: high to low</option>
                  <option value="name">Name: A–Z</option>
                  <option value="new">Newest additions</option>
                </select>
              </label>
            </div>
            <div className="mt-5 flex flex-wrap justify-between gap-4 text-xs">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={stockOnly}
                  onChange={(e) => setStockOnly(e.target.checked)}
                />{" "}
                Available stock only
              </label>
              <button
                className="font-semibold underline"
                onClick={clearRefinements}
              >
                Reset refinements
              </button>
            </div>
            <p className="mt-4 text-[10px] leading-5 text-stone-400">
              Ingredient search uses product names and composition notes, not a
              certified complete ingredient or allergen list. Check the physical
              label.
            </p>
          </details>
          <div
            className="fv-filter-tabs mb-5 flex gap-2 overflow-x-auto pb-2"
            role="group"
            aria-label="Drink categories"
          >
            {["All drinks", ...drinkCategories].map((c) => (
              <button
                className={`shrink-0 rounded-full border px-4 py-2.5 text-xs ${category === c ? "border-[#30213f] bg-[#30213f] text-white" : "border-stone-200 bg-white"}`}
                key={c}
                onClick={() => {
                  setCategory(c);
                  setShowAll(true);
                }}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="mb-5 flex flex-wrap justify-between gap-2 text-xs text-stone-400">
            <span>
              {loading
                ? "Loading your collection…"
                : `${visible.length} drinks to discover`}
            </span>
            <span>Sample case prices in BDT · Buy through a listed dealer</span>
          </div>
          {error && (
            <div
              role="alert"
              className="mb-5 rounded-xl bg-red-50 p-4 text-sm text-red-700"
            >
              The collection could not be loaded.{" "}
              <button className="font-bold underline" onClick={onRetry}>
                Try again
              </button>
            </div>
          )}
          {loading ? (
            <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
              {[1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  className="h-80 animate-pulse rounded-2xl bg-stone-100"
                />
              ))}
            </div>
          ) : displayed.length ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
              {displayed.map((p) => {
                const listing = listingFor(p);
                return (
                  <article
                    className="fv-drink-card group overflow-hidden rounded-2xl border border-stone-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-amber-300 hover:shadow-xl hover:shadow-stone-200/40"
                    key={p.id}
                  >
                    <div className="relative grid h-44 place-items-center sm:h-60 bg-gradient-to-b from-stone-50 to-white p-3 sm:p-6">
                      <span className="absolute left-3 top-3 max-w-[70%] rounded-full bg-amber-50 px-3 py-1 text-[9px] font-medium text-amber-800">
                        {p.demoListing ? "Demo listing" : p.badge || p.category}
                      </span>
                      <button
                        className="absolute right-3 top-3 z-10 rounded-full border border-stone-100 bg-white p-2"
                        aria-label={`${favorites.includes(p.id) ? "Unsave" : "Save"} ${p.name}`}
                        aria-pressed={favorites.includes(p.id)}
                        onClick={() => save(p.id)}
                      >
                        <FiHeart
                          className="size-4"
                          fill={
                            favorites.includes(p.id) ? "currentColor" : "none"
                          }
                        />
                      </button>
                      <button
                        className="w-full transition duration-300 group-hover:scale-105 [&_img]:h-36 sm:[&_img]:h-44"
                        onClick={() => exploreProduct(p)}
                        aria-label={`Discover ${p.name}`}
                      >
                        <DrinkImage
                          type={listing.illustration}
                          image={listing.image}
                          name={p.name}
                        />
                      </button>
                    </div>
                    <div className="p-3 sm:p-5">
                      <span className="text-[9px] uppercase tracking-wider text-stone-400">
                        {p.brand} · {listing.servingSize}
                      </span>
                      <a
                        href={`/products/${listing.id}`}
                        className="mt-2 block min-h-10 text-left text-xs font-bold sm:text-sm"
                        onClick={(e) => {
                          if (!e.metaKey && !e.ctrlKey && !e.shiftKey) {
                            e.preventDefault();
                            exploreProduct(p);
                          }
                        }}
                      >
                        {p.name}
                      </a>
                      <div className="mt-4">
                        <strong className="text-sm sm:text-base">
                          From {money(priceFor(p))}
                        </strong>
                        <small className="ml-1 text-[10px] text-stone-400">
                          / case
                        </small>
                        <p className="mt-1 text-[10px] text-stone-400">
                          {listing.pack}
                        </p>
                      </div>
                      <div className="mt-5 flex items-center justify-between border-t border-stone-100 pt-3">
                        <button
                          className="text-[10px] font-medium text-stone-500 hover:text-[#30213f]"
                          aria-label={`Compare ${p.name}`}
                          aria-pressed={compared.includes(listing.id)}
                          onClick={() => toggleCompare(listing.id)}
                        >
                          <FiGitMerge className="mr-1 inline" />
                          {compared.includes(listing.id)
                            ? "Added to compare"
                            : "Compare"}
                        </button>
                        <button
                          className="grid size-8 place-items-center rounded-full bg-[#30213f] text-white"
                          aria-label={`Read about ${p.name}`}
                          onClick={() => exploreProduct(p)}
                        >
                          <FiArrowUpRight />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-stone-300 p-12 text-center">
              <FiSearch className="mx-auto mb-4 size-8 text-stone-300" />
              <h3 className="text-xl font-bold">
                {onlySaved
                  ? "Your favorites start with a heart."
                  : "No matching drinks"}
              </h3>
              <p className="my-4 text-sm text-stone-500">
                Try another brand, dealer, size or flavor.
              </p>
              <button
                className="rounded-xl border border-stone-200 bg-white px-5 py-3 text-sm"
                onClick={() => {
                  setSearch("");
                  setCategory("All drinks");
                  setBrand("All brands");
                  setOnlySaved(false);
                  clearRefinements();
                }}
              >
                Explore all drinks
              </button>
            </div>
          )}
          {!expanded && visible.length > 8 && (
            <div className="mt-8 text-center">
              <button
                className="rounded-xl border border-[#30213f] px-6 py-4 text-sm font-semibold transition hover:bg-[#30213f] hover:text-white"
                onClick={() => setShowAll(true)}
              >
                Explore all {visible.length} drinks{" "}
                <FiArrowRight className="ml-2 inline" />
              </button>
            </div>
          )}
          <p className="mt-6 text-center text-[10px] leading-5 text-stone-400">
            Images may show a product range. Pack size, ingredients and
            availability must be confirmed with the dealer.
          </p>
        </section>
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <RecentProducts products={products} onProduct={onProduct} />
        </div>
        <section
          id="for-business"
          className="mx-auto my-16 max-w-7xl px-5 lg:px-8"
        >
          <div className="grid overflow-hidden rounded-3xl bg-[#30213f] lg:grid-cols-[1.3fr_1fr]">
            <div className="p-8 text-white md:p-12">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-amber-200">
                Good business starts with a connection
              </span>
              <h2 className="mt-5 text-3xl font-bold leading-tight md:text-4xl">
                From your favorite drink
                <br />
                to your next restock.
              </h2>
              <p className="mt-5 max-w-lg text-sm leading-7 text-white/60">
                Compare cases, find nearby distributors, ask for a quote and
                keep the conversation going—all in your business workspace.
              </p>
              <div className="fv-business-actions mt-7 flex flex-wrap gap-3">
                <button
                  className="fv-button rounded-xl bg-amber-100 px-5 py-3 text-sm font-bold text-[#30213f]"
                  onClick={() => onMarketplace()}
                >
                  Explore marketplace ↗
                </button>
                <button
                  className="rounded-xl border border-white/25 px-5 py-3 text-sm"
                  onClick={onSupplier}
                >
                  Become a dealer
                </button>
              </div>
            </div>
            <img
              className="h-64 w-full object-cover lg:h-full lg:max-h-[28rem]"
              src="/images/stories/tea.jpg"
              alt="Tea served for a shared break"
              loading="lazy"
              width="640"
              height="480"
            />
          </div>
        </section>
        <section
          id="our-story"
          className="mx-auto grid max-w-7xl gap-12 px-5 py-6 lg:grid-cols-2 lg:px-8"
        >
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-700">
              A little clarity, before your next sip
            </span>
            <h2 className="mt-4 text-3xl font-bold">
              Made to be easy.
              <br />
              For everyone.
            </h2>
            <p className="mt-5 max-w-md text-sm leading-8 text-stone-500">
              {siteContent?.aboutText ||
                "Explore without an account. Save your favorites, compare the details and discover the people behind local drink distribution."}
            </p>
          </div>
          <div className="divide-y divide-stone-200">
            {faqs.map(([question, answer]) => (
              <details key={question} className="py-5">
                <summary className="cursor-pointer text-sm font-semibold">
                  {question}
                </summary>
                <p className="mt-4 text-sm leading-7 text-stone-500">
                  {answer}
                </p>
              </details>
            ))}
          </div>
        </section>
      </main>
      <footer className="fv-footer mt-16 border-t border-stone-200 bg-white px-5 py-10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-7">
          <BrandLogo />
          <div className="flex flex-wrap gap-5 text-xs text-stone-500">
            <button
              onClick={() => {
                setOnlySaved(true);
                setSearch("");
                setBrand("All brands");
                setCategory("All drinks");
                scrollTo("discover");
              }}
            >
              Your favorites
            </button>
            <button onClick={onDealers}>Find dealers</button>
            <button onClick={onAccount}>Your account</button>
            <a href="/credits.html">Image credits</a>
          </div>
          <span className="text-[10px] text-stone-400">
            {siteContent?.footerText ||
              `© ${new Date().getFullYear()} FlavorVoyage. Brand names belong to their owners.`}
          </span>
        </div>
      </footer>
      {compared.length > 0 && (
        <div
          className="fixed bottom-4 left-1/2 z-40 flex w-[min(92vw,36rem)] -translate-x-1/2 items-center justify-between gap-3 rounded-2xl bg-[#30213f] px-5 py-4 text-white shadow-xl"
          role="region"
          aria-label="Selected comparison products"
        >
          <span className="text-xs">{compared.length} / 3 picks</span>
          <button
            className="rounded-lg bg-amber-100 px-4 py-2 text-xs font-bold text-[#30213f] disabled:opacity-40"
            disabled={compared.length < 2}
            onClick={() => setCompareOpen(true)}
          >
            Compare picks
          </button>
          <button
            className="text-xs text-white/60"
            onClick={() => setCompared([])}
          >
            Clear
          </button>
        </div>
      )}
      {compareOpen && (
        <CompareDialog
          products={products.filter((p) => compared.includes(p.id))}
          dealers={dealers}
          onProduct={onProduct}
          onClose={() => setCompareOpen(false)}
        />
      )}
      {favoriteNotice && (
        <p
          className="fixed bottom-5 left-5 z-50 max-w-sm rounded-xl bg-white p-4 text-xs shadow-xl"
          role="status"
        >
          {favoriteNotice}
          <button
            className="ml-3"
            aria-label="Dismiss favorites message"
            onClick={() => setFavoriteNotice("")}
          >
            <FiX />
          </button>
        </p>
      )}
    </div>
  );
}
Website.propTypes = {
  products: PropTypes.array.isRequired,
  siteContent: PropTypes.object,
  dealers: PropTypes.array.isRequired,
  onCart: PropTypes.func.isRequired,
  cartCount: PropTypes.number,
  loading: PropTypes.bool,
  error: PropTypes.string,
  onRetry: PropTypes.func,
  onMarketplace: PropTypes.func,
  onProduct: PropTypes.func.isRequired,
  onDealers: PropTypes.func.isRequired,
  onAccount: PropTypes.func,
  onSupplier: PropTypes.func,
  user: PropTypes.object,
};

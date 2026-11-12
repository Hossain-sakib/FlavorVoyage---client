import Select from "./ui/Select";
import { classes } from "./ui/classes";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  FiMapPin,
  FiNavigation,
  FiMessageCircle,
  FiShoppingBag,
} from "react-icons/fi";
import { marketApi, money } from "./marketApi";
const areas = [
  ["Dhanmondi, Dhaka", 23.7461, 90.3742],
  ["Uttara, Dhaka", 23.8759, 90.3795],
  ["Gazipur", 23.9999, 90.4203],
  ["Narayanganj", 23.6238, 90.5],
  ["Chattogram", 22.3569, 91.7832],
  ["Sylhet", 24.8949, 91.8687],
  ["Khulna", 22.8456, 89.5403],
  ["Rajshahi", 24.3745, 88.6042],
  ["Barishal", 22.701, 90.3535],
  ["Rangpur", 25.7439, 89.2752],
];
export default function DealerFinder({
  products,
  onBrowse,
  onMessage,
  onBuy,
  familyId,
  variantKey,
}) {
  const [dealers, setDealers] = useState([]);
  const [area, setArea] = useState("");
  const [point, setPoint] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [locating, setLocating] = useState(false);
  const [retry, setRetry] = useState(0);
  const [query, setQuery] = useState("");
  useEffect(() => {
    let active = true;
    setLoading(true);
    marketApi(
      `/suppliers${point ? `?latitude=${point[0]}&longitude=${point[1]}` : ""}`,
    )
      .then((data) => {
        if (active) {
          setDealers(data);
          setError("");
        }
      })
      .catch(() => {
        if (active) setError("Could not load dealers. Please retry.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [point, retry]);
  function locate() {
    if (!navigator.geolocation)
      return setError(
        "Location is unavailable. Choose your nearest area instead.",
      );
    setLocating(true);
    setError("");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setPoint([coords.latitude, coords.longitude]);
        setArea("current");
        setLocating(false);
      },
      () => {
        setLocating(false);
        setError("Location access was unavailable. Choose an area below.");
      },
      { timeout: 10000, maximumAge: 300000 },
    );
  }
  const visible = dealers.filter((d) => {
    const matches = `${d.name} ${d.location}`
      .toLowerCase()
      .includes(query.toLowerCase());
    return (
      matches &&
      (!familyId ||
        products.some(
          (p) =>
            p.supplierId === d.id &&
            (p.familyId || p.id) === familyId &&
            (!variantKey ||
              (p.variantKey || p.servingSize || p.pack) === variantKey),
        ))
    );
  });
  return (
    <section
      className={classes("dealer-finder")}
      aria-label="Find nearby dealers"
    >
      <div className={classes("market-section-heading")}>
        <div>
          <span className={classes("fv-kicker")}>CLOSER TO YOUR SHOP</span>
          <h2>
            {familyId
              ? "Choose a dealer for this pack"
              : "Find your nearest dealer"}
          </h2>
          <p>
            Choose an area or use your location. Browse stock, ask a question,
            then order.
          </p>
        </div>
        <button
          className={classes("button secondary")}
          onClick={locate}
          disabled={locating}
        >
          <FiNavigation /> {locating ? "Finding you…" : "Use my location"}
        </button>
      </div>
      <div className={classes("dealer-tools")}>
        <label>
          Your area
          <Select
            aria-label="Your area"
            value={area}
            onChange={(e) => {
              setArea(e.target.value);
              setPoint(
                e.target.value ? areas[Number(e.target.value)].slice(1) : null,
              );
            }}
          >
            <option value="">Choose an area</option>
            {area === "current" && (
              <option value="current">Your current location</option>
            )}
            {areas.map((a, i) => (
              <option key={a[0]} value={i}>
                {a[0]}
              </option>
            ))}
          </Select>
        </label>
        <label>
          Search dealers
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Shop name or area"
          />
        </label>
      </div>
      <p className={classes("market-note")}>
        {point
          ? "Sorted by approximate straight-line distance, not driving distance. "
          : "Choose a location to sort by distance. "}
        Demo shops use sample locations and stock; delivery must be agreed with
        the dealer. Your location is not saved.
      </p>
      {error && (
        <p role="alert">
          {error}{" "}
          <button
            className={classes("text-button")}
            onClick={() => setRetry((n) => n + 1)}
          >
            Retry
          </button>
        </p>
      )}
      {loading ? (
        <p role="status">Finding dealers…</p>
      ) : (
        <div className={classes("nearby-grid")}>
          {visible.map((d) => {
            const offers = products.filter(
              (p) =>
                p.supplierId === d.id &&
                (!familyId || (p.familyId || p.id) === familyId) &&
                (!variantKey ||
                  (p.variantKey || p.servingSize || p.pack) === variantKey),
            );
            const offer = [...offers].sort((a, b) => a.price - b.price)[0];
            return (
              <article className={classes("nearby-card")} key={d.id}>
                <div className={classes("dealer-card-top")}>
                  <span className={classes("dealer-avatar")}>{d.initials}</span>
                  {d.demoShop && (
                    <span className={classes("demo-label")}>Demo shop</span>
                  )}
                </div>
                <h3>{d.name}</h3>
                <p>
                  <FiMapPin /> {d.location}
                </p>
                <p className={classes("dealer-distance")}>
                  {d.distanceKm == null
                    ? "Distance unavailable"
                    : `${d.distanceKm} km away`}
                </p>
                {familyId && offer ? (
                  <div className={classes("dealer-offer")}>
                    <strong>
                      {money(offer.price)} <small>/ case</small>
                    </strong>
                    <span>
                      {offer.pack} · Min. {offer.moq} cases
                    </span>
                    <span>
                      {offer.stock} cases in stock · Minimum total{" "}
                      {money(offer.price * offer.moq)}
                    </span>
                  </div>
                ) : (
                  <p>{d.productCount} products listed</p>
                )}
                <div className={classes("dealer-actions")}>
                  {familyId && offer ? (
                    <button
                      className={classes("button")}
                      disabled={offer.stock < offer.moq}
                      onClick={() => onBuy(offer)}
                    >
                      <FiShoppingBag />
                      {offer.stock < offer.moq
                        ? "Out of stock"
                        : `Add ${offer.moq} cases`}
                    </button>
                  ) : (
                    <button
                      className={classes("button")}
                      onClick={() => onBrowse(d.id)}
                    >
                      View stock
                    </button>
                  )}
                  <button
                    className={classes("button secondary")}
                    onClick={() => onMessage(d.id)}
                  >
                    <FiMessageCircle /> Message dealer
                  </button>
                </div>
                {Number.isFinite(d.latitude) &&
                  Number.isFinite(d.longitude) && (
                    <a
                      className={classes("dealer-map")}
                      target="_blank"
                      rel="noreferrer"
                      href={`https://www.google.com/maps/search/?api=1&query=${d.latitude},${d.longitude}`}
                    >
                      View {d.demoShop ? "demo area" : "location"} on map ↗
                    </a>
                  )}
              </article>
            );
          })}
        </div>
      )}
      {!loading && !visible.length && (
        <p className={classes("empty-state")}>
          No dealers match this selection. Try another pack or clear the search.
        </p>
      )}
    </section>
  );
}
DealerFinder.propTypes = {
  products: PropTypes.array.isRequired,
  onBrowse: PropTypes.func,
  onMessage: PropTypes.func.isRequired,
  onBuy: PropTypes.func,
  familyId: PropTypes.string,
  variantKey: PropTypes.string,
};

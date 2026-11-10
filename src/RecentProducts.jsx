import { classes } from "./ui/classes";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import DrinkImage from "./DrinkImage";
export default function RecentProducts({ products, currentId, onProduct }) {
  const [ids, setIds] = useState([]);
  useEffect(() => {
    try {
      const stored = JSON.parse(
        localStorage.getItem("fv-recent-products") || "[]",
      );
      const old = Array.isArray(stored)
        ? stored.filter((id) => typeof id === "string")
        : [];
      const next = currentId
        ? [currentId, ...old.filter((id) => id !== currentId)].slice(0, 8)
        : old;
      if (currentId)
        localStorage.setItem("fv-recent-products", JSON.stringify(next));
      setIds(next);
    } catch {
      setIds([]);
    }
  }, [currentId]);
  const visible = ids
    .filter((id) => id !== currentId)
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean)
    .slice(0, 4);
  if (!visible.length) return null;
  return (
    <section className={classes("recent-products")}>
      <div className={classes("market-section-heading")}>
        <div>
          <span className={classes("fv-kicker")}>
            PICK UP WHERE YOU LEFT OFF
          </span>
          <h2>Recently viewed</h2>
        </div>
        <button
          className={classes("text-button")}
          onClick={() => {
            try {
              localStorage.removeItem("fv-recent-products");
            } catch {
              /* Browser storage is optional. */
            }
            setIds([]);
          }}
        >
          Clear history
        </button>
      </div>
      <div className={classes("recent-grid")}>
        {visible.map((p) => (
          <button key={p.id} onClick={() => onProduct(p.id)}>
            <DrinkImage image={p.image} type={p.illustration} name={p.name} />
            <span>
              {p.name}
              <small>{p.servingSize || p.pack}</small>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
RecentProducts.propTypes = {
  products: PropTypes.array.isRequired,
  currentId: PropTypes.string,
  onProduct: PropTypes.func.isRequired,
};

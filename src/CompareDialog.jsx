import { classes } from "./ui/classes";
import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { FiX } from "react-icons/fi";
import DrinkImage from "./DrinkImage";
import { money } from "./marketApi";
export default function CompareDialog({
  products,
  dealers,
  onClose,
  onProduct,
}) {
  const ref = useRef(null);
  useEffect(() => {
    const before = document.activeElement;
    ref.current.showModal();
    return () => before?.focus();
  }, []);
  const rows = [
    ["Pack size", (p) => p.pack],
    ["Case price (BDT)", (p) => money(p.price)],
    ["Minimum order", (p) => `${p.moq} cases`],
    ["Minimum subtotal", (p) => money(p.price * p.moq)],
    [
      "Availability",
      (p) => (p.stock >= p.moq ? `${p.stock} cases` : "Out of stock"),
    ],
    ["Company / brand", (p) => p.company || p.brand],
    [
      "Listed dealer",
      (p) =>
        dealers.find((d) => d.id === p.supplierId)?.name || "See product page",
    ],
    ["Flavor", (p) => p.flavor || "Check label"],
    [
      "Composition notes",
      (p) => p.compositionNote || "Check the physical pack",
    ],
  ];
  return (
    <dialog
      className={classes("compare-dialog")}
      ref={ref}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={classes("compare-heading")}>
        <div>
          <span className={classes("fv-kicker")}>
            MAKE ROOM FOR YOUR FAVORITES
          </span>
          <h2>Compare your picks</h2>
          <p>
            Case prices are sample dealer listings. Pack sizes differ—compare
            the packaging before choosing.
          </p>
        </div>
        <button
          className={classes("icon-button")}
          aria-label="Close comparison"
          onClick={onClose}
        >
          <FiX />
        </button>
      </div>
      <div className={classes("compare-table-scroll")}>
        <table className={classes("compare-table")}>
          <thead>
            <tr>
              <th>At a glance</th>
              {products.map((p) => (
                <th key={p.id}>
                  <DrinkImage
                    image={p.image}
                    type={p.illustration}
                    name={p.name}
                  />
                  <button
                    onClick={() => {
                      onClose();
                      onProduct(p.id);
                    }}
                  >
                    {p.name} ↗
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(([label, value]) => (
              <tr key={label}>
                <th scope="row">{label}</th>
                {products.map((p) => (
                  <td key={p.id}>{value(p)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </dialog>
  );
}
CompareDialog.propTypes = {
  products: PropTypes.array.isRequired,
  dealers: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired,
  onProduct: PropTypes.func.isRequired,
};

import PropTypes from "prop-types";
import ImageUpload from "./ImageUpload";
import { drinkCategories } from "./drinkCategories";
const field =
  "w-full rounded-xl border border-line bg-surface px-3 py-3 text-sm";
export default function AdminProductForm({
  products,
  suppliers,
  onCreate,
  busy,
}) {
  async function submit(event) {
    event.preventDefault();
    const form = event.currentTarget,
      values = Object.fromEntries(new FormData(form));
    for (const key of ["price", "stock", "moq"])
      values[key] = Number(values[key]);
    if (await onCreate(values)) {
      form.reset();
      form.closest("details").open = false;
    }
  }
  return (
    <details className="rounded-2xl border border-line bg-surface p-5">
      <summary className="cursor-pointer text-sm font-bold">
        Add a new product or pack variant
      </summary>
      <form onSubmit={submit} className="mt-6 space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          {[
            ["name", "New product name"],
            ["brand", "New product brand"],
            ["company", "New company / brand group"],
            ["pack", "New case packaging"],
            ["servingSize", "New unit size"],
          ].map(([name, label]) => (
            <label className="grid gap-2 text-xs font-medium" key={name}>
              {label}
              <input
                className={field}
                name={name}
                required={name !== "company"}
                maxLength={160}
                placeholder={name === "pack" ? "12 × 500 ml" : ""}
              />
            </label>
          ))}
          <label className="grid gap-2 text-xs font-medium">
            New product category
            <select name="category" className={field}>
              {drinkCategories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-xs font-medium">
            Dealer for new product
            <select
              name="supplierId"
              className={field}
              required
              defaultValue=""
            >
              <option value="">Choose a dealer</option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-xs font-medium">
            Existing product family
            <select name="familyId" className={field} defaultValue="">
              <option value="">Independent product</option>
              {products
                .filter((p) => !p.catalogOnly)
                .map((p) => (
                  <option key={p.id} value={p.familyId || p.id}>
                    {p.name}
                  </option>
                ))}
            </select>
          </label>
          {[
            ["price", "New case price (BDT)", 1],
            ["stock", "New available stock", 0],
            ["moq", "New minimum cases", 1],
          ].map(([name, label, min]) => (
            <label className="grid gap-2 text-xs font-medium" key={name}>
              {label}
              <input
                className={field}
                name={name}
                type="number"
                step="1"
                min={min}
                max={1000000}
                required
              />
            </label>
          ))}
        </div>
        <label className="grid gap-2 text-xs font-medium">
          New product description
          <textarea className={field} name="description" maxLength={1000} />
        </label>
        <label className="grid gap-2 text-xs font-medium">
          New composition notes
          <textarea
            className={field}
            name="compositionNote"
            maxLength={1000}
            placeholder="Only add ingredients or allergens you have verified from the product label."
          />
        </label>
        <ImageUpload />
        <label className="grid gap-2 text-xs font-medium">
          New product image URL
          <input
            className={field}
            name="image"
            placeholder="Filled automatically after an upload"
          />
        </label>
        <button
          className="rounded-xl bg-action px-5 py-3 text-sm font-bold text-on-action disabled:opacity-50"
          disabled={busy}
        >
          {busy ? "Creating…" : "Create product"}
        </button>
        <p className="text-xs text-muted">
          The record is saved in the datastore immediately. New static SEO pages
          are generated at the next site build.
        </p>
      </form>
    </details>
  );
}
AdminProductForm.propTypes = {
  products: PropTypes.array.isRequired,
  suppliers: PropTypes.array.isRequired,
  onCreate: PropTypes.func.isRequired,
  busy: PropTypes.bool,
};

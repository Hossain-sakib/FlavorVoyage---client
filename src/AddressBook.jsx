import { classes } from "./ui/classes";
import { useState } from "react";
import PropTypes from "prop-types";
import { FiMapPin, FiTrash2 } from "react-icons/fi";
import { marketApi, send } from "./marketApi";
export default function AddressBook({ addresses, onUpdate }) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    setBusy(true);
    setError("");
    try {
      await send("/addresses", Object.fromEntries(new FormData(form)));
      await onUpdate();
      form.reset();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  async function remove(id) {
    setBusy(true);
    setError("");
    try {
      await marketApi(`/addresses/${id}`, { method: "DELETE" });
      await onUpdate();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className={classes("address-book")}>
      <div className={classes("address-list")}>
        {addresses.length ? (
          addresses.map((a) => (
            <article key={a.id} className={classes("address-card")}>
              <FiMapPin />
              <h2>{a.label}</h2>
              <p>{a.address}</p>
              <p>{a.phone}</p>
              <button
                className={classes("text-button danger")}
                disabled={busy}
                onClick={() => remove(a.id)}
              >
                <FiTrash2 /> Remove address
              </button>
            </article>
          ))
        ) : (
          <div className={classes("empty-state")}>
            <FiMapPin />
            <h2>Make your next checkout quicker</h2>
            <p>Save your shop or delivery address and select it at checkout.</p>
          </div>
        )}
      </div>
      <form className={classes("panel address-form")} onSubmit={submit}>
        <h2>Add a delivery address</h2>
        <p>Save up to five addresses. Only your account can access them.</p>
        <label>
          Address label
          <input
            name="label"
            placeholder="My shop, home, or warehouse"
            required
            maxLength={60}
          />
        </label>
        <label>
          Full delivery address
          <textarea
            name="address"
            required
            maxLength={500}
            autoComplete="street-address"
          />
        </label>
        <label>
          Phone number
          <input
            name="phone"
            type="tel"
            pattern="[+0-9 ()\-]{7,30}"
            required
            maxLength={30}
            autoComplete="tel"
          />
        </label>
        <button
          className={classes("button")}
          disabled={busy || addresses.length >= 5}
        >
          {busy ? "Saving…" : "Save address"}
        </button>
        {error && <p role="alert">{error}</p>}
      </form>
    </section>
  );
}
AddressBook.propTypes = {
  addresses: PropTypes.array.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

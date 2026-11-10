import { classes } from "./ui/classes";
import { useState } from "react";
import PropTypes from "prop-types";
import { send } from "./marketApi";
export default function DealerProfile({ dealer, onSaved }) {
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setSaved(false);
    const data = Object.fromEntries(new FormData(e.currentTarget));
    if (!data.latitude && !data.longitude) {
      delete data.latitude;
      delete data.longitude;
    }
    try {
      await send("/supplier-profile", data, "PATCH");
      await onSaved();
      setSaved(true);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className={classes("panel dealer-profile")}>
      <h2>Your shop location</h2>
      <p>
        Add your area and map coordinates so nearby buyers can find you.
        Coordinates can be copied from a map pin in Google Maps.
      </p>
      <form onSubmit={submit}>
        <label>
          Area
          <input
            name="location"
            defaultValue={dealer?.location || ""}
            required
            maxLength={160}
          />
        </label>
        <label>
          Shop address
          <input
            name="address"
            defaultValue={dealer?.address || ""}
            required
            maxLength={500}
          />
        </label>
        <div className={classes("dealer-tools")}>
          <label>
            Latitude
            <input
              name="latitude"
              type="number"
              step="any"
              min="-90"
              max="90"
              defaultValue={dealer?.latitude ?? ""}
            />
          </label>
          <label>
            Longitude
            <input
              name="longitude"
              type="number"
              step="any"
              min="-180"
              max="180"
              defaultValue={dealer?.longitude ?? ""}
            />
          </label>
        </div>
        <button className={classes("button")} disabled={busy}>
          {busy ? "Saving…" : "Save shop location"}
        </button>
        {saved && <p role="status">Shop location saved.</p>}
        {error && <p role="alert">{error}</p>}
      </form>
    </section>
  );
}
DealerProfile.propTypes = {
  dealer: PropTypes.object,
  onSaved: PropTypes.func.isRequired,
};

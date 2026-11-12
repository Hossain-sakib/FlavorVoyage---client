import Select from "./ui/Select";
import { classes } from "./ui/classes";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { FiStar, FiCheckCircle } from "react-icons/fi";
import { marketApi, send } from "./marketApi";
export default function Reviews({ productId, user, onAccount }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    let active = true;
    marketApi(`/products/${productId}/reviews`)
      .then((x) => {
        if (active) {
          setData(x);
          const mine = x.reviews.find((r) => r.mine);
          if (mine) {
            setRating(mine.rating);
            setComment(mine.comment);
          }
        }
      })
      .catch(() => {
        if (active) setError("Reviews could not be loaded. Please retry.");
      });
    return () => {
      active = false;
    };
  }, [productId, user, revision]);
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setSaved(false);
    try {
      await send(`/products/${productId}/reviews`, { rating, comment });
      setRevision((n) => n + 1);
      setSaved(true);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className={classes("reviews-section")} id="reviews">
      <div className={classes("market-section-heading")}>
        <div>
          <span className={classes("fv-kicker")}>SIPS WORTH TALKING ABOUT</span>
          <h2>Community reviews</h2>
        </div>
        <div className={classes("rating-summary")}>
          <FiStar fill="currentColor" />
          <strong>{data?.average ?? "—"}</strong>
          <span>{data?.count || 0} reviews</span>
        </div>
      </div>
      {data?.demoCount > 0 && (
        <p
          className={classes(
            "mb-5 rounded-xl bg-warning-soft p-4 text-xs text-warning",
          )}
        >
          Demo feedback is shown for preview and excluded from the rating
          average.
        </p>
      )}
      <div className={classes("reviews-layout")}>
        <div>
          {data?.reviews.length ? (
            data.reviews.map((r) => (
              <article className={classes("review-card")} key={r.id}>
                <div>
                  <strong>{r.author}</strong>
                  <span>
                    {"★".repeat(r.rating)}
                    {"☆".repeat(5 - r.rating)}
                  </span>
                </div>
                <small>
                  {r.verifiedPurchase ? (
                    <>
                      <FiCheckCircle /> Verified delivered purchase
                    </>
                  ) : r.demo ? (
                    "Demo account review"
                  ) : (
                    "Community review"
                  )}{" "}
                  ·{" "}
                  {new Date(r.updatedAt).toLocaleDateString("en-BD", {
                    timeZone: "Asia/Dhaka",
                  })}
                </small>
                <p>{r.comment}</p>
              </article>
            ))
          ) : (
            <div className={classes("review-empty")}>
              <FiStar />
              <h3>Be the first to share your experience</h3>
              <p>
                There are no reviews yet. Ratings come from community members; a
                verified badge requires a delivered purchase.
              </p>
            </div>
          )}
        </div>
        <div className={classes("review-form-card")}>
          {user?.role === "retailer" ? (
            <form onSubmit={submit}>
              <h3>
                {data?.reviews.some((r) => r.mine)
                  ? "Update your review"
                  : "Write a review"}
              </h3>
              <label>
                Your rating
                <Select
                  aria-label="Your rating"
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                >
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n}>
                      {n} stars
                    </option>
                  ))}
                </Select>
              </label>
              <label>
                Your experience
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  maxLength={1000}
                  required
                  placeholder="What did you think of this drink?"
                />
              </label>
              <button className={classes("button")} disabled={busy}>
                {busy ? "Saving…" : "Publish review"}
              </button>
              {saved && <p role="status">Your review is saved.</p>}
            </form>
          ) : (
            <>
              <h3>Your taste. Your voice.</h3>
              <p>
                Customers and retailers can sign in to share a review. Dealer
                accounts can read community feedback.
              </p>
              {!user && (
                <button className={classes("button")} onClick={onAccount}>
                  Sign in to review
                </button>
              )}
            </>
          )}
          {error && (
            <p role="alert">
              {error}{" "}
              <button
                className={classes("text-button")}
                onClick={() => {
                  setError("");
                  setRevision((n) => n + 1);
                }}
              >
                Retry
              </button>
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
Reviews.propTypes = {
  productId: PropTypes.string.isRequired,
  user: PropTypes.object,
  onAccount: PropTypes.func.isRequired,
};

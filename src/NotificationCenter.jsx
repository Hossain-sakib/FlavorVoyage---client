import { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { FiBell, FiArrowUpRight } from "react-icons/fi";
import { Modal } from "./ui/Primitives";
import { marketApi, post } from "./marketApi";

export default function NotificationCenter({ onNavigate }) {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const load = useCallback(async (signal) => {
    try {
      const data = await marketApi("/notifications", { signal });
      if (!signal?.aborted) {
        setItems(data);
        setError("");
      }
    } catch (e) {
      if (!signal?.aborted) setError(e.message);
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    const refresh = () => {
      if (!document.hidden) load(controller.signal);
    };
    const timer = setInterval(refresh, 15000);
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      controller.abort();
      clearInterval(timer);
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [load]);
  const unread = items.filter((item) => !item.read).length;
  async function markRead(ids) {
    setBusy(true);
    try {
      setItems(await post("/notifications/read", { ids }));
      setError("");
      return true;
    } catch (e) {
      setError(e.message);
      return false;
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <button
        className="relative grid size-11 shrink-0 place-items-center rounded-xl border border-line bg-surface text-ink"
        aria-label={`Notifications, ${unread} unread`}
        onClick={() => setOpen(true)}
      >
        <FiBell className="size-5" />
        {unread > 0 && (
          <span
            aria-hidden="true"
            className="absolute -right-1 -top-1 min-w-5 rounded-full bg-[#30213f] px-1 text-center text-[10px] leading-5 text-white dark:bg-amber-200 dark:text-[#30213f]"
          >
            {unread}
          </span>
        )}
      </button>
      {open && (
        <Modal title="Notifications" onClose={() => setOpen(false)}>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-muted" aria-live="polite">
              {unread} unread · Latest 50 updates
            </p>
            <button
              disabled={!unread || busy}
              className="min-h-11 text-sm font-semibold text-accent disabled:opacity-40"
              onClick={() =>
                markRead(
                  items.filter((item) => !item.read).map((item) => item.id),
                )
              }
            >
              Mark all as read
            </button>
          </div>
          {error && (
            <div
              role="alert"
              className="mb-4 rounded-xl bg-danger-soft p-4 text-sm text-danger"
            >
              {error}{" "}
              <button className="underline" onClick={() => load()}>
                Retry
              </button>
            </div>
          )}
          {loading ? (
            <p role="status" className="py-10 text-center text-sm text-muted">
              Loading notifications…
            </p>
          ) : !items.length ? (
            <div className="grid justify-items-center gap-3 rounded-2xl border border-dashed border-line p-8 text-center">
              <FiBell className="size-7 text-muted" />
              <h3 className="font-semibold">You’re all caught up</h3>
              <p className="text-sm leading-6 text-muted">
                Order updates, quotes and messages will appear here.
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {items.map((item) => (
                <li key={item.id}>
                  <button
                    disabled={busy}
                    className={`flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition hover:border-purple-400 ${item.read ? "border-line bg-surface" : "border-purple-300 bg-purple-soft"}`}
                    onClick={async () => {
                      if (!item.read && !(await markRead([item.id]))) return;
                      setOpen(false);
                      onNavigate(item);
                    }}
                  >
                    <span
                      className={`mt-1.5 size-2 shrink-0 rounded-full ${item.read ? "bg-transparent" : "bg-purple-500"}`}
                    />
                    <span className="min-w-0 flex-1">
                      <strong className="block break-words text-sm capitalize">
                        {item.title}
                      </strong>
                      <span className="mt-2 block text-xs leading-6 text-muted">
                        {item.description}
                      </span>
                      <time
                        dateTime={item.createdAt}
                        className="mt-2 block text-[11px] text-muted"
                      >
                        {new Date(item.createdAt).toLocaleString("en-BD", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </time>
                    </span>
                    <FiArrowUpRight className="shrink-0 text-muted" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Modal>
      )}
    </>
  );
}
NotificationCenter.propTypes = { onNavigate: PropTypes.func.isRequired };

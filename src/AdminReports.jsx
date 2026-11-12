import { useEffect, useState } from "react";
import { marketApi, money } from "./marketApi";
const field =
  "min-h-11 w-full rounded-xl border border-line bg-surface px-3 py-3 text-sm";
export default function AdminReports() {
  const [range, setRange] = useState({ from: "", to: "", includeDemo: false });
  const [filter, setFilter] = useState("");
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    setLoading(true);
    marketApi("/admin/reports" + filter)
      .then((data) => {
        if (active) {
          setReport(data);
          setError("");
        }
      })
      .catch((e) => {
        if (active) {
          setError(e.message);
          setReport(null);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [filter]);
  async function download(type) {
    setDownloading(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/exports/${type}${filter}`, {
        credentials: "same-origin",
      });
      if (!response.ok) throw Error("Export failed. Please try again.");
      const url = URL.createObjectURL(await response.blob());
      const link = document.createElement("a");
      link.href = url;
      link.download = `flavorvoyage-${type}.csv`;
      document.body.append(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (e) {
      setError(e.message);
    } finally {
      setDownloading(false);
    }
  }
  return (
    <section aria-label="Business reports" className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">Business reports</h2>
        <p className="mt-2 text-sm leading-7 text-muted">
          Order activity in Bangladesh time. Values describe orders, not
          payments, profit or tax invoices.
        </p>
      </div>
      <form
        className="grid items-end gap-4 rounded-2xl border border-line bg-surface p-5 sm:grid-cols-2 xl:grid-cols-4"
        onSubmit={(e) => {
          e.preventDefault();
          const params = new URLSearchParams();
          if (range.from) params.set("from", range.from);
          if (range.to) params.set("to", range.to);
          params.set("includeDemo", range.includeDemo);
          setFilter("?" + params);
        }}
      >
        <label className="grid gap-2 text-xs">
          From date
          <input
            type="date"
            aria-label="Report from date"
            className={field}
            value={range.from}
            onChange={(e) => setRange({ ...range, from: e.target.value })}
          />
        </label>
        <label className="grid gap-2 text-xs">
          To date
          <input
            type="date"
            aria-label="Report to date"
            className={field}
            value={range.to}
            onChange={(e) => setRange({ ...range, to: e.target.value })}
          />
        </label>
        <label className="flex min-h-11 items-center gap-2 text-xs">
          <input
            type="checkbox"
            checked={range.includeDemo}
            onChange={(e) =>
              setRange({ ...range, includeDemo: e.target.checked })
            }
          />
          Include demo orders
        </label>
        <button className="min-h-11 rounded-xl bg-action px-5 py-3 text-sm font-semibold text-on-action">
          Apply report filters
        </button>
      </form>
      {error && (
        <p
          role="alert"
          className="rounded-xl bg-danger-soft p-4 text-sm text-danger"
        >
          {error}
        </p>
      )}
      {loading ? (
        <p role="status" className="text-sm text-muted">
          Loading report…
        </p>
      ) : report ? (
        <>
          <p className="text-xs text-muted">
            {report.from} to {report.to} · Asia/Dhaka ·{" "}
            {report.includeDemo
              ? "Demo orders included"
              : "Demo orders excluded"}
          </p>
          <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
            {[
              ["Orders", report.summary.orders],
              ["Order value", money(report.summary.orderValue)],
              ["Open orders", report.summary.openOrders],
              ["Cases ordered", report.summary.cases],
            ].map(([label, value]) => (
              <article
                key={label}
                className="min-w-0 rounded-2xl border border-line bg-surface p-5"
              >
                <p className="text-xs text-muted">{label}</p>
                <strong className="mt-4 block break-words text-2xl">
                  {value}
                </strong>
              </article>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            {["orders", "inventory", "contacts"].map((type) => (
              <button
                key={type}
                disabled={downloading}
                className="min-h-11 rounded-xl border border-line bg-surface px-5 py-3 text-sm font-semibold capitalize disabled:opacity-50"
                onClick={() => download(type)}
              >
                Export {type} CSV
              </button>
            ))}
          </div>
          <div className="grid gap-6 xl:grid-cols-2">
            {[
              ["Dealer activity", report.dealers, "orders"],
              ["Top products", report.products, "cases"],
            ].map(([title, rows, quantity]) => (
              <section
                key={title}
                className="min-w-0 rounded-2xl border border-line bg-surface p-5"
              >
                <h3 className="font-bold">{title}</h3>
                {!rows.length ? (
                  <p className="mt-5 text-sm text-muted">
                    No matching activity in this period.
                  </p>
                ) : (
                  <ul className="mt-5 divide-y divide-line">
                    {rows.slice(0, 10).map((row) => (
                      <li
                        key={row.id}
                        className="flex flex-wrap items-center justify-between gap-3 py-4 text-sm"
                      >
                        <span className="min-w-0 break-words">
                          {row.name}
                          <small className="mt-1 block text-xs text-muted">
                            {row[quantity]} {quantity}
                          </small>
                        </span>
                        <strong>{money(row.value)}</strong>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>
        </>
      ) : null}
    </section>
  );
}

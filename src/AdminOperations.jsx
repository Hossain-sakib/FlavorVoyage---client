import { useEffect, useState } from "react";
import { marketApi, post } from "./marketApi";
export default function AdminOperations() {
  const [data, setData] = useState(null),
    [error, setError] = useState(""),
    [notice, setNotice] = useState(""),
    [busy, setBusy] = useState(false),
    [revision, setRevision] = useState(0);
  useEffect(() => {
    let active = true;
    marketApi("/admin/operations")
      .then((x) => {
        if (active) {
          setData(x);
          setError("");
        }
      })
      .catch((e) => {
        if (active) setError(e.message);
      });
    return () => {
      active = false;
    };
  }, [revision]);
  async function backup() {
    setBusy(true);
    setNotice("");
    try {
      await post("/admin/backups", {});
      setNotice(
        "Private backup created. Restore access is restricted to the operator tool.",
      );
      setRevision((n) => n + 1);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section aria-label="System operations" className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">System operations</h2>
          <p className="mt-2 text-sm text-muted">
            Workspace checks and private backup status.
          </p>
        </div>
        <button
          className="min-h-11 rounded-xl border border-line bg-surface px-4 py-3 text-xs font-semibold"
          onClick={() => setRevision((n) => n + 1)}
        >
          Refresh checks
        </button>
      </div>
      {error && (
        <p
          role="alert"
          className="rounded-xl bg-danger-soft p-4 text-sm text-danger"
        >
          {error}
        </p>
      )}
      {notice && (
        <p
          role="status"
          className="rounded-xl bg-success-soft p-4 text-sm text-success"
        >
          {notice}
        </p>
      )}
      {!data && !error ? (
        <p role="status" className="text-sm text-muted">
          Checking system…
        </p>
      ) : data ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {data.checks.map((check) => (
              <article
                key={check.label}
                className="rounded-2xl border border-line bg-surface p-5"
              >
                <strong
                  className={`text-xs ${check.ok ? "text-success" : "text-warning"}`}
                >
                  {check.ok ? "Healthy" : "Needs attention"}
                </strong>
                <h3 className="mt-3 text-sm font-semibold">{check.label}</h3>
              </article>
            ))}
          </div>
          <section className="space-y-4 rounded-2xl border border-line bg-surface p-5">
            <h3 className="font-semibold">Backup & recovery</h3>
            <p className="text-sm leading-7 text-muted">
              Daily snapshots are created before the first database write each
              day and retained for 30 days. Manual snapshots remain available
              until an operator removes them. Restoring requires the private
              operator tool and signs everyone out.
            </p>
            <dl className="grid gap-5 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-xs text-muted">Stored snapshots</dt>
                <dd className="mt-2 font-semibold">
                  {data.backups.count || 0}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted">
                  Most recent snapshot (UTC date)
                </dt>
                <dd className="mt-2 font-semibold">
                  {data.backups.latest?.date || "No snapshot yet"}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Storage adapter</dt>
                <dd className="mt-2 font-semibold">{data.storage}</dd>
              </div>
            </dl>
            <button
              disabled={busy || !data.backups.enabled}
              onClick={backup}
              className="min-h-11 rounded-xl bg-action px-5 py-3 text-sm font-semibold text-on-action disabled:opacity-50"
            >
              {busy ? "Creating backup…" : "Create private backup"}
            </button>
          </section>
          {data.demoEnabled && (
            <p className="rounded-xl bg-warning-soft p-4 text-sm leading-7 text-warning">
              Demo access is enabled. Shared demo inboxes and sample prices are
              intended for preview use. Disable demo access before accepting
              real customer information.
            </p>
          )}
          <p className="text-xs text-muted">
            Checked{" "}
            {new Date(data.checkedAt).toLocaleString("en-BD", {
              timeZone: "Asia/Dhaka",
            })}{" "}
            · Bangladesh time. These checks do not replace independent
            monitoring or a security audit.
          </p>
        </>
      ) : null}
    </section>
  );
}

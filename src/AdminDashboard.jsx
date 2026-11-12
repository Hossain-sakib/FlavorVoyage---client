import AdminReports from "./AdminReports";
import AdminFollowUps from "./AdminFollowUps";
import AdminOperations from "./AdminOperations";
import Select from "./ui/Select";
import { useEffect, useState } from "react";
import OperationsSummary from "./OperationsSummary";
import ImageUpload from "./ImageUpload";
import AdminProductForm from "./AdminProductForm";
import { marketApi, send, money } from "./marketApi";
const tabs = [
  "Overview",
  "Products",
  "Dealers",
  "Customers & CRM",
  "Orders",
  "Quotes",
  "Content",
  "Audit log",
  "Reports",
  "Follow-ups",
  "Operations",
];
const field =
  "w-full rounded-xl border border-line bg-surface px-3 py-3 text-sm";
export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [tab, setTab] = useState("Overview");
  const [search, setSearch] = useState("");
  const [stockFilter, setStockFilter] = useState("all");
  const [visibleCount, setVisibleCount] = useState(24);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    let active = true;
    marketApi("/admin/data")
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
  async function mutate(path, body, method = "PATCH") {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await send(`/admin${path}`, body, method);
      setRevision((n) => n + 1);
      setNotice("Saved. The change is recorded in the audit log.");
      return true;
    } catch (e) {
      setError(e.message);
      return false;
    } finally {
      setBusy(false);
    }
  }
  const matches = (value) =>
    String(value).toLowerCase().includes(search.toLowerCase());
  const filteredProducts = (data?.products || [])
    .filter((p) =>
      matches(
        `${p.name} ${p.brand} ${p.company} ${p.id} ${data?.suppliers.find((s) => s.id === p.supplierId)?.name || ""}`,
      ),
    )
    .filter(
      (p) =>
        stockFilter === "all" ||
        (stockFilter === "low"
          ? p.active !== false && p.stock < Math.max(10, p.moq)
          : stockFilter === "inactive"
            ? p.active === false
            : p.stock >= p.moq && p.active !== false),
    );
  return (
    <section aria-label="Admin dashboard" className="space-y-6">
      <div className="rounded-2xl border border-line bg-warning-soft p-4 text-xs leading-6 text-warning">
        Protected administration. Changes are logged. Demo catalog prices and
        sample feedback remain labeled; this is not an accounting or tax
        reporting system.
      </div>
      <div className="lg:hidden">
        <label className="grid gap-2 text-xs font-semibold">
          Admin section
          <Select
            aria-label="Admin section"
            value={tab}
            onChange={(e) => {
              setTab(e.target.value);
              setSearch("");
            }}
          >
            {tabs.map((name) => (
              <option key={name}>{name}</option>
            ))}
          </Select>
        </label>
      </div>
      <nav
        aria-label="Admin sections"
        className="hidden gap-2 rounded-2xl border border-line bg-surface p-2 lg:grid lg:grid-cols-4 xl:grid-cols-6"
      >
        {tabs.map((name) => (
          <button
            key={name}
            className={`min-h-11 rounded-xl px-4 py-3 text-sm font-semibold ${tab === name ? "bg-action text-on-action" : "text-muted hover:bg-subtle"}`}
            onClick={() => {
              setTab(name);
              setSearch("");
            }}
          >
            {name}
          </button>
        ))}
      </nav>
      {tab === "Reports" && <AdminReports />}
      {tab === "Follow-ups" && data && <AdminFollowUps contacts={data.users} />}
      {tab === "Operations" && <AdminOperations />}
      {notice && (
        <p
          role="status"
          className="rounded-xl bg-success-soft p-4 text-sm text-success"
        >
          {notice}
        </p>
      )}
      {error && (
        <p role="alert" className="rounded-xl bg-danger-soft p-4 text-danger">
          {error}{" "}
          <button
            className="underline"
            onClick={() => setRevision((n) => n + 1)}
          >
            Retry
          </button>
        </p>
      )}
      {!data ? (
        <p role="status">Loading administration…</p>
      ) : (
        <>
          {tab === "Overview" && (
            <>
              <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
                {[
                  ["Accounts", data.metrics.users],
                  ["Active products", data.metrics.products],
                  ["Active orders", data.metrics.activeOrders],
                  [
                    "Order value (not payments)",
                    money(data.metrics.totalOrderValue),
                  ],
                ].map(([label, value]) => (
                  <article
                    key={label}
                    className="rounded-2xl border border-line bg-surface p-6"
                  >
                    <p className="text-xs text-muted">{label}</p>
                    <strong className="mt-4 block text-3xl">{value}</strong>
                  </article>
                ))}
              </div>
              <OperationsSummary
                orders={data.orders}
                quotes={data.quotes}
                inventory={data.products}
                supplierMode
                onNavigate={(view) => {
                  setTab(
                    {
                      orders: "Orders",
                      quotes: "Quotes",
                      inventory: "Products",
                      catalog: "Products",
                    }[view] || "Overview",
                  );
                  setSearch("");
                }}
              />
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  [
                    "Manage the catalog",
                    "Products",
                    "Edit prices, product information and stock.",
                  ],
                  [
                    "Your dealer network",
                    "Dealers",
                    "Keep store locations and delivery details accurate.",
                  ],
                  [
                    "Customer relationships",
                    "Customers & CRM",
                    "Review contacts and add useful follow-up notes.",
                  ],
                ].map(([title, destination, description]) => (
                  <button
                    key={destination}
                    className="rounded-2xl border border-line bg-surface p-6 text-left transition hover:border-purple-300 hover:shadow-sm"
                    onClick={() => {
                      setTab(destination);
                      setSearch("");
                    }}
                  >
                    <strong className="text-sm">{title} ↗</strong>
                    <p className="mt-3 text-xs leading-6 text-muted">
                      {description}
                    </p>
                  </button>
                ))}
              </div>
            </>
          )}
          {[
            "Products",
            "Dealers",
            "Customers & CRM",
            "Orders",
            "Quotes",
          ].includes(tab) && (
            <input
              aria-label="Search admin records"
              className={field}
              placeholder="Search records…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setVisibleCount(24);
              }}
            />
          )}
          {tab === "Quotes" && (
            <section className="space-y-3" aria-label="All quote requests">
              <p className="text-sm text-muted">
                A read-only view of marketplace negotiations. Buyers and dealers
                manage responses in their own workspaces.
              </p>
              {(data.quotes || [])
                .filter((q) => matches(JSON.stringify(q)))
                .map((q) => (
                  <article
                    key={q.id}
                    className="rounded-2xl border border-line bg-surface p-5"
                  >
                    <div className="flex flex-wrap justify-between gap-3">
                      <strong className="text-sm">
                        {q.reference || "Quote request"}
                      </strong>
                      <span className="rounded-full bg-purple-soft px-3 py-1 text-xs capitalize text-accent">
                        {q.status}
                      </span>
                    </div>
                    <p className="mt-3 text-xs text-muted">
                      {q.retailerName} → {q.supplierName}
                    </p>
                    <p className="mt-2 text-sm">
                      <span>
                        {(q.items || [])
                          .map(
                            (item) => `${item.name} (${item.quantity} cases)`,
                          )
                          .join(" · ")}
                      </span>
                      {q.note && (
                        <span className="mt-2 block text-xs leading-6 text-muted">
                          {q.note}
                        </span>
                      )}
                    </p>
                  </article>
                ))}
              {!data.quotes?.length && (
                <p className="rounded-2xl border border-dashed border-line p-8 text-center text-sm text-muted">
                  No quote requests yet.
                </p>
              )}
            </section>
          )}
          {tab === "Products" && (
            <AdminProductForm
              products={data.products}
              suppliers={data.suppliers}
              busy={busy}
              onCreate={(values) => mutate("/products", values, "POST")}
            />
          )}
          {tab === "Products" && (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p role="status" className="text-xs text-muted">
                Showing {Math.min(visibleCount, filteredProducts.length)} of{" "}
                {filteredProducts.length} matching listings
              </p>
              <label className="flex items-center gap-3 text-xs">
                Stock view
                <Select
                  aria-label="Filter admin stock"
                  className={field}
                  value={stockFilter}
                  onChange={(e) => {
                    setStockFilter(e.target.value);
                    setVisibleCount(24);
                  }}
                >
                  <option value="all">All listings</option>
                  <option value="available">Available to order</option>
                  <option value="low">Needs restocking</option>
                  <option value="inactive">Inactive</option>
                </Select>
              </label>
            </div>
          )}
          {tab === "Products" && (
            <div className="grid gap-4 xl:grid-cols-2">
              {filteredProducts.slice(0, visibleCount).map((p) => (
                <details
                  key={p.id}
                  className="min-w-0 rounded-2xl border border-line bg-surface"
                >
                  <summary className="flex min-h-11 cursor-pointer flex-wrap items-center justify-between gap-3 p-5">
                    <span className="min-w-0">
                      <strong className="block text-sm">Edit {p.name}</strong>
                      <small className="mt-2 block text-xs text-muted">
                        {p.pack} · {p.stock} cases
                      </small>
                    </span>
                    <span className="text-sm font-semibold">
                      {money(p.price)}{" "}
                      <span className="text-xs text-muted">/ case ↓</span>
                    </span>
                  </summary>
                  <form
                    className="space-y-4 border-t border-line p-5"
                    onSubmit={(e) => {
                      e.preventDefault();
                      const v = Object.fromEntries(
                        new FormData(e.currentTarget),
                      );
                      mutate(`/products/${p.id}`, {
                        price: Number(v.price),
                        stock: Number(v.stock),
                        moq: Number(v.moq),
                        active: v.active === "on",
                        ...Object.fromEntries(
                          [
                            "name",
                            "brand",
                            "company",
                            "description",
                            "flavor",
                            "compositionNote",
                            "preparationNote",
                            "pack",
                            "servingSize",
                            "image",
                          ]
                            .filter((key) => v[key]?.trim())
                            .map((key) => [key, v[key].trim()]),
                        ),
                      });
                    }}
                  >
                    <h3 className="font-bold">{p.name}</h3>
                    <p className="text-xs text-muted">
                      {p.pack} ·{" "}
                      {data.suppliers.find((s) => s.id === p.supplierId)?.name}
                    </p>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        ["price", "Case price", p.price],
                        ["stock", "Stock", p.stock],
                        ["moq", "MOQ", p.moq],
                      ].map(([name, label, value]) => (
                        <label className="grid gap-2 text-xs" key={name}>
                          {label}
                          <input
                            className={field}
                            name={name}
                            type="number"
                            min={name === "stock" ? 0 : 1}
                            defaultValue={value}
                            required
                          />
                        </label>
                      ))}
                    </div>
                    <details className="rounded-xl bg-subtle p-4">
                      <summary className="cursor-pointer text-xs font-semibold">
                        Edit product information & image
                      </summary>
                      <div className="mt-4 grid gap-3">
                        {[
                          ["name", "Product name"],
                          ["brand", "Brand"],
                          ["company", "Company"],
                          ["description", "Description"],
                          ["flavor", "Flavor"],
                          ["compositionNote", "Composition notes"],
                          ["preparationNote", "Preparation notes"],
                          ["pack", "Case packaging"],
                          ["servingSize", "Unit size"],
                          ["image", "Image URL"],
                        ].map(([name, label]) => (
                          <label className="grid gap-2 text-xs" key={name}>
                            {label}
                            <input
                              className={field}
                              name={name}
                              defaultValue={p[name] || ""}
                            />
                          </label>
                        ))}
                        <ImageUpload />
                      </div>
                    </details>
                    <div className="flex items-center justify-between">
                      <label className="text-xs">
                        <input
                          className="mr-2"
                          name="active"
                          type="checkbox"
                          defaultChecked={p.active}
                        />{" "}
                        Active listing
                      </label>
                      <button
                        className="rounded-xl bg-action px-4 py-3 text-xs font-semibold text-on-action"
                        disabled={busy}
                      >
                        Save product
                      </button>
                    </div>
                  </form>
                </details>
              ))}
            </div>
          )}
          {tab === "Products" && visibleCount < filteredProducts.length && (
            <button
              className="rounded-xl border border-line bg-surface px-6 py-3 text-sm font-semibold"
              onClick={() => setVisibleCount((n) => n + 24)}
            >
              Show 24 more listings
            </button>
          )}
          {tab === "Products" && !filteredProducts.length && (
            <p className="rounded-2xl border border-dashed border-line p-8 text-center text-sm text-muted">
              No listings match. Try another search or stock filter.
            </p>
          )}
          {tab === "Dealers" && (
            <div className="grid gap-4 xl:grid-cols-2">
              {data.suppliers
                .filter((s) => matches(`${s.name} ${s.location}`))
                .map((s) => (
                  <form
                    key={s.id}
                    className="space-y-4 rounded-2xl border border-line bg-surface p-5"
                    onSubmit={(e) => {
                      e.preventDefault();
                      const v = Object.fromEntries(
                        new FormData(e.currentTarget),
                      );
                      mutate(
                        `/suppliers/${s.id}`,
                        Object.fromEntries(
                          Object.entries(v).filter(([, value]) => value !== ""),
                        ),
                      );
                    }}
                  >
                    <h3 className="font-bold">{s.name}</h3>
                    {[
                      ["name", "Dealer name"],
                      ["location", "Area"],
                      ["address", "Address"],
                      ["description", "About the dealer"],
                      ["latitude", "Latitude"],
                      ["longitude", "Longitude"],
                    ].map(([name, label]) => (
                      <label key={name} className="grid gap-2 text-xs">
                        {label}
                        <input
                          className={field}
                          name={name}
                          defaultValue={s[name] ?? ""}
                        />
                      </label>
                    ))}
                    <button
                      className="rounded-xl bg-action px-4 py-3 text-sm text-on-action"
                      disabled={busy}
                    >
                      Save dealer
                    </button>
                  </form>
                ))}
            </div>
          )}
          {tab === "Customers & CRM" && (
            <div className="grid gap-4 xl:grid-cols-2">
              {data.users
                .filter((u) => matches(`${u.name} ${u.email} ${u.business}`))
                .map((u) => (
                  <article
                    key={u.id}
                    className="space-y-4 rounded-2xl border border-line bg-surface p-5"
                  >
                    <div>
                      <h3 className="font-bold">{u.business}</h3>
                      <p className="mt-2 text-xs text-muted">
                        {u.name} · {u.email || "Demo account"} · {u.role} ·{" "}
                        {u.orderCount} orders
                      </p>
                    </div>
                    <button
                      className="text-xs font-semibold text-danger underline"
                      disabled={busy}
                      onClick={() =>
                        mutate(`/users/${u.id}`, { suspended: !u.suspended })
                      }
                    >
                      {u.suspended ? "Restore account" : "Suspend account"}
                    </button>
                    <ul className="space-y-2">
                      {data.notes
                        .filter((n) => n.userId === u.id)
                        .map((n) => (
                          <li
                            key={n.id}
                            className="rounded-xl bg-subtle p-3 text-xs leading-6"
                          >
                            {n.text}
                            <small className="block text-muted">
                              {n.author}
                            </small>
                          </li>
                        ))}
                    </ul>
                    <form
                      className="flex gap-2"
                      onSubmit={(e) => {
                        e.preventDefault();
                        const form = e.currentTarget;
                        mutate(
                          "/notes",
                          {
                            userId: u.id,
                            text: new FormData(form).get("text"),
                          },
                          "POST",
                        );
                        form.reset();
                      }}
                    >
                      <input
                        className={field}
                        name="text"
                        placeholder="Private CRM note…"
                        maxLength={2000}
                        required
                      />
                      <button
                        className="rounded-xl border border-line px-4 text-xs"
                        disabled={busy}
                      >
                        Add note
                      </button>
                    </form>
                  </article>
                ))}
            </div>
          )}
          {tab === "Orders" && (
            <div className="space-y-4">
              {data.orders
                .filter((o) =>
                  matches(`${o.reference} ${o.retailerName} ${o.supplierName}`),
                )
                .map((o) => (
                  <article
                    key={o.id}
                    className="rounded-2xl border border-line bg-surface p-5"
                  >
                    <div className="flex flex-wrap justify-between gap-3">
                      <h3 className="font-bold">{o.reference}</h3>
                      <span className="rounded-full bg-subtle px-3 py-1 text-xs">
                        {o.status}
                      </span>
                    </div>
                    <p className="my-3 text-sm text-muted">
                      {o.retailerName} → {o.supplierName}
                    </p>
                    <p className="text-sm font-bold">{money(o.total)}</p>
                    <p className="mt-3 text-xs text-muted">
                      {o.address} · {o.phone}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      {(
                        {
                          pending: ["confirmed", "cancelled"],
                          confirmed: ["shipped", "cancelled"],
                          shipped: ["delivered"],
                        }[o.status] || []
                      ).map((status) => (
                        <button
                          key={status}
                          className="rounded-xl border border-line px-3 py-2 text-xs capitalize"
                          disabled={busy}
                          onClick={() => mutate(`/orders/${o.id}`, { status })}
                        >
                          Mark {status}
                        </button>
                      ))}
                    </div>
                  </article>
                ))}
              {!data.orders.length && <p>No orders yet.</p>}
            </div>
          )}
          {tab === "Content" && (
            <form
              className="max-w-3xl space-y-5 rounded-2xl border border-line bg-surface p-6"
              onSubmit={(e) => {
                e.preventDefault();
                mutate(
                  "/content",
                  Object.fromEntries(new FormData(e.currentTarget)),
                );
              }}
            >
              <h2 className="text-xl font-bold">Public site content</h2>
              {[
                ["announcement", "Announcement"],
                ["aboutText", "About the platform"],
                ["contactEmail", "Public support email"],
                ["supportPhone", "Support phone"],
                ["footerText", "Footer text"],
              ].map(([name, label]) => (
                <label key={name} className="grid gap-2 text-xs font-semibold">
                  {label}
                  <textarea
                    className={field}
                    name={name}
                    maxLength={2000}
                    defaultValue={data.content[name] || ""}
                  />
                </label>
              ))}
              <button
                className="rounded-xl bg-action px-5 py-3 font-semibold text-on-action"
                disabled={busy}
              >
                Publish content
              </button>
              <p className="text-xs text-muted">
                Text only. HTML and scripts are never executed.
              </p>
            </form>
          )}
          {tab === "Audit log" && (
            <div className="overflow-x-auto rounded-2xl border border-line bg-surface p-5">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr>
                    {["Time (Dhaka)", "Administrator", "Action", "Record"].map(
                      (x) => (
                        <th className="p-3" key={x}>
                          {x}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {data.auditLog.map((a) => (
                    <tr className="border-t border-line" key={a.id}>
                      <td className="p-3">
                        {new Date(a.createdAt).toLocaleString("en-BD", {
                          timeZone: "Asia/Dhaka",
                        })}
                      </td>
                      <td className="p-3">{a.actorEmail}</td>
                      <td className="p-3">{a.action}</td>
                      <td className="max-w-xs break-all p-3">{a.target}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!data.auditLog.length && <p>No administrative changes yet.</p>}
            </div>
          )}
        </>
      )}
    </section>
  );
}

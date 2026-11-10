import { useEffect, useState } from "react";
import ImageUpload from "./ImageUpload";
import { marketApi, send, money } from "./marketApi";
const tabs = [
  "Overview",
  "Products",
  "Dealers",
  "Customers & CRM",
  "Orders",
  "Content",
  "Audit log",
];
const field =
  "w-full rounded-xl border border-stone-200 bg-white px-3 py-3 text-sm";
export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [tab, setTab] = useState("Overview");
  const [search, setSearch] = useState("");
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
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  const matches = (value) =>
    String(value).toLowerCase().includes(search.toLowerCase());
  return (
    <section aria-label="Admin dashboard" className="space-y-6">
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs leading-6 text-amber-900">
        Protected administration. Changes are logged. Demo catalog prices and
        sample feedback remain labeled; this is not an accounting or tax
        reporting system.
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map((name) => (
          <button
            key={name}
            className={`shrink-0 rounded-xl px-4 py-3 text-sm font-semibold ${tab === name ? "bg-[#30213f] text-white" : "border border-stone-200 bg-white"}`}
            onClick={() => {
              setTab(name);
              setSearch("");
            }}
          >
            {name}
          </button>
        ))}
      </div>
      {notice && (
        <p
          role="status"
          className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800"
        >
          {notice}
        </p>
      )}
      {error && (
        <p role="alert" className="rounded-xl bg-red-50 p-4 text-red-700">
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
                    className="rounded-2xl border border-stone-200 bg-white p-6"
                  >
                    <p className="text-xs text-stone-500">{label}</p>
                    <strong className="mt-4 block text-3xl">{value}</strong>
                  </article>
                ))}
              </div>
              <div className="rounded-2xl border border-stone-200 bg-white p-6">
                <h2 className="text-xl font-bold">Operations at a glance</h2>
                <p className="mt-4 text-sm leading-8 text-stone-500">
                  Manage stock and case prices in Products, keep contact notes
                  in CRM, review all orders, and edit public content.
                  Administrative changes appear in the audit log. Payment
                  processing and financial ledgers are not enabled.
                </p>
              </div>
            </>
          )}
          {["Products", "Customers & CRM", "Orders"].includes(tab) && (
            <input
              aria-label="Search admin records"
              className={field}
              placeholder="Search records…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          )}
          {tab === "Products" && (
            <div className="grid gap-4 xl:grid-cols-2">
              {data.products
                .filter((p) => matches(`${p.name} ${p.brand} ${p.id}`))
                .map((p) => (
                  <form
                    key={p.id}
                    className="space-y-4 rounded-2xl border border-stone-200 bg-white p-5"
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
                    <p className="text-xs text-stone-500">
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
                    <details className="rounded-xl bg-stone-50 p-4">
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
                        className="rounded-xl bg-[#30213f] px-4 py-3 text-xs font-semibold text-white"
                        disabled={busy}
                      >
                        Save product
                      </button>
                    </div>
                  </form>
                ))}
            </div>
          )}
          {tab === "Dealers" && (
            <div className="grid gap-4 xl:grid-cols-2">
              {data.suppliers.map((s) => (
                <form
                  key={s.id}
                  className="space-y-4 rounded-2xl border border-stone-200 bg-white p-5"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const v = Object.fromEntries(new FormData(e.currentTarget));
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
                    className="rounded-xl bg-[#30213f] px-4 py-3 text-sm text-white"
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
                    className="space-y-4 rounded-2xl border border-stone-200 bg-white p-5"
                  >
                    <div>
                      <h3 className="font-bold">{u.business}</h3>
                      <p className="mt-2 text-xs text-stone-500">
                        {u.name} · {u.email || "Demo account"} · {u.role} ·{" "}
                        {u.orderCount} orders
                      </p>
                    </div>
                    <button
                      className="text-xs font-semibold text-red-700 underline"
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
                            className="rounded-xl bg-stone-50 p-3 text-xs leading-6"
                          >
                            {n.text}
                            <small className="block text-stone-400">
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
                        className="rounded-xl border border-stone-200 px-4 text-xs"
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
                    className="rounded-2xl border border-stone-200 bg-white p-5"
                  >
                    <div className="flex flex-wrap justify-between gap-3">
                      <h3 className="font-bold">{o.reference}</h3>
                      <span className="rounded-full bg-stone-100 px-3 py-1 text-xs">
                        {o.status}
                      </span>
                    </div>
                    <p className="my-3 text-sm text-stone-500">
                      {o.retailerName} → {o.supplierName}
                    </p>
                    <p className="text-sm font-bold">{money(o.total)}</p>
                    <p className="mt-3 text-xs text-stone-500">
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
                          className="rounded-xl border border-stone-200 px-3 py-2 text-xs capitalize"
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
              className="max-w-3xl space-y-5 rounded-2xl border border-stone-200 bg-white p-6"
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
                className="rounded-xl bg-[#30213f] px-5 py-3 font-semibold text-white"
                disabled={busy}
              >
                Publish content
              </button>
              <p className="text-xs text-stone-500">
                Text only. HTML and scripts are never executed.
              </p>
            </form>
          )}
          {tab === "Audit log" && (
            <div className="overflow-x-auto rounded-2xl border border-stone-200 bg-white p-5">
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
                    <tr className="border-t border-stone-100" key={a.id}>
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

import PropTypes from "prop-types";
import {
  FiArrowUpRight,
  FiPackage,
  FiFileText,
  FiShoppingBag,
} from "react-icons/fi";

/** Operational counts always come from the current account's API records. */
export default function OperationsSummary({
  orders = [],
  quotes = [],
  inventory = [],
  supplierMode = false,
  onNavigate,
}) {
  const stages = ["pending", "confirmed", "shipped", "delivered"];
  const active = orders.filter(
    (o) => !["cancelled", "delivered"].includes(o.status),
  );
  const lowStock = inventory.filter(
    (p) => p.active !== false && p.stock < Math.max(10, p.moq),
  );
  const openQuotes = quotes.filter(
    (q) =>
      ["requested", "offered"].includes(q.status) &&
      (!q.expiresAt || Date.parse(q.expiresAt) >= Date.now()),
  );
  const actions = [
    {
      icon: FiShoppingBag,
      count: active.length,
      title: "Orders in progress",
      detail: "Review status and next steps",
      view: "orders",
    },
    {
      icon: FiFileText,
      count: openQuotes.length,
      title: "Open quote requests",
      detail: "Keep negotiations moving",
      view: "quotes",
    },
    {
      icon: FiPackage,
      count: supplierMode
        ? lowStock.length
        : inventory.filter((p) => p.stock >= p.moq).length,
      title: supplierMode ? "Listings to restock" : "Available listings",
      detail: supplierMode
        ? "Below 10 cases or order minimum"
        : "Find your next shelf favorite",
      view: supplierMode ? "inventory" : "catalog",
    },
  ];
  return (
    <section
      aria-label="Business activity"
      className="mb-8 overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm"
    >
      <div className="grid lg:grid-cols-[1fr_1.15fr]">
        <div className="bg-[#30213f] p-6 text-white sm:p-8">
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-200">
            Your business, connected
          </span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight">
            A clear view of your day.
          </h2>
          <p className="mt-3 max-w-sm text-sm leading-7 text-white/70">
            Follow your orders, compare dealer offers, and keep every
            conversation in one place.
          </p>
          <button
            onClick={() => onNavigate(supplierMode ? "inventory" : "catalog")}
            className="mt-6 inline-flex min-h-11 items-center gap-3 rounded-xl bg-amber-200 px-5 py-3 text-sm font-semibold text-[#30213f]"
          >
            {supplierMode ? "Manage inventory" : "Explore marketplace"}
            <FiArrowUpRight />
          </button>
        </div>
        <div className="p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold">Order pipeline</h3>
            <span className="text-xs text-stone-500">
              {orders.length} total
            </span>
          </div>
          <div className="mt-6 grid grid-cols-4 gap-2">
            {stages.map((stage, i) => {
              const count = orders.filter((o) => o.status === stage).length;
              return (
                <button
                  key={stage}
                  onClick={() => onNavigate("orders")}
                  className="group min-w-0 text-left"
                  aria-label={`${count} ${stage} orders`}
                >
                  <div
                    className={`mb-4 h-1.5 rounded-full ${i === 3 ? "bg-emerald-400" : "bg-[#b9a3cb]"}`}
                  />
                  <strong className="block text-2xl">{count}</strong>
                  <span className="mt-2 block truncate text-[10px] capitalize text-stone-500 group-hover:text-[#30213f] sm:text-xs">
                    {stage}
                  </span>
                </button>
              );
            })}
          </div>
          <p className="mt-6 border-t border-stone-100 pt-4 text-xs leading-6 text-stone-500">
            Counts reflect your current records. Cancelled orders are excluded
            from the pipeline.
          </p>
        </div>
      </div>
      <div className="grid divide-y divide-stone-100 border-t border-stone-100 md:grid-cols-3 md:divide-x md:divide-y-0">
        {actions.map(({ icon: Icon, ...action }) => (
          <button
            key={action.title}
            className="flex items-center gap-4 p-5 text-left transition hover:bg-stone-50 sm:p-6"
            onClick={() => onNavigate(action.view)}
          >
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#f2edf6] text-[#694b7e]">
              <Icon className="size-5" />
            </span>
            <span className="min-w-0 flex-1">
              <strong className="block text-sm">
                {action.title}
                <span className="ml-2 text-[#9061a6]">{action.count}</span>
              </strong>
              <span className="mt-1 block text-xs leading-5 text-stone-500">
                {action.detail}
              </span>
            </span>
            <FiArrowUpRight className="shrink-0 text-stone-400" />
          </button>
        ))}
      </div>
    </section>
  );
}
OperationsSummary.propTypes = {
  orders: PropTypes.array,
  quotes: PropTypes.array,
  inventory: PropTypes.array,
  supplierMode: PropTypes.bool,
  onNavigate: PropTypes.func.isRequired,
};

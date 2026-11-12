import Select from "./ui/Select";
import CreditsPage from "./CreditsPage";
import NotificationCenter from "./NotificationCenter";
import ThemeControl from "./ThemeControl";
import OperationsSummary from "./OperationsSummary";
import WorkspaceDialogs from "./WorkspaceDialogs";
import { readRoute } from "./routing";
import { usePageMetadata } from "./usePageMetadata";
import { classes } from "./ui/classes";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  FiGrid,
  FiMessageCircle,
  FiPackage,
  FiShoppingBag,
  FiUsers,
  FiFileText,
  FiSearch,
  FiChevronDown,
  FiArrowUpRight,
  FiArrowRight,
  FiPlus,
  FiX,
  FiTruck,
  FiShield,
  FiCheck,
  FiMenu,
  FiMapPin,
  FiSliders,
  FiEdit2,
  FiRefreshCw,
} from "react-icons/fi";
import { Empty } from "./ui/Primitives";
import Website from "./Website";
import { marketApi as api, money, post } from "./marketApi";
import AddressBook from "./AddressBook";
import AdminDashboard from "./AdminDashboard";
import { getGoogleIdentityToken } from "./firebaseAuth";
import ProductPage from "./ProductPage";
import DealerFinder from "./DealerFinder";
import Inbox from "./Inbox";
import DealerProfile from "./DealerProfile";
import { drinkCategories } from "./drinkCategories";
import BrandLogo from "./BrandLogo";
import ProductArt from "./DrinkImage";

const categories = ["All drinks", ...drinkCategories];
const categoryIcons = ["✦", "◌", "☀", "ϟ", "♧", "◍", "☕", "✷", "◐", "♡"];

export default function App() {
  const [user, setUser] = useState(null);
  const [demo, setDemo] = useState(false);
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [conversationId, setConversationId] = useState("");
  const [pendingDealer, setPendingDealer] = useState("");
  const [productId, setProductId] = useState(() => readRoute().productId);
  const [orders, setOrders] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [siteContent, setSiteContent] = useState({});
  const [view, setView] = useState(() => readRoute().view);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All drinks");
  const [supplier, setSupplier] = useState("");
  const [sort, setSort] = useState("featured");
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [modal, setModal] = useState(null);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [toast, setToast] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authMode, setAuthMode] = useState("login");
  const checkoutKey = useRef(null);
  usePageMetadata(
    view,
    products.find((p) => p.id === productId),
    loading,
  );
  const supplierMode = user?.role === "supplier";
  const refresh = useCallback(async () => {
    const session = await api("/session");
    const [ps, ss, os, qs, inv, chats, savedAddresses, content] =
      await Promise.all([
        api("/products"),
        api("/suppliers"),
        session.user ? api("/orders") : [],
        session.user ? api("/quotes") : [],
        session.user?.role === "supplier" ? api("/inventory") : [],
        session.user ? api("/conversations") : [],
        session.user?.role === "retailer" ? api("/addresses") : [],
        api("/site-content"),
      ]);
    setUser(session.user);
    setDemo(session.demo);
    setProducts(ps);
    setSuppliers(ss);
    setOrders(os);
    setQuotes(qs);
    setInventory(inv);
    setAddresses(savedAddresses);
    setSiteContent(content);
    setConversations(chats);
    return session.user;
  }, []);
  useEffect(() => {
    refresh()
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [refresh]);
  useEffect(() => {
    const timer = setTimeout(() => setToast(""), 5000);
    return () => clearTimeout(timer);
  }, [toast]);
  useEffect(() => {
    try {
      const read = (key) => {
        const value = JSON.parse(localStorage.getItem(key) || "[]");
        return Array.isArray(value)
          ? value.filter(
              (line) =>
                typeof line?.productId === "string" &&
                Number.isSafeInteger(line.quantity) &&
                line.quantity > 0,
            )
          : [];
      };
      const key = `fv-cart-${user?.id || "guest"}`;
      let lines = read(key);
      if (user?.role === "retailer") {
        const guest = read("fv-cart-guest");
        const combined = new Map(
          lines.map((line) => [line.productId, line.quantity]),
        );
        guest.forEach((line) =>
          combined.set(
            line.productId,
            (combined.get(line.productId) || 0) + line.quantity,
          ),
        );
        lines = [...combined].map(([productId, quantity]) => ({
          productId,
          quantity,
        }));
        localStorage.setItem(key, JSON.stringify(lines));
        localStorage.removeItem("fv-cart-guest");
      }
      setCart(lines);
    } catch {
      setCart([]);
    }
  }, [user?.id, user?.role]);
  useEffect(() => {
    checkoutKey.current = null;
  }, [cart]);
  function updateCart(next) {
    setCart(next);
    try {
      localStorage.setItem(
        `fv-cart-${user?.id || "guest"}`,
        JSON.stringify(next),
      );
    } catch {
      setToast(
        "Your basket works for this visit, but browser storage is unavailable.",
      );
    }
  }
  async function run(fn) {
    setBusy(true);
    setFormError("");
    setError("");
    try {
      await fn();
    } catch (e) {
      setFormError(e.message);
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  useEffect(() => {
    const onPop = () => {
      const route = readRoute();
      setProductId(route.productId);
      setView(route.view);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);
  const navigate = (next) => {
    setView(next);
    setMobile(false);
    setSearch("");
    window.history.pushState(
      {},
      "",
      next === "website" ? "/" : `/?view=${next}`,
    );
    window.scrollTo({ top: 0, behavior: "instant" });
  };
  const openProduct = (id) => {
    setProductId(id);
    setView("product");
    window.history.pushState({}, "", `/products/${encodeURIComponent(id)}`);
    window.scrollTo({ top: 0, behavior: "instant" });
  };
  async function messageDealer(id) {
    if (!user) {
      setPendingDealer(id);
      setAuthMode("login");
      open({ type: "auth" });
      return;
    }
    if (supplierMode) {
      setToast(
        "Dealer accounts reply from Messages. Use a customer or retailer account to contact another dealer.",
      );
      return;
    }
    await run(async () => {
      const thread = await post("/conversations", { supplierId: id });
      setConversationId(thread.id);
      setPendingDealer("");
      navigate("messages");
    });
  }
  useEffect(() => {
    if (user?.role === "retailer" && pendingDealer) {
      let active = true;
      post("/conversations", { supplierId: pendingDealer })
        .then((thread) => {
          if (active) {
            setConversationId(thread.id);
            setPendingDealer("");
            setView("messages");
            window.history.pushState({}, "", "/?view=messages");
          }
        })
        .catch((e) => {
          if (active) {
            setError(e.message);
            setPendingDealer("");
          }
        });
      return () => {
        active = false;
      };
    }
  }, [user, pendingDealer]);
  useEffect(() => {
    if (!user) {
      setConversations([]);
      return;
    }
    let active = true;
    const poll = () => {
      if (!document.hidden)
        api("/conversations")
          .then((all) => {
            if (active) setConversations(all);
          })
          .catch(() => {});
    };
    const timer = setInterval(poll, 15000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [user]);
  async function continueGoogle(event, linking = false) {
    const values =
      !linking && event.currentTarget.form
        ? Object.fromEntries(new FormData(event.currentTarget.form))
        : {};
    await run(async () => {
      const idToken = await getGoogleIdentityToken();
      await post("/auth/google", {
        idToken,
        link: linking,
        role: authMode === "register" ? values.role || "retailer" : "retailer",
        business: values.business?.trim() || undefined,
        location: values.location?.trim() || undefined,
      });
      await refresh();
      setModal(null);
      setToast(
        linking
          ? "Google is linked. You can now sign in with either method."
          : "You’re signed in with Google.",
      );
    });
  }
  function open(next) {
    setFormError("");
    setModal(next);
  }
  function add(p) {
    if (supplierMode)
      return setToast("Switch to a retailer account to place orders.");
    const old = cart.find((l) => l.productId === p.id);
    const quantity = (old?.quantity || 0) + p.moq;
    if (quantity > p.stock)
      return setToast("There is not enough stock for another minimum order.");
    updateCart([
      ...cart.filter((l) => l.productId !== p.id),
      { productId: p.id, quantity },
    ]);
    setToast(`${p.name} added to your order.`);
  }
  const cartLines = cart.map((l) => ({
    ...l,
    product: products.find((p) => p.id === l.productId),
  }));
  const cartTotal = cartLines.reduce(
    (n, l) => n + (l.product?.price || 0) * l.quantity,
    0,
  );
  const cartInvalid = cartLines.some(
    (l) =>
      !l.product || l.quantity < l.product.moq || l.quantity > l.product.stock,
  );
  let filtered = products.filter(
    (p) =>
      (category === "All drinks" || p.category === category) &&
      (!p.catalogOnly || Boolean(supplier)) &&
      (!supplier || p.supplierId === supplier) &&
      `${p.name} ${p.brand}`.toLowerCase().includes(search.toLowerCase()),
  );
  if (sort === "low")
    filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (sort === "high")
    filtered = [...filtered].sort((a, b) => b.price - a.price);
  const activeOrders = orders.filter(
    (o) => !["delivered", "cancelled"].includes(o.status),
  );
  const totalSpend = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((n, o) => n + o.total, 0);
  const navItems = [
    [FiGrid, "overview", "Overview"],
    [FiShoppingBag, "catalog", "Marketplace"],
    [FiPackage, "orders", "Orders"],
    [FiFileText, "quotes", "Quotes & requests"],
    [FiUsers, "suppliers", "Nearby dealers"],
    ...(!supplierMode ? [[FiMapPin, "addresses", "Saved addresses"]] : []),
    ...(user?.isAdmin ? [[FiShield, "admin", "Administration"]] : []),
    [
      FiMessageCircle,
      "messages",
      `Messages${conversations.some((t) => t.unread) ? ` (${conversations.reduce((n, t) => n + t.unread, 0)})` : ""}`,
    ],
    ...(supplierMode
      ? [
          [FiSliders, "inventory", "My inventory"],
          [FiMapPin, "shop", "Shop settings"],
        ]
      : []),
  ];
  function requireAccount(next) {
    if (!user) {
      open({ type: "auth" });
      return;
    }
    open(next);
  }
  async function changeOrder(order, status) {
    await run(async () => {
      await post(`/orders/${order.id}`, { status }, "PATCH");
      await refresh();
      setToast(`Order ${status}.`);
    });
  }
  function reorder(order) {
    const next = new Map(cart.map((l) => [l.productId, l.quantity]));
    for (const line of order.items) {
      const p = products.find((p) => p.id === line.productId);
      if (!p) {
        setToast(
          "A product is no longer available. Please review the catalog.",
        );
        return;
      }
      const quantity = (next.get(p.id) || 0) + Math.max(p.moq, line.quantity);
      if (quantity > p.stock) {
        setToast(
          "Current stock cannot cover this repeat order. Please review the catalog.",
        );
        return;
      }
      next.set(p.id, quantity);
    }
    updateCart(
      [...next].map(([productId, quantity]) => ({ productId, quantity })),
    );
    setCartOpen(true);
    setToast(
      "Added at current prices. Review your basket before placing the order.",
    );
  }
  function stats() {
    return (
      <div className={classes("stats-grid")}>
        {[
          [
            FiShoppingBag,
            supplierMode ? "Total order value" : "Order value",
            money(totalSpend),
            "Across your non-cancelled orders",
            "sage",
          ],
          [
            FiTruck,
            "Active orders",
            activeOrders.length.toString().padStart(2, "0"),
            "From confirmation to delivery",
            "sand",
          ],
          [
            FiFileText,
            supplierMode ? "Quote requests" : "Open quotes",
            quotes
              .filter((q) => ["requested", "offered"].includes(q.status))
              .length.toString()
              .padStart(2, "0"),
            "Keep your next deal moving",
            "purple",
          ],
          [
            supplierMode ? FiPackage : FiUsers,
            supplierMode ? "Listed products" : "Available suppliers",
            supplierMode
              ? inventory.filter((p) => p.active).length
              : suppliers.length,
            supplierMode
              ? "Ready for your retail partners"
              : "Explore wholesale partners",
            "blue",
          ],
        ].map(([Icon, label, value, note, color]) => (
          <div className={classes("stat-card")} key={label}>
            <div className={classes("stat-top")}>
              <span>{label}</span>
              <span className={classes(`stat-icon ${color}`)}>
                <Icon />
              </span>
            </div>
            <strong>{value}</strong>
            <small>{note}</small>
          </div>
        ))}
      </div>
    );
  }
  function productGrid(limit) {
    const list = limit ? filtered.slice(0, limit) : filtered;
    return list.length ? (
      <div className={classes("product-grid")}>
        {list.map((p) => (
          <article className={classes("product-card")} key={p.id}>
            <div className={classes(`product-visual bg-${p.illustration}`)}>
              <ProductArt type={p.illustration} image={p.image} name={p.name} />
              {p.badge && (
                <span
                  className={classes(
                    `product-badge ${p.badge === "New arrival" ? "new" : ""}`,
                  )}
                >
                  {p.badge}
                </span>
              )}
              <button
                className={classes("detail-button")}
                aria-label={`View ${p.name}`}
                onClick={() => openProduct(p.id)}
              >
                <FiArrowUpRight />
              </button>
            </div>
            <div className={classes("product-info")}>
              <div className={classes("brand-line")}>
                {p.brand}
                <span>
                  <FiCheck /> Supplier listed
                </span>
              </div>
              <button
                className={classes("product-name")}
                onClick={() => openProduct(p.id)}
              >
                {p.name}
              </button>
              <p className={classes("pack-size")}>
                {p.pack} <span>·</span> MOQ {p.moq} cases
              </p>
              <div className={classes("product-bottom")}>
                <div>
                  <strong>{money(p.price)}</strong>
                  <small> / case</small>
                </div>
                <button
                  className={classes("add-button")}
                  disabled={p.stock < p.moq || supplierMode}
                  aria-label={`Add ${p.name} to order`}
                  onClick={() => add(p)}
                >
                  <FiPlus />
                </button>
              </div>
              <div className={classes("stock-line")}>
                <i className={classes(p.stock < p.moq ? "out" : "")} />
                {p.stock < p.moq
                  ? "Currently unavailable"
                  : `${p.stock} cases available`}
              </div>
            </div>
          </article>
        ))}
      </div>
    ) : (
      <Empty
        title="No products found"
        description="Try a different search, category, or supplier."
        action={
          <button
            className={classes("button secondary")}
            onClick={() => {
              setSearch("");
              setCategory("All drinks");
              setSupplier("");
            }}
          >
            Clear filters
          </button>
        }
      />
    );
  }
  function orderList(limit) {
    const list = limit ? orders.slice(0, limit) : orders;
    return list.length ? (
      <div className={classes("order-list")}>
        {list.map((o) => (
          <article className={classes("order-card")} key={o.id}>
            <div className={classes("order-header")}>
              <div>
                <strong>{o.reference}</strong>
                <p>
                  {supplierMode ? o.retailerName : o.supplierName}{" "}
                  <span>·</span>{" "}
                  {new Date(o.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                  })}
                </p>
              </div>
              <span className={classes(`status ${o.status}`)}>{o.status}</span>
            </div>
            <div className={classes("order-items")}>
              {o.items.map((l) => (
                <span key={l.productId}>
                  {l.name} <b>× {l.quantity}</b>
                </span>
              ))}
            </div>
            <div className={classes("order-footer")}>
              <div>
                <strong>{money(o.total)}</strong>
              </div>
              <div className={classes("inline-actions")}>
                <button
                  className={classes("text-button")}
                  onClick={() => open({ type: "order", order: o })}
                >
                  Details <FiArrowUpRight />
                </button>
                {!supplierMode && (
                  <button
                    className={classes("text-button")}
                    onClick={() => reorder(o)}
                  >
                    Order again
                  </button>
                )}
                {supplierMode &&
                  ["pending", "confirmed", "shipped"].includes(o.status) && (
                    <button
                      disabled={busy}
                      className={classes("button small")}
                      onClick={() =>
                        changeOrder(
                          o,
                          {
                            pending: "confirmed",
                            confirmed: "shipped",
                            shipped: "delivered",
                          }[o.status],
                        )
                      }
                    >
                      {
                        {
                          pending: "Confirm order",
                          confirmed: "Mark shipped",
                          shipped: "Mark delivered",
                        }[o.status]
                      }
                    </button>
                  )}
              </div>
            </div>
          </article>
        ))}
      </div>
    ) : (
      <Empty
        icon={FiPackage}
        title="Your next order starts here"
        description={
          supplierMode
            ? "Retailer orders will appear here when they order from your catalog."
            : "Browse the marketplace and stock your shelves with a few clicks."
        }
        action={
          <button
            className={classes("button secondary")}
            onClick={() => navigate(supplierMode ? "inventory" : "catalog")}
          >
            {supplierMode ? "Manage inventory" : "Explore marketplace"}{" "}
            <FiArrowRight />
          </button>
        }
      />
    );
  }
  function openNotification(item) {
    run(refresh);
    if (item.conversationId) setConversationId(item.conversationId);
    navigate(item.view);
  }
  return (
    <div
      className={classes(
        `app-shell ${["website", "product", "credits"].includes(view) ? "public-mode" : "market-mode"}`,
      )}
    >
      {view === "credits" ? (
        <CreditsPage onHome={() => navigate("website")} />
      ) : view === "product" ? (
        <ProductPage
          key={productId}
          product={products.find((p) => p.id === productId)}
          products={products}
          user={user}
          onNotification={openNotification}
          onAccount={() => open({ type: "auth" })}
          onProduct={openProduct}
          loading={loading}
          error={error}
          onRetry={() => run(refresh)}
          onHome={() => navigate("website")}
          onCart={() => setCartOpen(true)}
          onBuy={add}
          onMessage={messageDealer}
        />
      ) : view === "website" ? (
        <Website
          products={products}
          dealers={suppliers}
          siteContent={siteContent}
          onCart={() => setCartOpen(true)}
          cartCount={cart.length}
          onProduct={openProduct}
          onDealers={() => navigate("suppliers")}
          loading={loading}
          error={products.length ? "" : error}
          onRetry={() => run(refresh)}
          user={user}
          onNotification={openNotification}
          onMarketplace={(c) => {
            setCategory(c || "All drinks");
            setSupplier("");
            navigate("catalog");
          }}
          onAccount={() => {
            if (user) navigate(supplierMode ? "inventory" : "overview");
            else {
              setAuthMode("login");
              open({ type: "auth" });
            }
          }}
          onSupplier={() => {
            if (supplierMode) navigate("inventory");
            else {
              setAuthMode("register");
              open({ type: "auth", role: "supplier" });
            }
          }}
        />
      ) : (
        <>
          {mobile && (
            <button
              className={classes("nav-scrim")}
              aria-label="Close navigation"
              onClick={() => setMobile(false)}
            />
          )}
          <aside className={classes(`sidebar ${mobile ? "mobile-open" : ""}`)}>
            <a
              className={classes("logo")}
              href="/"
              onClick={(e) => {
                e.preventDefault();
                navigate("website");
              }}
            >
              <BrandLogo />
            </a>
            <button
              className={classes("marketplace-home-link")}
              onClick={() => navigate("website")}
            >
              <FiArrowRight /> Back to the website
            </button>
            <div className={classes("workspace-label")}>BUSINESS WORKSPACE</div>
            <nav>
              {navItems.map(([Icon, key, label]) => (
                <button
                  key={key}
                  aria-label={label}
                  onClick={() => navigate(key)}
                  className={classes(
                    `nav-item ${view === key ? "active" : ""}`,
                  )}
                >
                  <Icon />
                  <span>{label}</span>
                  {key === "orders" && activeOrders.length > 0 && (
                    <b>{activeOrders.length}</b>
                  )}
                  {key === "quotes" &&
                    quotes.some((q) => q.status === "offered") && (
                      <i className={classes("nav-dot")} />
                    )}
                </button>
              ))}
            </nav>
            <div className={classes("sidebar-bottom")}>
              <button
                className={classes("profile")}
                onClick={() =>
                  user ? open({ type: "account" }) : open({ type: "auth" })
                }
              >
                <span className={classes("avatar")}>
                  {user ? user.business.slice(0, 2).toUpperCase() : "YB"}
                </span>
                <span>
                  <strong>{user?.business || "Your business"}</strong>
                  <small>
                    {user ? `${user.role} account` : "Sign in to get started"}
                  </small>
                </span>
                <FiChevronDown />
              </button>
            </div>
          </aside>
          <div className={classes("main-shell")}>
            <header className={classes("topbar")}>
              <div className={classes("topbar-left")}>
                <button
                  className={classes("icon-button mobile-menu")}
                  aria-label="Open navigation"
                  onClick={() => setMobile(true)}
                >
                  <FiMenu />
                </button>
                <span className={classes("breadcrumb")}>
                  Workspace <span>/</span>{" "}
                  <strong>
                    {navItems.find((n) => n[1] === view)?.[2] || "Overview"}
                  </strong>
                </span>
              </div>
              <div className={classes("topbar-actions")}>
                <ThemeControl />
                {user?.id && (
                  <NotificationCenter
                    key={user.id}
                    onNavigate={openNotification}
                  />
                )}
                <span className={classes("market-location")}>
                  <FiMapPin /> Bangladesh <span>· BDT</span>
                </span>
                <button
                  className={classes("cart-button")}
                  onClick={() => setCartOpen(true)}
                  aria-label={`Open order basket, ${cart.length} products`}
                >
                  <FiShoppingBag />
                  <span className="hidden sm:inline">My basket</span>
                  {cart.length > 0 && <b>{cart.length}</b>}
                </button>
                {!user && (
                  <button
                    className={classes("button small")}
                    onClick={() => open({ type: "auth" })}
                  >
                    Sign in <FiArrowUpRight />
                  </button>
                )}
                {user && (
                  <span className={classes("avatar top-avatar")}>
                    {user.name.slice(0, 1)}
                  </span>
                )}
              </div>
            </header>
            <main
              className={classes(
                "mx-auto max-w-[100rem] min-w-0 px-4 py-6 sm:px-6 lg:px-8",
              )}
            >
              {error && (
                <div role="alert" className={classes("error-banner")}>
                  <span>{error}</span>
                  <button
                    className={classes("icon-button")}
                    aria-label="Dismiss error"
                    onClick={() => setError("")}
                  >
                    <FiX />
                  </button>
                </div>
              )}
              {loading ? (
                <div className={classes("loading-state")}>
                  <FiRefreshCw className={classes("spin")} /> Preparing your
                  workspace…
                </div>
              ) : (
                <>
                  <div className={classes("page-heading")}>
                    <div>
                      <div className={classes("eyebrow")}>
                        YOUR BUSINESS, CONNECTED
                      </div>
                      <h1>
                        {view === "overview"
                          ? `Let’s grow your ${supplierMode ? "business" : "store"}.`
                          : {
                              catalog: "The wholesale marketplace.",
                              orders: "Every order, in one place.",
                              quotes: "Better deals start here.",
                              suppliers: "Your next business partner.",
                              inventory: "Your products. More possibilities.",
                              messages: "Your conversations, connected.",
                              shop: "Your shop, easy to find.",
                              addresses: "Your delivery address book.",
                              admin: "Platform administration.",
                            }[view] || "Welcome to FlavorVoyage."}
                      </h1>
                      <p>
                        {view === "overview"
                          ? "Good drinks. Trusted partnerships. A simpler way to do business."
                          : {
                              catalog:
                                "Discover beverage favorites at wholesale prices. Stock up with confidence.",
                              orders:
                                "Track deliveries, manage purchases, and keep business moving.",
                              quotes:
                                "Request a price, negotiate with suppliers, and turn offers into orders.",
                              suppliers:
                                "Connect directly with the people behind the products.",
                              inventory:
                                "Manage your catalog, pricing, and available stock.",
                              messages:
                                "Ask about stock, agree on delivery, and reply directly.",
                              shop: "Help nearby buyers find your shop and start a conversation.",
                            }[view]}
                      </p>
                    </div>
                    {view === "overview" ? (
                      <button
                        className={classes("button secondary")}
                        onClick={() =>
                          navigate(supplierMode ? "inventory" : "orders")
                        }
                      >
                        {supplierMode ? <FiSliders /> : <FiPackage />}
                        {supplierMode ? "Manage inventory" : "View my orders"}
                      </button>
                    ) : view === "inventory" ? (
                      <button
                        className={classes("button")}
                        onClick={() => open({ type: "product" })}
                      >
                        <FiPlus /> Add product
                      </button>
                    ) : null}
                  </div>
                  {!user && demo && (
                    <div className={classes("demo-banner")}>
                      <span>
                        <b>Take a look around.</b> Explore an isolated demo
                        workspace, or create your business account.
                      </span>
                      <div>
                        <button
                          disabled={busy}
                          onClick={() =>
                            run(async () => {
                              await post("/auth/demo", { role: "retailer" });
                              await refresh();
                              setToast(
                                "Retailer demo opened. Orders stay in this local environment.",
                              );
                            })
                          }
                        >
                          Try as retailer <FiArrowUpRight />
                        </button>
                        <button
                          disabled={busy}
                          onClick={() =>
                            run(async () => {
                              await post("/auth/demo", { role: "supplier" });
                              await refresh();
                              navigate("inventory");
                            })
                          }
                        >
                          Try as supplier <FiArrowUpRight />
                        </button>
                      </div>
                    </div>
                  )}
                  {view === "overview" && (
                    <section
                      className={classes("dashboard-actions")}
                      aria-label="Quick actions"
                    >
                      <button
                        className={classes("dashboard-action")}
                        onClick={() => navigate("messages")}
                      >
                        <FiMessageCircle />
                        <strong>
                          {conversations.reduce((n, t) => n + t.unread, 0)}{" "}
                          unread messages
                        </strong>
                        <span>Open your inbox and reply</span>
                      </button>
                      <button
                        className={classes("dashboard-action")}
                        onClick={() =>
                          navigate(supplierMode ? "shop" : "suppliers")
                        }
                      >
                        <FiMapPin />
                        <strong>
                          {supplierMode
                            ? "Update shop location"
                            : "Find nearby dealers"}
                        </strong>
                        <span>
                          {supplierMode
                            ? "Update prices, stock and location"
                            : "Compare local stock and prices"}
                        </span>
                      </button>
                      <button
                        className={classes("dashboard-action")}
                        onClick={() => navigate("orders")}
                      >
                        <FiPackage />
                        <strong>{activeOrders.length} active orders</strong>
                        <span>View order status and details</span>
                      </button>
                    </section>
                  )}
                  {view === "shop" && supplierMode && (
                    <DealerProfile
                      key={user.supplierId}
                      dealer={suppliers.find((s) => s.id === user.supplierId)}
                      onSaved={refresh}
                    />
                  )}
                  {view === "overview" && (
                    <>
                      <OperationsSummary
                        orders={orders}
                        quotes={quotes}
                        inventory={supplierMode ? inventory : products}
                        supplierMode={supplierMode}
                        onNavigate={navigate}
                      />
                      {stats()}
                      <section className={classes("section-block")}>
                        <div className={classes("section-heading")}>
                          <div>
                            <h2>Stock your drinks shelf</h2>
                            <p>
                              Bangladeshi favorites. Wholesale possibilities.
                            </p>
                          </div>
                          <button
                            className={classes("text-button")}
                            onClick={() => navigate("catalog")}
                          >
                            View all products <FiArrowRight />
                          </button>
                        </div>
                        <div className={classes("category-tabs")}>
                          {categories.map((c, i) => (
                            <button
                              key={c}
                              className={classes(
                                category === c ? "selected" : "",
                              )}
                              onClick={() => setCategory(c)}
                            >
                              <span>{categoryIcons[i]}</span>
                              {c}
                            </button>
                          ))}
                        </div>
                        {productGrid(4)}
                      </section>
                      <section className={classes("bottom-panels")}>
                        <div className={classes("panel")}>
                          <div className={classes("section-heading")}>
                            <h2>Recent orders</h2>
                            <button
                              className={classes("text-button")}
                              onClick={() => navigate("orders")}
                            >
                              View all <FiArrowUpRight />
                            </button>
                          </div>
                          {orderList(2)}
                        </div>
                        <div className={classes("partner-panel")}>
                          <span className={classes("eyebrow")}>
                            STRONGER CONNECTIONS
                          </span>
                          <h2>
                            A reliable partner.
                            <br />A better business.
                          </h2>
                          <p>
                            Discover suppliers for your next restock, and ask
                            for a quote that works for you.
                          </p>
                          <div className={classes("partner-avatars")}>
                            {suppliers.slice(0, 3).map((s) => (
                              <span key={s.id}>{s.initials}</span>
                            ))}
                            <span>↗</span>
                          </div>
                          <button
                            className={classes("text-button")}
                            onClick={() => navigate("suppliers")}
                          >
                            Find your supplier <FiArrowRight />
                          </button>
                        </div>
                      </section>
                    </>
                  )}
                  {view === "catalog" && (
                    <>
                      <div className={classes("catalog-tools")}>
                        <label className={classes("search-field")}>
                          <FiSearch />
                          <input
                            aria-label="Search products"
                            placeholder="Search products or brands…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                          />
                          {search && (
                            <button
                              className={classes("icon-button")}
                              aria-label="Clear search"
                              onClick={() => setSearch("")}
                            >
                              <FiX />
                            </button>
                          )}
                        </label>
                        <Select
                          aria-label="Filter by supplier"
                          value={supplier}
                          onChange={(e) => setSupplier(e.target.value)}
                        >
                          <option value="">All suppliers</option>
                          {suppliers.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.name}
                            </option>
                          ))}
                        </Select>
                        <Select
                          aria-label="Sort products"
                          value={sort}
                          onChange={(e) => setSort(e.target.value)}
                        >
                          <option value="featured">Featured first</option>
                          <option value="low">Price: low to high</option>
                          <option value="high">Price: high to low</option>
                        </Select>
                      </div>
                      <div className={classes("category-tabs")}>
                        {categories.map((c, i) => (
                          <button
                            key={c}
                            className={classes(
                              category === c ? "selected" : "",
                            )}
                            onClick={() => setCategory(c)}
                          >
                            <span>{categoryIcons[i]}</span>
                            {c}
                          </button>
                        ))}
                      </div>
                      <div className={classes("results-line")}>
                        <span>
                          <b>{filtered.length}</b> products for your business
                        </span>
                        <span>Prices in BDT, per case</span>
                      </div>
                      {productGrid()}
                    </>
                  )}
                  {view === "orders" && (
                    <>
                      <div className={classes("section-heading")}>
                        <span>{orders.length} orders</span>
                        <button
                          className={classes("button secondary small")}
                          disabled={busy}
                          onClick={() => run(refresh)}
                        >
                          <FiRefreshCw /> Refresh status
                        </button>
                      </div>
                      {orderList()}
                    </>
                  )}
                  {view === "quotes" && (
                    <>
                      {!quotes.length ? (
                        <Empty
                          icon={FiFileText}
                          title={
                            supplierMode
                              ? "Ready for your first request"
                              : "Make room for a better deal"
                          }
                          description={
                            supplierMode
                              ? "Retailer quote requests will appear here. Respond with your best prices."
                              : "Add products to your basket, then choose “Request a quote” to discuss bulk pricing."
                          }
                          action={
                            <button
                              className={classes("button secondary")}
                              onClick={() =>
                                navigate(supplierMode ? "inventory" : "catalog")
                              }
                            >
                              {supplierMode
                                ? "View inventory"
                                : "Browse products"}{" "}
                              <FiArrowRight />
                            </button>
                          }
                        />
                      ) : (
                        <div className={classes("quote-grid")}>
                          {quotes.map((q) => (
                            <article
                              className={classes("quote-card")}
                              key={q.id}
                            >
                              <div className={classes("order-header")}>
                                <strong>{q.reference}</strong>
                                <span className={classes(`status ${q.status}`)}>
                                  {q.status}
                                </span>
                              </div>
                              <h3>
                                {supplierMode ? q.retailerName : q.supplierName}
                              </h3>
                              <p className={classes("quote-note")}>
                                “{q.note}”
                              </p>
                              <div className={classes("quote-lines")}>
                                {q.items.map((l) => (
                                  <div key={l.productId}>
                                    <span>
                                      {l.name} <small>× {l.quantity}</small>
                                    </span>
                                    <strong>
                                      {money(l.price * l.quantity)}
                                    </strong>
                                  </div>
                                ))}
                              </div>
                              {q.supplierNote && (
                                <p className={classes("info-banner")}>
                                  {q.supplierNote}
                                </p>
                              )}
                              {q.expiresAt && (
                                <small className={classes("muted")}>
                                  Offer expires{" "}
                                  {new Date(q.expiresAt).toLocaleDateString(
                                    "en-GB",
                                  )}
                                </small>
                              )}
                              <div className={classes("order-footer")}>
                                <strong>
                                  {money(
                                    q.items.reduce(
                                      (n, l) => n + l.price * l.quantity,
                                      0,
                                    ),
                                  )}
                                </strong>
                                {supplierMode &&
                                ["requested", "offered"].includes(q.status) ? (
                                  <button
                                    className={classes("button small")}
                                    onClick={() =>
                                      open({ type: "offer", quote: q })
                                    }
                                  >
                                    Prepare offer <FiArrowUpRight />
                                  </button>
                                ) : !supplierMode && q.status === "offered" ? (
                                  <button
                                    className={classes("button small")}
                                    onClick={() =>
                                      open({ type: "accept", quote: q })
                                    }
                                  >
                                    Accept offer <FiArrowRight />
                                  </button>
                                ) : null}
                              </div>
                              {!supplierMode &&
                                ["requested", "offered"].includes(q.status) && (
                                  <button
                                    className={classes("text-button danger")}
                                    disabled={busy}
                                    onClick={() =>
                                      run(async () => {
                                        await post(
                                          `/quotes/${q.id}`,
                                          { status: "cancelled" },
                                          "PATCH",
                                        );
                                        await refresh();
                                      })
                                    }
                                  >
                                    Cancel request
                                  </button>
                                )}
                            </article>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                  {view === "suppliers" && (
                    <DealerFinder
                      products={products}
                      onMessage={messageDealer}
                      onBrowse={(id) => {
                        setSupplier(id);
                        setCategory("All drinks");
                        navigate("catalog");
                      }}
                    />
                  )}
                  {view === "addresses" && user?.role === "retailer" && (
                    <AddressBook addresses={addresses} onUpdate={refresh} />
                  )}
                  {view === "admin" &&
                    (user?.isAdmin ? (
                      <AdminDashboard />
                    ) : (
                      <Empty
                        icon={FiShield}
                        title="Administrator sign-in required"
                        description="Use the authorized Google account to access administration."
                        action={
                          <button
                            className={classes("button")}
                            onClick={() => open({ type: "auth" })}
                          >
                            Sign in
                          </button>
                        }
                      />
                    ))}
                  {view === "messages" &&
                    (user ? (
                      <Inbox
                        key={user.id}
                        user={user}
                        initialId={conversationId}
                        onUpdate={setConversations}
                      />
                    ) : (
                      <Empty
                        icon={FiMessageCircle}
                        title="Sign in to message a dealer"
                        description="Keep your questions, replies and delivery discussions in one place."
                        action={
                          <button
                            className={classes("button")}
                            onClick={() => open({ type: "auth" })}
                          >
                            Sign in
                          </button>
                        }
                      />
                    ))}
                  {view === "inventory" && supplierMode && (
                    <div className={classes("panel inventory-panel")}>
                      <div className={classes("section-heading")}>
                        <h2>{inventory.length} products in your catalog</h2>
                        <span className={classes("muted")}>
                          Stock is reserved when orders are placed.
                        </span>
                      </div>
                      {inventory.length ? (
                        <div
                          className={classes("table-scroll")}
                          tabIndex={0}
                          role="region"
                          aria-label="Inventory table, scroll horizontally for more columns"
                        >
                          <table>
                            <thead>
                              <tr>
                                <th>Product</th>
                                <th>Category</th>
                                <th>Price / case</th>
                                <th>MOQ</th>
                                <th>Stock</th>
                                <th>Status</th>
                                <th>
                                  <span className={classes("sr-only")}>
                                    Actions
                                  </span>
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {inventory.map((p) => (
                                <tr key={p.id}>
                                  <td>
                                    <div
                                      className={classes("inventory-product")}
                                    >
                                      <ProductArt
                                        type={p.illustration}
                                        image={p.image}
                                        name={p.name}
                                      />
                                      <span>
                                        <strong>{p.name}</strong>
                                        <small>{p.pack}</small>
                                      </span>
                                    </div>
                                  </td>
                                  <td>{p.category}</td>
                                  <td>{money(p.price)}</td>
                                  <td>{p.moq}</td>
                                  <td>
                                    <span
                                      className={classes(
                                        p.stock < p.moq ? "danger" : "",
                                      )}
                                    >
                                      {p.stock}
                                    </span>
                                  </td>
                                  <td>
                                    <span
                                      className={classes(
                                        `status ${p.active ? "confirmed" : "cancelled"}`,
                                      )}
                                    >
                                      {p.active ? "Listed" : "Hidden"}
                                    </span>
                                  </td>
                                  <td>
                                    <button
                                      className={classes("icon-button")}
                                      aria-label={`Edit ${p.name}`}
                                      onClick={() =>
                                        open({ type: "product", product: p })
                                      }
                                    >
                                      <FiEdit2 />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <Empty
                          title="Give retailers something to discover"
                          description="Add your first product with a case price, minimum order quantity, and stock level."
                          action={
                            <button
                              className={classes("button")}
                              onClick={() => open({ type: "product" })}
                            >
                              <FiPlus /> Add product
                            </button>
                          }
                        />
                      )}
                    </div>
                  )}
                  {["orders", "quotes", "inventory"].includes(view) &&
                    !user && (
                      <div className={classes("signin-prompt")}>
                        <FiShield />
                        <p>Sign in to see your business workspace.</p>
                        <button
                          className={classes("button")}
                          onClick={() => open({ type: "auth" })}
                        >
                          Sign in
                        </button>
                      </div>
                    )}
                </>
              )}
              <footer className={classes("page-footer")}>
                <span>
                  © {new Date().getFullYear()} FlavorVoyage. Built for better
                  business.
                </span>
                <span>
                  <i /> Supplier to retailer. Simply connected.
                </span>
              </footer>
            </main>
          </div>
        </>
      )}
      {toast && (
        <div className={classes("toast-message")} role="status">
          <FiCheck />
          {toast}
          <button
            aria-label="Dismiss notification"
            onClick={() => setToast("")}
          >
            <FiX />
          </button>
        </div>
      )}
      <WorkspaceDialogs
        context={{
          cartOpen,
          setCartOpen,
          cartLines,
          suppliers,
          updateCart,
          cart,
          cartInvalid,
          cartTotal,
          supplierMode,
          user,
          open,
          requireAccount,
          navigate,
          modal,
          authMode,
          busy,
          setModal,
          formError,
          run,
          refresh,
          setToast,
          continueGoogle,
          demo,
          setPendingDealer,
          setAuthMode,
          setFormError,
          checkoutKey,
          addresses,
          categories,
          products,
        }}
      />
    </div>
  );
}

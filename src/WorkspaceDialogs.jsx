import Select from "./ui/Select";
import { FiShoppingBag } from "react-icons/fi";
import PropTypes from "prop-types";
import { classes } from "./ui/classes";
import { money, post } from "./marketApi";
import {
  FiMinus,
  FiPlus,
  FiFileText,
  FiArrowRight,
  FiCheck,
  FiLogOut,
  FiArrowUpRight,
  FiMapPin,
} from "react-icons/fi";
import { Modal, Empty } from "./ui/Primitives";
import ProductArt from "./DrinkImage";
import GoogleButton from "./GoogleButton";
import ImageUpload from "./ImageUpload";

export default function WorkspaceDialogs({ context }) {
  const {
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
  } = context;
  return (
    <>
      {" "}
      {cartOpen && (
        <Modal
          title="Your order basket"
          onClose={() => setCartOpen(false)}
          wide
        >
          {cartLines.length ? (
            <>
              <div className={classes("basket-lines")}>
                {cartLines.map((l) => (
                  <div className={classes("basket-line")} key={l.productId}>
                    <ProductArt
                      type={l.product?.illustration}
                      image={l.product?.image}
                      name={l.product?.name}
                    />
                    <div className={classes("basket-line-info")}>
                      <h3>{l.product?.name || "Unavailable product"}</h3>
                      <small>{l.product?.pack}</small>
                      <small>
                        {
                          suppliers.find((s) => s.id === l.product?.supplierId)
                            ?.name
                        }
                      </small>
                      <strong>
                        {money((l.product?.price || 0) * l.quantity)}
                      </strong>
                      {l.product && (
                        <small>
                          MOQ {l.product.moq} · {l.product.stock} cases in stock
                        </small>
                      )}
                    </div>
                    <div className={classes("basket-controls")}>
                      <div className={classes("quantity-control")}>
                        <button
                          aria-label={`Decrease ${l.product?.name}`}
                          disabled={!l.product || l.quantity <= l.product.moq}
                          onClick={() =>
                            updateCart(
                              cart.map((x) =>
                                x.productId === l.productId
                                  ? {
                                      ...x,
                                      quantity: Math.max(
                                        l.product.moq,
                                        x.quantity - 1,
                                      ),
                                    }
                                  : x,
                              ),
                            )
                          }
                        >
                          <FiMinus />
                        </button>
                        <input
                          type="number"
                          aria-label={`Quantity of ${l.product?.name}`}
                          min={l.product?.moq || 1}
                          max={l.product?.stock}
                          value={l.quantity}
                          onChange={(e) => {
                            const quantity = Number(e.target.value);
                            if (Number.isInteger(quantity) && quantity > 0)
                              updateCart(
                                cart.map((x) =>
                                  x.productId === l.productId
                                    ? { ...x, quantity }
                                    : x,
                                ),
                              );
                          }}
                        />
                        <button
                          aria-label={`Increase ${l.product?.name}`}
                          disabled={!l.product || l.quantity >= l.product.stock}
                          onClick={() =>
                            updateCart(
                              cart.map((x) =>
                                x.productId === l.productId
                                  ? { ...x, quantity: x.quantity + 1 }
                                  : x,
                              ),
                            )
                          }
                        >
                          <FiPlus />
                        </button>
                      </div>
                      <button
                        className={classes("text-button danger")}
                        onClick={() =>
                          updateCart(
                            cart.filter((x) => x.productId !== l.productId),
                          )
                        }
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {cartInvalid && (
                <p className={classes("error-banner")}>
                  Check quantities against current minimums and stock. Remove
                  unavailable products.
                </p>
              )}
              <div className={classes("basket-total")}>
                <span>Estimated total</span>
                <strong>{money(cartTotal)}</strong>
              </div>
              <p className={classes("muted form-help")}>
                Separate orders are created for each supplier. Prices are per
                case. Listed prices include standard delivery; no extra fees are
                added at checkout.
              </p>
              <div className={classes("form-actions")}>
                <button
                  className={classes("button secondary")}
                  disabled={cartInvalid || supplierMode}
                  onClick={() => {
                    if (!user) {
                      setCartOpen(false);
                      open({ type: "auth" });
                      return;
                    }
                    setCartOpen(false);
                    open({ type: "quote" });
                  }}
                >
                  Request a quote <FiFileText />
                </button>
                <button
                  className={classes("button")}
                  disabled={cartInvalid || supplierMode}
                  onClick={() => {
                    setCartOpen(false);
                    requireAccount({ type: "checkout" });
                  }}
                >
                  Continue to order <FiArrowRight />
                </button>
              </div>
            </>
          ) : (
            <Empty
              icon={FiShoppingBag}
              title="Your shelves have potential"
              description="Add wholesale products to build your next order."
              action={
                <button
                  className={classes("button")}
                  onClick={() => {
                    setCartOpen(false);
                    navigate("catalog");
                  }}
                >
                  Explore products <FiArrowRight />
                </button>
              }
            />
          )}
        </Modal>
      )}
      {modal && (
        <Modal
          title={
            {
              auth:
                authMode === "login" ? "Welcome back." : "Let’s grow together.",
              account: "Your business account",
              detail: modal.product?.name,
              checkout: "Delivery details",
              quote: "Request a better price",
              product: modal.product ? "Edit your product" : "Add a product",
              order: modal.order?.reference,
              offer: "Prepare your offer",
              accept: "Accept supplier offer",
            }[modal.type]
          }
          onClose={() => !busy && setModal(null)}
          wide={["checkout", "product", "offer"].includes(modal.type)}
        >
          {formError && (
            <p className={classes("error-banner")} role="alert">
              {formError}
            </p>
          )}
          {modal.type === "auth" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const values = Object.fromEntries(
                  new FormData(e.currentTarget),
                );
                run(async () => {
                  await post(`/auth/${authMode}`, values);
                  await refresh();
                  setModal(null);
                  setToast("Welcome to your business workspace.");
                });
              }}
            >
              <p className={classes("modal-intro")}>
                Your next business opportunity starts with a connection.
              </p>
              <GoogleButton onClick={continueGoogle} disabled={busy} />
              <div className={classes("auth-divider")}>
                <span>or continue with email</span>
              </div>
              {authMode === "register" && (
                <p className={classes("form-help muted")}>
                  Choose your account type below before continuing with Google.
                  Your Google name is used if the shop name is empty.
                </p>
              )}
              {demo && (
                <details className={classes("demo-inbox-preview")}>
                  <summary>Preview a Cosmobit demo dealer inbox</summary>
                  <p className={classes("market-note")}>
                    Shared demo inbox. Use sample information only. This signs
                    you in as the selected demo dealer.
                  </p>
                  {suppliers
                    .filter((s) => s.demoShop && s.id.startsWith("s-cosmobit"))
                    .map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        className={classes("button secondary full-width")}
                        disabled={busy}
                        onClick={() =>
                          run(async () => {
                            await post("/auth/demo", {
                              role: "supplier",
                              supplierId: s.id,
                            });
                            await refresh();
                            setModal(null);
                            setPendingDealer("");
                            navigate("messages");
                          })
                        }
                      >
                        {s.name}
                      </button>
                    ))}
                </details>
              )}

              {authMode === "register" && (
                <>
                  <label>
                    Your name
                    <input
                      name="name"
                      required
                      maxLength="160"
                      autoComplete="name"
                    />
                  </label>
                  <label>
                    Name / shop name
                    <input
                      name="business"
                      required
                      maxLength="160"
                      autoComplete="organization"
                    />
                  </label>
                  <div className={classes("form-row")}>
                    <label>
                      I am a
                      <Select
                        aria-label="I am a"
                        name="role"
                        defaultValue={modal.role || "retailer"}
                      >
                        <option value="retailer">
                          Customer / retailer — buying drinks
                        </option>
                        <option value="supplier">
                          Supplier — selling wholesale
                        </option>
                      </Select>
                    </label>
                    <label>
                      City
                      <input name="location" defaultValue="Dhaka" required />
                    </label>
                  </div>
                </>
              )}
              <label>
                Email address
                <input
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                />
              </label>
              <label>
                Password
                <input
                  type="password"
                  name="password"
                  required
                  minLength={authMode === "register" ? 10 : 1}
                  maxLength="128"
                  autoComplete={
                    authMode === "register"
                      ? "new-password"
                      : "current-password"
                  }
                />
              </label>
              {authMode === "register" && (
                <p className={classes("form-help muted")}>
                  Use at least 10 characters. Choose your role carefully: each
                  account has its own workspace.
                </p>
              )}
              <button className={classes("button full-width")} disabled={busy}>
                {busy
                  ? "Please wait…"
                  : authMode === "login"
                    ? "Sign in to your workspace"
                    : "Create business account"}
                <FiArrowRight />
              </button>
              <p className={classes("auth-switch")}>
                {authMode === "login"
                  ? "New to FlavorVoyage?"
                  : "Already have an account?"}{" "}
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode(authMode === "login" ? "register" : "login");
                    setFormError("");
                  }}
                >
                  {authMode === "login" ? "Create an account" : "Sign in"}
                </button>
              </p>
            </form>
          )}
          {modal.type === "account" && (
            <>
              <div className={classes("account-summary")}>
                <span className={classes("avatar")}>
                  {user?.business.slice(0, 2)}
                </span>
                <h3>{user?.business}</h3>
                <p>{user?.name}</p>
                <span className={classes("status confirmed")}>
                  {user?.role}
                </span>
              </div>
              {user?.email &&
                (user.googleLinked ? (
                  <p className={classes("google-linked")}>
                    <FiCheck /> Google account connected
                  </p>
                ) : (
                  <GoogleButton
                    linking
                    disabled={busy}
                    onClick={(event) => continueGoogle(event, true)}
                  />
                ))}
              <p className={classes("modal-intro")}>
                {user?.email ||
                  "Isolated development demo. Create an account for a permanent business identity."}
              </p>
              <button
                className={classes("button secondary full-width")}
                disabled={busy}
                onClick={() =>
                  run(async () => {
                    await post("/auth/logout", {});
                    await refresh();
                    setModal(null);
                    navigate("website");
                  })
                }
              >
                <FiLogOut /> Sign out
              </button>
            </>
          )}
          {["checkout", "accept"].includes(modal.type) && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const values = Object.fromEntries(
                  new FormData(e.currentTarget),
                );
                run(async () => {
                  if (modal.type === "accept")
                    await post(
                      `/quotes/${modal.quote.id}`,
                      { ...values, status: "accepted" },
                      "PATCH",
                    );
                  else {
                    checkoutKey.current ||= crypto.randomUUID();
                    await post("/orders", { ...values, items: cart }, "POST", {
                      "Idempotency-Key": checkoutKey.current,
                    });
                    updateCart([]);
                  }
                  await refresh();
                  setModal(null);
                  navigate("orders");
                  setToast(
                    "Order placed. Your supplier can now confirm and fulfill it.",
                  );
                });
              }}
            >
              <p className={classes("modal-intro")}>
                {modal.type === "accept"
                  ? "Accept the negotiated prices and reserve available stock."
                  : "Your stock is reserved when you place the order. Each supplier receives a separate order."}
              </p>
              {addresses.length > 0 && (
                <label>
                  Use a saved address
                  <Select
                    aria-label="Use a saved address"
                    defaultValue=""
                    onChange={(e) => {
                      const a = addresses.find((a) => a.id === e.target.value);
                      if (a) {
                        e.target.form.elements.address.value = a.address;
                        e.target.form.elements.phone.value = a.phone;
                      }
                    }}
                  >
                    <option value="">Choose a saved address</option>
                    {addresses.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.label}
                      </option>
                    ))}
                  </Select>
                </label>
              )}
              <label>
                Delivery address
                <textarea
                  name="address"
                  required
                  maxLength="500"
                  placeholder="Store name, street, area, city, postal code"
                  autoComplete="street-address"
                />
              </label>
              <label>
                Contact number
                <input
                  type="tel"
                  name="phone"
                  required
                  pattern="[+0-9 ()\-]{7,30}"
                  placeholder="+880 1XXXXXXXXX"
                  autoComplete="tel"
                />
              </label>
              <div className={classes("basket-total")}>
                <span>Order total</span>
                <strong>
                  {money(
                    modal.type === "accept"
                      ? modal.quote.items.reduce(
                          (n, l) => n + l.price * l.quantity,
                          0,
                        )
                      : cartTotal,
                  )}
                </strong>
              </div>
              <button className={classes("button full-width")} disabled={busy}>
                {busy ? "Placing your order…" : "Place order"} <FiArrowRight />
              </button>
              <p className={classes("form-help muted")}>
                Track your order in Orders. Your supplier will confirm it and
                update delivery progress.
              </p>
            </form>
          )}
          {modal.type === "quote" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const values = Object.fromEntries(
                  new FormData(e.currentTarget),
                );
                run(async () => {
                  await post("/quotes", { ...values, items: cart });
                  updateCart([]);
                  await refresh();
                  setModal(null);
                  navigate("quotes");
                  setToast("Quote requests sent to your suppliers.");
                });
              }}
            >
              <p className={classes("modal-intro")}>
                Ask about bulk pricing, delivery timing, or a recurring supply.
                Each supplier receives a separate request. Stock is reserved
                only when you accept an offer.
              </p>
              <label>
                Tell your suppliers what you need
                <textarea
                  name="note"
                  required
                  maxLength="1000"
                  placeholder="For example: We restock every week. Can you offer a better case price for this quantity?"
                />
              </label>
              <div className={classes("basket-total")}>
                <span>{cart.length} products · catalog estimate</span>
                <strong>{money(cartTotal)}</strong>
              </div>
              <button disabled={busy} className={classes("button full-width")}>
                {busy ? "Sending…" : "Send quote requests"} <FiArrowUpRight />
              </button>
            </form>
          )}
          {modal.type === "product" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const values = Object.fromEntries(
                  new FormData(e.currentTarget),
                );
                for (const key of ["price", "moq", "stock"])
                  values[key] = Number(values[key]);
                values.active = values.active === "true";
                run(async () => {
                  await post(
                    modal.product
                      ? `/products/${modal.product.id}`
                      : "/products",
                    values,
                    modal.product ? "PATCH" : "POST",
                  );
                  await refresh();
                  setModal(null);
                  setToast("Product saved to your catalog.");
                });
              }}
            >
              <div className={classes("form-row")}>
                <label>
                  Product name
                  <input
                    name="name"
                    required
                    defaultValue={modal.product?.name}
                    maxLength="160"
                  />
                </label>
                <label>
                  Brand
                  <input
                    name="brand"
                    required
                    defaultValue={modal.product?.brand}
                    maxLength="160"
                  />
                </label>
              </div>
              <div className={classes("form-row")}>
                <label>
                  Category
                  <Select
                    aria-label="Category"
                    name="category"
                    defaultValue={modal.product?.category || "Soft drinks"}
                  >
                    {categories.slice(1).map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </Select>
                </label>
                <label>
                  Product family
                  <Select
                    aria-label="Product family"
                    name="familyId"
                    defaultValue={modal.product?.familyId || ""}
                  >
                    <option value="">Standalone product</option>
                    {products
                      .filter((p) => !p.familyId || p.familyId === p.id)
                      .map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                  </Select>
                </label>
                <label>
                  Unit size / variant
                  <input
                    name="servingSize"
                    maxLength="100"
                    placeholder="For example: 250 ml or 500 ml"
                    defaultValue={modal.product?.servingSize || ""}
                  />
                </label>
                <label>
                  Pack size
                  <input
                    name="pack"
                    required
                    defaultValue={modal.product?.pack}
                    placeholder="24 × 250 ml"
                  />
                </label>
              </div>
              <div className={classes("form-row three")}>
                {[
                  ["price", "Case price (BDT)", 1],
                  ["moq", "Minimum cases", 1],
                  ["stock", "Available cases", 0],
                ].map(([name, label, min]) => (
                  <label key={name}>
                    {label}
                    <input
                      name={name}
                      type="number"
                      step="1"
                      min={min}
                      max={name === "moq" ? 10000 : 1000000}
                      required
                      defaultValue={
                        modal.product?.[name] ?? (name === "moq" ? 1 : "")
                      }
                    />
                  </label>
                ))}
              </div>
              <ImageUpload />
              <label>
                Product image URL (optional)
                <input
                  name="image"
                  defaultValue={modal.product?.image || ""}
                  placeholder="https://your-site.com/drink-photo.jpg"
                />
              </label>
              <label>
                Description
                <textarea
                  name="description"
                  defaultValue={modal.product?.description}
                  maxLength="1000"
                />
              </label>
              <label>
                Visibility
                <Select
                  aria-label="Visibility"
                  name="active"
                  defaultValue={
                    modal.product?.active === false ? "false" : "true"
                  }
                >
                  <option value="true">Listed in marketplace</option>
                  <option value="false">Hidden from marketplace</option>
                </Select>
              </label>
              <button disabled={busy} className={classes("button full-width")}>
                {busy ? "Saving…" : "Save product"} <FiCheck />
              </button>
            </form>
          )}
          {modal.type === "offer" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const data = new FormData(e.currentTarget);
                run(async () => {
                  await post(
                    `/quotes/${modal.quote.id}`,
                    {
                      status: "offered",
                      prices: modal.quote.items.map((l, i) =>
                        Number(data.get(`price-${i}`)),
                      ),
                      note: data.get("note"),
                    },
                    "PATCH",
                  );
                  await refresh();
                  setModal(null);
                  setToast(
                    "Offer sent. The retailer can now accept your prices.",
                  );
                });
              }}
            >
              <p className={classes("modal-intro")}>
                {modal.quote.retailerName}: “{modal.quote.note}”
              </p>
              {modal.quote.items.map((l, i) => (
                <label key={l.productId}>
                  {l.name} · {l.quantity} cases · price per case (BDT)
                  <input
                    type="number"
                    name={`price-${i}`}
                    min="1"
                    max="1000000"
                    step="1"
                    required
                    defaultValue={l.price}
                  />
                </label>
              ))}
              <label>
                Offer details
                <textarea
                  name="note"
                  defaultValue={
                    modal.quote.supplierNote ||
                    "Offer valid for 7 days, subject to stock availability."
                  }
                  maxLength="1000"
                  required
                />
              </label>
              <div className={classes("form-actions")}>
                <button
                  type="button"
                  className={classes("button secondary")}
                  disabled={busy}
                  onClick={() =>
                    run(async () => {
                      await post(
                        `/quotes/${modal.quote.id}`,
                        { status: "declined" },
                        "PATCH",
                      );
                      await refresh();
                      setModal(null);
                    })
                  }
                >
                  Decline request
                </button>
                <button className={classes("button")} disabled={busy}>
                  Send offer <FiArrowUpRight />
                </button>
              </div>
            </form>
          )}
          {modal.type === "order" && (
            <>
              <span className={classes(`status ${modal.order.status}`)}>
                {modal.order.status}
              </span>
              <p className={classes("modal-intro")}>
                {supplierMode
                  ? modal.order.retailerName
                  : modal.order.supplierName}
              </p>
              <div className={classes("quote-lines")}>
                {modal.order.items.map((l) => (
                  <div key={l.productId}>
                    <span>
                      {l.name}
                      <small>
                        {l.pack} · {l.quantity} cases
                      </small>
                    </span>
                    <strong>{money(l.price * l.quantity)}</strong>
                  </div>
                ))}
              </div>
              <div className={classes("basket-total")}>
                <span>Total</span>
                <strong>{money(modal.order.total)}</strong>
              </div>
              <ol
                className={classes(
                  "my-5 space-y-3 border-l-2 border-line pl-4",
                )}
                aria-label="Order history"
              >
                {(
                  modal.order.history || [
                    {
                      status: modal.order.status,
                      at: modal.order.updatedAt || modal.order.createdAt,
                    },
                  ]
                ).map((entry, i) => (
                  <li key={i} className={classes("text-xs")}>
                    <strong className={classes("capitalize")}>
                      {entry.status}
                    </strong>
                    <time className={classes("ml-3 text-muted")}>
                      {new Date(entry.at).toLocaleString("en-BD", {
                        timeZone: "Asia/Dhaka",
                      })}
                    </time>
                  </li>
                ))}
              </ol>
              <div className={classes("delivery-details")}>
                <h3>
                  <FiMapPin /> Delivery details
                </h3>
                <p>{modal.order.address}</p>
                <p>{modal.order.phone}</p>
              </div>
              {["pending", ...(supplierMode ? ["confirmed"] : [])].includes(
                modal.order.status,
              ) &&
                modal.order.paymentStatus !== "paid" && (
                  <button
                    className={classes("button secondary danger full-width")}
                    disabled={busy}
                    onClick={() =>
                      run(async () => {
                        await post(
                          `/orders/${modal.order.id}`,
                          { status: "cancelled" },
                          "PATCH",
                        );
                        await refresh();
                        setModal(null);
                        setToast("Order cancelled and stock restored.");
                      })
                    }
                  >
                    Cancel order
                  </button>
                )}
            </>
          )}
        </Modal>
      )}
    </>
  );
}
WorkspaceDialogs.propTypes = { context: PropTypes.object.isRequired };

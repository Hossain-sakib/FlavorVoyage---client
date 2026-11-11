// Shared Tailwind recipes. Semantic names keep the workspace markup readable;
// literal utility strings let Tailwind detect every style at build time.
const form =
  "[&_label]:grid [&_label]:gap-2 [&_label]:text-sm [&_label]:font-medium [&_input]:min-w-0 [&_input]:w-full [&_input]:rounded-xl [&_input]:border [&_input]:border-line [&_input]:bg-surface [&_input]:px-3 [&_input]:py-3 [&_select]:w-full [&_select]:rounded-xl [&_select]:border [&_select]:border-line [&_select]:bg-surface [&_select]:px-3 [&_select]:py-3 [&_textarea]:w-full [&_textarea]:rounded-xl [&_textarea]:border [&_textarea]:border-line [&_textarea]:px-3 [&_textarea]:py-3 [&_textarea]:min-h-24 [&_form]:space-y-5";
const recipes = {
  "app-shell":
    "min-h-screen bg-workspace text-ink antialiased font-sans text-sm [&_:focus-visible]:outline-2 [&_:focus-visible]:outline-offset-4 [&_:focus-visible]:outline-purple-600",
  sidebar:
    "fixed inset-y-0 left-0 z-40 hidden w-64 flex-col gap-5 overflow-y-auto border-r border-line bg-surface p-5 lg:flex",
  "mobile-open": "!flex",
  "nav-scrim": "fixed inset-0 z-30 bg-black/40 lg:hidden",
  "main-shell": "min-h-screen min-w-0 lg:ml-64",
  topbar:
    "sticky top-0 z-20 flex items-center justify-between gap-2 border-b border-line bg-surface/95 px-4 py-3 backdrop-blur sm:px-6 lg:px-8",
  "topbar-left": "flex min-w-0 items-center gap-2",
  "topbar-actions": "flex min-w-0 items-center gap-2",
  breadcrumb: "hidden text-muted sm:block [&_strong]:text-ink",
  "mobile-menu": "lg:hidden",
  "market-location": "hidden items-center gap-2 text-xs text-muted md:flex",
  "top-avatar":
    "grid size-10 place-items-center rounded-full bg-warning-soft font-bold",
  logo: "flex items-center py-2",
  "workspace-label":
    "px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted",
  "nav-item":
    "my-1 flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-3 text-left font-medium text-muted transition hover:bg-subtle [&_svg]:size-5 [&_b]:ml-auto",
  active: "!bg-action !text-on-action",
  selected: "!border-[#30213f] !bg-action !text-on-action",
  "sidebar-bottom": "mt-auto pt-5",
  profile:
    "flex w-full items-center gap-3 border-t border-line pt-5 text-left [&_strong]:block [&_strong]:max-w-32 [&_strong]:truncate [&_small]:block [&_small]:text-xs [&_small]:text-muted",
  avatar:
    "grid size-10 shrink-0 place-items-center rounded-full bg-warning-soft text-xs font-bold",
  "marketplace-home-link":
    "flex items-center gap-2 rounded-xl bg-subtle p-3 text-xs",
  button:
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-action px-5 py-3 text-sm font-semibold text-on-action transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50",
  secondary: "!border !border-line !bg-surface !text-ink hover:!bg-subtle",
  danger: "!text-danger",
  small: "!min-h-9 !px-3 !py-2 !text-xs",
  "full-width": "w-full",
  "text-button":
    "inline-flex items-center gap-2 py-2 text-sm font-semibold text-accent hover:underline disabled:opacity-40",
  "icon-button":
    "inline-grid size-11 shrink-0 place-items-center rounded-full hover:bg-subtle",
  "cart-button":
    "inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-xl border border-line px-3 py-2 [&_b]:rounded-full [&_b]:bg-warning-soft [&_b]:px-2",
  "page-heading":
    "mb-6 flex flex-wrap items-center justify-between gap-4 [&_h1]:mt-2 [&_h1]:text-3xl [&_h1]:font-bold [&_p]:mt-3 [&_p]:text-muted",
  eyebrow: "text-[10px] font-semibold uppercase tracking-[0.2em] text-muted",
  panel: "rounded-2xl border border-line bg-surface p-6 shadow-sm",
  "page-footer":
    "mt-12 flex flex-wrap justify-between gap-3 border-t border-line py-6 text-xs text-muted",
  "modal-panel": `fixed inset-0 m-auto max-h-[90dvh] w-[min(92vw,40rem)] overflow-y-auto rounded-3xl border-0 bg-surface p-6 text-ink shadow-2xl backdrop:bg-black/45 ${form}`,
  wide: "!w-[min(94vw,64rem)]",
  "modal-heading":
    "mb-6 flex items-center justify-between gap-4 [&_h2]:text-2xl [&_h2]:font-bold",
  "modal-intro": "my-4 text-sm leading-7 text-muted",
  "form-row": "grid gap-4 sm:grid-cols-2",
  three: "sm:!grid-cols-3",
  "form-actions": "mt-5 flex flex-wrap gap-3",
  "form-help": "text-xs leading-6 text-muted",
  muted: "text-muted",
  "auth-switch":
    "mt-5 text-center text-sm [&_button]:font-bold [&_button]:underline",
  "account-summary":
    "grid justify-items-center gap-3 py-5 [&_h3]:text-xl [&_h3]:font-semibold",
  "auth-divider": "my-5 flex items-center justify-center text-xs text-muted",
  "google-linked": "my-4 flex items-center gap-2 text-success",
  "google-auth-button":
    "flex min-h-12 w-full items-center justify-center gap-3 rounded-xl border border-line bg-surface px-4 py-3 font-semibold hover:bg-subtle disabled:opacity-50 [&_svg]:size-5",
  "demo-inbox-preview":
    "my-4 rounded-xl border border-line bg-warning-soft p-3 text-xs [&_summary]:cursor-pointer [&_button]:mt-2",
  "error-banner":
    "my-4 rounded-xl border border-line bg-danger-soft p-4 text-sm text-danger",
  "info-banner": "my-4 rounded-xl bg-info-soft p-4 text-info",
  "demo-banner":
    "mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-warning-soft p-4 text-xs leading-6 [&>div]:flex [&>div]:gap-4",
  "loading-state": "grid min-h-64 place-items-center text-muted",
  "empty-state":
    "grid min-h-48 place-content-center justify-items-center gap-4 rounded-2xl border border-dashed border-line bg-surface p-8 text-center [&_h2]:text-xl [&_h3]:text-xl [&_p]:max-w-lg [&_p]:text-muted [&>svg]:size-8",
  "signin-prompt":
    "my-6 flex flex-wrap items-center justify-center gap-4 rounded-xl bg-subtle p-5",
  "toast-message":
    "fixed bottom-5 left-1/2 z-[100] flex w-[min(92vw,36rem)] -translate-x-1/2 items-center justify-between gap-3 rounded-2xl bg-[#30213f] px-5 py-4 text-white shadow-xl",
  "stats-grid": "mb-8 grid grid-cols-2 gap-4 xl:grid-cols-4",
  "stat-card":
    "rounded-2xl border border-line bg-surface p-5 [&>strong]:my-4 [&>strong]:block [&>strong]:text-3xl [&>strong]:font-bold [&_small]:text-xs [&_small]:text-muted",
  "stat-top":
    "flex items-center justify-between gap-3 text-xs text-muted [&_svg]:size-5",
  "dashboard-actions": "mb-7 grid gap-4 md:grid-cols-3",
  "dashboard-action":
    "grid gap-3 rounded-2xl border border-line bg-surface p-5 text-left transition hover:border-amber-400 [&_svg]:size-6 [&_strong]:text-base [&_span]:text-xs [&_span]:text-muted",
  "section-block": "my-8",
  "section-heading":
    "mb-5 flex flex-wrap items-center justify-between gap-3 [&_h2]:text-xl [&_h2]:font-bold [&_p]:mt-2 [&_p]:text-muted",
  "bottom-panels": "mt-7 grid gap-5 xl:grid-cols-[2fr_1fr]",
  "partner-panel":
    "rounded-2xl bg-warning-soft p-6 [&_h2]:my-5 [&_h2]:text-2xl [&_p]:leading-7",
  "partner-avatars":
    "my-4 flex gap-2 [&_span]:grid [&_span]:size-9 [&_span]:place-items-center [&_span]:rounded-full [&_span]:bg-surface",
  "catalog-tools": `mb-5 grid gap-3 md:grid-cols-[2fr_1fr_1fr] ${form}`,
  "search-field":
    "flex items-center gap-3 rounded-xl border border-line bg-surface px-4 [&_input]:w-full [&_input]:border-0 [&_input]:py-3 [&_input]:outline-none",
  "category-tabs":
    "mb-5 flex gap-2 overflow-x-auto pb-3 [&_button]:shrink-0 [&_button]:rounded-xl [&_button]:border [&_button]:border-line [&_button]:bg-surface [&_button]:px-4 [&_button]:py-3 [&_button]:text-xs",
  "results-line":
    "mb-4 flex flex-wrap justify-between gap-3 text-xs text-muted",
  "product-grid": "grid gap-4 sm:grid-cols-2 xl:grid-cols-4",
  "product-card":
    "overflow-hidden rounded-2xl border border-line bg-surface transition motion-safe:hover:-translate-y-1 hover:shadow-lg",
  "product-visual": "relative grid h-52 place-items-center bg-subtle p-5",
  "product-art":
    "h-44 w-full max-w-full rounded-xl bg-white object-contain p-2",
  "product-badge":
    "absolute left-3 top-3 rounded-full bg-surface px-3 py-1 text-[10px]",
  "detail-button":
    "absolute right-3 top-3 grid size-8 place-items-center rounded-full bg-surface",
  "product-info": "space-y-3 p-4",
  "brand-line":
    "flex justify-between gap-2 text-[10px] text-muted [&_span]:flex [&_span]:items-center [&_span]:gap-1",
  "product-name": "text-left text-sm font-bold",
  "pack-size": "text-xs text-muted",
  "product-bottom":
    "flex items-center justify-between gap-2 [&_strong]:text-lg [&_small]:text-xs [&_small]:text-muted",
  "add-button":
    "grid size-11 place-items-center rounded-xl bg-action text-on-action disabled:opacity-30",
  "stock-line": "text-[10px] text-success",
  "order-list": "grid gap-4",
  "order-card": "rounded-2xl border border-line bg-surface p-5",
  "order-header":
    "flex flex-wrap items-start justify-between gap-3 [&_h3]:font-bold [&_p]:mt-2 [&_p]:text-xs [&_p]:text-muted",
  "order-items":
    "my-5 flex flex-wrap gap-2 [&_span]:rounded-lg [&_span]:bg-subtle [&_span]:px-3 [&_span]:py-2 [&_span]:text-xs",
  "order-footer":
    "flex flex-wrap items-center justify-between gap-3 [&_strong]:text-xl",
  "inline-actions": "flex flex-wrap gap-3",
  status:
    "inline-flex rounded-full bg-subtle px-3 py-1 text-xs font-medium capitalize",
  pending: "!bg-warning-soft !text-warning",
  confirmed: "!bg-info-soft !text-info",
  delivered: "!bg-success-soft !text-success",
  cancelled: "!bg-danger-soft !text-danger",
  shipped: "!bg-purple-soft !text-accent",
  offered: "!bg-purple-soft",
  accepted: "!bg-success-soft",
  "basket-lines": "divide-y divide-line",
  "basket-line":
    "grid grid-cols-[4rem_1fr] items-center gap-4 py-5 sm:grid-cols-[4rem_1fr_auto] [&>img]:h-20",
  "basket-line-info":
    "grid gap-2 [&_h3]:font-bold [&_small]:text-xs [&_small]:text-muted",
  "basket-controls":
    "col-span-2 flex items-center justify-between gap-3 sm:col-span-1 sm:flex-col",
  "quantity-control":
    "inline-flex items-center rounded-xl border border-line [&_button]:p-2 [&_input]:!w-12 [&_input]:!border-0 [&_input]:!p-1 [&_input]:text-center",
  "basket-total":
    "my-5 flex justify-between gap-4 border-t border-line pt-5 [&_strong]:text-2xl [&_strong]:font-bold",
  "delivery-details":
    "my-5 rounded-xl bg-subtle p-4 [&_h3]:mb-3 [&_h3]:flex [&_h3]:gap-2 [&_p]:leading-7",
  "quote-grid": "grid min-w-0 gap-4 lg:grid-cols-2",
  "quote-card": "rounded-2xl border border-line bg-surface p-5",
  "quote-lines":
    "my-5 divide-y divide-line [&>div]:flex [&>div]:justify-between [&>div]:gap-4 [&>div]:py-4 [&_small]:mt-2 [&_small]:block [&_small]:text-xs [&_small]:text-muted",
  "quote-note": "my-4 rounded-xl bg-subtle p-4 text-sm leading-7",
  "inventory-panel": "min-w-0 max-w-full overflow-hidden",
  "table-scroll":
    "block w-full min-w-0 max-w-full contain-content overflow-x-auto overscroll-x-contain [&_table]:w-full [&_th]:px-4 [&_th]:py-4 [&_th]:text-left [&_th]:text-xs [&_td]:border-t [&_td]:border-line [&_td]:px-4 [&_td]:py-4 [&_td]:text-sm",
  "inventory-product":
    "flex min-w-40 items-center gap-3 [&_img]:h-14 [&_img]:w-12 [&_small]:block [&_small]:text-xs [&_small]:text-muted",
  "market-section-heading":
    "mb-6 flex flex-wrap items-center justify-between gap-4 [&_h2]:my-3 [&_h2]:text-2xl [&_h2]:font-bold [&_p]:max-w-2xl [&_p]:leading-7 [&_p]:text-muted",
  "fv-kicker":
    "text-[10px] font-semibold uppercase tracking-[0.2em] text-warm-ink",
  "market-note": "my-4 text-xs leading-6 text-muted",
  "dealer-tools": `my-4 grid gap-4 sm:grid-cols-2 ${form}`,
  "nearby-grid": "grid gap-5 md:grid-cols-2 xl:grid-cols-3",
  "nearby-card":
    "rounded-2xl border border-line bg-surface p-6 shadow-sm [&_h3]:my-4 [&_h3]:text-lg [&_h3]:font-bold [&_p]:my-3 [&_p]:flex [&_p]:items-center [&_p]:gap-2 [&_p]:text-xs [&_p]:text-muted",
  "dealer-card-top": "flex items-center justify-between gap-3",
  "dealer-avatar":
    "grid size-12 place-items-center rounded-xl bg-subtle font-bold",
  "demo-label":
    "rounded-full bg-warning-soft px-3 py-1 text-[10px] text-warning",
  "dealer-distance": "!font-semibold !text-success",
  "dealer-offer":
    "my-4 grid min-w-0 gap-3 border-t border-line pt-4 [&_strong]:text-2xl [&_small]:text-xs [&_span]:text-xs [&_span]:text-muted",
  "dealer-actions": "grid gap-3",
  "dealer-map": "mt-4 block text-xs text-warning underline",
  "dealer-profile": form,
  inbox:
    "grid overflow-hidden rounded-2xl border border-line bg-surface lg:grid-cols-[18rem_1fr]",
  "conversation-list":
    "max-h-64 overflow-y-auto border-b border-line p-4 lg:max-h-none lg:border-r lg:border-b-0",
  "inbox-title":
    "mb-4 flex items-center justify-between [&_h2]:text-lg [&_h2]:font-bold",
  "conversation-item":
    "grid w-full gap-2 rounded-xl p-3 text-left [&>span]:truncate [&>span]:text-xs [&_small]:text-[10px] [&_small]:text-muted",
  "chat-panel":
    "flex min-w-0 flex-col [&>header]:border-b [&>header]:border-line [&>header]:p-5 [&_h2]:font-bold [&_header_p]:mt-2 [&_header_p]:text-xs [&_header_p]:text-muted",
  "demo-chat-note": "!text-warning",
  "message-history":
    "flex min-h-80 max-h-[32rem] flex-col gap-4 overflow-y-auto p-5",
  "chat-bubble":
    "max-w-[85%] self-start rounded-2xl bg-subtle px-4 py-3 break-words [&_p]:my-2 [&_p]:whitespace-pre-wrap [&_p]:leading-7 [&_small]:text-[10px] [&_time]:text-[10px] [&_time]:text-muted",
  mine: "!self-end !bg-success-soft",
  "message-form":
    "flex items-end gap-3 border-t border-line p-4 [&_textarea]:min-h-20 [&_textarea]:min-w-0 [&_textarea]:flex-1 [&_textarea]:rounded-xl [&_textarea]:border [&_textarea]:border-line [&_textarea]:p-3",
  "chat-error": "p-4 text-danger",
  "unread-badge": "ml-2 rounded-full bg-amber-200 px-2 py-1 text-xs",
  "detail-page": "min-h-screen bg-canvas",
  "detail-header":
    "flex items-center justify-between gap-3 border-b border-line bg-surface px-4 py-4 sm:px-6 lg:px-8",
  "logo-home": "text-left",
  "detail-main": "mx-auto max-w-7xl min-w-0 px-4 py-6 sm:px-6 lg:px-8",
  "product-detail-layout": "grid min-w-0 gap-6 py-6 lg:grid-cols-2 lg:gap-12",
  "detail-image":
    "grid min-w-0 min-h-64 place-items-center gap-4 rounded-3xl bg-subtle p-4 sm:p-6 [&_img]:h-64 sm:[&_img]:h-80 [&_span]:text-center [&_span]:text-xs [&_span]:text-muted",
  "detail-copy":
    "min-w-0 [&_h1]:my-4 [&_h1]:text-3xl sm:[&_h1]:text-4xl [&_h1]:font-bold [&_p]:leading-7",
  "detail-price":
    "mt-6 text-3xl font-bold [&_small]:text-sm [&_small]:font-normal",
  "variant-picker":
    "my-6 flex flex-wrap gap-3 border-0 [&_legend]:mb-3 [&_legend]:font-bold [&_button]:rounded-xl [&_button]:border [&_button]:border-line [&_button]:bg-surface [&_button]:px-5 [&_button]:py-3",
  "detail-specs":
    "my-6 grid grid-cols-3 gap-3 border-y border-line py-5 [&_span]:block [&_span]:text-xs [&_span]:text-muted [&_strong]:mt-2 [&_strong]:block [&_strong]:text-xs",
  "reviews-section": "my-12",
  "reviews-layout": "grid gap-7 lg:grid-cols-[1.5fr_1fr]",
  "rating-summary":
    "flex items-center gap-2 text-warm-ink [&_strong]:text-2xl [&_span]:text-xs",
  "review-card":
    "mb-4 rounded-2xl border border-line bg-surface p-5 [&>div]:flex [&>div]:justify-between [&_small]:my-3 [&_small]:block [&_small]:text-xs [&_small]:text-muted [&_p]:leading-7",
  "review-empty":
    "grid gap-4 rounded-2xl border border-dashed border-line p-8 [&_h3]:font-bold [&_p]:leading-7 [&_p]:text-muted",
  "review-form-card": `h-fit rounded-2xl bg-surface p-6 ring-1 ring-line ${form}`,
  "recent-products": "my-10",
  "recent-grid":
    "grid gap-4 sm:grid-cols-2 xl:grid-cols-4 [&_button]:flex [&_button]:min-w-0 [&_span]:min-w-0 [&_span]:break-words [&_img]:shrink-0 [&_button]:items-center [&_button]:gap-4 [&_button]:rounded-2xl [&_button]:border [&_button]:border-line [&_button]:bg-surface [&_button]:p-4 [&_button]:text-left [&_img]:h-20 [&_img]:w-16 [&_small]:mt-2 [&_small]:block [&_small]:text-xs [&_small]:text-muted",
  "compare-dialog":
    "fixed inset-0 m-auto max-h-[90dvh] w-[min(95vw,70rem)] overflow-auto rounded-3xl border-0 bg-surface p-6 shadow-2xl backdrop:bg-black/40",
  "compare-heading":
    "mb-5 flex items-start justify-between gap-4 [&_h2]:my-3 [&_h2]:text-2xl [&_h2]:font-bold [&_p]:text-sm [&_p]:text-muted",
  "compare-table-scroll": "overflow-x-auto",
  "compare-table":
    "w-full min-w-[36rem] text-left [&_th]:p-4 [&_td]:p-4 [&_td]:text-sm [&_tr]:border-b [&_tr]:border-line [&_img]:h-32 [&_button]:mt-3 [&_button]:font-bold",
  "address-book": "grid gap-6 lg:grid-cols-2",
  "address-list": "space-y-4",
  "address-card":
    "rounded-2xl border border-line bg-surface p-6 shadow-sm [&_h2]:my-3 [&_h2]:font-bold [&_p]:leading-7 [&_p]:text-muted",
  "address-form": form,
  "sr-only": "sr-only",
  spin: "animate-spin",
  "fv-website":
    "bg-canvas text-ink [&_:focus-visible]:outline-2 [&_:focus-visible]:outline-offset-4 [&_:focus-visible]:outline-purple-600",
  "fv-brand": "inline-flex items-center gap-3",
  "fv-brand-mark": "size-11 shrink-0",
  "fv-wordmark":
    "text-xl font-bold tracking-tight [&>span]:font-medium [&_small]:mt-1 [&_small]:block [&_small]:text-[7px] [&_small]:font-semibold [&_small]:tracking-[0.15em] [&_small]:text-muted",
};
export function classes(value = "") {
  return String(value)
    .split(/\s+/)
    .filter(Boolean)
    .map((name) => (recipes[name] ? `${name} ${recipes[name]}` : name))
    .join(" ");
}

// Shared Tailwind recipes. Semantic names keep the workspace markup readable;
// literal utility strings let Tailwind detect every style at build time.
const form =
  "[&_label]:grid [&_label]:gap-2 [&_label]:text-sm [&_label]:font-medium [&_input]:min-w-0 [&_input]:w-full [&_input]:rounded-xl [&_input]:border [&_input]:border-stone-200 [&_input]:bg-white [&_input]:px-3 [&_input]:py-3 [&_select]:w-full [&_select]:rounded-xl [&_select]:border [&_select]:border-stone-200 [&_select]:bg-white [&_select]:px-3 [&_select]:py-3 [&_textarea]:w-full [&_textarea]:rounded-xl [&_textarea]:border [&_textarea]:border-stone-200 [&_textarea]:px-3 [&_textarea]:py-3 [&_textarea]:min-h-24 [&_form]:space-y-5";
const recipes = {
  "app-shell":
    "min-h-screen bg-stone-50 text-[#30213f] antialiased font-sans text-sm",
  sidebar:
    "fixed inset-y-0 left-0 z-40 hidden w-64 flex-col gap-5 overflow-y-auto border-r border-stone-200 bg-white p-5 lg:flex",
  "mobile-open": "!flex",
  "nav-scrim": "fixed inset-0 z-30 bg-black/40 lg:hidden",
  "main-shell": "min-h-screen lg:ml-64",
  topbar:
    "sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-stone-200 bg-white/95 px-5 py-4 backdrop-blur md:px-8",
  "topbar-left": "flex items-center gap-3",
  "topbar-actions": "flex items-center gap-3",
  breadcrumb: "hidden text-stone-500 sm:block [&_strong]:text-[#30213f]",
  "mobile-menu": "lg:hidden",
  "market-location": "hidden items-center gap-2 text-xs text-stone-500 md:flex",
  "top-divider": "hidden",
  "top-avatar":
    "grid size-10 place-items-center rounded-full bg-amber-100 font-bold",
  logo: "flex items-center py-2",
  "workspace-label":
    "px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-400",
  "nav-item":
    "my-1 flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-3 text-left font-medium text-stone-600 transition hover:bg-stone-100 [&_svg]:size-5 [&_b]:ml-auto",
  active: "!bg-[#30213f] !text-white",
  selected: "!border-[#30213f] !bg-[#30213f] !text-white",
  "sidebar-bottom": "mt-auto pt-5",
  "grow-card": "hidden",
  profile:
    "flex w-full items-center gap-3 border-t border-stone-100 pt-5 text-left [&_strong]:block [&_strong]:max-w-32 [&_strong]:truncate [&_small]:block [&_small]:text-xs [&_small]:text-stone-500",
  avatar:
    "grid size-10 shrink-0 place-items-center rounded-full bg-amber-100 text-xs font-bold",
  "marketplace-home-link":
    "flex items-center gap-2 rounded-xl bg-stone-100 p-3 text-xs",
  button:
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#30213f] px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50",
  secondary:
    "!border !border-stone-200 !bg-white !text-[#30213f] hover:!bg-stone-50",
  danger: "!text-red-700",
  small: "!min-h-9 !px-3 !py-2 !text-xs",
  "full-width": "w-full",
  "text-button":
    "inline-flex items-center gap-2 py-2 text-sm font-semibold text-[#694680] hover:underline disabled:opacity-40",
  "icon-button":
    "inline-grid size-10 shrink-0 place-items-center rounded-full hover:bg-stone-100",
  "cart-button":
    "inline-flex items-center gap-2 rounded-xl border border-stone-200 px-3 py-2 [&_b]:rounded-full [&_b]:bg-amber-100 [&_b]:px-2",
  "page-heading":
    "mb-7 flex flex-wrap items-center justify-between gap-4 [&_h1]:mt-2 [&_h1]:text-3xl [&_h1]:font-bold [&_p]:mt-3 [&_p]:text-stone-500",
  eyebrow:
    "text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-500",
  panel: "rounded-2xl border border-stone-200 bg-white p-6",
  "page-footer":
    "mt-12 flex flex-wrap justify-between gap-3 border-t border-stone-200 py-6 text-xs text-stone-500",
  "modal-panel": `fixed inset-0 m-auto max-h-[90dvh] w-[min(92vw,40rem)] overflow-y-auto rounded-3xl border-0 bg-white p-6 text-[#30213f] shadow-2xl backdrop:bg-black/45 ${form}`,
  wide: "!w-[min(94vw,64rem)]",
  "modal-heading":
    "mb-6 flex items-center justify-between gap-4 [&_h2]:text-2xl [&_h2]:font-bold",
  "modal-intro": "my-4 text-sm leading-7 text-stone-500",
  "form-row": "grid gap-4 sm:grid-cols-2",
  three: "sm:!grid-cols-3",
  "form-actions": "mt-5 flex flex-wrap gap-3",
  "form-help": "text-xs leading-6 text-stone-500",
  muted: "text-stone-500",
  "auth-switch":
    "mt-5 text-center text-sm [&_button]:font-bold [&_button]:underline",
  "account-summary":
    "grid justify-items-center gap-3 py-5 [&_h3]:text-xl [&_h3]:font-semibold",
  "auth-divider":
    "my-5 flex items-center justify-center text-xs text-stone-400",
  "google-linked": "my-4 flex items-center gap-2 text-emerald-700",
  "google-auth-button":
    "flex min-h-12 w-full items-center justify-center gap-3 rounded-xl border border-stone-200 bg-white px-4 py-3 font-semibold hover:bg-stone-50 disabled:opacity-50 [&_svg]:size-5",
  "demo-inbox-preview":
    "my-4 rounded-xl border border-amber-100 bg-amber-50 p-3 text-xs [&_summary]:cursor-pointer [&_button]:mt-2",
  "error-banner":
    "my-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800",
  "info-banner": "my-4 rounded-xl bg-blue-50 p-4 text-blue-800",
  "demo-banner":
    "mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs leading-6 [&>div]:flex [&>div]:gap-4",
  "loading-state": "grid min-h-64 place-items-center text-stone-500",
  "empty-state":
    "grid min-h-48 place-content-center justify-items-center gap-4 rounded-2xl border border-dashed border-stone-200 bg-white p-8 text-center [&_h2]:text-xl [&_h3]:text-xl [&_p]:max-w-lg [&_p]:text-stone-500 [&>svg]:size-8",
  "signin-prompt":
    "my-6 flex flex-wrap items-center justify-center gap-4 rounded-xl bg-stone-100 p-5",
  "toast-message":
    "fixed bottom-5 left-1/2 z-[100] flex w-[min(92vw,36rem)] -translate-x-1/2 items-center justify-between gap-3 rounded-2xl bg-[#30213f] px-5 py-4 text-white shadow-xl",
  "hero-banner":
    "relative mb-7 grid gap-6 overflow-hidden rounded-3xl bg-[#30213f] p-7 text-white md:grid-cols-[1.2fr_1fr] md:p-10",
  "hero-copy":
    "relative z-10 [&_h2]:my-5 [&_h2]:text-4xl [&_h2]:font-bold [&_em]:font-serif [&_em]:text-amber-200 [&_p]:max-w-lg [&_p]:leading-7 [&_p]:text-stone-300",
  "hero-tag": "text-[10px] uppercase tracking-[0.15em] text-amber-200",
  "hero-art": "relative hidden min-h-60 items-center justify-center md:flex",
  "hero-pack": "absolute h-52 w-36 [&_img]:h-full",
  "pack-front": "left-12 top-2 rotate-[-10deg]",
  "pack-back": "right-4 top-0 rotate-12",
  "pack-side": "bottom-0 left-1/3",
  "hero-platform": "absolute bottom-0 h-12 w-full rounded-full bg-amber-200/20",
  "hero-sticker":
    "absolute bottom-0 right-0 rounded-full bg-amber-200 p-6 text-center text-xs text-[#30213f]",
  "hero-mini-card": "hidden",
  "hero-assurance": "mt-6 flex flex-wrap gap-4 text-xs text-stone-300",
  "hero-button":
    "mt-5 inline-flex items-center gap-2 rounded-xl bg-amber-100 px-5 py-3 font-bold text-[#30213f]",
  orbit: "hidden",
  "art-spark": "hidden",
  "stats-grid": "mb-8 grid grid-cols-2 gap-4 xl:grid-cols-4",
  "stat-card":
    "rounded-2xl border border-stone-200 bg-white p-5 [&>strong]:my-4 [&>strong]:block [&>strong]:text-3xl [&>strong]:font-bold [&_small]:text-xs [&_small]:text-stone-400",
  "stat-top":
    "flex items-center justify-between gap-3 text-xs text-stone-500 [&_svg]:size-5",
  "dashboard-actions": "mb-7 grid gap-4 md:grid-cols-3",
  "dashboard-action":
    "grid gap-3 rounded-2xl border border-stone-200 bg-white p-5 text-left transition hover:border-amber-400 [&_svg]:size-6 [&_strong]:text-base [&_span]:text-xs [&_span]:text-stone-500",
  "section-block": "my-8",
  "section-heading":
    "mb-5 flex items-center justify-between gap-3 [&_h2]:text-xl [&_h2]:font-bold [&_p]:mt-2 [&_p]:text-stone-500",
  "bottom-panels": "mt-7 grid gap-5 xl:grid-cols-[2fr_1fr]",
  "partner-panel":
    "rounded-2xl bg-amber-100 p-6 [&_h2]:my-5 [&_h2]:text-2xl [&_p]:leading-7",
  "partner-avatars":
    "my-4 flex gap-2 [&_span]:grid [&_span]:size-9 [&_span]:place-items-center [&_span]:rounded-full [&_span]:bg-white",
  "catalog-tools": `mb-5 grid gap-3 md:grid-cols-[2fr_1fr_1fr] ${form}`,
  "search-field":
    "flex items-center gap-3 rounded-xl border border-stone-200 bg-white px-4 [&_input]:w-full [&_input]:border-0 [&_input]:py-3 [&_input]:outline-none",
  "category-tabs":
    "mb-5 flex gap-2 overflow-x-auto pb-3 [&_button]:shrink-0 [&_button]:rounded-xl [&_button]:border [&_button]:border-stone-200 [&_button]:bg-white [&_button]:px-4 [&_button]:py-3 [&_button]:text-xs",
  "results-line": "mb-4 flex justify-between gap-3 text-xs text-stone-500",
  "product-grid": "grid gap-5 sm:grid-cols-2 xl:grid-cols-4",
  "product-card":
    "overflow-hidden rounded-2xl border border-stone-200 bg-white transition hover:-translate-y-1 hover:shadow-lg",
  "product-visual": "relative grid h-52 place-items-center bg-stone-100 p-5",
  "product-art": "h-44 w-full object-contain",
  "product-badge":
    "absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-[10px]",
  "detail-button":
    "absolute right-3 top-3 grid size-8 place-items-center rounded-full bg-white",
  "product-info": "space-y-3 p-4",
  "brand-line":
    "flex justify-between gap-2 text-[10px] text-stone-400 [&_span]:flex [&_span]:items-center [&_span]:gap-1",
  "product-name": "text-left text-sm font-bold",
  "pack-size": "text-xs text-stone-500",
  "product-bottom":
    "flex items-center justify-between gap-2 [&_strong]:text-lg [&_small]:text-xs [&_small]:text-stone-500",
  "add-button":
    "grid size-9 place-items-center rounded-xl bg-[#30213f] text-white disabled:opacity-30",
  "stock-line": "text-[10px] text-emerald-700",
  "order-list": "grid gap-4",
  "order-card": "rounded-2xl border border-stone-200 bg-white p-5",
  "order-header":
    "flex items-start justify-between gap-3 [&_h3]:font-bold [&_p]:mt-2 [&_p]:text-xs [&_p]:text-stone-500",
  "order-items":
    "my-5 flex flex-wrap gap-2 [&_span]:rounded-lg [&_span]:bg-stone-100 [&_span]:px-3 [&_span]:py-2 [&_span]:text-xs",
  "order-footer":
    "flex flex-wrap items-center justify-between gap-3 [&_strong]:text-xl",
  "inline-actions": "flex flex-wrap gap-3",
  status:
    "inline-flex rounded-full bg-stone-100 px-3 py-1 text-xs font-medium capitalize",
  pending: "!bg-amber-100 !text-amber-800",
  confirmed: "!bg-blue-100 !text-blue-800",
  delivered: "!bg-emerald-100 !text-emerald-800",
  cancelled: "!bg-red-100 !text-red-800",
  shipped: "!bg-violet-100 !text-violet-800",
  offered: "!bg-violet-100",
  accepted: "!bg-emerald-100",
  "basket-lines": "divide-y divide-stone-100",
  "basket-line":
    "grid grid-cols-[4rem_1fr] items-center gap-4 py-5 sm:grid-cols-[4rem_1fr_auto] [&>img]:h-20",
  "basket-line-info":
    "grid gap-2 [&_h3]:font-bold [&_small]:text-xs [&_small]:text-stone-500",
  "basket-controls":
    "col-span-2 flex items-center justify-between gap-3 sm:col-span-1 sm:flex-col",
  "quantity-control":
    "inline-flex items-center rounded-xl border border-stone-200 [&_button]:p-2 [&_input]:!w-12 [&_input]:!border-0 [&_input]:!p-1 [&_input]:text-center",
  "basket-total":
    "my-5 flex justify-between gap-4 border-t border-stone-200 pt-5 [&_strong]:text-2xl [&_strong]:font-bold",
  "delivery-details":
    "my-5 rounded-xl bg-stone-50 p-4 [&_h3]:mb-3 [&_h3]:flex [&_h3]:gap-2 [&_p]:leading-7",
  "quote-grid": "grid gap-4 lg:grid-cols-2",
  "quote-card": "rounded-2xl border border-stone-200 bg-white p-5",
  "quote-lines":
    "my-5 divide-y divide-stone-100 [&>div]:flex [&>div]:justify-between [&>div]:gap-4 [&>div]:py-4 [&_small]:mt-2 [&_small]:block [&_small]:text-xs [&_small]:text-stone-500",
  "quote-note": "my-4 rounded-xl bg-stone-50 p-4 text-sm leading-7",
  "inventory-panel": "overflow-hidden",
  "table-scroll":
    "overflow-x-auto [&_table]:w-full [&_th]:px-4 [&_th]:py-4 [&_th]:text-left [&_th]:text-xs [&_td]:border-t [&_td]:border-stone-100 [&_td]:px-4 [&_td]:py-4 [&_td]:text-sm",
  "inventory-product":
    "flex min-w-40 items-center gap-3 [&_img]:h-14 [&_img]:w-12 [&_small]:block [&_small]:text-xs [&_small]:text-stone-500",
  "market-section-heading":
    "mb-6 flex flex-wrap items-center justify-between gap-4 [&_h2]:my-3 [&_h2]:text-2xl [&_h2]:font-bold [&_p]:max-w-2xl [&_p]:leading-7 [&_p]:text-stone-500",
  "fv-kicker":
    "text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-700",
  "market-note": "my-4 text-xs leading-6 text-stone-500",
  "dealer-tools": `my-4 grid gap-4 sm:grid-cols-2 ${form}`,
  "nearby-grid": "grid gap-5 md:grid-cols-2 xl:grid-cols-3",
  "nearby-card":
    "rounded-2xl border border-stone-200 bg-white p-6 [&_h3]:my-4 [&_h3]:text-lg [&_h3]:font-bold [&_p]:my-3 [&_p]:flex [&_p]:items-center [&_p]:gap-2 [&_p]:text-xs [&_p]:text-stone-500",
  "dealer-card-top": "flex items-center justify-between gap-3",
  "dealer-avatar":
    "grid size-12 place-items-center rounded-xl bg-stone-100 font-bold",
  "demo-label": "rounded-full bg-amber-50 px-3 py-1 text-[10px] text-amber-800",
  "dealer-distance": "!font-semibold !text-emerald-700",
  "dealer-offer":
    "my-4 grid gap-3 border-t border-stone-100 pt-4 [&_strong]:text-2xl [&_small]:text-xs [&_span]:text-xs [&_span]:text-stone-500",
  "dealer-actions": "grid gap-3",
  "dealer-map": "mt-4 block text-xs text-amber-800 underline",
  "dealer-profile": form,
  inbox:
    "grid overflow-hidden rounded-2xl border border-stone-200 bg-white lg:grid-cols-[18rem_1fr]",
  "conversation-list":
    "max-h-64 overflow-y-auto border-b border-stone-200 p-4 lg:max-h-none lg:border-r lg:border-b-0",
  "inbox-title":
    "mb-4 flex items-center justify-between [&_h2]:text-lg [&_h2]:font-bold",
  "conversation-item":
    "grid w-full gap-2 rounded-xl p-3 text-left [&>span]:truncate [&>span]:text-xs [&_small]:text-[10px] [&_small]:text-stone-400",
  "chat-panel":
    "flex min-w-0 flex-col [&>header]:border-b [&>header]:border-stone-100 [&>header]:p-5 [&_h2]:font-bold [&_header_p]:mt-2 [&_header_p]:text-xs [&_header_p]:text-stone-500",
  "demo-chat-note": "!text-amber-800",
  "message-history":
    "flex min-h-80 max-h-[32rem] flex-col gap-4 overflow-y-auto p-5",
  "chat-bubble":
    "max-w-[85%] self-start rounded-2xl bg-stone-100 px-4 py-3 break-words [&_p]:my-2 [&_p]:whitespace-pre-wrap [&_p]:leading-7 [&_small]:text-[10px] [&_time]:text-[10px] [&_time]:text-stone-500",
  mine: "!self-end !bg-emerald-50",
  "message-form":
    "flex items-end gap-3 border-t border-stone-100 p-4 [&_textarea]:min-h-20 [&_textarea]:min-w-0 [&_textarea]:flex-1 [&_textarea]:rounded-xl [&_textarea]:border [&_textarea]:border-stone-200 [&_textarea]:p-3",
  "chat-error": "p-4 text-red-700",
  "unread-badge": "ml-2 rounded-full bg-amber-200 px-2 py-1 text-xs",
  "detail-page": "min-h-screen bg-[#fffcf7]",
  "detail-header":
    "flex items-center justify-between gap-3 border-b border-stone-200 bg-white px-5 py-5 md:px-12",
  "logo-home": "text-left",
  "detail-main": "mx-auto max-w-7xl px-5 py-7 md:px-10",
  "product-detail-layout": "grid gap-9 py-8 lg:grid-cols-2 lg:gap-16",
  "detail-image":
    "grid min-h-80 place-content-center justify-items-center gap-6 rounded-3xl bg-stone-100 p-8 [&_img]:h-80 [&_span]:text-center [&_span]:text-xs [&_span]:text-stone-500",
  "detail-copy": "[&_h1]:my-5 [&_h1]:text-4xl [&_h1]:font-bold [&_p]:leading-7",
  "detail-price":
    "mt-6 text-3xl font-bold [&_small]:text-sm [&_small]:font-normal",
  "variant-picker":
    "my-6 flex flex-wrap gap-3 border-0 [&_legend]:mb-3 [&_legend]:font-bold [&_button]:rounded-xl [&_button]:border [&_button]:border-stone-200 [&_button]:bg-white [&_button]:px-5 [&_button]:py-3",
  "detail-specs":
    "my-6 grid grid-cols-3 gap-3 border-y border-stone-200 py-5 [&_span]:block [&_span]:text-xs [&_span]:text-stone-500 [&_strong]:mt-2 [&_strong]:block [&_strong]:text-xs",
  "reviews-section": "my-12",
  "reviews-layout": "grid gap-7 lg:grid-cols-[1.5fr_1fr]",
  "rating-summary":
    "flex items-center gap-2 text-amber-600 [&_strong]:text-2xl [&_span]:text-xs",
  "review-card":
    "mb-4 rounded-2xl border border-stone-200 bg-white p-5 [&>div]:flex [&>div]:justify-between [&_small]:my-3 [&_small]:block [&_small]:text-xs [&_small]:text-stone-500 [&_p]:leading-7",
  "review-empty":
    "grid gap-4 rounded-2xl border border-dashed border-stone-200 p-8 [&_h3]:font-bold [&_p]:leading-7 [&_p]:text-stone-500",
  "review-form-card": `h-fit rounded-2xl bg-white p-6 ring-1 ring-stone-200 ${form}`,
  "recent-products": "my-10",
  "recent-grid":
    "grid grid-cols-2 gap-4 lg:grid-cols-4 [&_button]:flex [&_button]:items-center [&_button]:gap-4 [&_button]:rounded-2xl [&_button]:border [&_button]:border-stone-200 [&_button]:bg-white [&_button]:p-4 [&_button]:text-left [&_img]:h-20 [&_img]:w-16 [&_small]:mt-2 [&_small]:block [&_small]:text-xs [&_small]:text-stone-500",
  "compare-dialog":
    "fixed inset-0 m-auto max-h-[90dvh] w-[min(95vw,70rem)] overflow-auto rounded-3xl border-0 bg-white p-6 shadow-2xl backdrop:bg-black/40",
  "compare-heading":
    "mb-5 flex items-start justify-between gap-4 [&_h2]:my-3 [&_h2]:text-2xl [&_h2]:font-bold [&_p]:text-sm [&_p]:text-stone-500",
  "compare-table-scroll": "overflow-x-auto",
  "compare-table":
    "w-full min-w-[36rem] text-left [&_th]:p-4 [&_td]:p-4 [&_td]:text-sm [&_tr]:border-b [&_tr]:border-stone-100 [&_img]:h-32 [&_button]:mt-3 [&_button]:font-bold",
  "address-book": "grid gap-6 lg:grid-cols-2",
  "address-list": "space-y-4",
  "address-card":
    "rounded-2xl border border-stone-200 bg-white p-6 [&_h2]:my-3 [&_h2]:font-bold [&_p]:leading-7 [&_p]:text-stone-500",
  "address-form": form,
  "sr-only": "sr-only",
  spin: "animate-spin",
  "desktop-br": "hidden md:block",
  "fv-website": "bg-[#fffcf7] text-[#30213f]",
  "fv-brand": "inline-flex items-center gap-3",
  "fv-brand-mark": "size-11 shrink-0",
  "fv-wordmark":
    "text-xl font-bold tracking-tight [&>span]:font-medium [&_small]:mt-1 [&_small]:block [&_small]:text-[7px] [&_small]:font-semibold [&_small]:tracking-[0.15em] [&_small]:text-stone-400",
};
export function classes(value = "") {
  return String(value)
    .split(/\s+/)
    .filter(Boolean)
    .map((name) => (recipes[name] ? `${name} ${recipes[name]}` : name))
    .join(" ");
}

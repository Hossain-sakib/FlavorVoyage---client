# FlavorVoyage

A Bangladesh beverage discovery website and business marketplace. The public
website is open to everyone; customers and retailers can compare packs, find
local dealers, message them, request quotes and buy by the case.

## Architecture

- React with Tailwind CSS 4 through Vite. There are no handwritten CSS stylesheets;
  `src/index.css` defines the Tailwind palette, and `src/ui/classes.js` contains shared utility recipes.
- `Website.jsx` handles discovery and company, distributor, size, price and keyword filters.
- Product pages include variants, composition notes, comparison, reviews and recently viewed items.
- `DealerFinder`, `Inbox`, `AddressBook` and `AdminDashboard` are separate features.
- `ThemeControl` is a single light/dark button. Light is the default; explicit choices are saved. Semantic Tailwind colors are shared by all pages and dialogs; `public/theme-init.js` applies the preference before first paint.
- `NotificationCenter` polls private activity every 15 seconds while visible. Read status is stored on the server; notifications link to orders, quotes and private conversations. No browser-push or email delivery is enabled.
- Firebase Google sign-in exchanges a verified ID token for a server HttpOnly session.
- Product images uploaded by dealers/admins go through the authenticated Cloudinary API.
- Every product, price, variant, stock quantity, order and conversation is read from the API/database.
  No product catalog is bundled into the deployed API or rendered from a frontend seed array.
- Static public HTML and sitemap files are generated from a snapshot of the hosted API during build.
  Runtime requests and checkout still use current database values.

The API is maintained in [FlavorVoyage-server](https://github.com/Hossain-sakib/FlavorVoyage-server).
Check out the two repositories beside each other using their original names.

## Development and checks

Use Node 24 and Python 3. Install dependencies with `npm ci` in both repositories.
Run the server first and `npm run dev` here. A new development database is empty;
use the explicit demo importer if sample records are needed.

- `npm run lint`: JavaScript/React checks.
- `npm run format` / `npm run format:check`: consistent source formatting.
- `npm run build`: Vite build plus database-driven public HTML, metadata and sitemap.
- `npm run test:e2e`: browser workflows using an isolated temporary test database.
- `npm audit --omit=dev`: published dependency advisories.

Tests load explicit fixtures in the server's `tools/demo` directory; production
never imports these fixtures. Existing product data is not reset during deploys.

## Hosting, admin access and credentials

See [NETLIFY.md](NETLIFY.md) and the server README. Credentials belong in hosting
settings, never in Git or client JavaScript. Google admin access is restricted by
the server-side `ADMIN_EMAILS` allowlist and requires a Google-authenticated session.

Company names and official logos identify brands in the catalog, not a claimed
partnership. Cosmobit stores, case prices and sample feedback are labeled as demo
content. Demo reviews never affect genuine community rating averages.

This is a tested marketplace and administration foundation. Full accounting,
payments, payroll, warehouse ledgers and compliance certification are not included.
See the server's `PRODUCTION_READINESS.md` for operational limits and remaining work.

## Portfolio-only live previews

All pages may be framed only by `https://sakib-studio.netlify.app`, including dashboard paths. `frame-ancestors` contains exactly that HTTPS origin, without wildcard or self origins. Conflicting `X-Frame-Options` headers are removed. Other CSP directives, security headers and private-route cache controls are preserved. Framing permission does not grant authenticated access.

## Layout checks

`tests/layout-theme.spec.js` covers public, buyer and supplier views at 320, 390,
768, 1024, 1440 and 1920 pixels. Admin tabs are checked at mobile, tablet and desktop
widths. Set `FV_CAPTURE_DIR` to an existing writable directory to capture audit
screenshots. Product photos use `object-contain`; official logo images keep a white
canvas for legibility in either theme. Inventory and comparison tables scroll within
their own regions.

## Admin workflows and shared controls

Reports provides date-filtered order activity in Asia/Dhaka time, dealer and
product summaries, and CSV exports. Demo orders are excluded by default. Follow-ups
tracks contact-linked tasks, due dates and completion. Operations exposes protected
health checks, backup status and manual private snapshot creation; restore is an
operator-only action. Product editors collapse into compact catalog cards, and
mobile administration uses a section selector rather than a long tab strip.

`src/ui/Select.jsx` is the shared dropdown control for filters and dashboard forms.
It keeps native keyboard/screen-reader behavior with consistent spacing, focus,
disabled states and a decorative chevron. Theme selection remains a single button.

All 64 site image assets are uploaded to Cloudinary. Products use their database
image URL; company logos are configured in `companies.json`, and the three shared
brand/lifestyle URLs live in `src/site-images.json`. The complete public upload
manifest is in `scripts/site-images.json` and is not bundled as a product catalog.
Local originals remain for offline browser fixtures. `tests/fixtures.js` routes
known CDN URLs to those exact originals without bypassing TLS; live CDN delivery is
verified separately over HTTPS. Re-upload owned assets with the server's
`scripts/upload-site-images.py`, using private hosting configuration.

CI uses the Chrome installation included in the pinned Ubuntu 24.04 runner to
avoid a fresh apt/browser-dependency download on every test run.

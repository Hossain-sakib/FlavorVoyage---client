# FlavorVoyage

A Bangladesh beverage discovery website and business marketplace. The public
website is open to everyone; customers and retailers can compare packs, find
local dealers, message them, request quotes and buy by the case.

## Architecture

- React with Tailwind CSS 4 through Vite. There are no handwritten CSS stylesheets;
  `src/index.css` imports Tailwind, and `src/ui/classes.js` contains shared utility recipes.
- `Website.jsx` handles discovery and company, distributor, size, price and keyword filters.
- Product pages include variants, composition notes, comparison, reviews and recently viewed items.
- `DealerFinder`, `Inbox`, `AddressBook` and `AdminDashboard` are separate features.
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

Public pages may be framed only by `https://sakib-studio.netlify.app`. Private/admin/account/API routes retain `X-Frame-Options: DENY` and `frame-ancestors 'none'`. Keep these exceptions when regenerating Netlify headers. This permits the owner’s responsive live portfolio previews without opening the site to arbitrary framing.

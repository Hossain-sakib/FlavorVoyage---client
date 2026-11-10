# Deploying FlavorVoyage

The frontend and API run on the same Netlify site. The server's deployment script
uploads `dist` and its bundled API, creates a draft, and can publish a verified deployment.

1. Install both repositories with `npm ci` using Node 24.
2. Run `npm run build` in the client. Product pages are built from the public hosted API.
3. Run `npm test && npm run build:netlify` in the server.
4. Run `python scripts/deploy-netlify.py` from the server using a configured
   `NETLIFY_AUTH_TOKEN`. Review the draft, then use `--publish DEPLOY_ID`.

Hosting variables:

- `APP_ORIGIN`: the canonical HTTPS website origin.
- `ADMIN_EMAILS`: comma-separated, verified Google account emails authorized as administrators.
- `ENABLE_DEMO`: enable only when shared demo accounts are intentionally desired.
- `CLOUDINARY_URL`, or `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.

Never put Cloudinary API secrets in Vite variables. The client only receives a
public image URL after the server validates and uploads the image.

API state lives in the versioned Netlify Blobs workspace. Conditional writes
protect concurrent orders and messages. The API fails closed when the production
workspace is absent; it does not silently recreate products from source fixtures.
The explicit importer is for authorized, idempotent data imports only.

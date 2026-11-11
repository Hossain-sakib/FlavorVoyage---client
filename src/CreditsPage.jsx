import PropTypes from "prop-types";
import BrandLogo from "./BrandLogo";
import ThemeControl from "./ThemeControl";
import sources from "./image-credits.json";

export default function CreditsPage({ onHome }) {
  return (
    <div className="min-h-screen bg-canvas text-ink">
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <a href="/" aria-label="FlavorVoyage home">
            <BrandLogo />
          </a>
          <ThemeControl />
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-12">
        <button
          onClick={onHome}
          className="min-h-11 text-sm font-semibold text-accent"
        >
          ← Back to FlavorVoyage
        </button>
        <h1 className="mt-5 text-3xl font-bold sm:text-4xl">Image credits</h1>
        <p className="mt-5 max-w-2xl text-sm leading-7 text-muted">
          Product photographs, company logos and lifestyle images belong to
          their respective owners. Inclusion identifies the drinks and does not
          imply an official partnership or distributor authorization. Images may
          show a range of packs; confirm the selected size with the dealer.
        </p>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {sources.map((source, index) => (
            <li
              key={`${source.source}-${index}`}
              className="min-w-0 rounded-2xl border border-line bg-surface p-5"
            >
              <a
                className="inline-block min-h-11 break-words text-sm font-semibold text-accent underline underline-offset-4"
                href={source.source}
                target="_blank"
                rel="noopener noreferrer"
              >
                {source.source_name || "Original image source"} ↗
              </a>
              {source.asset && (
                <p className="mt-2 break-words text-xs text-muted">
                  {source.asset.split("/").pop()}
                </p>
              )}
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
CreditsPage.propTypes = { onHome: PropTypes.func.isRequired };

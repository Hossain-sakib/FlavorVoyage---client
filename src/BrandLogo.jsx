import { classes } from "./ui/classes";
export default function BrandLogo() {
  return (
    <span className={classes("fv-brand")}>
      <svg
        className={classes("fv-brand-mark")}
        viewBox="0 0 48 48"
        fill="none"
        aria-hidden="true"
      >
        <rect width="48" height="48" rx="12" fill="#30213f" />
        <path d="M12 13h15v4H17v5h8v4h-8v9h-5V13Z" fill="#fffaf1" />
        <path d="m25 18 5 17h5l6-22h-5l-4 16-3-11h-4Z" fill="#d8b474" />
      </svg>
      <span className={classes("fv-wordmark")}>
        Flavor<span>Voyage</span>
        <small>DISCOVER · CONNECT · STOCK UP</small>
      </span>
    </span>
  );
}

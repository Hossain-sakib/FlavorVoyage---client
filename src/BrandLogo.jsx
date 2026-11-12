import siteImages from "./site-images.json";
import { classes } from "./ui/classes";
export default function BrandLogo() {
  return (
    <span className={classes("fv-brand")}>
      <img
        src={siteImages["/favicon.svg"]}
        className={classes("fv-brand-mark")}
        alt=""
        aria-hidden="true"
        width="48"
        height="48"
      />
      <span className={classes("fv-wordmark")}>
        Flavor<span>Voyage</span>
        <small>DISCOVER · CONNECT · STOCK UP</small>
      </span>
    </span>
  );
}

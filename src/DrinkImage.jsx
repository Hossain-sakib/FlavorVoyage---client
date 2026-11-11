import { classes } from "./ui/classes";
import { useState } from "react";
import PropTypes from "prop-types";
import { FiCameraOff } from "react-icons/fi";

export default function DrinkImage({ type = "drink", image, name }) {
  const [failedSource, setFailedSource] = useState(null);
  if (image && failedSource !== image)
    return (
      <img
        className={classes("product-art drink-packshot")}
        src={image}
        alt={name || `${type.replaceAll("-", " ")} drink pack`}
        loading="lazy"
        onError={() => setFailedSource(image)}
      />
    );
  return (
    <div
      className="grid h-44 w-full content-center justify-items-center gap-3 rounded-xl bg-subtle p-4 text-center text-xs text-muted"
      role="img"
      aria-label={`${name || "Product"}: photo unavailable`}
    >
      <FiCameraOff size={32} aria-hidden="true" />
      <span>Photo unavailable</span>
    </div>
  );
}
DrinkImage.propTypes = {
  type: PropTypes.string,
  image: PropTypes.string,
  name: PropTypes.string,
};

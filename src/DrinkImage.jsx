import { classes } from "./ui/classes";
import { useState } from "react";
import PropTypes from "prop-types";
import { FiCameraOff } from "react-icons/fi";

export default function DrinkImage({ type = "drink", image, name }) {
  const [failedSource, setFailedSource] = useState(null);
  const source = image;
  if (source && failedSource !== source)
    return (
      <img
        className={classes("product-art drink-packshot")}
        src={source}
        alt={name || `${type.replaceAll("-", " ")} drink pack`}
        loading="lazy"
        onError={() => setFailedSource(source)}
      />
    );
  return (
    <div
      className={classes("product-art")}
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

import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { FiX, FiPackage } from "react-icons/fi";
import { classes } from "./classes";
export function Modal({ title, children, onClose, wide = false }) {
  const ref = useRef(null);
  useEffect(() => {
    const previous = document.activeElement;
    ref.current.showModal();
    return () => {
      previous?.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className={classes(`modal-panel ${wide ? "wide" : ""}`)}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={classes("modal-heading")}>
        <h2>{title}</h2>
        <button
          className={classes("icon-button")}
          aria-label="Close dialog"
          onClick={onClose}
        >
          <FiX />
        </button>
      </div>
      {children}
    </dialog>
  );
}
Modal.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
  onClose: PropTypes.func,
  wide: PropTypes.bool,
};
export function Empty({ icon: Icon = FiPackage, title, description, action }) {
  return (
    <div className={classes("empty-state")}>
      <Icon />
      <h3>{title}</h3>
      <p>{description}</p>
      {action}
    </div>
  );
}
Empty.propTypes = {
  icon: PropTypes.elementType,
  title: PropTypes.string,
  description: PropTypes.string,
  action: PropTypes.node,
};

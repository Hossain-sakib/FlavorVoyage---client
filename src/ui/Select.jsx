import { forwardRef } from "react";
import PropTypes from "prop-types";
import { FiChevronDown } from "react-icons/fi";

const Select = forwardRef(function Select(
  { children, className = "", ...props },
  ref,
) {
  return (
    <span className="relative block min-w-0">
      <select
        ref={ref}
        {...props}
        className={`min-h-11 w-full min-w-0 appearance-none rounded-xl border border-line bg-surface px-3 py-3 !pr-10 text-sm leading-5 text-ink shadow-sm outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      >
        {children}
      </select>
      <FiChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted"
      />
    </span>
  );
});
Select.propTypes = { children: PropTypes.node, className: PropTypes.string };
export default Select;

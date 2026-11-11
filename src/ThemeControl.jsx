import { useEffect, useState } from "react";
import { FiSun, FiMoon } from "react-icons/fi";

export default function ThemeControl() {
  const [dark, setDark] = useState(() => {
    try {
      return localStorage.getItem("fv-theme") === "dark";
    } catch {
      return false;
    }
  });
  useEffect(() => {
    const sync = (event) => {
      if (event.key === "fv-theme") setDark(event.newValue === "dark");
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", dark ? "#151719" : "#fffcf7");
  }, [dark]);
  const label = dark ? "Switch to light mode" : "Switch to dark mode";
  return (
    <button
      type="button"
      className="grid size-11 shrink-0 place-items-center rounded-full text-muted transition hover:bg-subtle hover:text-ink"
      aria-label={label}
      aria-pressed={dark}
      title={label}
      onClick={() => {
        const next = !dark;
        setDark(next);
        try {
          localStorage.setItem("fv-theme", next ? "dark" : "light");
        } catch {
          /* The button still works when storage is unavailable. */
        }
      }}
    >
      {dark ? (
        <FiSun className="size-5" aria-hidden="true" />
      ) : (
        <FiMoon className="size-5" aria-hidden="true" />
      )}
    </button>
  );
}

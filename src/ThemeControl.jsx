import { useEffect, useState } from "react";
import { FiSun, FiMoon, FiMonitor } from "react-icons/fi";

export default function ThemeControl() {
  const [preference, setPreference] = useState(() => {
    try {
      return localStorage.getItem("fv-theme") || "system";
    } catch {
      return "system";
    }
  });
  useEffect(() => {
    const sync = (event) => {
      if (event.key === "fv-theme")
        setPreference(
          ["light", "dark"].includes(event.newValue)
            ? event.newValue
            : "system",
        );
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  useEffect(() => {
    const system = window.matchMedia("(prefers-color-scheme: dark)");
    function apply() {
      const dark =
        preference === "dark" || (preference === "system" && system.matches);
      document.documentElement.dataset.theme = dark ? "dark" : "light";
      document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute("content", dark ? "#17131e" : "#fffcf7");
    }
    apply();
    system.addEventListener("change", apply);
    return () => system.removeEventListener("change", apply);
  }, [preference]);
  const Icon =
    preference === "system"
      ? FiMonitor
      : preference === "dark"
        ? FiMoon
        : FiSun;
  return (
    <label
      className="relative grid size-11 shrink-0 place-items-center rounded-xl border border-line bg-surface text-ink focus-within:ring-2 focus-within:ring-purple-500"
      title="Color theme"
    >
      <Icon className="size-4" aria-hidden="true" />
      <span className="sr-only">Color theme</span>
      <select
        aria-label="Color theme"
        value={preference}
        className="absolute inset-0 w-full cursor-pointer opacity-0"
        onChange={(e) => {
          const value = e.target.value;
          setPreference(value);
          try {
            localStorage.setItem("fv-theme", value);
          } catch {
            /* Preference still works for this visit. */
          }
        }}
      >
        <option value="system">System theme</option>
        <option value="light">Light mode</option>
        <option value="dark">Dark mode</option>
      </select>
    </label>
  );
}

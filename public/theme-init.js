// Start in light mode unless the visitor explicitly saved dark mode.
try {
  document.documentElement.dataset.theme = localStorage.getItem("fv-theme") === "dark" ? "dark" : "light";
} catch {
  document.documentElement.dataset.theme = "light";
}

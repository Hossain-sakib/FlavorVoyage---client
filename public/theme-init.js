// Apply the saved preference before the first paint. Storage is optional.
try {
  const preference = localStorage.getItem("fv-theme") || "system";
  document.documentElement.dataset.theme =
    preference === "dark" ||
    (preference === "system" && matchMedia("(prefers-color-scheme: dark)").matches)
      ? "dark"
      : "light";
} catch {
  document.documentElement.dataset.theme = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

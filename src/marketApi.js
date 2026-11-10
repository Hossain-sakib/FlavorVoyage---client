export const money = (value) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(value);
export async function marketApi(path, options = {}) {
  const response = await fetch(`/api${path}`, {
    credentials: "same-origin",
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Please try again.");
  return result;
}
export const send = (path, body, method = "POST") =>
  marketApi(path, { method, body: JSON.stringify(body) });

export function post(path, body, method = "POST", headers) {
  return marketApi(path, { method, body: JSON.stringify(body), headers });
}

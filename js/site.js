const THEME_KEY = "probabify-theme";
const themeButton = document.querySelector("[data-theme-toggle]");
const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");

function storedTheme() {
  try { return localStorage.getItem(THEME_KEY); }
  catch { return null; }
}

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = theme === "dark" ? "#11130f" : "#f2efe7";
  if (!themeButton) return;
  themeButton.setAttribute("aria-label", `Activar tema ${theme === "dark" ? "claro" : "oscuro"}`);
  const icon = themeButton.querySelector(".theme-button__icon");
  if (icon) icon.textContent = theme === "dark" ? "☀" : "◐";
}

setTheme(["dark", "light"].includes(storedTheme()) ? storedTheme() : systemTheme.matches ? "dark" : "light");

themeButton?.addEventListener("click", () => {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  try { localStorage.setItem(THEME_KEY, nextTheme); } catch { /* El tema sigue activo durante esta visita. */ }
  setTheme(nextTheme);
});

systemTheme.addEventListener?.("change", (event) => {
  if (!["dark", "light"].includes(storedTheme())) setTheme(event.matches ? "dark" : "light");
});

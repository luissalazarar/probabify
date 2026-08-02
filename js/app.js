import { GAME_CONFIG } from "../data/config.js";
import { GameEngine } from "./engine.js";

const params = new URLSearchParams(window.location.search);
const SAVE_KEY = "probabify-save-v2";
const DEBUG_MODE = GAME_CONFIG.debug || params.get("debug") === "1";
const createSeed = () => globalThis.crypto?.randomUUID?.().slice(0, 8) ?? Math.random().toString(36).slice(2, 10);
let activeSeed = params.get(GAME_CONFIG.random.queryParameter) || createSeed();
let engine = new GameEngine({ seed: activeSeed });

const elements = {
  originView: document.querySelector("#origin-view"), gameView: document.querySelector("#game-view"),
  originGrid: document.querySelector("#origin-grid"), stats: document.querySelector("#stats"),
  age: document.querySelector("#player-age"), role: document.querySelector("#player-role"), origin: document.querySelector("#player-origin"),
  eventKicker: document.querySelector("#event-kicker"), eventTitle: document.querySelector("#event-title"),
  eventDescription: document.querySelector("#event-description"), options: document.querySelector("#options"),
  history: document.querySelector("#history-list"), result: document.querySelector("#result-banner"),
  ending: document.querySelector("#ending-card"), seed: document.querySelector("#seed-label"),
  calendar: document.querySelector("#political-calendar"), themeButton: document.querySelector("[data-theme-toggle]"),
  context: document.querySelector("#context-panel"), continuePanel: document.querySelector("#continue-panel"),
  continueText: document.querySelector("#continue-text"), debug: document.querySelector("#debug-panel"),
};

function storageGet(key) {
  try { return localStorage.getItem(key); } catch { return null; }
}

function storageSet(key, value) {
  try { localStorage.setItem(key, value); } catch { /* La partida sigue aunque el navegador bloquee almacenamiento. */ }
}

function storageRemove(key) {
  try { localStorage.removeItem(key); } catch { /* Sin almacenamiento persistente. */ }
}

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  storageSet("probabify-theme", theme);
  const nextTheme = theme === "dark" ? "claro" : "oscuro";
  elements.themeButton.setAttribute("aria-label", `Activar tema ${nextTheme}`);
  elements.themeButton.querySelector(".theme-button__icon").textContent = theme === "dark" ? "☀" : "◐";
}

function formatMoney(value) {
  return new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN", maximumFractionDigits: 0 }).format(value);
}

function ideologyLabel(value) {
  if (value <= -70) return "izquierda radical";
  if (value <= -25) return "izquierda";
  if (value < 25) return "centro";
  if (value < 70) return "derecha";
  return "derecha radical";
}

function formatStat(key, value) {
  const meta = GAME_CONFIG.stats[key];
  if (meta.format === "money") return formatMoney(value);
  if (meta.format === "ideology") return `${value > 0 ? "+" : ""}${value} · ${ideologyLabel(value)}`;
  return `${value}%`;
}

function ageRangeLabel(age) {
  if (Number.isFinite(age)) return `${age} años`;
  return `${age.min}–${age.max} años`;
}

function refreshSeedLabel() {
  elements.seed.textContent = `Semilla ${activeSeed}`;
}

function renderOrigins() {
  elements.originGrid.innerHTML = engine.origins.map((origin, index) => `
    <button class="origin-card" type="button" data-origin="${origin.id}" style="--delay: ${index * 70}ms">
      <span class="origin-card__topline"><span class="origin-card__number">${String(index + 1).padStart(2, "0")}</span><span class="origin-card__icon" aria-hidden="true">${origin.icon ?? "·"}</span></span>
      <span class="origin-card__eyebrow">${origin.eyebrow ?? "Origen"}</span>
      <strong>${origin.name}</strong>
      <span class="origin-card__description">${origin.description}</span>
      <span class="origin-card__meta">${ageRangeLabel(origin.startAge)} <i></i> ${origin.initialRole}</span>
      <span class="origin-card__cta">Elegir este origen <b>→</b></span>
    </button>
  `).join("");
}

function renderStats(snapshot) {
  elements.stats.innerHTML = Object.entries(GAME_CONFIG.stats).map(([key, meta]) => {
    const value = snapshot.stats[key];
    if (meta.format === "ideology") {
      return `<article class="stat-card stat-card--ideology">
        <div class="stat-card__header"><span>${meta.icon}</span><small>${meta.label}</small></div>
        <strong>${formatStat(key, value)}</strong>
        <div class="ideology-meter"><span></span><i style="left:${(value + 100) / 2}%"></i></div>
        <div class="ideology-axis"><small>Izq.</small><small>Centro</small><small>Der.</small></div>
      </article>`;
    }
    const isMeter = meta.format === "percent";
    return `<article class="stat-card${key === "legalRisk" ? ` stat-card--risk${value >= 70 ? " is-danger" : ""}` : ""}">
      <div class="stat-card__header"><span>${meta.icon}</span><small>${meta.label}</small></div>
      <strong>${formatStat(key, value)}</strong>
      ${isMeter ? `<div class="meter"><i style="width:${value}%"></i></div>` : `<div class="money-rule"></div>`}
    </article>`;
  }).join("");
}

function renderContext(snapshot) {
  const contextLabels = snapshot.contexts.map((id) => GAME_CONFIG.contexts.find((item) => item.id === id)?.label ?? id);
  const executive = snapshot.tags.includes("presidente-actual");
  const nationalMetrics = executive ? Object.entries(GAME_CONFIG.nationalStats).map(([key, meta]) => `
    <span class="national-metric"><small>${meta.label}</small><b>${snapshot.national[key]}${meta.suffix}</b></span>
  `).join("") : "";
  elements.context.innerHTML = `
    <div class="context-summary">
      <div><small>Contexto nacional</small><p>${contextLabels.join(" · ")}</p></div>
      <div><small>Personalidad emergente</small><p>${snapshot.personality}</p></div>
      <button type="button" data-copy-seed title="Copiar semilla"><small>Partida</small><p>${activeSeed} ⧉</p></button>
    </div>
    ${executive ? `<div class="national-dashboard"><div class="national-dashboard__title"><small>Tablero de gobierno</small><b>Indicadores nacionales</b></div>${nationalMetrics}</div>` : ""}
  `;
}

function renderEvent(snapshot) {
  const event = snapshot.event;
  if (!event) return;
  elements.eventKicker.textContent = `${event.rare ? "Evento raro · " : event.secret ? "Ruta secreta · " : ""}${event.kicker ?? "Decisión anual"}`;
  elements.eventTitle.textContent = event.title;
  elements.eventDescription.textContent = event.description;
  elements.options.innerHTML = engine.getAvailableOptions().map((option, index) => `
    <button class="decision-option" type="button" data-option="${option.id}" ${option.available ? "" : "disabled"}>
      <span class="decision-option__letter">${String.fromCharCode(65 + index)}</span>
      <span class="decision-option__copy"><strong>${option.label}</strong><small>${option.available ? option.hint ?? "Consecuencias variables" : "No cumples los requisitos"}</small></span>
      <span class="decision-option__arrow" aria-hidden="true">→</span>
    </button>
  `).join("");
}

function renderHistory(snapshot) {
  if (!snapshot.history.length) {
    elements.history.innerHTML = `<li class="history-empty">Tu historia empieza con la primera decisión.</li>`;
    return;
  }
  elements.history.innerHTML = snapshot.history.map((entry, index) => `
    <li class="history-item history-item--${entry.category ?? "decision"}">
      <span class="history-item__marker">${index === 0 ? "●" : "○"}</span>
      <div><small>${entry.year} · ${entry.age} años · ${entry.role}</small><strong>${entry.headline ?? entry.optionLabel}</strong><p>${entry.text}</p><em>${entry.eventTitle}</em></div>
    </li>
  `).join("");
}

function renderChanges(changes) {
  const visible = changes.stats.map(({ key, delta }) => {
    const meta = GAME_CONFIG.stats[key];
    const amount = meta.format === "money" ? formatMoney(Math.abs(delta)) : `${Math.abs(delta)}${meta.format === "percent" ? "%" : ""}`;
    return `<span class="change-chip ${delta > 0 ? "is-up" : "is-down"}">${meta.label} ${delta > 0 ? "+" : "−"}${amount}</span>`;
  });
  const relevantHidden = changes.hidden.slice(0, 3).map(({ key, delta }) => `<span class="change-chip is-context">${GAME_CONFIG.hiddenStats[key].label} ${delta > 0 ? "+" : ""}${delta}</span>`);
  if (changes.role) visible.unshift(`<span class="change-chip is-role">Nuevo cargo: ${changes.role.to}</span>`);
  for (const scandal of changes.newScandals) visible.push(`<span class="change-chip is-alert">Escándalo: ${scandal.label}</span>`);
  return [...visible, ...relevantHidden].join("");
}

function showResult({ outcome, changes, headline }) {
  elements.result.className = `result-banner result-banner--${outcome.category ?? "decision"}`;
  elements.result.innerHTML = `
    <div class="result-banner__headline"><span>Titular</span><h3>${outcome.headline ?? headline}</h3></div>
    <p>${outcome.text ?? "Tu trayectoria ha cambiado."}</p>
    <div class="result-banner__changes">${renderChanges(changes)}</div>
    ${outcome.futureHint ? `<small class="future-hint">⌛ ${outcome.futureHint}</small>` : ""}
  `;
  elements.result.hidden = false;
}

function endingNarrative(snapshot) {
  const scandalCount = snapshot.memory.scandals.length;
  const crisisCount = snapshot.memory.crises.length + snapshot.memory.wars.length;
  return `Desde ${snapshot.originName.toLowerCase()}, construiste una carrera de ${snapshot.history.length} decisiones. Tu mayor cargo fue ${snapshot.highestRole.toLowerCase()}, con ${snapshot.elections.won} victoria${snapshot.elections.won === 1 ? "" : "s"} y ${snapshot.elections.lost} derrota${snapshot.elections.lost === 1 ? "" : "s"} presidencial${snapshot.elections.lost === 1 ? "" : "es"}. Cerraste como ${snapshot.personality}, dejando ${scandalCount} escándalo${scandalCount === 1 ? "" : "s"} y ${crisisCount} crisis mayor${crisisCount === 1 ? "" : "es"} en el archivo.`;
}

function renderEnding(snapshot) {
  if (!snapshot.ending) { elements.ending.hidden = true; return; }
  const ending = snapshot.ending;
  const ideology = ideologyLabel(snapshot.stats.ideology);
  const allies = Object.entries(snapshot.relations).filter(([, item]) => item.score >= 60).map(([name]) => name);
  const enemies = [...snapshot.memory.enemies.map((item) => item.label), ...Object.entries(snapshot.relations).filter(([, item]) => item.score <= -20).map(([name]) => name)];
  elements.ending.hidden = false;
  elements.ending.innerHTML = `
    <div class="ending-card__icon">${ending.icon}</div><p class="section-label">Final de trayectoria · semilla ${activeSeed}</p>
    <h2>${ending.title}</h2><strong class="ending-card__label">${ending.label}</strong><p>${endingNarrative(snapshot)}</p>
    <div class="ending-card__score ending-card__score--wide">
      <span><small>Mayor cargo</small><b>${snapshot.highestRole}</b></span><span><small>Años en cargos</small><b>${snapshot.yearsInPublicOffice}</b></span>
      <span><small>Elecciones</small><b>${snapshot.elections.won}G · ${snapshot.elections.lost}P</b></span><span><small>Personalidad</small><b>${snapshot.personality}</b></span>
      <span><small>Dinero limpio</small><b>${formatMoney(snapshot.stats.cleanMoney)}</b></span><span><small>Dinero sucio</small><b>${formatMoney(snapshot.stats.dirtyMoney)}</b></span>
      <span><small>Aceptación</small><b>${snapshot.stats.approval}%</b></span><span><small>Tendencia</small><b>${ideology}</b></span>
    </div>
    <div class="legacy-list"><p><b>Aliados:</b> ${allies.join(", ") || "ninguno estable"}</p><p><b>Enemigos:</b> ${enemies.slice(0, 4).join(", ") || "ninguno declarado"}</p><p><b>Expediente:</b> ${snapshot.memory.scandals.length} escándalos · ${snapshot.memory.investigations.length} investigaciones · ${snapshot.memory.wars.length} conflictos</p></div>
    <div class="ending-actions"><button class="primary-button" type="button" data-share-ending>Copiar resumen <span>⧉</span></button><button class="secondary-button" type="button" data-replay-origin="${snapshot.originId}">Repetir origen</button><button class="secondary-button" type="button" data-new-life>Jugar otra vida</button></div>
  `;
}

function renderDebug(snapshot) {
  if (!DEBUG_MODE) return;
  elements.debug.hidden = false;
  const diagnostics = engine.getDiagnostics();
  elements.debug.innerHTML = `
    <div class="debug-panel__head"><b>Modo de depuración</b><span>${diagnostics.filter((item) => item.eligible).length} eventos válidos</span></div>
    <div class="debug-panel__tools"><select id="debug-event-select">${diagnostics.map((item) => `<option value="${item.id}">${item.eligible ? "●" : "○"} ${item.id} · peso ${item.weight}</option>`).join("")}</select><button data-debug-force>Forzar evento</button><button data-debug-year>+1 año</button><button data-debug-election>Forzar elección</button><button data-debug-vacancy>Probar vacancia</button><button data-debug-crisis>Activar crisis</button></div>
    <div class="debug-panel__tools"><select id="debug-stat-select">${Object.entries(GAME_CONFIG.stats).map(([key, meta]) => `<option value="${key}">${meta.label}</option>`).join("")}</select><input id="debug-stat-value" type="number" value="50"><button data-debug-stat>Modificar estadística</button><input id="debug-role-value" value="Ministro de Estado" aria-label="Cargo"><button data-debug-role>Cambiar cargo</button></div>
    <details><summary>Inspeccionar estado completo</summary><pre>${JSON.stringify(snapshot, null, 2)}</pre></details>
    <details><summary>Requisitos y probabilidades actuales</summary><pre>${JSON.stringify(diagnostics, null, 2)}</pre></details>
  `;
}

function render(snapshot) {
  elements.age.textContent = snapshot.age;
  elements.role.textContent = snapshot.role;
  elements.origin.textContent = snapshot.originName;
  const yearsToElection = Math.max(0, snapshot.nextElectionYear - snapshot.year);
  elements.calendar.textContent = `${snapshot.year} · ${yearsToElection === 0 ? "Elecciones este año" : `Elecciones en ${yearsToElection} ${yearsToElection === 1 ? "año" : "años"}`} · ${snapshot.presidentialRuns} ${snapshot.presidentialRuns === 1 ? "postulación" : "postulaciones"}`;
  renderStats(snapshot); renderContext(snapshot); renderHistory(snapshot); renderEnding(snapshot); renderDebug(snapshot);
  if (!snapshot.ending) renderEvent(snapshot);
  document.body.classList.toggle("has-ending", Boolean(snapshot.ending));
}

function persist(snapshot) { storageSet(SAVE_KEY, JSON.stringify(snapshot)); }

function updateUrlSeed() {
  const url = new URL(window.location.href);
  url.searchParams.set(GAME_CONFIG.random.queryParameter, activeSeed);
  if (engine.state?.originId) url.searchParams.set("origin", engine.state.originId);
  else url.searchParams.delete("origin");
  history.replaceState(null, "", url);
  refreshSeedLabel();
}

function startGame(originId, { seed = activeSeed } = {}) {
  activeSeed = seed;
  engine = new GameEngine({ seed: activeSeed });
  const snapshot = engine.start(originId);
  updateUrlSeed();
  elements.originView.hidden = true; elements.gameView.hidden = false; elements.result.hidden = true;
  render(snapshot); persist(snapshot);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function continueGame() {
  const saved = JSON.parse(storageGet(SAVE_KEY) || "null");
  if (!saved) return;
  activeSeed = saved.seed;
  engine = new GameEngine({ seed: activeSeed });
  const snapshot = engine.load(saved);
  updateUrlSeed();
  elements.originView.hidden = true; elements.gameView.hidden = false; elements.result.hidden = true;
  render(snapshot);
}

function makeChoice(optionId) {
  elements.options.querySelectorAll("button").forEach((button) => { button.disabled = true; });
  const result = engine.choose(optionId);
  showResult(result); render(result.snapshot); persist(result.snapshot);
  window.setTimeout(() => elements.result.scrollIntoView({ behavior: "smooth", block: "nearest" }), 60);
}

function showOriginScreen({ newSeed = false } = {}) {
  if (newSeed) activeSeed = createSeed();
  engine = new GameEngine({ seed: activeSeed });
  storageRemove(SAVE_KEY);
  elements.gameView.hidden = true; elements.originView.hidden = false; elements.result.hidden = true; elements.ending.hidden = true;
  document.body.classList.remove("has-ending");
  renderOrigins(); updateUrlSeed(); updateContinuePanel();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function updateContinuePanel() {
  const saved = JSON.parse(storageGet(SAVE_KEY) || "null");
  elements.continuePanel.hidden = !saved;
  if (saved) elements.continueText.textContent = `${saved.originName} · ${saved.age} años · ${saved.role}`;
}

async function copyText(text, feedback = "Copiado") {
  try { await navigator.clipboard.writeText(text); elements.seed.textContent = feedback; window.setTimeout(refreshSeedLabel, 1400); }
  catch { window.prompt("Copia este texto:", text); }
}

document.addEventListener("click", (event) => {
  const originButton = event.target.closest("[data-origin]");
  const optionButton = event.target.closest("[data-option]");
  if (originButton) startGame(originButton.dataset.origin);
  if (optionButton && !optionButton.disabled) makeChoice(optionButton.dataset.option);
  if (event.target.closest("[data-theme-toggle]")) setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
  if (event.target.closest("[data-copy-seed]")) copyText(activeSeed, "Semilla copiada");
  if (event.target.closest("[data-continue]")) continueGame();
  if (event.target.closest("[data-restart]")) showOriginScreen({ newSeed: true });
  if (event.target.closest("[data-new-life]")) showOriginScreen({ newSeed: true });
  const replay = event.target.closest("[data-replay-origin]");
  if (replay) startGame(replay.dataset.replayOrigin, { seed: activeSeed });
  if (event.target.closest("[data-share-ending]")) copyText(endingNarrative(engine.getSnapshot()) + ` Semilla: ${activeSeed}`, "Resumen copiado");
  if (event.target.closest("[data-debug-force]")) { render(engine.forceEvent(document.querySelector("#debug-event-select").value)); }
  if (event.target.closest("[data-debug-year]")) { engine.advanceYear(); engine.state.currentEventId = engine.findNextEventId(); const snapshot = engine.getSnapshot(); render(snapshot); persist(snapshot); }
  if (event.target.closest("[data-debug-election]")) { engine.state.nextElectionYear = engine.state.year; render(engine.forceEvent("eleccion-nacional")); }
  if (event.target.closest("[data-debug-vacancy]")) { if (!engine.state.tags.includes("presidente-actual")) engine.state.tags.push("presidente-actual"); engine.state.hidden.vacancyRisk = 90; render(engine.forceEvent("mocion-vacancia")); }
  if (event.target.closest("[data-debug-crisis]")) { engine.state.contexts = ["crisis-institucional", ...engine.state.contexts].slice(0, 3); engine.state.national.socialConflict = Math.min(100, engine.state.national.socialConflict + 25); render(engine.getSnapshot()); }
  if (event.target.closest("[data-debug-stat]")) { const key = document.querySelector("#debug-stat-select").value; engine.state.stats[key] = Number(document.querySelector("#debug-stat-value").value); engine.normalizeAll(); render(engine.getSnapshot()); }
  if (event.target.closest("[data-debug-role]")) { engine.setRole(document.querySelector("#debug-role-value").value); render(engine.getSnapshot()); }
});

setTheme(storageGet("probabify-theme") ?? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
renderOrigins(); refreshSeedLabel(); updateContinuePanel();
const sharedOrigin = params.get("origin");
if (engine.origins.some((origin) => origin.id === sharedOrigin)) startGame(sharedOrigin);

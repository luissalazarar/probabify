import { GAME_CONFIG } from "../data/config.js";
import { GameEngine } from "./engine.js";

const params = new URLSearchParams(window.location.search);
const SAVE_KEY = "probabify-save-v2";
const THEME_KEY = "probabify-theme";
const DEBUG_MODE = GAME_CONFIG.debug || params.get("debug") === "1";
const createSeed = () => globalThis.crypto?.randomUUID?.().slice(0, 8) ?? Math.random().toString(36).slice(2, 10);
const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
let activeSeed = params.get(GAME_CONFIG.random.queryParameter) || createSeed();
let engine = new GameEngine({ seed: activeSeed });
let selectedOriginId = null;
let selectedBackgroundId = null;
let choiceLocked = false;

const elements = {
  originView: document.querySelector("#origin-view"), setupView: document.querySelector("#setup-view"), gameView: document.querySelector("#game-view"),
  originGrid: document.querySelector("#origin-grid"), stats: document.querySelector("#stats"),
  age: document.querySelector("#player-age"), role: document.querySelector("#player-role"), origin: document.querySelector("#player-origin"), name: document.querySelector("#player-name"),
  eventKicker: document.querySelector("#event-kicker"), eventTitle: document.querySelector("#event-title"),
  eventDescription: document.querySelector("#event-description"), options: document.querySelector("#options"),
  history: document.querySelector("#history-list"), result: document.querySelector("#result-banner"),
  ending: document.querySelector("#ending-card"),
  calendar: document.querySelector("#political-calendar"), saveStatus: document.querySelector("#save-status"), themeButton: document.querySelector("[data-theme-toggle]"),
  context: document.querySelector("#context-panel"), continuePanel: document.querySelector("#continue-panel"),
  continueText: document.querySelector("#continue-text"), debug: document.querySelector("#debug-panel"),
  setupOriginName: document.querySelector("#setup-origin-name"), setupOriginDescription: document.querySelector("#setup-origin-description"),
  characterForm: document.querySelector("#character-form"), characterName: document.querySelector("#character-name"),
  backgroundGrid: document.querySelector("#background-grid"), startCharacter: document.querySelector("#start-character"), footnote: document.querySelector("#decision-footnote"),
};

function storageGet(key) {
  try { return localStorage.getItem(key); } catch { return null; }
}

function storageSet(key, value) {
  try { localStorage.setItem(key, value); return true; }
  catch { return false; }
}

function storageRemove(key) {
  try { localStorage.removeItem(key); } catch { /* Sin almacenamiento persistente. */ }
}

function readSavedGame() {
  try { return JSON.parse(storageGet(SAVE_KEY) || "null"); }
  catch { storageRemove(SAVE_KEY); return null; }
}

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]').content = theme === "dark" ? "#11130f" : "#f2efe7";
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

function formatLedgerChange(key, entry) {
  const meta = GAME_CONFIG.stats[key];
  if (entry.delta === null) return `Valor inicial: ${formatStat(key, entry.value)}`;
  if (meta.format === "money") return `${entry.delta > 0 ? "+" : "−"}${formatMoney(Math.abs(entry.delta))}`;
  if (meta.format === "ideology") return `${Math.abs(entry.delta)} hacia la ${entry.delta > 0 ? "derecha" : "izquierda"}`;
  return `${entry.delta > 0 ? "+" : "−"}${Math.abs(entry.delta)} puntos`;
}

function renderStatTooltip(key, snapshot) {
  const allEntries = snapshot.statLedger?.[key] ?? [];
  const entries = allEntries.slice(-9).reverse();
  const movements = allEntries.filter((entry) => Number.isFinite(entry.delta));
  const initialValue = allEntries.find((entry) => entry.delta === null)?.value ?? snapshot.stats[key];
  const netChange = snapshot.stats[key] - initialValue;
  const meta = GAME_CONFIG.stats[key];
  let summary;
  if (meta.format === "money") {
    const income = movements.reduce((sum, entry) => sum + Math.max(0, entry.delta), 0);
    const expenses = movements.reduce((sum, entry) => sum + Math.abs(Math.min(0, entry.delta)), 0);
    summary = `<div class="stat-tooltip__summary">
      <span><small>Entradas</small><b class="is-positive">+${formatMoney(income)}</b></span>
      <span><small>Salidas</small><b class="is-negative">−${formatMoney(expenses)}</b></span>
    </div>`;
  } else {
    const netLabel = meta.format === "ideology"
      ? (netChange === 0 ? "Sin desplazamiento" : `${Math.abs(netChange)} hacia la ${netChange > 0 ? "derecha" : "izquierda"}`)
      : `${netChange > 0 ? "+" : netChange < 0 ? "−" : ""}${Math.abs(netChange)} puntos`;
    summary = `<div class="stat-tooltip__summary stat-tooltip__summary--single"><span><small>Desde el inicio</small><b>${netLabel}</b></span></div>`;
  }
  return `<div class="stat-tooltip" role="tooltip">
    <b>Detalle de variación</b>
    ${summary}
    <ul>${entries.map((entry) => `<li><span>${formatLedgerChange(key, entry)}</span><small>${entry.year} · ${entry.reason}</small></li>`).join("")}</ul>
  </div>`;
}

function ageRangeLabel(age) {
  if (Number.isFinite(age)) return `${age} años`;
  return `${age.min}–${age.max} años`;
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

function updateSetupValidity() {
  elements.startCharacter.disabled = !selectedBackgroundId || !elements.characterName.value.trim();
}

function renderBackgrounds(originId) {
  elements.backgroundGrid.innerHTML = engine.getBackgrounds(originId).map((background) => `
    <button class="background-card${background.id === selectedBackgroundId ? " is-selected" : ""}" type="button" data-background="${background.id}" role="radio" aria-checked="${background.id === selectedBackgroundId}">
      <span class="background-card__top"><small>${background.eyebrow}</small><i aria-hidden="true"></i></span>
      <strong>${background.name}</strong>
      <p>${background.history}</p>
      <span class="background-card__impact"><b>Impacto:</b> ${background.impact}</span>
    </button>
  `).join("");
}

function openCharacterSetup(originId) {
  const origin = engine.origins.find((item) => item.id === originId);
  if (!origin) return;
  selectedOriginId = originId;
  selectedBackgroundId = null;
  elements.setupOriginName.textContent = origin.name;
  elements.setupOriginDescription.textContent = origin.description;
  elements.characterName.value = "";
  renderBackgrounds(originId);
  updateSetupValidity();
  elements.originView.hidden = true;
  elements.gameView.hidden = true;
  elements.setupView.hidden = false;
  window.scrollTo({ top: 0, behavior: "smooth" });
  window.setTimeout(() => elements.characterName.focus(), 80);
}

function renderStats(snapshot) {
  elements.stats.innerHTML = Object.entries(GAME_CONFIG.stats).map(([key, meta]) => {
    const value = snapshot.stats[key];
    if (meta.format === "ideology") {
      return `<article class="stat-card stat-card--ideology" tabindex="0" aria-label="${meta.label}: ${formatStat(key, value)}. Ver historial">
        <div class="stat-card__header"><span>${meta.icon}</span><small>${meta.label}</small><i class="stat-card__info" aria-hidden="true">?</i></div>
        <strong>${formatStat(key, value)}</strong>
        <div class="ideology-meter"><span></span><i style="left:${(value + 100) / 2}%"></i></div>
        <div class="ideology-axis"><small>Izq.</small><small>Centro</small><small>Der.</small></div>
        ${renderStatTooltip(key, snapshot)}
      </article>`;
    }
    const isMeter = meta.format === "percent";
    return `<article class="stat-card${key === "legalRisk" ? ` stat-card--risk${value >= 70 ? " is-danger" : ""}` : ""}" tabindex="0" aria-label="${meta.label}: ${formatStat(key, value)}. Ver historial">
      <div class="stat-card__header"><span>${meta.icon}</span><small>${meta.label}</small><i class="stat-card__info" aria-hidden="true">?</i></div>
      <strong>${formatStat(key, value)}</strong>
      ${isMeter ? `<div class="meter"><i style="width:${value}%"></i></div>` : `<div class="money-rule"></div>`}
      ${renderStatTooltip(key, snapshot)}
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
    <div class="context-summary context-summary--three">
      <div><small>Contexto nacional</small><p>${contextLabels.join(" · ")}</p></div>
      <div><small>Personalidad emergente</small><p>${snapshot.personality}</p></div>
      <div title="${snapshot.backgroundImpact}"><small>Antecedente</small><p>${snapshot.backgroundName}</p></div>
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
  const availableOptions = engine.getAvailableOptions();
  elements.options.innerHTML = availableOptions.map((option, index) => {
    const dirtyCost = Math.max(0, -Number(option.effects?.dirtyMoney ?? 0));
    const unavailableHint = dirtyCost > snapshot.stats.dirtyMoney && !option.allowDirtyShortfall
      ? `Necesitas ${formatMoney(dirtyCost)} de dinero sucio`
      : "No cumples los requisitos";
    return `
    <button class="decision-option" type="button" data-option="${option.id}" ${option.available ? "" : "disabled"}>
      <span class="decision-option__letter">${String.fromCharCode(65 + index)}</span>
      <span class="decision-option__copy"><strong>${option.label}</strong><small>${option.available ? option.hint ?? "Consecuencias variables" : unavailableHint}</small></span>
      <span class="decision-option__arrow" aria-hidden="true">→</span>
    </button>
  `;
  }).join("");
  const shortcuts = availableOptions.map((_, index) => `<kbd>${String.fromCharCode(65 + index)}</kbd>`).join("/");
  elements.footnote.innerHTML = `Las consecuencias dependen de tu trayectoria. Atajos: ${shortcuts} o teclas numéricas.`;
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

function hiddenChangeMakesSense(key, snapshot) {
  const role = snapshot.role.toLowerCase();
  const tags = snapshot.tags;
  const isPresident = tags.includes("presidente-actual");
  const isExecutive = isPresident || /ministro|premier|vicepresidente/.test(role);
  const isInstitutional = isExecutive || /congres|parlament|legisla|senador|diputad|candidat/.test(role) || tags.some((tag) => ["congresista", "controla-partido", "en-campana-presidencial"].includes(tag));
  if (["vacancyRisk", "governmentStability", "armedForcesSupport"].includes(key)) return isPresident;
  if (key === "cabinetLoyalty") return isExecutive;
  if (key === "congressSupport") return isInstitutional;
  if (key === "partyCohesion") return isInstitutional;
  if (["prosecutionRelation", "judiciaryRelation"].includes(key)) return snapshot.stats.legalRisk >= 20 || snapshot.memory.investigations.length > 0 || tags.some((tag) => ["investigado", "en-prision", "en-exilio", "arresto-domiciliario"].includes(tag));
  return true;
}

function renderChanges(changes, snapshot) {
  const visible = changes.stats.map(({ key, delta }) => {
    const meta = GAME_CONFIG.stats[key];
    const amount = meta.format === "money" ? formatMoney(Math.abs(delta)) : `${Math.abs(delta)}${meta.format === "percent" ? "%" : ""}`;
    return `<span class="change-chip ${delta > 0 ? "is-up" : "is-down"}">${meta.label} ${delta > 0 ? "+" : "−"}${amount}</span>`;
  });
  const relevantHidden = changes.hidden.filter(({ key }) => hiddenChangeMakesSense(key, snapshot)).slice(0, 3).map(({ key, delta }) => `<span class="change-chip is-context">${GAME_CONFIG.hiddenStats[key].label} ${delta > 0 ? "+" : ""}${delta}</span>`);
  if (changes.role) visible.unshift(`<span class="change-chip is-role">Nuevo cargo: ${changes.role.to}</span>`);
  for (const scandal of changes.newScandals) visible.push(`<span class="change-chip is-alert">Escándalo: ${scandal.label}</span>`);
  return [...visible, ...relevantHidden].join("");
}

function showResult({ outcome, changes, headline, snapshot }) {
  elements.result.className = `result-banner result-banner--${outcome.category ?? "decision"}`;
  elements.result.innerHTML = `
    <div class="result-banner__headline"><span>Titular</span><h3>${outcome.headline ?? headline}</h3></div>
    <p>${outcome.text ?? "Tu trayectoria ha cambiado."}</p>
    <div class="result-banner__changes">${renderChanges(changes, snapshot)}</div>
    ${outcome.futureHint ? `<small class="future-hint">⌛ ${outcome.futureHint}</small>` : ""}
  `;
  elements.result.hidden = false;
}

function endingNarrative(snapshot) {
  const scandalCount = snapshot.memory.scandals.length;
  const crisisCount = snapshot.memory.crises.length + snapshot.memory.wars.length;
  return `${snapshot.characterName}, desde ${snapshot.originName.toLowerCase()} y con el antecedente «${snapshot.backgroundName}», construyó una carrera de ${snapshot.history.length} decisiones. Su mayor cargo fue ${snapshot.highestRole.toLowerCase()}. En elecciones presidenciales obtuvo ${snapshot.elections.won} victoria${snapshot.elections.won === 1 ? "" : "s"} y ${snapshot.elections.lost} derrota${snapshot.elections.lost === 1 ? "" : "s"}. Cerró como ${snapshot.personality}, dejando ${scandalCount} escándalo${scandalCount === 1 ? "" : "s"} y ${crisisCount} crisis mayor${crisisCount === 1 ? "" : "es"} en el archivo.`;
}

function renderEnding(snapshot) {
  if (!snapshot.ending) { elements.ending.hidden = true; return; }
  const ending = snapshot.ending;
  const characterName = escapeHtml(snapshot.characterName);
  const narrative = escapeHtml(endingNarrative(snapshot));
  const ideology = ideologyLabel(snapshot.stats.ideology);
  const allies = Object.entries(snapshot.relations).filter(([, item]) => item.score >= 60).map(([name]) => name);
  const enemies = [...snapshot.memory.enemies.map((item) => item.label), ...Object.entries(snapshot.relations).filter(([, item]) => item.score <= -20).map(([name]) => name)];
  elements.ending.hidden = false;
  elements.ending.innerHTML = `
    <div class="ending-card__icon">${ending.icon}</div><p class="section-label">Final de trayectoria · ${characterName}</p>
    <h2>${ending.title}</h2><strong class="ending-card__label">${ending.label}</strong><p>${narrative}</p>
    <div class="ending-card__score ending-card__score--wide">
      <span><small>Mayor cargo</small><b>${snapshot.highestRole}</b></span><span><small>Años en cargos</small><b>${snapshot.yearsInPublicOffice}</b></span>
      <span><small>Presidenciales</small><b>${snapshot.elections.won}G · ${snapshot.elections.lost}P</b></span><span><small>Personalidad</small><b>${snapshot.personality}</b></span>
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
  elements.name.textContent = snapshot.characterName;
  const yearsToElection = Math.max(0, snapshot.nextElectionYear - snapshot.year);
  elements.calendar.textContent = `${snapshot.year} · ${yearsToElection === 0 ? "Elecciones este año" : `Elecciones en ${yearsToElection} ${yearsToElection === 1 ? "año" : "años"}`} · ${snapshot.presidentialRuns} ${snapshot.presidentialRuns === 1 ? "postulación" : "postulaciones"}`;
  renderStats(snapshot); renderContext(snapshot); renderHistory(snapshot); renderEnding(snapshot); renderDebug(snapshot);
  if (!snapshot.ending) renderEvent(snapshot);
  document.body.classList.toggle("has-ending", Boolean(snapshot.ending));
}

function persist(snapshot) {
  const saved = storageSet(SAVE_KEY, JSON.stringify(snapshot));
  elements.saveStatus.textContent = saved ? "Guardado automático" : "Guardado no disponible";
  elements.saveStatus.classList.toggle("is-error", !saved);
}

function updateUrlSeed() {
  const url = new URL(window.location.href);
  url.searchParams.set(GAME_CONFIG.random.queryParameter, activeSeed);
  if (engine.state?.originId) url.searchParams.set("origin", engine.state.originId);
  else url.searchParams.delete("origin");
  history.replaceState(null, "", url);
}

function startGame(originId, { seed = activeSeed, characterName = "Alex", backgroundId = null } = {}) {
  activeSeed = seed;
  engine = new GameEngine({ seed: activeSeed });
  const snapshot = engine.start(originId, { characterName, backgroundId });
  updateUrlSeed();
  elements.originView.hidden = true; elements.setupView.hidden = true; elements.gameView.hidden = false; elements.result.hidden = true;
  render(snapshot); persist(snapshot);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function continueGame() {
  const saved = readSavedGame();
  if (!saved) return;
  let snapshot;
  try {
    activeSeed = saved.seed;
    engine = new GameEngine({ seed: activeSeed });
    snapshot = engine.load(saved);
  } catch {
    storageRemove(SAVE_KEY);
    showOriginScreen();
    return;
  }
  updateUrlSeed();
  elements.originView.hidden = true; elements.setupView.hidden = true; elements.gameView.hidden = false; elements.result.hidden = true;
  render(snapshot);
}

function makeChoice(optionId) {
  if (choiceLocked) return;
  choiceLocked = true;
  elements.options.querySelectorAll("button").forEach((button) => { button.disabled = true; });
  try {
    const result = engine.choose(optionId);
    showResult(result); render(result.snapshot); persist(result.snapshot);
    window.setTimeout(() => elements.result.scrollIntoView({ behavior: "smooth", block: "nearest" }), 60);
  } finally {
    window.setTimeout(() => { choiceLocked = false; }, 220);
  }
}

function showOriginScreen({ newSeed = false } = {}) {
  if (newSeed) activeSeed = createSeed();
  engine = new GameEngine({ seed: activeSeed });
  storageRemove(SAVE_KEY);
  selectedOriginId = null; selectedBackgroundId = null;
  elements.gameView.hidden = true; elements.setupView.hidden = true; elements.originView.hidden = false; elements.result.hidden = true; elements.ending.hidden = true;
  document.body.classList.remove("has-ending");
  renderOrigins(); updateUrlSeed(); updateContinuePanel();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function updateContinuePanel() {
  let saved = readSavedGame();
  if (saved && (!saved.originId || !saved.currentEventId && !saved.endingId)) {
    storageRemove(SAVE_KEY);
    saved = null;
  }
  elements.continuePanel.hidden = !saved;
  if (saved) elements.continueText.textContent = `${saved.characterName ?? "Tu personaje"} · ${saved.originName} · ${saved.age} años · ${saved.role}`;
}

async function copyText(text) {
  try { await navigator.clipboard.writeText(text); return true; }
  catch { window.prompt("Copia este texto:", text); return false; }
}

document.addEventListener("click", (event) => {
  const originButton = event.target.closest("[data-origin]");
  const optionButton = event.target.closest("[data-option]");
  if (originButton) openCharacterSetup(originButton.dataset.origin);
  if (optionButton && !optionButton.disabled) makeChoice(optionButton.dataset.option);
  if (event.target.closest("[data-theme-toggle]")) {
    const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    storageSet(THEME_KEY, nextTheme);
    setTheme(nextTheme);
  }
  if (event.target.closest("[data-continue]")) continueGame();
  if (event.target.closest("[data-restart]")) {
    const hasProgress = Boolean(engine.state || readSavedGame());
    if (!hasProgress || window.confirm("¿Reiniciar esta trayectoria? Se reemplazará la partida guardada.")) showOriginScreen({ newSeed: true });
  }
  if (event.target.closest("[data-new-life]")) showOriginScreen({ newSeed: true });
  if (event.target.closest("[data-back-origins]")) { elements.setupView.hidden = true; elements.originView.hidden = false; window.scrollTo({ top: 0, behavior: "smooth" }); }
  const backgroundButton = event.target.closest("[data-background]");
  if (backgroundButton) { selectedBackgroundId = backgroundButton.dataset.background; renderBackgrounds(selectedOriginId); updateSetupValidity(); }
  const replay = event.target.closest("[data-replay-origin]");
  if (replay) { const snapshot = engine.getSnapshot(); startGame(replay.dataset.replayOrigin, { seed: activeSeed, characterName: snapshot.characterName, backgroundId: snapshot.backgroundId }); }
  const shareButton = event.target.closest("[data-share-ending]");
  if (shareButton) {
    copyText(endingNarrative(engine.getSnapshot())).then((copied) => {
      if (!copied) return;
      const previousLabel = shareButton.innerHTML;
      shareButton.innerHTML = "Resumen copiado <span>✓</span>";
      window.setTimeout(() => { if (shareButton.isConnected) shareButton.innerHTML = previousLabel; }, 1800);
    });
  }
  if (event.target.closest("[data-debug-force]")) { render(engine.forceEvent(document.querySelector("#debug-event-select").value)); }
  if (event.target.closest("[data-debug-year]")) { engine.advanceYear(); engine.state.currentEventId = engine.findNextEventId(); const snapshot = engine.getSnapshot(); render(snapshot); persist(snapshot); }
  if (event.target.closest("[data-debug-election]")) { engine.state.nextElectionYear = engine.state.year; render(engine.forceEvent("eleccion-nacional")); }
  if (event.target.closest("[data-debug-vacancy]")) { if (!engine.state.tags.includes("presidente-actual")) engine.state.tags.push("presidente-actual"); engine.state.hidden.vacancyRisk = 90; render(engine.forceEvent("mocion-vacancia")); }
  if (event.target.closest("[data-debug-crisis]")) { engine.state.contexts = ["crisis-institucional", ...engine.state.contexts].slice(0, 3); engine.state.national.socialConflict = Math.min(100, engine.state.national.socialConflict + 25); render(engine.getSnapshot()); }
  if (event.target.closest("[data-debug-stat]")) { const key = document.querySelector("#debug-stat-select").value; engine.state.stats[key] = Number(document.querySelector("#debug-stat-value").value); engine.normalizeAll(); render(engine.getSnapshot()); }
  if (event.target.closest("[data-debug-role]")) { engine.setRole(document.querySelector("#debug-role-value").value); render(engine.getSnapshot()); }
});

document.addEventListener("keydown", (event) => {
  if (event.defaultPrevented || event.repeat || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
  if (elements.gameView.hidden || engine.state?.endingId || ["INPUT", "TEXTAREA", "SELECT"].includes(event.target.tagName)) return;
  const key = event.key.toLowerCase();
  const letterIndex = "abcdefghij".indexOf(key);
  const numberIndex = /^\d$/.test(key) && key !== "0" ? Number(key) - 1 : -1;
  const optionIndex = letterIndex >= 0 ? letterIndex : numberIndex;
  if (optionIndex < 0) return;
  const optionButton = elements.options.querySelectorAll("[data-option]")[optionIndex];
  if (!optionButton || optionButton.disabled) return;
  event.preventDefault();
  optionButton.click();
});

elements.characterName.addEventListener("input", updateSetupValidity);
elements.characterForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!selectedOriginId || !selectedBackgroundId || !elements.characterName.value.trim()) return;
  startGame(selectedOriginId, { characterName: elements.characterName.value, backgroundId: selectedBackgroundId });
});

const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
const storedTheme = storageGet(THEME_KEY);
setTheme(["dark", "light"].includes(storedTheme) ? storedTheme : systemTheme.matches ? "dark" : "light");
systemTheme.addEventListener?.("change", (event) => {
  if (!["dark", "light"].includes(storageGet(THEME_KEY))) setTheme(event.matches ? "dark" : "light");
});
renderOrigins(); updateContinuePanel();
const sharedOrigin = params.get("origin");
if (engine.origins.some((origin) => origin.id === sharedOrigin)) openCharacterSetup(sharedOrigin);

import { GAME_CONFIG } from "../data/config.js";
import { GameEngine } from "./engine.js";
import { buildEndingNarrative, collectNarrativeAllies, collectNarrativeEnemies } from "./narrativeSystem.js";

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
  statsArea: document.querySelector("#stats-area"), statsToggle: document.querySelector("#all-stats-toggle"),
  statsPanel: document.querySelector("#all-stats-panel"), statsContent: document.querySelector("#all-stats-content"),
  age: document.querySelector("#player-age"), role: document.querySelector("#player-role"), origin: document.querySelector("#player-origin"), name: document.querySelector("#player-name"),
  eventKicker: document.querySelector("#event-kicker"), eventTitle: document.querySelector("#event-title"),
  eventDescription: document.querySelector("#event-description"), options: document.querySelector("#options"),
  history: document.querySelector("#history-list"), result: document.querySelector("#result-banner"),
  caseFiles: document.querySelector("#case-files"), caseFilesList: document.querySelector("#case-files-list"),
  caseFilesTitle: document.querySelector("#case-files-title"), caseFilesEyebrow: document.querySelector("#case-files-eyebrow"),
  ending: document.querySelector("#ending-card"),
  calendar: document.querySelector("#political-calendar"), saveStatus: document.querySelector("#save-status"), themeButton: document.querySelector("[data-theme-toggle]"),
  context: document.querySelector("#context-panel"), continuePanel: document.querySelector("#continue-panel"),
  continueText: document.querySelector("#continue-text"), debug: document.querySelector("#debug-panel"),
  setupOriginName: document.querySelector("#setup-origin-name"), setupOriginDescription: document.querySelector("#setup-origin-description"),
  characterForm: document.querySelector("#character-form"), characterName: document.querySelector("#character-name"),
  backgroundGrid: document.querySelector("#background-grid"), expressMode: document.querySelector("#express-mode"),
  startCharacter: document.querySelector("#start-character"), footnote: document.querySelector("#decision-footnote"),
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

const clampScore = (value) => Math.max(0, Math.min(100, Math.round(value)));

function deriveLegacyProfile(snapshot) {
  const hidden = snapshot.hidden;
  const visibleReach = Math.max(hidden.regionalSupport, hidden.internationalReputation, hidden.mediaNotoriety, hidden.urbanApproval, hidden.ruralApproval);
  const declaredTotal = Math.max(0, snapshot.stats.cleanMoney) + Math.max(0, snapshot.stats.dirtyMoney);
  const transparentFunds = declaredTotal === 0 ? 100 : 100 - (Math.max(0, snapshot.stats.dirtyMoney) / declaredTotal) * 115;
  const recordPenalty = snapshot.memory.scandals.length * 5 + snapshot.memory.investigations.length * 3;
  const elapsedYears = Math.max(0, Number(snapshot.year ?? GAME_CONFIG.startYear) - GAME_CONFIG.startYear);
  const impact = clampScore(snapshot.stats.approval * 0.4 + snapshot.stats.influence * 0.4 + visibleReach * 0.2);
  const integrity = clampScore(hidden.credibility * 0.3 + hidden.personalReputation * 0.25 + (100 - snapshot.stats.legalRisk) * 0.3 + transparentFunds * 0.15 - recordPenalty);
  const service = clampScore(snapshot.yearsInPublicOffice * 4 + snapshot.elections.won * 10 + Math.min(20, elapsedYears * 0.45));
  const reach = clampScore(visibleReach * 0.75 + Math.max(hidden.partyCohesion, hidden.businessSupport, hidden.unionSupport) * 0.25);
  const score = clampScore(impact * 0.35 + integrity * 0.3 + service * 0.2 + reach * 0.15);
  return { score, impact, integrity, service, reach };
}

function deriveAchievements(snapshot) {
  const hidden = snapshot.hidden;
  const allies = collectNarrativeAllies(snapshot).length;
  const definitions = [
    { icon: "★", title: "Llegó a Palacio", description: "Ganó una elección presidencial.", when: snapshot.elections.won > 0 || snapshot.tags.includes("fue-presidente") },
    { icon: "★", title: "Mandato renovado", description: "Alcanzó dos victorias presidenciales.", when: snapshot.elections.won >= 2 },
    { icon: "↻", title: "Siempre en campaña", description: "Disputó la presidencia al menos tres veces.", when: snapshot.presidentialRuns >= 3 },
    { icon: "▥", title: "Vida de servicio", description: "Acumuló quince años en cargos públicos.", when: snapshot.yearsInPublicOffice >= 15 },
    { icon: "○", title: "Manos limpias", description: "Cerró con poco riesgo, casi sin fondos clandestinos y sin escándalos.", when: snapshot.stats.legalRisk <= 20 && snapshot.stats.dirtyMoney <= 10000 && snapshot.memory.scandals.length === 0 },
    { icon: "♥", title: "Respaldo popular", description: "Terminó con aceptación extraordinaria.", when: snapshot.stats.approval >= 75 },
    { icon: "◆", title: "Poder de convocatoria", description: "Conservó una influencia extraordinaria.", when: snapshot.stats.influence >= 75 },
    { icon: "▲", title: "Raíz territorial", description: "Construyó una base regional duradera.", when: hidden.regionalSupport >= 75 },
    { icon: "◎", title: "Voz internacional", description: "Alcanzó reconocimiento fuera del país.", when: hidden.internationalReputation >= 75 },
    { icon: "◉", title: "Dueño de la agenda", description: "Su notoriedad mediática superó a la organización.", when: hidden.mediaNotoriety >= 80 },
    { icon: "▧", title: "Organización duradera", description: "Dejó una estructura partidaria cohesionada.", when: hidden.partyCohesion >= 75 },
    { icon: "S/", title: "Autonomía financiera", description: "Terminó con más de un millón de soles declarados.", when: snapshot.stats.cleanMoney >= 1000000 },
    { icon: "◇", title: "Red de confianza", description: "Conservó al menos tres aliados sólidos.", when: allies >= 3 },
    { icon: "⚖", title: "Sobrevivió al expediente", description: "Atravesó varias investigaciones sin terminar en prisión.", when: snapshot.memory.investigations.length >= 2 && !snapshot.tags.includes("en-prision") },
    { icon: "□", title: "Memoria enfrentada", description: "Llevó la ruta del reincorporado hasta una decisión final sobre verdad y legado.", when: snapshot.tags.some((tag) => ["legado-reinsercion-documentado", "legado-reinsercion-disputado"].includes(tag)) },
    { icon: "♜", title: "El peso del apellido", description: "Definió quién conservaría el archivo y la herencia de la dinastía.", when: snapshot.tags.some((tag) => ["legado-dinastia-abierto", "legado-dinastia-curado"].includes(tag)) },
    { icon: "▲", title: "La red de las provincias", description: "Convirtió su liderazgo territorial en institución o sucesión política.", when: snapshot.tags.some((tag) => ["legado-provincia-institucional", "legado-provincia-caudillo"].includes(tag)) },
    { icon: "S/", title: "Empresa después del poder", description: "Resolvió la sucesión del patrimonio y su relación con la organización política.", when: snapshot.tags.some((tag) => ["legado-empresarial-institucional", "legado-empresarial-heredado"].includes(tag)) },
    { icon: "◉", title: "La voz queda", description: "Decidió quién heredaría el canal, el archivo y su comunidad política.", when: snapshot.tags.some((tag) => ["legado-podcaster-cooperativo", "legado-podcaster-heredado"].includes(tag)) },
    { icon: "—", title: "Décadas de trayectoria", description: "Mantuvo una vida política activa durante al menos treinta años.", when: Number(snapshot.year ?? GAME_CONFIG.startYear) - GAME_CONFIG.startYear >= 30 },
  ];
  return definitions.filter((achievement) => achievement.when);
}

function formatStat(key, value) {
  const meta = GAME_CONFIG.stats[key];
  if (meta.format === "money") return formatMoney(value);
  if (meta.format === "ideology") return `${value > 0 ? "+" : ""}${value} · ${ideologyLabel(value)}`;
  return `${value}%`;
}

function formatInternalStat(key, value) {
  if (key === "undeclaredWealth") return formatMoney(value);
  return `${Math.round(value)}%`;
}

function formatNationalStat(key, value) {
  const meta = GAME_CONFIG.nationalStats[key];
  const rounded = Number.isInteger(value) ? value : Math.round(value * 10) / 10;
  return meta.suffix ? `${rounded}${meta.suffix}` : `${rounded}/100`;
}

function normalizedStatValue(value, meta) {
  if (!Number.isFinite(meta.min) || !Number.isFinite(meta.max) || meta.max === meta.min) return null;
  return Math.max(0, Math.min(100, ((value - meta.min) / (meta.max - meta.min)) * 100));
}

function renderAllStatsGroup(title, entries, values, formatter) {
  return `<section class="all-stats-group">
    <div class="all-stats-group__title"><h3>${title}</h3><span>${entries.length}</span></div>
    <div class="all-stats-grid">${entries.map(([key, meta]) => {
      const value = values[key];
      const meter = normalizedStatValue(value, meta);
      return `<article class="all-stat-card">
        <div><small>${meta.label}</small><strong>${formatter(key, value)}</strong></div>
        ${meter === null ? `<span class="all-stat-card__rule"></span>` : `<span class="all-stat-card__meter"><i style="width:${meter}%"></i></span>`}
      </article>`;
    }).join("")}</div>
  </section>`;
}

function renderAllStats(snapshot) {
  elements.statsContent.innerHTML = [
    renderAllStatsGroup("Principales", Object.entries(GAME_CONFIG.stats), snapshot.stats, formatStat),
    renderAllStatsGroup("Internas", Object.entries(GAME_CONFIG.hiddenStats), snapshot.hidden, formatInternalStat),
    renderAllStatsGroup("Indicadores nacionales", Object.entries(GAME_CONFIG.nationalStats), snapshot.national, formatNationalStat),
  ].join("");
}

function setAllStatsOpen(open) {
  elements.statsPanel.hidden = !open;
  elements.statsToggle.setAttribute("aria-expanded", String(open));
  elements.statsToggle.classList.toggle("is-open", open);
  elements.statsToggle.querySelector("i").textContent = open ? "−" : "+";
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
    <button class="origin-card" type="button" data-origin="${origin.id}">
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
  elements.expressMode.checked = false;
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

function activeCaseFamily(kind) {
  const families = {
    trial: "legal", juicio: "legal", judicial: "legal", investigation: "legal", investigacion: "legal",
    disaster: "crisis", crisis: "crisis", climate: "crisis", weather: "crisis", disaster_national: "crisis",
    election: "election", campaign: "election", eleccion: "election",
    vacancy: "vacancy", vacancia: "vacancy",
    prison: "prison", prision: "prison", exile: "prison", exilio: "prison",
    presidency: "government", government: "government", gobierno: "government",
  };
  return families[String(kind ?? "").toLowerCase()] ?? "general";
}

function activeCaseTone(tone) {
  const normalized = String(tone ?? "").toLowerCase();
  if (["positive", "success", "stable", "resolved", "favorable", "good"].includes(normalized)) return "positive";
  if (["warning", "watch", "unstable", "alert"].includes(normalized)) return "warning";
  if (["danger", "critical", "negative", "severe"].includes(normalized)) return "danger";
  return "neutral";
}

function caseValue(value) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? Math.max(0, Math.min(100, Math.round(numeric))) : 0;
}

function sameCaseNews(left, right) {
  if (!left || !right) return false;
  if (left.id && right.id) return left.id === right.id;
  return left.year === right.year && left.headline === right.headline && left.text === right.text;
}

function renderActiveCases(snapshot) {
  const activeCases = Array.isArray(snapshot.activeCases) ? snapshot.activeCases.slice(0, 3) : [];
  if (!activeCases.length) {
    elements.caseFiles.hidden = true;
    elements.caseFilesList.innerHTML = "";
    return;
  }

  elements.caseFiles.hidden = false;
  const allCasesResolved = activeCases.every((activeCase) => activeCase.status === "Resuelto");
  elements.caseFilesTitle.textContent = snapshot.ending ? "Expedientes al cierre" : allCasesResolved ? "Expedientes resueltos" : "Expedientes activos";
  elements.caseFilesEyebrow.textContent = snapshot.ending || allCasesResolved ? "Balance de trayectoria" : "Historias en desarrollo";
  elements.caseFilesList.classList.toggle("case-files__grid--single", activeCases.length === 1);
  elements.caseFilesList.classList.toggle("case-files__grid--triple", activeCases.length === 3);
  elements.caseFilesList.innerHTML = activeCases.map((activeCase, caseIndex) => {
    const family = activeCaseFamily(activeCase.kind);
    const statusTone = activeCaseTone(activeCase.statusTone);
    const metrics = Array.isArray(activeCase.metrics) ? activeCase.metrics : [];
    const news = Array.isArray(activeCase.news) ? activeCase.news.filter((entry) => entry && typeof entry === "object") : [];
    const latestNews = news.at(-1);
    const timeline = Array.isArray(activeCase.timeline)
      ? activeCase.timeline.filter((entry) => entry && typeof entry === "object" && !sameCaseNews(entry, latestNews)).slice(-3).reverse()
      : [];
    const stageCurrentRaw = Number(activeCase.stage?.current);
    const stageTotalRaw = Number(activeCase.stage?.total);
    const stageTotal = Number.isFinite(stageTotalRaw) && stageTotalRaw > 0 ? Math.round(stageTotalRaw) : 1;
    const stageCurrent = Number.isFinite(stageCurrentRaw) ? Math.max(0, Math.min(stageTotal, Math.round(stageCurrentRaw))) : 0;
    const stageProgress = Math.round((stageCurrent / stageTotal) * 100);
    const titleId = `case-file-title-${caseIndex}`;

    return `<article class="case-file case-file--${family}${caseIndex === 0 ? " case-file--primary" : " case-file--secondary"}" aria-labelledby="${titleId}">
      <header class="case-file__header">
        <div><small>${escapeHtml(activeCase.kicker ?? "Expediente especial")}</small><h3 id="${titleId}">${escapeHtml(activeCase.title)}</h3></div>
        <span class="case-file__status case-file__status--${statusTone}">${escapeHtml(activeCase.status ?? "En curso")}</span>
      </header>
      <div class="case-file__stage">
        <div><small>Etapa ${stageCurrent} de ${stageTotal}</small><strong>${escapeHtml(activeCase.stage?.label ?? "En desarrollo")}</strong></div>
        <span class="case-file__stage-track" role="progressbar" aria-label="Avance de ${escapeHtml(activeCase.title)}" aria-valuemin="0" aria-valuemax="${stageTotal}" aria-valuenow="${stageCurrent}" aria-valuetext="Etapa ${stageCurrent} de ${stageTotal}"><i style="width:${stageProgress}%"></i></span>
      </div>
      ${latestNews ? `<article class="case-file__news case-file__news--${activeCaseTone(latestNews.tone)}" aria-label="Noticia más reciente">
        <small>Último despacho${latestNews.year ? ` · ${escapeHtml(latestNews.year)}` : ""}</small>
        <h4>${escapeHtml(latestNews.headline)}</h4>
        ${latestNews.text ? `<p>${escapeHtml(latestNews.text)}</p>` : ""}
        ${latestNews.causeLabel ? `<span>↳ ${escapeHtml(latestNews.causeLabel)}</span>` : ""}
      </article>` : ""}
      ${metrics.length ? `<dl class="case-file__metrics">${metrics.map((metric) => {
        const value = caseValue(metric.value);
        const metricTone = activeCaseTone(metric.tone);
        const hasPrevious = metric.previousValue !== null && metric.previousValue !== undefined && Number.isFinite(Number(metric.previousValue));
        const delta = hasPrevious ? value - caseValue(metric.previousValue) : 0;
        const deltaIsPositive = metric.direction === "low" ? delta < 0 : delta > 0;
        const deltaTone = delta === 0 ? "neutral" : deltaIsPositive ? "positive" : "danger";
        const deltaLabel = !hasPrevious ? "Valor inicial" : delta === 0 ? "Sin cambio" : `${delta > 0 ? "+" : "−"}${Math.abs(delta)}`;
        return `<div class="case-file__metric case-file__metric--${metricTone}">
          <dt>${escapeHtml(metric.label)}</dt>
          <dd>
            <span class="case-file__metric-value"><strong>${value}</strong><span class="case-file__delta case-file__delta--${deltaTone}">${deltaLabel}</span></span>
            <span class="case-file__metric-track" role="progressbar" aria-label="${escapeHtml(metric.label)}: ${value} de 100" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${value}"><i style="width:${value}%"></i></span>
          </dd>
        </div>`;
      }).join("")}</dl>` : ""}
      ${timeline.length ? `<div class="case-file__timeline"><small>Cronología reciente</small><ol>${timeline.map((entry) => `
        <li><time>${escapeHtml(entry.year ?? "Ahora")}</time><div><strong>${escapeHtml(entry.headline ?? entry.label ?? entry.title)}</strong>${entry.text ?? entry.description ? `<p>${escapeHtml(entry.text ?? entry.description)}</p>` : ""}${entry.causeLabel ? `<span>↳ ${escapeHtml(entry.causeLabel)}</span>` : ""}</div></li>
      `).join("")}</ol></div>` : ""}
    </article>`;
  }).join("");
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
  const publicRole = snapshot.tags.includes("presidente-actual") || /alcalde|gobernador|congres|diputad|senad|ministro|premier|vicepresidente/.test(snapshot.role.toLowerCase());
  const relevantNational = publicRole ? changes.national.slice(0, 3).map(({ key, delta }) => {
    const meta = GAME_CONFIG.nationalStats[key];
    return `<span class="change-chip is-context">${meta.label} ${delta > 0 ? "+" : ""}${delta}${meta.suffix}</span>`;
  }) : [];
  if (changes.role) visible.unshift(`<span class="change-chip is-role">Nuevo cargo: ${changes.role.to}</span>`);
  for (const scandal of changes.newScandals) visible.push(`<span class="change-chip is-alert">Escándalo: ${scandal.label}</span>`);
  const caseChanges = changes.cases ?? { opened: [], resolved: [] };
  const resolvedCaseIds = new Set((caseChanges.resolved ?? []).map((entry) => entry.id));
  const openedCaseIds = new Set((caseChanges.opened ?? []).map((entry) => entry.id));
  for (const activeCase of caseChanges.opened ?? []) {
    if (!resolvedCaseIds.has(activeCase.id)) visible.push(`<span class="change-chip is-context">Nuevo expediente: ${escapeHtml(activeCase.title)}</span>`);
  }
  for (const activeCase of caseChanges.updated ?? []) {
    if (!openedCaseIds.has(activeCase.id) && !resolvedCaseIds.has(activeCase.id)) visible.push(`<span class="change-chip is-context">Expediente actualizado: ${escapeHtml(activeCase.title)}</span>`);
  }
  for (const activeCase of caseChanges.resolved ?? []) {
    visible.push(`<span class="change-chip is-role">Expediente resuelto: ${escapeHtml(activeCase.resolution ?? activeCase.title)}</span>`);
  }
  return [...visible, ...relevantHidden, ...relevantNational].join("");
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
  const profile = deriveLegacyProfile(snapshot);
  return buildEndingNarrative(snapshot, profile);
}

function renderEnding(snapshot) {
  if (!snapshot.ending) { elements.ending.hidden = true; return; }
  const ending = snapshot.ending;
  const characterName = escapeHtml(snapshot.characterName);
  const narrative = escapeHtml(endingNarrative(snapshot));
  const ideology = ideologyLabel(snapshot.stats.ideology);
  const legacy = deriveLegacyProfile(snapshot);
  const achievements = deriveAchievements(snapshot);
  const allies = collectNarrativeAllies(snapshot);
  const enemies = collectNarrativeEnemies(snapshot);
  const casePriority = { prison: 100, trial: 95, exile: 90, vacancy: 85, disaster: 75, campaign: 65 };
  const specialCases = [...(snapshot.caseArchive ?? []), ...(snapshot.activeCases ?? [])]
    .sort((left, right) => Number(casePriority[right.kind] ?? 0) - Number(casePriority[left.kind] ?? 0)
      || Number(right.resolvedYear ?? right.updatedYear ?? 0) - Number(left.resolvedYear ?? left.updatedYear ?? 0));
  const specialCaseSummary = specialCases.slice(0, 4).map((activeCase) => {
    const cause = activeCase.originDecision ? `, tras «${activeCase.originDecision}»` : "";
    return `${activeCase.title}: ${activeCase.resolution ?? activeCase.status}${cause}`;
  }).join(" · ");
  elements.ending.hidden = false;
  elements.ending.innerHTML = `
    <div class="ending-card__icon">${ending.icon}</div><p class="section-label">Final de trayectoria · ${characterName}</p>
    <h2>${escapeHtml(ending.title)}</h2><strong class="ending-card__label">${escapeHtml(ending.label)}</strong>
    <p class="ending-card__verdict">${escapeHtml(ending.description)}</p><p class="ending-card__narrative">${narrative}</p>
    <div class="legacy-index" aria-label="Índice de legado: ${legacy.score} de 100">
      <div class="legacy-index__total"><small>Índice de legado</small><strong>${legacy.score}</strong><span>/100</span></div>
      <div class="legacy-index__parts"><span><small>Impacto</small><b>${legacy.impact}</b></span><span><small>Integridad</small><b>${legacy.integrity}</b></span><span><small>Servicio</small><b>${legacy.service}</b></span><span><small>Alcance</small><b>${legacy.reach}</b></span></div>
    </div>
    <section class="achievement-section" aria-label="Logros desbloqueados"><div class="achievement-section__heading"><div><small>Archivo de hitos</small><h3>Logros desbloqueados</h3></div><strong>${achievements.length}</strong></div>
      <div class="achievement-grid">${achievements.length ? achievements.map((achievement) => `<article><i aria-hidden="true">${achievement.icon}</i><div><b>${escapeHtml(achievement.title)}</b><small>${escapeHtml(achievement.description)}</small></div></article>`).join("") : `<p>La trayectoria no dejó un hito excepcional, pero sí un balance completo de decisiones y consecuencias.</p>`}</div>
    </section>
    <div class="ending-card__score ending-card__score--wide">
      <span><small>Mayor cargo</small><b>${snapshot.highestRole}</b></span><span><small>Años en cargos</small><b>${snapshot.yearsInPublicOffice}</b></span>
      <span><small>Presidenciales</small><b>${snapshot.presidentialRuns > 0 || snapshot.elections.won + snapshot.elections.lost > 0 ? `${snapshot.elections.won}G · ${snapshot.elections.lost}P` : "No postuló"}</b></span><span><small>Personalidad</small><b>${snapshot.personality}</b></span>
      <span><small>Dinero limpio</small><b>${formatMoney(snapshot.stats.cleanMoney)}</b></span><span><small>Dinero sucio</small><b>${formatMoney(snapshot.stats.dirtyMoney)}</b></span>
      <span><small>Aceptación</small><b>${snapshot.stats.approval}%</b></span><span><small>Tendencia</small><b>${ideology}</b></span>
    </div>
    <div class="legacy-list"><p><b>Aliados registrados:</b> ${allies.slice(0, 4).map(escapeHtml).join(", ") || "ninguno estable"}</p><p><b>Enemigos registrados:</b> ${enemies.slice(0, 4).map(escapeHtml).join(", ") || "ninguno declarado"}</p><p><b>Expediente:</b> ${snapshot.memory.scandals.length} escándalos · ${snapshot.memory.investigations.length} investigaciones · ${snapshot.memory.wars.length} conflictos</p><p><b>Historias especiales:</b> ${specialCases.length ? escapeHtml(specialCaseSummary) : "ningún expediente especial registrado"}</p></div>
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
  elements.calendar.textContent = `${snapshot.year} · ${yearsToElection === 0 ? "Elecciones este año" : `Elecciones en ${yearsToElection} ${yearsToElection === 1 ? "año" : "años"}`} · ${snapshot.presidentialRuns} ${snapshot.presidentialRuns === 1 ? "postulación" : "postulaciones"}${snapshot.gameMode === "express" ? " · Express" : ""}`;
  renderStats(snapshot); renderAllStats(snapshot); renderContext(snapshot); renderActiveCases(snapshot); renderHistory(snapshot); renderEnding(snapshot); renderDebug(snapshot);
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

function startGame(originId, { seed = activeSeed, characterName = "Alex", backgroundId = null, gameMode = "standard" } = {}) {
  activeSeed = seed;
  engine = new GameEngine({ seed: activeSeed });
  const snapshot = engine.start(originId, { characterName, backgroundId, gameMode });
  updateUrlSeed();
  elements.originView.hidden = true; elements.setupView.hidden = true; elements.gameView.hidden = false; elements.result.hidden = true;
  setAllStatsOpen(false);
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
  setAllStatsOpen(false);
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
  setAllStatsOpen(false);
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
  if (saved) elements.continueText.textContent = `${saved.characterName ?? "Tu personaje"} · ${saved.originName} · ${saved.age} años · ${saved.role}${saved.gameMode === "express" ? " · Express" : ""}`;
}

async function copyText(text) {
  try { await navigator.clipboard.writeText(text); return true; }
  catch { window.prompt("Copia este texto:", text); return false; }
}

document.addEventListener("click", (event) => {
  const statsToggle = event.target.closest("#all-stats-toggle");
  const closeStats = event.target.closest("[data-close-stats]");
  if (statsToggle) setAllStatsOpen(elements.statsToggle.getAttribute("aria-expanded") !== "true");
  else if (closeStats) setAllStatsOpen(false);
  else if (!elements.statsPanel.hidden && !event.target.closest("#all-stats-panel")) setAllStatsOpen(false);
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
  if (replay) { const snapshot = engine.getSnapshot(); startGame(replay.dataset.replayOrigin, { seed: activeSeed, characterName: snapshot.characterName, backgroundId: snapshot.backgroundId, gameMode: snapshot.gameMode }); }
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
  if (event.target.closest("[data-debug-year]")) { engine.advanceYear(); engine.state.currentEventId = engine.findNextEventId(); const snapshot = engine.syncCurrentCases(); render(snapshot); persist(snapshot); }
  if (event.target.closest("[data-debug-election]")) { engine.state.nextElectionYear = engine.state.year; render(engine.forceEvent("eleccion-nacional")); }
  if (event.target.closest("[data-debug-vacancy]")) { if (!engine.state.tags.includes("presidente-actual")) engine.state.tags.push("presidente-actual"); engine.state.hidden.vacancyRisk = 90; render(engine.forceEvent("mocion-vacancia")); }
  if (event.target.closest("[data-debug-crisis]")) { engine.state.contexts = ["crisis-institucional", ...engine.state.contexts].slice(0, 3); engine.state.national.socialConflict = Math.min(100, engine.state.national.socialConflict + 25); render(engine.getSnapshot()); }
  if (event.target.closest("[data-debug-stat]")) { const key = document.querySelector("#debug-stat-select").value; engine.state.stats[key] = Number(document.querySelector("#debug-stat-value").value); engine.normalizeAll(); render(engine.getSnapshot()); }
  if (event.target.closest("[data-debug-role]")) { engine.setRole(document.querySelector("#debug-role-value").value); render(engine.getSnapshot()); }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !elements.statsPanel.hidden) {
    event.preventDefault();
    setAllStatsOpen(false);
    elements.statsToggle.focus();
    return;
  }
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
  startGame(selectedOriginId, { characterName: elements.characterName.value, backgroundId: selectedBackgroundId, gameMode: elements.expressMode.checked ? "express" : "standard" });
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

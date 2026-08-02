import { GAME_CONFIG } from "../data/config.js";
import { GameEngine } from "./engine.js";

const params = new URLSearchParams(window.location.search);
const seed = params.get(GAME_CONFIG.random.queryParameter);
const engine = new GameEngine({ seed });

const elements = {
  originView: document.querySelector("#origin-view"),
  gameView: document.querySelector("#game-view"),
  originGrid: document.querySelector("#origin-grid"),
  stats: document.querySelector("#stats"),
  age: document.querySelector("#player-age"),
  role: document.querySelector("#player-role"),
  origin: document.querySelector("#player-origin"),
  eventKicker: document.querySelector("#event-kicker"),
  eventTitle: document.querySelector("#event-title"),
  eventDescription: document.querySelector("#event-description"),
  options: document.querySelector("#options"),
  history: document.querySelector("#history-list"),
  result: document.querySelector("#result-banner"),
  ending: document.querySelector("#ending-card"),
  restart: document.querySelectorAll("[data-restart]"),
  seed: document.querySelector("#seed-label"),
};

function formatStat(key, value) {
  const meta = GAME_CONFIG.stats[key];
  if (meta.format === "money") {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
      maximumFractionDigits: 0,
    }).format(value);
  }
  return `${value}%`;
}

function renderOrigins() {
  elements.originGrid.innerHTML = engine.origins.map((origin, index) => `
    <button class="origin-card" type="button" data-origin="${origin.id}" style="--delay: ${index * 70}ms">
      <span class="origin-card__topline">
        <span class="origin-card__number">0${index + 1}</span>
        <span class="origin-card__icon" aria-hidden="true">${origin.icon ?? "·"}</span>
      </span>
      <span class="origin-card__eyebrow">${origin.eyebrow ?? "Origen"}</span>
      <strong>${origin.name}</strong>
      <span class="origin-card__description">${origin.description}</span>
      <span class="origin-card__meta">${origin.startAge} años <i></i> ${origin.initialRole}</span>
      <span class="origin-card__cta">Elegir este origen <b>→</b></span>
    </button>
  `).join("");
}

function renderStats(snapshot) {
  elements.stats.innerHTML = Object.entries(GAME_CONFIG.stats).map(([key, meta]) => {
    const value = snapshot.stats[key];
    const isMeter = meta.format === "percent";
    const riskClass = key === "legalRisk" ? " stat-card--risk" : "";
    return `
      <article class="stat-card${riskClass}">
        <div class="stat-card__header"><span>${meta.icon}</span><small>${meta.label}</small></div>
        <strong>${formatStat(key, value)}</strong>
        ${isMeter ? `<div class="meter"><i style="width:${value}%"></i></div>` : `<div class="money-rule"></div>`}
      </article>
    `;
  }).join("");
}

function renderEvent(snapshot) {
  const event = snapshot.event;
  if (!event) return;
  elements.eventKicker.textContent = event.kicker ?? "Decisión anual";
  elements.eventTitle.textContent = event.title;
  elements.eventDescription.textContent = event.description;
  const options = engine.getAvailableOptions();
  elements.options.innerHTML = options.map((option, index) => `
    <button class="decision-option" type="button" data-option="${option.id}" ${option.available ? "" : "disabled"}>
      <span class="decision-option__letter">${String.fromCharCode(65 + index)}</span>
      <span class="decision-option__copy">
        <strong>${option.label}</strong>
        <small>${option.available ? option.hint ?? "Tomar esta decisión" : "No cumples los requisitos"}</small>
      </span>
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
    <li class="history-item">
      <span class="history-item__marker">${index === 0 ? "●" : "○"}</span>
      <div><small>${entry.age} años · ${entry.eventTitle}</small><strong>${entry.optionLabel}</strong><p>${entry.text}</p></div>
    </li>
  `).join("");
}

function renderEnding(snapshot) {
  if (!snapshot.ending) {
    elements.ending.hidden = true;
    return;
  }
  const ending = snapshot.ending;
  elements.ending.hidden = false;
  elements.ending.innerHTML = `
    <div class="ending-card__icon">${ending.icon}</div>
    <p class="section-label">Final de trayectoria</p>
    <h2>${ending.title}</h2>
    <strong class="ending-card__label">${ending.label}</strong>
    <p>${ending.description}</p>
    <div class="ending-card__score">
      <span><small>Aceptación final</small><b>${snapshot.stats.approval}%</b></span>
      <span><small>Influencia final</small><b>${snapshot.stats.influence}%</b></span>
      <span><small>Edad</small><b>${snapshot.age}</b></span>
    </div>
    <button class="primary-button" type="button" data-restart>Jugar otra trayectoria <span>↻</span></button>
  `;
}

function render(snapshot) {
  elements.age.textContent = snapshot.age;
  elements.role.textContent = snapshot.role;
  elements.origin.textContent = snapshot.originName;
  renderStats(snapshot);
  renderHistory(snapshot);
  renderEnding(snapshot);
  if (!snapshot.ending) renderEvent(snapshot);
  document.body.classList.toggle("has-ending", Boolean(snapshot.ending));
}

function startGame(originId) {
  const snapshot = engine.start(originId);
  elements.originView.hidden = true;
  elements.gameView.hidden = false;
  elements.result.hidden = true;
  render(snapshot);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function makeChoice(optionId) {
  elements.options.querySelectorAll("button").forEach((button) => { button.disabled = true; });
  const { snapshot, outcome } = engine.choose(optionId);
  elements.result.innerHTML = `<span>Resultado</span><p>${outcome.text ?? "Tu trayectoria ha cambiado."}</p>`;
  elements.result.hidden = false;
  render(snapshot);
  window.setTimeout(() => elements.result.scrollIntoView({ behavior: "smooth", block: "nearest" }), 60);
}

function restartGame() {
  engine.reset();
  elements.gameView.hidden = true;
  elements.originView.hidden = false;
  elements.result.hidden = true;
  elements.ending.hidden = true;
  document.body.classList.remove("has-ending");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.addEventListener("click", (event) => {
  const originButton = event.target.closest("[data-origin]");
  const optionButton = event.target.closest("[data-option]");
  const restartButton = event.target.closest("[data-restart]");
  if (originButton) startGame(originButton.dataset.origin);
  if (optionButton && !optionButton.disabled) makeChoice(optionButton.dataset.option);
  if (restartButton) restartGame();
});

elements.seed.textContent = seed ? `Partida reproducible · semilla ${seed}` : "Cada decisión puede cambiarlo todo";
renderOrigins();

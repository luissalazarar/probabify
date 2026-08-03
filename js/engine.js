import { GAME_CONFIG } from "../data/config.js";
import { ORIGINS } from "../data/origins.js";
import { EVENTS } from "../data/events/index.js";
import { ENDINGS } from "../data/endings.js";
import { EVENT_CAREER_GATES } from "../data/eventLogic.js";
import { BACKGROUNDS, backgroundsForOrigin } from "../data/backgrounds.js";
import { SPECIAL_CASE_ACTIONS } from "../data/specialCases.js";
import {
  applyCasePayload,
  buildCaseChanges,
  finalizeActiveCases,
  getCaseOutcomeMultiplier,
  initializeCaseState,
  migrateCaseState,
  recordCaseAction,
  recordCaseDecision,
  syncActiveCases,
} from "./caseSystem.js";

const clone = (value) => JSON.parse(JSON.stringify(value));
const clamp = (value, min = -Infinity, max = Infinity) => Math.max(min, Math.min(max, value));
const stableHash = (value) => {
  let hash = 2166136261;
  for (const character of String(value)) hash = Math.imul(hash ^ character.charCodeAt(0), 16777619);
  return hash >>> 0;
};

const ROLE_RANK = {
  "Creador de contenido político": 1, "Dirigente vecinal": 1, "Asesor independiente": 2,
  "Reincorporado a la vida civil": 0, "Exmilitante del MRTA": 0, "Excuadro del Sindicato Luciérnaga": 0,
  "Heredera de una dinastía": 1, "Heredera de una familia presidencial": 1, "Heredera de un clan regional": 1, "Heredera de un linaje parlamentario": 1,
  "Referente provincial": 1, "Dirigente de rondas campesinas": 2, "Gestor municipal": 2, "Vocero de un frente ambiental": 2,
  "Empresario": 2, "Director de una constructora": 3, "Fundador tecnológico": 3, "Ejecutivo minero": 3,
  "Comunicador político": 1, "Reportero independiente": 2, "Comentarista digital": 2, "Profesor universitario": 2,
  "Dirigente partidaria": 3, "Dirigente político": 3, "Líder vecinal": 2, "Líder regional": 4,
  "Asesora parlamentaria": 2, "Asesor parlamentario": 2, "Asesor de imagen": 2, "Asesor presidencial": 4, "Asesor internacional": 3,
  "Vocero político": 3, "Regidor distrital": 3, "Secretario partidario": 3, "Operador mediático": 3, "Operador político": 4,
  "Líder opositor": 5, "Conferencista internacional": 2, "Colaborador eficaz": 2, "Alcalde": 4, "Congresista": 5,
  "Diputado de la República": 5, "Diputada de la República": 5, "Senador de la República": 6, "Senadora de la República": 6,
  "Gobernador regional": 6, "Embajador": 6, "Ministro de Estado": 7, "Premier": 8,
  "Exministro": 7, "Presidente del Congreso": 8, "Vicepresidente del Perú": 8, "Presidente del Perú": 10,
  "Expresidente del Perú": 10,
};
const ROLE_CANONICAL = {
  "Exalcalde": "Alcalde", "Exgobernador regional": "Gobernador regional", "Excongresista": "Congresista",
  "Exdiputado de la República": "Diputado de la República", "Exdiputada de la República": "Diputada de la República",
  "Exsenador de la República": "Senador de la República", "Exsenadora de la República": "Senadora de la República",
  "Exvicepresidente del Perú": "Vicepresidente del Perú", "Exministro": "Ministro de Estado", "Expremier": "Premier",
  "Exembajador": "Embajador", "Expresidente del Perú": "Presidente del Perú",
};
const LEGACY_ROLE_NAMES = {
  "Excuadro de Somos Lunáticos": "Excuadro del Sindicato Luciérnaga",
};
const TERM_END_ROLES = {
  "Alcalde": { role: "Exalcalde", removeTags: ["cargo-ejecutivo-local"], addTag: "fue-alcalde" },
  "Gobernador regional": { role: "Exgobernador regional", removeTags: ["poder-regional"], addTag: "fue-gobernador" },
  "Congresista": { role: "Excongresista", removeTags: ["congresista"], addTag: "fue-congresista" },
  "Diputado de la República": { role: "Exdiputado de la República", removeTags: ["diputado", "congresista"], addTag: "fue-congresista" },
  "Diputada de la República": { role: "Exdiputada de la República", removeTags: ["diputado", "congresista"], addTag: "fue-congresista" },
  "Senador de la República": { role: "Exsenador de la República", removeTags: ["senador", "congresista"], addTag: "fue-congresista" },
  "Senadora de la República": { role: "Exsenadora de la República", removeTags: ["senador", "congresista"], addTag: "fue-congresista" },
  "Vicepresidente del Perú": { role: "Exvicepresidente del Perú", addTag: "fue-vicepresidente" },
  "Ministro de Estado": { role: "Exministro", addTag: "fue-ministro" },
  "Premier": { role: "Expremier", addTag: "fue-premier" },
  "Embajador": { role: "Exembajador", addTag: "fue-embajador" },
  "Político bajo arresto domiciliario": { role: "Político en libertad vigilada", removeTags: ["arresto-domiciliario"], addTag: "libertad-vigilada" },
};
const PRESIDENT_EXIT_EVENTS = new Set(["eleccion-nacional", "mocion-vacancia", "fiscalia-cerca", "investigacion-avanzada", "orden-captura", "juicio-en-libertad"]);
const ACTIVE_LOCAL_ROLES = new Set(["Regidor distrital", "Alcalde", "Gobernador regional"]);
const ACTIVE_NATIONAL_ROLES = new Set(["Congresista", "Diputado de la República", "Diputada de la República", "Senador de la República", "Senadora de la República", "Ministro de Estado", "Premier", "Vicepresidente del Perú", "Presidente del Perú", "Presidente del Congreso"]);
const ACTIVE_PUBLIC_OFFICE_ROLES = new Set([...ACTIVE_LOCAL_ROLES, ...ACTIVE_NATIONAL_ROLES, "Embajador"]);
const ACTIVE_ROLE_TAGS = {
  "Alcalde": ["cargo-ejecutivo-local"],
  "Gobernador regional": ["poder-regional"],
  "Congresista": ["congresista"],
  "Diputado de la República": ["diputado", "congresista"],
  "Diputada de la República": ["diputado", "congresista"],
  "Senador de la República": ["senador", "congresista"],
  "Senadora de la República": ["senador", "congresista"],
  "Presidente del Perú": ["presidente-actual"],
};
const ACTIVE_OFFICE_TAGS = new Set(Object.values(ACTIVE_ROLE_TAGS).flat());
const CUSTODY_ROLE_TAGS = {
  "Interno penitenciario": "en-prision", "Exdirigente en prisión": "en-prision",
  "Político en el exilio": "en-exilio", "Político asilado": "en-exilio", "Asesor internacional": "en-exilio",
  "Político bajo arresto domiciliario": "arresto-domiciliario",
};
const CUSTODY_TAGS = new Set(["en-prision", "en-exilio", "arresto-domiciliario"]);
const LEGAL_CANDIDACY_BLOCK_TAGS = new Set(["condena-final", "proceso-judicial-abierto", "investigacion-formalizada", "orden-judicial-pendiente", "inhabilitado"]);
const DEFAULT_ROLE_DURATIONS = {
  "Alcalde": 4, "Gobernador regional": 4, "Congresista": 5,
  "Diputado de la República": 5, "Diputada de la República": 5,
  "Senador de la República": 5, "Senadora de la República": 5,
  "Vicepresidente del Perú": 5, "Ministro de Estado": 2, "Premier": 2, "Embajador": 3, "Presidente del Perú": 5,
  "Político bajo arresto domiciliario": 3,
};
const REQUIREMENT_SELECTORS = new Set([
  "all", "any", "not", "stat", "hidden", "national", "careerTrack", "age", "year", "electionDue",
  "eventCount", "state", "origin", "background", "role", "roleIncludes", "context", "personality", "hasTag",
  "hasAnyTag", "missingTag", "decision", "outcome", "scandal", "relation",
]);
const CAREER_TRACKS = new Set([
  "party", "politicalOrganization", "communityLeadership", "localGovernment", "publicAuthority",
  "nationalInstitution", "candidateReady", "formerPresident",
]);

function hashSeed(value) {
  let hash = 2166136261;
  for (const character of String(value)) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function seededRandom(seed) {
  let state = hashSeed(seed);
  return () => {
    state += 0x6d2b79f5;
    let result = state;
    result = Math.imul(result ^ (result >>> 15), result | 1);
    result ^= result + Math.imul(result ^ (result >>> 7), result | 61);
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
  };
}

export class GameEngine {
  constructor({ seed = "probabify" } = {}) {
    this.config = GAME_CONFIG;
    this.origins = ORIGINS;
    this.backgrounds = BACKGROUNDS;
    this.events = new Map(EVENTS.map((event) => [event.id, event]));
    this.endings = [...ENDINGS].sort((a, b) => b.priority - a.priority);
    this.seed = String(seed || "probabify");
    this.initializeRandom();
    this.state = null;
    this.validateData();
  }

  initializeRandom(skip = 0) {
    this.random = seededRandom(this.seed);
    this.randomCalls = 0;
    for (let index = 0; index < skip; index += 1) this.roll();
  }

  roll() {
    this.randomCalls += 1;
    return this.random();
  }

  validateData() {
    const ids = new Set();
    const destinations = [];
    const requirementEntries = [];
    const optionIds = new Set();
    const outcomeIds = new Set();
    const statUsage = {
      stat: Object.fromEntries(Object.keys(this.config.stats).map((key) => [key, { writes: 0, reads: 0 }])),
      hidden: Object.fromEntries(Object.keys(this.config.hiddenStats).map((key) => [key, { writes: 0, reads: 0 }])),
      national: Object.fromEntries(Object.keys(this.config.nationalStats).map((key) => [key, { writes: 0, reads: 0 }])),
    };
    const collect = (id, type) => {
      if (!id || ids.has(id)) throw new Error(`Identificador duplicado o inválido: ${type} «${id}».`);
      ids.add(id);
    };
    const collectRequirements = (requirements, label) => {
      if (requirements) requirementEntries.push([requirements, label]);
    };
    const validatePayload = (payload, label) => {
      const effectGroups = [
        ["effects", this.config.stats, "stat"], ["hiddenEffects", this.config.hiddenStats, "hidden"], ["nationalEffects", this.config.nationalStats, "national"],
      ];
      for (const [field, definitions, usageGroup] of effectGroups) {
        for (const key of Object.keys(payload[field] ?? {})) {
          if (!(key in definitions)) throw new Error(`${label} modifica una estadística inexistente: «${key}».`);
          statUsage[usageGroup][key].writes += 1;
        }
      }
      if (payload.roleDuration !== undefined && !(Number(payload.roleDuration) > 0)) throw new Error(`${label} tiene una duración de cargo inválida.`);
      if (payload.yearsAdvance !== undefined && !(Number(payload.yearsAdvance) > 0)) throw new Error(`${label} tiene un avance temporal inválido.`);
      for (const contextId of [...(payload.addContexts ?? []), ...(payload.removeContexts ?? [])]) {
        if (!this.config.contexts.some((context) => context.id === contextId)) throw new Error(`${label} modifica un contexto inexistente: «${contextId}».`);
      }
      collectRequirements(payload.requirements, `${label}.requirements`);
      for (const [index, modifier] of (payload.weightModifiers ?? []).entries()) {
        if (!modifier.when) throw new Error(`${label}.weightModifiers[${index}] no tiene condición.`);
        if (modifier.multiply !== undefined && !(Number(modifier.multiply) >= 0)) throw new Error(`${label}.weightModifiers[${index}] tiene un multiplicador inválido.`);
        if (modifier.add !== undefined && !Number.isFinite(Number(modifier.add))) throw new Error(`${label}.weightModifiers[${index}] tiene una suma inválida.`);
        collectRequirements(modifier.when, `${label}.weightModifiers[${index}].when`);
      }
    };

    this.origins.forEach((origin) => collect(origin.id, "origen"));
    this.backgrounds.forEach((background) => {
      if (!background.id || !this.origins.some((origin) => origin.id === background.originId)) throw new Error(`Antecedente inválido: «${background.id}».`);
      if (!this.events.has(background.initialEvent)) throw new Error(`El antecedente ${background.id} apunta a un evento inexistente.`);
      const initialEvent = this.events.get(background.initialEvent);
      if (![initialEvent.requirements?.background].flat().includes(background.id)) throw new Error(`El evento inicial ${background.initialEvent} no está limitado al antecedente ${background.id}.`);
      for (const [eventId, multiplier] of Object.entries(background.eventWeights ?? {})) {
        if (!this.events.has(eventId)) throw new Error(`El antecedente ${background.id} pondera el evento inexistente ${eventId}.`);
        if (!(Number(multiplier) > 0)) throw new Error(`El antecedente ${background.id} tiene una ponderación inválida para ${eventId}.`);
      }
      if (ids.has(background.id)) throw new Error(`Identificador duplicado de antecedente: «${background.id}».`);
      ids.add(background.id);
    });
    EVENTS.forEach((event) => {
      collect(event.id, "evento");
      if (!event.options?.length) throw new Error(`El evento ${event.id} no tiene opciones.`);
      if (event.weight !== undefined && !(Number(event.weight) >= 0)) throw new Error(`El evento ${event.id} tiene un peso inválido.`);
      validatePayload(event, `evento ${event.id}`);
      event.options.forEach((option) => {
        collect(option.id, "opción");
        optionIds.add(option.id);
        validatePayload(option, `opción ${option.id}`);
        if (option.nextEvent) destinations.push([option.id, option.nextEvent]);
        option.outcomes?.forEach((outcome) => {
          collect(outcome.id, "resultado");
          outcomeIds.add(outcome.id);
          if (outcome.weight !== undefined && !(Number(outcome.weight) >= 0)) throw new Error(`El resultado ${outcome.id} tiene un peso inválido.`);
          validatePayload(outcome, `resultado ${outcome.id}`);
          if (outcome.nextEvent) destinations.push([outcome.id, outcome.nextEvent]);
        });
      });
    });
    for (const eventId of Object.keys(EVENT_CAREER_GATES)) if (!this.events.has(eventId)) throw new Error(`Regla narrativa sin evento: «${eventId}».`);
    this.endings.forEach((ending) => {
      collect(ending.id, "final");
      if (!ending.title || !ending.label || !ending.description || !ending.requirements) throw new Error(`Final incompleto: «${ending.id}».`);
      collectRequirements(ending.requirements, `final ${ending.id}.requirements`);
    });
    this.origins.forEach((origin) => {
      if (!this.events.has(origin.initialEvent)) throw new Error(`El origen ${origin.id} apunta a un evento inexistente.`);
      if (backgroundsForOrigin(origin.id).length < 2) throw new Error(`El origen ${origin.id} necesita al menos dos antecedentes distintos.`);
      for (const eventId of origin.exclusiveEvents ?? []) {
        if (!this.events.has(eventId)) throw new Error(`El origen ${origin.id} declara el evento inexistente ${eventId}.`);
      }
    });
    destinations.forEach(([source, target]) => {
      if (!this.events.has(target)) throw new Error(`${source} apunta al evento inexistente ${target}.`);
    });
    const validateRequirements = (requirements, label) => {
      if (!requirements || typeof requirements !== "object" || Array.isArray(requirements)) throw new Error(`${label} no es una regla válida.`);
      const selectors = Object.keys(requirements).filter((key) => REQUIREMENT_SELECTORS.has(key));
      const unknown = Object.keys(requirements).filter((key) => !REQUIREMENT_SELECTORS.has(key) && !["min", "max"].includes(key));
      if (selectors.length !== 1 || unknown.length) throw new Error(`${label} tiene una condición desconocida o ambigua.`);
      const selector = selectors[0];
      if (["stat", "hidden", "national"].includes(selector) && statUsage[selector][requirements[selector]]) {
        statUsage[selector][requirements[selector]].reads += 1;
      }
      if (["all", "any"].includes(selector)) {
        if (!Array.isArray(requirements[selector]) || !requirements[selector].length) throw new Error(`${label}.${selector} debe contener reglas.`);
        requirements[selector].forEach((rule, index) => validateRequirements(rule, `${label}.${selector}[${index}]`));
      } else if (selector === "not") {
        validateRequirements(requirements.not, `${label}.not`);
      } else if (selector === "stat" && !(requirements.stat in this.config.stats)) {
        throw new Error(`${label} consulta una estadística inexistente: «${requirements.stat}».`);
      } else if (selector === "hidden" && !(requirements.hidden in this.config.hiddenStats)) {
        throw new Error(`${label} consulta una estadística oculta inexistente: «${requirements.hidden}».`);
      } else if (selector === "national" && !(requirements.national in this.config.nationalStats)) {
        throw new Error(`${label} consulta un indicador nacional inexistente: «${requirements.national}».`);
      } else if (selector === "careerTrack" && ![requirements.careerTrack].flat().every((track) => CAREER_TRACKS.has(track))) {
        throw new Error(`${label} consulta una trayectoria inexistente.`);
      } else if (selector === "origin" && ![requirements.origin].flat().every((id) => this.origins.some((origin) => origin.id === id))) {
        throw new Error(`${label} consulta un origen inexistente.`);
      } else if (selector === "background" && ![requirements.background].flat().every((id) => this.backgrounds.some((background) => background.id === id))) {
        throw new Error(`${label} consulta un antecedente inexistente.`);
      } else if (selector === "eventCount" && !this.events.has(requirements.eventCount?.id)) {
        throw new Error(`${label} consulta un evento inexistente.`);
      } else if (selector === "decision" && !optionIds.has(requirements.decision)) {
        throw new Error(`${label} consulta una decisión inexistente.`);
      } else if (selector === "outcome" && !outcomeIds.has(requirements.outcome)) {
        throw new Error(`${label} consulta un resultado inexistente.`);
      }
    };
    requirementEntries.forEach(([requirements, label]) => validateRequirements(requirements, label));
    const disconnectedStats = Object.entries(statUsage).flatMap(([group, entries]) => Object.entries(entries)
      .filter(([, usage]) => usage.writes === 0 || usage.reads === 0)
      .map(([key, usage]) => `${group}.${key} (cambios: ${usage.writes}, consecuencias: ${usage.reads})`));
    if (disconnectedStats.length) throw new Error(`Estadísticas desconectadas: ${disconnectedStats.join(", ")}`);
  }

  sampleValue(definition, fallback = 0) {
    if (Number.isFinite(definition)) return Number(definition);
    if (!definition || typeof definition !== "object") return fallback;
    const min = Number(definition.min ?? definition.typical ?? fallback);
    const max = Number(definition.max ?? definition.typical ?? fallback);
    const typical = Number(definition.typical ?? (min + max) / 2);
    const centered = (this.roll() + this.roll() + this.roll() + this.roll()) / 4;
    const value = centered < 0.5
      ? typical - (typical - min) * (1 - centered * 2)
      : typical + (max - typical) * ((centered - 0.5) * 2);
    return Math.round(value);
  }

  buildInitialHidden(origin) {
    const hidden = {};
    for (const key of Object.keys(this.config.hiddenStats)) hidden[key] = key === "vacancyRisk" ? 0 : 50;
    for (const [key, value] of Object.entries(origin.hidden ?? {})) hidden[key] = this.sampleValue(value, 50);
    return hidden;
  }

  buildNationalContext() {
    const national = {
      growth: this.sampleValue({ min: -1, typical: 2, max: 5 }),
      inflation: this.sampleValue({ min: 2, typical: 5, max: 11 }),
      unemployment: this.sampleValue({ min: 4, typical: 8, max: 14 }),
      poverty: this.sampleValue({ min: 18, typical: 28, max: 40 }),
      investment: this.sampleValue({ min: 35, typical: 52, max: 70 }),
      deficit: this.sampleValue({ min: 0, typical: 3, max: 7 }),
      debt: this.sampleValue({ min: 24, typical: 38, max: 58 }),
      security: this.sampleValue({ min: 28, typical: 48, max: 68 }),
      socialConflict: this.sampleValue({ min: 25, typical: 45, max: 72 }),
    };
    const available = this.config.contexts.filter((context) => !context.eventOnly);
    const contexts = [];
    while (contexts.length < 2 && available.length) {
      const index = Math.floor(this.roll() * available.length);
      const context = available.splice(index, 1)[0];
      contexts.push(context.id);
      for (const [key, effect] of Object.entries(context.effects ?? {})) national[key] += effect;
    }
    return { national, contexts };
  }

  getBackgrounds(originId) { return clone(backgroundsForOrigin(originId)); }

  start(originId, { characterName = "Alex", backgroundId = null, gameMode = "standard" } = {}) {
    const origin = this.origins.find((item) => item.id === originId);
    if (!origin) throw new Error("Origen no encontrado.");
    const availableBackgrounds = backgroundsForOrigin(origin.id);
    const background = backgroundId ? availableBackgrounds.find((item) => item.id === backgroundId) : availableBackgrounds[0];
    if (!background) throw new Error(`El origen ${origin.id} no tiene antecedentes configurados.`);
    const safeName = String(characterName ?? "").replace(/[<>]/g, "").replace(/\s+/g, " ").trim().slice(0, 32) || "Alex";
    this.initializeRandom();
    const stats = {};
    for (const key of Object.keys(this.config.stats)) stats[key] = this.sampleValue(origin.stats?.[key], 0);
    for (const [key, multiplier] of Object.entries(background.statMultipliers ?? {})) if (key in stats) stats[key] *= Number(multiplier) || 1;
    for (const [key, effect] of Object.entries(background.effects ?? {})) if (key in stats) stats[key] += Number(effect) || 0;
    const { national, contexts } = this.buildNationalContext();
    const age = this.sampleValue(origin.startAge, this.config.minAge);
    const hidden = this.buildInitialHidden(origin);
    for (const [key, effect] of Object.entries(background.hiddenEffects ?? {})) if (key in hidden) hidden[key] += Number(effect) || 0;
    const role = background.initialRole ?? origin.initialRole;

    this.state = {
      version: 7,
      seed: this.seed,
      originId: origin.id,
      originName: origin.name,
      characterName: safeName,
      backgroundId: background.id,
      backgroundName: background.name,
      backgroundHistory: background.history,
      backgroundImpact: background.impact,
      gameMode: gameMode === "express" ? "express" : "standard",
      age,
      year: this.config.startYear,
      nextElectionYear: this.config.startYear + this.config.electionCycleYears,
      presidentialRuns: 0,
      role,
      highestRole: role,
      currentOffice: { role, startYear: this.config.startYear, expectedEndYear: null },
      career: [{ role, startYear: this.config.startYear, endYear: null }],
      yearsInPublicOffice: 0,
      elections: { won: 0, lost: 0, history: [] },
      stats,
      hidden,
      national,
      contexts,
      relations: { ...clone(origin.relations ?? {}), ...clone(background.relations ?? {}) },
      memory: { allies: [], enemies: [], favors: [], promises: [], scandals: [], investigations: [], crises: [], wars: [] },
      personality: "outsider",
      tags: [...new Set([...(origin.tags ?? []), ...(background.tags ?? [])])],
      decisions: [],
      outcomes: [],
      eventCounts: {},
      lastEventYear: {},
      lastEventGroupYear: {},
      pendingEventId: null,
      eventAffinities: Object.fromEntries([...this.events.values()].map((event) => [event.id, event.forced ? 1 : Math.round((0.55 + this.roll() * 0.9) * Number(background.eventWeights?.[event.id] ?? 1) * 100) / 100])),
      statLedger: {},
      history: [],
      currentEventId: background.initialEvent ?? origin.initialEvent,
      endingId: null,
    };
    initializeCaseState(this.state);
    this.normalizeAll();
    this.initializeStatLedger(`Inicio: ${origin.name} · ${background.shortName}`);
    this.state.personality = this.derivePersonality();
    syncActiveCases(this.state, this.events.get(this.state.currentEventId));
    return this.getSnapshot();
  }

  migrateLoadedState() {
    const origin = this.origins.find((item) => item.id === this.state.originId);
    this.state.stats ??= {};
    this.state.hidden ??= {};
    this.state.national ??= {};
    for (const key of Object.keys(this.config.stats)) if (!Number.isFinite(Number(this.state.stats[key]))) this.state.stats[key] = 0;
    for (const key of Object.keys(this.config.hiddenStats)) {
      if (!Number.isFinite(Number(this.state.hidden[key]))) this.state.hidden[key] = key === "vacancyRisk" ? 0 : 50;
    }
    for (const key of Object.keys(this.config.nationalStats)) if (!Number.isFinite(Number(this.state.national[key]))) this.state.national[key] = 0;
    this.state.tags = [...new Set(Array.isArray(this.state.tags) ? this.state.tags : [])];
    const restoredLegalTag = {
      "fiscalia-cerca": "investigado",
      "investigacion-avanzada": "investigacion-formalizada",
      "orden-captura": "orden-judicial-pendiente",
      "revision-arresto-domiciliario": "proceso-judicial-abierto",
      "juicio-en-libertad": "proceso-judicial-abierto",
    }[this.state.currentEventId];
    if (restoredLegalTag && !this.state.tags.includes(restoredLegalTag)) this.state.tags.push(restoredLegalTag);
    if (this.state.tags.includes("en-prision") && !this.state.tags.includes("condena-final") && !this.state.tags.includes("proceso-judicial-abierto")) {
      this.state.tags.push("proceso-judicial-abierto");
    }
    this.state.contexts = Array.isArray(this.state.contexts) ? this.state.contexts : [];
    this.state.relations ??= {};
    this.state.memory ??= {};
    for (const key of ["allies", "enemies", "favors", "promises", "scandals", "investigations", "crises", "wars"]) {
      if (!Array.isArray(this.state.memory[key])) this.state.memory[key] = [];
    }
    this.state.decisions = Array.isArray(this.state.decisions) ? this.state.decisions : [];
    this.state.outcomes = Array.isArray(this.state.outcomes) ? this.state.outcomes : [];
    this.state.gameMode = this.state.gameMode === "express" ? "express" : "standard";
    this.state.history = Array.isArray(this.state.history) ? this.state.history : [];
    this.state.role = LEGACY_ROLE_NAMES[this.state.role] ?? this.state.role;
    this.state.highestRole = LEGACY_ROLE_NAMES[this.state.highestRole] ?? this.state.highestRole;
    if (this.state.currentOffice?.role) this.state.currentOffice.role = LEGACY_ROLE_NAMES[this.state.currentOffice.role] ?? this.state.currentOffice.role;
    if (Array.isArray(this.state.career)) for (const entry of this.state.career) entry.role = LEGACY_ROLE_NAMES[entry.role] ?? entry.role;
    for (const entry of this.state.history) entry.role = LEGACY_ROLE_NAMES[entry.role] ?? entry.role;
    this.state.eventCounts ??= {};
    this.state.lastEventYear ??= {};
    this.state.lastEventGroupYear ??= {};
    this.state.eventAffinities ??= {};
    this.state.pendingEventId ??= null;
    migrateCaseState(this.state);
    this.state.presidentialRuns = Math.max(0, Number(this.state.presidentialRuns) || 0);
    this.state.elections ??= { won: 0, lost: 0, history: [] };
    this.state.elections.won = Math.max(0, Number(this.state.elections.won) || 0);
    this.state.elections.lost = Math.max(0, Number(this.state.elections.lost) || 0);
    this.state.elections.history = Array.isArray(this.state.elections.history) ? this.state.elections.history : [];
    this.state.yearsInPublicOffice = Math.max(0, Number(this.state.yearsInPublicOffice) || 0);
    this.state.nextElectionYear = Number(this.state.nextElectionYear) || this.config.startYear + this.config.electionCycleYears;
    while (this.state.nextElectionYear < this.state.year) this.state.nextElectionYear += this.config.electionCycleYears;
    this.state.role ||= origin?.initialRole ?? "Ciudadano";
    this.state.highestRole ||= this.state.role;
    this.state.career = Array.isArray(this.state.career) ? this.state.career : [];
    if (this.state.endingId) {
      for (const entry of this.state.career) if (entry.endYear === null) entry.endYear = this.state.year;
      this.state.currentOffice = null;
    } else {
      for (const entry of this.state.career) if (entry.endYear === null && entry.role !== this.state.role) entry.endYear = this.state.year;
      let current = this.state.career.findLast?.((entry) => entry.endYear === null && entry.role === this.state.role)
        ?? [...this.state.career].reverse().find((entry) => entry.endYear === null && entry.role === this.state.role);
      if (!current) {
        current = { role: this.state.role, startYear: this.state.year, endYear: null };
        this.state.career.push(current);
      }
      const savedOffice = this.state.currentOffice?.role === this.state.role ? this.state.currentOffice : null;
      const startYear = Number(savedOffice?.startYear ?? current.startYear ?? this.state.year);
      const duration = DEFAULT_ROLE_DURATIONS[this.state.role];
      this.state.currentOffice = {
        role: this.state.role,
        startYear,
        expectedEndYear: savedOffice?.expectedEndYear ?? (duration ? startYear + duration : null),
      };
    }
    this.reconcileActiveOfficeTags();
    if (!this.state.endingId && this.state.tags.includes("en-prision") && CUSTODY_ROLE_TAGS[this.state.role] !== "en-prision") {
      this.setRole("Interno penitenciario");
    } else if (!this.state.endingId && this.state.tags.includes("en-exilio") && ACTIVE_PUBLIC_OFFICE_ROLES.has(this.state.role)) {
      this.setRole("Político en el exilio");
    } else if (!this.state.endingId && this.state.tags.includes("arresto-domiciliario") && this.state.role !== "Político bajo arresto domiciliario") {
      this.setRole("Político bajo arresto domiciliario");
    }
  }

  load(savedState) {
    if (!savedState?.originId || !savedState.currentEventId && !savedState.endingId) throw new Error("Partida guardada inválida.");
    const caseStateMissing = !Array.isArray(savedState.activeCases);
    this.seed = String(savedState.seed ?? this.seed);
    const calls = Number(savedState.randomCalls ?? 0);
    this.initializeRandom(calls);
    this.state = clone(savedState);
    this.state.caseMigrationPending = caseStateMissing;
    delete this.state.randomCalls;
    delete this.state.event;
    delete this.state.ending;
    this.state.version = 7;
    this.state.characterName ??= "Tu personaje";
    this.state.backgroundId ??= null;
    this.state.backgroundName ??= "Trayectoria original";
    this.state.backgroundHistory ??= "Partida creada antes del sistema de antecedentes.";
    this.state.backgroundImpact ??= "Conserva los efectos y decisiones de la partida guardada.";
    this.migrateLoadedState();
    if (this.state.pendingEventId && !this.events.has(this.state.pendingEventId)) this.state.pendingEventId = null;
    this.normalizeAll();
    if (!this.state.endingId) this.expireCurrentOffice();
    if (!this.state.tags.includes("presidente-actual")) this.state.hidden.vacancyRisk = 0;
    if (!this.state.statLedger) this.initializeStatLedger("Estado al recuperar la partida");
    const current = this.events.get(this.state.currentEventId);
    if (!current && !this.state.endingId) {
      this.state.currentEventId = this.findNextEventId();
    } else if (current && !current.initialOnly && !current.directedOnly && (!this.meetsCareerGate(current) || !this.meetsRequirements(current.requirements) || !this.isWithinOccurrenceLimits(current))) {
      this.state.currentEventId = this.findNextEventId();
    }
    syncActiveCases(this.state, this.events.get(this.state.currentEventId));
    delete this.state.caseMigrationPending;
    return this.getSnapshot();
  }

  reset() { this.state = null; }

  getSnapshot() {
    if (!this.state) return null;
    const event = this.state.currentEventId ? this.events.get(this.state.currentEventId) : null;
    const ending = this.state.endingId ? this.endings.find((item) => item.id === this.state.endingId) : null;
    return { ...clone(this.state), randomCalls: this.randomCalls, event: event ? clone(event) : null, ending: ending ? clone(ending) : null };
  }

  getAvailableOptions() {
    if (!this.state?.currentEventId || this.state.endingId) return [];
    const event = this.events.get(this.state.currentEventId);
    return event.options
      .map((option) => ({ ...clone(option), available: this.isOptionAvailable(option) }))
      .filter((option) => option.available || !option.hideWhenUnavailable);
  }

  getCaseActionPool(activeCase) {
    return [...(SPECIAL_CASE_ACTIONS[activeCase.kind] ?? [])]
      .sort((left, right) => stableHash(`${this.state.seed}|${activeCase.id}|${left.id}`) - stableHash(`${this.state.seed}|${activeCase.id}|${right.id}`)
        || left.id.localeCompare(right.id))
      .slice(0, 2);
  }

  getAvailableCaseActions(caseId) {
    if (!this.state || this.state.endingId) return [];
    const activeCase = this.state.activeCases?.find((entry) => entry.id === caseId && entry.status !== "Resuelto");
    if (!activeCase) return [];
    const alreadyActed = activeCase.lastActionDecisionCount === this.state.decisions.length;
    const reachedLimit = Number(activeCase.actionHistory?.length ?? 0) >= 2;
    return this.getCaseActionPool(activeCase).map((action) => {
      const alreadyUsed = activeCase.actionHistory?.some((entry) => entry.actionId === action.id);
      const cleanCost = Math.max(0, -Number(action.effects?.cleanMoney ?? 0));
      const dirtyCost = Math.max(0, -Number(action.effects?.dirtyMoney ?? 0));
      const meetsRequirements = this.meetsRequirements(action.requirements);
      let unavailableReason = "";
      if (alreadyUsed) unavailableReason = "Esta medida ya fue tomada";
      else if (reachedLimit) unavailableReason = "Ya tomaste dos medidas";
      else if (alreadyActed) unavailableReason = "Ya actuaste · continúa la historia";
      else if (cleanCost > this.state.stats.cleanMoney) unavailableReason = `Necesitas S/${cleanCost.toLocaleString("es-PE")}`;
      else if (dirtyCost > this.state.stats.dirtyMoney) unavailableReason = `Necesitas S/${dirtyCost.toLocaleString("es-PE")} de dinero sucio`;
      else if (!meetsRequirements) unavailableReason = "No disponible ahora";
      return { ...clone(action), available: !reachedLimit && !alreadyUsed && !alreadyActed && meetsRequirements && cleanCost <= this.state.stats.cleanMoney && dirtyCost <= this.state.stats.dirtyMoney, unavailableReason };
    });
  }

  chooseCaseAction(caseId, actionId) {
    if (!this.state || this.state.endingId) throw new Error("No hay una partida activa.");
    const activeCase = this.state.activeCases?.find((entry) => entry.id === caseId && entry.status !== "Resuelto");
    if (!activeCase) throw new Error("El expediente ya no está activo.");
    const action = (SPECIAL_CASE_ACTIONS[activeCase.kind] ?? []).find((entry) => entry.id === actionId);
    const available = this.getAvailableCaseActions(caseId).find((entry) => entry.id === actionId);
    if (!action || !available?.available) throw new Error(available?.unavailableReason || "Esta acción no está disponible.");

    const before = this.getSnapshot();
    this.applyPayload(action);
    this.normalizeAll();
    const afterActionStats = clone(this.state.stats);
    const outcome = this.pickOutcome(action.outcomes);
    this.applyPayload(outcome);
    this.normalizeAll();
    recordCaseAction(this.state, { caseId, action, outcome });
    this.normalizeAll();
    this.recordStatChanges(before, afterActionStats, { title: activeCase.title }, action, outcome);
    this.state.personality = this.derivePersonality();
    const snapshot = this.getSnapshot();
    return { snapshot, outcome: clone(outcome), changes: this.buildChanges(before, snapshot), headline: outcome.headline };
  }

  choose(optionId) {
    if (!this.state || this.state.endingId) throw new Error("No hay una partida activa.");
    const event = this.events.get(this.state.currentEventId);
    if (!event) throw new Error("El evento actual ya no existe.");
    const option = event.options.find((item) => item.id === optionId);
    if (!option) throw new Error("Opción no encontrada.");
    if (!this.isOptionAvailable(option)) throw new Error("Esta opción no está disponible.");
    syncActiveCases(this.state, event);
    const before = this.getSnapshot();

    this.applyPayload(option);
    // Las probabilidades y el desglose deben usar el valor real tras aplicar los límites.
    this.normalizeAll();
    applyCasePayload(this.state, event, option);
    const afterOptionStats = clone(this.state.stats);
    const outcome = this.pickOutcome(option.outcomes ?? [{ id: `${option.id}-default`, weight: 100 }]);
    this.applyPayload(outcome);
    applyCasePayload(this.state, event, outcome);

    this.state.decisions.push(option.id);
    this.state.outcomes.push(outcome.id);
    this.state.eventCounts[event.id] = (this.state.eventCounts[event.id] ?? 0) + 1;
    this.state.lastEventYear[event.id] = this.state.year;
    if (event.group) this.state.lastEventGroupYear[event.group] = this.state.year;
    this.recordElection(event, option, outcome);

    const category = outcome.category ?? event.category ?? "decision";
    this.state.history.unshift({
      age: this.state.age, year: this.state.year, role: this.state.role, category,
      eventId: event.id, eventTitle: event.title, optionId: option.id, optionLabel: option.label,
      outcomeId: outcome.id, headline: outcome.headline ?? option.headline ?? event.headline ?? event.title,
      text: outcome.text ?? "Tomaste una decisión que cambió tu trayectoria.",
      highlight: Boolean(outcome.highlight ?? event.highlight),
    });

    // El antecedente explica el pasado del personaje: elegirlo no consume un año de carrera.
    const sameYear = event.category === "background" || Boolean(outcome.sameYear ?? option.sameYear);
    if (!sameYear) {
      const years = this.getDecisionYearAdvance(event, option, outcome);
      for (let year = 0; year < years; year += 1) this.advanceYear();
    }
    this.normalizeAll();
    recordCaseDecision(this.state, { before, event, option, outcome, decisionYear: before.year });
    this.normalizeAll();
    this.recordStatChanges(before, afterOptionStats, event, option, outcome);
    this.state.personality = this.derivePersonality();

    let ending = this.findEnding();
    if (ending) {
      finalizeActiveCases(this.state);
      this.normalizeAll();
      this.state.personality = this.derivePersonality();
      ending = this.findEnding() ?? ending;
      this.closeCurrentOffice();
      this.state.endingId = ending.id;
      this.state.currentEventId = null;
    } else {
      const originEntryEvent = event.category === "background" ? this.origins.find((origin) => origin.id === this.state.originId)?.initialEvent : null;
      const proposedNextEventId = outcome.nextEvent ?? option.nextEvent ?? originEntryEvent ?? null;
      const proposedNextEvent = proposedNextEventId ? this.events.get(proposedNextEventId) : null;
      const directedNextEventId = proposedNextEvent && this.canEnterEvent(proposedNextEvent, { allowInitial: event.category === "background" })
        ? proposedNextEventId
        : null;
      let nextEventId;
      // Una persona impedida no puede postular, pero un presidente en funciones
      // siempre debe llegar a la elección para entregar el mando a su sucesor.
      const electionBlocked = !this.state.tags.includes("presidente-actual")
        && [...CUSTODY_TAGS, ...LEGAL_CANDIDACY_BLOCK_TAGS].some((tag) => this.state.tags.includes(tag));
      if (event.id !== "eleccion-nacional" && !this.state.tags.includes("en-campana-presidencial") && electionBlocked && this.state.year >= this.state.nextElectionYear) {
        this.advanceElectionCalendar();
      }
      if (event.id !== "eleccion-nacional" && !this.state.tags.includes("en-campana-presidencial") && !electionBlocked && this.state.year >= this.state.nextElectionYear) {
        if (directedNextEventId) this.state.pendingEventId = directedNextEventId;
        nextEventId = "eleccion-nacional";
      } else if (directedNextEventId) {
        nextEventId = directedNextEventId;
      } else if (this.state.pendingEventId) {
        const pending = this.events.get(this.state.pendingEventId);
        nextEventId = pending && this.canEnterEvent(pending) ? this.state.pendingEventId : this.findNextEventId();
        this.state.pendingEventId = null;
      } else {
        nextEventId = this.findNextEventId();
      }
      this.state.currentEventId = nextEventId && this.events.has(nextEventId) ? nextEventId : null;
      syncActiveCases(this.state, this.events.get(this.state.currentEventId));
    }

    const snapshot = this.getSnapshot();
    return { snapshot, outcome: clone(outcome), changes: this.buildChanges(before, snapshot), headline: outcome.headline ?? event.title };
  }

  applyPayload(payload = {}) {
    this.applyEffects(this.state.stats, payload.effects, true);
    this.applyEffects(this.state.hidden, payload.hiddenEffects);
    this.applyEffects(this.state.national, payload.nationalEffects);
    if (payload.setRole) this.setRole(payload.setRole, payload.roleDuration);
    for (const tag of payload.addTags ?? []) if (!this.state.tags.includes(tag)) this.state.tags.push(tag);
    if (payload.removeTags?.length) this.state.tags = this.state.tags.filter((tag) => !payload.removeTags.includes(tag));
    if (payload.removeContexts?.length) this.state.contexts = this.state.contexts.filter((context) => !payload.removeContexts.includes(context));
    for (const context of payload.addContexts ?? []) this.state.contexts = [context, ...this.state.contexts.filter((item) => item !== context)].slice(0, 3);
    for (const [name, effect] of Object.entries(payload.relationEffects ?? {})) {
      const relation = this.state.relations[name] ?? { role: "Actor político", score: 50, loyalty: 50, knows: [] };
      relation.score = clamp(relation.score + Number(effect), -100, 100);
      relation.loyalty = clamp(relation.loyalty + Number(effect) * 0.5, 0, 100);
      this.state.relations[name] = relation;
    }
    this.addMemory("allies", payload.addAllies);
    this.addMemory("enemies", payload.addEnemies);
    this.addMemory("favors", payload.addFavors);
    this.addMemory("promises", payload.addPromises);
    this.addMemory("scandals", payload.addScandals);
    this.addMemory("investigations", payload.addInvestigations);
    this.addMemory("crises", payload.addCrises);
    this.addMemory("wars", payload.addWars);
  }

  applyEffects(target, effects = {}, boundedMain = false) {
    for (const [key, rawEffect] of Object.entries(effects)) {
      if (!(key in target)) continue;
      let effect = Number(rawEffect) || 0;
      const variation = Math.abs(effect) * (this.roll() - 0.5) * 0.24;
      effect += variation;
      if (boundedMain && effect > 0 && ["approval", "influence"].includes(key)) {
        effect *= Math.max(0.25, 1 - target[key] / 120);
      }
      if (boundedMain && key === "approval" && effect < 0) {
        effect *= 1 + (this.state.hidden?.mediaNotoriety ?? 0) / 250;
      }
      target[key] += Math.round(effect);
    }
  }

  addMemory(key, values = []) {
    for (const value of values) {
      const entry = typeof value === "string" ? { id: value, label: value, year: this.state.year } : { year: this.state.year, ...value };
      if (!this.state.memory[key].some((item) => item.id === entry.id)) this.state.memory[key].push(entry);
    }
  }

  setRole(role, duration = null) {
    if (!role) return;
    if (role === this.state.role) {
      if (duration) {
        this.closeCurrentOffice();
        this.state.currentOffice = { role, startYear: this.state.year, expectedEndYear: this.state.year + duration };
        this.state.career.push({ role, startYear: this.state.year, endYear: null });
      }
      this.reconcileActiveOfficeTags();
      return;
    }
    const previousTransition = TERM_END_ROLES[this.state.role];
    for (const tag of previousTransition?.removeTags ?? []) this.state.tags = this.state.tags.filter((item) => item !== tag);
    if (previousTransition?.addTag && !this.state.tags.includes(previousTransition.addTag)) this.state.tags.push(previousTransition.addTag);
    if (this.state.role === "Presidente del Perú" && role !== "Presidente del Perú") {
      this.state.tags = this.state.tags.filter((tag) => tag !== "presidente-actual");
      if (!this.state.tags.includes("fue-presidente")) this.state.tags.push("fue-presidente");
    }
    this.closeCurrentOffice();
    this.state.role = role;
    const resolvedDuration = duration ?? DEFAULT_ROLE_DURATIONS[role] ?? null;
    this.state.currentOffice = { role, startYear: this.state.year, expectedEndYear: resolvedDuration ? this.state.year + resolvedDuration : null };
    this.state.career.push({ role, startYear: this.state.year, endYear: null });
    this.reconcileActiveOfficeTags();
    const canonicalRole = ROLE_CANONICAL[role] ?? role;
    const canonicalHighestRole = ROLE_CANONICAL[this.state.highestRole] ?? this.state.highestRole;
    if ((ROLE_RANK[canonicalRole] ?? 0) > (ROLE_RANK[canonicalHighestRole] ?? 0)) this.state.highestRole = canonicalRole;
  }

  reconcileActiveOfficeTags() {
    const required = new Set(ACTIVE_ROLE_TAGS[this.state.role] ?? []);
    this.state.tags = this.state.tags.filter((tag) => !ACTIVE_OFFICE_TAGS.has(tag) || required.has(tag));
    for (const tag of required) if (!this.state.tags.includes(tag)) this.state.tags.push(tag);
    if (!required.has("presidente-actual") && this.state.hidden) this.state.hidden.vacancyRisk = 0;
    const custodyTag = CUSTODY_ROLE_TAGS[this.state.role];
    if (custodyTag) {
      this.state.tags = this.state.tags.filter((tag) => !CUSTODY_TAGS.has(tag) || tag === custodyTag);
      if (!this.state.tags.includes(custodyTag)) this.state.tags.push(custodyTag);
    }
  }

  closeCurrentOffice() {
    const current = this.state.career.at(-1);
    if (current && current.endYear === null) current.endYear = this.state.year;
    this.state.currentOffice = null;
  }

  recordElection(event, option, outcome) {
    if (event.category === "presidential-election") {
      if (option.id === "campana-presidencial") this.state.presidentialRuns += 1;
      else if (option.id !== "negociar-formula-vicepresidencial") this.advanceElectionCalendar();
    }
    if (event.id === "oferta-vicepresidencia") this.advanceElectionCalendar();
    if (outcome.electionWon === undefined) return;
    this.advanceElectionCalendar();
    const won = Boolean(outcome.electionWon);
    this.state.elections[won ? "won" : "lost"] += 1;
    this.state.elections.history.push({ year: this.state.year, office: "Presidencia", result: won ? "victoria" : "derrota", outcomeId: outcome.id });
  }

  advanceElectionCalendar() {
    do { this.state.nextElectionYear += this.config.electionCycleYears; }
    while (this.state.nextElectionYear <= this.state.year);
  }

  getDecisionYearAdvance(event, option, outcome) {
    const maxByAge = Math.max(1, this.config.maxAge - this.state.age);
    const electionBlocked = !this.state.tags.includes("presidente-actual")
      && [...CUSTODY_TAGS, ...LEGAL_CANDIDACY_BLOCK_TAGS].some((tag) => this.state.tags.includes(tag));
    const untilElection = this.state.nextElectionYear - this.state.year;
    const electionLimit = event.id !== "eleccion-nacional" && !this.state.tags.includes("en-campana-presidencial") && !electionBlocked
      ? (untilElection > 0 ? untilElection : 1)
      : Infinity;
    const explicitAdvance = Number(outcome.yearsAdvance ?? option.yearsAdvance ?? event.yearsAdvance);
    if (Number.isFinite(explicitAdvance) && explicitAdvance > 0) {
      return Math.max(1, Math.min(Math.floor(explicitAdvance), maxByAge, electionLimit));
    }
    if (event.category === "presidential-election") return 1;
    const directedPace = this.state.gameMode === "express" ? 3 : 2;
    if (event.directedOnly || option.nextEvent || outcome.nextEvent) return Math.max(1, Math.min(directedPace, maxByAge, electionLimit));
    const pace = this.state.gameMode === "express" ? 5 : 3;
    return Math.max(1, Math.min(pace, maxByAge, electionLimit));
  }

  advanceYear() {
    this.state.age += 1;
    this.state.year += 1;
    if (ACTIVE_PUBLIC_OFFICE_ROLES.has(this.state.role)) this.state.yearsInPublicOffice += 1;
    this.expireCurrentOffice();
    this.evolveNationalContext();
    this.updatePoliticalRisk();
  }

  expireCurrentOffice() {
    const expectedEndYear = this.state.currentOffice?.expectedEndYear;
    const transition = TERM_END_ROLES[this.state.role];
    if (!transition || !expectedEndYear || this.state.year < expectedEndYear) return;
    this.setRole(transition.role);
  }

  evolveNationalContext() {
    const drift = { growth: 1.2, inflation: 1.3, unemployment: 1, poverty: 0.8, investment: 3, deficit: 0.8, debt: 1.2, security: 4, socialConflict: 4 };
    for (const [key, amount] of Object.entries(drift)) this.state.national[key] += Math.round((this.roll() - 0.5) * amount * 2);
    if (this.roll() < 0.22) {
      const availableContexts = this.config.contexts.filter((context) => !context.eventOnly);
      const context = availableContexts[Math.floor(this.roll() * availableContexts.length)];
      this.state.contexts = [context.id, ...this.state.contexts.filter((id) => id !== context.id)].slice(0, 3);
      for (const [key, effect] of Object.entries(context.effects ?? {})) this.state.national[key] += Math.round(effect * 0.35);
    }
  }

  updatePoliticalRisk() {
    const h = this.state.hidden;
    const n = this.state.national;
    if (this.state.tags.includes("presidente-actual")) {
      h.governmentStability += Math.round((h.congressSupport - 50) * 0.08 + (this.state.stats.approval - 50) * 0.06 - n.socialConflict * 0.025);
      h.vacancyRisk = Math.round(clamp((100 - h.congressSupport) * 0.28 + (100 - h.governmentStability) * 0.25 + this.state.stats.legalRisk * 0.22 + n.socialConflict * 0.15 + (100 - h.cabinetLoyalty) * 0.1, 0, 100));
    } else {
      h.vacancyRisk = 0;
    }
  }

  initializeStatLedger(reason) {
    this.state.statLedger = Object.fromEntries(Object.keys(this.config.stats).map((key) => [key, [{
      year: this.state.year,
      age: this.state.age,
      value: this.state.stats[key],
      delta: null,
      reason,
    }]]));
  }

  recordStatChanges(before, afterOptionStats, event, option, outcome) {
    this.state.statLedger ??= {};
    for (const key of Object.keys(this.config.stats)) {
      this.state.statLedger[key] ??= [];
      const finalDelta = this.state.stats[key] - before.stats[key];
      const optionDelta = Math.round(afterOptionStats[key] - before.stats[key]);
      const outcomeDelta = finalDelta - optionDelta;
      let runningValue = before.stats[key];
      const append = (delta, reason) => {
        if (!delta) return;
        runningValue += delta;
        this.state.statLedger[key].push({ year: before.year, age: before.age, value: runningValue, delta, reason });
      };
      append(optionDelta, `Decisión: ${option.label}`);
      append(outcomeDelta, outcome.headline ?? event.headline ?? event.title);
    }
  }

  normalizeAll() {
    for (const [key, meta] of Object.entries(this.config.stats)) {
      this.state.stats[key] = Math.round(clamp(Number(this.state.stats[key]) || 0, meta.min, meta.max));
    }
    for (const [key, meta] of Object.entries(this.config.hiddenStats)) {
      this.state.hidden[key] = Math.round(clamp(Number(this.state.hidden[key]) || 0, meta.min, meta.max));
    }
    for (const [key, meta] of Object.entries(this.config.nationalStats)) {
      this.state.national[key] = Math.round(clamp(Number(this.state.national[key]) || 0, meta.min, meta.max) * 10) / 10;
    }
  }

  derivePersonality() {
    const { stats, hidden, tags } = this.state;
    if (tags.includes("presidente-actual") && hidden.internationalReputation >= 70) return "líder internacional";
    if (tags.includes("figura-mediatica") && hidden.mediaNotoriety >= 62) return "figura mediática";
    if (tags.includes("operador") || (stats.influence >= 70 && stats.legalRisk >= 45)) return "operador";
    if (tags.includes("empresario") && hidden.businessSupport >= 65) return "empresario político";
    if (tags.includes("poder-regional") && hidden.ruralApproval >= 60) return "caudillo regional";
    if (Math.abs(stats.ideology) >= 68) return "ideólogo";
    if (hidden.polarization >= 70 && stats.approval >= 55) return "populista";
    if (hidden.credibility >= 70 && tags.includes("gestion-limpia")) return "reformista";
    if (stats.legalRisk >= 70 && stats.influence >= 45) return "superviviente político";
    if (hidden.credibility >= 62) return "tecnócrata";
    return tags.includes("outsider") ? "outsider" : "gobernante pragmático";
  }

  buildChanges(before, after) {
    const stats = Object.entries(after.stats).map(([key, value]) => ({ key, value, delta: value - before.stats[key] })).filter((item) => item.delta !== 0);
    const hidden = Object.entries(after.hidden).map(([key, value]) => ({ key, value, delta: value - before.hidden[key] })).filter((item) => Math.abs(item.delta) >= 4);
    const national = Object.entries(after.national).map(([key, value]) => ({ key, value, delta: Math.round((value - before.national[key]) * 10) / 10 })).filter((item) => Math.abs(item.delta) >= 1);
    return {
      stats, hidden, national,
      role: before.role !== after.role ? { from: before.role, to: after.role } : null,
      newScandals: after.memory.scandals.filter((item) => !before.memory.scandals.some((old) => old.id === item.id)),
      newTags: after.tags.filter((tag) => !before.tags.includes(tag)),
      cases: buildCaseChanges(before, after),
    };
  }

  pickOutcome(outcomes) {
    const eligible = outcomes.filter((outcome) => this.meetsRequirements(outcome.requirements));
    if (!eligible.length) throw new Error("La opción elegida no tiene resultados válidos.");
    return this.pickWeightedItem(eligible, (outcome) => this.getOutcomeWeight(outcome));
  }

  getOutcomeWeight(outcome) {
    let weight = Math.max(0, Number(outcome.weight ?? 1));
    for (const modifier of outcome.weightModifiers ?? []) {
      if (this.meetsRequirements(modifier.when)) weight = (weight + Number(modifier.add ?? 0)) * Number(modifier.multiply ?? 1);
    }
    return Math.max(0, weight * getCaseOutcomeMultiplier(this.state, outcome));
  }

  getEventWeight(event) {
    let weight = Number(event.weight ?? 10);
    for (const modifier of event.weightModifiers ?? []) {
      if (this.meetsRequirements(modifier.when)) weight = (weight + Number(modifier.add ?? 0)) * Number(modifier.multiply ?? 1);
    }
    const count = this.state?.eventCounts?.[event.id] ?? 0;
    const affinity = this.state?.eventAffinities?.[event.id] ?? 1;
    const novelty = count === 0 ? 1.45 : 1 / (1 + count * 0.7);
    return Math.max(0, weight * affinity * novelty);
  }

  hasCareerTrack(track) {
    const role = this.state.role.toLowerCase();
    const tags = this.state.tags;
    const hasAnyTag = (values) => values.some((tag) => tags.includes(tag));
    if (tags.includes("en-prision") || tags.includes("en-exilio") || tags.includes("arresto-domiciliario")) return false;
    if (track === "candidateReady" && [...LEGAL_CANDIDACY_BLOCK_TAGS].some((tag) => tags.includes(tag))) return false;
    if (tags.includes("retiro-definitivo")) return track === "formerPresident" && tags.includes("fue-presidente");
    const localGovernment = ACTIVE_LOCAL_ROLES.has(this.state.role);
    const nationalInstitution = ACTIVE_NATIONAL_ROLES.has(this.state.role);
    const communityLeadership = this.state.originId === "provincia" || /dirigente vecinal|dirigente de rondas|referente provincial|vocero de un frente|líder regional|líder vecinal/.test(role) || hasAnyTag(["base-territorial", "poder-regional", "cargo-ejecutivo-local", "ruta-democratica", "reconciliacion"]);
    const party = this.state.originId === "dinastia" || /congresista|diputad|senador|senadora|secretario partidario|dirigente partidari|candidat|presidente del partido|presidente del congreso|presidente del perú|vicepresidente|líder opositor/.test(role) || hasAnyTag(["partido-formal", "familia-politica", "candidata-congreso", "congresista", "diputado", "senador", "candidato-interno", "controla-partido", "excandidato", "excandidata", "excandidato-presidencial", "oposicion-nacional", "movimiento-digital"]);
    const politicalOrganization = party || communityLeadership || /asesor|vocero político|operador|dirigente político/.test(role) || hasAnyTag(["asesor", "vocero", "operador", "financista-legal"]);
    if (track === "party") return party;
    if (track === "politicalOrganization") return politicalOrganization;
    if (track === "communityLeadership") return communityLeadership;
    if (track === "localGovernment") return localGovernment;
    if (track === "publicAuthority") return localGovernment || nationalInstitution;
    if (track === "nationalInstitution") return nationalInstitution;
    if (track === "candidateReady") return party || communityLeadership || /vocero político|dirigente político/.test(role) || hasAnyTag(["vocero", "experiencia-electoral"]);
    if (track === "formerPresident") return tags.includes("fue-presidente") && !tags.includes("presidente-actual");
    return false;
  }

  meetsCareerGate(event) {
    if (this.state?.tags.includes("presidente-actual") && !PRESIDENT_EXIT_EVENTS.has(event.id)) {
      const replacesPresident = event.options.some((option) => option.setRole && option.setRole !== "Presidente del Perú"
        || (option.outcomes ?? []).some((outcome) => outcome.setRole && outcome.setRole !== "Presidente del Perú"));
      if (replacesPresident) return false;
    }
    const gate = EVENT_CAREER_GATES[event.id];
    return !gate || this.hasCareerTrack(gate);
  }

  isOptionAvailable(option) {
    if (!this.meetsRequirements(option.requirements)) return false;
    if (option.outcomes?.length && !option.outcomes.some((outcome) => this.meetsRequirements(outcome.requirements))) return false;
    const dirtyCost = Math.max(0, -Number(option.effects?.dirtyMoney ?? 0));
    return option.allowDirtyShortfall || dirtyCost === 0 || this.state.stats.dirtyMoney >= dirtyCost;
  }

  isWithinOccurrenceLimits(event) {
    const count = this.state.eventCounts[event.id] ?? 0;
    if (count > 0 && !event.repeatable && !event.allowDirectedRepeat) return false;
    if (event.maxOccurrences && count >= event.maxOccurrences) return false;
    if (this.state.year - (this.state.lastEventYear[event.id] ?? -Infinity) < (event.cooldown ?? 0)) return false;
    if (event.group && this.state.year - (this.state.lastEventGroupYear[event.group] ?? -Infinity) < (event.groupCooldown ?? 0)) return false;
    return true;
  }

  canEnterEvent(event, { allowInitial = false } = {}) {
    if (!event || event.initialOnly && !allowInitial) return false;
    return this.meetsCareerGate(event)
      && this.meetsRequirements(event.requirements)
      && this.isWithinOccurrenceLimits(event)
      && event.options.some((option) => this.isOptionAvailable(option));
  }

  findNextEventId() {
    let candidates = [...this.events.values()].filter((event) => {
      if (event.fallbackOnly) return false;
      if (event.id === this.state.currentEventId && this.config.random.avoidImmediateRepeats) return false;
      if (event.initialOnly || event.directedOnly || !this.meetsCareerGate(event) || !this.meetsRequirements(event.requirements)) return false;
      if (!event.options.some((option) => this.isOptionAvailable(option))) return false;
      return this.isWithinOccurrenceLimits(event);
    });
    if (!candidates.length) {
      const fallbackCandidates = [...this.events.values()].filter((event) => event.fallbackOnly
        && this.meetsCareerGate(event)
        && this.meetsRequirements(event.requirements)
        && this.isWithinOccurrenceLimits(event)
        && event.options.some((option) => this.isOptionAvailable(option)));
      const alternatives = fallbackCandidates.filter((event) => event.id !== this.state.currentEventId);
      candidates = alternatives.length ? alternatives : fallbackCandidates;
    }
    if (!candidates.length) return null;
    const forced = candidates.filter((event) => event.forced);
    let pool = candidates;
    if (forced.length) {
      const priority = Math.max(...forced.map((event) => event.priority ?? 0));
      pool = forced.filter((event) => (event.priority ?? 0) === priority);
    }
    return this.pickWeightedItem(pool, (event) => this.getEventWeight(event))?.id ?? null;
  }

  pickWeightedItem(items, getWeight) {
    const weighted = items.map((item) => ({ item, weight: Math.max(0, Number(getWeight(item)) || 0) }));
    const total = weighted.reduce((sum, entry) => sum + entry.weight, 0);
    if (total <= 0) return weighted[0]?.item ?? null;
    let draw = this.roll() * total;
    for (const entry of weighted) {
      draw -= entry.weight;
      if (draw < 0) return entry.item;
    }
    return weighted.at(-1)?.item ?? null;
  }

  findEnding() { return this.endings.find((ending) => this.meetsRequirements(ending.requirements)) ?? null; }

  meetsRequirements(requirements) {
    if (!requirements) return true;
    if (requirements.all) return requirements.all.every((rule) => this.meetsRequirements(rule));
    if (requirements.any) return requirements.any.some((rule) => this.meetsRequirements(rule));
    if (requirements.not) return !this.meetsRequirements(requirements.not);
    if (requirements.stat) return this.inRange(this.state?.stats?.[requirements.stat], requirements);
    if (requirements.hidden) return this.inRange(this.state?.hidden?.[requirements.hidden], requirements);
    if (requirements.national) return this.inRange(this.state?.national?.[requirements.national], requirements);
    if (requirements.careerTrack) return [requirements.careerTrack].flat().some((track) => this.hasCareerTrack(track));
    if (requirements.age) return this.inRange(this.state.age, requirements.age);
    if (requirements.year) return this.inRange(this.state.year, requirements.year);
    if (requirements.electionDue !== undefined) return (this.state.year >= this.state.nextElectionYear) === requirements.electionDue;
    if (requirements.eventCount) return this.inRange(this.state.eventCounts[requirements.eventCount.id] ?? 0, requirements.eventCount);
    if (requirements.state) return this.inRange(this.state[requirements.state] ?? 0, requirements);
    if (requirements.origin) return [requirements.origin].flat().includes(this.state.originId);
    if (requirements.background) return [requirements.background].flat().includes(this.state.backgroundId);
    if (requirements.role) return [requirements.role].flat().includes(this.state.role);
    if (requirements.roleIncludes) return this.state.role.toLowerCase().includes(String(requirements.roleIncludes).toLowerCase());
    if (requirements.context) return [requirements.context].flat().some((id) => this.state.contexts.includes(id));
    if (requirements.personality) return [requirements.personality].flat().includes(this.state.personality);
    if (requirements.hasTag) return [requirements.hasTag].flat().every((tag) => this.state.tags.includes(tag));
    if (requirements.hasAnyTag) return [requirements.hasAnyTag].flat().some((tag) => this.state.tags.includes(tag));
    if (requirements.missingTag) return [requirements.missingTag].flat().every((tag) => !this.state.tags.includes(tag));
    if (requirements.decision) return this.state.decisions.includes(requirements.decision);
    if (requirements.outcome) return this.state.outcomes.includes(requirements.outcome);
    if (requirements.scandal) return this.state.memory.scandals.some((item) => item.id === requirements.scandal);
    if (requirements.relation) return this.inRange(this.state.relations[requirements.relation.name]?.score ?? 0, requirements.relation);
    return false;
  }

  inRange(value = 0, rule = {}) { return value >= (rule.min ?? -Infinity) && value <= (rule.max ?? Infinity); }

  getDiagnostics() {
    return [...this.events.values()].map((event) => ({
      id: event.id,
      eligible: !event.initialOnly && !event.directedOnly && this.meetsCareerGate(event) && this.meetsRequirements(event.requirements),
      count: this.state?.eventCounts?.[event.id] ?? 0,
      weight: this.state ? this.getEventWeight(event) : event.weight ?? 10,
      requirements: clone(event.requirements ?? null),
      careerGate: EVENT_CAREER_GATES[event.id] ?? null,
      options: event.options.map((option) => ({ id: option.id, available: this.state ? this.isOptionAvailable(option) : true, requirements: clone(option.requirements ?? null), outcomes: (option.outcomes ?? []).map((outcome) => ({ id: outcome.id, weight: this.state ? this.getOutcomeWeight(outcome) : outcome.weight ?? 1 })) })),
    }));
  }

  forceEvent(eventId) {
    if (!this.events.has(eventId)) throw new Error("Evento inexistente.");
    this.state.currentEventId = eventId;
    this.state.endingId = null;
    syncActiveCases(this.state, this.events.get(eventId));
    return this.getSnapshot();
  }

  syncCurrentCases() {
    syncActiveCases(this.state, this.events.get(this.state?.currentEventId));
    return this.getSnapshot();
  }
}

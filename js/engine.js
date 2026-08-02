import { GAME_CONFIG } from "../data/config.js";
import { ORIGINS } from "../data/origins.js";
import { EVENTS } from "../data/events/index.js";
import { ENDINGS } from "../data/endings.js";

const clone = (value) => JSON.parse(JSON.stringify(value));
const clamp = (value, min = -Infinity, max = Infinity) => Math.max(min, Math.min(max, value));

const ROLE_RANK = {
  "Creador de contenido político": 1, "Dirigente vecinal": 1, "Asesor independiente": 2,
  "Asesora parlamentaria": 2, "Asesor de imagen": 2, "Vocero político": 3, "Regidor distrital": 3,
  "Secretario partidario": 3, "Operador mediático": 3, "Alcalde": 4, "Congresista": 5,
  "Gobernador regional": 6, "Embajador": 6, "Ministro de Estado": 7, "Premier": 8,
  "Exministro": 7, "Presidente del Congreso": 8, "Vicepresidente del Perú": 8, "Presidente del Perú": 10,
  "Expresidente del Perú": 10,
};
const ROLE_CANONICAL = { "Exministro": "Ministro de Estado" };

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
    const collect = (id, type) => {
      if (!id || ids.has(id)) throw new Error(`Identificador duplicado o inválido: ${type} «${id}».`);
      ids.add(id);
    };

    this.origins.forEach((origin) => collect(origin.id, "origen"));
    EVENTS.forEach((event) => {
      collect(event.id, "evento");
      if (!event.options?.length) throw new Error(`El evento ${event.id} no tiene opciones.`);
      event.options.forEach((option) => {
        collect(option.id, "opción");
        if (option.nextEvent) destinations.push([option.id, option.nextEvent]);
        option.outcomes?.forEach((outcome) => {
          collect(outcome.id, "resultado");
          if (outcome.nextEvent) destinations.push([outcome.id, outcome.nextEvent]);
        });
      });
    });
    this.endings.forEach((ending) => collect(ending.id, "final"));
    this.origins.forEach((origin) => {
      if (!this.events.has(origin.initialEvent)) throw new Error(`El origen ${origin.id} apunta a un evento inexistente.`);
      for (const eventId of origin.exclusiveEvents ?? []) {
        if (!this.events.has(eventId)) throw new Error(`El origen ${origin.id} declara el evento inexistente ${eventId}.`);
      }
    });
    destinations.forEach(([source, target]) => {
      if (!this.events.has(target)) throw new Error(`${source} apunta al evento inexistente ${target}.`);
    });
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
    for (const key of Object.keys(this.config.hiddenStats)) hidden[key] = 50;
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
    const available = [...this.config.contexts];
    const contexts = [];
    while (contexts.length < 2 && available.length) {
      const index = Math.floor(this.roll() * available.length);
      const context = available.splice(index, 1)[0];
      contexts.push(context.id);
      for (const [key, effect] of Object.entries(context.effects ?? {})) national[key] += effect;
    }
    return { national, contexts };
  }

  start(originId) {
    const origin = this.origins.find((item) => item.id === originId);
    if (!origin) throw new Error("Origen no encontrado.");
    this.initializeRandom();
    const stats = {};
    for (const key of Object.keys(this.config.stats)) stats[key] = this.sampleValue(origin.stats?.[key], 0);
    const { national, contexts } = this.buildNationalContext();
    const age = this.sampleValue(origin.startAge, this.config.minAge);

    this.state = {
      version: 2,
      seed: this.seed,
      originId: origin.id,
      originName: origin.name,
      age,
      year: this.config.startYear,
      nextElectionYear: this.config.startYear + this.config.electionCycleYears,
      presidentialRuns: 0,
      role: origin.initialRole,
      highestRole: origin.initialRole,
      currentOffice: { role: origin.initialRole, startYear: this.config.startYear, expectedEndYear: null },
      career: [{ role: origin.initialRole, startYear: this.config.startYear, endYear: null }],
      yearsInPublicOffice: 0,
      elections: { won: 0, lost: 0, history: [] },
      stats,
      hidden: this.buildInitialHidden(origin),
      national,
      contexts,
      relations: clone(origin.relations ?? {}),
      memory: { allies: [], enemies: [], favors: [], promises: [], scandals: [], investigations: [], crises: [], wars: [] },
      personality: "outsider",
      tags: [...(origin.tags ?? [])],
      decisions: [],
      outcomes: [],
      eventCounts: {},
      lastEventYear: {},
      lastEventGroupYear: {},
      eventAffinities: Object.fromEntries([...this.events.values()].map((event) => [event.id, event.forced ? 1 : Math.round((0.55 + this.roll() * 0.9) * 100) / 100])),
      history: [],
      currentEventId: origin.initialEvent,
      endingId: null,
    };
    this.normalizeAll();
    this.state.personality = this.derivePersonality();
    return this.getSnapshot();
  }

  load(savedState) {
    if (!savedState?.originId || !savedState.currentEventId && !savedState.endingId) throw new Error("Partida guardada inválida.");
    this.seed = String(savedState.seed ?? this.seed);
    const calls = Number(savedState.randomCalls ?? 0);
    this.initializeRandom(calls);
    this.state = clone(savedState);
    delete this.state.randomCalls;
    delete this.state.event;
    delete this.state.ending;
    this.state.lastEventGroupYear ??= {};
    this.state.eventAffinities ??= {};
    this.normalizeAll();
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
    return event.options.map((option) => ({ ...clone(option), available: this.meetsRequirements(option.requirements) }));
  }

  choose(optionId) {
    if (!this.state || this.state.endingId) throw new Error("No hay una partida activa.");
    const event = this.events.get(this.state.currentEventId);
    const option = event.options.find((item) => item.id === optionId);
    if (!option) throw new Error("Opción no encontrada.");
    if (!this.meetsRequirements(option.requirements)) throw new Error("Esta opción no está disponible.");
    const before = this.getSnapshot();

    this.applyPayload(option);
    const outcome = this.pickOutcome(option.outcomes ?? [{ id: `${option.id}-default`, weight: 100 }]);
    this.applyPayload(outcome);

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

    const sameYear = Boolean(outcome.sameYear ?? option.sameYear);
    if (!sameYear) this.advanceYear();
    this.normalizeAll();
    this.state.personality = this.derivePersonality();

    const ending = this.findEnding();
    if (ending) {
      this.closeCurrentOffice();
      this.state.endingId = ending.id;
      this.state.currentEventId = null;
    } else {
      const nextEventId = outcome.nextEvent ?? option.nextEvent ?? this.findNextEventId();
      this.state.currentEventId = nextEventId && this.events.has(nextEventId) ? nextEventId : null;
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
    if (!role || role === this.state.role) return;
    this.closeCurrentOffice();
    this.state.role = role;
    this.state.currentOffice = { role, startYear: this.state.year, expectedEndYear: duration ? this.state.year + duration : null };
    this.state.career.push({ role, startYear: this.state.year, endYear: null });
    if ((ROLE_RANK[role] ?? 0) > (ROLE_RANK[this.state.highestRole] ?? 0)) this.state.highestRole = ROLE_CANONICAL[role] ?? role;
  }

  closeCurrentOffice() {
    const current = this.state.career.at(-1);
    if (current && current.endYear === null) current.endYear = this.state.year;
  }

  recordElection(event, option, outcome) {
    if (event.category === "presidential-election") {
      this.state.nextElectionYear = this.state.year + this.config.electionCycleYears;
      if (option.id === "campana-presidencial") this.state.presidentialRuns += 1;
    }
    if (outcome.electionWon === undefined) return;
    const won = Boolean(outcome.electionWon);
    this.state.elections[won ? "won" : "lost"] += 1;
    this.state.elections.history.push({ year: this.state.year, office: "Presidencia", result: won ? "victoria" : "derrota", outcomeId: outcome.id });
  }

  advanceYear() {
    this.state.age += 1;
    this.state.year += 1;
    if (ROLE_RANK[this.state.role] >= 3) this.state.yearsInPublicOffice += 1;
    this.evolveNationalContext();
    this.updatePoliticalRisk();
  }

  evolveNationalContext() {
    const drift = { growth: 1.2, inflation: 1.3, unemployment: 1, poverty: 0.8, investment: 3, deficit: 0.8, debt: 1.2, security: 4, socialConflict: 4 };
    for (const [key, amount] of Object.entries(drift)) this.state.national[key] += Math.round((this.roll() - 0.5) * amount * 2);
    if (this.roll() < 0.22) {
      const context = this.config.contexts[Math.floor(this.roll() * this.config.contexts.length)];
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
      h.vacancyRisk = Math.max(0, h.vacancyRisk - 8);
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
    return Math.max(0, weight);
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

  findNextEventId() {
    const candidates = [...this.events.values()].filter((event) => {
      if (event.id === this.state.currentEventId && this.config.random.avoidImmediateRepeats) return false;
      if (event.initialOnly || event.directedOnly || !this.meetsRequirements(event.requirements)) return false;
      if (!event.options.some((option) => this.meetsRequirements(option.requirements))) return false;
      const count = this.state.eventCounts[event.id] ?? 0;
      if (!event.repeatable && count > 0) return false;
      if (event.maxOccurrences && count >= event.maxOccurrences) return false;
      if (this.state.year - (this.state.lastEventYear[event.id] ?? -Infinity) < (event.cooldown ?? 0)) return false;
      if (event.group && this.state.year - (this.state.lastEventGroupYear[event.group] ?? -Infinity) < (event.groupCooldown ?? 0)) return false;
      return true;
    });
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
    if (requirements.age) return this.inRange(this.state.age, requirements.age);
    if (requirements.year) return this.inRange(this.state.year, requirements.year);
    if (requirements.electionDue !== undefined) return (this.state.year >= this.state.nextElectionYear) === requirements.electionDue;
    if (requirements.eventCount) return this.inRange(this.state.eventCounts[requirements.eventCount.id] ?? 0, requirements.eventCount);
    if (requirements.state) return this.inRange(this.state[requirements.state] ?? 0, requirements);
    if (requirements.origin) return [requirements.origin].flat().includes(this.state.originId);
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
    return true;
  }

  inRange(value = 0, rule = {}) { return value >= (rule.min ?? -Infinity) && value <= (rule.max ?? Infinity); }

  getDiagnostics() {
    return [...this.events.values()].map((event) => ({
      id: event.id,
      eligible: !event.initialOnly && !event.directedOnly && this.meetsRequirements(event.requirements),
      count: this.state?.eventCounts?.[event.id] ?? 0,
      weight: this.state ? this.getEventWeight(event) : event.weight ?? 10,
      requirements: clone(event.requirements ?? null),
      options: event.options.map((option) => ({ id: option.id, available: this.state ? this.meetsRequirements(option.requirements) : true, requirements: clone(option.requirements ?? null), outcomes: (option.outcomes ?? []).map((outcome) => ({ id: outcome.id, weight: this.state ? this.getOutcomeWeight(outcome) : outcome.weight ?? 1 })) })),
    }));
  }

  forceEvent(eventId) {
    if (!this.events.has(eventId)) throw new Error("Evento inexistente.");
    this.state.currentEventId = eventId;
    this.state.endingId = null;
    return this.getSnapshot();
  }
}

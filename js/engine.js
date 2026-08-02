import { GAME_CONFIG } from "../data/config.js";
import { ORIGINS } from "../data/origins.js";
import { EVENTS } from "../data/events/index.js";
import { ENDINGS } from "../data/endings.js";

const clone = (value) => JSON.parse(JSON.stringify(value));

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
  constructor({ seed = null } = {}) {
    this.config = GAME_CONFIG;
    this.origins = ORIGINS;
    this.events = new Map(EVENTS.map((event) => [event.id, event]));
    this.endings = [...ENDINGS].sort((a, b) => b.priority - a.priority);
    this.seed = seed;
    this.random = seed === null || seed === "" ? Math.random : seededRandom(seed);
    this.state = null;
    this.validateData();
  }

  validateData() {
    const ids = new Set();
    const collect = (id, type) => {
      if (!id || ids.has(id)) throw new Error(`Identificador duplicado o inválido: ${type} «${id}».`);
      ids.add(id);
    };

    this.origins.forEach((origin) => collect(origin.id, "origen"));
    EVENTS.forEach((event) => {
      collect(event.id, "evento");
      event.options.forEach((option) => {
        collect(option.id, "opción");
        option.outcomes?.forEach((outcome) => collect(outcome.id, "resultado"));
      });
    });
    this.endings.forEach((ending) => collect(ending.id, "final"));

    this.origins.forEach((origin) => {
      if (!this.events.has(origin.initialEvent)) throw new Error(`El origen ${origin.id} apunta a un evento inexistente.`);
    });
  }

  start(originId) {
    const origin = this.origins.find((item) => item.id === originId);
    if (!origin) throw new Error("Origen no encontrado.");

    this.state = {
      originId: origin.id,
      originName: origin.name,
      age: origin.startAge,
      role: origin.initialRole,
      stats: clone(origin.stats),
      tags: [...(origin.tags ?? [])],
      decisions: [],
      history: [],
      currentEventId: origin.initialEvent,
      endingId: null,
    };
    this.normalizeStats();
    return this.getSnapshot();
  }

  reset() {
    this.state = null;
  }

  getSnapshot() {
    if (!this.state) return null;
    const event = this.state.currentEventId ? this.events.get(this.state.currentEventId) : null;
    const ending = this.state.endingId ? this.endings.find((item) => item.id === this.state.endingId) : null;
    return {
      ...clone(this.state),
      tags: [...this.state.tags],
      event: event ? clone(event) : null,
      ending: ending ? clone(ending) : null,
    };
  }

  getAvailableOptions() {
    if (!this.state?.currentEventId || this.state.endingId) return [];
    const event = this.events.get(this.state.currentEventId);
    return event.options.map((option) => ({
      ...clone(option),
      available: this.meetsRequirements(option.requirements),
    }));
  }

  choose(optionId) {
    if (!this.state || this.state.endingId) throw new Error("No hay una partida activa.");
    const event = this.events.get(this.state.currentEventId);
    const option = event.options.find((item) => item.id === optionId);
    if (!option) throw new Error("Opción no encontrada.");
    if (!this.meetsRequirements(option.requirements)) throw new Error("Esta opción no está disponible.");

    this.applyPayload(option);
    const outcome = this.pickOutcome(option.outcomes ?? [{ id: `${option.id}-default`, weight: 100 }]);
    this.applyPayload(outcome);

    this.state.decisions.push(option.id);
    this.state.history.unshift({
      age: this.state.age,
      eventId: event.id,
      eventTitle: event.title,
      optionId: option.id,
      optionLabel: option.label,
      outcomeId: outcome.id,
      text: outcome.text ?? "Tomaste una decisión que cambió tu trayectoria.",
    });

    const sameYear = Boolean(outcome.sameYear ?? option.sameYear);
    if (!sameYear) this.state.age += 1;
    this.normalizeStats();

    const ending = this.findEnding();
    if (ending) {
      this.state.endingId = ending.id;
      this.state.currentEventId = null;
    } else {
      const nextEventId = outcome.nextEvent ?? option.nextEvent ?? this.findNextEventId();
      this.state.currentEventId = nextEventId && this.events.has(nextEventId) ? nextEventId : null;
      if (!this.state.currentEventId) {
        const generic = this.endings.find((item) => item.id === "retiro");
        this.state.endingId = generic?.id ?? null;
      }
    }

    return { snapshot: this.getSnapshot(), outcome: clone(outcome) };
  }

  applyPayload(payload = {}) {
    for (const [key, value] of Object.entries(payload.effects ?? {})) {
      if (key in this.state.stats) this.state.stats[key] += Number(value) || 0;
    }
    if (payload.setRole) this.state.role = payload.setRole;
    for (const tag of payload.addTags ?? []) {
      if (!this.state.tags.includes(tag)) this.state.tags.push(tag);
    }
    if (payload.removeTags?.length) {
      this.state.tags = this.state.tags.filter((tag) => !payload.removeTags.includes(tag));
    }
  }

  normalizeStats() {
    for (const [key, meta] of Object.entries(this.config.stats)) {
      const current = Number(this.state.stats[key]) || 0;
      this.state.stats[key] = Math.max(meta.min ?? -Infinity, Math.min(meta.max ?? Infinity, current));
    }
  }

  pickOutcome(outcomes) {
    const eligible = outcomes.filter((outcome) => this.meetsRequirements(outcome.requirements));
    if (!eligible.length) throw new Error("La opción elegida no tiene resultados válidos.");

    const weighted = eligible.map((outcome) => ({ outcome, weight: this.getOutcomeWeight(outcome) }));
    const total = weighted.reduce((sum, item) => sum + item.weight, 0);
    if (total <= 0) return weighted[0].outcome;

    let draw = this.random() * total;
    for (const item of weighted) {
      draw -= item.weight;
      if (draw < 0) return item.outcome;
    }
    return weighted.at(-1).outcome;
  }

  getOutcomeWeight(outcome) {
    let weight = Math.max(0, Number(outcome.weight ?? 1));
    for (const modifier of outcome.weightModifiers ?? []) {
      if (this.meetsRequirements(modifier.when)) {
        weight = (weight + Number(modifier.add ?? 0)) * Number(modifier.multiply ?? 1);
      }
    }
    return Math.max(0, weight);
  }

  findNextEventId() {
    return [...this.events.values()].find((event) => (
      !this.state.history.some((entry) => entry.eventId === event.id)
      && this.meetsRequirements(event.requirements)
    ))?.id ?? null;
  }

  findEnding() {
    return this.endings.find((ending) => this.meetsRequirements(ending.requirements)) ?? null;
  }

  meetsRequirements(requirements) {
    if (!requirements) return true;
    if (requirements.all) return requirements.all.every((rule) => this.meetsRequirements(rule));
    if (requirements.any) return requirements.any.some((rule) => this.meetsRequirements(rule));
    if (requirements.not) return !this.meetsRequirements(requirements.not);
    if (requirements.stat) {
      const value = this.state?.stats?.[requirements.stat] ?? 0;
      return value >= (requirements.min ?? -Infinity) && value <= (requirements.max ?? Infinity);
    }
    if (requirements.age) {
      return this.state.age >= (requirements.age.min ?? -Infinity) && this.state.age <= (requirements.age.max ?? Infinity);
    }
    if (requirements.origin) return [requirements.origin].flat().includes(this.state.originId);
    if (requirements.role) return [requirements.role].flat().includes(this.state.role);
    if (requirements.hasTag) return this.state.tags.includes(requirements.hasTag);
    if (requirements.missingTag) return !this.state.tags.includes(requirements.missingTag);
    if (requirements.decision) return this.state.decisions.includes(requirements.decision);
    return true;
  }
}

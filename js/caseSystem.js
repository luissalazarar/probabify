import { NATIONAL_EMERGENCY_CASES, SPECIAL_CASE_DEFINITIONS } from "../data/specialCases.js";
import {
  buildCaseCareerCloseNews,
  buildCaseOpeningNews,
  buildDisasterFollowupNews,
  buildDisasterResolutionNews,
  buildTrialCrossCaseNews,
  buildVacancyShiftNews,
  enrichCaseOutcomeText,
} from "./narrativeSystem.js";

const clamp = (value, min = 0, max = 100) => Math.max(min, Math.min(max, Number(value) || 0));
const round = (value) => Math.round(clamp(value));
const kindsForEvent = (event) => Array.isArray(event?.caseKinds) ? event.caseKinds : [];
const caseOutcomesFor = (payload = {}) => Array.isArray(payload.caseOutcomes)
  ? payload.caseOutcomes.filter(Boolean)
  : payload.caseOutcome ? [payload.caseOutcome] : [];

function caseOutcomeFor(payload, activeCase) {
  return caseOutcomesFor(payload).find((descriptor) => descriptor.kind === activeCase.kind
    && (!descriptor.variant || descriptor.variant === activeCase.variant)) ?? null;
}

function moneyScore(value) {
  const money = Math.max(0, Number(value) || 0);
  return clamp((Math.log10(money + 1) / 6) * 100);
}

function relationAverage(state) {
  const entries = Object.values(state.relations ?? {});
  if (!entries.length) return 50;
  return clamp(entries.reduce((sum, relation) => sum + Number(relation.score ?? 0), 0) / entries.length);
}

function metricValue(activeCase, id) {
  return Number(activeCase.metrics.find((metric) => metric.id === id)?.value ?? 50);
}

function caseId(kind, variant = null) {
  const base = SPECIAL_CASE_DEFINITIONS[kind]?.id ?? kind;
  return variant ? `${base}:${variant}` : base;
}

function findCase(state, kind, variant = null) {
  return state.activeCases.find((entry) => entry.status !== "Resuelto" && entry.kind === kind && (variant === null || entry.variant === variant));
}

function nextCaseId(state, kind, variant = null) {
  const base = caseId(kind, variant);
  const used = new Set([...(state.activeCases ?? []), ...(state.caseArchive ?? [])].map((entry) => entry.id));
  if (!used.has(base)) return base;
  let sequence = 2;
  while (used.has(`${base}#${sequence}`)) sequence += 1;
  return `${base}#${sequence}`;
}

function computeTargets(activeCase, state) {
  const stats = state.stats ?? {};
  const hidden = state.hidden ?? {};
  const national = state.national ?? {};
  const cleanResources = moneyScore(stats.cleanMoney);
  const network = relationAverage(state);

  if (activeCase.kind === "trial") {
    return {
      evidence: stats.legalRisk * 0.55 + hidden.leakExposure * 0.25 + (100 - hidden.prosecutionRelation) * 0.2,
      defense: cleanResources * 0.25 + hidden.credibility * 0.25 + hidden.judiciaryRelation * 0.35 + hidden.personalReputation * 0.15,
      court: hidden.judiciaryRelation * 0.55 + hidden.prosecutionRelation * 0.3 + hidden.credibility * 0.15,
      media: hidden.mediaNotoriety * 0.35 + hidden.polarization * 0.25 + stats.legalRisk * 0.25 + (100 - hidden.pressSupport) * 0.15,
    };
  }
  if (activeCase.kind === "campaign") {
    return {
      intention: stats.approval * 0.55 + Math.max(hidden.urbanApproval, hidden.ruralApproval) * 0.2 + hidden.credibility * 0.15 + stats.influence * 0.1,
      organization: stats.influence * 0.3 + hidden.partyCohesion * 0.35 + hidden.regionalSupport * 0.2 + Math.max(hidden.businessSupport, hidden.unionSupport) * 0.15,
      resources: cleanResources * 0.78 + hidden.businessSupport * 0.22,
      rejection: hidden.polarization * 0.35 + stats.legalRisk * 0.25 + (100 - hidden.credibility) * 0.2 + (100 - hidden.personalReputation) * 0.2,
    };
  }
  if (activeCase.kind === "vacancy") {
    return {
      survival: hidden.congressSupport * 0.7 + (100 - hidden.vacancyRisk) * 0.3,
      cabinet: hidden.cabinetLoyalty,
      institutions: hidden.governmentStability * 0.45 + hidden.armedForcesSupport * 0.3 + hidden.credibility * 0.25,
      street: stats.approval * 0.5 + ((hidden.urbanApproval + hidden.ruralApproval) / 2) * 0.3 + (100 - hidden.polarization) * 0.2,
    };
  }
  if (activeCase.kind === "disaster") {
    const base = NATIONAL_EMERGENCY_CASES[activeCase.variant]?.severity ?? 68;
    const nationalOfficial = /ministro|premier|vicepresidente|congres|diputad|senad|presidente del congreso|embajador/i.test(state.role ?? "");
    return {
      severity: base + (national.poverty - 25) * 0.35 + (national.socialConflict - 45) * 0.25 + (50 - national.security) * 0.2,
      response: state.tags?.includes("presidente-actual")
        ? hidden.governmentStability * 0.38 + hidden.cabinetLoyalty * 0.3 + hidden.armedForcesSupport * 0.22 + hidden.credibility * 0.1
        : nationalOfficial
          ? hidden.governmentStability * 0.25 + hidden.congressSupport * 0.25 + hidden.armedForcesSupport * 0.15 + hidden.credibility * 0.2 + stats.influence * 0.15
        : state.originId === "provincia" || /alcalde|gobernador|regidor/i.test(state.role)
          ? hidden.regionalSupport * 0.42 + hidden.ruralApproval * 0.3 + hidden.credibility * 0.28
          : hidden.credibility * 0.35 + hidden.personalReputation * 0.3 + stats.influence * 0.2 + hidden.mediaNotoriety * 0.15,
      supplies: national.investment * 0.35 + (100 - national.poverty) * 0.2 + hidden.businessSupport * 0.15 + hidden.regionalSupport * 0.15 + cleanResources * 0.15,
      trust: hidden.credibility * 0.4 + hidden.personalReputation * 0.25 + stats.approval * 0.25 + (100 - hidden.polarization) * 0.1,
    };
  }
  if (activeCase.kind === "prison") {
    return {
      appeal: (100 - stats.legalRisk) * 0.35 + hidden.judiciaryRelation * 0.35 + hidden.prosecutionRelation * 0.3,
      outside: stats.influence * 0.3 + hidden.partyCohesion * 0.25 + hidden.mediaNotoriety * 0.2 + network * 0.25,
      inside: stats.influence * 0.3 + hidden.personalReputation * 0.25 + hidden.credibility * 0.2 + hidden.polarization * 0.15 + network * 0.1,
      family: 100 - hidden.familyStress,
    };
  }
  if (activeCase.kind === "exile") {
    return {
      legalPath: (100 - stats.legalRisk) * 0.25 + hidden.judiciaryRelation * 0.2 + hidden.internationalReputation * 0.35 + hidden.prosecutionRelation * 0.2,
      international: hidden.internationalReputation * 0.55 + hidden.credibility * 0.25 + hidden.pressSupport * 0.2,
      remote: stats.influence * 0.45 + hidden.mediaNotoriety * 0.35 + hidden.partyCohesion * 0.2,
      resources: cleanResources * 0.7 + hidden.businessSupport * 0.3,
    };
  }
  return {};
}

function refreshCaseMetrics(activeCase, state) {
  const freezeCurrentVacancy = activeCase.kind === "vacancy" && !state.tags?.includes("presidente-actual");
  if (freezeCurrentVacancy && !activeCase.terminalBaselineMetrics) {
    activeCase.terminalBaselineMetrics = Object.fromEntries(activeCase.metrics.map((metric) => [metric.id, metric.value - Number(activeCase.adjustments?.[metric.id] ?? 0)]));
  }
  const targets = activeCase.kind === "disaster" && activeCase.baselineMetrics
    ? activeCase.baselineMetrics
    : freezeCurrentVacancy
      ? activeCase.terminalBaselineMetrics
      : computeTargets(activeCase, state);
  for (const metric of activeCase.metrics) {
    const adjustment = Number(activeCase.adjustments?.[metric.id] ?? 0);
    metric.value = round(Number(targets[metric.id] ?? metric.value ?? 50) + adjustment);
  }
}

function applyAdjustments(activeCase, effects = {}) {
  activeCase.adjustments ??= {};
  for (const [metric, delta] of Object.entries(effects)) {
    if (!activeCase.metrics.some((entry) => entry.id === metric)) continue;
    activeCase.adjustments[metric] = clamp(Number(activeCase.adjustments[metric] ?? 0) + Number(delta), -45, 45);
  }
}

const POLARITY_EFFECTS = {
  trial: {
    favorable: { evidence: -8, defense: 5, court: 6, media: -3 },
    adverse: { evidence: 9, defense: -5, court: -7, media: 7 },
  },
  campaign: {
    favorable: { intention: 8, organization: 5, rejection: -5 },
    adverse: { intention: -7, organization: -4, rejection: 7 },
  },
  vacancy: {
    favorable: { survival: 9, cabinet: 5, institutions: 4, street: 4 },
    adverse: { survival: -10, cabinet: -6, institutions: -7, street: -6 },
  },
  disaster: {
    favorable: { severity: -6, response: 8, supplies: 6, trust: 7 },
    adverse: { severity: 8, response: -7, supplies: -5, trust: -9 },
  },
  prison: {
    favorable: { appeal: 10, outside: 4, family: 3 },
    adverse: { appeal: -10, outside: -4, family: -5 },
  },
  exile: {
    favorable: { legalPath: 10, international: 5, remote: 4 },
    adverse: { legalPath: -10, international: -6, remote: -4 },
  },
};

function addNews(state, activeCase, entry) {
  state.caseSequence += 1;
  const news = {
    id: `${activeCase.id}-${state.caseSequence}`,
    year: entry.year ?? state.year,
    headline: String(entry.headline ?? activeCase.title),
    text: String(entry.text ?? "El expediente sigue abierto."),
    causeLabel: String(entry.causeLabel ?? "Evolución del expediente"),
    tone: entry.tone ?? "neutral",
  };
  activeCase.news.push(news);
  activeCase.timeline.push(news);
  activeCase.news = activeCase.news.slice(-6);
  activeCase.timeline = activeCase.timeline.slice(-6);
  activeCase.updatedYear = state.year;
  activeCase.lastNewsId = news.id;
}

function initialNews(state, event, kind, caseContext) {
  const prior = state.history?.[0];
  const eventMatchesCase = kindsForEvent(event).some((descriptor) => descriptor.kind === kind);
  if (kind === "campaign" && prior && eventMatchesCase && !state.caseMigrationPending) {
    const opening = buildCaseOpeningNews(state, caseContext, kind);
    if (opening) return {
      year: prior.year,
      ...opening,
      causeLabel: `Consecuencia de: ${prior.optionLabel}`,
      originDecision: prior.optionLabel,
      sourceEventId: prior.eventId,
    };
  }
  if (["prison", "exile"].includes(kind) && prior && eventMatchesCase && !state.caseMigrationPending) {
    return {
      year: prior.year,
      headline: prior.headline,
      text: prior.text,
      causeLabel: `Consecuencia de: ${prior.optionLabel}`,
      tone: kind === "prison" ? "danger" : "warning",
      originDecision: prior.optionLabel,
      sourceEventId: prior.eventId,
    };
  }
  if (kind === "vacancy" && event?.id !== "mocion-vacancia") {
    const risk = round(state.hidden?.vacancyRisk ?? 0);
    const causalPrior = state.caseMigrationPending ? null : prior;
    return {
      year: state.year,
      headline: causalPrior
        ? (risk >= 70 ? "La última decisión acelera el conteo de vacancia" : "El Congreso retoma el conteo de una vacancia")
        : (risk >= 70 ? "La oposición acelera el conteo para una vacancia" : "Varias bancadas empiezan a contar votos"),
      text: causalPrior?.headline
        ? `Tras «${causalPrior.headline}», el riesgo parlamentario queda en ${risk}/100.`
        : `El riesgo parlamentario llega a ${risk}/100. Congreso, gabinete y respaldo institucional decidirán si la amenaza crece o se enfría.`,
      causeLabel: causalPrior?.optionLabel ? `La tensión subió tras elegir: ${causalPrior.optionLabel}` : "Tensión acumulada del gobierno",
      tone: risk >= 70 ? "danger" : "warning",
      originDecision: causalPrior?.optionLabel ?? null,
      sourceEventId: causalPrior?.eventId ?? event?.id ?? null,
    };
  }
  if (["trial", "disaster"].includes(kind) && event?.title) {
    return {
      year: state.year,
      headline: event.title,
      text: event.description,
      causeLabel: "Inicio del expediente",
      tone: "warning",
    };
  }
  const opening = buildCaseOpeningNews(state, caseContext, kind);
  if (opening) return { year: state.year, ...opening };
  return {
    year: state.year,
    headline: event?.title ?? caseContext.title,
    text: event?.description ?? "La situación entra en una nueva etapa y exige una respuesta concreta.",
    causeLabel: "Inicio de una situación en desarrollo",
    tone: "warning",
  };
}

function openCase(state, descriptor, event) {
  const definition = SPECIAL_CASE_DEFINITIONS[descriptor.kind];
  if (!definition) return null;
  const variant = descriptor.variant ?? null;
  const existing = findCase(state, descriptor.kind, variant);
  if (existing) return existing;
  const id = nextCaseId(state, descriptor.kind, variant);
  const emergency = variant ? NATIONAL_EMERGENCY_CASES[variant] : null;
  const caseContext = {
    id,
    kind: descriptor.kind,
    variant,
    title: emergency?.title ?? definition.title,
    news: [],
  };
  const openingNews = initialNews(state, event, descriptor.kind, caseContext);
  const startedYear = Number.isFinite(Number(openingNews.year)) ? Number(openingNews.year) : state.year;
  const activeCase = {
    id,
    kind: descriptor.kind,
    variant,
    title: emergency?.title ?? definition.title,
    kicker: emergency?.kicker ?? definition.kicker,
    priority: definition.priority,
    status: "En curso",
    statusTone: "watch",
    stage: { ...(descriptor.stage ?? { current: 1, total: 3, label: "En desarrollo" }) },
    startedYear,
    updatedYear: state.year,
    turnsActive: 0,
    displayTurns: null,
    sourceEventId: openingNews.sourceEventId ?? event?.id ?? null,
    originDecision: openingNews.originDecision ?? null,
    resolution: null,
    adjustments: {},
    baselineMetrics: null,
    terminalBaselineMetrics: null,
    usedBriefs: [],
    metrics: definition.metrics.map((metric) => ({ ...metric, value: 50, previousValue: null })),
    news: [],
    timeline: [],
  };
  refreshCaseMetrics(activeCase, state);
  if (activeCase.kind === "disaster") activeCase.baselineMetrics = Object.fromEntries(activeCase.metrics.map((metric) => [metric.id, metric.value]));
  addNews(state, activeCase, openingNews);
  state.activeCases.push(activeCase);
  sortCases(state);
  return activeCase;
}

function sortCases(state) {
  state.activeCases.sort((a, b) => Number(a.status === "Resuelto") - Number(b.status === "Resuelto")
    || Number(b.priority ?? 0) - Number(a.priority ?? 0)
    || Number(a.startedYear ?? 0) - Number(b.startedYear ?? 0));
}

function canOpen(state, descriptor, event) {
  const tags = state.tags ?? [];
  if (descriptor.kind === "trial") {
    return !tags.includes("caso-principal-cerrado")
      && (!descriptor.observeOnly || tags.includes("proceso-judicial-abierto") || tags.includes("investigacion-formalizada") || tags.includes("orden-judicial-pendiente"));
  }
  if (descriptor.kind === "campaign") return tags.includes("en-campana-presidencial");
  if (descriptor.kind === "vacancy") return tags.includes("presidente-actual") && (event?.id === "mocion-vacancia" || Number(state.hidden?.vacancyRisk ?? 0) >= 55);
  if (descriptor.kind === "prison") return tags.includes("en-prision");
  if (descriptor.kind === "exile") return tags.includes("en-exilio");
  return descriptor.kind === "disaster";
}

function sanitizeCase(activeCase) {
  const definition = SPECIAL_CASE_DEFINITIONS[activeCase?.kind];
  if (!definition || !activeCase.id) return null;
  activeCase.title = String(activeCase.title ?? definition.title);
  activeCase.kicker = String(activeCase.kicker ?? definition.kicker);
  activeCase.priority = Number(activeCase.priority ?? definition.priority);
  activeCase.status = String(activeCase.status ?? "En curso");
  activeCase.statusTone = String(activeCase.statusTone ?? "watch");
  activeCase.stage = activeCase.stage && typeof activeCase.stage === "object" ? activeCase.stage : { current: 1, total: 3, label: "En desarrollo" };
  activeCase.adjustments = activeCase.adjustments && typeof activeCase.adjustments === "object" ? activeCase.adjustments : {};
  activeCase.baselineMetrics = activeCase.baselineMetrics && typeof activeCase.baselineMetrics === "object" ? activeCase.baselineMetrics : null;
  activeCase.terminalBaselineMetrics = activeCase.terminalBaselineMetrics && typeof activeCase.terminalBaselineMetrics === "object" ? activeCase.terminalBaselineMetrics : null;
  activeCase.usedBriefs = Array.isArray(activeCase.usedBriefs) ? [...new Set(activeCase.usedBriefs.map(String))] : [];
  activeCase.metrics = definition.metrics.map((definitionMetric) => {
    const saved = Array.isArray(activeCase.metrics) ? activeCase.metrics.find((metric) => metric.id === definitionMetric.id) : null;
    return { ...definitionMetric, value: round(saved?.value ?? 50), previousValue: saved?.previousValue == null ? null : round(saved.previousValue) };
  });
  activeCase.news = Array.isArray(activeCase.news) ? activeCase.news.filter((entry) => entry && typeof entry === "object").slice(-6) : [];
  activeCase.timeline = Array.isArray(activeCase.timeline) ? activeCase.timeline.filter((entry) => entry && typeof entry === "object").slice(-6) : [];
  activeCase.turnsActive = Math.max(0, Number(activeCase.turnsActive) || 0);
  return activeCase;
}

export function initializeCaseState(state) {
  state.activeCases = [];
  state.caseArchive = [];
  state.caseSequence = 0;
}

export function migrateCaseState(state) {
  state.activeCases = (Array.isArray(state.activeCases) ? state.activeCases : []).map(sanitizeCase).filter(Boolean);
  for (const activeCase of state.activeCases) {
    if (activeCase.kind === "disaster" && !activeCase.baselineMetrics) {
      activeCase.baselineMetrics = Object.fromEntries(activeCase.metrics.map((metric) => [metric.id, metric.value - Number(activeCase.adjustments?.[metric.id] ?? 0)]));
    }
  }
  state.caseArchive = Array.isArray(state.caseArchive) ? state.caseArchive.slice(-20) : [];
  const savedNews = state.activeCases.flatMap((activeCase) => [...activeCase.news, ...activeCase.timeline]);
  const largestNewsSuffix = savedNews.reduce((largest, entry) => {
    const suffix = Number(String(entry?.id ?? "").match(/-(\d+)$/)?.[1] ?? 0);
    return Math.max(largest, suffix);
  }, 0);
  const savedSequence = Math.max(0, Number(state.caseSequence) || 0);
  const distinctNewsCount = new Set(savedNews.map((entry) => entry?.id || `${entry?.year}|${entry?.headline}|${entry?.text}`)).size;
  state.caseSequence = Math.max(savedSequence, largestNewsSuffix, savedSequence > 0 ? 0 : distinctNewsCount);
  sortCases(state);
}

export function syncActiveCases(state, event) {
  if (!state || state.endingId) return;
  for (const descriptor of kindsForEvent(event)) {
    if (!canOpen(state, descriptor, event)) continue;
    const activeCase = openCase(state, descriptor, event);
    if (activeCase && activeCase.status !== "Resuelto" && descriptor.stage) activeCase.stage = { ...descriptor.stage };
  }

  if (state.tags?.includes("presidente-actual") && Number(state.hidden?.vacancyRisk ?? 0) >= 55) {
    openCase(state, { kind: "vacancy", stage: { current: 1, total: 3, label: "Conteo preliminar" } }, event);
  }
  if (state.tags?.includes("en-prision")) {
    const prisonCase = openCase(state, { kind: "prison", stage: { current: state.tags.includes("condena-final") ? 3 : 2, total: 3, label: state.tags.includes("condena-final") ? "Condena firme" : "Custodia y apelación" } }, event);
    if (prisonCase && prisonCase.status !== "Resuelto" && state.tags.includes("condena-final")) {
      prisonCase.stage = { current: 3, total: 3, label: "Condena firme" };
      prisonCase.statusTone = "danger";
    }
  }
  if (state.tags?.includes("en-exilio")) {
    openCase(state, { kind: "exile", stage: { current: 1, total: 3, label: "Permanencia fuera del país" } }, event);
  }
  sortCases(state);
}

function relatedToCase(activeCase, event) {
  if (activeCase.kind === "disaster") return event?.id === activeCase.variant;
  return kindsForEvent(event).some((descriptor) => descriptor.kind === activeCase.kind)
    || activeCase.kind === "trial" && ["prision-decision", "vida-prision", "vida-exilio", "tribunal-internacional"].includes(event?.id);
}

export function applyCasePayload(state, event, payload = {}) {
  if (!state?.activeCases?.length) return;
  for (const activeCase of state.activeCases) {
    if (activeCase.status === "Resuelto") continue;
    refreshCaseMetrics(activeCase, state);
    const explicit = payload.caseEffects?.[activeCase.kind];
    const disasterOutcomes = activeCase.kind === "disaster" ? caseOutcomesFor(payload).filter((descriptor) => descriptor.kind === "disaster") : [];
    const explicitTargetsCase = activeCase.kind !== "disaster"
      || (disasterOutcomes.length
        ? disasterOutcomes.some((descriptor) => !descriptor.variant || descriptor.variant === activeCase.variant)
        : relatedToCase(activeCase, event));
    if (explicit && explicitTargetsCase) applyAdjustments(activeCase, explicit);
    if (activeCase.kind === "disaster" && relatedToCase(activeCase, event) && payload.caseMaterialAid === true) {
      const spending = Math.max(0, -Number(payload.effects?.cleanMoney ?? 0));
      if (spending > 0) applyAdjustments(activeCase, { supplies: Math.min(14, Math.round(spending / 9000)), response: Math.min(6, Math.round(spending / 25000)) });
    }
    const caseOutcome = caseOutcomeFor(payload, activeCase);
    if (caseOutcome && caseOutcome.applyPolarityEffects !== false) {
      applyAdjustments(activeCase, POLARITY_EFFECTS[activeCase.kind]?.[caseOutcome.polarity] ?? {});
    }
    refreshCaseMetrics(activeCase, state);
  }
}

function caseStrength(activeCase) {
  if (activeCase.kind === "trial") return ((100 - metricValue(activeCase, "evidence")) + metricValue(activeCase, "defense") + metricValue(activeCase, "court") + (100 - metricValue(activeCase, "media"))) / 4;
  if (activeCase.kind === "campaign") return (metricValue(activeCase, "intention") + metricValue(activeCase, "organization") + metricValue(activeCase, "resources") + (100 - metricValue(activeCase, "rejection"))) / 4;
  if (activeCase.kind === "vacancy") return (metricValue(activeCase, "survival") + metricValue(activeCase, "cabinet") + metricValue(activeCase, "institutions") + metricValue(activeCase, "street")) / 4;
  if (activeCase.kind === "disaster") return ((100 - metricValue(activeCase, "severity")) + metricValue(activeCase, "response") + metricValue(activeCase, "supplies") + metricValue(activeCase, "trust")) / 4;
  return activeCase.metrics.reduce((sum, metric) => sum + metricValue(activeCase, metric.id), 0) / Math.max(1, activeCase.metrics.length);
}

function outcomeStrength(activeCase, descriptor) {
  if (!descriptor.weightMetric) return caseStrength(activeCase);
  const metric = activeCase.metrics.find((entry) => entry.id === descriptor.weightMetric);
  if (!metric) return caseStrength(activeCase);
  return metric.direction === "low" ? 100 - metricValue(activeCase, metric.id) : metricValue(activeCase, metric.id);
}

export function getCaseOutcomeMultiplier(state, outcome) {
  let combined = 1;
  let matched = false;
  for (const descriptor of caseOutcomesFor(outcome)) {
    if (descriptor.polarity === "neutral") continue;
    const activeCase = findCase(state, descriptor.kind, descriptor.variant ?? null);
    if (!activeCase) continue;
    const edge = (outcomeStrength(activeCase, descriptor) - 50) / 50;
    combined *= descriptor.polarity === "favorable" ? 1 + edge * 0.42 : 1 - edge * 0.34;
    matched = true;
  }
  return matched ? Math.max(0.5, Math.min(1.65, combined)) : 1;
}

function archiveExpiredCases(state) {
  const keep = [];
  for (const activeCase of state.activeCases) {
    if (activeCase.status !== "Resuelto") { keep.push(activeCase); continue; }
    if (Number(activeCase.displayTurns ?? 0) > 0) {
      activeCase.displayTurns -= 1;
      keep.push(activeCase);
      continue;
    }
    state.caseArchive.push({
      id: activeCase.id,
      kind: activeCase.kind,
      title: activeCase.title,
      startedYear: activeCase.startedYear,
      resolvedYear: activeCase.updatedYear,
      resolution: activeCase.resolution,
      originDecision: activeCase.originDecision ?? null,
      sourceEventId: activeCase.sourceEventId ?? null,
      lastHeadline: activeCase.news?.at(-1)?.headline ?? null,
      lastCauseLabel: activeCase.news?.at(-1)?.causeLabel ?? null,
      lastNewsTone: activeCase.news?.at(-1)?.tone ?? null,
      finalMetrics: Object.fromEntries(activeCase.metrics.map((metric) => [metric.id, metric.value])),
    });
  }
  state.activeCases = keep;
  state.caseArchive = state.caseArchive.slice(-20);
}

function resolveCase(state, activeCase, resolution, tone = "resolved") {
  if (activeCase.status === "Resuelto") return;
  activeCase.status = "Resuelto";
  activeCase.statusTone = tone;
  activeCase.resolution = resolution;
  activeCase.displayTurns = 1;
  activeCase.stage = { ...activeCase.stage, current: activeCase.stage.total, label: resolution };
  activeCase.updatedYear = state.year;
}

function updatePreviousValues(activeCase, before) {
  const previousCase = before?.activeCases?.find((entry) => entry.id === activeCase.id);
  for (const metric of activeCase.metrics) {
    const previousMetric = previousCase?.metrics?.find((entry) => entry.id === metric.id);
    metric.previousValue = previousMetric ? previousMetric.value : metric.value;
  }
}

function passiveDisasterUpdate(state, activeCase) {
  const response = metricValue(activeCase, "response");
  const supplies = metricValue(activeCase, "supplies");
  const severity = metricValue(activeCase, "severity");
  const balance = (response + supplies) / 2 - severity;
  applyAdjustments(activeCase, {
    severity: balance >= 0 ? -7 : 5,
    trust: balance >= 0 ? 4 : -5,
    supplies: response >= 58 ? 3 : -2,
  });
  refreshCaseMetrics(activeCase, state);
  addNews(state, activeCase, buildDisasterFollowupNews(state, activeCase, balance >= 0));
}

function resolveDisaster(state, activeCase) {
  const control = caseStrength(activeCase);
  let resolution;
  let tone;
  let nationalEffects;
  let hiddenEffect;
  if (control >= 65) {
    resolution = "Emergencia controlada";
    tone = "favorable";
    nationalEffects = { poverty: -2, socialConflict: -5, investment: 2, security: 2 };
    hiddenEffect = 5;
  } else if (control >= 45) {
    resolution = "Daños contenidos parcialmente";
    tone = "warning";
    nationalEffects = { deficit: 1, socialConflict: -1 };
    hiddenEffect = 1;
  } else {
    resolution = "Secuelas nacionales graves";
    tone = "danger";
    nationalEffects = { poverty: 3, socialConflict: 5, investment: -4, deficit: 2 };
    hiddenEffect = -7;
  }
  for (const [key, delta] of Object.entries(nationalEffects)) state.national[key] = Number(state.national[key] ?? 0) + delta;
  state.hidden.credibility = Number(state.hidden.credibility ?? 0) + hiddenEffect;
  const followupPeriods = Math.max(0, activeCase.turnsActive - 1);
  addNews(state, activeCase, buildDisasterResolutionNews(state, activeCase, tone, followupPeriods));
  resolveCase(state, activeCase, resolution, tone);
}

export function recordCaseDecision(state, { before, event, option, outcome, decisionYear }) {
  if (!state?.activeCases?.length) return;
  archiveExpiredCases(state);
  for (const activeCase of state.activeCases) {
    if (activeCase.status === "Resuelto") continue;
    activeCase.turnsActive += 1;
    if (activeCase.kind === "disaster") {
      const current = Math.min(Number(activeCase.stage?.total ?? 3), Math.max(1, activeCase.turnsActive));
      const labels = { 1: "Respuesta inicial", 2: "Recuperación y secuelas", 3: "Balance de largo plazo" };
      activeCase.stage = { ...activeCase.stage, current, label: labels[current] ?? "Respuesta en curso" };
    }
    refreshCaseMetrics(activeCase, state);
    updatePreviousValues(activeCase, before);
    const related = relatedToCase(activeCase, event);
    if (related) {
      activeCase.originDecision ??= option.label;
      const outcomeDescriptor = caseOutcomeFor(outcome, activeCase);
      const previousCase = before?.activeCases?.find((entry) => entry.id === activeCase.id);
      const crossCaseTrial = activeCase.kind === "trial" && ["prison", "exile"].includes(event.category) && !outcomeDescriptor;
      const crossCaseNews = crossCaseTrial ? buildTrialCrossCaseNews(state, activeCase, previousCase, option.label) : null;
      if (!crossCaseTrial || crossCaseNews) {
        addNews(state, activeCase, crossCaseNews ? { year: decisionYear, ...crossCaseNews } : {
          year: decisionYear,
          headline: outcome.headline ?? event.title,
          text: enrichCaseOutcomeText(state, activeCase, outcome.text ?? "La decisión produce una consecuencia concreta.", `${event.id}-${outcome.id}`),
          causeLabel: `Elegiste: ${option.label}`,
          tone: outcomeDescriptor?.newsTone
            ?? (outcomeDescriptor?.polarity === "favorable" ? "positive" : outcomeDescriptor?.polarity === "adverse" ? "danger" : "neutral"),
        });
      }
    } else if (activeCase.kind === "disaster") {
      passiveDisasterUpdate(state, activeCase);
    } else if (activeCase.kind === "vacancy" && state.tags.includes("presidente-actual")) {
      const previousRisk = Number(before?.hidden?.vacancyRisk ?? state.hidden.vacancyRisk);
      const riskChange = Number(state.hidden.vacancyRisk) - previousRisk;
      if (Math.abs(riskChange) >= 6) {
        addNews(state, activeCase, { year: decisionYear, ...buildVacancyShiftNews(state, activeCase, { riskChange, optionLabel: option.label }) });
      }
    }

    const caseOutcome = caseOutcomeFor(outcome, activeCase);
    if (caseOutcome?.close) {
      const resolutionTone = caseOutcome.resolutionTone
        ?? (caseOutcome.polarity === "adverse" ? "danger" : caseOutcome.polarity === "favorable" ? "favorable" : "warning");
      resolveCase(state, activeCase, caseOutcome.resolution ?? "Expediente concluido", resolutionTone);
      continue;
    }
    if (activeCase.kind === "prison" && state.tags.includes("en-prision") && state.tags.includes("condena-final")) {
      activeCase.stage = { current: 3, total: 3, label: "Condena firme" };
      activeCase.statusTone = "danger";
    }
    if (activeCase.kind === "trial" && state.tags.includes("caso-principal-cerrado")) {
      resolveCase(state, activeCase, caseOutcome?.resolution ?? "Expediente cerrado", state.tags.includes("absuelto") ? "favorable" : "warning");
    } else if (activeCase.kind === "campaign" && !state.tags.includes("en-campana-presidencial")) {
      resolveCase(state, activeCase, caseOutcome?.resolution ?? "Campaña concluida", state.tags.includes("presidente-actual") ? "favorable" : "warning");
    } else if (activeCase.kind === "vacancy" && !state.tags.includes("presidente-actual")) {
      const removedByCongress = state.tags.includes("fue-vacado");
      if (!removedByCongress) {
        addNews(state, activeCase, {
          year: decisionYear,
          headline: "El mandato termina y la amenaza queda sin objeto",
          text: "El cambio constitucional de mando cierra el conteo de vacancia sin una destitución parlamentaria.",
          causeLabel: event.id === "eleccion-nacional" ? "Fin del mandato y transferencia de poder" : "Salida constitucional del gobierno",
          tone: "neutral",
        });
      }
      resolveCase(state, activeCase, removedByCongress ? "Vacancia aprobada" : "Mandato concluido", removedByCongress ? "danger" : "neutral");
    } else if (activeCase.kind === "vacancy" && event.id !== "mocion-vacancia" && activeCase.turnsActive >= 2 && Number(state.hidden.vacancyRisk) < 45) {
      addNews(state, activeCase, { headline: "Las bancadas enfrían la vacancia", text: "El conteo deja de alcanzar el umbral y la amenaza pierde fuerza.", causeLabel: "Cambio acumulado en Congreso y gabinete", tone: "positive" });
      resolveCase(state, activeCase, "Amenaza parlamentaria contenida", "favorable");
    } else if (activeCase.kind === "prison" && !state.tags.includes("en-prision")) {
      resolveCase(state, activeCase, caseOutcome?.resolution ?? "Fin de la custodia", "favorable");
    } else if (activeCase.kind === "exile" && !state.tags.includes("en-exilio")) {
      resolveCase(state, activeCase, caseOutcome?.resolution ?? "Fin del exilio", "favorable");
    } else if (activeCase.kind === "disaster" && activeCase.turnsActive >= 3) {
      resolveDisaster(state, activeCase);
    }
  }
  sortCases(state);
}

export function finalizeActiveCases(state) {
  if (!state?.activeCases) return;
  const closingResolution = {
    trial: "Caso pendiente al cierre",
    campaign: "Campaña sin nueva votación",
    vacancy: "Conteo pendiente al cierre",
    prison: "Situación penitenciaria al cierre",
    exile: "Exilio al cierre de la trayectoria",
  };
  const closingStatus = {
    trial: "Pendiente al cierre",
    campaign: "Sin nueva votación",
    vacancy: "Pendiente al cierre",
    prison: "Vigente al cierre",
    exile: "Vigente al cierre",
  };
  for (const activeCase of state.activeCases) {
    if (activeCase.status === "Resuelto") continue;
    if (activeCase.kind === "disaster") resolveDisaster(state, activeCase);
    else {
      const resolution = closingResolution[activeCase.kind] ?? "Balance al cierre";
      const closingNews = buildCaseCareerCloseNews(state, activeCase);
      if (closingNews) addNews(state, activeCase, closingNews);
      const resolutionTone = closingNews?.tone === "positive" ? "favorable" : closingNews?.tone ?? "neutral";
      resolveCase(state, activeCase, resolution, resolutionTone);
      activeCase.status = closingStatus[activeCase.kind] ?? "Cerrado con la trayectoria";
    }
  }
}

export function buildCaseChanges(before, after) {
  const beforeCases = before?.activeCases ?? [];
  const afterCases = after?.activeCases ?? [];
  return {
    opened: afterCases.filter((entry) => !beforeCases.some((old) => old.id === entry.id)).map((entry) => ({ id: entry.id, title: entry.title })),
    updated: afterCases.filter((entry) => {
      const old = beforeCases.find((item) => item.id === entry.id);
      return old && old.lastNewsId !== entry.lastNewsId;
    }).map((entry) => ({ id: entry.id, title: entry.title, status: entry.status })),
    resolved: afterCases.filter((entry) => entry.status === "Resuelto" && beforeCases.find((old) => old.id === entry.id)?.status !== "Resuelto").map((entry) => ({ id: entry.id, title: entry.title, resolution: entry.resolution })),
  };
}

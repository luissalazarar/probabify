import {
  CASE_METRIC_BRIEFS,
  CASE_NEWS_BANKS,
  DISASTER_VARIANT_COPY,
  ENDING_NARRATIVE_BANKS,
} from "../data/narrativeBanks.js";

const CASE_PRIORITY = { prison: 30, exile: 27, trial: 24, disaster: 22, vacancy: 20 };
const NATIONAL_ROLE = /^(?:ex)?(?:presidente del perú|vicepresidente del perú|premier|ministro de estado|congresista|diputad[oa] de la república|senador(?:a)? de la república|presidente del congreso|embajador)$/i;
const TERRITORIAL_ROLE = /^(?:ex)?(?:gobernador regional|alcalde|regidor distrital)$/i;

function hashText(value) {
  let hash = 2166136261;
  for (const character of String(value ?? "")) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function pathKey(state, scope = "narrative") {
  const decisions = Array.isArray(state?.decisions) ? state.decisions.join("|") : "";
  const outcomes = Array.isArray(state?.outcomes) ? state.outcomes.join("|") : "";
  return `${state?.seed ?? "local"}|${state?.originId ?? ""}|${state?.backgroundId ?? ""}|${state?.endingId ?? ""}|${decisions}|${outcomes}|${scope}`;
}

export function pickNarrative(items, state, scope, usedHeadlines = []) {
  if (!Array.isArray(items) || !items.length) return null;
  const used = new Set(usedHeadlines.map((item) => String(item ?? "").trim().toLowerCase()));
  const start = hashText(pathKey(state, scope)) % items.length;
  for (let offset = 0; offset < items.length; offset += 1) {
    const item = items[(start + offset) % items.length];
    const headline = typeof item === "object" ? item.headline : item;
    if (!used.has(String(headline ?? "").trim().toLowerCase())) return item;
  }
  return items[start];
}

export function fillNarrative(template, values = {}) {
  return String(template ?? "")
    .replace(/\{([a-zA-Z0-9_]+)\}/g, (_match, key) => values[key] ?? "")
    .replace(/\s+([,.;:])/g, "$1")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function formatMoney(value) {
  return `S/ ${Math.round(Math.max(0, Number(value) || 0)).toLocaleString("es-PE")}`;
}

function uniqueLabels(items = []) {
  const labels = [];
  const seen = new Set();
  for (const item of items) {
    const label = String(typeof item === "string" ? item : item?.label ?? item?.name ?? "").trim();
    const key = label.toLocaleLowerCase("es-PE");
    if (!label || seen.has(key)) continue;
    seen.add(key);
    labels.push(label);
  }
  return labels;
}

export function collectNarrativeAllies(snapshot) {
  const relationAllies = Object.entries(snapshot?.relations ?? {})
    .filter(([, relation]) => Number(relation?.score ?? 0) >= 60)
    .map(([name]) => name);
  return uniqueLabels([...relationAllies, ...(snapshot?.memory?.allies ?? [])]);
}

export function collectNarrativeEnemies(snapshot) {
  const relationEnemies = Object.entries(snapshot?.relations ?? {})
    .filter(([, relation]) => Number(relation?.score ?? 0) <= -20)
    .map(([name]) => name);
  return uniqueLabels([...(snapshot?.memory?.enemies ?? []), ...relationEnemies]);
}

function careerBand(snapshot) {
  if (snapshot.tags?.includes("fue-presidente") || Number(snapshot.elections?.won ?? 0) > 0) return "presidency";
  const careerRoles = [...(snapshot.career ?? []).map((entry) => entry.role), snapshot.highestRole, snapshot.role].filter(Boolean);
  if (careerRoles.some((role) => NATIONAL_ROLE.test(role)) || snapshot.tags?.some((tag) => ["fue-ministro", "fue-congresista", "fue-vicepresidente"].includes(tag))) return "national";
  if (careerRoles.some((role) => TERRITORIAL_ROLE.test(role)) || snapshot.tags?.some((tag) => ["fue-alcalde", "fue-gobernador"].includes(tag))) return "territorial";
  if (Number(snapshot.yearsInPublicOffice ?? 0) >= 8) return "service";
  return "outsider";
}

function electionBand(snapshot) {
  const wins = Number(snapshot.elections?.won ?? 0);
  const losses = Number(snapshot.elections?.lost ?? 0);
  const runs = Number(snapshot.presidentialRuns ?? wins + losses);
  if (wins >= 2) return "repeatWinner";
  if (wins === 1) return "winner";
  if (runs >= 3) return "persistent";
  if (runs > 0 || losses > 0) return "defeated";
  return null;
}

function recordBand(snapshot) {
  const scandals = snapshot.memory?.scandals?.length ?? 0;
  const investigations = snapshot.memory?.investigations?.length ?? 0;
  const legalRisk = Number(snapshot.stats?.legalRisk ?? 0);
  const cleanMoney = Math.max(0, Number(snapshot.stats?.cleanMoney ?? 0));
  const dirtyMoney = Math.max(0, Number(snapshot.stats?.dirtyMoney ?? 0));
  const legalCases = [...(snapshot.caseArchive ?? []), ...(snapshot.activeCases ?? [])]
    .filter((entry) => ["trial", "prison", "exile"].includes(entry?.kind));
  const legalResolutions = legalCases.map((entry) => String(entry.resolution ?? entry.status ?? "").toLocaleLowerCase("es-PE"));
  const allLegalCasesClosedFavorably = legalCases.length > 0 && legalResolutions.every((resolution) => /archivad|absolu|acuerdo fiscal|colaboración homologada|caso cerrado|retorno con garantías|apelación concedida|libertad vigilada/.test(resolution));
  if (snapshot.tags?.includes("en-prision") || snapshot.endingId === "prision") return "prison";
  if (snapshot.tags?.includes("en-exilio")) return "exile";
  if (legalRisk >= 65 || investigations >= 3 && legalRisk >= 45) return "severeLegal";
  if (scandals >= 3) return "scandalHeavy";
  if (dirtyMoney >= 50000 && dirtyMoney > cleanMoney * 0.35) return "opaqueMoney";
  if (legalCases.length) return allLegalCasesClosedFavorably ? "resolvedLegal" : "legalCase";
  if (legalRisk <= 25 && scandals === 0 && dirtyMoney <= 10000) return "cleanRecord";
  return scandals + investigations > 0 ? "mixed" : "legalOnly";
}

function baseBand(snapshot) {
  const hidden = snapshot.hidden ?? {};
  const candidates = [
    ["regional", Number(hidden.regionalSupport ?? 0)],
    ["international", Number(hidden.internationalReputation ?? 0)],
    ["media", Number(hidden.mediaNotoriety ?? 0)],
    ["party", Number(hidden.partyCohesion ?? 0)],
    ["business", Number(hidden.businessSupport ?? 0)],
    ["union", Number(hidden.unionSupport ?? 0)],
    ["popular", Number(snapshot.stats?.approval ?? 0)],
    ["institutional", Number(hidden.credibility ?? 0)],
  ].sort((left, right) => right[1] - left[1]);
  return candidates[0]?.[1] >= 60 ? candidates[0] : ["fragile", candidates[0]?.[1] ?? 0];
}

function hasFamilyStrain(snapshot) { return Number(snapshot.hidden?.familyStress ?? 0) >= 72; }

function mainSpecialCase(snapshot) {
  const cases = [...(snapshot.caseArchive ?? []), ...(snapshot.activeCases ?? [])];
  const currentYear = Number(snapshot.year ?? 0);
  const importance = (entry) => {
    const resolution = String(entry.resolution ?? entry.status ?? "").toLocaleLowerCase("es-PE");
    const tone = String(entry.lastNewsTone ?? entry.statusTone ?? "").toLocaleLowerCase("es-PE");
    const resolvedYear = Number(entry.resolvedYear ?? entry.updatedYear ?? entry.startedYear ?? currentYear);
    const recency = Math.max(0, 28 - Math.max(0, currentYear - resolvedYear));
    const severe = /secuela.*grave|condena|prisión|vacancia aprobada|exilio al cierre|penitenciaria al cierre/.test(resolution) ? 58 : 0;
    const pending = /pendiente|sin nueva votación|al cierre/.test(resolution) ? 34 : 0;
    const favorable = /victoria|controlada|archivad|absolu|acuerdo fiscal|garantías|concedida/.test(resolution) ? 14 : 0;
    const toneWeight = tone === "danger" ? 18 : tone === "positive" || tone === "favorable" ? 7 : 0;
    return (CASE_PRIORITY[entry.kind] ?? 0) + severe + pending + favorable + toneWeight + recency;
  };
  return cases
    .filter((entry) => entry?.kind !== "campaign" && entry?.title && (entry.resolution || entry.status))
    .sort((left, right) => importance(right) - importance(left)
      || Number(right.resolvedYear ?? right.updatedYear ?? 0) - Number(left.resolvedYear ?? left.updatedYear ?? 0))[0] ?? null;
}

function lowerInitial(value) {
  const text = String(value ?? "");
  return text ? `${text[0].toLocaleLowerCase("es-PE")}${text.slice(1)}` : text;
}

function endingValues(snapshot) {
  const scandals = snapshot.memory?.scandals?.length ?? 0;
  const investigations = snapshot.memory?.investigations?.length ?? 0;
  const wins = Number(snapshot.elections?.won ?? 0);
  const losses = Number(snapshot.elections?.lost ?? 0);
  const runs = Math.max(Number(snapshot.presidentialRuns ?? 0), wins + losses);
  const [baseType, baseValue] = baseBand(snapshot);
  return {
    values: {
      name: snapshot.characterName ?? "El personaje",
      background: snapshot.backgroundName ?? "su antecedente inicial",
      highestRole: lowerInitial(snapshot.highestRole ?? snapshot.role ?? "figura política"),
      years: Math.max(0, Number(snapshot.yearsInPublicOffice ?? 0)),
      yearNoun: Number(snapshot.yearsInPublicOffice ?? 0) === 1 ? "año" : "años",
      wins,
      losses,
      runs,
      runNoun: runs === 1 ? "vez" : "veces",
      attemptNoun: runs === 1 ? "intento" : "intentos",
      lossNoun: losses === 1 ? "derrota presidencial" : "derrotas presidenciales",
      scandals,
      scandalPlural: scandals === 1 ? "" : "s",
      investigations,
      investigationNoun: investigations === 1 ? "investigación" : "investigaciones",
      legalRisk: Math.round(Number(snapshot.stats?.legalRisk ?? 0)),
      dirtyMoney: formatMoney(snapshot.stats?.dirtyMoney),
      cleanMoney: formatMoney(snapshot.stats?.cleanMoney),
      baseValue: Math.round(baseValue),
      familyStress: Math.round(Number(snapshot.hidden?.familyStress ?? 0)),
    },
    baseType,
  };
}

function pickText(bank, snapshot, scope, values) {
  return fillNarrative(pickNarrative(bank, snapshot, scope), values);
}

export function buildEndingNarrative(snapshot, _legacy) {
  const { values, baseType } = endingValues(snapshot);
  const sections = [];
  const hasSpecificBackground = snapshot.backgroundId && snapshot.backgroundName && snapshot.backgroundName !== "Trayectoria original";
  const originBank = hasSpecificBackground
    ? ENDING_NARRATIVE_BANKS.origins[snapshot.originId] ?? ENDING_NARRATIVE_BANKS.origins.default
    : ENDING_NARRATIVE_BANKS.origins.default.filter((template) => !template.includes("{background}"));
  sections.push(pickText(originBank, snapshot, "ending-origin", values));

  const originLegacyTag = Object.keys(ENDING_NARRATIVE_BANKS.originLegacies).find((tag) => snapshot.tags?.includes(tag));

  const career = careerBand(snapshot);
  const completeCareerBank = ENDING_NARRATIVE_BANKS.careers[career];
  const careerBank = values.years === 0
    ? completeCareerBank.filter((template) => !template.includes("{years}"))
    : completeCareerBank;
  sections.push(pickText(careerBank.length ? careerBank : completeCareerBank, snapshot, `ending-career-${career}`, values));

  const election = electionBand(snapshot);
  if (election) {
    const electionBank = values.losses === 0
      ? ENDING_NARRATIVE_BANKS.elections[election].filter((template) => !template.includes("{losses}"))
      : ENDING_NARRATIVE_BANKS.elections[election];
    sections.push(pickText(electionBank, snapshot, `ending-election-${election}`, values));
  }

  const specialCase = mainSpecialCase(snapshot);
  if (originLegacyTag) sections.push(pickText(ENDING_NARRATIVE_BANKS.originLegacies[originLegacyTag], snapshot, `ending-${originLegacyTag}`, values));
  if (specialCase) {
    const caseValues = {
      ...values,
      caseTitle: specialCase.title,
      caseResolution: specialCase.resolution ?? specialCase.status,
    };
    const pending = /pendiente|sin nueva votación|al cierre/i.test(String(specialCase.resolution ?? specialCase.status ?? ""));
    const caseBank = pending ? ENDING_NARRATIVE_BANKS.pendingCases : ENDING_NARRATIVE_BANKS.cases;
    let caseText = pickText(caseBank, snapshot, `ending-case-${specialCase.id}`, caseValues);
    if (specialCase.originDecision) caseText += ` La primera decisión vinculada al caso fue «${specialCase.originDecision}».`;
    sections.push(caseText);
  } else {
    const record = recordBand(snapshot);
    let recordBank = ENDING_NARRATIVE_BANKS.records[record];
    if (record === "mixed" && values.scandals === 0) recordBank = recordBank.filter((template) => !template.includes("{scandals}"));
    if (record === "mixed" && values.investigations === 0) recordBank = recordBank.filter((template) => !template.includes("{investigations}"));
    sections.push(pickText(recordBank, snapshot, `ending-record-${record}`, values));
  }

  if (hasFamilyStrain(snapshot)) sections.push(pickText(ENDING_NARRATIVE_BANKS.relations.family, snapshot, "ending-relations-family", values));
  else sections.push(pickText(ENDING_NARRATIVE_BANKS.bases[baseType], snapshot, `ending-base-${baseType}`, values));
  return sections.filter(Boolean).join(" ");
}

function metricFavorability(metric) {
  const value = Math.max(0, Math.min(100, Number(metric?.value ?? 50)));
  return metric?.direction === "low" ? 100 - value : value;
}

export function casePerformance(activeCase) {
  const metrics = activeCase?.metrics ?? [];
  if (!metrics.length) return 50;
  return metrics.reduce((sum, metric) => sum + metricFavorability(metric), 0) / metrics.length;
}

export function buildCaseMetricBrief(state, activeCase, scope = "status", preferredTone = null) {
  const metrics = (activeCase?.metrics ?? []).map((metric) => ({ metric, score: metricFavorability(metric) }));
  if (!metrics.length) return "";
  const weakest = [...metrics].sort((left, right) => left.score - right.score)[0];
  const strongest = [...metrics].sort((left, right) => right.score - left.score)[0];
  const selected = preferredTone === "positive"
    ? (strongest.score >= 55 ? { ...strongest, tone: "positive" } : null)
    : preferredTone === "danger"
      ? (weakest.score <= 45 ? { ...weakest, tone: "danger" } : null)
      : weakest.score <= 40 ? { ...weakest, tone: "danger" }
        : strongest.score >= 64 ? { ...strongest, tone: "positive" }
          : null;
  if (!selected) return "";
  const bank = CASE_METRIC_BRIEFS[activeCase.kind]?.[selected.metric.id]?.[selected.tone];
  if (!bank?.length) return "";
  const previousValue = selected.metric.previousValue;
  const previousScore = previousValue == null ? null : metricFavorability({ ...selected.metric, value: previousValue });
  const crossedBand = previousScore == null
    || selected.tone === "danger" && previousScore > 40
    || selected.tone === "positive" && previousScore < 64;
  const changedEnough = previousScore == null || Math.abs(selected.score - previousScore) >= 5;
  if ((activeCase.news?.length ?? 0) > 1 && !crossedBand && !changedEnough && !preferredTone) return "";
  activeCase.usedBriefs ??= [];
  const usedBriefs = new Set(activeCase.usedBriefs.map((brief) => String(brief).toLocaleLowerCase("es-PE")));
  const usedTexts = (activeCase.news ?? []).map((entry) => String(entry.text ?? "").toLocaleLowerCase("es-PE"));
  const unusedBank = bank.filter((template) => {
    const rendered = fillNarrative(template, {}).toLocaleLowerCase("es-PE");
    return !usedBriefs.has(rendered) && !usedTexts.some((text) => text.includes(rendered));
  });
  if (!unusedBank.length) return "";
  const brief = pickText(unusedBank, state, `${activeCase.id}-${scope}-${selected.metric.id}-${selected.tone}`, {});
  if (brief) activeCase.usedBriefs.push(brief);
  return brief;
}

function appendBrief(text, brief) {
  const base = String(text ?? "").trim();
  if (!brief || base.toLocaleLowerCase("es-PE").includes(brief.toLocaleLowerCase("es-PE"))) return base;
  return `${base}${/[.!?]$/.test(base) ? "" : "."} ${brief}`.trim();
}

function emergencyActor(state) {
  if (state.tags?.includes("presidente-actual")) return "El gabinete, las regiones y los equipos de emergencia";
  if (TERRITORIAL_ROLE.test(state.role ?? "") || state.originId === "provincia") return "Municipios, comunidades y brigadas locales";
  if (NATIONAL_ROLE.test(state.role ?? "")) return "Las autoridades nacionales y los equipos regionales";
  if (state.originId === "podcaster") return "La cobertura pública, la ciudadanía y las autoridades";
  if (state.originId === "empresario") return "Las redes privadas, los municipios y las brigadas";
  return "Las autoridades, las comunidades y las redes movilizadas";
}

function caseNewsValues(state, activeCase, values = {}) {
  return {
    title: activeCase.title,
    decision: activeCase.originDecision ?? "la medida inicial",
    option: values.option ?? activeCase.originDecision ?? "la última decisión",
    risk: Math.round(Number(state.hidden?.vacancyRisk ?? 0)),
    actor: emergencyActor(state),
    ...values,
  };
}

function usedCaseHeadlines(activeCase) {
  return (activeCase.news ?? []).map((entry) => entry.headline);
}

function usedCaseTexts(activeCase) {
  return (activeCase.news ?? []).map((entry) => entry.text);
}

export function buildCaseOpeningNews(state, activeCase, kind) {
  let bank = CASE_NEWS_BANKS.openings[kind];
  if (kind === "campaign") {
    bank = snapshotWasPresident(state) ? CASE_NEWS_BANKS.openings.campaignReturn
      : Number(state.presidentialRuns ?? 0) > 1 ? CASE_NEWS_BANKS.openings.campaignRepeat
        : CASE_NEWS_BANKS.openings.campaignFirst;
  }
  const entry = pickNarrative(bank, state, `${activeCase.id}-opening`, usedCaseHeadlines(activeCase));
  if (!entry) return null;
  return {
    headline: fillNarrative(entry.headline, caseNewsValues(state, activeCase)),
    text: fillNarrative(entry.text, caseNewsValues(state, activeCase)),
    causeLabel: "Situación al abrirse el expediente",
    tone: kind === "prison" ? "danger" : "warning",
  };
}

function snapshotWasPresident(state) {
  return state.tags?.includes("fue-presidente") || Number(state.elections?.won ?? 0) > 0;
}

export function buildDisasterFollowupNews(state, activeCase, positive) {
  const tone = positive ? "positive" : "danger";
  const entry = pickNarrative(CASE_NEWS_BANKS.disasterFollowup[tone], state, `${activeCase.id}-followup-${activeCase.turnsActive}`, usedCaseHeadlines(activeCase));
  const variantHeadlines = DISASTER_VARIANT_COPY[activeCase.variant]?.followupHeadlines?.[tone];
  const variantHeadline = pickNarrative(variantHeadlines, state, `${activeCase.id}-variant-headline-${activeCase.turnsActive}`, usedCaseHeadlines(activeCase));
  const variantBank = DISASTER_VARIANT_COPY[activeCase.variant]?.followup?.[tone];
  const variantText = pickNarrative(variantBank, state, `${activeCase.id}-variant-followup-${activeCase.turnsActive}`, usedCaseTexts(activeCase));
  const values = caseNewsValues(state, activeCase);
  return {
    headline: fillNarrative(variantHeadline ?? entry?.headline ?? activeCase.title, values),
    text: fillNarrative(variantText ?? entry?.text, values),
    causeLabel: `Seguimiento de: ${activeCase.originDecision ?? "respuesta inicial"}`,
    tone,
  };
}

export function buildDisasterResolutionNews(state, activeCase, band, followupPeriods) {
  const bank = CASE_NEWS_BANKS.disasterResolution[band];
  const entry = pickNarrative(bank, state, `${activeCase.id}-resolution-${band}`, usedCaseHeadlines(activeCase));
  const variantBank = DISASTER_VARIANT_COPY[activeCase.variant]?.resolution?.[band];
  const variantText = pickNarrative(variantBank, state, `${activeCase.id}-variant-resolution-${band}`);
  const values = caseNewsValues(state, activeCase);
  return {
    headline: fillNarrative(entry?.headline ?? `${activeCase.title}: balance final`, values),
    text: fillNarrative(variantText ?? entry?.text, values),
    causeLabel: followupPeriods === 0
      ? `Balance de: ${activeCase.originDecision ?? "respuesta inicial"}`
      : `Balance de la medida inicial y ${followupPeriods} periodo${followupPeriods === 1 ? "" : "s"} de seguimiento`,
    tone: band,
  };
}

export function buildVacancyShiftNews(state, activeCase, { riskChange, optionLabel }) {
  const tone = riskChange < 0 ? "positive" : "danger";
  const entry = pickNarrative(CASE_NEWS_BANKS.vacancyShift[tone], state, `${activeCase.id}-shift-${activeCase.turnsActive}-${Math.round(riskChange)}`, usedCaseHeadlines(activeCase));
  const values = caseNewsValues(state, activeCase, { option: optionLabel });
  return {
    headline: fillNarrative(entry?.headline, values),
    text: appendBrief(fillNarrative(entry?.text, values), buildCaseMetricBrief(state, activeCase, `shift-${activeCase.turnsActive}`)),
    causeLabel: `Efecto parlamentario de: ${optionLabel}`,
    tone,
  };
}

export function buildTrialCrossCaseNews(state, activeCase, beforeCase, optionLabel) {
  if (!beforeCase) return null;
  const change = casePerformance(activeCase) - casePerformance(beforeCase);
  if (Math.abs(change) < 1) return null;
  const tone = change >= 3 ? "positive" : change <= -3 ? "danger" : "neutral";
  const entry = pickNarrative(CASE_NEWS_BANKS.trialCrossCase[tone], state, `${activeCase.id}-cross-${activeCase.turnsActive}-${optionLabel}`, usedCaseHeadlines(activeCase));
  const values = caseNewsValues(state, activeCase, { option: optionLabel });
  return {
    headline: fillNarrative(entry?.headline, values),
    text: appendBrief(fillNarrative(entry?.text, values), buildCaseMetricBrief(state, activeCase, `cross-${activeCase.turnsActive}`)),
    causeLabel: `Consecuencia judicial de: ${optionLabel}`,
    tone,
  };
}

export function buildCaseCareerCloseNews(state, activeCase) {
  const performance = casePerformance(activeCase);
  const scores = (activeCase.metrics ?? []).map(metricFavorability);
  const weakest = scores.length ? Math.min(...scores) : performance;
  const band = performance >= 63 && weakest >= 42 ? "positive" : performance <= 38 ? "danger" : "warning";
  const entry = pickNarrative(CASE_NEWS_BANKS.finalCases[activeCase.kind]?.[band], state, `${activeCase.id}-career-close-${band}`, usedCaseHeadlines(activeCase));
  if (!entry) return null;
  const values = caseNewsValues(state, activeCase);
  const brief = band === "warning" ? "" : buildCaseMetricBrief(state, activeCase, "career-close", band);
  return {
    headline: fillNarrative(entry.headline, values),
    text: appendBrief(fillNarrative(entry.text, values), brief),
    causeLabel: activeCase.originDecision ? `Balance final de: ${activeCase.originDecision}` : "Situación al final de la carrera",
    tone: band === "positive" ? "positive" : band,
  };
}

export function enrichCaseOutcomeText(state, activeCase, text, scope) {
  return appendBrief(text, buildCaseMetricBrief(state, activeCase, scope));
}

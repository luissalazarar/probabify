const eventWeightModifiers = {
  "seguridad-ciudadana": [
    { when: { national: "security", max: 50 }, multiply: 1.8 },
    { when: { national: "socialConflict", min: 65 }, multiply: 1.2 },
  ],
  "crisis-presidencial": [
    { when: { hidden: "governmentStability", max: 42 }, multiply: 1.8 },
    { when: { hidden: "vacancyRisk", min: 55 }, multiply: 1.45 },
    { when: { national: "socialConflict", min: 65 }, multiply: 1.35 },
    { when: { national: "investment", max: 35 }, multiply: 1.15 },
  ],
  "reforma-economica": [
    { when: { national: "growth", max: 0 }, multiply: 1.65 },
    { when: { national: "inflation", min: 9 }, multiply: 1.5 },
    { when: { national: "unemployment", min: 11 }, multiply: 1.3 },
    { when: { national: "poverty", min: 32 }, multiply: 1.2 },
    { when: { national: "investment", max: 35 }, multiply: 1.15 },
    { when: { national: "deficit", min: 7 }, multiply: 1.15 },
    { when: { national: "debt", min: 55 }, multiply: 1.12 },
  ],
  "conflicto-docente": [
    { when: { hidden: "unionSupport", min: 65 }, multiply: 1.2 },
    { when: { national: "socialConflict", min: 60 }, multiply: 1.2 },
  ],
  "proyecto-minero": [
    { when: { national: "investment", max: 35 }, multiply: 1.2 },
    { when: { national: "socialConflict", min: 65 }, multiply: 1.2 },
  ],
};

const outcomeWeightModifiers = {
  "victoria-primera-vuelta": [
    { when: { stat: "cleanMoney", min: 60000 }, multiply: 1.12 },
    { when: { hidden: "urbanApproval", min: 65 }, multiply: 1.12 },
    { when: { hidden: "ruralApproval", min: 65 }, multiply: 1.12 },
    { when: { hidden: "pressSupport", min: 65 }, multiply: 1.1 },
    { when: { hidden: "personalReputation", min: 65 }, multiply: 1.1 },
    { when: { all: [{ hidden: "businessSupport", min: 55 }, { hidden: "unionSupport", min: 55 }] }, multiply: 1.1 },
    { when: { hidden: "internationalReputation", min: 70 }, multiply: 1.05 },
    { when: { all: [{ national: "security", max: 40 }, { stat: "ideology", min: 25 }] }, multiply: 1.12 },
    { when: { all: [{ national: "poverty", min: 34 }, { stat: "ideology", max: -20 }] }, multiply: 1.12 },
  ],
  "pase-segunda-vuelta": [
    { when: { stat: "cleanMoney", min: 30000 }, multiply: 1.08 },
    { when: { hidden: "mediaNotoriety", min: 60 }, multiply: 1.12 },
    { when: { hidden: "credibility", min: 60 }, multiply: 1.12 },
    { when: { hidden: "partyCohesion", min: 60 }, multiply: 1.1 },
  ],
  "derrota-amplia-presidencial": [
    { when: { stat: "cleanMoney", max: 10000 }, multiply: 1.2 },
    { when: { hidden: "urbanApproval", max: 35 }, multiply: 1.15 },
    { when: { hidden: "ruralApproval", max: 35 }, multiply: 1.15 },
    { when: { hidden: "pressSupport", max: 35 }, multiply: 1.12 },
    { when: { hidden: "personalReputation", max: 35 }, multiply: 1.12 },
    { when: { hidden: "businessSupport", max: 30 }, multiply: 1.08 },
    { when: { hidden: "unionSupport", max: 30 }, multiply: 1.08 },
  ],
  "exclusion-candidatura": [
    { when: { stat: "dirtyMoney", min: 60000 }, multiply: 1.3 },
    { when: { hidden: "undeclaredWealth", min: 30000 }, multiply: 1.7 },
    { when: { hidden: "leakExposure", min: 60 }, multiply: 1.5 },
    { when: { hidden: "prosecutionRelation", max: 35 }, multiply: 1.25 },
    { when: { hidden: "judiciaryRelation", max: 35 }, multiply: 1.2 },
  ],
  "victoria-ajustada": [
    { when: { hidden: "urbanApproval", min: 55 }, multiply: 1.1 },
    { when: { hidden: "ruralApproval", min: 55 }, multiply: 1.1 },
    { when: { hidden: "pressSupport", min: 55 }, multiply: 1.08 },
    { when: { hidden: "credibility", min: 60 }, multiply: 1.1 },
    { when: { hidden: "personalReputation", min: 60 }, multiply: 1.08 },
    { when: { hidden: "internationalReputation", min: 60 }, multiply: 1.05 },
    { when: { all: [{ hidden: "businessSupport", min: 50 }, { hidden: "unionSupport", min: 50 }] }, multiply: 1.12 },
  ],
  "derrota-ajustada-alianza": [
    { when: { hidden: "pressSupport", max: 35 }, multiply: 1.12 },
    { when: { hidden: "credibility", max: 38 }, multiply: 1.15 },
    { when: { hidden: "partyCohesion", max: 35 }, multiply: 1.12 },
  ],
  "victoria-base": [
    { when: { hidden: "partyCohesion", min: 65 }, multiply: 1.15 },
    { when: { hidden: "unionSupport", min: 60 }, multiply: 1.08 },
    { when: { hidden: "ruralApproval", min: 60 }, multiply: 1.1 },
  ],
  "derrota-base": [
    { when: { hidden: "pressSupport", max: 35 }, multiply: 1.1 },
    { when: { hidden: "credibility", max: 38 }, multiply: 1.12 },
    { when: { hidden: "urbanApproval", max: 35 }, multiply: 1.1 },
  ],
  "dialogo-funciona": [
    { when: { hidden: "governmentStability", min: 55 }, multiply: 1.35 },
    { when: { hidden: "unionSupport", min: 55 }, multiply: 1.15 },
  ],
  "dialogo-fracasa": [
    { when: { hidden: "polarization", min: 65 }, multiply: 1.35 },
    { when: { national: "socialConflict", min: 70 }, multiply: 1.25 },
  ],
  "orden-restaurado": [
    { when: { hidden: "armedForcesSupport", min: 60 }, multiply: 1.3 },
    { when: { national: "security", min: 50 }, multiply: 1.1 },
  ],
  "represion-fatal": [
    { when: { hidden: "armedForcesSupport", max: 35 }, multiply: 1.4 },
    { when: { national: "socialConflict", min: 70 }, multiply: 1.3 },
  ],
  "mediacion-exitosa": [
    { when: { hidden: "internationalReputation", min: 60 }, multiply: 1.4 },
  ],
  "mediacion-humillante": [
    { when: { hidden: "internationalReputation", max: 35 }, multiply: 1.4 },
  ],
  "presion-frontera": [
    { when: { hidden: "armedForcesSupport", min: 60 }, multiply: 1.45 },
    { when: { hidden: "governmentStability", min: 55 }, multiply: 1.15 },
  ],
  "conflicto-limitado": [
    { when: { hidden: "armedForcesSupport", max: 42 }, multiply: 1.25 },
    { when: { national: "investment", max: 35 }, multiply: 1.1 },
  ],
  "mandos-desobedecen": [
    { when: { hidden: "armedForcesSupport", max: 35 }, multiply: 3 },
    { when: { hidden: "governmentStability", max: 35 }, multiply: 1.8 },
    { when: { hidden: "cabinetLoyalty", max: 35 }, multiply: 1.3 },
  ],
  "ajuste-estabiliza": [
    { when: { national: "deficit", min: 7 }, multiply: 1.25 },
    { when: { national: "debt", min: 55 }, multiply: 1.2 },
    { when: { hidden: "businessSupport", min: 60 }, multiply: 1.15 },
  ],
  "ajuste-recesivo": [
    { when: { national: "growth", max: 0 }, multiply: 1.35 },
    { when: { national: "unemployment", min: 12 }, multiply: 1.3 },
    { when: { national: "poverty", min: 35 }, multiply: 1.2 },
    { when: { hidden: "unionSupport", max: 35 }, multiply: 1.15 },
  ],
  "programa-reactiva": [
    { when: { national: "unemployment", min: 11 }, multiply: 1.25 },
    { when: { national: "poverty", min: 32 }, multiply: 1.2 },
  ],
  "gasto-desborda": [
    { when: { national: "inflation", min: 9 }, multiply: 1.45 },
    { when: { national: "deficit", min: 7 }, multiply: 1.3 },
    { when: { national: "debt", min: 55 }, multiply: 1.25 },
  ],
  "investigacion-se-acota": [
    { when: { hidden: "prosecutionRelation", min: 60 }, multiply: 1.4 },
    { when: { hidden: "judiciaryRelation", min: 60 }, multiply: 1.15 },
    { when: { hidden: "leakExposure", max: 35 }, multiply: 1.15 },
  ],
  "allanamiento-fiscal": [
    { when: { hidden: "prosecutionRelation", max: 35 }, multiply: 1.35 },
    { when: { hidden: "undeclaredWealth", min: 30000 }, multiply: 1.5 },
    { when: { hidden: "leakExposure", min: 60 }, multiply: 1.4 },
  ],
  "prision-preventiva": [
    { when: { hidden: "judiciaryRelation", max: 35 }, multiply: 1.5 },
    { when: { hidden: "prosecutionRelation", max: 35 }, multiply: 1.25 },
  ],
  "caso-archivado": [
    { when: { hidden: "judiciaryRelation", min: 60 }, multiply: 1.4 },
  ],
  "clip-solvente": [
    { when: { hidden: "pressSupport", min: 60 }, multiply: 1.25 },
    { when: { hidden: "credibility", min: 60 }, multiply: 1.2 },
  ],
  "clip-aburrido": [
    { when: { hidden: "pressSupport", max: 35 }, multiply: 1.2 },
  ],
  "perfil-favorable": [
    { when: { hidden: "pressSupport", min: 60 }, multiply: 1.3 },
    { when: { hidden: "personalReputation", min: 60 }, multiply: 1.15 },
  ],
  "contradiccion-dominical": [
    { when: { hidden: "pressSupport", max: 35 }, multiply: 1.25 },
    { when: { hidden: "leakExposure", min: 60 }, multiply: 1.3 },
  ],
  "vacancia-fracasa-coalicion": [
    { when: { hidden: "cabinetLoyalty", min: 55 }, multiply: 1.15 },
    { when: { hidden: "partyCohesion", min: 55 }, multiply: 1.15 },
  ],
  "coalicion-se-rompe": [
    { when: { hidden: "cabinetLoyalty", max: 35 }, multiply: 1.35 },
    { when: { hidden: "partyCohesion", max: 35 }, multiply: 1.3 },
  ],
  "movilizacion-salva": [
    { when: { hidden: "urbanApproval", min: 60 }, multiply: 1.2 },
    { when: { hidden: "ruralApproval", min: 60 }, multiply: 1.2 },
    { when: { hidden: "personalReputation", min: 60 }, multiply: 1.12 },
  ],
};

export function applyStatCausality(events) {
  const eventIds = new Set(events.map((event) => event.id));
  const outcomeIds = new Set(events.flatMap((event) => event.options.flatMap((option) => option.outcomes ?? [])).map((outcome) => outcome.id));
  const missingEvents = Object.keys(eventWeightModifiers).filter((id) => !eventIds.has(id));
  const missingOutcomes = Object.keys(outcomeWeightModifiers).filter((id) => !outcomeIds.has(id));
  if (missingEvents.length || missingOutcomes.length) {
    throw new Error(`Causalidad desconectada: ${[...missingEvents, ...missingOutcomes].join(", ")}`);
  }
  return events.map((event) => ({
    ...event,
    weightModifiers: [...(event.weightModifiers ?? []), ...(eventWeightModifiers[event.id] ?? [])],
    options: event.options.map((option) => ({
      ...option,
      outcomes: option.outcomes?.map((outcome) => ({
        ...outcome,
        weightModifiers: [...(outcome.weightModifiers ?? []), ...(outcomeWeightModifiers[outcome.id] ?? [])],
      })),
    })),
  }));
}

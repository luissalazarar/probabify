const EVENT_PATCHES = {
  "archivo-subversivo": { weightModifiers: [{ when: { decision: "ocultar-archivo" }, multiply: 2.1 }, { when: { outcome: "sl-testigos" }, multiply: 1.8 }, { when: { outcome: "mrta-sin-acuerdo" }, multiply: 1.5 }] },
  "secreto-familiar": { weightModifiers: [{ when: { outcome: "archivo-reservado-palacio" }, multiply: 1.8 }, { when: { outcome: "votos-del-cuaderno" }, multiply: 1.6 }, { when: { relation: { name: "Octavio del Solar", max: 42 } }, multiply: 1.35 }] },
  "asamblea-comunal": { weightModifiers: [{ when: { outcome: "vecinos-fiscalizan" }, multiply: 1.45 }, { when: { outcome: "obra-inaugurada" }, multiply: 1.55 }, { when: { relation: { name: "Máximo Quispe", max: 45 } }, multiply: 1.5 }] },
  "familiar-contratado": {
    requirements: { all: [{ hidden: "mediaNotoriety", min: 45 }, { any: [{ origin: "dinastia" }, { decision: "pareja-operadora" }, { outcome: "familia-controla-voto" }, { scandal: "favoritismo-pareja" }] }] },
    description: "Una investigación encuentra a una persona de tu entorno en una planilla pública. El contrato lleva la firma de alguien que depende políticamente de ti.",
  },
  "escandalo-pareja": {
    maxOccurrences: 1,
    requirements: { all: [{ hidden: "mediaNotoriety", min: 45 }, { any: [{ decision: "pareja-operadora" }, { outcome: "favoritismo-pareja" }, { scandal: "favoritismo-pareja" }, { hidden: "familyStress", min: 68 }] }] },
    title: "La persona que integraste al equipo aparece en una denuncia",
    description: "Un proveedor asegura que tu pareja o colaborador cercano intervino en una contratación. Los mensajes muestran acceso directo a tus decisiones.",
  },
  "separacion-equipo": {
    requirements: { all: [{ age: { min: 40, max: 60 } }, { hidden: "familyStress", min: 55 }, { any: [{ decision: "pareja-operadora" }, { decision: "declarar-cuenta" }, { decision: "romper-bancada" }, { outcome: "favoritismo-pareja" }] }] },
    title: "Tu familia exige salir de la operación política",
    description: "Años de campañas, llamadas nocturnas y filtraciones agotaron a tu entorno. Debes reducir tu actividad o aceptar una ruptura.",
  },
  "mentor-sucesion": {
    requirements: { all: [{ age: { min: 60 } }, { any: [{ outcome: "mentor-inocente" }, { outcome: "partido-controlado" }, { hidden: "partyCohesion", min: 68 }] }] },
    weightModifiers: [{ when: { personality: "tecnócrata" }, multiply: 1.25 }, { when: { personality: "operador" }, multiply: 1.35 }, { when: { eventCount: { id: "control-partido", min: 2 } }, multiply: 1.4 }],
    title: "La persona que formaste quiere sucederte",
    description: "Una figura criada en tu equipo reclama espacio propio. Puede heredar tu organización, competir contigo o llevarse a tus cuadros.",
  },
  "familiar-candidato": {
    requirements: { all: [{ age: { min: 60 } }, { stat: "influence", min: 35 }, { any: [{ origin: "dinastia" }, { decision: "pareja-operadora" }, { outcome: "familia-controla-voto" }, { scandal: "nepotismo-gabinete" }] }] },
    title: "Un familiar pide heredar tu lugar en la lista",
    description: "La candidatura solicita tu equipo, tus aportantes y el puesto que la organización reservaba para otra persona.",
  },
  "indulto-antiguo-aliado": {
    requirements: { all: [{ age: { min: 62 } }, { any: [{ hasTag: "fue-presidente" }, { hidden: "judiciaryRelation", min: 60 }] }, { any: [{ decision: "defender-mentor" }, { decision: "activar-vieja-red" }, { decision: "administrador-fantasma" }, { decision: "acuerdo-secreto-congreso" }, { scandal: "nepotismo-gabinete" }] }] },
    title: "Un antiguo aliado preso te pide intervenir",
    description: "La persona conoce acuerdos de tus campañas y afirma haber guardado silencio por lealtad. Su abogado pide que uses tus contactos.",
  },
  "patrimonio-inexplicable": {
    weightModifiers: [{ when: { decision: "aliado-paga-vivienda" }, multiply: 1.8 }, { when: { decision: "usar-cuenta" }, multiply: 1.7 }, { when: { decision: "administrador-fantasma" }, multiply: 1.55 }, { when: { scandal: "vivienda-inexplicable" }, multiply: 1.5 }],
    description: "Tu declaración registra inmuebles y transferencias que no encajan con tus ingresos. Fiscalía ya identificó a familiares y socios de las operaciones.",
  },
  "investigacion-avanzada": { weightModifiers: [{ when: { scandal: "cuenta-familiar" }, multiply: 1.35 }, { when: { scandal: "contrato-primer-financista" }, multiply: 1.45 }, { when: { outcome: "financista-investigado-colabora" }, multiply: 1.4 }, { when: { hidden: "prosecutionRelation", max: 28 }, multiply: 1.25 }] },
  "control-partido": { weightModifiers: [{ when: { outcome: "partido-controlado" }, multiply: 1.45 }, { when: { eventCount: { id: "control-partido", min: 1 } }, multiply: 0.65 }, { when: { personality: "operador" }, multiply: 1.25 }] },
  "fundacion-legado": {
    requirements: { all: [{ age: { min: 58 } }, { any: [{ hasTag: "fue-presidente" }, { stat: "influence", min: 50 }, { personality: ["líder internacional", "tecnócrata", "figura mediática"] }] }] },
    title: "Tu equipo propone una fundación con tu nombre",
    description: "Exasesores ofrecen reunir donantes, archivos y formación. Debes elegir entre trabajo público verificable o conservar operadores fuera del partido.",
  },
  "archivo-de-legado": { weightModifiers: [{ when: { decision: "destruir-documentos" }, multiply: 1.8 }, { when: { scandal: "control-canal-publico" }, multiply: 1.3 }, { when: { eventCount: { id: "archivo-de-legado", min: 1 } }, multiply: 0.55 }] },
  "pareja-militante": { description: "Tu pareja empieza a coordinar agenda, equipo y aportantes. Debes mantenerla fuera de la organización o darle un cargo visible." },
  "estrategia-presidencial": { description: "Las encuestas dejan tres caminos: buscar indecisos, movilizar a tu base o centrar la campaña en atacar al sistema." },
  "ano-perfil-bajo": { title: "Este año no tienes cargo ni campaña", description: "No reúnes condiciones para un salto inmediato. Puedes trabajar y recuperar caja limpia o gastar en mantener activa tu organización." },
  "tribunal-internacional": { description: "Una corte regional revisará las medidas que provocaron tu exilio. Puedes concentrarte en el expediente o usar la audiencia como campaña." },
  "memoria-sl": { description: "Familiares de víctimas identifican tu antiguo alias en testimonios y actas. Puedes entregar información verificable o negar toda responsabilidad." },
};

const OPTION_PATCHES = {
  "control-partido": {
    "tomar-partido": { relationEffects: { "Directorio partidario": 14 } },
    "negociar-cuota": { relationEffects: { "Directorio partidario": 5 } },
  },
  "asesoria-expresidente": {
    "asesorar-sucesor": { relationEffects: { "Sucesor presidencial": 16 }, addTags: ["sucesor-aliado"] },
    "controlar-sucesor": { relationEffects: { "Sucesor presidencial": -8 }, addTags: ["influencia-desde-sombras"] },
    "conferencias-expresidente": { relationEffects: { "Sucesor presidencial": 3 } },
  },
};

const OUTCOME_PATCHES = {
  "interna-perdida": { relationEffects: { "Directorio partidario": -18 } },
  "poder-tras-trono": { relationEffects: { "Sucesor presidencial": -6 }, addTags: ["poder-tras-trono"] },
  "sucesor-rompe-expresidente": { relationEffects: { "Sucesor presidencial": -24 }, addTags: ["sucesor-enemigo"] },
  "prision-preventiva": { weightModifiers: [{ when: { hidden: "prosecutionRelation", max: 35 }, multiply: 1.45 }, { when: { hidden: "judiciaryRelation", max: 35 }, multiply: 1.35 }] },
  "caso-archivado": { weightModifiers: [{ when: { hidden: "prosecutionRelation", min: 62 }, multiply: 1.4 }, { when: { hidden: "judiciaryRelation", min: 62 }, multiply: 1.25 }] },
  "ministro-cuestionado": { weightModifiers: [{ when: { hidden: "cabinetLoyalty", max: 42 }, multiply: 1.45 }, { when: { hidden: "leakExposure", min: 58 }, multiply: 1.35 }] },
  "amigo-filtra": { weightModifiers: [{ when: { hidden: "cabinetLoyalty", max: 45 }, multiply: 1.55 }, { when: { hidden: "familyStress", min: 60 }, multiply: 1.25 }] },
  "coalicion-se-rompe": { weightModifiers: [{ when: { hidden: "cabinetLoyalty", max: 38 }, multiply: 1.45 }, { when: { scandal: "ministro-cuestionado" }, multiply: 1.25 }] },
  "confianza-negada": { weightModifiers: [{ when: { hidden: "cabinetLoyalty", max: 40 }, multiply: 1.35 }] },
  "censura-aprobada": { weightModifiers: [{ when: { hidden: "cabinetLoyalty", max: 42 }, multiply: 1.45 }, { when: { hidden: "congressSupport", max: 35 }, multiply: 1.35 }] },
  "becarios-lideres": { weightModifiers: [{ when: { personality: "tecnócrata" }, multiply: 1.35 }, { when: { personality: "líder internacional" }, multiply: 1.25 }] },
  "fundacion-auditada": { weightModifiers: [{ when: { scandal: "cuenta-familiar" }, multiply: 1.35 }, { when: { hidden: "credibility", max: 35 }, multiply: 1.4 }] },
  "documento-incomodo-legado": { weightModifiers: [{ when: { scandal: "compra-votos" }, multiply: 1.35 }, { when: { scandal: "publicidad-estatal" }, multiply: 1.3 }] },
};

const OBJECT_FIELDS = ["effects", "hiddenEffects", "nationalEffects", "relationEffects"];
const ARRAY_FIELDS = ["weightModifiers", "addTags", "removeTags", "addAllies", "addEnemies", "addFavors", "addPromises", "addScandals", "addInvestigations", "addCrises", "addWars"];

function mergePayload(payload, patch = {}) {
  const merged = { ...payload, ...patch };
  for (const field of OBJECT_FIELDS) if (patch[field]) merged[field] = { ...(payload[field] ?? {}), ...patch[field] };
  for (const field of ARRAY_FIELDS) if (patch[field]) merged[field] = [...(payload[field] ?? []), ...patch[field]];
  return merged;
}

export function applyNarrativeCausality(events) {
  const eventIds = new Set(events.map((event) => event.id));
  const missingEvents = [...Object.keys(EVENT_PATCHES), ...Object.keys(OPTION_PATCHES)].filter((id) => !eventIds.has(id));
  const outcomeIds = new Set(events.flatMap((event) => event.options.flatMap((option) => option.outcomes ?? [])).map((outcome) => outcome.id));
  const missingOutcomes = Object.keys(OUTCOME_PATCHES).filter((id) => !outcomeIds.has(id));
  if (missingEvents.length || missingOutcomes.length) throw new Error(`Causalidad narrativa desconectada: ${[...missingEvents, ...missingOutcomes].join(", ")}`);
  return events.map((event) => {
    const options = event.options.map((option) => ({
      ...mergePayload(option, OPTION_PATCHES[event.id]?.[option.id]),
      outcomes: option.outcomes?.map((outcome) => mergePayload(outcome, OUTCOME_PATCHES[outcome.id])),
    }));
    return { ...mergePayload(event, EVENT_PATCHES[event.id]), options };
  });
}

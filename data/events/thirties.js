export const thirtiesEvents = [
  {
    id: "provincia-obra",
    title: "La carretera prometida",
    kicker: "Presupuesto bajo presión",
    description: "Una constructora ofrece terminar la carretera antes de las fiestas. A cambio, pide ajustar las bases de la licitación.",
    options: [
      {
        id: "licitacion-limpia",
        label: "Convocar una licitación limpia",
        hint: "La obra tardará, pero el expediente resistirá",
        effects: { approval: -5, influence: -2, legalRisk: -4 },
        outcomes: [{ id: "obra-transparente", weight: 100, text: "La demora irrita al pueblo, aunque la contraloría felicita el proceso.", effects: { cleanMoney: 6000 }, addTags: ["gestion-limpia"], nextEvent: "salto-regional" }],
      },
      {
        id: "arreglo-constructora",
        label: "Cerrar el trato",
        hint: "Obra rápida, condiciones en letra pequeña",
        effects: { approval: 12, influence: 9, dirtyMoney: 38000, legalRisk: 18 },
        addTags: ["favor-constructor"],
        outcomes: [
          { id: "obra-inaugurada", weight: 70, text: "La carretera abre a tiempo. La multitud corea tu nombre y nadie pregunta demasiado.", effects: { approval: 9 }, nextEvent: "salto-regional" },
          { id: "audio-filtrado", weight: 30, text: "Un audio del acuerdo llega a una radio local. La fiscalía abre diligencias.", effects: { approval: -22, legalRisk: 42 }, addTags: ["investigado"], nextEvent: "fiscalia-cerca" },
        ],
      },
    ],
  },
  {
    id: "salto-regional",
    title: "El salto regional",
    kicker: "Tu nombre crece fuera del distrito",
    description: "Dos movimientos te ofrecen encabezar una fórmula regional. Uno tiene estructura; el otro, una reputación impecable.",
    options: [
      { id: "movimiento-grande", label: "Elegir la maquinaria", hint: "Más alcance, más compromisos", effects: { influence: 18, approval: -5, legalRisk: 8 }, outcomes: [{ id: "gobierno-regional", weight: 100, text: "La estructura territorial te lleva al gobierno regional.", setRole: "Gobernador regional", addTags: ["poder-regional"], nextEvent: "pacto-nacional" }] },
      { id: "movimiento-limpio", label: "Elegir la lista independiente", hint: "Una campaña austera y lenta", effects: { cleanMoney: -12000, approval: 14, influence: 6 }, outcomes: [{ id: "liderazgo-regional", weight: 100, text: "No arrasas, pero tu campaña instala una forma distinta de hacer política.", setRole: "Líder regional", addTags: ["gestion-limpia"], nextEvent: "pacto-nacional" }] },
    ],
  },
];

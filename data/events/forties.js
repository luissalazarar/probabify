export const fortiesEvents = [
  {
    id: "reinsercion-regreso",
    title: "Volver a la plaza",
    kicker: "Tu primera aparición pública",
    description: "Una organización de derechos humanos te invita a hablar en una plaza. Antiguos compañeros quieren convertir el acto en una demostración de fuerza.",
    options: [
      {
        id: "discurso-democratico",
        label: "Defender la vía democrática",
        hint: "Romper públicamente con el pasado",
        effects: { approval: 14, influence: -5, legalRisk: -10 },
        removeTags: ["vigilado"],
        addTags: ["reconciliacion"],
        outcomes: [{ id: "nuevo-discurso", weight: 100, text: "El discurso divide a los tuyos, pero abre conversaciones inesperadas.", nextEvent: "pacto-nacional" }],
      },
      {
        id: "mensaje-ambiguo",
        label: "Mantener un mensaje ambiguo",
        hint: "Conservar a la vieja base movilizada",
        effects: { influence: 17, approval: -9, legalRisk: 22 },
        outcomes: [
          { id: "base-movilizada", weight: 60, text: "Tu base vuelve a organizarse. Un nuevo movimiento te ofrece liderazgo.", addTags: ["base-radical"], nextEvent: "pacto-nacional" },
          { id: "operativo", weight: 40, text: "La fiscalía interpreta tus palabras como apología y ordena un operativo.", effects: { legalRisk: 38, approval: -8 }, addTags: ["investigado"], nextEvent: "fiscalia-cerca" },
        ],
      },
    ],
  },
  {
    id: "empresario-campana",
    title: "Una campaña necesita caja",
    kicker: "El candidato llama a tu puerta",
    description: "El favorito presidencial te pide financiar el tramo final de su campaña. Parte del aporte no aparecerá en ningún reporte.",
    options: [
      {
        id: "aporte-registrado",
        label: "Aportar por la vía legal",
        hint: "Menos acceso, cuentas claras",
        effects: { cleanMoney: -80000, influence: 10, approval: 6 },
        outcomes: [{ id: "aporte-publico", weight: 100, text: "Tu aporte se publica. El partido agradece, aunque no te debe favores secretos.", addTags: ["financista-legal"], nextEvent: "pacto-nacional" }],
      },
      {
        id: "maletin",
        label: "Entregar el maletín",
        hint: "Una decisión que aún puedes detener",
        effects: { cleanMoney: -30000 },
        outcomes: [{ id: "antesala", weight: 100, text: "El intermediario llega a tu oficina. Te pide una confirmación final.", nextEvent: "empresario-confirmacion", sameYear: true }],
      },
    ],
  },
  {
    id: "empresario-confirmacion",
    title: "El maletín sobre la mesa",
    kicker: "Decisión secundaria · mismo año",
    description: "Todavía puedes retirarte. Si confirmas, el dinero comprará acceso inmediato al círculo del candidato.",
    options: [
      { id: "cancelar-entrega", label: "Retirarte a tiempo", hint: "Perder dinero, conservar margen", effects: { approval: 3, legalRisk: -2 }, outcomes: [{ id: "trato-cancelado", weight: 100, text: "El intermediario se marcha molesto. El costo fue alto, pero no dejó una prueba.", nextEvent: "pacto-nacional" }] },
      {
        id: "confirmar-entrega",
        label: "Confirmar la entrega",
        hint: "Comprar influencia fuera de registros",
        effects: { dirtyMoney: 120000, influence: 22, legalRisk: 24 },
        outcomes: [
          { id: "acceso-palacio", weight: 72, text: "El candidato gana y tu teléfono empieza a recibir llamadas desde Palacio.", addTags: ["operador"], nextEvent: "pacto-nacional" },
          { id: "colaborador-eficaz", weight: 28, text: "El intermediario se acoge a colaboración eficaz. Tu nombre figura en su primera declaración.", effects: { legalRisk: 55, approval: -18 }, addTags: ["investigado"], nextEvent: "fiscalia-cerca" },
        ],
      },
    ],
  },
  {
    id: "fiscalia-cerca",
    title: "La fiscalía toca la puerta",
    kicker: "El expediente ya tiene tu nombre",
    description: "Tus abogados ven dos salidas: colaborar y abandonar la primera línea, o usar todo tu poder para bloquear el caso.",
    options: [
      { id: "colaborar", label: "Colaborar y dar un paso al costado", hint: "Salvar la libertad, terminar la carrera", effects: { legalRisk: -45, influence: -20, dirtyMoney: -25000 }, addTags: ["retiro"], outcomes: [{ id: "retiro-colaborador", weight: 100, text: "Entregas información y anuncias tu retiro. El caso pierde fuerza.", setRole: "Político retirado" }] },
      { id: "obstruir", label: "Obstruir la investigación", hint: "Todo o nada", effects: { dirtyMoney: -40000, influence: -8, legalRisk: 35 }, outcomes: [{ id: "prision-preventiva", weight: 100, text: "Los intentos de obstrucción quedan registrados. El juez dicta prisión preventiva.", effects: { legalRisk: 100 }, addTags: ["condenado"], setRole: "Interno penitenciario" }] },
    ],
  },
];

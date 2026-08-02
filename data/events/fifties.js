export const fiftiesEvents = [
  {
    id: "pacto-nacional",
    title: "La mesa nacional",
    kicker: "El poder pide una definición",
    description: "Tu trayectoria te trae a Lima. Puedes negociar una cartera ministerial o arriesgarlo todo en una campaña presidencial.",
    options: [
      {
        id: "aceptar-ministerio",
        label: "Negociar un ministerio",
        hint: "Poder inmediato, menor exposición",
        requirements: { stat: "influence", min: 30 },
        effects: { influence: 10, approval: 3 },
        outcomes: [{ id: "juramentacion", weight: 100, text: "El presidente anuncia tu nombre. Juras el cargo ante las cámaras.", setRole: "Ministro de Estado", addTags: ["nombrado-ministro"] }],
      },
      {
        id: "campana-presidencial",
        label: "Lanzar la campaña presidencial",
        hint: "Una apuesta con todo tu capital",
        requirements: { all: [{ stat: "approval", min: 30 }, { stat: "influence", min: 28 }] },
        effects: { cleanMoney: -35000, approval: 5 },
        outcomes: [
          { id: "victoria-presidencial", weight: 48, text: "Una segunda vuelta imposible cambia el mapa político. Has ganado la presidencia.", effects: { influence: 28, approval: 12 }, setRole: "Presidente del Perú", addTags: ["electo-presidente"] },
          { id: "derrota-presidencial", weight: 52, text: "La campaña no alcanza. Reconoces la derrota y anuncias que no volverás a postular.", effects: { approval: -14, influence: -18 }, setRole: "Excandidato presidencial", addTags: ["retiro"] },
        ],
      },
      {
        id: "retirarse-nacional",
        label: "Retirarte con lo construido",
        hint: "Cerrar la carrera en tus propios términos",
        effects: { approval: 4 },
        addTags: ["retiro"],
        outcomes: [{ id: "retiro-voluntario", weight: 100, text: "Rechazas ambas ofertas. Por una vez, la última palabra es tuya.", setRole: "Político retirado" }],
      },
    ],
  },
];

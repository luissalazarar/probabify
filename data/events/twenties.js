export const twentiesEvents = [
  {
    id: "dinastia-apellido",
    title: "El peso del apellido",
    kicker: "Una curul queda vacante",
    description: "El partido te ofrece ocupar el lugar de tu tío en la lista al Congreso. La prensa ya prepara el titular: “Otra generación de la misma familia”.",
    options: [
      {
        id: "aceptar-herencia",
        label: "Aceptar la candidatura",
        hint: "Aprovechar la maquinaria familiar",
        effects: { influence: 12, cleanMoney: -18000, approval: -4 },
        addTags: ["candidata-congreso"],
        outcomes: [
          { id: "herencia-gana", weight: 65, text: "La maquinaria respondió. Obtienes una votación sólida y un lugar propio en el partido.", effects: { approval: 14, influence: 16 }, setRole: "Congresista", addTags: ["congresista"], nextEvent: "pacto-nacional" },
          { id: "herencia-pierde", weight: 35, text: "El apellido movilizó rechazo. Pierdes, pero la campaña te vuelve una figura nacional.", effects: { approval: -7, influence: 8 }, nextEvent: "pacto-nacional" },
        ],
      },
      {
        id: "romper-apellido",
        label: "Construir una ruta propia",
        hint: "Renunciar a la curul y recorrer regiones",
        effects: { cleanMoney: -28000, influence: -8, approval: 13 },
        addTags: ["independiente"],
        outcomes: [{ id: "ruta-propia", weight: 100, text: "El gesto sorprende. No tienes cargo, pero comienzas a ser más que un apellido.", setRole: "Dirigente partidaria", nextEvent: "pacto-nacional" }],
      },
    ],
  },
];

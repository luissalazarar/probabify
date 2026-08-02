export const twentiesEvents = [
  {
    id: "dinastia-apellido",
    initialOnly: true,
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
          { id: "herencia-gana", weight: 65, text: "La maquinaria responde. Obtienes una votación sólida y un escaño en la Cámara de Diputados.", effects: { approval: 14, influence: 16, cleanMoney: 18000 }, setRole: "Diputada de la República", roleDuration: 5, addTags: ["diputado", "congresista"], nextEvent: "dinastia-bancada" },
          { id: "herencia-pierde", weight: 35, text: "El apellido moviliza rechazo. Pierdes, pero la campaña te vuelve una figura nacional.", effects: { approval: -7, influence: 8 }, setRole: "Excandidata a Diputada", addTags: ["excandidata"], nextEvent: "dinastia-gira-propia" },
        ],
      },
      {
        id: "romper-apellido",
        label: "Construir una ruta propia",
        hint: "Renunciar a la curul y recorrer regiones",
        effects: { cleanMoney: -28000, influence: -8, approval: 13 },
        addTags: ["independiente"],
        outcomes: [{ id: "ruta-propia", weight: 100, text: "El gesto sorprende. No tienes cargo, pero comienzas a ser más que un apellido.", setRole: "Dirigente partidaria", nextEvent: "dinastia-gira-propia" }],
      },
    ],
  },
  {
    id: "redes-viral",
    repeatable: true,
    cooldown: 5,
    weight: 13,
    requirements: { age: { max: 38 } },
    title: "Un minuto viral",
    kicker: "Las redes fijan la agenda",
    description: "Un video tuyo enfrentando a un funcionario circula por todo el país. Puedes convertir la atención en organización o monetizarla con marcas.",
    options: [
      { id: "viral-organizar", label: "Convertir seguidores en militantes", hint: "Más influencia, campaña costosa", effects: { cleanMoney: -9000, influence: 13, approval: 7 }, outcomes: [{ id: "viral-comites", weight: 70, text: "Se forman comités en varias ciudades.", effects: { influence: 8 } }, { id: "viral-fugaz", weight: 30, text: "La atención dura una semana y los comités se disuelven.", effects: { approval: -4 } }] },
      { id: "viral-marcas", label: "Aceptar contratos de publicidad", hint: "Ingresos rápidos, imagen menos política", effects: { cleanMoney: 28000, approval: -5 }, outcomes: [{ id: "viral-ingresos", weight: 100, text: "La exposición paga tus cuentas, aunque tus seguidores cuestionan tus prioridades." }] },
    ],
  },
  {
    id: "juventud-partidaria",
    repeatable: true,
    cooldown: 6,
    weight: 11,
    requirements: { age: { max: 42 } },
    title: "La juventud del partido",
    kicker: "Una generación exige espacio",
    description: "Los cuadros jóvenes quieren que encabeces una rebelión interna. La dirigencia ofrece recursos si mantienes el orden.",
    options: [
      { id: "rebelion-interna", label: "Encabezar la renovación", hint: "Desafiar a quienes controlan el padrón", effects: { approval: 10, influence: -6, cleanMoney: -7000 }, outcomes: [{ id: "renovacion-triunfa", weight: 45, text: "La lista joven gana el comité ejecutivo.", effects: { influence: 20 }, addTags: ["renovador"] }, { id: "renovacion-expulsada", weight: 55, text: "La cúpula te aparta, pero tu desafío gana simpatía pública.", effects: { influence: -7, approval: 8 }, addTags: ["disidente"] }] },
      { id: "pacto-dirigencia", label: "Pactar con la dirigencia", hint: "Financiamiento a cambio de disciplina", effects: { cleanMoney: 16000, influence: 11, approval: -7 }, outcomes: [{ id: "cuota-partidaria", weight: 100, text: "Obtienes una secretaría partidaria y una línea directa con la cúpula.", setRole: "Secretario partidario" }] },
    ],
  },
  {
    id: "asesoria-campana",
    repeatable: true,
    cooldown: 4,
    weight: 10,
    requirements: { age: { max: 45 } },
    title: "Una campaña ajena",
    kicker: "Experiencia a sueldo",
    description: "Un candidato municipal te contrata para ordenar su campaña. Descubres que asesorar puede ser tan rentable como postular.",
    options: [
      { id: "asesoria-profesional", label: "Cobrar honorarios declarados", hint: "Dinero limpio y una red local", effects: { cleanMoney: 24000, influence: 5 }, outcomes: [{ id: "cliente-electo", weight: 55, text: "Tu cliente gana y recomienda tu trabajo.", effects: { cleanMoney: 12000, influence: 8 } }, { id: "cliente-derrotado", weight: 45, text: "La campaña pierde, pero tus honorarios estaban asegurados.", effects: { approval: -2 } }] },
      { id: "asesoria-facturas", label: "Inflar los gastos de campaña", hint: "Más margen, más riesgo", effects: { dirtyMoney: 36000, legalRisk: 12 }, outcomes: [{ id: "facturas-pasan", weight: 72, text: "El informe es aprobado sin observaciones." }, { id: "facturas-observadas", weight: 28, text: "El órgano electoral detecta comprobantes inconsistentes.", effects: { legalRisk: 24, approval: -8 }, addTags: ["investigado"] }] },
    ],
  },
  {
    id: "eleccion-universitaria", maxOccurrences: 1, weight: 12, requirements: { age: { max: 31 } }, category: "early-career",
    title: "La primera elección", kicker: "Un campus como laboratorio político", description: "Una lista estudiantil te propone encabezarla. No hay sueldo, pero sí una primera maquinaria y adversarios que recordarás durante años.",
    options: [
      { id: "lista-estudiantil", label: "Encabezar la lista", hint: "Experiencia temprana · alta exposición", effects: { cleanMoney: -2500, influence: 6 }, hiddenEffects: { mediaNotoriety: 5, credibility: 4 }, outcomes: [{ id: "centro-federado-gana", weight: 54, headline: "Tu primera campaña termina en victoria", text: "Aprendes a organizar votos y construyes una pequeña red de cuadros.", effects: { approval: 6, influence: 7 }, addTags: ["experiencia-electoral"] }, { id: "centro-federado-pierde", weight: 46, headline: "Una derrota estudiantil deja lecciones útiles", text: "Pierdes por poco, pero varios voluntarios permanecen contigo.", effects: { influence: 3 }, addAllies: [{ id: "cuadros-universitarios", label: "Antiguos dirigentes estudiantiles" }] }] },
      { id: "asesorar-lista-estudiantil", label: "Asesorar desde fuera", hint: "Menos notoriedad, más control", effects: { cleanMoney: 3000, influence: 3 }, outcomes: [{ id: "operador-campus", weight: 100, headline: "Descubres el poder de operar sin aparecer", text: "La lista adopta tu estrategia y te consulta después de la elección.", addTags: ["operador"] }] },
    ],
  },
  {
    id: "practicas-congreso", maxOccurrences: 1, weight: 11, requirements: { age: { max: 35 } }, category: "office",
    title: "Un escritorio en el Congreso", kicker: "La política vista desde dentro", description: "Te ofrecen un puesto temporal en una comisión. El trabajo paga poco, pero permite conocer expedientes, asesores y rutinas del poder.",
    options: [
      { id: "aprender-comision", label: "Trabajar técnicamente", hint: "Credibilidad y contactos institucionales", effects: { cleanMoney: 9000, influence: 5 }, hiddenEffects: { credibility: 10, congressSupport: 6 }, outcomes: [{ id: "informe-congreso", weight: 100, headline: "Un informe técnico lleva tu firma", text: "La comisión usa tu trabajo y varios congresistas aprenden tu nombre.", setRole: "Asesor parlamentario", addTags: ["asesor"] }] },
      { id: "filtrar-comision", label: "Filtrar un expediente a la prensa", hint: "Notoriedad rápida · enemigo duradero", effects: { influence: 7, legalRisk: 5 }, hiddenEffects: { mediaNotoriety: 13, pressSupport: 9, leakExposure: 12 }, addEnemies: [{ id: "presidente-comision", label: "Presidente de comisión afectado por una filtración" }], outcomes: [{ id: "expediente-portada", weight: 65, headline: "Una filtración sacude al Congreso", text: "La noticia provoca una investigación y te vuelve una fuente buscada.", effects: { approval: 7 } }, { id: "fuente-descubierta-congreso", weight: 35, headline: "La comisión identifica a su filtrador", text: "Pierdes el puesto y quedas vetado por una bancada.", effects: { influence: -7, approval: -3 }, hiddenEffects: { congressSupport: -12 } }] },
    ],
  },
  {
    id: "voluntariado-desastre", repeatable: true, cooldown: 8, weight: 8, requirements: { age: { max: 40 } }, category: "social",
    title: "Una emergencia revela liderazgos", kicker: "Ayuda antes que discurso", description: "Lluvias destruyen viviendas en una provincia. Puedes organizar ayuda directamente o convertir la campaña solidaria en una vitrina política.",
    options: [
      { id: "ayuda-sin-logo", label: "Organizar ayuda sin propaganda", hint: "Costo alto · reputación personal", effects: { cleanMoney: -12000, approval: 7 }, hiddenEffects: { ruralApproval: 12, personalReputation: 12, credibility: 8 }, outcomes: [{ id: "brigada-solidaria", weight: 100, headline: "Una brigada ciudadana llega antes que el Estado", text: "La comunidad recuerda tu presencia aunque casi no aparezca en televisión." }] },
      { id: "ayuda-con-camaras", label: "Llevar cámaras y símbolos", hint: "Mayor notoriedad · posible rechazo", effects: { cleanMoney: -7000, influence: 4 }, hiddenEffects: { mediaNotoriety: 11 }, outcomes: [{ id: "teleton-politica", weight: 57, headline: "La campaña solidaria moviliza miles de aportes", text: "La transmisión recauda fondos y eleva tu perfil.", effects: { approval: 9 } }, { id: "ayuda-oportunista", weight: 43, headline: "Damnificados rechazan la propaganda", text: "Una discusión frente a cámaras instala la idea de oportunismo.", effects: { approval: -10 }, hiddenEffects: { credibility: -7 } }] },
    ],
  },
  {
    id: "primer-financista", maxOccurrences: 1, weight: 10, requirements: { all: [{ age: { max: 42 } }, { stat: "influence", min: 20 }] }, category: "finance",
    title: "Alguien quiere financiar tu futuro", kicker: "El primer dinero nunca es gratuito", description: "Un empresario local ofrece pagar oficina, movilidad y equipo durante dos años. Solo pide ser escuchado cuando lleguen las decisiones importantes.",
    options: [
      { id: "contrato-financista", label: "Aceptar con un contrato transparente", hint: "Recursos limitados · reglas claras", effects: { cleanMoney: 28000, influence: 5 }, hiddenEffects: { businessSupport: 8, credibility: 4 }, addAllies: [{ id: "financista-inicial", label: "Primer financista declarado" }], outcomes: [{ id: "mecenazgo-formal", weight: 100, headline: "Un aporte formal sostiene tu primera organización", text: "El financista obtiene acceso, pero los pagos quedan registrados." }] },
      { id: "caja-financista", label: "Aceptar dinero sin declarar", hint: "Alta ganancia · deuda política", effects: { dirtyMoney: 52000, influence: 9, legalRisk: 10 }, hiddenEffects: { leakExposure: 14, undeclaredWealth: 15000 }, addFavors: [{ id: "deuda-primer-financista", label: "Debes favores a tu primer financista" }], outcomes: [{ id: "caja-inicial", weight: 76, headline: "Una caja discreta acelera tu crecimiento", text: "Contratas equipo y alquilas una oficina sin explicar el origen del dinero." }, { id: "financista-investigado", weight: 24, headline: "Tu primer financista aparece en una investigación", text: "La fiscalía revisa sus aportes y encuentra referencias a tu organización.", effects: { legalRisk: 20, approval: -7 }, addInvestigations: [{ id: "aportes-iniciales", label: "Investigación por aportes iniciales" }] }] },
    ],
  },
  {
    id: "pareja-militante", maxOccurrences: 1, weight: 8, requirements: { age: { max: 43 } }, category: "personal",
    title: "Una relación dentro del proyecto", kicker: "Lo personal también construye poder", description: "Una persona cercana se convierte en tu principal colaboradora dentro del canal, empresa, movimiento o equipo que estés construyendo. Debes decidir cuánta visibilidad tendrá.",
    options: [
      { id: "pareja-privada", label: "Separar la relación de la organización", hint: "Menos influencia, menor exposición", hiddenEffects: { familyStress: -7, personalReputation: 5, leakExposure: -4 }, outcomes: [{ id: "limites-personales", weight: 100, headline: "La vida privada queda fuera del comando", text: "La decisión evita conflictos de interés, aunque pierdes una operadora valiosa." }] },
      { id: "pareja-operadora", label: "Integrarla al equipo", hint: "Lealtad inmediata · riesgo futuro", effects: { influence: 8, cleanMoney: -6000 }, hiddenEffects: { familyStress: 8, cabinetLoyalty: 6, leakExposure: 8 }, addAllies: [{ id: "pareja-operadora", label: "Pareja integrada al proyecto" }], outcomes: [{ id: "dupla-politica", weight: 67, headline: "Una nueva dupla toma control del proyecto", text: "El equipo funciona mejor, pero empieza a depender de la relación." }, { id: "favoritismo-pareja", weight: 33, headline: "El equipo denuncia favoritismo hacia tu pareja", text: "Dos colaboradores renuncian y filtran conversaciones internas.", effects: { influence: -6 }, hiddenEffects: { partyCohesion: -12, leakExposure: 14 }, addScandals: [{ id: "favoritismo-pareja", label: "Acusaciones de favoritismo a la pareja" }] }] },
    ],
  },
];

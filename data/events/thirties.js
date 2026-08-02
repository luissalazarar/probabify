export const thirtiesEvents = [
  {
    id: "provincia-obra",
    initialOnly: true,
    title: "La carretera prometida",
    kicker: "Presupuesto bajo presión",
    description: "Una constructora ofrece terminar la carretera antes de las fiestas. A cambio, pide ajustar las bases de la licitación.",
    options: [
      { id: "licitacion-limpia", label: "Convocar una licitación limpia", hint: "La obra tardará, pero el expediente resistirá", effects: { approval: -5, influence: -2, legalRisk: -4 }, outcomes: [{ id: "obra-transparente", weight: 100, text: "La demora irrita al pueblo, aunque la contraloría felicita el proceso.", effects: { cleanMoney: 6000 }, addTags: ["gestion-limpia"], nextEvent: "provincia-control-obra" }] },
      { id: "arreglo-constructora", label: "Cerrar el trato", hint: "Obra rápida, condiciones en letra pequeña", effects: { approval: 12, influence: 9, dirtyMoney: 38000, legalRisk: 18 }, addTags: ["favor-constructor"], outcomes: [{ id: "obra-inaugurada", weight: 70, text: "La carretera abre a tiempo. La multitud corea tu nombre y nadie pregunta demasiado.", effects: { approval: 9 }, nextEvent: "provincia-favor-cobrado" }, { id: "audio-filtrado", weight: 30, text: "Un audio del acuerdo llega a una radio local. La fiscalía abre diligencias.", effects: { approval: -22, legalRisk: 42 }, addTags: ["investigado"], nextEvent: "fiscalia-cerca" }] },
    ],
  },
  {
    id: "salto-regional",
    weight: 12,
    requirements: { all: [{ age: { min: 30, max: 52 } }, { stat: "approval", min: 38 }] },
    title: "El salto regional",
    kicker: "Tu nombre crece fuera del distrito",
    description: "Dos movimientos te ofrecen encabezar una fórmula regional. Uno tiene estructura; el otro, una reputación impecable.",
    options: [
      { id: "movimiento-grande", label: "Elegir la maquinaria", hint: "Más alcance, más compromisos", effects: { influence: 18, approval: -5, legalRisk: 8, cleanMoney: -16000 }, outcomes: [{ id: "gobierno-regional", weight: 62, text: "La estructura territorial te lleva al gobierno regional.", setRole: "Gobernador regional", roleDuration: 4, addTags: ["poder-regional"], effects: { cleanMoney: 32000 } }, { id: "regional-derrota", weight: 38, text: "La maquinaria no alcanza y las deudas de campaña quedan contigo.", effects: { cleanMoney: -22000, influence: 5 }, setRole: "Excandidato regional" }] },
      { id: "movimiento-limpio", label: "Elegir la lista independiente", hint: "Una campaña austera y lenta", effects: { cleanMoney: -12000, approval: 14, influence: 6 }, outcomes: [{ id: "liderazgo-regional", weight: 42, text: "Tu campaña ciudadana gana por un margen mínimo.", setRole: "Gobernador regional", roleDuration: 4, addTags: ["gestion-limpia", "poder-regional"] }, { id: "liderazgo-oposicion", weight: 58, text: "No ganas, pero instalas una forma distinta de hacer política.", setRole: "Líder regional", effects: { influence: 7 } }] },
    ],
  },
  {
    id: "protesta-regional",
    repeatable: true,
    cooldown: 4,
    weight: 12,
    requirements: { age: { min: 28, max: 58 } },
    title: "La plaza se desborda",
    kicker: "Una protesta cambia el tablero",
    description: "Transportistas y comerciantes bloquean la ciudad. Te piden encabezar la protesta o mediar con el gobierno.",
    options: [
      { id: "liderar-protesta", label: "Subir al estrado", hint: "Capitalizar el descontento", effects: { approval: 12, influence: 8, legalRisk: 9, cleanMoney: -5000 }, outcomes: [{ id: "protesta-conquista", weight: 65, text: "El gobierno cede y tu liderazgo sale fortalecido.", effects: { approval: 8 } }, { id: "protesta-reprimida", weight: 35, text: "La protesta termina en enfrentamientos y te responsabilizan.", effects: { approval: -12, legalRisk: 18 } }] },
      { id: "mediar-protesta", label: "Negociar una salida", hint: "Menos épica, más gobernabilidad", effects: { influence: 7, approval: -3 }, outcomes: [{ id: "mesa-acuerdo", weight: 75, text: "La mesa alcanza un acuerdo parcial.", effects: { approval: 7, cleanMoney: 4000 } }, { id: "mesa-fracasa", weight: 25, text: "Ambos bandos te acusan de jugar para el otro.", effects: { approval: -9, influence: -4 } }] },
    ],
  },
  {
    id: "contrato-municipal",
    repeatable: true,
    cooldown: 5,
    weight: 10,
    requirements: { age: { min: 30, max: 60 } },
    title: "El contrato de limpieza",
    kicker: "Gestión o caja política",
    description: "El municipio renovará un contrato millonario. Una empresa eficiente compite con otra que financiaría tu siguiente campaña.",
    options: [
      { id: "empresa-eficiente", label: "Elegir la propuesta técnica", hint: "Servicio estable y cuentas claras", effects: { approval: 8, influence: -3, legalRisk: -3 }, outcomes: [{ id: "ciudad-limpia", weight: 82, text: "El servicio mejora y tu gestión recibe reconocimiento.", effects: { approval: 6 } }, { id: "huelga-limpieza", weight: 18, text: "Una huelga imprevista llena las calles de basura.", effects: { approval: -10 } }] },
      { id: "empresa-amiga", label: "Favorecer a la empresa amiga", hint: "Financiamiento opaco para el futuro", effects: { dirtyMoney: 52000, influence: 9, legalRisk: 18 }, outcomes: [{ id: "contrato-silencioso", weight: 68, text: "El contrato pasa y parte del margen vuelve a tu organización." }, { id: "contrato-denunciado", weight: 32, text: "Un postor excluido entrega el expediente a la prensa.", effects: { approval: -16, legalRisk: 30 }, addTags: ["investigado"] }] },
    ],
  },
  {
    id: "campana-congreso",
    repeatable: true,
    cooldown: 5,
    weight: 10,
    requirements: { all: [{ age: { min: 30, max: 65 } }, { stat: "influence", min: 22 }] },
    title: "Una curul en la Cámara de Diputados",
    kicker: "Elección bicameral · representación territorial",
    description: "Tu organización te ofrece un número competitivo para Diputados. La campaña puede darte una tribuna nacional, aunque la lista del Senado consume parte de los mismos recursos.",
    options: [
      { id: "postular-congreso", label: "Postular a la Cámara de Diputados", hint: "Distrito electoral · campaña de cinco años", effects: { cleanMoney: -26000, influence: 7 }, outcomes: [{ id: "curul-ganada", weight: 48, text: "Superas la cifra repartidora y obtienes un escaño en Diputados.", effects: { approval: 7, influence: 14, cleanMoney: 18000 }, setRole: "Diputado de la República", roleDuration: 5, addTags: ["diputado", "congresista"] }, { id: "curul-perdida", weight: 52, text: "Los votos no alcanzan. Puedes volver a intentarlo en otro ciclo.", effects: { approval: -5, influence: 3 }, setRole: "Excandidato a Diputado", addTags: ["excandidato"] }] },
      { id: "dirigir-lista", label: "Dirigir la campaña de la lista", hint: "Menor exposición y honorarios seguros", effects: { cleanMoney: 21000, influence: 8 }, outcomes: [{ id: "operador-legislativo", weight: 100, text: "Varios candidatos electos quedan en deuda contigo.", addTags: ["operador"] }] },
    ],
  },
  {
    id: "candidatura-alcaldia", maxOccurrences: 1, weight: 14, requirements: { all: [{ age: { min: 30, max: 47 } }, { stat: "approval", min: 35 }] }, category: "election",
    title: "La alcaldía parece alcanzable", kicker: "Gobernar una ciudad cambia la escala", description: "Una coalición vecinal te ofrece postular a la alcaldía. Tendrás que escoger entre una campaña territorial austera o una maquinaria más costosa.",
    options: [
      { id: "alcaldia-territorial", label: "Construir una campaña vecinal", hint: "Más lenta · fuerte respaldo local", effects: { cleanMoney: -22000, approval: 7 }, hiddenEffects: { urbanApproval: 10, regionalSupport: 8 }, outcomes: [{ id: "alcaldia-vecinal-gana", weight: 51, headline: "Una campaña puerta a puerta gana la alcaldía", text: "El margen es estrecho, pero tendrás cuatro años para demostrar gestión.", setRole: "Alcalde", roleDuration: 4, effects: { influence: 12 }, addTags: ["cargo-ejecutivo-local"] }, { id: "alcaldia-vecinal-pierde", weight: 49, headline: "La elección municipal se pierde por pocos votos", text: "La red vecinal permanece y puede sostener otra candidatura.", setRole: "Líder vecinal", effects: { influence: 4 } }] },
      { id: "alcaldia-maquinaria", label: "Contratar una maquinaria electoral", hint: "Mayor probabilidad · deuda económica", effects: { cleanMoney: -46000, influence: 8 }, hiddenEffects: { businessSupport: 9, leakExposure: 6 }, addPromises: [{ id: "contratos-municipales", label: "Contratos prometidos a operadores municipales" }], outcomes: [{ id: "alcaldia-maquinaria-gana", weight: 64, headline: "La maquinaria conquista el municipio", text: "Ganas con comodidad y los operadores presentan sus primeras facturas políticas.", setRole: "Alcalde", roleDuration: 4, addTags: ["cargo-ejecutivo-local"], effects: { influence: 11 } }, { id: "alcaldia-maquinaria-falla", weight: 36, headline: "Una campaña cara termina en derrota", text: "Las deudas permanecen cuando las urnas cierran.", effects: { cleanMoney: -18000, approval: -5 }, addTags: ["endeudado"] }] },
    ],
  },
  {
    id: "huelga-servicios", repeatable: true, cooldown: 5, weight: 11, requirements: { hasAnyTag: ["cargo-ejecutivo-local", "poder-regional"] }, category: "office",
    title: "Los trabajadores paralizan servicios", kicker: "Una negociación bajo presión", description: "El sindicato exige aumentos que el presupuesto no cubre. La ciudad empieza a acumular basura y las cámaras esperan tu respuesta.",
    options: [
      { id: "negociar-sindicato", label: "Negociar un aumento gradual", hint: "Costo fiscal · menor conflicto", effects: { approval: 3 }, hiddenEffects: { unionSupport: 14, governmentStability: 5 }, nationalEffects: { deficit: 0.5, socialConflict: -3 }, outcomes: [{ id: "huelga-levantada", weight: 75, headline: "Un acuerdo gradual levanta la huelga", text: "Los servicios se restablecen y ambas partes ceden." }, { id: "base-rechaza-acuerdo", weight: 25, headline: "La base sindical rechaza el acuerdo", text: "La huelga continúa y la dirigencia pierde control.", effects: { approval: -8 }, hiddenEffects: { unionSupport: -7 } }] },
      { id: "despedir-huelguistas", label: "Declarar ilegal la huelga", hint: "Respaldo empresarial · conflicto social", effects: { influence: 5, approval: -4 }, hiddenEffects: { unionSupport: -24, businessSupport: 12, polarization: 9 }, outcomes: [{ id: "servicios-retoman", weight: 56, headline: "Personal de emergencia restablece los servicios", text: "La ciudad vuelve a operar, pero el sindicato prepara demandas." }, { id: "huelga-escala", weight: 44, headline: "La huelga se convierte en protesta regional", text: "Otros sindicatos se suman y exigen tu renuncia.", effects: { approval: -12 }, nationalEffects: { socialConflict: 8 }, addCrises: [{ id: "huelga-regional", label: "Escalada de huelga de servicios" }] }] },
    ],
  },
  {
    id: "cambio-partido", repeatable: true, cooldown: 8, maxOccurrences: 2, weight: 9, requirements: { all: [{ age: { min: 32, max: 55 } }, { stat: "influence", min: 28 }] }, category: "party",
    title: "Otro partido ofrece una mejor posición", kicker: "Las lealtades tienen calendario", description: "Tu partido actual limita tu crecimiento. Una organización rival ofrece estructura, financiamiento y un lugar visible en su próxima lista.",
    options: [
      { id: "cambiar-partido", label: "Aceptar el cambio", hint: "Más recursos · reputación oportunista", effects: { influence: 12, cleanMoney: 18000, approval: -6 }, hiddenEffects: { partyCohesion: -16, credibility: -8 }, addTags: ["transfuga"], addEnemies: [{ id: "antiguo-partido", label: "Dirigencia del antiguo partido" }], outcomes: [{ id: "nuevo-partido-recibe", weight: 72, headline: "Cambias de camiseta política", text: "La nueva organización cumple el acuerdo y te entrega una posición visible." }, { id: "nuevo-partido-incumple", weight: 28, headline: "El nuevo partido desconoce parte del acuerdo", text: "Llegas sin espacio propio y tampoco puedes volver atrás.", effects: { influence: -10 }, hiddenEffects: { partyCohesion: -8 } }] },
      { id: "permanecer-partido", label: "Permanecer y disputar la interna", hint: "Coherencia · riesgo de aislamiento", effects: { approval: 4, influence: -3 }, hiddenEffects: { credibility: 7, partyCohesion: 5 }, outcomes: [{ id: "lealtad-reconocida", weight: 58, headline: "La militancia premia tu permanencia", text: "Ganas una votación interna contra la dirigencia.", effects: { influence: 9 } }, { id: "aislamiento-partidario", weight: 42, headline: "La cúpula te retira responsabilidades", text: "Conservas reputación, pero pierdes acceso a recursos.", effects: { influence: -8, cleanMoney: -5000 } }] },
    ],
  },
  {
    id: "credito-vivienda", maxOccurrences: 1, weight: 7, requirements: { age: { min: 30, max: 48 } }, category: "personal",
    title: "La primera propiedad bajo escrutinio", kicker: "Patrimonio y exposición pública", description: "Puedes comprar una vivienda con un crédito declarado o aceptar que un aliado complete la diferencia mediante una empresa relacionada.",
    options: [
      { id: "hipoteca-declarada", label: "Tomar una hipoteca formal", hint: "Reduce liquidez · patrimonio explicable", effects: { cleanMoney: -28000 }, hiddenEffects: { personalReputation: 4, credibility: 5 }, outcomes: [{ id: "vivienda-formal", weight: 100, headline: "Una hipoteca entra a tu declaración patrimonial", text: "Las cuotas serán pesadas, pero el origen del bien es claro." }] },
      { id: "aliado-paga-vivienda", label: "Aceptar el aporte del aliado", hint: "Ahorro inmediato · posible testaferro", effects: { cleanMoney: 12000, legalRisk: 8 }, hiddenEffects: { undeclaredWealth: 70000, leakExposure: 15 }, addFavors: [{ id: "vivienda-financiada", label: "Un aliado financió parte de tu vivienda" }], addScandals: [{ id: "vivienda-inexplicable", label: "Propiedad parcialmente inexplicable" }], outcomes: [{ id: "aporte-vivienda-oculto", weight: 74, headline: "La compra pasa sin observaciones", text: "La empresa del aliado cubre la diferencia mediante un contrato privado." }, { id: "hipoteca-investigada", weight: 26, headline: "Un reportaje cuestiona cómo pagaste la vivienda", text: "Tus ingresos declarados no coinciden con el precio de compra.", effects: { approval: -9, legalRisk: 18 }, addInvestigations: [{ id: "desbalance-vivienda", label: "Investigación por desbalance patrimonial" }] }] },
    ],
  },
  {
    id: "radio-regional", repeatable: true, cooldown: 6, weight: 10, requirements: { age: { min: 30, max: 52 } }, category: "media",
    title: "Una entrevista que escucha toda la región", kicker: "La radio todavía decide reputaciones", description: "La conductora más influyente de la región ofrece una entrevista larga. Puedes hablar de gestión o usar el espacio para atacar a un rival local.",
    options: [
      { id: "radio-gestion", label: "Defender tu gestión con datos", hint: "Credibilidad y aprobación rural", hiddenEffects: { credibility: 8, ruralApproval: 10, regionalSupport: 6 }, outcomes: [{ id: "entrevista-regional-solida", weight: 68, headline: "La entrevista fortalece tu liderazgo regional", text: "Los datos resisten las preguntas y la conversación circula fuera de la capital.", effects: { approval: 7 } }, { id: "datos-contradichos", weight: 32, headline: "La conductora encuentra cifras contradictorias", text: "Un informe oficial debilita una de tus principales afirmaciones.", effects: { approval: -7 }, hiddenEffects: { credibility: -9 } }] },
      { id: "radio-ataque-rival", label: "Atacar al gobernador rival", hint: "Notoriedad · crea un enemigo", effects: { influence: 5 }, hiddenEffects: { polarization: 8, mediaNotoriety: 7 }, addEnemies: [{ id: "gobernador-rival", label: "Gobernador atacado en radio" }], outcomes: [{ id: "ataque-regional-prende", weight: 52, headline: "Una acusación domina la agenda regional", text: "El rival pasa varios días respondiendo y tú ganas espacio.", effects: { approval: 8 } }, { id: "rival-responde-documentos", weight: 48, headline: "El rival responde con documentos sobre tu gestión", text: "La entrevista se convierte en un intercambio de acusaciones.", effects: { approval: -8, legalRisk: 5 }, hiddenEffects: { leakExposure: 8 } }] },
    ],
  },
];

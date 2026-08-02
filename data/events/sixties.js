export const sixtiesEvents = [
  {
    id: "fundacion-legado",
    repeatable: true,
    cooldown: 6,
    weight: 13,
    requirements: { age: { min: 58 } },
    title: "Una fundación con tu nombre",
    kicker: "El legado también se financia",
    description: "Tu equipo propone crear una fundación para formar nuevos líderes. Puede ser una obra duradera o una caja política discreta.",
    options: [
      { id: "fundacion-real", label: "Financiar programas reales", hint: "Invertir dinero en reputación", effects: { cleanMoney: -45000, approval: 9, influence: 5 }, outcomes: [{ id: "becarios-lideres", weight: 70, text: "Los primeros becarios llegan a cargos locales y reconocen tu apoyo.", effects: { influence: 9 } }, { id: "fundacion-costosa", weight: 30, text: "El programa ayuda, pero consume más recursos de lo previsto.", effects: { cleanMoney: -18000 } }] },
      { id: "fundacion-fachada", label: "Usarla como caja política", hint: "Mover recursos sin controles", effects: { dirtyMoney: 85000, legalRisk: 22, influence: 8 }, outcomes: [{ id: "fundacion-opaca", weight: 67, text: "La fundación sostiene operadores en varias regiones." }, { id: "fundacion-auditada", weight: 33, text: "Una auditoría encuentra beneficiarios fantasma.", effects: { legalRisk: 38, approval: -16 }, addTags: ["investigado"] }] },
    ],
  },
  {
    id: "memorias-politicas",
    weight: 10,
    requirements: { age: { min: 60 } },
    title: "El libro de tus memorias",
    kicker: "Tu versión de la historia",
    description: "Una editorial ofrece un adelanto importante. Te pide revelar negociaciones y nombres que todavía pesan en la política.",
    options: [
      { id: "memorias-honestas", label: "Contarlo todo", hint: "Ingresos y una última controversia", effects: { cleanMoney: 52000, approval: 8, influence: -5 }, outcomes: [{ id: "libro-exito", weight: 60, text: "El libro es un éxito y reabre debates nacionales.", effects: { cleanMoney: 26000, approval: 5 } }, { id: "demandas-memorias", weight: 40, text: "Antiguos aliados presentan demandas y niegan tu relato.", effects: { legalRisk: 12, influence: -6 } }] },
      { id: "memorias-cuidadas", label: "Publicar una versión prudente", hint: "Proteger alianzas y reputación", effects: { cleanMoney: 28000, influence: 4 }, outcomes: [{ id: "libro-prudente", weight: 100, text: "El libro vende poco, pero ningún aliado rompe contigo." }] },
    ],
  },
  {
    id: "mentor-sucesion",
    repeatable: true,
    cooldown: 5,
    weight: 12,
    requirements: { age: { min: 60 } },
    title: "La siguiente generación",
    kicker: "Elegir a quién enseñar",
    description: "Dos jóvenes dirigentes buscan tu respaldo: una figura popular sin estructura y un operador disciplinado con recursos.",
    options: [
      { id: "mentora-popular", label: "Respaldar a la figura popular", hint: "Renovación con menos control", effects: { cleanMoney: -15000, approval: 8 }, outcomes: [{ id: "sucesora-independiente", weight: 55, text: "Tu protegida crece y empieza a tomar decisiones propias.", effects: { influence: 5 } }, { id: "sucesora-se-desinfla", weight: 45, text: "La popularidad no se convierte en organización.", effects: { influence: -5 } }] },
      { id: "mentor-operador", label: "Respaldar al operador", hint: "Continuidad y una maquinaria leal", effects: { influence: 9, approval: -4 }, outcomes: [{ id: "operador-hereda", weight: 70, text: "El operador consolida tu red y garantiza su continuidad.", effects: { cleanMoney: 18000 } }, { id: "operador-traiciona", weight: 30, text: "Tu heredero pacta con un rival y se lleva parte del equipo.", effects: { influence: -16 } }] },
    ],
  },
  {
    id: "ultima-retirada",
    repeatable: true,
    cooldown: 4,
    weight: 7,
    requirements: { age: { min: 65 } },
    title: "¿Es momento de parar?",
    kicker: "La decisión que nadie puede tomar por ti",
    description: "Tu familia pide que te retires. El partido insiste en que aún queda una campaña y tú sabes que la próxima elección está cerca.",
    options: [
      { id: "retiro-final", label: "Cerrar la carrera", hint: "Un final voluntario y definitivo", addTags: ["retiro-definitivo"], outcomes: [{ id: "despedida-politica", weight: 100, text: "Anuncias tu retiro definitivo rodeado de aliados y adversarios.", setRole: "Político retirado" }] },
      { id: "seguir-carrera", label: "Seguir hasta el último ciclo", hint: "Todavía queda poder por disputar", effects: { approval: -2, influence: 4, cleanMoney: -9000 }, outcomes: [{ id: "una-campana-mas", weight: 100, text: "Reorganizas tu agenda. Aún no has dicho la última palabra." }] },
    ],
  },
  {
    id: "mediacion-nacional", repeatable: true, cooldown: 6, weight: 13, requirements: { all: [{ age: { min: 60 } }, { stat: "influence", min: 45 }] }, category: "legacy",
    title: "Dos bandos te piden mediar", kicker: "La experiencia como último capital", description: "Una crisis entre gobierno y oposición amenaza con paralizar el país. Ambos aceptan que conduzcas una conversación reservada.",
    options: [
      { id: "mediar-neutral", label: "Mediar sin exigir protagonismo", hint: "Reputación duradera · poca ganancia política", effects: { influence: 4 }, hiddenEffects: { credibility: 12, internationalReputation: 8, polarization: -10 }, nationalEffects: { socialConflict: -8, investment: 3 }, outcomes: [{ id: "acuerdo-mediado", weight: 68, headline: "Una mediación evita una nueva crisis institucional", text: "Gobierno y oposición firman una hoja de ruta mínima.", effects: { approval: 8 }, addCrises: [{ id: "mediacion-exitosa", label: "Crisis institucional resuelta por mediación" }] }, { id: "mediacion-fracasa-nacional", weight: 32, headline: "La mesa de mediación se rompe", text: "Ambos bandos usan conversaciones privadas para culparse.", effects: { approval: -4 }, hiddenEffects: { leakExposure: 8 } }] },
      { id: "mediar-condiciones", label: "Exigir una cuota en el acuerdo", hint: "Más influencia · menor credibilidad", effects: { influence: 11, cleanMoney: 12000 }, hiddenEffects: { credibility: -8, congressSupport: 6 }, addPromises: [{ id: "cuota-mediacion", label: "Acuerdo político obtenido durante mediación" }], outcomes: [{ id: "mediador-con-cuota", weight: 100, headline: "La mediación termina con un nuevo espacio para tu grupo", text: "La crisis baja, pero varios participantes cuestionan tus intereses." }] },
    ],
  },
  {
    id: "familiar-candidato", maxOccurrences: 1, weight: 10, requirements: { all: [{ age: { min: 60 } }, { stat: "influence", min: 35 }] }, category: "personal",
    title: "Un familiar quiere continuar la carrera", kicker: "Herencia política o competencia", description: "Un hijo, sobrina o pariente cercano anuncia que quiere postular. Puede usar tu apellido y estructura o construir una identidad separada.",
    options: [
      { id: "respaldar-familiar", label: "Entregarle estructura y contactos", hint: "Continuidad · acusaciones de dinastía", effects: { cleanMoney: -28000, influence: 7, approval: -4 }, hiddenEffects: { partyCohesion: 10, familyStress: -5, credibility: -8 }, addAllies: [{ id: "heredero-familiar", label: "Familiar convertido en sucesor" }], outcomes: [{ id: "heredero-gana", weight: 56, headline: "Una nueva generación gana su primer cargo", text: "El familiar obtiene una curul y promete continuar tu legado.", effects: { influence: 9 }, addTags: ["dinastia-propia"] }, { id: "heredero-rechazado", weight: 44, headline: "El electorado rechaza la sucesión familiar", text: "La derrota abre una discusión privada sobre responsabilidades.", effects: { approval: -7 }, hiddenEffects: { familyStress: 14 } }] },
      { id: "familia-independiente", label: "Pedirle construir su propia ruta", hint: "Menos control · protege reputación", effects: { approval: 4, influence: -3 }, hiddenEffects: { credibility: 7, familyStress: 6 }, outcomes: [{ id: "familiar-ruta-propia", weight: 64, headline: "El familiar lanza una candidatura independiente", text: "La distancia pública protege tu imagen, aunque limita tu control." }, { id: "familiar-se-vuelve-rival", weight: 36, headline: "El familiar critica públicamente tu legado", text: "Su campaña se construye prometiendo corregir tus errores.", effects: { approval: -5 }, addEnemies: [{ id: "familiar-rival", label: "Familiar convertido en rival político" }] }] },
      { id: "bloquear-familiar", label: "Bloquear su candidatura", hint: "Conservar control · ruptura familiar", effects: { influence: 5 }, hiddenEffects: { familyStress: 24, personalReputation: -10 }, addEnemies: [{ id: "familiar-bloqueado", label: "Familiar cuya candidatura bloqueaste" }], outcomes: [{ id: "familia-rompe", weight: 100, headline: "Una disputa familiar llega a los medios", text: "Mensajes privados muestran cómo la organización cerró sus puertas al nuevo candidato.", effects: { approval: -9 }, addScandals: [{ id: "ruptura-dinastia", label: "Ruptura familiar por candidatura" }] }] },
    ],
  },
  {
    id: "premio-internacional", maxOccurrences: 1, weight: 3, rare: true, requirements: { all: [{ age: { min: 62 } }, { hidden: "internationalReputation", min: 68 }, { hidden: "credibility", min: 55 }] }, category: "rare",
    title: "Un reconocimiento inesperado", kicker: "Evento raro · prestigio internacional", description: "Una organización internacional anuncia que recibirás un premio por trayectoria democrática o mediación política.",
    options: [
      { id: "aceptar-premio", label: "Aceptar y dedicarlo al país", hint: "Legado y reputación internacional", effects: { approval: 8, influence: 5, cleanMoney: 18000 }, hiddenEffects: { internationalReputation: 20, personalReputation: 12 }, outcomes: [{ id: "premio-discurso", weight: 100, headline: "Un premio internacional reconoce tu trayectoria", text: "El discurso repasa aciertos y errores y se convierte en una pieza de legado.", addTags: ["premio-internacional"], highlight: true }] },
      { id: "rechazar-premio", label: "Rechazarlo por razones políticas", hint: "Moviliza a tu base · divide opiniones", effects: { approval: 3, influence: 4 }, hiddenEffects: { polarization: 12, internationalReputation: -10 }, outcomes: [{ id: "premio-rechazado", weight: 100, headline: "Rechazas un premio y denuncias intereses extranjeros", text: "Tus seguidores celebran la decisión y críticos la consideran una oportunidad perdida." }] },
    ],
  },
  {
    id: "salud-y-agenda", repeatable: true, cooldown: 7, weight: 9, requirements: { age: { min: 63 } }, category: "personal",
    title: "El cuerpo exige otra agenda", kicker: "Una señal no gráfica de desgaste", description: "Después de una jornada extensa, médicos recomiendan reducir viajes y estrés. El equipo teme que hacerlo parezca debilidad.",
    options: [
      { id: "reducir-agenda", label: "Reducir actividades y delegar", hint: "Menos influencia · protege vida personal", effects: { influence: -6, approval: -2 }, hiddenEffects: { familyStress: -18, cabinetLoyalty: 6, personalReputation: 4 }, outcomes: [{ id: "agenda-delegada", weight: 100, headline: "Delegas parte de la agenda pública", text: "El sucesor o equipo gana autonomía mientras recuperas equilibrio." }] },
      { id: "ocultar-desgaste", label: "Mantener el ritmo y ocultarlo", hint: "Conservar imagen · riesgo de filtración", effects: { influence: 5 }, hiddenEffects: { familyStress: 18, leakExposure: 10, personalReputation: -3 }, outcomes: [{ id: "ritmo-sostenido", weight: 62, headline: "Mantienes una agenda intensa sin incidentes", text: "La imagen de energía se conserva durante otro año." }, { id: "informe-medico-filtrado", weight: 38, headline: "Un informe médico privado llega a la prensa", text: "La decisión de ocultarlo se vuelve más dañina que el diagnóstico.", effects: { approval: -8 }, hiddenEffects: { credibility: -10 }, addScandals: [{ id: "salud-oculta", label: "Ocultamiento de información sobre salud" }] }] },
    ],
  },
  {
    id: "archivo-de-legado", repeatable: true, cooldown: 6, weight: 10, requirements: { all: [{ age: { min: 62 } }, { any: [{ state: "presidentialRuns", min: 1 }, { hasTag: "fue-ministro" }, { hasTag: "congresista" }] }] }, category: "legacy",
    title: "Una universidad pide tu archivo", kicker: "Quién contará tu versión", description: "Cartas, agendas y documentos podrían convertirse en un archivo público. Algunos también contienen acuerdos que nunca fueron conocidos.",
    options: [
      { id: "archivo-completo", label: "Entregar el archivo completo", hint: "Credibilidad · posibles revelaciones", effects: { approval: 5, cleanMoney: 12000 }, hiddenEffects: { credibility: 14, internationalReputation: 7, leakExposure: -8 }, outcomes: [{ id: "archivo-historico-abre", weight: 74, headline: "Un archivo político queda abierto a investigadores", text: "Los documentos mejoran la comprensión de tu carrera y confirman varias versiones." }, { id: "documento-incomodo-legado", weight: 26, headline: "Un documento reabre una antigua controversia", text: "La transparencia también revela un acuerdo que habías omitido.", effects: { approval: -7 }, addScandals: [{ id: "documento-legado", label: "Documento incómodo encontrado en el archivo" }] }] },
      { id: "archivo-curado", label: "Entregar una selección revisada", hint: "Proteger reputación · sospechas futuras", effects: { cleanMoney: 8000 }, hiddenEffects: { credibility: -3, leakExposure: 7 }, outcomes: [{ id: "archivo-seleccionado", weight: 100, headline: "La universidad recibe un archivo cuidadosamente seleccionado", text: "El material fortalece tu versión, aunque investigadores señalan vacíos evidentes." }] },
      { id: "destruir-documentos", label: "Destruir los documentos sensibles", hint: "Evita una revelación · riesgo elevado", effects: { legalRisk: 8 }, hiddenEffects: { leakExposure: 20, credibility: -10 }, addFavors: [{ id: "archivo-destruido", label: "Ordenaste destruir documentos políticos" }], outcomes: [{ id: "documentos-desaparecen", weight: 70, headline: "Parte del archivo desaparece antes de la entrega", text: "No queda prueba directa de quién dio la orden." }, { id: "copia-archivo", weight: 30, headline: "Un asistente conservaba copias del archivo", text: "Los documentos y la orden de destruirlos llegan juntos a la prensa.", effects: { approval: -14, legalRisk: 18 }, addScandals: [{ id: "destruccion-archivo", label: "Intento de destruir documentos" }] }] },
    ],
  },
  {
    id: "ultima-empresa", maxOccurrences: 1, weight: 7, requirements: { all: [{ age: { min: 60 } }, { any: [{ hasTag: "empresario" }, { stat: "cleanMoney", min: 120000 }] }] }, category: "business",
    title: "Una última inversión importante", kicker: "Patrimonio, empleo y legado", description: "Un grupo joven busca capital para una empresa tecnológica vinculada a servicios públicos. Puedes invertir, financiarla mediante terceros o rechazar el proyecto.",
    options: [
      { id: "invertir-startup", label: "Invertir de forma transparente", hint: "Riesgo económico · posible legado empresarial", effects: { cleanMoney: -90000 }, hiddenEffects: { businessSupport: 8, internationalReputation: 4 }, outcomes: [{ id: "startup-crece", weight: 48, headline: "La empresa tecnológica se expande por la región", text: "La inversión multiplica su valor y crea una nueva fuente de ingresos.", effects: { cleanMoney: 210000 }, addTags: ["legado-empresarial"] }, { id: "startup-quiebra", weight: 52, headline: "La última inversión termina en quiebra", text: "El proyecto no consigue contratos y pierdes casi todo el capital invertido." }] },
      { id: "invertir-terceros", label: "Invertir mediante terceros", hint: "Ocultar participación · riesgo patrimonial", effects: { dirtyMoney: -70000, cleanMoney: 30000, legalRisk: 10 }, hiddenEffects: { undeclaredWealth: 90000, leakExposure: 14 }, outcomes: [{ id: "startup-oculta", weight: 65, headline: "Una inversión indirecta genera utilidades", text: "Los dividendos regresan mediante contratos de consultoría." }, { id: "socio-revela-startup", weight: 35, headline: "Un socio revela tu participación oculta", text: "La inversión se conecta con contratos públicos obtenidos por la empresa.", effects: { approval: -11, legalRisk: 22 }, addScandals: [{ id: "inversion-oculta", label: "Participación empresarial oculta" }] }] },
      { id: "rechazar-ultima-empresa", label: "No comprometer el patrimonio", hint: "Conservar liquidez", outcomes: [{ id: "inversion-rechazada", weight: 100, headline: "Decides no arriesgar el patrimonio acumulado", text: "La empresa busca otros inversionistas y tú mantienes tus reservas." }] },
    ],
  },
];

const EVENT_PATCHES = {
  "fiscalia-cerca": {
    directedOnly: false, maxOccurrences: 1, forced: true, priority: 84, weight: 100, group: "proceso-judicial", groupCooldown: 1,
    requirements: { all: [{ stat: "legalRisk", min: 48 }, { hasTag: "investigado" }, { missingTag: ["en-prision", "en-exilio", "arresto-domiciliario", "caso-principal-cerrado"] }] },
  },
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
    title: "Una denuncia alcanza a tu pareja",
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
    title: "Dos figuras disputan tu respaldo",
    description: "Una dirigente popular puede renovar el movimiento, pero no acepta obedecer. Un operador controla padrones y recursos, aunque arrastra rechazo público.",
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
  "investigacion-avanzada": {
    repeatable: false, maxOccurrences: 1, priority: 95, group: "proceso-judicial", groupCooldown: 1,
    requirements: { all: [{ hasTag: "investigacion-formalizada" }, { missingTag: ["en-prision", "en-exilio", "arresto-domiciliario", "caso-principal-cerrado"] }] },
    title: "Fiscalía formaliza la acusación", kicker: "Los descargos no cerraron el expediente",
    description: "Después de la primera citación, Fiscalía presenta transferencias, mensajes y testimonios ante un juez. Debes defenderte dentro del proceso o intentar salir del país.",
    weightModifiers: [{ when: { scandal: "cuenta-familiar" }, multiply: 1.35 }, { when: { scandal: "contrato-primer-financista" }, multiply: 1.45 }, { when: { outcome: "financista-investigado-colabora" }, multiply: 1.4 }, { when: { hidden: "prosecutionRelation", max: 28 }, multiply: 1.25 }],
  },
  "orden-captura": { requirements: { hasTag: "orden-judicial-pendiente" }, title: "El juez evalúa una medida de detención", kicker: "El allanamiento abrió una audiencia urgente", description: "Fiscalía pide limitar tu libertad mientras reúne las últimas pruebas. Puedes presentarte, colaborar o incumplir la orden y buscar asilo." },
  "mocion-vacancia": { description: "La oposición afirma tener los votos para retirarte del cargo. Puedes construir una coalición pública, comprar apoyos en secreto o intentar frenar la moción con respaldo ciudadano." },
  "control-partido": { maxOccurrences: 2, weightModifiers: [{ when: { outcome: "partido-controlado" }, multiply: 1.45 }, { when: { eventCount: { id: "control-partido", min: 1 } }, multiply: 0.65 }, { when: { personality: "operador" }, multiply: 1.25 }] },
  "promesa-provincial-pendiente": { requirements: { all: [{ origin: "provincia" }, { age: { min: 40, max: 69 } }, { missingTag: "promesa-regional-resuelta" }, { any: [{ decision: "pacto-comunal" }, { decision: "alcaldia-maquinaria" }, { outcome: "mandato-comunal" }, { outcome: "alcaldia-maquinaria-gana" }] }] } },
  "partido-despues-palacio": { maxOccurrences: 1 },
  "fundacion-legado": {
    requirements: { all: [{ age: { min: 58 } }, { any: [{ hasTag: "fue-presidente" }, { stat: "influence", min: 50 }, { personality: ["líder internacional", "tecnócrata", "figura mediática"] }] }] },
    title: "Tu equipo propone una fundación con tu nombre",
    description: "Exasesores ofrecen reunir donantes, archivos y formación. Parte del equipo propone trabajo público verificable; otros quieren conservar operadores fuera del partido.",
  },
  "archivo-de-legado": { weightModifiers: [{ when: { decision: "destruir-documentos" }, multiply: 1.8 }, { when: { scandal: "control-canal-publico" }, multiply: 1.3 }, { when: { eventCount: { id: "archivo-de-legado", min: 1 } }, multiply: 0.55 }] },
  "pareja-militante": { description: "Tu pareja empieza a coordinar agenda, equipo y aportantes. Debes mantenerla fuera de la organización o darle un cargo visible." },
  "provincia-obra": { title: "La carretera que nunca llegó al mapa" },
  "podcast-ruta-sensacional": { title: "Los anunciantes quieren elegir el próximo blanco" },
  "auditoria-municipal": { title: "La auditoría revisa el expediente que diseñaste" },
  "patrocinador-viral": { title: "Tu primer patrocinador viene a cobrar" },
  "estrategia-presidencial": { allowDirectedRepeat: true, description: "Las encuestas dejan tres caminos: buscar indecisos, movilizar a tu base o centrar la campaña en atacar al sistema." },
  "debate-presidencial": { allowDirectedRepeat: true },
  "escrutinio-presidencial": { allowDirectedRepeat: true, description: "Las mesas cierran y empieza el conteo. Personeros, alianzas y votos regionales decidirán si ganas, avanzas o quedas fuera." },
  "segunda-vuelta": { allowDirectedRepeat: true },
  "vida-prision": { maxOccurrences: 4, group: "vida-prision", groupCooldown: 1 },
  "taller-penitenciario": { maxOccurrences: 2, yearsAdvance: 6 },
  "visita-politica-prision": { maxOccurrences: 2, yearsAdvance: 6 },
  "vida-exilio": { maxOccurrences: 3, yearsAdvance: 4, group: "vida-exilio", groupCooldown: 1 },
  "coalicion-exilio": { maxOccurrences: 2, yearsAdvance: 5 },
  "ultima-retirada": { maxOccurrences: 2 },
  "ano-perfil-bajo": { requirements: { all: [{ age: { max: 69 } }, { missingTag: ["en-prision", "en-exilio", "arresto-domiciliario"] }] }, title: "Este año no tienes cargo ni campaña", description: "No reúnes condiciones para un salto inmediato. Puedes trabajar y recuperar caja limpia o gastar en mantener activa tu organización." },
  "tribunal-internacional": { maxOccurrences: 2, yearsAdvance: 5, description: "Una corte regional revisará las medidas que provocaron tu exilio. Puedes concentrarte en el expediente o usar la audiencia como campaña." },
  "memoria-sl": { description: "Familiares de víctimas identifican tu antiguo alias en testimonios y actas. Puedes entregar información verificable o negar toda responsabilidad." },
};

// Estos eventos describen una coyuntura concreta, no un ciclo reutilizable.
// Las elecciones generales y los estados prolongados de prisión/exilio conservan
// sus propias reglas de repetición porque representan periodos diferentes.
const SINGLE_OCCURRENCE_EVENTS = new Set([
  "redes-viral", "juventud-partidaria", "asesoria-campana", "voluntariado-desastre",
  "protesta-regional", "contrato-municipal", "campana-congreso", "huelga-servicios",
  "cambio-partido", "radio-regional", "debate-televisado", "cena-donantes",
  "negocio-expansion", "caja-vacia", "comision-investigadora", "proyecto-minero",
  "seguridad-ciudadana", "alianza-rival", "oferta-ministerial", "crisis-presidencial",
  "foro-internacional", "oferta-premier", "reforma-pensiones", "asesoria-expresidente",
  "fundacion-legado", "mentor-sucesion", "mediacion-nacional", "salud-y-agenda",
  "archivo-de-legado", "publicidad-politica", "filtracion-podcast", "guerra-de-redes",
  "escandalo-pareja", "mocion-vacancia", "reforma-economica", "coalicion-congreso",
  "cabildo-juvenil", "debate-ideologico-joven", "presupuesto-participativo",
  "primaria-partidaria", "conflicto-docente", "credito-campana-banco",
  "programa-dominical", "reforma-salud", "censura-ministerial", "canal-publico",
  "catedra-politica", "consejo-de-estado", "los-ninos-obras", "repartija-institucional",
  "taperes-campana", "cerco-mediatico",
]);

const OPTION_PATCHES = {
  "estrategia-presidencial": {
    "campana-outsider": { hint: "Muchos titulares · alto rechazo" },
  },
  "debate-presidencial": {
    "debate-programatico": { hint: "Equipo preparado · puede perderse entre ataques" },
    "debate-memes": { hint: "Gran alcance · puede terminar en burla" },
  },
  "escrutinio-presidencial": {
    "esperar-escrutinio": { hint: "Conteo nacional · posible segunda vuelta" },
  },
  "debate-televisado": {
    "debate-ataque": { hint: "Golpea al rival · puede rebotar" },
  },
  "escandalo-pareja": {
    "admitir-error-pareja": { hint: "Disculpa directa · pueden aparecer más imágenes" },
  },
  "guerra-de-redes": {
    "desmentir-redes": { hint: "Pruebas públicas · el desmentido puede llegar tarde" },
    "contraoperacion-redes": { hint: "Desvía la agenda · pueden rastrear las cuentas" },
  },
  "comision-postpresidencial": {
    "negociar-sucesor-expediente": { hint: "Oculta archivos · el sucesor puede denunciarte" },
  },
  "primaria-partidaria": {
    "competir-interna": { hint: "Legitimidad · la militancia puede elegir a otra persona" },
  },
  "programa-dominical": {
    "participar-perfil": { hint: "Muestra tu trayectoria · el archivo puede contradecirte" },
  },
  "control-partido": {
    "tomar-partido": { requirements: { not: { decision: "tomar-partido" } }, relationEffects: { "Directorio partidario": 14 } },
    "negociar-cuota": { requirements: { not: { decision: "negociar-cuota" } }, relationEffects: { "Directorio partidario": 5 } },
  },
  "asesoria-expresidente": {
    "asesorar-sucesor": { relationEffects: { "Sucesor presidencial": 16 }, addTags: ["sucesor-aliado"] },
    "controlar-sucesor": { relationEffects: { "Sucesor presidencial": -8 }, addTags: ["influencia-desde-sombras"] },
    "conferencias-expresidente": { relationEffects: { "Sucesor presidencial": 3 } },
  },
  "vida-prision": {
    "apelar-prision": { hint: "Alto costo · la sala puede rechazarla", yearsAdvance: 2, requirements: { missingTag: ["condena-final", "apelacion-presentada"] }, addTags: ["apelacion-presentada"] },
    "entrevista-prision": { yearsAdvance: 3, requirements: { missingTag: "entrevista-prision-realizada" }, addTags: ["entrevista-prision-realizada"] },
    "aceptar-condena": { yearsAdvance: 3 },
    "reparar-desde-prision": { yearsAdvance: 6, requirements: { all: [{ hasTag: "condena-final" }, { not: { decision: "reparar-desde-prision" } }] } },
  },
  "taller-penitenciario": {
    "taller-transparente": { requirements: { not: { decision: "taller-transparente" } } },
    "red-favores-penal": { requirements: { not: { decision: "red-favores-penal" } } },
  },
  "visita-politica-prision": {
    "respaldar-moderados-prision": { requirements: { not: { decision: "respaldar-moderados-prision" } } },
    "respaldar-duros-prision": { requirements: { not: { decision: "respaldar-duros-prision" } } },
  },
  "vida-exilio": {
    "entrevista-exilio": { requirements: { not: { decision: "entrevista-exilio" } } },
    "retorno-negociado": { hint: "Acuerdo con Fiscalía · pueden bloquear el regreso", requirements: { not: { decision: "retorno-negociado" } } },
    "asesor-internacional": { requirements: { not: { decision: "asesor-internacional" } } },
  },
  "tribunal-internacional": {
    "defensa-internacional": { requirements: { not: { decision: "defensa-internacional" } } },
    "gira-denuncia-exilio": { requirements: { not: { decision: "gira-denuncia-exilio" } } },
  },
  "coalicion-exilio": {
    "frente-amplio-exilio": { requirements: { not: { decision: "frente-amplio-exilio" } } },
    "movimiento-propio-exilio": { requirements: { not: { decision: "movimiento-propio-exilio" } } },
  },
  "ultima-empresa": {
    "rechazar-ultima-empresa": { hiddenEffects: { familyStress: -5, credibility: 3 } },
  },
  "promesa-provincial-pendiente": {
    "postergar-promesa-provincial": { requirements: { eventCount: { id: "promesa-provincial-pendiente", max: 0 } } },
  },
  "mocion-vacancia": {
    "calle-contra-vacancia": { hint: "Movilización · puede mostrar fuerza o debilidad" },
  },
};

const OUTCOME_HEADLINES = {
  "herencia-gana": "El apellido asegura un escaño en Diputados",
  "herencia-pierde": "La derrota te convierte en figura nacional",
  "ruta-propia": "Empiezas una carrera separada del apellido",
  "viral-comites": "La audiencia organiza comités en varias ciudades",
  "viral-fugaz": "La atención desaparece antes de formar una base",
  "viral-ingresos": "La publicidad paga las cuentas y divide a tus seguidores",
  "renovacion-triunfa": "La lista joven toma el comité ejecutivo",
  "renovacion-expulsada": "La cúpula te expulsa y tu desafío gana apoyo",
  "cuota-partidaria": "La dirigencia te entrega una secretaría",
  "cliente-electo": "Tu primer cliente gana la elección",
  "cliente-derrotado": "La campaña pierde, pero cobras tus honorarios",
  "facturas-pasan": "El órgano electoral aprueba las facturas",
  "facturas-observadas": "Los comprobantes inflados quedan observados",
  "obra-transparente": "Contraloría respalda la licitación transparente",
  "obra-inaugurada": "La carretera abre y la constructora cobra el favor",
  "audio-filtrado": "Un audio del acuerdo abre diligencias fiscales",
  "gobierno-regional": "La maquinaria te lleva al gobierno regional",
  "regional-derrota": "Pierdes la elección y conservas las deudas",
  "liderazgo-regional": "La lista independiente gana por poco",
  "liderazgo-oposicion": "La derrota instala una oposición regional propia",
  "protesta-conquista": "El Gobierno cede ante la protesta",
  "protesta-reprimida": "Los enfrentamientos recaen sobre tu liderazgo",
  "mesa-acuerdo": "La mediación consigue un acuerdo parcial",
  "mesa-fracasa": "Los dos bandos rompen contigo",
  "ciudad-limpia": "El nuevo servicio mejora la ciudad",
  "huelga-limpieza": "La huelga deja basura acumulada en las calles",
  "contrato-silencioso": "La empresa amiga gana y financia tu organización",
  "contrato-denunciado": "Un competidor entrega el contrato a la prensa",
  "operador-legislativo": "Los futuros candidatos quedan en deuda contigo",
  "nuevo-discurso": "Tu ruptura democrática abre nuevas alianzas",
  "base-movilizada": "La antigua base vuelve a organizarse",
  "operativo": "Fiscalía responde al discurso con un operativo",
  "aporte-publico": "El aporte registrado no compra favores secretos",
  "antesala": "El intermediario exige una confirmación final",
  "trato-cancelado": "Detienes la entrega antes de dejar una prueba",
  "acceso-palacio": "El dinero abre una línea directa con Palacio",
  "colaborador-eficaz": "Un colaborador entrega tu nombre a Fiscalía",
  "clip-solvente": "Tu explicación técnica domina la conversación",
  "clip-aburrido": "Las cifras no conectan con la audiencia",
  "ataque-demoledor": "El rival pierde el control en vivo",
  "ataque-rebote": "El ataque se vuelve contra ti",
  "red-formal": "Los aportes registrados resisten la auditoría",
  "caja-dos": "La caja oculta queda atada a nuevos favores",
  "agenda-incautada": "Una agenda incautada contiene tus iniciales",
  "consultora-crece": "La consultora consigue contratos reales",
  "consultora-falla": "La inversión fracasa por falta de clientes",
  "triangulacion-rentable": "Las facturas falsas alimentan una reserva opaca",
  "proveedor-confiesa": "Un proveedor revela la triangulación",
  "inversores-entran": "Los inversionistas pagan tus deudas y cobran acceso",
  "inversores-rechazan": "Solo consigues un préstamo costoso",
  "consultoria-rescate": "El trabajo privado estabiliza tus cuentas",
  "negocio-oculto": "El negocio ilícito genera efectivo sin alertas inmediatas",
  "socio-capturado": "Un socio detenido te entrega para reducir su pena",
  "sucesor-gana": "Tu sucesor gana y conserva parte del equipo",
  "sucesor-pierde": "La oposición gana y termina tu continuidad",
  "senado-electo": "Obtienes un escaño en el Senado",
  "senado-derrota": "Pierdes el Senado y conservas la organización",
  "diputados-electo": "Obtienes un escaño en Diputados",
  "diputados-derrota": "Pierdes en Diputados, pero fortaleces la estructura",
  "eleccion-espera": "Guardas recursos para el siguiente ciclo",
  "gestion-ministerial": "La gestión ministerial eleva tu perfil",
  "ministro-fusible": "El Gobierno sacrifica tu ministerio",
  "voz-independiente": "Rechazar el ministerio refuerza tu autonomía",
  "partido-controlado": "Tu lista toma el control del partido",
  "interna-perdida": "Pierdes la interna y parte del equipo",
  "cuota-ejecutiva": "Obtienes poder de veto sin dirigir el partido",
  "dialogo-funciona": "El diálogo levanta los bloqueos",
  "dialogo-fracasa": "La mesa fracasa y debilita al Gobierno",
  "orden-restaurado": "El estado de emergencia despeja las vías",
  "represion-fatal": "La operación deja víctimas y una investigación",
  "foro-impacta": "El foro abre contactos internacionales",
  "fondo-productivo": "El programa extranjero amplía tu red territorial",
  "fondo-cuestionado": "La prensa investiga el origen de los fondos",
  "becarios-lideres": "Los primeros becarios llegan a cargos locales",
  "fundacion-costosa": "El programa funciona, pero agota recursos",
  "fundacion-opaca": "La fundación financia operadores regionales",
  "fundacion-auditada": "Una auditoría encuentra beneficiarios fantasma",
  "libro-exito": "Las memorias reabren el debate nacional",
  "demandas-memorias": "Antiguos aliados demandan por tus memorias",
  "libro-prudente": "La versión prudente protege a tus aliados",
  "sucesora-independiente": "La sucesora crece y deja de obedecerte",
  "sucesora-se-desinfla": "La popularidad no consigue organización",
  "operador-hereda": "El operador conserva y amplía tu maquinaria",
  "operador-traiciona": "El heredero pacta con un rival",
  "despedida-politica": "Anuncias el cierre definitivo de tu carrera",
  "una-campana-mas": "Preparas un último ciclo político",
  "dinastia-interna-ganada": "La nueva generación toma el partido familiar",
};

const OUTCOME_TEXT_PATCHES = {
  "lanzamiento-presidencial": "Empieza una campaña nacional. Debes construir organización, cuidar la caja y convencer a votantes fuera de tu base.",
  "viral-comites": "La audiencia abre comités en varias ciudades y empieza a convertirse en una organización territorial.",
  "renovacion-triunfa": "La lista joven gana el comité ejecutivo y te entrega el control de las próximas candidaturas.",
  "cliente-electo": "Tu cliente gana la elección, recomienda tu trabajo y te conecta con nuevas campañas.",
  "facturas-pasan": "El partido aprueba las facturas sin observarlas; cobras, pero quedas ligado a una contabilidad irregular.",
  "mesa-acuerdo": "Gobierno y dirigentes aceptan un acuerdo parcial, levantan la protesta y te reconocen como mediador.",
  "mesa-fracasa": "La negociación se rompe y ambos bandos te acusan de haber favorecido al otro.",
  "clip-aburrido": "Tus cifras son correctas, pero no conectan con la audiencia y el rival domina la conversación.",
  "voz-independiente": "Rechazas el ministerio, conservas autonomía y quedas fuera de las decisiones del gabinete.",
  "fondo-productivo": "El programa financiado desde el extranjero funciona y amplía tu red territorial.",
  "costo-pensiones": "El déficit supera lo previsto y obliga al gobierno a recortar otros programas.",
  "desmentido-aceptado": "Medios y verificadores respaldan tus pruebas y la campaña coordinada pierde credibilidad.",
  "archivo-desaparece": "El expediente deja de circular, aunque quien te ayudó conserva una deuda que podrá cobrar después.",
  "votos-comprados": "La moción fracasa por pocos votos, pero los congresistas que te salvaron ahora esperan favores.",
  "gabinete-politico": "Las bancadas conceden una tregua de cien días a cambio de controlar ministerios clave.",
  "ajuste-recesivo": "La recaudación cae, aumenta el desempleo y el costo político del ajuste llega al gobierno.",
  "nota-primeriza": "La portada expone un conflicto de interés local y te abre espacio dentro de la redacción.",
  "ong-no-detecta": "La revisión superficial no detecta la planilla política, pero el registro queda disponible para otra auditoría.",
  "juez-designado": "La red gana un aliado en el sistema judicial y queda registrada la coordinación que hizo posible su nombramiento.",
  "chats-magistrado": "El nombramiento se anula y la fiscalía abre una investigación por las coordinaciones reveladas.",
  "fondos-salud-desviados": "El desvío regional perjudica a pacientes y pone bajo sospecha toda la reforma sanitaria.",
  "salud-convenio-sobrecosto": "Las facturas duplicadas convierten la respuesta rápida en una auditoría por sobrecostos.",
  "censura-contundente": "El Congreso censura al ministro y la confrontación acelera la ruptura de tu coalición.",
  "comision-selectiva": "El informe castiga a tus rivales, protege a tus aliados y compromete la credibilidad de la comisión.",
  "documental-complejo": "La mirada crítica recibe una acogida favorable y fortalece un legado menos perfecto, pero más creíble.",
  "aliado-guarda-silencio": "No recibe el indulto, pero mantiene el pacto y conserva información que podría usar más adelante.",
  "consejo-critica": "Tus intervenciones dominan el debate y convierten al consejo en un contrapeso visible del gobierno.",
  "registro-celda": "Los mensajes hallados en tu celda abren una carpeta fiscal adicional y complican tu defensa.",
  "adenda-explicada": "La auditoría descarta el delito principal y reduce el caso a fallas administrativas.",
  "dinastia-interna-ganada": "Tu lista desplaza a la antigua generación y toma el control del partido familiar.",
  "dinastia-interna-perdida": "La vieja generación conserva el partido y te obliga a construir una organización propia.",
  "comunidad-rechaza-postergacion": "La comunidad declara incumplida tu promesa, vuelve a protestar y entrega la plaza a tus rivales.",
  "partido-obedece-expresidente": "Tus delegados conservan la dirección y el partido continúa obedeciendo tus decisiones.",
  "archivo-gobierno-incompleto": "La entrega incompleta lleva a la comisión a investigar qué documentos ocultó tu gobierno.",
  "relato-presidencial-convence": "Tu versión domina la cumbre, circula en medios y reactiva a tus seguidores.",
  "archivo-internacional-contradice": "Documentos regionales contradicen tus cifras y concentran el debate en las omisiones de tu gobierno.",
  "fundacion-opaca": "Los fondos pagan locales, consultores y operadores, pero dejan beneficiarios difíciles de justificar.",
  "fundacion-auditada": "La auditoría conecta becas y contratos con personas de tu organización.",
  "sucesora-se-desinfla": "Convoca actos y atención, pero no consigue equipos capaces de sostener una campaña nacional.",
  "represion-fatal": "La operación deja víctimas, rompe la mesa de diálogo y abre una investigación sobre la cadena de mando.",
  "gobierno-regional": "La red provincial gana distritos clave y convierte años de trabajo territorial en una victoria regional.",
  "cliente-derrotado": "La candidatura pierde, pero el equipo paga tus honorarios y te recomienda para otras campañas.",
  "lista-expresidente-gana": "Conservas la dirección mediante una votación verificable y evitas que la renovación abandone el partido.",
  "legado-internacional-equilibrado": "Universidades y foros reconocen los acuerdos logrados sin ocultar los conflictos de tu gobierno.",
  "salud-convenio-funciona": "El convenio amplía camas y medicinas con tarifas públicas y supervisión regional.",
};

const OUTCOME_PATCHES = {
  "obra-provincial-recuperada": { weightModifiers: [{ when: { any: [{ outcome: "protocolo-rondas" }, { outcome: "tecnico-aclara-firma" }, { outcome: "estudio-independiente-mina" }] }, multiply: 1.25 }] },
  "obra-provincial-adenda": { weightModifiers: [{ when: { any: [{ outcome: "rondas-resisten" }, { outcome: "municipio-cierra-filas" }, { outcome: "frente-cierra-carretera" }] }, multiply: 1.25 }] },
  "empresa-separada-politica": { weightModifiers: [{ when: { any: [{ outcome: "adenda-explicada" }, { outcome: "datos-borrados" }, { outcome: "mina-remedia" }] }, multiply: 1.3 }] },
  "empresa-familiar-controlada": { weightModifiers: [{ when: { any: [{ outcome: "auditoria-sobrecosto" }, { outcome: "campana-datos" }, { outcome: "mina-bloqueada" }] }, multiply: 1.3 }] },
  "medio-podcaster-independiente": { weightModifiers: [{ when: { any: [{ outcome: "reportaje-consorcio" }, { outcome: "stream-patrocinado-claro" }, { outcome: "reglas-academicas" }, { outcome: "comunidad-se-organiza" }, { outcome: "canal-opinion" }] }, multiply: 1.3 }] },
  "medio-podcaster-partidario": { weightModifiers: [{ when: { any: [{ outcome: "exclusiva-canal" }, { outcome: "campana-regulacion" }, { outcome: "expertos-al-proyecto" }] }, multiply: 1.3 }] },
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
  "investigacion-se-acota": { addTags: ["proceso-judicial-abierto"], removeTags: ["investigado", "investigacion-formalizada"], nextEvent: "juicio-en-libertad" },
  "allanamiento-fiscal": { addTags: ["orden-judicial-pendiente"], removeTags: ["investigacion-formalizada"] },
  "salida-a-tiempo": { addTags: ["orden-judicial-pendiente", "proceso-judicial-abierto"] },
  "captura-aeropuerto": { addTags: ["proceso-judicial-abierto"], removeTags: ["investigacion-formalizada"] },
  "arresto-domiciliario": { addTags: ["proceso-judicial-abierto"], removeTags: ["orden-judicial-pendiente", "investigacion-formalizada"], nextEvent: "revision-arresto-domiciliario" },
  "prision-preventiva-orden": { addTags: ["proceso-judicial-abierto"], removeTags: ["orden-judicial-pendiente", "investigacion-formalizada"] },
  "acuerdo-fiscal": { addTags: ["caso-principal-cerrado"], removeTags: ["orden-judicial-pendiente", "proceso-judicial-abierto", "investigado", "investigacion-formalizada"] },
  "oferta-rechazada": { addTags: ["proceso-judicial-abierto"], removeTags: ["orden-judicial-pendiente", "investigacion-formalizada"] },
  "asilo-concedido": { addTags: ["orden-judicial-pendiente", "proceso-judicial-abierto"], removeTags: ["investigacion-formalizada"] },
  "extradicion-rapida": { addTags: ["proceso-judicial-abierto"], removeTags: ["orden-judicial-pendiente", "investigacion-formalizada"] },
  "retorno-con-garantias": { addTags: ["proceso-judicial-abierto"], removeTags: ["orden-judicial-pendiente"], nextEvent: "juicio-en-libertad" },
  "beneficio-penitenciario": { addTags: ["proceso-judicial-abierto"], nextEvent: "juicio-en-libertad" },
  "apelacion-libera": { effects: { legalRisk: -24, approval: 5 }, addTags: ["proceso-judicial-abierto"], nextEvent: "juicio-en-libertad" },
  "apelacion-denegada": { effects: { legalRisk: -5 }, addTags: ["apelacion-denegada"] },
  "sentencia-firme": { addTags: ["inhabilitado", "caso-principal-cerrado"], removeTags: ["proceso-judicial-abierto", "investigado", "investigacion-formalizada"] },
  "obra-prometida-entregada": { addTags: ["promesa-regional-resuelta"] },
  "comunidad-rechaza-postergacion": { addTags: ["promesa-regional-resuelta"] },
  "promesa-provincial-cerrada": { addTags: ["promesa-regional-resuelta"] },
};

const OBJECT_FIELDS = ["effects", "hiddenEffects", "nationalEffects", "relationEffects"];
const ARRAY_FIELDS = ["weightModifiers", "addTags", "removeTags", "addAllies", "addEnemies", "addFavors", "addPromises", "addScandals", "addInvestigations", "addCrises", "addWars"];

function mergePayload(payload, patch = {}) {
  const merged = { ...payload, ...patch };
  for (const field of OBJECT_FIELDS) if (patch[field]) merged[field] = { ...(payload[field] ?? {}), ...patch[field] };
  for (const field of ARRAY_FIELDS) if (patch[field]) merged[field] = [...(payload[field] ?? []), ...patch[field]];
  if (merged.addInvestigations?.length && Number(merged.effects?.legalRisk ?? 0) >= 10) {
    merged.addTags = [...new Set([...(merged.addTags ?? []), "investigado"])];
  }
  return merged;
}

export function applyNarrativeCausality(events) {
  const eventIds = new Set(events.map((event) => event.id));
  const missingEvents = [...Object.keys(EVENT_PATCHES), ...Object.keys(OPTION_PATCHES), ...SINGLE_OCCURRENCE_EVENTS].filter((id) => !eventIds.has(id));
  const outcomeIds = new Set(events.flatMap((event) => event.options.flatMap((option) => option.outcomes ?? [])).map((outcome) => outcome.id));
  const patchedOutcomeIds = new Set([...Object.keys(OUTCOME_PATCHES), ...Object.keys(OUTCOME_HEADLINES), ...Object.keys(OUTCOME_TEXT_PATCHES)]);
  const missingOutcomes = [...patchedOutcomeIds].filter((id) => !outcomeIds.has(id));
  const missingOptions = Object.entries(OPTION_PATCHES).flatMap(([eventId, patches]) => {
    const optionIds = new Set(events.find((event) => event.id === eventId)?.options.map((option) => option.id) ?? []);
    return Object.keys(patches).filter((optionId) => !optionIds.has(optionId)).map((optionId) => `${eventId}/${optionId}`);
  });
  if (missingEvents.length || missingOptions.length || missingOutcomes.length) {
    throw new Error(`Causalidad narrativa desconectada: ${[...missingEvents, ...missingOptions, ...missingOutcomes].join(", ")}`);
  }
  const transformedEvents = events.map((event) => {
    const options = event.options.map((option) => ({
      ...mergePayload(option, OPTION_PATCHES[event.id]?.[option.id]),
      outcomes: option.outcomes?.map((outcome) => mergePayload(outcome, {
        ...(OUTCOME_HEADLINES[outcome.id] ? { headline: OUTCOME_HEADLINES[outcome.id] } : {}),
        ...(OUTCOME_TEXT_PATCHES[outcome.id] ? { text: OUTCOME_TEXT_PATCHES[outcome.id] } : {}),
        ...(OUTCOME_PATCHES[outcome.id] ?? {}),
      })),
    }));
    const recurrencePatch = SINGLE_OCCURRENCE_EVENTS.has(event.id) ? { maxOccurrences: 1 } : {};
    return { ...mergePayload(event, { ...recurrencePatch, ...(EVENT_PATCHES[event.id] ?? {}) }), options };
  });
  const incompleteOutcomes = transformedEvents.flatMap((event) => event.options.flatMap((option) => (option.outcomes ?? [])
    .filter((outcome) => !outcome.headline?.trim() || !outcome.text?.trim())
    .map((outcome) => `${event.id}/${option.id}/${outcome.id}`)));
  if (incompleteOutcomes.length) throw new Error(`Resultados narrativos incompletos: ${incompleteOutcomes.join(", ")}`);
  return transformedEvents;
}

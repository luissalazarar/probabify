export const backgroundEvents = [
  {
    id: "memoria-mrta", initialOnly: true, maxOccurrences: 1, weight: 8, requirements: { background: "reinsercion-mrta" }, category: "background",
    title: "Una exrehén pide una reunión", kicker: "Tu pasado · memoria y responsabilidad", description: "Una persona afectada por la antigua organización acepta conversar en privado. No busca venganza: quiere saber qué reconoces y qué sigues justificando.",
    options: [
      { id: "mrta-escuchar", label: "Escuchar y reconocer el daño", hint: "Legitimidad democrática · ruptura interna", effects: { approval: 7, influence: -4, legalRisk: -5 }, hiddenEffects: { credibility: 13, polarization: -10, personalReputation: 12 }, addTags: ["memoria-reconocida"], outcomes: [{ id: "mrta-encuentro", weight: 100, headline: "Una reunión privada cambia el tono de tu retorno", text: "No existe reconciliación completa, pero tu reconocimiento abre espacios civiles." }] },
      { id: "mrta-relato-propio", label: "Defender tu relato político", hint: "Conserva antiguos aliados · rechazo público", effects: { influence: 7, approval: -6 }, hiddenEffects: { polarization: 11, credibility: -7 }, outcomes: [{ id: "mrta-sin-acuerdo", weight: 100, headline: "La conversación termina sin reconciliación", text: "Tu antigua red celebra la firmeza y organizaciones de víctimas se alejan." }] },
    ],
  },
  {
    id: "memoria-sl", initialOnly: true, maxOccurrences: 1, weight: 10, requirements: { background: "reinsercion-sl" }, category: "background",
    title: "Una comunidad reconoce tu antiguo alias", kicker: "Tu pasado · el estigma no es abstracto", description: "Durante una visita rural, familiares de víctimas vinculan tu antiguo alias con la estructura que operó en la zona. La reunión se detiene y todas las cámaras apuntan hacia ti.",
    options: [
      { id: "sl-archivo-verdad", label: "Entregar información a una comisión", hint: "Alto costo interno · reduce riesgo futuro", effects: { influence: -12, legalRisk: -12, approval: 5 }, hiddenEffects: { credibility: 15, ruralApproval: 8, prosecutionRelation: 12 }, addEnemies: [{ id: "viejos-mandos-sl", label: "Antiguos mandos expuestos" }], addTags: ["colabora-memoria"], outcomes: [{ id: "sl-informacion-entregada", weight: 100, headline: "Entregas información sobre una estructura regional", text: "La decisión ayuda a esclarecer casos y rompe definitivamente con antiguos cuadros." }] },
      { id: "sl-negar-alias", label: "Negar cualquier responsabilidad", hint: "Mantiene la red · pruebas futuras", effects: { influence: 8, approval: -13, legalRisk: 12 }, hiddenEffects: { credibility: -16, leakExposure: 18, polarization: 14 }, addScandals: [{ id: "alias-negado", label: "Negación de un antiguo alias" }], outcomes: [{ id: "sl-testigos", weight: 100, headline: "Nuevos testigos contradicen tu versión", text: "La negación convierte el pasado en el centro de tu carrera actual." }] },
    ],
  },
  {
    id: "archivo-palacio", initialOnly: true, maxOccurrences: 1, weight: 8, requirements: { background: "dinastia-palacio" }, category: "background",
    title: "Las cajas que salieron de Palacio", kicker: "Tu herencia · archivos de un gobierno", description: "Un exsecretario conserva agendas y actas del gobierno familiar. Publicarlas puede aclarar decisiones o revelar acuerdos que sostienen tu maquinaria actual.",
    options: [
      { id: "abrir-archivo-palacio", label: "Donar el archivo completo", hint: "Credibilidad · aliados expuestos", effects: { approval: 8, influence: -5 }, hiddenEffects: { credibility: 14, leakExposure: -8, familyStress: 10 }, addEnemies: [{ id: "exministros-archivo", label: "Exministros expuestos por el archivo" }], outcomes: [{ id: "archivo-presidencial-abierto", weight: 100, headline: "El archivo familiar queda abierto a investigadores", text: "La transparencia reduce rumores, aunque varios antiguos aliados rompen contigo." }] },
      { id: "guardar-archivo-palacio", label: "Mantenerlo bajo control familiar", hint: "Protege la red · filtración posible", effects: { influence: 9 }, hiddenEffects: { credibility: -8, leakExposure: 17 }, addFavors: [{ id: "archivo-gobierno", label: "Controlas documentos del antiguo gobierno" }], outcomes: [{ id: "archivo-reservado-palacio", weight: 100, headline: "La familia conserva el archivo presidencial", text: "Los documentos siguen protegiendo acuerdos y también pueden convertirse en chantaje." }] },
    ],
  },
  {
    id: "herencia-regional", initialOnly: true, maxOccurrences: 1, weight: 9, requirements: { background: "dinastia-regional" }, category: "background",
    title: "Un alcalde del clan exige presupuesto", kicker: "Tu herencia · la red territorial cobra", description: "Un pariente alcalde reclama recursos para una obra emblemática. El proyecto es necesario, pero el proveedor pertenece a otro integrante de la familia.",
    options: [
      { id: "licitacion-abierta-clan", label: "Exigir una licitación abierta", hint: "Rompe disciplina familiar · protege reputación", effects: { approval: 6, influence: -4 }, hiddenEffects: { credibility: 10, familyStress: 13, regionalSupport: -3 }, outcomes: [{ id: "clan-pierde-contrato", weight: 100, headline: "El clan pierde un contrato que consideraba suyo", text: "La obra continúa con otro proveedor y tu independencia territorial aumenta." }] },
      { id: "proveedor-familiar", label: "Respaldar al proveedor familiar", hint: "Estructura y dinero · conflicto de interés", effects: { dirtyMoney: 38000, influence: 8, legalRisk: 11 }, hiddenEffects: { regionalSupport: 10, leakExposure: 12 }, addScandals: [{ id: "proveedor-clan", label: "Proveedor vinculado al clan regional" }], outcomes: [{ id: "obra-del-clan", weight: 100, headline: "La red familiar conserva la obra regional", text: "El municipio inaugura rápido y opositores empiezan a revisar accionistas." }] },
    ],
  },
  {
    id: "archivo-parlamentario", initialOnly: true, maxOccurrences: 1, weight: 9, requirements: { background: "dinastia-parlamentaria" }, category: "background",
    title: "El cuaderno de veinte años de pactos", kicker: "Tu herencia · memoria legislativa", description: "El antiguo secretario de la familia entrega un cuaderno con votos, favores y promesas de cinco congresos. Puede servir para negociar o para demostrar cómo operaba el sistema.",
    options: [
      { id: "sistematizar-pactos", label: "Convertirlo en un archivo institucional", hint: "Credibilidad · pierde valor como presión", effects: { influence: -3, approval: 5 }, hiddenEffects: { credibility: 12, congressSupport: 5 }, outcomes: [{ id: "historia-legislativa", weight: 100, headline: "Un archivo revela la historia de varias reformas", text: "Académicos y periodistas usan el material sin que puedas controlar todas sus conclusiones." }] },
      { id: "usar-cuaderno-pactos", label: "Usarlo para cobrar favores", hint: "Influencia inmediata · exposición futura", effects: { influence: 13, legalRisk: 5 }, hiddenEffects: { congressSupport: 14, credibility: -9, leakExposure: 15 }, addFavors: [{ id: "cuaderno-pactos", label: "Cuaderno familiar de pactos parlamentarios" }], outcomes: [{ id: "votos-del-cuaderno", weight: 100, headline: "Viejas deudas cambian una votación actual", text: "La familia demuestra que sus archivos todavía tienen poder." }] },
    ],
  },
  {
    id: "justicia-rondas", initialOnly: true, maxOccurrences: 1, weight: 9, requirements: { background: "provincia-rondas" }, category: "background",
    title: "Fiscalía revisa una antigua asamblea comunal", kicker: "Tu origen · justicia comunal y Estado", description: "Un acta de las rondas registra una sanción cuestionada. Debes defender la autonomía comunal o aceptar una investigación ordinaria.",
    options: [
      { id: "cooperar-rondas", label: "Cooperar y fijar nuevos protocolos", hint: "Reduce riesgo · críticas de la base", effects: { legalRisk: -7, approval: 3 }, hiddenEffects: { judiciaryRelation: 10, credibility: 9, ruralApproval: -4 }, addTags: ["rondas-reguladas"], outcomes: [{ id: "protocolo-rondas", weight: 100, headline: "Las rondas aceptan reglas y supervisión nuevas", text: "La investigación se acota y parte de la comunidad acusa una cesión ante Lima." }] },
      { id: "defender-autonomia-rondas", label: "Cerrar filas con la asamblea", hint: "Respaldo rural · riesgo judicial", effects: { approval: 6, influence: 5, legalRisk: 10 }, hiddenEffects: { ruralApproval: 13, judiciaryRelation: -12, polarization: 7 }, outcomes: [{ id: "rondas-resisten", weight: 100, headline: "La comunidad impide que el caso rompa a las rondas", text: "La base se fortalece mientras el expediente judicial permanece abierto." }] },
    ],
  },
  {
    id: "auditoria-municipal", initialOnly: true, maxOccurrences: 1, weight: 8, requirements: { background: "provincia-tecnico" }, category: "background",
    title: "Una auditoría encuentra el expediente que diseñaste", kicker: "Tu origen · la firma técnica también pesa", description: "Un proyecto que preparaste cuando trabajabas en el municipio presenta sobrecostos posteriores. Puedes explicar públicamente tu parte o ayudar al municipio a defender todo el proceso.",
    options: [
      { id: "separar-etapas-auditoria", label: "Publicar documentos y separar responsabilidades", hint: "Credibilidad · rompe con antiguos jefes", effects: { approval: 5, influence: -3, legalRisk: -5 }, hiddenEffects: { credibility: 12, personalReputation: 8 }, addEnemies: [{ id: "exjefe-municipal", label: "Antiguo jefe afectado por la auditoría" }], outcomes: [{ id: "tecnico-aclara-firma", weight: 100, headline: "Los documentos delimitan tu responsabilidad", text: "La auditoría continúa contra decisiones tomadas después de tu salida." }] },
      { id: "defensa-corporativa-municipio", label: "Defender todo el expediente", hint: "Lealtad institucional · riesgo compartido", effects: { influence: 6, legalRisk: 7 }, hiddenEffects: { credibility: -5, regionalSupport: 6 }, outcomes: [{ id: "municipio-cierra-filas", weight: 100, headline: "El municipio presenta una defensa conjunta", text: "Proteges al equipo anterior y quedas unido al resultado de la investigación." }] },
    ],
  },
  {
    id: "retorno-minera", initialOnly: true, maxOccurrences: 1, weight: 10, requirements: { background: "provincia-ambiental" }, category: "background",
    title: "La minera regresa con un nuevo estudio", kicker: "Tu origen · el conflicto que te hizo conocido", description: "La empresa presenta cambios técnicos y ofrece un fondo local. Tu frente espera un rechazo inmediato, mientras trabajadores piden revisar la propuesta.",
    options: [
      { id: "mesa-tecnica-minera", label: "Aceptar una revisión independiente", hint: "Solución posible · riesgo de traición", effects: { approval: 3, influence: -3 }, hiddenEffects: { credibility: 10, businessSupport: 7, ruralApproval: -5, polarization: -8 }, outcomes: [{ id: "estudio-independiente-mina", weight: 100, headline: "Una revisión independiente reemplaza las consignas", text: "El frente se divide, pero la discusión empieza a girar sobre evidencia verificable." }] },
      { id: "rechazo-total-minera", label: "Rechazar cualquier retorno", hint: "Base firme · pierde inversión", effects: { approval: 7, influence: 6 }, hiddenEffects: { ruralApproval: 13, businessSupport: -15, polarization: 10 }, nationalEffects: { investment: -4, socialConflict: 5 }, outcomes: [{ id: "frente-cierra-carretera", weight: 100, headline: "El frente ambiental vuelve a movilizarse", text: "La empresa retira equipos y anuncia arbitrajes contra el Estado." }] },
    ],
  },
  {
    id: "adenda-heredada", initialOnly: true, maxOccurrences: 1, weight: 9, requirements: { background: "empresario-construccion" }, category: "background",
    title: "Una adenda antigua llega a Contraloría", kicker: "Tu empresa · el costo real de una obra", description: "Contraloría cuestiona una ampliación firmada cuando todavía dirigías la constructora. El director actual espera que uses contactos políticos.",
    options: [
      { id: "auditoria-externa-constructora", label: "Financiar una auditoría externa", hint: "Costoso · puede limpiar o confirmar", effects: { cleanMoney: -42000, legalRisk: -4 }, hiddenEffects: { credibility: 9, businessSupport: -4 }, outcomes: [{ id: "adenda-explicada", weight: 58, headline: "La auditoría justifica parte de la ampliación", text: "El caso se reduce a fallas administrativas." }, { id: "auditoria-sobrecosto", weight: 42, headline: "La auditoría confirma un sobrecosto", text: "Entregas información y el antiguo directorio queda bajo investigación.", effects: { approval: -7, legalRisk: 13 } }] },
      { id: "presionar-contraloria", label: "Activar contactos para archivar", hint: "Protege la empresa · evidencia de obstrucción", effects: { dirtyMoney: -30000, influence: 8, legalRisk: 12 }, hiddenEffects: { leakExposure: 18, credibility: -10 }, addFavors: [{ id: "archivo-adenda", label: "Presionaste para archivar una adenda" }], outcomes: [{ id: "contraloria-demora", weight: 100, headline: "La revisión queda congelada", text: "El expediente no avanza, pero varias personas conocen la llamada que lo detuvo." }] },
    ],
  },
  {
    id: "datos-plataforma", initialOnly: true, maxOccurrences: 1, weight: 9, requirements: { background: "empresario-tecnologia" }, category: "background",
    title: "Tu antigua plataforma conserva datos políticos", kicker: "Tu empresa · usuarios convertidos en electores", description: "El equipo descubre que sus datos permiten perfilar simpatías por distrito. Usarlos mejoraría cualquier campaña, pero nadie dio consentimiento para eso.",
    options: [
      { id: "borrar-perfiles-politicos", label: "Prohibir el uso y borrar perfiles", hint: "Credibilidad · pierde ventaja", effects: { influence: -4, approval: 5 }, hiddenEffects: { credibility: 13, businessSupport: -4, leakExposure: -8 }, outcomes: [{ id: "datos-borrados", weight: 100, headline: "La plataforma elimina perfiles políticos sensibles", text: "Publicas una política estricta y renuncias a una ventaja electoral enorme." }] },
      { id: "microsegmentar-plataforma", label: "Usarlos mediante una consultora", hint: "Influencia · escándalo tecnológico", effects: { influence: 13, dirtyMoney: 25000, legalRisk: 8 }, hiddenEffects: { mediaNotoriety: 8, credibility: -13, leakExposure: 17 }, addScandals: [{ id: "perfilado-politico", label: "Uso político de datos de usuarios" }], outcomes: [{ id: "campana-datos", weight: 100, headline: "La microsegmentación cambia una campaña", text: "Los mensajes llegan con precisión y el secreto queda compartido con analistas externos." }] },
    ],
  },
  {
    id: "pasivo-minero", initialOnly: true, maxOccurrences: 1, weight: 10, requirements: { background: "empresario-minero" }, category: "background",
    title: "Una laguna cercana a la mina cambia de color", kicker: "Tu empresa · el pasivo no desaparece", description: "La comunidad culpa a una operación antigua de tu grupo. Los técnicos no tienen una conclusión definitiva y el mercado teme una paralización.",
    options: [
      { id: "remediacion-inmediata", label: "Financiar remediación y monitoreo", hint: "Muy costoso · protege licencia social", effects: { cleanMoney: -90000, approval: 7 }, hiddenEffects: { ruralApproval: 13, credibility: 10, businessSupport: -4 }, nationalEffects: { investment: -1, socialConflict: -4 }, outcomes: [{ id: "mina-remedia", weight: 100, headline: "La empresa inicia una remediación supervisada", text: "No admites responsabilidad legal, pero la respuesta reduce el conflicto." }] },
      { id: "negar-pasivo-minero", label: "Negar relación hasta tener pruebas", hint: "Protege caja · conflicto creciente", effects: { influence: 4 }, hiddenEffects: { ruralApproval: -15, credibility: -10, businessSupport: 8, polarization: 9 }, nationalEffects: { socialConflict: 7 }, outcomes: [{ id: "mina-bloqueada", weight: 100, headline: "La comunidad bloquea accesos a la mina", text: "La producción se detiene y el caso se vuelve nacional." }] },
    ],
  },
  {
    id: "fuente-del-pasado", initialOnly: true, maxOccurrences: 1, weight: 9, requirements: { background: "podcaster-investigacion" }, category: "background",
    title: "La fuente del reportaje censurado vuelve a llamar", kicker: "Tu canal · una deuda periodística", description: "La fuente conserva documentos que tu antiguo medio nunca publicó. Exige anonimato total y que compartas el material con otros periodistas.",
    options: [
      { id: "consorcio-periodistico", label: "Publicar mediante un consorcio", hint: "Mayor verificación · compartes la exclusiva", effects: { cleanMoney: -9000, influence: 5 }, hiddenEffects: { credibility: 14, pressSupport: 13, leakExposure: 5 }, addAllies: [{ id: "consorcio-periodistas", label: "Consorcio de investigación" }], outcomes: [{ id: "reportaje-consorcio", weight: 100, headline: "Varios medios publican la investigación censurada", text: "La verificación conjunta protege a la fuente y amplifica el impacto." }] },
      { id: "exclusiva-propia", label: "Guardar la exclusiva para tu canal", hint: "Máxima audiencia · mayor riesgo", effects: { influence: 10, approval: 5, legalRisk: 7 }, hiddenEffects: { mediaNotoriety: 15, credibility: 3, leakExposure: 15 }, outcomes: [{ id: "exclusiva-canal", weight: 100, headline: "Tu canal publica solo el expediente censurado", text: "La audiencia se dispara y tus abogados reciben las primeras cartas." }] },
    ],
  },
  {
    id: "patrocinador-viral", initialOnly: true, maxOccurrences: 1, weight: 10, requirements: { background: "podcaster-viral" }, category: "background",
    title: "La marca que financió tus primeros streams pide un favor", kicker: "Tu canal · audiencia y patrocinio", description: "La empresa quiere que ataques una regulación sin revelar el contrato. Gran parte del equipo depende todavía de ese patrocinio.",
    options: [
      { id: "declarar-patrocinio-viral", label: "Debatir y revelar el patrocinio", hint: "Ingreso limpio · pierde espontaneidad", effects: { cleanMoney: 26000, approval: -2 }, hiddenEffects: { credibility: 9, businessSupport: 5 }, outcomes: [{ id: "stream-patrocinado-claro", weight: 100, headline: "La audiencia conoce quién pagó el debate", text: "El contenido rinde menos, pero el contrato no se convierte en un secreto." }] },
      { id: "ataque-pagado-viral", label: "Atacar sin mencionar el contrato", hint: "Caja alta · filtración futura", effects: { dirtyMoney: 52000, influence: 7, legalRisk: 6 }, hiddenEffects: { credibility: -12, leakExposure: 18, polarization: 9 }, addFavors: [{ id: "ataque-patrocinado", label: "Ataque pagado por un patrocinador" }], outcomes: [{ id: "campana-regulacion", weight: 100, headline: "Una transmisión viral frena la regulación", text: "La marca celebra el resultado y conserva todos los comprobantes." }] },
    ],
  },
  {
    id: "debate-universitario", initialOnly: true, maxOccurrences: 1, weight: 9, requirements: { background: "podcaster-academico" }, category: "background",
    title: "Tus colegas cuestionan el salto a la política", kicker: "Tu canal · academia e independencia", description: "La universidad organiza un debate sobre si tu plataforma sigue divulgando o ya funciona como proyecto electoral. Estudiantes y colegas esperan una definición.",
    options: [
      { id: "separar-academia-politica", label: "Separar cátedra y proyecto político", hint: "Credibilidad · crecimiento más lento", effects: { influence: -4, approval: 3 }, hiddenEffects: { credibility: 14, internationalReputation: 7, partyCohesion: -5 }, addTags: ["independencia-academica"], outcomes: [{ id: "reglas-academicas", weight: 100, headline: "Publicas reglas para separar docencia y activismo", text: "La comunidad académica respalda los límites y tu equipo político pierde acceso directo." }] },
      { id: "laboratorio-politico", label: "Convertir ideas en un laboratorio político", hint: "Influencia técnica · conflicto de interés", effects: { influence: 10, cleanMoney: 12000 }, hiddenEffects: { credibility: -5, partyCohesion: 8, mediaNotoriety: 6 }, addTags: ["laboratorio-politico", "partido-formal"], outcomes: [{ id: "expertos-al-proyecto", weight: 100, headline: "Un grupo de expertos se suma a tu proyecto", text: "El canal obtiene propuestas concretas y la universidad debate posibles conflictos." }] },
    ],
  },
];

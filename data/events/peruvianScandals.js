export const peruvianScandalEvents = [
  {
    id: "rumor-ataud-garnica", repeatable: false, weight: 12, maxOccurrences: 1,
    requirements: { all: [{ age: { min: 30 } }, { origin: "podcaster" }] }, category: "media",
    title: "El ataúd cerrado de Alan Garnica", kicker: "Una muerte, una orden fiscal y millones de rumores",
    description: "El expresidente Alan Garnica muere por suicidio cuando un equipo fiscal llega a detenerlo. El velorio será con ataúd cerrado y una teoría viral asegura que escapó a París usando un doble.",
    options: [
      { id: "verificar-ataud", label: "Reconstruir las últimas horas", hint: "Periodismo lento · alta credibilidad", effects: { cleanMoney: -12000, influence: 3 }, hiddenEffects: { credibility: 15, pressSupport: 10, polarization: -6 }, outcomes: [{ id: "garnica-documentado", weight: 82, headline: "Documentos y testimonios desmontan la fuga de Garnica", text: "El reportaje confirma la muerte y muestra cómo cuentas coordinadas fabricaron detalles falsos." }, { id: "garnica-familia-cierra", weight: 18, headline: "La familia de Garnica bloquea parte del reportaje", text: "Publicas una reconstrucción incompleta y la conspiración conserva espacio.", effects: { approval: -3 } }] },
      { id: "viralizar-ataud", label: "Preguntar si Garnica sigue vivo", hint: "Audiencia enorme · desinformación", effects: { cleanMoney: 30000, influence: 11 }, hiddenEffects: { mediaNotoriety: 20, credibility: -18, polarization: 15, leakExposure: 8 }, addScandals: [{ id: "conspiracion-garnica", label: "Campaña sobre la falsa fuga de Alan Garnica" }], outcomes: [{ id: "garnica-conspiracion-explota", weight: 75, headline: "#GarnicaVive domina las redes", text: "Fotos borrosas, ataúdes falsos y supuestos vuelos convierten el rumor en movimiento político." }, { id: "garnica-demanda", weight: 25, headline: "La familia demanda al canal por explotar la muerte", text: "El pico de audiencia termina en una querella y anunciantes que se retiran.", effects: { cleanMoney: -24000, legalRisk: 16, approval: -8 } }] },
      { id: "guardar-rumor-garnica", label: "Guardar el material para la campaña", hint: "Información como arma política", effects: { influence: 6, legalRisk: 3 }, hiddenEffects: { credibility: -5, leakExposure: 14 }, addFavors: [{ id: "archivo-garnica", label: "Conservas el archivo de rumores sobre Garnica" }], outcomes: [{ id: "garnica-archivo-reservado", weight: 100, headline: "El archivo de Garnica queda fuera del aire", text: "Dirigentes de ambos lados empiezan a preguntar cuánto cuesta conocer lo que guardaste." }] },
    ],
  },
  {
    id: "cocteles-naranjas", repeatable: false, weight: 13, maxOccurrences: 1,
    requirements: { all: [{ age: { min: 30 } }, { careerTrack: "candidateReady" }] }, category: "finance",
    title: "Los cócteles que vendieron entradas imposibles", kicker: "Cientos de aportantes · una sola bolsa de dinero",
    description: "Fuerza Mandarina declara que sus cócteles financiaron la campaña de Keka Del Pino. Varias personas de la lista niegan haber comprado entradas y un ejecutivo brasileño conserva una anotación con sus iniciales.",
    options: [
      { id: "coctel-auditable", label: "Registrar entradas y aportantes reales", hint: "Menos recaudación · cuentas defendibles", effects: { cleanMoney: 22000, influence: -3, legalRisk: -4 }, hiddenEffects: { credibility: 10, prosecutionRelation: 6 }, outcomes: [{ id: "coctel-cuentas-claras", weight: 100, headline: "El cóctel recauda poco y deja recibos completos", text: "La campaña pierde despliegue, pero ningún aportante necesita memorizar una donación ajena." }] },
      { id: "coctel-pitufeo", label: "Fraccionar la bolsa entre falsos aportantes", hint: "Caja grande · investigación futura", effects: { dirtyMoney: 110000, influence: 9, legalRisk: 16 }, hiddenEffects: { leakExposure: 23, credibility: -12 }, addScandals: [{ id: "cocteles-pitufeo", label: "Aportes fraccionados en los Cócteles Mandarina" }], outcomes: [{ id: "coctel-maquinaria", weight: 67, headline: "Los cócteles financian una maquinaria nacional", text: "Cientos de fichas pequeñas convierten una gran entrega empresarial en ingresos partidarios." }, { id: "coctel-aportantes-niegan", weight: 33, headline: "Los aportantes de Fuerza Mandarina no recuerdan haber aportado", text: "Firmas repetidas y domicilios imposibles llevan el caso a una fiscalía de lavado.", effects: { approval: -12, legalRisk: 24 }, addInvestigations: [{ id: "caso-cocteles-mandarina", label: "Investigación por los Cócteles Mandarina" }] }] },
    ],
  },
  {
    id: "remix-bebito-chu-chu", repeatable: false, weight: 13, maxOccurrences: 1,
    requirements: { all: [{ origin: "podcaster" }, { hidden: "mediaNotoriety", min: 50 }] }, category: "media",
    title: "Mi bebito chu chu", kicker: "Un chat privado se convierte en canción nacional",
    description: "Se filtran mensajes románticos entre el expresidente Martín Vistaclara y la excandidata Zulema Pincha. Un productor ofrece convertir los diminutivos, selfis y audios en un remix pegajoso.",
    options: [
      { id: "lanzar-chu-chu", label: "Producir el remix satírico", hint: "Viralidad mundial · vida privada expuesta", effects: { cleanMoney: 42000, approval: 6 }, hiddenEffects: { mediaNotoriety: 25, credibility: -4, personalReputation: -3 }, outcomes: [{ id: "chu-chu-global", weight: 78, headline: "Mi bebito chu chu cruza fronteras", text: "La canción convierte el escándalo sentimental de Vistaclara en el contenido peruano más compartido del mes." }, { id: "chu-chu-retirado", weight: 22, headline: "La plataforma retira el remix por derechos musicales", text: "Las copias continúan circulando y el retiro multiplica la curiosidad.", effects: { cleanMoney: -9000, influence: 4 } }] },
      { id: "investigar-chats", label: "Investigar quién filtró los chats", hint: "Menos espectáculo · posible operación política", effects: { cleanMoney: -9000, influence: 5 }, hiddenEffects: { credibility: 12, pressSupport: 7 }, outcomes: [{ id: "chu-chu-operacion", weight: 58, headline: "La filtración salió de una interna partidaria", text: "El romance existía, pero el momento de publicación fue elegido para destruir una candidatura." }, { id: "chu-chu-sin-fuente", weight: 42, headline: "Nadie asume la filtración de Vistaclara", text: "Los chats siguen dominando la conversación y la fuente permanece oculta." }] },
    ],
  },
  {
    id: "cantante-ricardo-sway", repeatable: false, weight: 11, maxOccurrences: 1,
    requirements: { all: [{ age: { min: 35 } }, { hasTag: "presidente-actual" }] }, category: "scandal",
    title: "Ricardo Sway cobra por hablar de liderazgo", kicker: "Cultura contrata a la estrella de campaña",
    description: "El Ministerio de Cultura pagó varias consultorías a Ricardo Sway, cantante y animador que participó en tu campaña. Sus informes mezclan frases motivacionales, videos caseros y páginas copiadas.",
    options: [
      { id: "cancelar-sway", label: "Cancelar contratos y publicar informes", hint: "Pierdes un aliado · contienes el daño", effects: { influence: -4, approval: 5, legalRisk: -4 }, hiddenEffects: { credibility: 10, leakExposure: -8 }, addEnemies: [{ id: "ricardo-sway", label: "Ricardo Sway, consultor apartado" }], outcomes: [{ id: "sway-canta", weight: 100, headline: "Sway responde cantando en la puerta de Palacio", text: "La protesta es absurda y viral, pero los contratos quedan expuestos y terminados." }] },
      { id: "coordinar-version-sway", label: "Coordinar una versión con Sway", hint: "Protege al gobierno · aparecen audios", effects: { influence: 5, legalRisk: 12 }, hiddenEffects: { credibility: -13, leakExposure: 25 }, addScandals: [{ id: "caso-sway", label: "Coordinación de versiones sobre Ricardo Sway" }], outcomes: [{ id: "sway-audios", weight: 62, headline: "Audios revelan el ensayo de respuestas sobre Sway", text: "Asesoras y funcionarios discuten cuántas veces admitirán haber visto al cantante." }, { id: "sway-controlado", weight: 38, headline: "El caso Sway se diluye entre otras noticias", text: "El cantante conserva contratos y promete silencio durante algunos meses." }] },
    ],
  },
  {
    id: "tesis-copiada", repeatable: false, weight: 9, maxOccurrences: 1,
    requirements: { all: [{ age: { min: 30 } }, { any: [{ careerTrack: "candidateReady" }, { background: "podcaster-academico" }] }] }, category: "scandal",
    title: "La tesis tiene páginas de demasiados autores", kicker: "El grado académico entra a la campaña",
    description: "Un verificador encuentra párrafos completos sin citar en tu tesis. La universidad del clan ofrece declarar reservado el documento y emitir un informe favorable.",
    options: [
      { id: "admitir-plagio", label: "Reconocer las copias y renunciar al grado", hint: "Golpe inmediato · recupera credibilidad", effects: { approval: -8, influence: -4 }, hiddenEffects: { credibility: 12, personalReputation: 6 }, outcomes: [{ id: "tesis-renuncia", weight: 100, headline: "Renuncias al grado antes del debate", text: "Los rivales se burlan, pero la universidad ya no puede protegerte ni chantajearte." }] },
      { id: "blindar-tesis", label: "Declarar reservada la tesis", hint: "Conserva credenciales · filtración probable", effects: { influence: 4, legalRisk: 3 }, hiddenEffects: { credibility: -12, leakExposure: 19 }, addScandals: [{ id: "tesis-reservada", label: "Tesis reservada por acusaciones de plagio" }], outcomes: [{ id: "tesis-informe-favorable", weight: 54, headline: "La universidad concluye que solo hubo omisiones formales", text: "El grado sobrevive gracias a una comisión nombrada por aliados." }, { id: "tesis-filtrada", weight: 46, headline: "La tesis completa aparece en un buscador extranjero", text: "Ciudadanos marcan cientos de coincidencias y la defensa se vuelve insostenible.", effects: { approval: -15 }, hiddenEffects: { credibility: -15 } }] },
    ],
  },
  {
    id: "agendas-primera-dama", repeatable: false, weight: 10, maxOccurrences: 1,
    requirements: { all: [{ age: { min: 35 } }, { careerTrack: "politicalOrganization" }] }, category: "investigation",
    title: "Las agendas de Nadina Heredera", kicker: "Iniciales, montos y una letra conocida",
    description: "Cuatro agendas atribuidas a la lideresa Nadina Heredera registran aportes extranjeros, entregas empresariales y gastos de campaña. Ella primero niega la letra y luego denuncia que los cuadernos fueron robados.",
    options: [
      { id: "entregar-agendas", label: "Entregar originales y explicar cada inicial", hint: "Aliados expuestos · menor riesgo propio", effects: { influence: -8, legalRisk: -8 }, hiddenEffects: { credibility: 11, prosecutionRelation: 9 }, outcomes: [{ id: "agendas-peritaje", weight: 100, headline: "El peritaje confirma la letra de Nadina", text: "La transparencia evita una obstrucción, pero varios aportantes rompen con el partido." }] },
      { id: "negar-agendas", label: "Negar la letra y atacar al fiscal", hint: "Mantiene la red · contradicciones futuras", effects: { influence: 8, legalRisk: 13 }, hiddenEffects: { credibility: -14, leakExposure: 18, polarization: 9 }, outcomes: [{ id: "agendas-versiones", weight: 64, headline: "Nadina ofrece tres versiones sobre las agendas", text: "El cambio de relato se vuelve más importante que varias anotaciones." }, { id: "agendas-archivo", weight: 36, headline: "Un tribunal excluye parte del caso de las agendas", text: "La defensa gana tiempo y convierte el proceso en bandera política.", effects: { legalRisk: -7, approval: 3 } }] },
    ],
  },
  {
    id: "plata-como-estadio", repeatable: false, weight: 10, maxOccurrences: 1,
    requirements: { all: [{ origin: "empresario" }, { stat: "cleanMoney", min: 150000 }] }, category: "business",
    title: "Plata como estadio", kicker: "Una demanda cuesta menos que el orgullo",
    description: "Un periodista publica que tu fortuna nació de favores regionales. Tu abogado recomienda pagar una reparación enorme y responder que tienes dinero suficiente para llenar un estadio.",
    options: [
      { id: "demandar-periodista", label: "Demandar y exigir una reparación millonaria", hint: "Intimida críticos · efecto bumerán", effects: { cleanMoney: -38000, influence: 5, legalRisk: 4 }, hiddenEffects: { pressSupport: -18, polarization: 10 }, outcomes: [{ id: "plata-sentencia", weight: 48, headline: "El periodista recibe una condena y la frase se vuelve meme", text: "Ganas en primera instancia, pero «plata como estadio» define tu imagen nacional." }, { id: "plata-revierte", weight: 52, headline: "Una sala revoca la condena contra el periodista", text: "La investigación permanece publicada y ahora incluye tu intento de silenciarla.", effects: { approval: -9 }, hiddenEffects: { credibility: -8 } }] },
      { id: "abrir-cuentas-estadio", label: "Publicar el origen de tu fortuna", hint: "Transparencia · socios incómodos", effects: { approval: 5, influence: -4 }, hiddenEffects: { credibility: 12, leakExposure: -5 }, outcomes: [{ id: "plata-cuentas", weight: 100, headline: "Las cuentas explican la fortuna y revelan socios políticos", text: "Evitas la demanda, aunque antiguos socios deben responder por contratos regionales." }] },
    ],
  },
  {
    id: "vacunagate-vip", repeatable: false, weight: 11, maxOccurrences: 1,
    requirements: { all: [{ age: { min: 35 } }, { careerTrack: "nationalInstitution" }] }, category: "health",
    title: "Las dosis VIP del ensayo clínico", kicker: "El país espera vacunas · Palacio ya tiene una lista",
    description: "Una universidad recibe dosis adicionales durante una epidemia. Ministros, rectores, familiares y asesores pueden vacunarse meses antes que médicos y adultos mayores.",
    options: [
      { id: "rechazar-dosis-vip", label: "Rechazar la dosis y denunciar la lista", hint: "Riesgo personal · autoridad moral", effects: { approval: 10, influence: -4 }, hiddenEffects: { credibility: 15, pressSupport: 8 }, outcomes: [{ id: "vacunas-lista-publica", weight: 100, headline: "La lista VIP obliga a renunciar a dos ministros", text: "Las dosis restantes pasan al personal de salud y la universidad enfrenta una investigación." }] },
      { id: "vacunarse-secreto", label: "Vacunarte con tu familia", hint: "Protección inmediata · escándalo nacional", effects: { approval: -2, legalRisk: 10 }, hiddenEffects: { personalReputation: -12, leakExposure: 24, credibility: -18 }, addScandals: [{ id: "vacunagate-personal", label: "Vacunación secreta antes que el personal de salud" }], outcomes: [{ id: "vacuna-secreto", weight: 55, headline: "La dosis permanece fuera del registro público", text: "Tu familia queda protegida mientras la campaña oficial insiste en que aún no hay vacunas." }, { id: "vacuna-lista-filtrada", weight: 45, headline: "Tu nombre aparece en la lista de vacunados VIP", text: "El carné secreto contradice tus discursos y desata pedidos de renuncia.", effects: { approval: -22, influence: -10, legalRisk: 18 } }] },
    ],
  },
  {
    id: "relojes-wayki", repeatable: false, weight: 12, maxOccurrences: 1,
    requirements: { all: [{ age: { min: 38 } }, { hasTag: "presidente-actual" }] }, category: "scandal",
    title: "Los relojes prestados del wayki", kicker: "Un gobernador generoso · presupuestos extraordinarios",
    description: "El gobernador Wilfredo Osochima te presta relojes de lujo y una pulsera. Poco después, su región solicita ampliaciones presupuestales y proyectos aprobados por decreto.",
    options: [
      { id: "declarar-relojes", label: "Registrar y devolver los relojes", hint: "Pierdes al wayki · protege el cargo", effects: { influence: -5, legalRisk: -7 }, hiddenEffects: { credibility: 11, regionalSupport: -5 }, outcomes: [{ id: "relojes-devueltos", weight: 100, headline: "Los relojes vuelven a Osochima con acta notarial", text: "El gobernador se distancia y los presupuestos pasan por evaluación ordinaria." }] },
      { id: "usar-relojes", label: "Usarlos y llamarlos préstamos", hint: "Lujo y alianza · números de serie", effects: { influence: 7, legalRisk: 13 }, hiddenEffects: { undeclaredWealth: 90000, leakExposure: 22, credibility: -13 }, addScandals: [{ id: "relojes-wayki", label: "Relojes de lujo recibidos del wayki" }], outcomes: [{ id: "relojes-fotos", weight: 58, headline: "Un medio identifica cada reloj en fotografías oficiales", text: "Los números de serie conectan las piezas con Osochima y con fechas de transferencias regionales." }, { id: "relojes-caja", weight: 42, headline: "Los relojes permanecen en la caja de Palacio", text: "Nadie pregunta durante meses y el wayki obtiene nuevas reuniones privadas." }] },
    ],
  },
  {
    id: "cirugia-secreta-palacio", repeatable: false, weight: 9, maxOccurrences: 1,
    requirements: { hasTag: "presidente-actual" }, category: "personal",
    title: "Doce días sin presidenta", kicker: "Una cirugía secreta deja Palacio sin mando claro",
    description: "Quieres someterte a una operación estética y desaparecer doce días. El premier propone ocultarla, firmar documentos desde la clínica y negar que el cargo quedó temporalmente desatendido.",
    options: [
      { id: "transferir-mando-cirugia", label: "Informar y transferir funciones", hint: "Exposición privada · continuidad institucional", effects: { approval: -3 }, hiddenEffects: { governmentStability: 9, credibility: 8 }, outcomes: [{ id: "cirugia-declarada", weight: 100, headline: "Palacio informa la operación y activa la sucesión temporal", text: "La farándula comenta el cambio, pero ninguna firma queda sin autoridad." }] },
      { id: "ocultar-cirugia", label: "Operarte en secreto", hint: "Evita titulares ahora · abandono del cargo", effects: { legalRisk: 12 }, hiddenEffects: { governmentStability: -10, credibility: -14, leakExposure: 25 }, addScandals: [{ id: "cirugia-secreta", label: "Ausencia presidencial por cirugía secreta" }], outcomes: [{ id: "cirugia-fotos", weight: 61, headline: "Una foto clínica revela los doce días sin mando", text: "Ministros ofrecen horarios incompatibles y Fiscalía pregunta quién tomó decisiones." }, { id: "cirugia-silencio", weight: 39, headline: "El gabinete sostiene la versión de descanso médico", text: "La ausencia queda oculta, pero varias personas conservan historias clínicas y mensajes." }] },
    ],
  },
  {
    id: "chifa-encapuchado", repeatable: false, weight: 10, maxOccurrences: 1,
    requirements: { hasTag: "presidente-actual" }, category: "scandal",
    title: "El Chifagate", kicker: "El Cofre llega de noche y alguien baja encapuchado",
    description: "El empresario Zhihua Yan te espera en un chifa cerrado de San Borja. Tiene contratos pendientes, vínculos partidarios y una mesa lejos del registro de visitas de Palacio.",
    options: [
      { id: "registrar-chifa", label: "Trasladar la reunión a Palacio", hint: "Agenda pública · negociación vigilada", effects: { influence: -2, legalRisk: -4 }, hiddenEffects: { credibility: 9 }, outcomes: [{ id: "chifa-agenda", weight: 100, headline: "La reunión con Zhihua Yan entra al registro oficial", text: "El empresario expone sus proyectos ante funcionarios y órganos de control." }] },
      { id: "ir-encapuchado-chifa", label: "Ir encapuchado en el Cofre", hint: "Secreto inmediato · cámaras por todas partes", effects: { influence: 6, legalRisk: 12 }, hiddenEffects: { leakExposure: 27, credibility: -16 }, addScandals: [{ id: "chifagate", label: "Reunión encapuchada con Zhihua Yan" }], outcomes: [{ id: "chifa-camaras", weight: 74, headline: "Las cámaras siguen al Cofre hasta el chifa", text: "Tres versiones presidenciales intentan explicar la capucha, el horario y los contratos de Yan." }, { id: "chifa-sin-registro", weight: 26, headline: "La cena queda fuera de la agenda", text: "Yan obtiene acceso a funcionarios y el chifa se convierte en canal paralelo de gobierno." }] },
    ],
  },
  {
    id: "casa-sarratea", repeatable: false, weight: 11, maxOccurrences: 1,
    requirements: { all: [{ age: { min: 35 } }, { hasTag: "presidente-actual" }] }, category: "scandal",
    title: "La casa de Sarratea", kicker: "Despacho paralelo · proveedores sin registro",
    description: "Empresarios, sobrinos y dirigentes prefieren reunirse contigo en una casa de Breña. No hay actas ni control de visitas, pero después de cada noche aparecen nombres nuevos en ministerios y licitaciones.",
    options: [
      { id: "cerrar-sarratea", label: "Cerrar el despacho paralelo", hint: "Pierdes operadores · recupera trazabilidad", effects: { influence: -7, legalRisk: -6 }, hiddenEffects: { credibility: 10, governmentStability: 5 }, outcomes: [{ id: "sarratea-cerrada", weight: 100, headline: "La casa de Breña deja de recibir ministros y proveedores", text: "Las reuniones vuelven a edificios públicos y varios intermediarios pierden acceso." }] },
      { id: "gobernar-sarratea", label: "Seguir despachando en la casa", hint: "Control informal · red de contratos", effects: { dirtyMoney: 65000, influence: 9, legalRisk: 15 }, hiddenEffects: { leakExposure: 24, credibility: -14 }, addScandals: [{ id: "despacho-sarratea", label: "Despacho clandestino en Sarratea" }], outcomes: [{ id: "sarratea-videos", weight: 57, headline: "Videos muestran una fila de proveedores en Sarratea", text: "Las visitas coinciden con ascensos, obras y decisiones que nadie discutió en Palacio." }, { id: "sarratea-red", weight: 43, headline: "Sarratea consolida un gabinete en la sombra", text: "Los operadores resuelven nombramientos y contratos sin dejar actas oficiales." }] },
    ],
  },
  {
    id: "dinero-bano-palacio", repeatable: false, weight: 10, maxOccurrences: 1,
    requirements: { all: [{ age: { min: 35 } }, { hasTag: "presidente-actual" }] }, category: "investigation",
    title: "Veinte mil dólares en el baño de Palacio", kicker: "El secretario dice que eran ahorros",
    description: "Fiscales encuentran fajos de dólares dentro del baño del secretario Bruno Pacheco. Él asegura que ahorró durante años, aunque sus mensajes mencionan ascensos y presión sobre la administración tributaria.",
    options: [
      { id: "entregar-secretario", label: "Separar al secretario y abrir sus chats", hint: "Pierdes un operador · reduce encubrimiento", effects: { influence: -6, legalRisk: -7 }, hiddenEffects: { credibility: 10, prosecutionRelation: 8 }, outcomes: [{ id: "bano-colabora", weight: 100, headline: "Pacheco entrega el teléfono y explica los fajos", text: "Los mensajes exponen una red de ascensos, favores y cobros dentro del gobierno." }] },
      { id: "proteger-secretario", label: "Respaldar la historia de los ahorros", hint: "Conserva la red · fuga probable", effects: { influence: 7, legalRisk: 14 }, hiddenEffects: { leakExposure: 23, credibility: -15 }, outcomes: [{ id: "bano-fuga", weight: 55, headline: "Pacheco desaparece antes de declarar", text: "El dinero del baño se convierte en símbolo de un gobierno que no controla a sus operadores." }, { id: "bano-silencio", weight: 45, headline: "El secretario guarda silencio y conserva el cargo", text: "Los chats permanecen ocultos, pero Fiscalía amplía la investigación." }] },
    ],
  },
  {
    id: "petroaudios-faenon", repeatable: false, weight: 11, maxOccurrences: 1,
    requirements: { all: [{ age: { min: 38 } }, { any: [{ hasTag: "presidente-actual" }, { role: ["Premier", "Ministro de Estado"] }] }] }, category: "investigation",
    title: "El faenón de los lotes petroleros", kicker: "Un audio celebra la concesión antes del concurso",
    description: "Dos operadores hablan por teléfono sobre cómo entregar lotes petroleros a Discoveri Petroleum. Se ríen de la comisión, mencionan honorarios y aseguran que el negocio ya está cerrado.",
    options: [
      { id: "anular-lotes", label: "Anular el concurso y entregar los audios", hint: "Cae el gabinete · protege la investigación", effects: { influence: -7, approval: 5 }, hiddenEffects: { credibility: 12, governmentStability: -8 }, outcomes: [{ id: "petroaudios-gabinete", weight: 100, headline: "Los Petroaudios derriban al gabinete", text: "La concesión se detiene y los operadores deben explicar cómo conocían el resultado." }] },
      { id: "negociar-petroaudios", label: "Comprar las copias del audio", hint: "Salva la concesión · chantaje futuro", effects: { dirtyMoney: -18000, influence: 8, legalRisk: 15 }, allowDirtyShortfall: true, hiddenEffects: { leakExposure: 25, credibility: -14 }, outcomes: [{ id: "petroaudios-filtrados", weight: 62, headline: "Una copia llega al programa dominical", text: "El intento de comprar silencio aparece junto con las celebraciones del faenón." }, { id: "petroaudios-enterrados", weight: 38, headline: "Los audios desaparecen y Discoveri obtiene los lotes", text: "El contrato avanza y el intermediario conserva una copia como seguro." }] },
    ],
  },
  {
    id: "mamanivideos-obras", repeatable: false, weight: 12, maxOccurrences: 1,
    requirements: { hasTag: "presidente-actual" }, category: "vacancy",
    title: "Los Mamanídeos", kicker: "Obras regionales a cambio de sobrevivir la vacancia",
    description: "El congresista Moisés Mamaní graba a tu bloque ofreciendo carreteras, teléfonos de ministros y acceso preferente al presupuesto si vota contra la vacancia.",
    options: [
      { id: "rechazar-compra-votos", label: "Retirar las ofertas y aceptar la votación", hint: "Vacancia probable · evita compra de votos", effects: { influence: -8, approval: 4 }, hiddenEffects: { vacancyRisk: 8, credibility: 11 }, outcomes: [{ id: "mamanideos-votacion", weight: 100, headline: "El gobierno llega a la vacancia sin comprar obras", text: "La supervivencia queda en manos del pleno y no de contratos prometidos." }] },
      { id: "comprar-votos-obras", label: "Ofrecer obras por cada voto", hint: "Puede salvarte · todo está grabado", effects: { cleanMoney: -45000, influence: 10, legalRisk: 17 }, hiddenEffects: { vacancyRisk: -12, leakExposure: 28, credibility: -17 }, addScandals: [{ id: "mamanideos", label: "Obras ofrecidas para evitar la vacancia" }], outcomes: [{ id: "mamanideos-publicados", weight: 72, headline: "Mamaní publica los videos antes del Pleno", text: "Las ofertas de carreteras y llamadas ministeriales destruyen los votos que intentaban comprar." }, { id: "mamanideos-votos", weight: 28, headline: "Las obras compran tiempo al gobierno", text: "La vacancia fracasa, pero cada congresista aliado llega con una nueva lista de proyectos." }] },
    ],
  },
  {
    id: "los-ninos-obras", repeatable: true, cooldown: 8, maxOccurrences: 2, weight: 9,
    requirements: { all: [{ age: { min: 32 } }, { any: [{ hasTag: "presidente-actual" }, { role: ["Premier", "Ministro de Estado"] }] }] }, category: "congress",
    title: "Los Niños piden ministerios y obras", kicker: "Una bancada obediente · un pliego por provincia",
    description: "Seis legisladores ofrecen respaldar al Ejecutivo en censuras e interpelaciones. A cambio quieren directores regionales, contratos y obras administradas por alcaldes aliados.",
    options: [
      { id: "romper-con-los-ninos", label: "Rechazar el intercambio", hint: "Pierdes votos · protege nombramientos", effects: { influence: -7 }, hiddenEffects: { congressSupport: -10, credibility: 10 }, outcomes: [{ id: "ninos-oposicion", weight: 100, headline: "Los Niños vuelven a la oposición", text: "El bloque anuncia fiscalización y guarda los mensajes de la negociación." }] },
      { id: "pactar-con-los-ninos", label: "Entregar cuotas y obras", hint: "Mayoría temporal · red de favores", effects: { influence: 10, legalRisk: 12 }, hiddenEffects: { congressSupport: 16, partyCohesion: -4, leakExposure: 17 }, addFavors: [{ id: "cuotas-los-ninos", label: "Cuotas ministeriales entregadas a Los Niños" }], outcomes: [{ id: "ninos-votan", weight: 66, headline: "Los Niños sostienen al gobierno en el Pleno", text: "La mayoría funciona y los alcaldes del bloque empiezan a ganar obras." }, { id: "ninos-colaboradores", weight: 34, headline: "Un Niño entrega chats a Fiscalía", text: "Los pedidos de cargos y contratos quedan organizados por fecha y votación.", effects: { legalRisk: 18, approval: -9 } }] },
    ],
  },
  {
    id: "mochasueldos-despacho", repeatable: false, weight: 10, maxOccurrences: 1,
    requirements: { hasAnyTag: ["congresista", "diputado", "senador"] }, category: "congress",
    title: "El diezmo del despacho", kicker: "Cada asesor devuelve una parte del sueldo",
    description: "Tu coordinador propone que asesores y técnicos entreguen entre diez y cincuenta por ciento de sus salarios para financiar propaganda, viajes y gastos personales.",
    options: [
      { id: "prohibir-mocha", label: "Prohibir recortes y proteger denunciantes", hint: "Menos caja · equipo profesional", effects: { cleanMoney: -6000, approval: 4 }, hiddenEffects: { credibility: 11, partyCohesion: -3 }, outcomes: [{ id: "mocha-denuncia", weight: 100, headline: "Los trabajadores documentan recortes en otros despachos", text: "Tu oficina queda fuera del caso y la denuncia alcanza a varias bancadas." }] },
      { id: "cobrar-diezmo", label: "Cobrar el diezmo a todo el despacho", hint: "Ingreso constante · concusión", effects: { dirtyMoney: 38000, legalRisk: 15 }, hiddenEffects: { credibility: -15, leakExposure: 22 }, addScandals: [{ id: "mochasueldo", label: "Recorte de salarios del despacho" }], outcomes: [{ id: "mocha-tarjetas", weight: 48, headline: "El coordinador retiene tarjetas de los asesores", text: "Los recortes llegan puntuales hasta que una trabajadora graba la entrega." }, { id: "mocha-testigos", weight: 52, headline: "Tres asesores denuncian el diezmo", text: "Chats, depósitos y amenazas de despido abren una investigación penal.", effects: { approval: -12, legalRisk: 23 } }] },
    ],
  },
  {
    id: "dinamicos-del-centro", repeatable: false, weight: 11, maxOccurrences: 1,
    requirements: { all: [{ age: { min: 30 } }, { careerTrack: "localGovernment" }] }, category: "regional",
    title: "Los Dinámicos del Centro", kicker: "Brevets, puestos y cuotas para el partido",
    description: "Funcionarios regionales cobran por licencias de conducir, eliminan papeletas y venden puestos. Parte del dinero sostiene locales, movilizaciones y la campaña nacional de tu organización.",
    options: [
      { id: "intervenir-dinamicos", label: "Intervenir Transportes y entregar registros", hint: "Rompe la caja regional · mejora gestión", effects: { influence: -8, approval: 7 }, hiddenEffects: { credibility: 12, regionalSupport: 5 }, outcomes: [{ id: "dinamicos-capturas", weight: 100, headline: "La intervención desarma la venta de brevetes", text: "Operadores del partido pierden su caja y varios funcionarios aceptan colaborar." }] },
      { id: "financiarse-dinamicos", label: "Usar la red para financiar el partido", hint: "Movilización y caja · organización criminal", effects: { dirtyMoney: 76000, influence: 12, legalRisk: 17 }, hiddenEffects: { partyCohesion: 9, leakExposure: 22, credibility: -13 }, addScandals: [{ id: "dinamicos-centro", label: "Financiamiento con venta de brevetes" }], outcomes: [{ id: "dinamicos-caja", weight: 58, headline: "Los Dinámicos financian una campaña regional", text: "Buses, locales y brigadas se pagan con cuotas recogidas en Transportes." }, { id: "dinamicos-escuchas", weight: 42, headline: "Escuchas telefónicas revelan la caja de los Dinámicos", text: "Los cobros por brevetes terminan conectados con dirigentes y candidatos.", effects: { legalRisk: 24, approval: -14 } }] },
    ],
  },
  {
    id: "centralita-regional", repeatable: false, weight: 9, maxOccurrences: 1,
    requirements: { all: [{ age: { min: 35 } }, { careerTrack: "localGovernment" }] }, category: "regional",
    title: "La Centralita", kicker: "Un local sin letrero vigila periodistas y rivales",
    description: "El clan regional mantiene una sala con operadores, policías retirados y equipos de seguimiento. Desde allí compran radios, atacan fiscales y registran los movimientos de opositores.",
    options: [
      { id: "desmontar-centralita", label: "Desmontar la sala y entregar equipos", hint: "Pierdes control mediático · evita una red mayor", effects: { influence: -10, legalRisk: -7 }, hiddenEffects: { pressSupport: 12, credibility: 10 }, addEnemies: [{ id: "operadores-centralita", label: "Operadores expulsados de La Centralita" }], outcomes: [{ id: "centralita-entregada", weight: 100, headline: "La Centralita queda abierta a Fiscalía", text: "Discos duros revelan seguimientos, pagos a medios y campañas contra adversarios." }] },
      { id: "usar-centralita", label: "Usarla contra tus rivales", hint: "Control regional · violencia y chantaje", effects: { dirtyMoney: -18000, influence: 15, legalRisk: 19 }, allowDirtyShortfall: true, hiddenEffects: { pressSupport: -16, leakExposure: 25, credibility: -16 }, addScandals: [{ id: "centralita", label: "Red clandestina de espionaje regional" }], outcomes: [{ id: "centralita-domina", weight: 53, headline: "La Centralita neutraliza radios y fiscales", text: "El clan domina la región mientras aumenta el número de personas que conocen la sala." }, { id: "centralita-allanada", weight: 47, headline: "Un allanamiento encuentra la sala todavía encendida", text: "Pantallas, pagos y fichas de periodistas convierten el poder regional en caso nacional.", effects: { legalRisk: 28, approval: -16 } }] },
    ],
  },
  {
    id: "narcoindultos", repeatable: false, weight: 9, maxOccurrences: 1,
    requirements: { all: [{ age: { min: 40 } }, { hasTag: "presidente-actual" }] }, category: "justice",
    title: "La comisión de los narcoindultos", kicker: "Conmutaciones rápidas · expedientes con tarifa",
    description: "Una comisión presidencial ofrece reducir penas a condenados por narcotráfico. Intermediarios cobran por acelerar informes y prometen que las firmas quedarán cubiertas por razones humanitarias.",
    options: [
      { id: "auditar-indultos", label: "Auditar todos los expedientes", hint: "Frena liberaciones · enfrenta al partido", effects: { influence: -7, approval: 5 }, hiddenEffects: { credibility: 12, prosecutionRelation: 10 }, outcomes: [{ id: "indultos-anulados", weight: 100, headline: "La auditoría encuentra expedientes copiados y pagos", text: "Las conmutaciones irregulares se detienen y la comisión es denunciada." }] },
      { id: "firmar-indultos", label: "Firmar el paquete de conmutaciones", hint: "Caja y favores · responsabilidad presidencial", effects: { dirtyMoney: 88000, influence: 8, legalRisk: 18 }, hiddenEffects: { credibility: -16, leakExposure: 20 }, addScandals: [{ id: "narcoindultos", label: "Conmutaciones pagadas a narcotraficantes" }], outcomes: [{ id: "indultos-caja", weight: 61, headline: "Cientos de conmutaciones salen en pocos meses", text: "La comisión recauda y el partido gana operadores dentro y fuera de prisión." }, { id: "indultos-testigo", weight: 39, headline: "Un intermediario revela la tarifa de cada indulto", text: "Planillas y visitas conectan los pagos con funcionarios del gobierno.", effects: { legalRisk: 25, approval: -18 } }] },
    ],
  },
  {
    id: "ecoteva-suegra", repeatable: false, weight: 9, maxOccurrences: 1,
    requirements: { all: [{ age: { min: 45 } }, { any: [{ careerTrack: "formerPresident" }, { origin: "empresario" }] }] }, category: "investigation",
    title: "La suegra, Ecoteva y las casas de lujo", kicker: "Dinero extranjero · patrimonio familiar",
    description: "Una empresa creada en Costa Verde transfiere millones a tu suegra y compra inmuebles vinculados a tu familia. La defensa sostiene que todo provino de un empresario amigo que ya murió.",
    options: [
      { id: "repatriar-ecoteva", label: "Repatriar fondos y entregar contratos", hint: "Golpe patrimonial · reduce riesgo", effects: { cleanMoney: -90000, legalRisk: -10, approval: -4 }, hiddenEffects: { credibility: 10, prosecutionRelation: 8 }, outcomes: [{ id: "ecoteva-documentada", weight: 100, headline: "Ecoteva entrega su ruta bancaria completa", text: "La familia pierde propiedades, pero los investigadores ya no dependen de versiones contradictorias." }] },
      { id: "culpar-suegra", label: "Afirmar que todo pertenece a tu suegra", hint: "Protege bienes · relato frágil", effects: { influence: 4, legalRisk: 13 }, hiddenEffects: { familyStress: 14, leakExposure: 18, credibility: -13 }, outcomes: [{ id: "ecoteva-firmas", weight: 57, headline: "Las firmas conectan tus decisiones con Ecoteva", text: "Correos y visitas muestran que conocías compras atribuidas únicamente a tu suegra." }, { id: "ecoteva-prescribe", weight: 43, headline: "La defensa prolonga el caso Ecoteva", text: "Los bienes permanecen inmovilizados y el proceso se acerca lentamente a la prescripción." }] },
    ],
  },
  {
    id: "narcoavion-presidencial", repeatable: false, weight: 8, maxOccurrences: 1,
    requirements: { hasTag: "presidente-actual" }, category: "security",
    title: "Cocaína en el avión presidencial", kicker: "Un vuelo militar llevaba carga que no figuraba",
    description: "Personal de seguridad encuentra paquetes de cocaína dentro del avión presidencial antes de un viaje oficial. Oficiales y edecanes discuten quién autorizó el acceso al hangar.",
    options: [
      { id: "investigar-narcoavion", label: "Inmovilizar el avión e investigar mandos", hint: "Crisis militar · evita encubrimiento", effects: { approval: 5, influence: -5 }, hiddenEffects: { armedForcesSupport: -10, credibility: 13 }, outcomes: [{ id: "narcoavion-red", weight: 100, headline: "La investigación descubre una ruta dentro del hangar", text: "Militares y civiles usaron vuelos oficiales para mover carga durante meses." }] },
      { id: "ocultar-narcoavion", label: "Retirar paquetes y mantener el viaje", hint: "Evita crisis inmediata · secreto explosivo", effects: { influence: 6, legalRisk: 17 }, hiddenEffects: { armedForcesSupport: 8, leakExposure: 28, credibility: -16 }, addScandals: [{ id: "narcoavion", label: "Cocaína retirada del avión presidencial" }], outcomes: [{ id: "narcoavion-fotos", weight: 65, headline: "Fotos de los paquetes llegan a un dominical", text: "La versión de equipaje perdido se derrumba ante registros del hangar." }, { id: "narcoavion-vuela", weight: 35, headline: "El avión despega después de limpiar la bodega", text: "Los responsables conservan sus cargos y ahora conocen el precio de tu silencio." }] },
    ],
  },
  {
    id: "repartija-institucional", repeatable: true, cooldown: 9, maxOccurrences: 2, weight: 8,
    requirements: { careerTrack: "nationalInstitution" }, category: "congress",
    title: "La repartija", kicker: "Tribunal, Defensoría y Banco Central en una sola mesa",
    description: "Las bancadas acuerdan repartirse nombramientos según su número de votos. Cada partido lleva candidatos propios y promete no revisar los antecedentes de los demás.",
    options: [
      { id: "concurso-repartija", label: "Exigir evaluación pública", hint: "Demora nombramientos · mejora legitimidad", effects: { influence: -5, approval: 6 }, hiddenEffects: { congressSupport: -8, credibility: 12 }, outcomes: [{ id: "repartija-audiencias", weight: 100, headline: "Las audiencias exponen candidatos sin experiencia", text: "Varias nominaciones caen y las instituciones esperan una nueva lista." }] },
      { id: "cuotear-repartija", label: "Aceptar cuotas por bancada", hint: "Acuerdo rápido · instituciones capturadas", effects: { influence: 11, legalRisk: 5 }, hiddenEffects: { congressSupport: 14, judiciaryRelation: 8, credibility: -15 }, addFavors: [{ id: "cuotas-institucionales", label: "Nombramientos repartidos entre bancadas" }], outcomes: [{ id: "repartija-aprobada", weight: 59, headline: "El Pleno aprueba la lista en minutos", text: "Cada bancada obtiene su cuota y las nuevas autoridades llegan debiendo favores." }, { id: "repartija-protesta", weight: 41, headline: "La calle obliga a retirar la lista de la repartija", text: "La votación se suspende y los currículos negociados circulan por redes.", effects: { approval: -8, influence: -6 } }] },
    ],
  },
  {
    id: "ley-pulpin", repeatable: false, weight: 9, maxOccurrences: 1,
    requirements: { all: [{ age: { min: 32 } }, { careerTrack: "nationalInstitution" }] }, category: "policy",
    title: "La Ley Pulpín", kicker: "Empleo juvenil con menos derechos",
    description: "El gabinete propone un régimen laboral juvenil con menores beneficios para facilitar contrataciones. Empresarios lo llaman puerta de entrada; estudiantes lo ven como trabajo barato sin protección.",
    options: [
      { id: "retirar-ley-pulpin", label: "Retirar la ley y abrir una mesa juvenil", hint: "Cede ante protestas · mejora el diseño", effects: { influence: -4, approval: 7 }, hiddenEffects: { urbanApproval: 10, businessSupport: -8, unionSupport: 9 }, outcomes: [{ id: "pulpin-derogada", weight: 100, headline: "Una marcha juvenil obliga a rehacer la reforma", text: "La nueva propuesta conserva incentivos sin eliminar vacaciones ni compensaciones." }] },
      { id: "imponer-ley-pulpin", label: "Defenderla contra las marchas", hint: "Respaldo empresarial · conflicto juvenil", effects: { influence: 6, approval: -7 }, hiddenEffects: { businessSupport: 13, urbanApproval: -14, polarization: 10 }, outcomes: [{ id: "pulpin-protestas", weight: 69, headline: "Miles de jóvenes toman el centro de Lima", text: "La protesta convierte «pulpín» en identidad política y fractura a la bancada." }, { id: "pulpin-empleo", weight: 31, headline: "Las empresas anuncian miles de contratos juveniles", text: "El empleo sube brevemente mientras continúan demandas por beneficios recortados." }] },
    ],
  },
  {
    id: "hermano-en-la-sombra", repeatable: false, weight: 9, maxOccurrences: 1,
    requirements: { all: [{ age: { min: 38 } }, { hasTag: "presidente-actual" }] }, category: "personal",
    title: "El hermano que arma el partido desde Palacio", kicker: "Prefectos, afiliaciones y cargos públicos",
    description: "Tu hermano Nicanor Del Pino organiza un partido mientras visita ministerios y coordina nombramientos regionales. Funcionarios aseguran que sus pedidos llegan con autoridad presidencial.",
    options: [
      { id: "separar-hermano", label: "Prohibirle intervenir en nombramientos", hint: "Conflicto familiar · protege el gobierno", effects: { influence: -6 }, hiddenEffects: { familyStress: 15, credibility: 11, regionalSupport: -5 }, outcomes: [{ id: "hermano-rompe", weight: 100, headline: "Nicanor traslada el partido fuera de Palacio", text: "La familia se divide y los prefectos dejan de recibir instrucciones paralelas." }] },
      { id: "dejar-hermano-operar", label: "Dejar que construya la red", hint: "Partido propio · organización paralela", effects: { influence: 11, legalRisk: 11 }, hiddenEffects: { regionalSupport: 12, partyCohesion: 9, leakExposure: 20, credibility: -12 }, addFavors: [{ id: "red-hermano", label: "Red regional organizada por tu hermano" }], outcomes: [{ id: "hermano-prefectos", weight: 56, headline: "El partido de Nicanor controla prefecturas regionales", text: "Afiliaciones y nombramientos crecen juntos hasta que un colaborador entrega los chats." }, { id: "hermano-allanado", weight: 44, headline: "Fiscalía allana la casa de Nicanor", text: "Padrones, currículos y mensajes conectan al partido con decisiones de gobierno.", effects: { legalRisk: 17, approval: -10 } }] },
    ],
  },
  {
    id: "pagina-once", repeatable: false, weight: 8, maxOccurrences: 1,
    requirements: { all: [{ age: { min: 35 } }, { any: [{ careerTrack: "publicAuthority" }, { background: "podcaster-investigacion" }] }] }, category: "investigation",
    title: "La página once no aparece", kicker: "El precio del petróleo quedó fuera del contrato",
    description: "El Acta de Talara entrega instalaciones petroleras al Estado, pero la página que fija el precio del crudo desaparece antes de la conferencia. Gobierno y empresa aseguran que nunca existió.",
    options: [
      { id: "buscar-pagina-once", label: "Reconstruir la página con copias y testigos", hint: "Crisis política · contrato verificable", effects: { cleanMoney: -10000, influence: 4 }, hiddenEffects: { credibility: 13, pressSupport: 8 }, outcomes: [{ id: "pagina-once-copia", weight: 56, headline: "Una copia de la página once aparece en un archivo privado", text: "El precio acordado contradice el discurso oficial y obliga a renegociar." }, { id: "pagina-once-inconclusa", weight: 44, headline: "Nadie demuestra qué decía la página once", text: "La ausencia se convierte en símbolo de un acuerdo diseñado para no ser entendido." }] },
      { id: "cerrar-pagina-once", label: "Declarar completo el contrato", hint: "Protege el acuerdo · alimenta el escándalo", effects: { influence: 7, legalRisk: 7 }, hiddenEffects: { credibility: -14, leakExposure: 16 }, outcomes: [{ id: "pagina-once-golpe", weight: 63, headline: "La página perdida derriba al gabinete", text: "La negativa oficial transforma una irregularidad contractual en crisis de régimen." }, { id: "pagina-once-olvido", weight: 37, headline: "El contrato entra en vigor sin la página", text: "La empresa y el Estado interpretan el precio a su conveniencia durante años." }] },
    ],
  },
  {
    id: "dolar-muc-amigos", repeatable: false, weight: 8, maxOccurrences: 1,
    requirements: { all: [{ age: { min: 38 } }, { any: [{ careerTrack: "nationalInstitution" }, { origin: "empresario" }] }] }, category: "economy",
    title: "Dólares baratos para los amigos", kicker: "El MUC tiene precio oficial y lista reservada",
    description: "El Banco Central vende dólares subsidiados a empresas elegidas para importar insumos. Tu principal financista pide una asignación enorme y promete devolver parte de la diferencia a la campaña.",
    options: [
      { id: "subastar-dolar-muc", label: "Asignar divisas con criterios públicos", hint: "Menos aliados · reduce arbitraje", effects: { influence: -5, approval: 4 }, hiddenEffects: { businessSupport: -8, credibility: 10 }, outcomes: [{ id: "muc-criterios", weight: 100, headline: "La lista MUC queda abierta y varias empresas son excluidas", text: "El subsidio se reduce y el financista retira su apoyo." }] },
      { id: "entregar-dolar-muc", label: "Favorecer al financista", hint: "Caja política · fuga de reservas", effects: { dirtyMoney: 95000, influence: 9, legalRisk: 13 }, hiddenEffects: { businessSupport: 12, leakExposure: 18, credibility: -13 }, addFavors: [{ id: "dolares-muc", label: "Dólares MUC entregados al financista" }], outcomes: [{ id: "muc-fortuna", weight: 58, headline: "El financista multiplica su fortuna con dólares MUC", text: "Compra al precio oficial, vende en el mercado paralelo y devuelve apoyo a tu organización." }, { id: "muc-reservas", weight: 42, headline: "La lista de beneficiarios aparece durante la devaluación", text: "Mientras se agotan las reservas, los nombres de aliados dominan las asignaciones.", effects: { approval: -15, legalRisk: 17 } }] },
    ],
  },
  {
    id: "comunicore-municipal", repeatable: false, weight: 10, maxOccurrences: 1,
    requirements: { role: "Alcalde" }, category: "regional",
    title: "Comunicobra cobra la deuda en una semana", kicker: "Empresa recién creada · millones en efectivo",
    description: "La municipalidad vende una deuda a una empresa desconocida llamada Comunicobra. Días después le paga el monto completo y el dinero sale del banco en fajos retirados por personas sin experiencia.",
    options: [
      { id: "detener-comunicobra", label: "Congelar el pago y revisar accionistas", hint: "Demora el servicio · evita lavado", effects: { influence: -4, legalRisk: -5 }, hiddenEffects: { credibility: 11 }, outcomes: [{ id: "comunicobra-fachada", weight: 100, headline: "Comunicobra resulta ser una fachada", text: "Los accionistas no pueden explicar la operación y la deuda vuelve a revisión municipal." }] },
      { id: "pagar-comunicobra", label: "Pagar antes de salir de vacaciones", hint: "Resuelve la deuda · ruta del efectivo", effects: { dirtyMoney: 52000, influence: 7, legalRisk: 15 }, hiddenEffects: { leakExposure: 22, credibility: -14 }, addScandals: [{ id: "comunicobra", label: "Pago acelerado a Comunicobra" }], outcomes: [{ id: "comunicobra-retiros", weight: 68, headline: "El dinero de Comunicobra desaparece en retiros diarios", text: "Cámaras bancarias siguen a mensajeros que reparten el efectivo entre empresas y operadores." }, { id: "comunicobra-archivo", weight: 32, headline: "El caso Comunicobra se archiva por falta de una firma", text: "La ruta del dinero queda clara, pero nadie logra ubicar la orden final." }] },
    ],
  },
  {
    id: "campana-no-revocatoria", repeatable: false, weight: 10, maxOccurrences: 1,
    requirements: { all: [{ role: "Alcalde" }, { stat: "approval", max: 55 }] }, category: "campaign",
    title: "La campaña del NO necesita millones", kicker: "Constructoras con peajes ofrecen salvar la alcaldía",
    description: "Tu gestión enfrenta una revocatoria. Odebrasa y OASis ofrecen financiar publicidad por el NO mientras negocian peajes, una línea amarilla y adendas de largo plazo.",
    options: [
      { id: "no-ciudadano", label: "Financiar el NO con aportes declarados", hint: "Campaña pequeña · independencia contractual", effects: { cleanMoney: -24000, approval: 5 }, hiddenEffects: { credibility: 11, urbanApproval: 7 }, outcomes: [{ id: "no-ajustado", weight: 52, headline: "El NO gana por un margen estrecho", text: "La alcaldía sobrevive sin deber contratos a las constructoras." }, { id: "si-revoca", weight: 48, headline: "La ciudad vota por revocarte", text: "Tu gestión termina y las concesiones pasan al siguiente gobierno.", setRole: "Exalcalde", removeTags: ["cargo-ejecutivo-local"], addTags: ["fue-alcalde"] }] },
      { id: "no-constructoras", label: "Aceptar la campaña de Odebrasa y OASis", hint: "Publicidad masiva · peajes hipotecados", effects: { dirtyMoney: 120000, influence: 10, legalRisk: 17 }, hiddenEffects: { businessSupport: 12, leakExposure: 22, credibility: -15 }, addFavors: [{ id: "no-revocatoria-constructoras", label: "Campaña del NO pagada por concesionarias" }], outcomes: [{ id: "no-gana-millones", weight: 72, headline: "Una campaña millonaria salva tu alcaldía", text: "Rostros, artistas y paneles inclinan la votación; las constructoras presentan sus adendas." }, { id: "no-barata", weight: 28, headline: "Un ejecutivo confirma quién pagó el NO", text: "La victoria electoral queda conectada con peajes y concesiones.", effects: { legalRisk: 22, approval: -14 } }] },
    ],
  },
  {
    id: "diarios-chicha", repeatable: false, weight: 10, maxOccurrences: 1,
    requirements: { all: [{ age: { min: 30 } }, { careerTrack: "politicalOrganization" }] }, category: "media",
    title: "Cinco mil dólares por cada portada chicha", kicker: "La salita dicta los titulares de mañana",
    description: "El asesor Vladimiro Montedentro ofrece controlar nueve tabloides. Cada portada puede destruir a un rival, inventar un romance o convertir una investigación en ataque político.",
    options: [
      { id: "rechazar-prensa-chicha", label: "Rechazar el paquete de portadas", hint: "Prensa hostil · conserva distancia", effects: { influence: -5, approval: 3 }, hiddenEffects: { credibility: 10, pressSupport: -4 }, outcomes: [{ id: "chicha-ataca", weight: 100, headline: "Los tabloides chicha te convierten en su siguiente objetivo", text: "Titulares falsos aparecen durante semanas, pero los pagos no llevan tu firma." }] },
      { id: "comprar-prensa-chicha", label: "Comprar titulares contra tus rivales", hint: "Control de agenda · desvío de fondos", effects: { dirtyMoney: -25000, influence: 13, legalRisk: 14 }, allowDirtyShortfall: true, hiddenEffects: { mediaNotoriety: 10, credibility: -17, leakExposure: 23 }, addScandals: [{ id: "portadas-chicha", label: "Titulares chicha pagados desde la salita" }], outcomes: [{ id: "chicha-demuele", weight: 61, headline: "Las portadas chicha demuelen al candidato rival", text: "Acusaciones, fotomontajes y romances falsos dominan los quioscos." }, { id: "chicha-voucher", weight: 39, headline: "Una secretaria conserva los pagos de cada titular", text: "La contabilidad de la salita conecta portadas, ministros y dinero público.", effects: { legalRisk: 24, approval: -15 } }] },
    ],
  },
  {
    id: "audio-amor-premier", repeatable: false, weight: 10, maxOccurrences: 1,
    requirements: { hasTag: "presidente-actual" }, category: "personal",
    title: "El premier pide un currículum a su amor", kicker: "Un audio mezcla romance y contratación pública",
    description: "El premier Alberto Otorongo llama «amor» a Yasmín Pineda y le pide su currículum. Semanas después ella obtiene contratos en Defensa sin un procedimiento regular.",
    options: [
      { id: "separar-premier-amor", label: "Exigir la renuncia del premier", hint: "Pierdes estabilidad · corta el favoritismo", effects: { influence: -6, approval: 5 }, hiddenEffects: { governmentStability: -8, credibility: 11 }, outcomes: [{ id: "premier-renuncia-amor", weight: 100, headline: "Otorongo vuelve de viaje y renuncia", text: "El audio termina con el gabinete y los contratos pasan a control." }] },
      { id: "defender-premier-amor", label: "Decir que el audio fue editado", hint: "Sostiene el gabinete · más grabaciones", effects: { influence: 7, legalRisk: 10 }, hiddenEffects: { governmentStability: 6, credibility: -13, leakExposure: 22 }, outcomes: [{ id: "premier-audio-completo", weight: 63, headline: "El audio completo confirma la gestión del contrato", text: "Fechas, llamadas y órdenes contradicen la versión de montaje." }, { id: "premier-complot", weight: 37, headline: "El premier denuncia un complot y conserva apoyo", text: "La explicación gana tiempo mientras Fiscalía revisa las adjudicaciones." }] },
    ],
  },
  {
    id: "cilicio-candidato", repeatable: false, weight: 8, maxOccurrences: 1,
    requirements: { all: [{ careerTrack: "candidateReady" }, { stat: "ideology", min: 30 }] }, category: "campaign",
    title: "Porki Ramírez habla de su cilicio", kicker: "Celibato, fe y una entrevista imposible de controlar",
    description: "El candidato Porki Ramírez cuenta que practica el celibato, usa un cilicio desde hace décadas y está enamorado de una figura religiosa. El clip desplaza por completo su plan económico.",
    options: [
      { id: "convertir-cilicio-marca", label: "Convertir la confesión en marca de campaña", hint: "Base leal · fuerte polarización", effects: { approval: 4, influence: 7 }, hiddenEffects: { polarization: 15, mediaNotoriety: 15, credibility: -3 }, outcomes: [{ id: "porki-tendencia", weight: 100, headline: "Porki y el cilicio dominan la campaña", text: "Seguidores celebran su disciplina y críticos convierten cada frase en meme." }] },
      { id: "volver-plan-cilicio", label: "Cerrar el tema y volver al plan de gobierno", hint: "Menos viralidad · mayor seriedad", effects: { influence: -2 }, hiddenEffects: { credibility: 9, mediaNotoriety: -4, polarization: -5 }, outcomes: [{ id: "porki-plan", weight: 100, headline: "Porki deja el cilicio fuera de las siguientes entrevistas", text: "La campaña pierde espectáculo y recupera espacio para propuestas." }] },
    ],
  },
  {
    id: "taperes-campana", repeatable: true, cooldown: 7, maxOccurrences: 2, weight: 9,
    requirements: { careerTrack: "candidateReady" }, category: "campaign",
    title: "Un táper, arroz y diez soles", kicker: "La campaña reparte ayuda junto al símbolo",
    description: "Los coordinadores proponen entregar comida y dinero en un mitin. Cada táper lleva tu rostro, número de lista y una instrucción sencilla para el día de la elección.",
    options: [
      { id: "taper-sin-voto", label: "Entregar ayuda sin propaganda", hint: "Costo real · evita comprar apoyo", effects: { cleanMoney: -18000, approval: 5 }, hiddenEffects: { credibility: 8, ruralApproval: 6 }, outcomes: [{ id: "taper-ayuda", weight: 100, headline: "La ayuda llega sin número ni condición", text: "La campaña obtiene menos fotos, pero las familias reciben alimentos sin prometer votos." }] },
      { id: "taper-por-voto", label: "Repartir táperes con diez soles", hint: "Moviliza el mitin · posible exclusión", effects: { cleanMoney: -26000, approval: 7, legalRisk: 8 }, hiddenEffects: { credibility: -10, ruralApproval: 8, leakExposure: 13 }, addScandals: [{ id: "taperes-votos", label: "Dádivas repartidas durante la campaña" }], outcomes: [{ id: "taper-multitud", weight: 66, headline: "Miles llegan al mitin por el táper", text: "Las imágenes muestran una plaza llena y coordinadores repitiendo el número de lista." }, { id: "taper-video", weight: 34, headline: "Un video muestra dinero dentro de los táperes", text: "El jurado electoral abre un procedimiento y los rivales exigen excluirte.", effects: { approval: -10, legalRisk: 16 } }] },
    ],
  },
];

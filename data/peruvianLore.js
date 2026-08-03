const THEME_EVENTS = {
  reforma_y_retorno: [
    "debate-ideologico-joven", "reforma-economica", "reforma-pensiones", "reforma-constitucional", "ley-pulpin", "pagina-once",
    "pensiones-cobran-reforma",
  ],
  conflicto_interno: [
    "reinsercion-regreso", "archivo-subversivo", "asamblea-comunal", "reinsercion-mesa-democratica", "reinsercion-red-radical",
    "memoria-mrta", "memoria-sl", "justicia-rondas", "archivo-de-legado", "reinsercion-testigo-regresa", "reinsercion-red-investigada",
    "reinsercion-reparacion-territorial", "reinsercion-generacion-sucesora", "reinsercion-archivo-final",
  ],
  crisis_economica: [
    "negocio-expansion", "directorio-en-crisis", "ultima-empresa", "dolar-muc-amigos",
    "empresario-fideicomiso-politico", "empresario-contratos-auditoria", "empresario-sucesion-patrimonial",
  ],
  autogolpe_y_archivos: [
    "empresario-confirmacion", "archivo-palacio", "secreto-familiar", "canal-publico", "narcoavion-presidencial",
  ],
  prensa_y_poder: [
    "debate-televisado", "radio-regional", "programa-dominical", "filtracion-podcast", "guerra-de-redes", "documental-biografico", "cantante-ricardo-sway", "diarios-chicha", "cerco-mediatico",
    "debate-antiguo-regresa",
  ],
  transicion_2000: [
    "voluntariado-desastre", "mediacion-nacional", "reconciliacion-historica",
    "voluntariado-rinde-cuentas",
  ],
  descentralizacion: [
    "provincia-obra", "salto-regional", "presupuesto-participativo", "herencia-regional", "provincia-control-obra", "promesa-provincial-pendiente", "cabildo-juvenil", "dinamicos-del-centro", "centralita-regional",
    "provincia-obra-envejece", "provincia-red-nacional", "provincia-legado-territorial",
    "presupuesto-participativo-balance",
  ],
  obras_y_adendas: [
    "contrato-municipal", "concesion-transporte", "provincia-favor-cobrado", "auditoria-municipal", "adenda-heredada", "comunicore-municipal",
  ],
  lava_jato: [
    "fiscalia-cerca", "cena-donantes", "investigacion-avanzada", "comision-anticorrupcion", "agendas-primera-dama", "petroaudios-faenon", "ecoteva-suegra", "campana-no-revocatoria", "patrimonio-inexplicable",
  ],
  justicia_capturada: [
    "comision-investigadora", "nombramiento-judicial", "orden-captura", "narcoindultos", "repartija-institucional", "mochasueldos-despacho",
    "revision-arresto-domiciliario", "juicio-en-libertad",
  ],
  conflictos_extractivos: [
    "protesta-regional", "proyecto-minero", "lobby-extranjero", "retorno-minera", "pasivo-minero",
    "protesta-cobra-acuerdo", "fondo-extranjero-auditoria",
  ],
  partidos_alquiler: [
    "juventud-partidaria", "eleccion-universitaria", "practicas-congreso", "cambio-partido", "alianza-rival", "control-partido",
    "primaria-partidaria", "archivo-parlamentario", "dinastia-bancada", "dinastia-gira-propia", "tesis-copiada", "dinastia-operador-cobra", "dinastia-familia-se-divide", "partido-despues-palacio",
    "dinastia-primera-deuda", "dinastia-ruptura-generacional", "dinastia-archivo-familiar-final",
  ],
  financiamiento_electoral: [
    "asesoria-campana", "primer-financista", "financista-cobra-deuda", "empresario-campana", "caja-vacia", "credito-campana-banco", "oferta-vicepresidencia", "cocteles-naranjas", "plata-como-estadio", "taperes-campana",
  ],
  politica_digital: [
    "redes-viral", "podcaster-lanzamiento", "publicidad-politica", "testaferro-mediatico", "salto-voceria", "ruta-figura-culto",
    "practicas-periodismo", "fondo-ong", "podcast-ruta-ideologica", "podcast-ruta-sensacional", "podcast-ruta-independiente",
    "datos-plataforma", "fuente-del-pasado", "patrocinador-viral", "debate-universitario", "rumor-ataud-garnica", "remix-bebito-chu-chu",
    "podcaster-medio-cubre-carrera", "podcaster-archivo-regresa", "podcaster-sucesion-medio",
    "red-digital-pide-lugar",
  ],
  vacancias_y_confianza: [
    "crisis-presidencial", "oferta-premier", "censura-ministerial", "mocion-vacancia", "coalicion-congreso", "gabinete-presidencial",
    "chifa-encapuchado", "casa-sarratea", "dinero-bano-palacio", "mamanivideos-obras", "los-ninos-obras", "hermano-en-la-sombra", "fractura-altos-mandos",
  ],
  protestas_y_sucesion: [
    "seguridad-ciudadana", "crisis-fronteriza", "consejo-de-estado",
  ],
  elecciones_bicamerales: [
    "dinastia-apellido", "campana-congreso", "candidatura-alcaldia", "eleccion-nacional", "estrategia-presidencial",
    "debate-presidencial", "escrutinio-presidencial", "segunda-vuelta", "cilicio-candidato",
  ],
  estado_social: [
    "huelga-servicios", "conflicto-docente", "reforma-salud", "ano-perfil-bajo", "ano-balance-publico", "vacunagate-vip",
  ],
  emergencias_nacionales: [
    "nino-costero-nacional", "terremoto-costa-central", "sequia-sur-andino", "incendios-amazonia-nacional",
    "epidemia-respiratoria-nacional", "derrame-petroleo-amazonia",
  ],
  vida_privada: [
    "pareja-militante", "credito-vivienda", "familiar-contratado", "emprendimiento-familiar", "separacion-equipo", "escandalo-pareja", "relojes-wayki", "cirugia-secreta-palacio", "audio-amor-premier",
  ],
  prision_exilio: [
    "vida-exilio", "prision-decision", "vida-prision", "indulto-antiguo-aliado", "taller-penitenciario", "visita-politica-prision",
    "tribunal-internacional", "coalicion-exilio",
  ],
  legado: [
    "oferta-ministerial", "foro-internacional", "embajada-estrategica", "asesoria-expresidente", "fundacion-legado", "memorias-politicas",
    "mentor-en-caida", "mentor-sucesion", "ultima-retirada", "familiar-candidato", "premio-internacional", "salud-y-agenda", "catedra-politica",
    "sucesor-marca-distancia", "comision-postpresidencial", "regreso-del-expresidente", "cumbre-expresidentes",
  ],
};

const COPY_OVERRIDES = {
  "reinsercion-regreso": {
    title: "Volver a la plaza después de la Comisión de Verdad",
    kicker: "El retorno · libertad no significa absolución pública",
    description: "Cumpliste condena y reapareces cuando municipios y colectivos discuten reparaciones. Víctimas, antiguos militantes y fiscales interpretan de modo distinto tu derecho a volver a la política.",
  },
  "dinastia-apellido": {
    title: "El apellido vuelve en una lista de Diputados",
    kicker: "Elecciones 2026 · la dinastía conserva casillero",
    description: "La familia Del Pino perdió Palacio después de un gobierno autoritario, una renuncia enviada desde Asia y años de procesos. Ahora el partido te ofrece reemplazar a tu tío en la lista de Diputados.",
    options: {
      "aceptar-herencia": { label: "Aceptar el número heredado", hint: "Maquinaria nacional · también heredas el archivo" },
      "romper-apellido": { label: "Competir sin el símbolo familiar", hint: "Ruta propia · pierdes el aparato del clan" },
    },
  },
  "provincia-obra": {
    title: "La carretera que existe en tres campañas y ningún mapa",
    kicker: "Política provincial · expediente, faena y buena pro",
    description: "La vía prometida por alcaldes y gobernadores sigue inconclusa. La comunidad ofrece trabajo colectivo; una constructora ligada al clan regional promete terminarla si controla el contrato.",
  },
  "empresario-campana": {
    title: "El partido busca un gerente para el país",
    kicker: "Outsider empresarial · tecnocracia con financistas",
    description: "Una alianza sin candidato te propone convertir tu prestigio empresarial en campaña presidencial. Ofrecen técnicos y símbolo; esperan que tu grupo pague la operación y no pregunte demasiado por los aportantes.",
  },
  "podcaster-lanzamiento": {
    title: "El Jornal de Churwen define su línea política",
    kicker: "Audiencia, sátira y poder editorial",
    description: "El canal ya convirtió expedientes, humor y clips en una audiencia propia. Periodistas, marcas y comandos esperan saber si El Jornal de Churwen será medio, tribuna militante o maquinaria personal.",
  },
  "redes-viral": {
    title: "El Jornal de Churwen comparte tu minuto viral",
    kicker: "La política pasa del mitin al clip",
    description: "El Jornal de Churwen convierte tu cruce con un funcionario en el video político del día. El equipo del candidato Junio Gizman pregunta si puede usarlo como puente informal hacia votantes jóvenes.",
  },
  "publicidad-politica": {
    title: "Junio Gizman llega al estudio del Jornal de Churwen",
    kicker: "Entrevista, pauta o brazo digital",
    description: "La candidatura morada ofrece financiar una temporada completa si el candidato aparece como invitado recurrente. El contrato es legal, pero puede borrar la frontera entre medio, influencer y comando de campaña.",
    options: {
      "publicidad-declarada": { label: "Publicar contrato y marcar la pauta", hint: "Ingreso formal · la audiencia conoce el vínculo" },
      "publicidad-encubierta": { label: "Integrarlo como contenido espontáneo", hint: "Más dinero · dependencia y filtración futura" },
    },
  },
  "testaferro-mediatico": {
    title: "Gizman quiere usar al Jornal de Churwen como testaferro",
    kicker: "La campaña necesita ocultar bienes y gastos",
    description: "Junio Gizman propone poner vehículos, una oficina de campaña y contratos de producción a nombre del Jornal de Churwen. A cambio recibirás una mensualidad y acceso directo a su comando.",
    options: {
      "prestar-nombre": {
        label: "Aceptar ser el testaferro de Gizman",
        hint: "Dinero y acceso · alto riesgo judicial",
        outcomes: {
          "bienes-ocultos": { headline: "El Jornal de Churwen se convierte en la caja patrimonial de la campaña", text: "Los vehículos, la oficina y varios pagos quedan a tu nombre mientras Gizman conserva distancia formal." },
          "registro-cruzado": { headline: "Fiscalía conecta los bienes del Jornal de Churwen con Gizman", text: "Contratos, transferencias y mensajes revelan que el canal ocultó parte de la estructura patrimonial de la campaña." },
        },
      },
      "rechazar-testaferro": {
        label: "Rechazarlo y guardar los mensajes",
        hint: "Pierdes acceso · conservas una exclusiva",
        outcomes: {
          "operador-se-aleja": { headline: "Gizman busca otro nombre para sus bienes", text: "El comando corta la relación con el Jornal de Churwen, pero los mensajes quedan listos para una futura investigación." },
        },
      },
    },
  },
  "empresario-confirmacion": {
    title: "Un maletín entra a la salita de los videos",
    kicker: "La cámara está apagada, supuestamente",
    description: "Un operador de inteligencia ofrece protección, publicidad y votos tránsfugas. Sobre la mesa deja efectivo; detrás de un falso muro, una cámara registra la reunión.",
  },
  "archivo-palacio": {
    title: "Las cajas, la salita y el fax desde el extranjero",
    kicker: "Tu herencia · el archivo de un régimen",
    description: "El exsecretario familiar conserva cintas, agendas y cartas del gobierno de tu madre. Abrirlas puede explicar cómo cayó la Casa Del Pino o comprometer a quienes todavía sostienen tu maquinaria.",
  },
  "cambio-partido": {
    title: "Un partido-vientre ofrece mejor número",
    kicker: "Símbolo prestado · lealtad con fecha de cierre",
    description: "Una organización que conserva inscripción pero casi no tiene militantes te ofrece su casillero y un puesto expectante. A cambio, su dueño quiere controlar la lista y dos futuras comisiones.",
  },
  "contrato-municipal": {
    title: "El Club del Cemento reparte la buena pro",
    kicker: "Limpieza pública · postores que ya se conocen",
    description: "Tres empresas presentan propuestas casi idénticas. Un audio sugiere que se turnan contratos y reservan un margen para alcaldes, intermediarios y la siguiente campaña.",
  },
  "adenda-heredada": {
    title: "Odebrasa pregunta por la adenda antigua",
    kicker: "Tu pasado empresarial · el contrato nunca terminó",
    description: "Contraloría revisa una ampliación firmada cuando dirigías la constructora. El documento promete terrenos que el Estado aún no tenía y trasladó sobrecostos al presupuesto público.",
  },
  "cena-donantes": {
    title: "El cóctel recauda más que todas sus entradas",
    kicker: "Campaña nacional · aportantes que luego olvidan",
    description: "El partido declara una cena multitudinaria, pero las cuentas no explican el monto recaudado. Empresarios ofrecen completar la diferencia mediante aportantes pequeños y agendas sin membrete.",
  },
  "fiscalia-cerca": {
    title: "Fiscalía te cita por primera vez",
    kicker: "Un expediente ya contiene tu nombre",
    description: "Un fiscal abre diligencias y te entrega los hechos que investiga. Puede tratarse de aportes, contratos, patrimonio o testimonios acumulados durante tu carrera.",
  },
  "nombramiento-judicial": {
    title: "Los Cuellos Almidonados llaman desde el Puerto",
    kicker: "Una plaza judicial · demasiadas llamadas",
    description: "Consejeros, jueces y empresarios coordinan el nombramiento de un magistrado por teléfono. Respaldarlo asegura protección; una sola grabación puede convertir el favor en red criminal.",
  },
  "proyecto-minero": {
    title: "Tía Marina vuelve al valle del ajo",
    kicker: "Cobre, agua y un estudio que no convence",
    description: "La empresa asegura que el nuevo expediente protege el agua y crea empleo. Agricultores recuerdan protestas anteriores, muertos y compromisos incumplidos; el Gobierno exige una decisión rápida.",
  },
  "retorno-minera": {
    title: "Ponga regresa con otro estudio",
    kicker: "Tu antecedente · la laguna sigue en el mapa",
    description: "La minera rediseñó el proyecto y promete reservorios, canon y empleo. Las comunidades que detuvieron la primera versión creen que solo cambió el lenguaje del mismo conflicto.",
  },
  "mocion-vacancia": {
    title: "La vacancia por incapacidad moral llega al Pleno",
    kicker: "Palacio cuenta votos · la calle cuenta agravios",
    description: "El Congreso usa una causal amplia después de escuchar audios y testimonios contradictorios. Puedes negociar la supervivencia, confrontar o aceptar una salida constitucional.",
  },
  "crisis-presidencial": {
    title: "Tres presidencias caben en una semana",
    kicker: "Sucesión legal · legitimidad en disputa",
    description: "La vacancia, la renuncia de la mesa directiva y las protestas dejan al país cambiando de presidente a toda velocidad. Las muertes de dos jóvenes vuelven insuficiente cualquier explicación puramente legal.",
  },
  "coalicion-congreso": {
    title: "Confianza, censura y amenaza de cierre",
    kicker: "Dos poderes interpretan la misma Constitución",
    description: "El Congreso bloquea reformas y el Ejecutivo convierte una votación en cuestión de confianza. Ambas partes creen que la Constitución les permite forzar el desenlace.",
  },
  "reforma-constitucional": {
    title: "Del Congreso único al regreso de dos cámaras",
    kicker: "Constituciones de 1979, 1993 y reforma de 2026",
    description: "El país vuelve a discutir contrapesos, reelección parlamentaria y representación regional. La propuesta recupera Senado y Diputados, pero también redistribuye quién controla nombramientos y leyes.",
  },
  "eleccion-nacional": {
    title: "Palacio, Senado y Diputados en una sola elección",
    kicker: "Calendario nacional · cada cinco años",
    description: "Decenas de símbolos llenan la cédula y el retorno bicameral obliga a repartir recursos entre tres campañas. Puedes volver a postular a la presidencia, buscar una cámara o guardar fuerzas para el siguiente ciclo.",
  },
  "memoria-mrta": {
    title: "La residencia del embajador nunca cerró del todo",
    kicker: "Tu pasado · rehenes, operación y memoria",
    description: "Una exrehén del Movimiento Revolucionario Todos Amigos (MRTA) pide hablar. Para ella, la crisis de la residencia no es una hazaña ni una serie: son meses de cautiverio y una herida todavía discutida.",
  },
  "memoria-sl": {
    title: "Una comunidad de Ayacucho reconoce tu alias",
    kicker: "Tu pasado · la violencia no fue una abstracción",
    description: "Familiares de víctimas vinculan tu antiguo alias con una columna del Sindicato Luciérnaga. La Comisión de Verdad dejó testimonios; ahora debes decidir si entregas información o sostienes la negación.",
  },
  "archivo-subversivo": {
    title: "Un tomo perdido de la Comisión de Verdad",
    kicker: "Ruta secreta · nombres que nunca llegaron al anexo",
    description: "Un archivo reúne testimonios, mandos regionales y operaciones estatales omitidas del expediente público. Publicarlo puede esclarecer víctimas o convertirse en moneda de presión.",
  },
  "indulto-antiguo-aliado": {
    title: "Un indulto aparece antes de la vacancia",
    kicker: "Humanidad, pacto o intercambio de votos",
    description: "Un aliado condenado pide una gracia presidencial por salud. Su bloque parlamentario insinúa que podría salvar al Gobierno si la resolución llega antes de la votación.",
  },
  "escrutinio-presidencial": {
    title: "Cada acta impugnada divide un poco más al país",
    kicker: "Resultado estrecho · abogados en lugar de mítines",
    description: "La diferencia es mínima y ambos comandos despliegan personeros. Revisar actas es legítimo; declarar fraude sin pruebas puede destruir la confianza que necesitarás para gobernar.",
  },
  "datos-plataforma": {
    title: "Tu plataforma conoce cómo votan sus usuarios",
    kicker: "Fortuna digital · datos antes que padrones",
    description: "El comando descubre que tus datos de consumo permiten inferir distrito, ingresos e intereses políticos. Usarlos ofrece una campaña precisa, aunque los usuarios nunca autorizaron propaganda.",
  },
  "conflicto-docente": {
    options: {
      "enfrentar-sindicato-docente": { hint: "Respaldo técnico · conflicto sindical" },
    },
  },
  "tesis-copiada": {
    options: {
      "blindar-tesis": { hint: "Conserva credenciales · aumenta la exposición" },
    },
  },
  "dinero-bano-palacio": {
    options: {
      "proteger-secretario": { hint: "Conserva la red · riesgo de fuga" },
    },
  },
  "mamanivideos-obras": {
    options: {
      "rechazar-compra-votos": { hint: "Riesgo de vacancia · evita compra de votos" },
    },
  },
  "caja-vacia": {
    title: "No queda ni para el pasaje del equipo",
    kicker: "Caja en cuidados intensivos · alguien tendrá que pagar",
    options: {
      "buscar-inversionistas": { label: "Pasar el sombrero entre empresarios", hint: "Entra plata limpia · salen favores futuros" },
      "trabajo-consultoria": { label: "Volver a chambear y bajar el perfil", hint: "Caja honesta · desapareces del radar político" },
      "negocio-ilicito": { label: "Aceptar la plata que no hace preguntas", hint: "Efectivo rápido · Fiscalía puede preguntar después" },
    },
  },
  "investigacion-avanzada": {
    title: "Fiscalía ya no manda cartita: prepara operativo",
    kicker: "Colaboradores citados · maletas vigiladas",
    options: {
      "defensa-institucional": { label: "Llegar con peritos, papeles y buenos abogados", hint: "Carísimo · puede tumbar parte del caso" },
      "preparar-fuga": { label: "Armar la maleta antes del amanecer", hint: "Posible exilio · pésima foto si te atrapan" },
    },
  },
  "orden-captura": {
    title: "Tu nombre amaneció en una orden judicial",
    kicker: "Tocas la puerta del juez o buscas la frontera",
    options: {
      "entrega-justicia": { label: "Entregarte con cámaras y abogado", hint: "Defensa pública · arresto o prisión" },
      "colaboracion-eficaz-propia": { label: "Cantar antes que canten los demás", hint: "Posible libertad · enemigos para siempre" },
      "fuga-clandestina": { label: "Salir por donde no sellan pasaporte", hint: "Asilo o captura · sin punto medio" },
    },
  },
  "vida-exilio": {
    title: "Hacer política por videollamada y con horario ajeno",
    kicker: "Exilio · buena señal, mala distancia",
    options: {
      "entrevista-exilio": { label: "Denunciar persecución en todos los canales", hint: "La base despierta · el Gobierno protesta" },
      "retorno-negociado": { label: "Llamar a Fiscalía y tantear el regreso", hint: "Puede abrir la puerta · también confirmar la orden" },
      "asesor-internacional": { label: "Cobrar por arreglar la política de otro país", hint: "Buen sueldo · tu movimiento queda lejos" },
    },
  },
  "prision-decision": {
    title: "La campaña entró al penal con visita y manuscrito",
    kicker: "Muros altos · operadores con señal",
    options: {
      "libro-prision": { label: "Escribir el best seller del pabellón", hint: "Plata y tribuna · el expediente sigue ahí" },
      "negociar-informacion-prision": { label: "Contar lo que sabes y pedir rebaja", hint: "Menos encierro · aliados furiosos" },
      "sucesor-desde-prision": { label: "Gobernar el partido por recados", hint: "Influencia indirecta · sucesor con ambición" },
    },
  },
  "reinsercion-reparacion-territorial": {
    title: "¡Habla de una vez! La comunidad exige nombres",
    kicker: "Cero floro · hay expedientes, testigos y viejos camaradas",
    options: {
      "abrir-archivos-reinsercion": { label: "Soltar nombres y documentos verificables", hint: "Verdad completa · la vieja red te declara traidor" },
      "pactar-silencio-reinsercion": { label: "Cerrar filas y negar que exista algo más", hint: "Operadores fieles · un testigo puede cantar" },
    },
  },
  "reinsercion-generacion-sucesora": {
    title: "La nueva generación no se compra tu versión",
    kicker: "Víctimas, viejos cuadros y una silla para el sucesor",
    options: {
      "respaldar-lideresa-reparacion": { label: "Darle las llaves a la lideresa de reparación", hint: "Renovación real · dejas de mandar" },
      "entregar-mando-antiguo-cuadro": { label: "Devolverle la maquinaria al viejo cuadro", hint: "Disciplina brava · regresan todos los fantasmas" },
    },
  },
  "reinsercion-archivo-final": {
    title: "Cuarenta cajas pueden hundirte o explicar tu vida",
    kicker: "Último archivo · la historia viene sin botón de borrar",
    options: {
      "ceder-archivo-reinsercion": { label: "Abrir hasta la última caja", hint: "Verdad duradera · pierdes el control del cuento" },
      "controlar-memorias-reinsercion": { label: "Publicar la versión bonita del movimiento", hint: "Protege aliados · alguien guarda las páginas cortadas" },
    },
  },
  "dinastia-primera-deuda": {
    title: "La familia saca la libreta: todo favor tiene precio",
    kicker: "Apellido con yapa · aportes, puestos y parientes en fila",
    options: {
      "auditar-deudas-dinastia": { label: "Sacar los trapitos y las cuentas al sol", hint: "Partido abierto · bronca familiar garantizada" },
      "pagar-cuotas-dinastia": { label: "Pagar la deuda con puestos en la lista", hint: "La familia aplaude · la militancia toma nota" },
    },
  },
  "dinastia-ruptura-generacional": {
    title: "Guerra de herederos: el apellido solo tiene un timón",
    kicker: "Vieja guardia contra sangre nueva",
    options: {
      "primaria-generacional-dinastia": { label: "Que las urnas decidan al heredero", hint: "Legitimidad · también puedes perder" },
      "imponer-heredero-dinastia": { label: "Poner al heredero a dedo", hint: "Mando rápido · partido partido" },
    },
  },
  "dinastia-archivo-familiar-final": {
    title: "Las cajas del clan guardan décadas de roche",
    kicker: "Archivo familiar · logros arriba, pactos debajo",
    options: {
      "abrir-archivo-dinastia": { label: "Mandar todas las cajas a la biblioteca", hint: "Historia verificable · la familia queda expuesta" },
      "fundacion-familiar-archivo": { label: "Armar un museo con vitrina y llave propia", hint: "Bonita exhibición · archivo completo bajo siete llaves" },
    },
  },
  "provincia-obra-envejece": {
    title: "¡Se cae la obra que te lanzó a la fama!",
    kicker: "Lluvia, huecos y una constructora con buena memoria",
    options: {
      "mantenimiento-comunal-obra": { label: "Abrir las cuentas y reparar con la comunidad", hint: "Cuesta limpio · la obra vuelve a servir" },
      "adenda-constructora-provincia": { label: "Firmar otra adenda con los mismos de siempre", hint: "Parche veloz · deuda política recargada" },
    },
  },
  "provincia-red-nacional": {
    title: "Lima llega con logo, puestos y chequera",
    kicker: "Tu red provincial está en oferta · según ellos",
    options: {
      "integrar-partido-nacional-provincia": { label: "Subir la red al bus del partido limeño", hint: "Llegas al poder · Lima elige la ruta" },
      "alianza-regiones-autonoma": { label: "Armar un bloque que no pida permiso a Lima", hint: "Identidad regional · menos plata y más coordinación" },
    },
  },
  "provincia-legado-territorial": {
    title: "¿Escuela de líderes o caudillo con heredero?",
    kicker: "El territorio decide qué sobrevive a tu nombre",
    options: {
      "escuela-gestion-provincial": { label: "Enseñar el oficio y repartir el poder", hint: "Legado duradero · ya no das todas las órdenes" },
      "designar-caudillo-provincial": { label: "Coronar al nuevo patrón de la red", hint: "Maquinaria intacta · el discípulo puede voltearse" },
    },
  },
  "empresario-fideicomiso-politico": {
    title: "El directorio grita: empresa o campaña, decide",
    kicker: "Acciones, contratos y un candidato en la misma foto",
    options: {
      "fideicomiso-independiente-empresa": { label: "Soltar la empresa de verdad", hint: "Pierdes el timón · ganas recibos defendibles" },
      "sociedad-familiar-control": { label: "Pasarle las llaves a la familia", hint: "Sigues mandando bajito · huele a testaferro" },
    },
  },
  "empresario-contratos-auditoria": {
    title: "Contraloría abre el Excel que nadie quería ver",
    kicker: "Contrato por contrato · favor por favor",
    options: {
      "publicar-contratos-empresario": { label: "Abrir el Excel y devolver lo cuestionado", hint: "Duele al bolsillo · baja el riesgo" },
      "presionar-auditoria-empresario": { label: "Llamar al amigo que sabe archivar informes", hint: "Salva patrimonio · fabrica testigos" },
    },
  },
  "empresario-sucesion-patrimonial": {
    title: "¿Quién hereda el imperio y quién hereda el partido?",
    kicker: "Fortuna, apellido y maquinaria buscan dueño",
    options: {
      "directorio-profesional-legado": { label: "Dejar profesionales y cuentas abiertas", hint: "Menos control · empresa con futuro propio" },
      "heredero-empresa-partido": { label: "Entregarle todo al mismo heredero", hint: "Poder completo · traición completa" },
    },
  },
  "podcaster-medio-cubre-carrera": {
    title: "Tu propio canal te pone la cámara en la cara",
    kicker: "El entrevistador ahora también es el investigado",
    options: {
      "muro-editorial-podcaster": { label: "Dar libertad hasta para investigarte", hint: "Credibilidad premium · puede doler en vivo" },
      "canal-maquinaria-podcaster": { label: "Convertir cada programa en mitin", hint: "Audiencia prendida · periodismo apagado" },
    },
  },
  "podcaster-archivo-regresa": {
    title: "La nube no olvida tus clips, pagos ni contradicciones",
    kicker: "Diez años de archivo caen en una sola carpeta",
    options: {
      "abrir-archivo-podcaster": { label: "Subir contratos, clips completos y roche incluido", hint: "Contexto real · golpe controlado" },
      "borrar-archivo-podcaster": { label: "Mandar al olvido lo más picante", hint: "Alivio corto · siempre existe una copia" },
    },
  },
  "podcaster-sucesion-medio": {
    title: "¿Quién se queda con el micrófono y los seguidores?",
    kicker: "El canal sobrevive · tu control quizá no",
    options: {
      "cooperativa-medio-podcaster": { label: "Entregar el canal a periodistas y audiencia", hint: "Voz independiente · ya no eliges la portada" },
      "heredero-mediatico-podcaster": { label: "Coronar al nuevo dueño del micrófono", hint: "Conserva la tribuna · puede cambiarte el libreto" },
    },
  },
  "red-digital-pide-lugar": {
    title: "Los admins del primer viral vienen por su tajada",
    kicker: "Claves, padrones y capturas de pantalla",
    options: {
      "integrar-red-digital-antigua": { label: "Darles voto, voz y silla", hint: "Base real · el chat también fiscaliza" },
      "comprar-red-digital-antigua": { label: "Comprar las claves y cerrar el grupo", hint: "Control rápido · recibo peligroso" },
    },
  },
  "voluntariado-rinde-cuentas": {
    title: "La ayuda con cámara regresa con factura",
    kicker: "Damnificados, proveedores y fotos que no envejecieron",
    options: {
      "auditar-voluntariado-antiguo": { label: "Buscar factura por factura y familia por familia", hint: "Toma tiempo · deja pruebas" },
      "usar-imagenes-voluntariado": { label: "Responder con el documental lacrimógeno", hint: "Golpe al corazón · cero respuesta contable" },
    },
  },
  "protesta-cobra-acuerdo": {
    title: "El acta que juraste cumplir vuelve con megáfono",
    kicker: "La firma es tuya · el bloqueo también puede serlo",
    options: {
      "cumplir-acta-protesta": { label: "Poner fecha, plata y responsables", hint: "Caro pero claro · baja la protesta" },
      "desconocer-acta-protesta": { label: "Decir que esa firma era de otro gobierno", hint: "Ahorras hoy · la plaza se acuerda" },
    },
  },
  "debate-antiguo-regresa": {
    title: "El debate viejo te cae como huayco en campaña",
    kicker: "Tu frase de ayer pelea con tu voto de hoy",
    options: {
      "explicar-cambio-debate": { label: "Pasar el video completo y comerte el error", hint: "Duele un rato · la explicación aguanta" },
      "recortar-debate-antiguo": { label: "Responder con un clip más mañoso", hint: "Viral primero · verificación después" },
    },
  },
  "fondo-extranjero-auditoria": {
    title: "El fondo extranjero llega con Excel y cero paciencia",
    kicker: "Beneficiarios, operadores y gastos llamados formación",
    options: {
      "evaluacion-publica-fondo": { label: "Abrir cuentas aunque salpique al equipo", hint: "Informe incómodo · prestigio salvable" },
      "negociar-informe-fondo": { label: "Pedir que borren la parte más sabrosa", hint: "Protege operadores · el borrador puede filtrarse" },
    },
  },
  "pensiones-cobran-reforma": {
    title: "Los jubilados llegan con recibos y poca paciencia",
    kicker: "La reforma bonita por fin paga su primera pensión",
    options: {
      "corregir-reforma-pensiones": { label: "Poner plata y tapar el hueco", hint: "Cuesta al fisco · llega al bolsillo" },
      "defender-reforma-pensiones": { label: "Decir que las reglas son las reglas", hint: "Caja ordenada · calle caliente" },
    },
  },
  "presupuesto-participativo-balance": {
    title: "Los barrios sacan las actas: ¿dónde está la obra?",
    kicker: "Fotos, firmas y presupuesto que tomó otro camino",
    options: {
      "cerrar-obras-participativas": { label: "Terminar lo prometido y mostrar cada sol", hint: "Cuesta limpio · recupera el barrio" },
      "reescribir-balance-participativo": { label: "Maquillar el informe y cruzar los dedos", hint: "Gestión bonita · actas feas" },
    },
  },
};

function buildThemeIndex() {
  const index = new Map();
  for (const [themeId, eventIds] of Object.entries(THEME_EVENTS)) {
    for (const eventId of eventIds) {
      if (index.has(eventId)) throw new Error(`El evento ${eventId} tiene dos temas históricos`);
      index.set(eventId, themeId);
    }
  }
  return index;
}

const THEME_INDEX = buildThemeIndex();

function mergeOptionCopy(option, override = {}) {
  const outcomeOverrides = override.outcomes ?? {};
  return {
    ...option,
    ...override,
    outcomes: (option.outcomes ?? []).map((outcome) => ({ ...outcome, ...(outcomeOverrides[outcome.id] ?? {}) })),
  };
}

export function applyPeruvianLore(events) {
  const eventIds = new Set(events.map((event) => event.id));
  const unknownOverrides = Object.keys(COPY_OVERRIDES).filter((eventId) => !eventIds.has(eventId));
  if (unknownOverrides.length) throw new Error(`Lore apunta a eventos inexistentes: ${unknownOverrides.join(", ")}`);
  const unmappedEvents = events.filter((event) => !THEME_INDEX.has(event.id)).map((event) => event.id);
  if (unmappedEvents.length) throw new Error(`Eventos sin contexto histórico: ${unmappedEvents.join(", ")}`);
  for (const event of events) {
    const optionIds = new Set((event.options ?? []).map((option) => option.id));
    const unknownOptions = Object.keys(COPY_OVERRIDES[event.id]?.options ?? {}).filter((optionId) => !optionIds.has(optionId));
    if (unknownOptions.length) throw new Error(`Lore de ${event.id} apunta a opciones inexistentes: ${unknownOptions.join(", ")}`);
  }

  return events.map((event) => {
    const override = COPY_OVERRIDES[event.id] ?? {};
    const optionOverrides = override.options ?? {};
    const options = (event.options ?? []).map((option) => mergeOptionCopy(option, optionOverrides[option.id]));
    return {
      ...event,
      ...override,
      options,
    };
  });
}

export const PERUVIAN_LORE_COVERAGE = {
  explicitlyMapped: THEME_INDEX.size,
  overridden: Object.keys(COPY_OVERRIDES).length,
};

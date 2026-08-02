const THEME_EVENTS = {
  reforma_y_retorno: [
    "debate-ideologico-joven", "reforma-economica", "reforma-pensiones", "reforma-constitucional", "ley-pulpin", "pagina-once",
  ],
  conflicto_interno: [
    "reinsercion-regreso", "archivo-subversivo", "asamblea-comunal", "reinsercion-mesa-democratica", "reinsercion-red-radical",
    "memoria-mrta", "memoria-sl", "justicia-rondas", "archivo-de-legado",
  ],
  crisis_economica: [
    "negocio-expansion", "directorio-en-crisis", "ultima-empresa", "dolar-muc-amigos",
  ],
  autogolpe_y_archivos: [
    "empresario-confirmacion", "archivo-palacio", "secreto-familiar", "canal-publico", "narcoavion-presidencial",
  ],
  prensa_y_poder: [
    "debate-televisado", "radio-regional", "programa-dominical", "filtracion-podcast", "guerra-de-redes", "documental-biografico", "cantante-ricardo-sway", "diarios-chicha", "cerco-mediatico",
  ],
  transicion_2000: [
    "voluntariado-desastre", "mediacion-nacional", "reconciliacion-historica",
  ],
  descentralizacion: [
    "provincia-obra", "salto-regional", "presupuesto-participativo", "herencia-regional", "provincia-control-obra", "cabildo-juvenil", "dinamicos-del-centro", "centralita-regional",
  ],
  obras_y_adendas: [
    "contrato-municipal", "concesion-transporte", "provincia-favor-cobrado", "auditoria-municipal", "adenda-heredada", "comunicore-municipal",
  ],
  lava_jato: [
    "fiscalia-cerca", "cena-donantes", "investigacion-avanzada", "comision-anticorrupcion", "agendas-primera-dama", "petroaudios-faenon", "ecoteva-suegra", "campana-no-revocatoria", "patrimonio-inexplicable",
  ],
  justicia_capturada: [
    "comision-investigadora", "nombramiento-judicial", "orden-captura", "narcoindultos", "repartija-institucional", "mochasueldos-despacho",
  ],
  conflictos_extractivos: [
    "protesta-regional", "proyecto-minero", "lobby-extranjero", "retorno-minera", "pasivo-minero",
  ],
  partidos_alquiler: [
    "juventud-partidaria", "eleccion-universitaria", "practicas-congreso", "cambio-partido", "alianza-rival", "control-partido",
    "primaria-partidaria", "archivo-parlamentario", "dinastia-bancada", "dinastia-gira-propia", "tesis-copiada",
  ],
  financiamiento_electoral: [
    "asesoria-campana", "primer-financista", "empresario-campana", "caja-vacia", "credito-campana-banco", "oferta-vicepresidencia", "cocteles-naranjas", "plata-como-estadio", "taperes-campana",
  ],
  politica_digital: [
    "redes-viral", "podcaster-lanzamiento", "publicidad-politica", "testaferro-mediatico", "salto-voceria", "ruta-figura-culto",
    "practicas-periodismo", "fondo-ong", "podcast-ruta-ideologica", "podcast-ruta-sensacional", "podcast-ruta-independiente",
    "datos-plataforma", "fuente-del-pasado", "patrocinador-viral", "debate-universitario", "rumor-ataud-garnica", "remix-bebito-chu-chu",
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
    "huelga-servicios", "conflicto-docente", "reforma-salud", "ano-perfil-bajo", "vacunagate-vip",
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
    title: "El Diario de Churwen define su línea política",
    kicker: "Audiencia, sátira y poder editorial",
    description: "El canal ya convirtió expedientes, humor y clips en una audiencia propia. Periodistas, marcas y comandos esperan saber si Churwen será medio, tribuna militante o maquinaria personal.",
  },
  "redes-viral": {
    title: "El Diario de Churwen comparte tu minuto viral",
    kicker: "La política pasa del mitin al clip",
    description: "Churwen convierte tu cruce con un funcionario en el video político del día. El equipo del candidato Julio Gizmán pregunta si puede usarlo como puente informal hacia votantes jóvenes.",
  },
  "publicidad-politica": {
    title: "Julio Gizmán llega al estudio de Churwen",
    kicker: "Entrevista, pauta o brazo digital",
    description: "La candidatura morada ofrece financiar una temporada completa si el candidato aparece como invitado recurrente. El contrato es legal, pero puede borrar la frontera entre medio, influencer y comando de campaña.",
    options: {
      "publicidad-declarada": { label: "Publicar contrato y marcar la pauta", hint: "Ingreso formal · la audiencia conoce el vínculo" },
      "publicidad-encubierta": { label: "Integrarlo como contenido espontáneo", hint: "Más dinero · dependencia y filtración futura" },
    },
  },
  "testaferro-mediatico": {
    title: "Gizmán quiere usar a Churwen como testaferro",
    kicker: "La campaña necesita ocultar bienes y gastos",
    description: "Julio Gizmán propone poner vehículos, una oficina de campaña y contratos de producción a nombre de Churwen. A cambio recibirás una mensualidad y acceso directo a su comando.",
    options: {
      "prestar-nombre": {
        label: "Aceptar ser el testaferro de Gizmán",
        hint: "Dinero y acceso · alto riesgo judicial",
        outcomes: {
          "bienes-ocultos": { headline: "Churwen se convierte en la caja patrimonial de la campaña", text: "Los vehículos, la oficina y varios pagos quedan a tu nombre mientras Gizmán conserva distancia formal." },
          "registro-cruzado": { headline: "Fiscalía conecta los bienes de Churwen con Gizmán", text: "Contratos, transferencias y mensajes revelan que el canal ocultó parte de la estructura patrimonial de la campaña." },
        },
      },
      "rechazar-testaferro": {
        label: "Rechazarlo y guardar los mensajes",
        hint: "Pierdes acceso · conservas una exclusiva",
        outcomes: {
          "operador-se-aleja": { headline: "Gizmán busca otro nombre para sus bienes", text: "El comando corta la relación con Churwen, pero los mensajes quedan listos para una futura investigación." },
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
    title: "Un colaborador eficaz entrega la agenda",
    kicker: "La caja dos empieza a tener iniciales",
    description: "Un antiguo operador presenta registros de aportes, reuniones y contratos posteriores. La fiscalía todavía no prueba el circuito completo, pero varias anotaciones coinciden con tu campaña.",
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
    title: "Conga Clara regresa con otro estudio",
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
    description: "Familiares de víctimas vinculan tu antiguo alias con una columna de Somos Lunáticos. La Comisión de Verdad dejó testimonios; ahora debes decidir si entregas información o sostienes la negación.",
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

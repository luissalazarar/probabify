// Bancos locales: todo el texto se compone dentro del juego, sin servicios externos.
export const ENDING_NARRATIVE_BANKS = {
  origins: {
    reinsercion: [
      "{name} volvió a la vida pública con el antecedente «{background}», bajo el peso constante de ese pasado.",
      "La historia de {name} empezó con el difícil retorno asociado a «{background}» y una confianza que nunca estuvo garantizada.",
      "{name} reconstruyó su carrera con «{background}» en el archivo; las antiguas redes y víctimas siguieron presentes.",
      "El antecedente «{background}» hizo que la carrera de {name} se midiera tanto por sus actos como por lo que decidió reconocer.",
    ],
    dinastia: [
      "{name} entró a la política con el apellido y los archivos de «{background}», una herencia que abrió puertas y también cobró deudas.",
      "La carrera de {name} nació con «{background}» y nunca pudo separar del todo el poder propio del poder heredado.",
      "{name} recibió la maquinaria de «{background}» antes de decidir cuánto obedecerla y cuánto cambiarla.",
      "El antecedente «{background}» mantuvo a la familia dentro de cada etapa importante de la carrera de {name}.",
    ],
    provincia: [
      "{name} construyó su primera base lejos de Lima con «{background}»; el territorio fue su escuela y su principal examen.",
      "La carrera de {name} partió del trabajo concreto asociado a «{background}» y del reto de crecer sin perder la base.",
      "El antecedente «{background}» enseñó a {name} que las comunidades recuerdan cada promesa y cada demora.",
      "El poder de {name} nació con «{background}» y dependió de convertir el respaldo local en una red más amplia.",
    ],
    empresario: [
      "{name} llegó con el capital, los contactos y el historial de «{background}»; los negocios nunca quedaron fuera de la política.",
      "La carrera pública de {name} comenzó con «{background}» y volvió difícil separar empresa y poder.",
      "{name} convirtió la influencia privada de «{background}» en una carrera vigilada de cerca por socios y rivales.",
      "El antecedente «{background}» dio autonomía económica a {name}, pero dejó preguntas sobre sus alianzas.",
    ],
    podcaster: [
      "{name} entró a la política con el antecedente «{background}» y convirtió una audiencia en fuerza pública.",
      "La carrera de {name} nació con «{background}»; cada titular podía sumar seguidores o cerrar una puerta.",
      "{name} convirtió la voz construida con «{background}» en influencia, mientras el archivo del canal acompañaba cada decisión pública.",
      "El antecedente «{background}» abrió el camino de {name}, pero también volvió pública cada contradicción.",
    ],
    default: [
      "{name} empezó su carrera con el antecedente «{background}», que siguió influyendo hasta el último año.",
      "La historia pública de {name} acumuló aliados, deudas y decisiones difíciles desde su punto de partida.",
    ],
  },
  originLegacies: {
    "legado-reinsercion-documentado": ["En el último tramo abrió archivos y dejó una versión verificable de su antigua organización.", "Su decisión final sobre el pasado fue documentarlo, aun a costa de romper viejas lealtades."],
    "legado-reinsercion-disputado": ["El pasado quedó bajo versiones enfrentadas y siguió dividiendo la lectura de su retorno.", "Defendió su propia versión hasta el final y dejó la memoria de la antigua organización en disputa."],
    "legado-dinastia-abierto": ["Abrió el archivo familiar y permitió que el apellido fuera revisado junto con sus deudas.", "La última decisión sobre la dinastía fue entregar documentos y aceptar una memoria incómoda."],
    "legado-dinastia-curado": ["La familia conservó el control del archivo y protegió una versión seleccionada de su historia.", "El apellido cerró filas alrededor de un archivo revisado, útil para el legado y vulnerable a nuevas filtraciones."],
    "legado-provincia-institucional": ["Dejó reglas y una sucesión territorial capaces de funcionar sin su mando diario.", "Su última obra provincial fue convertir una red personal en una institución con relevo."],
    "legado-provincia-caudillo": ["La red territorial siguió dependiendo de su nombre y de acuerdos personales.", "Conservó el mando provincial hasta el final, pero no dejó una sucesión independiente."],
    "legado-empresarial-institucional": ["Separó la sucesión empresarial de la organización política y dejó cuentas más claras.", "El patrimonio cerró con reglas capaces de sobrevivir sin mezclar cada negocio con el partido."],
    "legado-empresarial-heredado": ["Entregó patrimonio y organización a una misma sucesión, manteniendo unido el poder familiar.", "La empresa y la red política terminaron bajo una herencia común y difícil de separar."],
    "legado-podcaster-cooperativo": ["El canal quedó en manos de una comunidad capaz de sostener el archivo sin una sola voz dominante.", "Su última decisión mediática fue repartir el control y proteger el archivo como un bien colectivo."],
    "legado-podcaster-heredado": ["El canal y su audiencia pasaron a una figura elegida para continuar su línea.", "La voz pública quedó bajo una sucesión personal que heredó archivo, audiencia y conflictos."],
  },
  careers: {
    presidency: [
      "Llegó a la presidencia y acumuló {years} {yearNoun} en cargos públicos; su mayor cargo fue {highestRole}.",
      "Palacio fue el punto más alto de una carrera con {years} {yearNoun} de servicio público y {highestRole} como mayor cargo.",
      "La trayectoria alcanzó la presidencia después de varios saltos de poder y sumó {years} {yearNoun} en cargos públicos.",
      "La trayectoria alcanzó la presidencia y tuvo en {highestRole} su mayor responsabilidad pública.",
    ],
    national: [
      "Su carrera llegó al poder nacional, tuvo como mayor cargo {highestRole} y acumuló {years} {yearNoun} en funciones públicas.",
      "El mayor cargo de {name} fue {highestRole}, desde donde dejó decisiones nacionales durante {years} {yearNoun} de servicio.",
      "La política nacional fue su escenario principal: llegó hasta {highestRole} y sumó {years} {yearNoun} en cargos.",
      "La carrera llegó al poder nacional y tuvo como mayor responsabilidad {highestRole}.",
    ],
    territorial: [
      "El territorio siguió siendo el centro de su poder. Su mayor cargo fue {highestRole} y acumuló {years} {yearNoun} de gestión pública.",
      "Su carrera creció desde gobiernos y organizaciones locales. El cargo más alto fue {highestRole}.",
      "La base regional sostuvo una trayectoria cuyo mayor cargo fue {highestRole}, con {years} {yearNoun} en funciones públicas.",
    ],
    service: [
      "Su mayor cargo fue {highestRole}, pero la continuidad marcó más sus {years} {yearNoun} de servicio público que una sola elección.",
      "La carrera se construyó paso a paso durante {years} {yearNoun} en cargos y tuvo como punto más alto {highestRole}.",
      "{name} no dependió de un único salto: acumuló {years} {yearNoun} de trabajo público y llegó hasta {highestRole}.",
    ],
    outsider: [
      "Su mayor posición fue {highestRole}, aunque influyó más desde su red y sus decisiones que desde una larga permanencia en el Estado.",
      "La trayectoria no se definió por muchos años en cargos y tuvo como punto más alto {highestRole}.",
      "{name} avanzó por fuera de la ruta tradicional hasta {highestRole}, con una influencia más importante que la antigüedad.",
    ],
  },
  elections: {
    repeatWinner: [
      "Ganó {wins} elecciones presidenciales y perdió {losses}; volver a ganar cambió la escala de su legado.",
      "Disputó {runs} campañas presidenciales y consiguió {wins} victorias, dejando una marca propia para su proyecto.",
      "La presidencia no fue un accidente: obtuvo {wins} victorias en {runs} {attemptNoun}.",
    ],
    winner: [
      "Disputó {runs} elecciones presidenciales, ganó una y perdió {losses}; la victoria llevó toda su historia hasta Palacio.",
      "Una de sus {runs} campañas presidenciales terminó en victoria y las otras dejaron {losses} {lossNoun}.",
      "Llegó a Palacio una vez después de {runs} {attemptNoun}, una victoria que quedó como el centro de su carrera electoral.",
    ],
    persistent: [
      "Postuló {runs} veces a la presidencia y perdió {losses}; la insistencia mantuvo vivo su movimiento, pero nunca abrió Palacio.",
      "Las urnas le negaron la presidencia en {losses} ocasiones, pero volvió a competir hasta completar {runs} campañas.",
      "Su identidad electoral nació de volver a intentarlo: {runs} postulaciones y ninguna victoria presidencial.",
    ],
    defeated: [
      "Intentó llegar a la presidencia {runs} {runNoun} y no ganó, pero la derrota no cerró de inmediato su carrera.",
      "Registró {losses} {lossNoun} y construyó el resto de su poder fuera de Palacio.",
      "La campaña presidencial terminó sin victoria y dejó el legado en otros cargos, alianzas y conflictos.",
    ],
  },
  records: {
    prison: [
      "El cierre llegó bajo custodia. La situación judicial terminó dominando la lectura de los cargos y las victorias anteriores.",
      "La prisión se convirtió en el último escenario de la carrera y en el centro de su legado.",
      "Los últimos años transcurrieron bajo una condena o medida de prisión. La defensa y la red exterior definieron lo que todavía podía hacer.",
    ],
    exile: [
      "La trayectoria cerró fuera del país. El retorno siguió condicionado por un riesgo judicial de {legalRisk}/100.",
      "El exilio se convirtió en el último escenario político. La ruta legal de regreso nunca quedó completamente resuelta.",
      "{name} terminó haciendo política a distancia. Su situación judicial mantuvo el regreso bajo condición.",
    ],
    severeLegal: [
      "El expediente quedó pesado y el riesgo judicial cerró en {legalRisk}/100.",
      "La justicia acompañó el tramo final. La defensa terminó trabajando con un riesgo de {legalRisk}/100.",
      "Las acusaciones compitieron con los logros y dejaron un riesgo judicial de {legalRisk}/100.",
    ],
    scandalHeavy: [
      "El balance incluye {scandals} escándalos. Ningún resumen de la carrera puede omitirlos.",
      "Los escándalos fueron una parte central del legado: quedaron {scandals} en el archivo final.",
      "La reputación terminó discutiéndose junto con {scandals} escándalos acumulados durante la carrera.",
    ],
    opaqueMoney: [
      "El dinero clandestino siguió la carrera hasta el final. Cerró con {dirtyMoney} de fondos sucios y un riesgo judicial de {legalRisk}/100.",
      "La influencia también se sostuvo con fondos opacos: {dirtyMoney} quedaron registrados como dinero sucio.",
      "El patrimonio político no fue transparente. Los fondos sucios alcanzaron {dirtyMoney} al cierre.",
    ],
    cleanRecord: [
      "Cerró sin escándalos registrados, con {cleanMoney} declarados y un riesgo judicial de {legalRisk}/100.",
      "El expediente final quedó corto: ninguna denuncia convertida en escándalo y bajo riesgo judicial.",
      "Después de toda la carrera, la principal defensa de {name} fue un archivo sin escándalos y con cuentas mayormente limpias.",
    ],
    mixed: [
      "El archivo terminó con {scandals} escándalo{scandalPlural}, {investigations} {investigationNoun} y riesgo judicial de {legalRisk}/100.",
      "La carrera dejó logros y preguntas abiertas: {scandals} escándalo{scandalPlural} y {investigations} {investigationNoun} quedaron en el archivo.",
      "El archivo judicial no quedó vacío, aunque varios episodios ya terminaron. El riesgo cerró en {legalRisk}/100.",
    ],
    resolvedLegal: [
      "La carrera sí enfrentó un expediente, pero llegó al cierre sin una acusación abierta y con riesgo judicial de {legalRisk}/100.",
      "Un proceso formal marcó la trayectoria y terminó antes del retiro; el riesgo judicial cerró en {legalRisk}/100.",
      "La justicia abrió un caso importante durante la carrera, aunque su situación ya estaba definida al llegar al cierre.",
    ],
    legalCase: [
      "La carrera quedó marcada por un expediente judicial concreto y cerró con riesgo de {legalRisk}/100.",
      "La justicia ocupó una parte importante de la trayectoria, incluso cuando el riesgo final bajó a {legalRisk}/100.",
      "El archivo conserva un proceso central que condicionó decisiones, aliados y posibilidades electorales.",
    ],
    legalOnly: [
      "No acumuló escándalos ni investigaciones formales, aunque el riesgo judicial terminó en {legalRisk}/100.",
      "El archivo no registra grandes casos, pero varias decisiones dejaron un riesgo judicial de {legalRisk}/100.",
      "No hubo un expediente dominante. Aun así, el cierre dejó un riesgo judicial de {legalRisk}/100.",
    ],
  },
  bases: {
    regional: [
      "Su respaldo más fuerte quedó en las regiones y cerró en {baseValue}/100.",
      "La red territorial fue su último soporte claro: {baseValue}/100 de respaldo regional.",
      "Incluso al final, las regiones siguieron siendo su principal fuente de fuerza política.",
    ],
    international: [
      "Su activo más sólido fue la reputación internacional, que terminó en {baseValue}/100.",
      "Fuera del país conservó más reconocimiento que dentro de varias instituciones nacionales.",
      "La red internacional sobrevivió a la coyuntura local y cerró como su respaldo principal.",
    ],
    media: [
      "La notoriedad mediática fue su principal fuente de poder al cierre: {baseValue}/100.",
      "La audiencia y los titulares siguieron sosteniendo su influencia hasta el final.",
      "Su red más resistente no estuvo en un partido, sino en la atención pública.",
    ],
    party: [
      "La organización partidaria terminó como su estructura más fuerte, con {baseValue}/100 de cohesión.",
      "El partido sobrevivió a campañas y rupturas; fue la principal reserva de poder al cierre.",
      "Su mayor respaldo final fue una maquinaria política que todavía podía actuar sin su presencia diaria.",
    ],
    business: [
      "El respaldo empresarial fue su red más firme y cerró en {baseValue}/100.",
      "Los vínculos económicos siguieron siendo la principal base de su influencia.",
      "Al final, su capacidad de movilizar capital pesó más que cualquier estructura territorial.",
    ],
    union: [
      "El respaldo sindical terminó como su apoyo organizado más fuerte: {baseValue}/100.",
      "Las organizaciones laborales conservaron la relación política más sólida de su carrera.",
      "Su base social sobrevivió en sindicatos capaces de mantener la movilización.",
    ],
    popular: [
      "La aceptación popular fue su principal capital y cerró en {baseValue}/100.",
      "Su respaldo más claro quedó en la gente, por encima de partidos y grupos de poder.",
      "Terminó con una aprobación capaz de sostener su nombre aun fuera de un cargo.",
    ],
    institutional: [
      "La credibilidad fue su activo final más fuerte y cerró en {baseValue}/100.",
      "Su mejor respaldo no fue una maquinaria, sino la confianza acumulada en su palabra.",
      "Al cierre, la reputación institucional resistió mejor que sus alianzas políticas.",
    ],
    fragile: [
      "Ninguna base de apoyo terminó por encima de 60/100. El retiro llegó con una red debilitada.",
      "El poder se dispersó antes del final: no quedó una organización claramente dominante.",
      "La trayectoria cerró sin una base capaz de sostener por sí sola el siguiente ciclo.",
    ],
  },
  relations: {
    family: [
      "La vida familiar pagó parte del costo político y terminó con {familyStress}/100 de tensión.",
      "El poder también dejó una deuda privada: el estrés familiar cerró en {familyStress}/100.",
      "La última red debilitada fue la familiar, presionada por años de campañas y expedientes.",
    ],
  },
  cases: [
    "El expediente especial más decisivo fue {caseTitle}: terminó como «{caseResolution}».",
    "Entre las historias que marcaron la carrera, {caseTitle} cerró con el balance «{caseResolution}».",
    "La trayectoria también quedó marcada por {caseTitle}, cuyo cierre fue «{caseResolution}».",
    "El archivo conserva un caso central: {caseTitle}, resuelto como «{caseResolution}».",
  ],
  pendingCases: [
    "El expediente especial más importante fue {caseTitle}, que quedó pendiente al terminar la carrera.",
    "{caseTitle} seguía abierto al cierre, bajo el estado «{caseResolution}».",
    "La trayectoria terminó sin resolver {caseTitle}; su último estado fue «{caseResolution}».",
    "El archivo conserva una historia inconclusa: {caseTitle} quedó pendiente al cierre.",
  ],
};

export const CASE_METRIC_BRIEFS = {
  trial: {
    evidence: {
      positive: ["La fiscalía pierde fuerza con la prueba disponible.", "La carga fiscal se debilita y abre espacio para la defensa."],
      danger: ["La carga fiscal ya domina el expediente.", "La evidencia acumulada deja a la defensa contra las cuerdas."],
    },
    defense: {
      positive: ["La defensa llega mejor preparada a la siguiente etapa.", "El equipo legal recupera margen para discutir la acusación."],
      danger: ["La defensa pierde margen frente a la acusación.", "El equipo legal llega debilitado a la siguiente audiencia."],
    },
    court: {
      positive: ["La posición ante el juez mejora de forma visible.", "El tribunal recibe mejor los argumentos de la defensa."],
      danger: ["La posición ante el juez se deteriora.", "El tribunal endurece su lectura del expediente."],
    },
    media: {
      positive: ["La presión mediática baja y el proceso recupera espacio técnico.", "El caso pierde intensidad en los titulares."],
      danger: ["La presión mediática convierte cada audiencia en una crisis.", "Los titulares aumentan el costo público de la defensa."],
    },
  },
  campaign: {
    intention: {
      positive: ["La intención de voto coloca la candidatura en zona competitiva.", "Las encuestas ya muestran una opción con posibilidades reales."],
      danger: ["La intención de voto deja la candidatura lejos de la pelea.", "Las encuestas no convierten la notoriedad en votos."],
    },
    organization: {
      positive: ["La organización ya puede defender votos en gran parte del país.", "La campaña cuenta con una red capaz de llegar al día electoral."],
      danger: ["La campaña sigue sin estructura suficiente fuera de sus bastiones.", "Faltan personeros y equipos para sostener la candidatura."],
    },
    resources: {
      positive: ["La caja permite sostener publicidad, viajes y equipos.", "Los recursos cubren el tramo decisivo de la campaña."],
      danger: ["La caja obliga a recortar viajes y publicidad.", "La campaña entra al siguiente tramo con recursos insuficientes."],
    },
    rejection: {
      positive: ["El rechazo baja y permite buscar votantes fuera de la base.", "La candidatura reduce su principal techo electoral."],
      danger: ["El rechazo se convierte en el principal límite de la candidatura.", "La campaña moviliza seguidores, pero también une a sus rivales."],
    },
  },
  vacancy: {
    survival: {
      positive: ["El bloque oficialista conserva votos suficientes para resistir.", "El conteo parlamentario todavía favorece la continuidad."],
      danger: ["El conteo se acerca al número necesario para la destitución.", "El Gobierno ya no tiene asegurados los votos para sobrevivir."],
    },
    cabinet: {
      positive: ["El gabinete mantiene una línea común frente al Congreso.", "Los ministros cierran filas y reducen las señales de fuga."],
      danger: ["Las renuncias y filtraciones debilitan al gabinete.", "El gabinete deja de actuar como un bloque confiable."],
    },
    institutions: {
      positive: ["Las instituciones sostienen una salida dentro de las reglas.", "El respaldo institucional reduce el margen para una ruptura."],
      danger: ["El respaldo institucional se debilita en un momento crítico.", "La crisis empieza a superar la capacidad de las instituciones."],
    },
    street: {
      positive: ["La calle todavía ofrece respaldo al mandato.", "El apoyo ciudadano eleva el costo de una destitución."],
      danger: ["La calle deja de funcionar como defensa del Gobierno.", "El rechazo ciudadano facilita el avance de la vacancia."],
    },
  },
  disaster: {
    severity: {
      positive: ["El daño deja de crecer y permite concentrarse en la recuperación.", "Las zonas críticas empiezan a salir de la emergencia inmediata."],
      danger: ["El daño sigue creciendo en las zonas más expuestas.", "La emergencia todavía supera la capacidad local de respuesta."],
    },
    response: {
      positive: ["La coordinación pública logra sostener la respuesta.", "Las autoridades convierten recursos en atención efectiva."],
      danger: ["La respuesta llega tarde y sin coordinación suficiente.", "Las instituciones no alcanzan a cubrir las zonas afectadas."],
    },
    supplies: {
      positive: ["El abastecimiento cubre las necesidades más urgentes.", "La ayuda empieza a llegar de forma regular a las zonas aisladas."],
      danger: ["Faltan alimentos, agua y equipos en varios puntos críticos.", "La ayuda no alcanza para sostener a las comunidades aisladas."],
    },
    trust: {
      positive: ["La población confía en la información y en la ayuda recibida.", "La respuesta recupera credibilidad entre las familias afectadas."],
      danger: ["La desconfianza complica la entrega de ayuda y la reconstrucción.", "Las denuncias reducen la confianza en la respuesta oficial."],
    },
  },
  prison: {
    appeal: {
      positive: ["La apelación conserva una ruta real de salida.", "La defensa todavía puede cambiar la situación de custodia."],
      danger: ["La vía de apelación se estrecha con cada resolución.", "La defensa pierde opciones para revertir la custodia."],
    },
    outside: {
      positive: ["La organización exterior sigue activa y cumple instrucciones.", "La red política fuera del penal conserva capacidad de acción."],
      danger: ["La red exterior se dispersa y deja de responder.", "Los aliados fuera del penal empiezan a buscar otro liderazgo."],
    },
    inside: {
      positive: ["Dentro del penal conserva una red capaz de proteger su espacio.", "La influencia interna reduce su aislamiento."],
      danger: ["La vida interna se vuelve más aislada y difícil de controlar.", "Pierde influencia dentro del penal y aumenta su vulnerabilidad."],
    },
    family: {
      positive: ["La familia conserva una relación estable pese a la custodia.", "Las visitas y acuerdos reducen el costo familiar de la prisión."],
      danger: ["La prisión rompe vínculos familiares importantes.", "La tensión familiar se convierte en otra condena diaria."],
    },
  },
  exile: {
    legalPath: {
      positive: ["La vía legal de retorno sigue abierta.", "Los abogados consiguen condiciones más claras para volver."],
      danger: ["La ruta legal de regreso queda casi cerrada.", "Las órdenes pendientes bloquean cualquier retorno seguro."],
    },
    international: {
      positive: ["El respaldo internacional protege su posición fuera del país.", "Gobiernos y organizaciones extranjeras siguen escuchando su caso."],
      danger: ["El respaldo internacional pierde fuerza.", "Sus aliados externos dejan de comprometerse con el caso."],
    },
    remote: {
      positive: ["La organización local todavía responde a la dirección remota.", "La influencia a distancia mantiene vivo el movimiento."],
      danger: ["La distancia debilita el control sobre el movimiento.", "Los operadores locales empiezan a tomar decisiones sin consultarlo."],
    },
    resources: {
      positive: ["Los recursos permiten sostener abogados, viajes y organización.", "La caja cubre la permanencia fuera del país y la defensa."],
      danger: ["Los recursos ya no alcanzan para sostener defensa y actividad política.", "El costo del exilio obliga a reducir abogados y operaciones."],
    },
  },
};

export const CASE_NEWS_BANKS = {
  openings: {
    trial: [
      { headline: "Fiscalía convierte las sospechas en un expediente", text: "La investigación entra a una etapa formal y obliga a ordenar defensa, documentos y testigos." },
      { headline: "El caso principal pasa a manos de fiscales y jueces", text: "Las decisiones anteriores ya tienen una ruta judicial que puede crecer o cerrarse con pruebas." },
      { headline: "Una investigación abre el frente judicial", text: "El expediente empieza a medir evidencia, defensa, posición ante el juez y presión pública." },
    ],
    campaignFirst: [
      { headline: "La primera candidatura presidencial entra en campaña", text: "La organización debe convertir notoriedad, recursos y respaldo en votos nacionales." },
      { headline: "Empieza la carrera para llegar a Palacio", text: "Es la primera campaña presidencial y todavía debe construir estructura fuera de su base conocida." },
      { headline: "La candidatura sale a buscar su primer mapa nacional", text: "Encuestas, organización, caja y rechazo decidirán si supera la primera vuelta." },
    ],
    campaignRepeat: [
      { headline: "Una nueva candidatura vuelve a disputar Palacio", text: "La campaña empieza con experiencia acumulada, pero también con derrotas y promesas que los rivales recordarán." },
      { headline: "La carrera presidencial abre otro intento", text: "La organización conserva aprendizajes del ciclo anterior y debe demostrar que esta campaña será distinta." },
      { headline: "El movimiento vuelve a inscribir una candidatura nacional", text: "La nueva campaña hereda una base conocida, un nivel de rechazo y cuentas pendientes." },
    ],
    campaignReturn: [
      { headline: "El expresidente vuelve a buscar Palacio", text: "La campaña enfrenta su propio legado, la relación con el sucesor y el recuerdo del gobierno anterior." },
      { headline: "Una campaña de retorno divide a antiguos aliados", text: "El regreso presidencial moviliza la vieja base y obliga a defender el balance del mandato." },
      { headline: "El regreso electoral convierte el legado en campaña", text: "Cada logro y cada expediente del gobierno anterior vuelve a entrar en discusión." },
    ],
    prison: [
      { headline: "La política continúa bajo custodia", text: "La defensa, la red exterior, la vida interna y los vínculos familiares empiezan a definir el siguiente tramo." },
      { headline: "El ingreso al penal abre otra etapa de poder", text: "La carrera ya no depende de un cargo, sino de la apelación y de las redes que sigan activas." },
      { headline: "La custodia cambia las reglas de la trayectoria", text: "Abogados, aliados y familia deben decidir cuánto pueden sostener desde fuera." },
    ],
    exile: [
      { headline: "La carrera política se traslada fuera del país", text: "La ruta legal de retorno, el respaldo internacional y la influencia a distancia pasan al centro de la historia." },
      { headline: "El exilio abre una política sin presencia física", text: "Abogados y operadores deben sostener el caso mientras la distancia debilita el control local." },
      { headline: "La salida del país no cierra el movimiento", text: "El regreso dependerá de la justicia, los aliados externos y los recursos disponibles." },
    ],
  },
  trialCrossCase: {
    positive: [
      { headline: "La estrategia fuera del juzgado mejora la defensa", text: "La decisión «{option}» reduce la presión sobre el caso principal." },
      { headline: "El expediente gana una ruta favorable", text: "La medida «{option}» fortalece la posición legal para la siguiente etapa." },
      { headline: "La defensa aprovecha un cambio externo", text: "La última decisión mejora el margen frente a la acusación." },
      { headline: "Un movimiento externo abre espacio para la defensa", text: "La decisión «{option}» corrige una debilidad que la fiscalía pensaba aprovechar." },
      { headline: "La última medida ordena la estrategia legal", text: "La defensa incorpora «{option}» y llega mejor preparada a la siguiente diligencia." },
      { headline: "El caso recibe una señal favorable", text: "La decisión «{option}» mejora la posición frente al juez sin cerrar todavía el proceso." },
      { headline: "La defensa recupera terreno en el expediente", text: "El efecto de «{option}» reduce uno de los riesgos acumulados del caso." },
      { headline: "Una decisión fuera del penal ayuda en tribunales", text: "La medida «{option}» fortalece la ruta legal y obliga a revisar la estrategia fiscal." },
    ],
    danger: [
      { headline: "Una decisión externa complica el caso principal", text: "La medida «{option}» aumenta el costo legal o la presión sobre la defensa." },
      { headline: "El expediente incorpora un nuevo riesgo", text: "La estrategia elegida fuera del juzgado debilita la posición frente a la acusación." },
      { headline: "La fiscalía gana margen con la última decisión", text: "La medida «{option}» deja más presión sobre el proceso principal." },
      { headline: "La última jugada abre otro frente judicial", text: "La decisión «{option}» entrega a la fiscalía un argumento para endurecer el caso." },
      { headline: "La defensa paga el costo de una decisión externa", text: "El efecto de «{option}» debilita la posición legal antes de la siguiente audiencia." },
      { headline: "Un nuevo antecedente favorece a la acusación", text: "La medida «{option}» aumenta la presión y obliga a rehacer parte de la defensa." },
      { headline: "La estrategia política agrava el expediente", text: "La decisión «{option}» eleva el riesgo judicial en un momento delicado." },
      { headline: "El caso se endurece por la última medida", text: "La fiscalía incorpora el efecto de «{option}» y gana terreno frente a la defensa." },
    ],
    neutral: [
      { headline: "La estrategia externa llega al expediente", text: "La decisión «{option}» cambia el contexto del proceso sin definir todavía una ventaja." },
      { headline: "El caso principal incorpora un nuevo antecedente", text: "La última medida entra al expediente y será discutida en la siguiente etapa." },
      { headline: "La defensa revisa el efecto de la última decisión", text: "La medida «{option}» obliga a ajustar la estrategia, pero aún no inclina el proceso." },
      { headline: "El juzgado recibe información sobre la nueva medida", text: "El efecto de «{option}» queda registrado y será evaluado en la próxima diligencia." },
      { headline: "La decisión política entra en la discusión legal", text: "La defensa y la fiscalía interpretan de forma distinta la medida «{option}»." },
      { headline: "El expediente suma un dato todavía abierto", text: "La medida «{option}» cambia el contexto sin mejorar ni empeorar claramente el caso." },
      { headline: "La siguiente audiencia incluirá la última decisión", text: "El efecto de «{option}» pasa a formar parte de la discusión judicial." },
      { headline: "El caso se ajusta a un nuevo escenario", text: "La decisión «{option}» obliga a revisar argumentos, aunque el equilibrio legal se mantiene." },
    ],
  },
  disasterFollowup: {
    positive: [
      { headline: "La ayuda empieza a cerrar las brechas", text: "{actor} recuperan servicios después de «{decision}». Todavía quedan zonas pendientes." },
      { headline: "Vuelven los servicios en las zonas golpeadas", text: "La respuesta iniciada con «{decision}» mejora el abastecimiento y reduce el daño acumulado." },
      { headline: "La recuperación gana terreno", text: "{actor} sostienen la atención y convierten «{decision}» en resultados visibles." },
      { headline: "La emergencia entra en una etapa de recuperación", text: "La medida «{decision}» permite pasar del rescate a la reparación de servicios y viviendas." },
      { headline: "Las zonas aisladas vuelven a recibir ayuda", text: "El seguimiento de «{decision}» mejora rutas, entregas y coordinación local." },
    ],
    danger: [
      { headline: "La ayuda no llega al ritmo del daño", text: "{actor} no logran cerrar las brechas dejadas después de «{decision}»." },
      { headline: "Las secuelas superan a la reconstrucción", text: "Los recursos movilizados con «{decision}» siguen por debajo de las necesidades." },
      { headline: "La emergencia abre una segunda crisis", text: "La respuesta posterior a «{decision}» deja zonas sin servicios y familias sin apoyo estable." },
      { headline: "Crece el malestar en las zonas afectadas", text: "Las demoras posteriores a «{decision}» aumentan las pérdidas y la desconfianza." },
      { headline: "La reconstrucción se queda atrás", text: "El seguimiento de «{decision}» no alcanza para reparar servicios, caminos y viviendas." },
    ],
  },
  disasterResolution: {
    favorable: [
      { headline: "{title}: la respuesta controla la emergencia", text: "La coordinación, el abastecimiento y la confianza reducen las secuelas sociales y económicas." },
      { headline: "{title}: la recuperación deja resultados", text: "La atención sostenida restablece servicios y evita que el daño se convierta en una crisis mayor." },
      { headline: "{title}: el balance favorece a la respuesta", text: "Las decisiones tomadas logran contener el daño y sostener la reconstrucción." },
      { headline: "{title}: las zonas críticas salen de la emergencia", text: "La ayuda llega a tiempo y deja una ruta clara para completar la recuperación." },
    ],
    warning: [
      { headline: "{title}: el daño queda contenido a medias", text: "La respuesta evita el peor escenario, pero deja obras, familias y cuentas pendientes." },
      { headline: "{title}: la recuperación avanza con deudas", text: "Vuelven varios servicios, aunque las zonas más vulnerables todavía esperan soluciones." },
      { headline: "{title}: un balance sin victoria completa", text: "Las medidas reducen parte del daño, pero no corrigen todas las brechas expuestas por la emergencia." },
      { headline: "{title}: termina la urgencia, siguen las secuelas", text: "La etapa crítica baja de intensidad mientras continúan pérdidas y reclamos." },
    ],
    danger: [
      { headline: "{title}: las secuelas se vuelven nacionales", text: "La respuesta insuficiente deja más pobreza, conflicto y pérdida de inversión." },
      { headline: "{title}: la reconstrucción fracasa en zonas clave", text: "La demora agrava las pérdidas y convierte la emergencia en una crisis prolongada." },
      { headline: "{title}: el país paga una respuesta tardía", text: "Servicios sin reparar y ayuda incompleta elevan el costo social y económico." },
      { headline: "{title}: el daño supera la capacidad de respuesta", text: "Las zonas afectadas quedan con brechas mayores y una confianza pública debilitada." },
    ],
  },
  vacancyShift: {
    positive: [
      { headline: "La oposición pierde votos para la vacancia", text: "El nuevo conteo reduce el margen de la moción y deja el riesgo en {risk}/100." },
      { headline: "Varias bancadas se alejan de la destitución", text: "La última decisión enfría el Pleno y baja el riesgo de vacancia a {risk}/100." },
      { headline: "El Gobierno recupera margen en el Congreso", text: "El conteo vuelve a favorecer la continuidad, con un riesgo de {risk}/100." },
      { headline: "La moción deja de tener los votos asegurados", text: "Los cambios posteriores a «{option}» reducen la presión parlamentaria." },
      { headline: "El bloque de vacancia pierde una bancada", text: "El efecto de «{option}» reduce el conteo opositor y deja el riesgo en {risk}/100." },
      { headline: "El Pleno se aleja del umbral de destitución", text: "La negociación posterior a «{option}» mejora la supervivencia del Gobierno." },
    ],
    danger: [
      { headline: "Nuevas bancadas se acercan a la vacancia", text: "El conteo se endurece y el riesgo parlamentario sube a {risk}/100." },
      { headline: "La oposición suma votos para la destitución", text: "La última decisión acerca la moción al número necesario." },
      { headline: "El Gobierno pierde margen en el Pleno", text: "La crisis posterior a «{option}» eleva el riesgo de vacancia a {risk}/100." },
      { headline: "El conteo parlamentario entra en zona crítica", text: "Más congresistas dejan de garantizar la continuidad del mandato." },
      { headline: "Una bancada bisagra se acerca a la moción", text: "El efecto de «{option}» eleva el riesgo de vacancia a {risk}/100." },
      { headline: "La continuidad del Gobierno pierde otro voto clave", text: "La decisión «{option}» debilita el acuerdo que sostenía al gabinete." },
    ],
  },
  finalCases: {
    trial: {
      positive: [
        { headline: "El proceso queda abierto con una defensa fortalecida", text: "No hay sentencia final, pero la carga fiscal termina más débil que al inicio." },
        { headline: "El expediente llega al cierre con margen para la defensa", text: "La trayectoria termina antes del fallo y deja una posición judicial favorable, no una absolución." },
      ],
      warning: [
        { headline: "El caso principal queda pendiente", text: "La trayectoria termina antes de una resolución definitiva y el expediente conserva fuerzas parejas." },
        { headline: "La justicia todavía no cierra el expediente", text: "El proceso queda abierto, sin una ventaja clara para la fiscalía o la defensa." },
      ],
      danger: [
        { headline: "La trayectoria cierra con un expediente muy desfavorable", text: "No existe sentencia final y el balance general deja muy poco margen para corregir la estrategia legal." },
        { headline: "El expediente termina pesando sobre el legado", text: "La justicia no dicta el último fallo antes del cierre y varias piezas del caso quedan en situación crítica." },
      ],
    },
    campaign: {
      positive: [
        { headline: "La campaña se detiene cuando todavía era competitiva", text: "La trayectoria concluye antes de una nueva votación, con organización y respaldo todavía activos." },
        { headline: "El cierre deja una candidatura con fuerza", text: "No hay nuevo resultado electoral, pero la campaña termina con una base capaz de competir." },
      ],
      warning: [
        { headline: "La última campaña queda sin resultado", text: "La trayectoria termina antes de la votación y deja una candidatura con fortalezas y límites visibles." },
        { headline: "Las urnas no llegan antes del cierre", text: "La campaña queda registrada sin una nueva victoria o derrota." },
      ],
      danger: [
        { headline: "La campaña termina lejos de una remontada", text: "El cierre llega con poco respaldo, recursos limitados o un rechazo difícil de revertir." },
        { headline: "La candidatura se apaga antes de la elección", text: "La trayectoria concluye con una campaña que ya no encontraba una ruta clara para competir." },
      ],
    },
    vacancy: {
      positive: [
        { headline: "El mandato cierra con votos para resistir", text: "El conteo queda abierto, pero la continuidad conserva una ventaja al terminar la trayectoria." },
        { headline: "La vacancia pierde fuerza antes del cierre", text: "No hay una nueva votación y el Gobierno termina con mejores condiciones para sobrevivir." },
      ],
      warning: [
        { headline: "El conteo de vacancia queda pendiente", text: "La trayectoria concluye sin una nueva decisión del Pleno y con el resultado todavía abierto." },
        { headline: "La crisis parlamentaria llega sin desenlace final", text: "Gobierno y oposición terminan cerca de un nuevo conteo, pero no hay votación adicional." },
      ],
      danger: [
        { headline: "El cierre encuentra al mandato contra las cuerdas", text: "La trayectoria termina antes de otra votación y con varios soportes del Gobierno en situación crítica." },
        { headline: "La amenaza de vacancia domina el último tramo", text: "El conteo no llega a resolverse, pero el balance general deja al mandato muy debilitado." },
      ],
    },
    prison: {
      positive: [
        { headline: "La custodia termina con una apelación todavía posible", text: "La trayectoria cierra bajo prisión, pero la defensa conserva una ruta legal concreta." },
        { headline: "La red exterior mantiene abierta una salida", text: "El encierro sigue, aunque abogados y aliados conservan capacidad para actuar." },
      ],
      warning: [
        { headline: "La situación penitenciaria sigue definiendo el legado", text: "La trayectoria concluye bajo custodia y sin un cambio definitivo en la situación legal." },
        { headline: "La prisión queda como el último escenario político", text: "El cierre llega con apelaciones, vínculos y costos familiares todavía en curso." },
      ],
      danger: [
        { headline: "La prisión cierra casi todas las rutas de regreso", text: "La trayectoria termina con un balance penitenciario muy adverso y al menos una salida decisiva bloqueada." },
        { headline: "El expediente deja la carrera detrás de los muros", text: "El cierre llega con varias condiciones críticas dentro o fuera del penal." },
      ],
    },
    exile: {
      positive: [
        { headline: "El exilio termina con una ruta de retorno", text: "La trayectoria cierra fuera del país, pero conserva respaldo y condiciones legales para volver." },
        { headline: "La política a distancia mantiene abierto el regreso", text: "El cierre llega con aliados externos y una vía legal todavía útil." },
      ],
      warning: [
        { headline: "El exilio sigue abierto al final de la trayectoria", text: "No hay retorno definitivo y la influencia a distancia conserva fortalezas y límites." },
        { headline: "La carrera concluye fuera del país", text: "La ruta de regreso queda sin resolver y la organización local sigue tomando decisiones." },
      ],
      danger: [
        { headline: "El cierre deja al exilio sin una salida completa", text: "La trayectoria termina fuera del país y con varias condiciones de retorno en situación crítica." },
        { headline: "La distancia se convierte en un retiro forzado", text: "El balance general del exilio queda muy debilitado, aunque alguna red todavía pueda resistir." },
      ],
    },
  },
};

export const DISASTER_VARIANT_COPY = {
  "nino-costero-nacional": {
    followupHeadlines: {
      positive: ["Reabren rutas hacia las zonas aisladas", "Los albergues reciben ayuda con mayor regularidad", "La respuesta empieza a contener los huaicos"],
      danger: ["Nuevos huaicos vuelven a cortar las rutas", "Los albergues reportan faltantes y demoras", "Las lluvias agravan el aislamiento del norte"],
    },
    followup: {
      positive: [
        "La limpieza de vías y quebradas permite que agua, alimentos y maquinaria vuelvan a varios distritos.",
        "Los albergues reciben suministros con mayor regularidad y las rutas bloqueadas empiezan a reabrirse.",
        "Municipios y brigadas reducen el aislamiento de las familias afectadas por lluvias y huaicos.",
      ],
      danger: [
        "Nuevos huaicos vuelven a cortar rutas mientras varios albergues reportan falta de agua y alimentos.",
        "La ayuda se concentra en las ciudades y deja caseríos aislados durante más tiempo.",
        "Las lluvias prolongan el cierre de caminos y elevan las pérdidas de viviendas y cultivos.",
      ],
    },
    resolution: {
      favorable: ["Las rutas principales reabren y la reconstrucción empieza con padrones y obras verificables.", "La respuesta reduce el aislamiento y evita una segunda ola de pérdidas."],
      warning: ["Baja la emergencia, pero siguen pendientes viviendas, defensas ribereñas y caminos vecinales.", "La ayuda contiene el daño inmediato sin resolver todas las obras de prevención."],
      danger: ["La reconstrucción queda atrasada y las lluvias empujan a más familias hacia la pobreza.", "Caminos y viviendas siguen dañados cuando la atención nacional empieza a retirarse."],
    },
  },
  "terremoto-costa-central": {
    followupHeadlines: {
      positive: ["El rescate abre paso a la atención de damnificados", "Hospitales y refugios recuperan capacidad", "La remoción de escombros conecta barrios aislados"],
      danger: ["Las réplicas frenan el rescate", "Hospitales y refugios quedan bajo presión", "Miles de familias siguen junto a viviendas dañadas"],
    },
    followup: {
      positive: [
        "Los equipos de rescate terminan la búsqueda y la atención pasa a hospitales, refugios y evaluación de viviendas.",
        "La remoción de escombros abre rutas para ambulancias y permite instalar albergues seguros.",
        "Hospitales y brigadas recuperan capacidad mientras avanza el registro de familias damnificadas.",
      ],
      danger: [
        "Las réplicas y los edificios inestables frenan el rescate y saturan los hospitales.",
        "Faltan refugios seguros y miles de familias pasan otra noche cerca de viviendas dañadas.",
        "El desorden en la entrega de ayuda deja barrios enteros sin atención médica ni agua.",
      ],
    },
    resolution: {
      favorable: ["El rescate concluye con hospitales operativos y una reconstrucción urbana ya financiada.", "Los albergues se reducen y las familias reciben una ruta verificable para recuperar sus viviendas."],
      warning: ["Termina la búsqueda, pero la vivienda y los hospitales tardarán años en recuperarse.", "La fase crítica baja mientras miles de familias siguen en alojamientos temporales."],
      danger: ["La atención tardía eleva las pérdidas y deja barrios enteros fuera de la reconstrucción.", "Hospitales dañados y viviendas inhabitables prolongan la crisis mucho después del sismo."],
    },
  },
  "sequia-sur-andino": {
    followupHeadlines: {
      positive: ["El reparto de agua reduce la presión en el sur", "Reservorios y cisternas sostienen a las comunidades", "Los nuevos turnos de riego salvan parte de la campaña"],
      danger: ["La falta de agua enfrenta a comunidades y productores", "Los reservorios vuelven a niveles críticos", "La sequía acelera pérdidas y protestas"],
    },
    followup: {
      positive: [
        "Reservorios, cisternas y acuerdos de reparto sostienen el consumo humano y parte de la campaña agrícola.",
        "La distribución de agua llega con mayor regularidad a comunidades y pequeños productores.",
        "Los nuevos turnos de riego reducen la pérdida de cultivos y frenan el conflicto entre usuarios.",
      ],
      danger: [
        "Los reservorios siguen bajando y varias comunidades deben elegir entre consumo humano y cultivos.",
        "La entrega irregular de agua agrava las pérdidas agrícolas y aumenta las protestas.",
        "Ganaderos y agricultores abandonan parte de su producción mientras el reparto genera nuevos conflictos.",
      ],
    },
    resolution: {
      favorable: ["El reparto de agua evita el colapso agrícola y deja nuevas obras para la siguiente temporada seca.", "Comunidades y autoridades cierran acuerdos que protegen el consumo y la producción básica."],
      warning: ["El consumo queda protegido, pero la campaña agrícola termina con pérdidas importantes.", "Las medidas evitan una crisis mayor sin corregir la falta estructural de reservorios."],
      danger: ["La escasez destruye cultivos, eleva precios y deja un nuevo ciclo de conflicto por el agua.", "Miles de familias pierden producción mientras las obras prometidas siguen sin empezar."],
    },
  },
  "incendios-amazonia-nacional": {
    followupHeadlines: {
      positive: ["Brigadas contienen nuevos frentes de fuego", "El fuego retrocede alrededor de las comunidades", "La respuesta protege centros poblados y chacras"],
      danger: ["El viento abre nuevos frentes de incendio", "El humo y el fuego alcanzan más comunidades", "Las brigadas enfrentan el fuego sin equipos suficientes"],
    },
    followup: {
      positive: [
        "Brigadas y aeronaves contienen nuevos frentes mientras las comunidades protegen zonas habitadas.",
        "El fuego retrocede alrededor de los centros poblados y mejora la llegada de equipos y medicinas.",
        "La coordinación con brigadistas locales reduce focos activos y abre el registro de tierras afectadas.",
      ],
      danger: [
        "El viento abre nuevos frentes y deja a brigadistas sin equipos suficientes.",
        "El humo alcanza más comunidades mientras el fuego avanza sobre bosques y chacras.",
        "La ayuda llega tarde a zonas remotas y varias familias abandonan sus comunidades.",
      ],
    },
    resolution: {
      favorable: ["Los frentes quedan controlados y empieza una recuperación con vigilancia y apoyo a comunidades.", "La respuesta protege centros poblados y deja capacidad local para detectar nuevos incendios."],
      warning: ["El fuego baja, pero quedan bosques, cultivos y comunidades con daños difíciles de reparar.", "La emergencia termina sin resolver la ocupación de tierras ni la falta de brigadas permanentes."],
      danger: ["La pérdida de bosques y cultivos desplaza comunidades y abre nuevas disputas por la tierra.", "El control tardío deja una crisis ambiental, sanitaria y económica de largo plazo."],
    },
  },
  "epidemia-respiratoria-nacional": {
    followupHeadlines: {
      positive: ["Los hospitales recuperan camas y medicinas", "La atención temprana empieza a reducir contagios", "La red de salud contiene la presión del brote"],
      danger: ["Las emergencias vuelven a saturarse", "Faltan medicinas mientras aumentan los contagios", "El personal de salud llega al límite"],
    },
    followup: {
      positive: [
        "Hospitales y centros de salud recuperan camas mientras la información clara reduce contagios evitables.",
        "La distribución de medicinas mejora y baja la presión sobre emergencias y cuidados intensivos.",
        "Los equipos de salud llegan a más regiones y el registro público reduce rumores peligrosos.",
      ],
      danger: [
        "Las salas de emergencia vuelven a saturarse y varias regiones reportan falta de medicinas.",
        "Los rumores desplazan a la información médica y complican la atención temprana.",
        "El personal de salud trabaja sin relevo mientras aumentan las listas de espera y los contagios.",
      ],
    },
    resolution: {
      favorable: ["Los contagios bajan con hospitales abastecidos y una red de vigilancia todavía activa.", "La atención recupera capacidad y deja protocolos claros para nuevos brotes."],
      warning: ["La ola retrocede, pero quedan listas de espera, personal agotado y tratamientos pendientes.", "La emergencia sanitaria baja de intensidad sin reparar todas las brechas hospitalarias."],
      danger: ["La respuesta tardía deja más muertes evitables, hospitales agotados y desconfianza pública.", "El brote retrocede después de desbordar la atención y ampliar las brechas entre regiones."],
    },
  },
  "derrame-petroleo-amazonia": {
    followupHeadlines: {
      positive: ["La limpieza llega a nuevas quebradas", "Agua segura y monitoreo alcanzan a más comunidades", "Las barreras contienen parte del crudo"],
      danger: ["El crudo alcanza nuevas fuentes de agua", "La limpieza deja comunidades sin respuesta", "Aumentan las denuncias por agua contaminada"],
    },
    followup: {
      positive: [
        "Agua segura y equipos de limpieza llegan a comunidades mientras avanza el mapa de zonas contaminadas.",
        "Las barreras contienen parte del crudo y el monitoreo comunal mejora la entrega de agua y alimentos.",
        "La limpieza entra a quebradas afectadas y las familias reciben atención con registros públicos.",
      ],
      danger: [
        "El crudo alcanza nuevas quebradas mientras varias comunidades siguen dependiendo de agua transportada.",
        "La limpieza avanza sin control suficiente y aumentan las denuncias por alimentos y agua contaminados.",
        "Las comunidades reportan nuevos daños mientras empresa y autoridades discuten responsabilidades.",
      ],
    },
    resolution: {
      favorable: ["La contaminación queda contenida y empieza una reparación con vigilancia comunal y fondos identificados.", "El agua segura se estabiliza y la limpieza deja responsables y plazos verificables."],
      warning: ["La fuente principal queda controlada, pero la recuperación de ríos y comunidades seguirá por años.", "La atención cubre lo urgente mientras continúan reclamos por salud, pesca y reparación económica."],
      danger: ["La contaminación se prolonga y destruye fuentes de agua, pesca e ingresos comunitarios.", "La respuesta incompleta convierte el derrame en una crisis sanitaria y económica duradera."],
    },
  },
};

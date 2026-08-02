const activeLife = { missingTag: ["en-prision", "en-exilio", "arresto-domiciliario"] };
const president = { hasTag: "presidente-actual" };
const localAuthority = { careerTrack: "localGovernment" };
const nationalAuthority = { all: [{ careerTrack: "nationalInstitution" }, { missingTag: "presidente-actual" }] };
const civilian = { not: { careerTrack: "publicAuthority" } };
const civilianOrigin = (origin) => ({ all: [{ origin }, civilian] });

const contextual = (requirements, option) => ({
  ...option,
  requirements: option.requirements ? { all: [requirements, option.requirements] } : requirements,
  hideWhenUnavailable: true,
});

const registerSituation = (context, crisis, options) => options.map((option) => ({
  ...option,
  addContexts: [context, ...(option.addContexts ?? [])],
  addCrises: [crisis, ...(option.addCrises ?? [])],
}));

const nationalize = (event, {
  age,
  context,
  crisis,
  authority,
  options,
  patch = {},
}) => ({
  ...event,
  ...patch,
  requirements: { all: [{ age }, activeLife] },
  category: "national-issue",
  options: registerSituation(context, crisis, [
    ...event.options.map((option) => contextual(authority, option)),
    ...options,
  ]),
});

const globalizers = {
  "seguridad-ciudadana": (event) => nationalize(event, {
    age: { min: 34, max: 69 },
    context: "inseguridad",
    crisis: { id: "ola-extorsiones", label: "Ola nacional de extorsiones" },
    authority: { careerTrack: "publicAuthority" },
    patch: { cooldown: 7, maxOccurrences: 3, group: "coyuntura-nacional", groupCooldown: 2 },
    options: [
      contextual(civilianOrigin("podcaster"), { id: "seguridad-mapa-denuncias", label: "Verificar denuncias y mapear las redes de extorsión", hint: "Investigación útil · represalias posibles", effects: { influence: 5, cleanMoney: -5000 }, hiddenEffects: { credibility: 11, mediaNotoriety: 8 }, outcomes: [{ id: "mapa-extorsiones-publicado", weight: 100, headline: "El mapa conecta cobros, rutas y denuncias archivadas", text: "Comerciantes y fiscales encuentran patrones que antes aparecían como casos aislados.", effects: { approval: 7 }, addInvestigations: [{ id: "redes-extorsion", label: "Investigación de redes de extorsión" }] }] }),
      contextual(civilianOrigin("podcaster"), { id: "seguridad-miedo-viral", label: "Convertir cada denuncia en una alerta viral", hint: "Audiencia rápida · pánico y errores", effects: { influence: 7, cleanMoney: 9000 }, hiddenEffects: { mediaNotoriety: 13, polarization: 9, credibility: -10 }, outcomes: [{ id: "falsa-banda-viral", weight: 46, headline: "Una alerta identifica a la banda correcta", text: "La denuncia acelera una captura y dispara la audiencia del canal.", effects: { approval: 7 } }, { id: "falso-extorsionador", weight: 54, headline: "Un inocente aparece señalado como extorsionador", text: "La rectificación llega tarde y la familia presenta una denuncia.", effects: { approval: -11, legalRisk: 7 }, hiddenEffects: { credibility: -12 } }] }),
      contextual(civilianOrigin("empresario"), { id: "seguridad-red-comercios", label: "Financiar una red transparente de alerta para comercios", hint: "Costo privado · información compartida", effects: { cleanMoney: -35000, approval: 5 }, hiddenEffects: { businessSupport: 10, credibility: 7 }, outcomes: [{ id: "comercios-alerta", weight: 100, headline: "Los comercios comparten pruebas sin pagar a intermediarios", text: "La red preserva denuncias, cámaras y rutas de cobro para la investigación fiscal.", effects: { influence: 5 } }] }),
      contextual(civilianOrigin("provincia"), { id: "seguridad-rondas-prevencion", label: "Coordinar prevención comunal sin patrullas clandestinas", hint: "Presencia territorial · límites claros", effects: { approval: 5, cleanMoney: -5000 }, hiddenEffects: { regionalSupport: 12, ruralApproval: 8, credibility: 5 }, outcomes: [{ id: "rutas-seguras-comunales", weight: 100, headline: "Mercados y transportistas acuerdan rutas seguras", text: "La coordinación reduce cobros y entrega información verificable a las autoridades." }] }),
      contextual(civilian, { id: "seguridad-red-vecinal", label: "Organizar una red vecinal de denuncias verificadas", hint: "Protección comunitaria · exposición personal", effects: { approval: 4, cleanMoney: -3000 }, hiddenEffects: { personalReputation: 6, credibility: 4 }, outcomes: [{ id: "denuncias-coordinadas", weight: 100, headline: "Las denuncias dejan de llegar aisladas", text: "Vecinos y comerciantes documentan llamadas, horarios y cuentas sin iniciar una cacería pública." }] }),
      contextual(civilian, { id: "seguridad-exigir-plan", label: "Exigir metas públicas contra la extorsión", hint: "Control ciudadano · resultados lentos", effects: { influence: 3 }, hiddenEffects: { credibility: 5 }, outcomes: [{ id: "metas-seguridad-publicas", weight: 100, headline: "El Gobierno publica avances y distritos críticos", text: "La presión ciudadana no resuelve la crisis, pero vuelve más difícil esconder el fracaso operativo." }] }),
    ],
  }),

  "crisis-presidencial": (event) => nationalize(event, {
    age: { min: 30, max: 69 },
    context: "crisis-institucional",
    crisis: { id: "sucesion-presidencial", label: "Crisis de sucesión presidencial" },
    authority: president,
    patch: { cooldown: 10, maxOccurrences: 2, weight: 10, group: "crisis-politica-nacional", groupCooldown: 5 },
    options: [
      contextual(nationalAuthority, { id: "crisis-salida-constitucional", label: "Construir una salida constitucional verificable", hint: "Negociación pública · costo partidario", effects: { influence: 4 }, hiddenEffects: { congressSupport: 7, credibility: 10, polarization: -7 }, nationalEffects: { socialConflict: -5, investment: 2 }, outcomes: [{ id: "crisis-sucesion-ordenada", weight: 100, headline: "El Congreso acuerda una sucesión con calendario público", text: "La transición no elimina el rechazo, pero reduce el espacio para maniobras secretas.", effects: { approval: 6 } }] }),
      contextual(nationalAuthority, { id: "crisis-bloque-propio", label: "Usar la crisis para adelantar a tu bloque", hint: "Poder inmediato · legitimidad frágil", effects: { influence: 10 }, hiddenEffects: { congressSupport: 8, polarization: 12, credibility: -10 }, nationalEffects: { socialConflict: 6, investment: -4 }, outcomes: [{ id: "crisis-bloque-avanza", weight: 58, headline: "Tu bloque controla la transición", text: "Obtienes cargos y agenda, aunque la calle interpreta el acuerdo como reparto." }, { id: "crisis-bloque-expuesto", weight: 42, headline: "Chats exponen el reparto durante la crisis", text: "La ventaja parlamentaria se convierte en una acusación de conspiración.", effects: { approval: -13 }, hiddenEffects: { leakExposure: 12 } }] }),
      contextual(localAuthority, { id: "crisis-servicios-locales", label: "Mantener servicios y abrir espacios de diálogo", hint: "Estabilidad local · menor protagonismo", effects: { approval: 5 }, hiddenEffects: { regionalSupport: 10, credibility: 6 }, nationalEffects: { socialConflict: -3 }, outcomes: [{ id: "crisis-ciudad-funciona", weight: 100, headline: "La ciudad evita que la crisis paralice sus servicios", text: "La gestión local contiene enfrentamientos mientras Lima resuelve la sucesión." }] }),
      contextual(localAuthority, { id: "crisis-movilizacion-local", label: "Encabezar la movilización contra la sucesión", hint: "Capital político · riesgo de violencia", effects: { influence: 7 }, hiddenEffects: { regionalSupport: 7, polarization: 10 }, nationalEffects: { socialConflict: 5 }, outcomes: [{ id: "crisis-marcha-pacifica", weight: 62, headline: "La movilización regional presiona sin desbordarse", text: "La protesta obliga a incluir demandas territoriales en la transición.", effects: { approval: 6 } }, { id: "crisis-marcha-desborda", weight: 38, headline: "Enfrentamientos opacan la protesta", text: "Heridos y daños convierten tu convocatoria en una investigación.", effects: { approval: -10, legalRisk: 5 } }] }),
      contextual(civilianOrigin("podcaster"), { id: "crisis-transmision-verificada", label: "Reconstruir la sucesión con documentos y fuentes", hint: "Cobertura lenta · alta credibilidad", effects: { influence: 5, cleanMoney: -4000 }, hiddenEffects: { credibility: 13, mediaNotoriety: 9, pressSupport: 7 }, outcomes: [{ id: "crisis-linea-tiempo", weight: 100, headline: "Una línea de tiempo separa hechos de rumores", text: "La audiencia puede seguir votos, renuncias y órdenes policiales sin depender de cadenas reenviadas.", effects: { approval: 7 } }] }),
      contextual(civilianOrigin("empresario"), { id: "crisis-neutralidad-empresarial", label: "Mantener empleos y transparentar cualquier aporte", hint: "Continuidad económica · presión de aliados", effects: { cleanMoney: -12000, approval: 4 }, hiddenEffects: { businessSupport: 6, credibility: 8 }, nationalEffects: { investment: 3 }, outcomes: [{ id: "crisis-empresas-no-financian", weight: 100, headline: "El gremio descarta financiar la disputa", text: "La actividad continúa y los aportes humanitarios quedan publicados." }] }),
      contextual(civilian, { id: "crisis-observar-derechos", label: "Sumarte a una red de observación y primeros auxilios", hint: "Participación cívica · exposición en calle", effects: { cleanMoney: -3000, approval: 3 }, hiddenEffects: { personalReputation: 6, credibility: 4 }, outcomes: [{ id: "crisis-observadores", weight: 100, headline: "La red documenta abusos y ayuda a manifestantes", text: "Registros completos permiten investigar hechos sin convertir rumores en pruebas." }] }),
      contextual(civilian, { id: "crisis-marcha-pacifica-ciudadana", label: "Participar en una movilización pacífica", hint: "Presión pública · desenlace incierto", effects: { influence: 3 }, hiddenEffects: { polarization: 3 }, outcomes: [{ id: "crisis-calle-calendario", weight: 100, headline: "La presión ciudadana fuerza un calendario de transición", text: "La movilización sostiene una salida electoral sin darte control sobre sus negociaciones.", effects: { approval: 4 } }] }),
    ],
  }),

  "reforma-economica": (event) => nationalize(event, {
    age: { min: 30, max: 69 },
    context: "recesion",
    crisis: { id: "crisis-economica", label: "Recesión y aumento del costo de vida" },
    authority: president,
    patch: { cooldown: 8, maxOccurrences: 3, weight: 11, group: "coyuntura-nacional", groupCooldown: 2, description: "El crecimiento se detiene y los precios golpean a los hogares. El Gobierno discute ajuste o estímulo, mientras cada sector decide cómo atravesar la recesión." },
    options: [
      contextual(nationalAuthority, { id: "economia-alivio-focalizado", label: "Aprobar alivio temporal con metas públicas", hint: "Protege hogares · presión fiscal", effects: { approval: 5 }, hiddenEffects: { congressSupport: 5, credibility: 7 }, nationalEffects: { poverty: -3, deficit: 2, inflation: 1 }, outcomes: [{ id: "economia-alivio-llega", weight: 100, headline: "El alivio alcanza a hogares golpeados por los precios", text: "El padrón y el plazo público contienen parte del costo fiscal." }] }),
      contextual(nationalAuthority, { id: "economia-bloquear-gasto", label: "Bloquear nuevo gasto hasta estabilizar las cuentas", hint: "Disciplina fiscal · costo social", effects: { approval: -5, influence: 4 }, hiddenEffects: { businessSupport: 8, unionSupport: -9 }, nationalEffects: { deficit: -2, investment: 4, poverty: 2, socialConflict: 4 }, outcomes: [{ id: "economia-cuentas-mejoran", weight: 57, headline: "Las cuentas mejoran antes que el empleo", text: "La inversión deja de caer, pero la recuperación aún no llega a los hogares." }, { id: "economia-recesion-profundiza", weight: 43, headline: "El recorte profundiza la recesión", text: "Municipios y pequeñas empresas reducen personal.", effects: { approval: -9 }, nationalEffects: { growth: -2, unemployment: 3 } }] }),
      contextual(localAuthority, { id: "economia-compras-locales", label: "Priorizar empleo y proveedores locales", hint: "Alivio territorial · presupuesto limitado", effects: { approval: 5 }, hiddenEffects: { regionalSupport: 10, businessSupport: 4 }, nationalEffects: { unemployment: -1, deficit: 1 }, outcomes: [{ id: "economia-obras-mantenimiento", weight: 100, headline: "Pequeñas obras sostienen empleo local", text: "Mantenimiento y compras abiertas evitan cierres sin prometer una recuperación nacional." }] }),
      contextual(localAuthority, { id: "economia-recortar-servicios", label: "Recortar servicios para proteger la caja municipal", hint: "Ahorro inmediato · malestar local", effects: { approval: -9, influence: -2 }, hiddenEffects: { regionalSupport: -8 }, nationalEffects: { deficit: -1, unemployment: 1, poverty: 1 }, outcomes: [{ id: "economia-caja-municipal", weight: 100, headline: "La caja resiste y los servicios se deterioran", text: "El municipio evita deudas, pero barrios y comerciantes pagan el ajuste." }] }),
      contextual(civilianOrigin("podcaster"), { id: "economia-explicar-bolsillo", label: "Explicar los datos desde el bolsillo cotidiano", hint: "Servicio informativo · exige rigor", effects: { influence: 4 }, hiddenEffects: { credibility: 11, mediaNotoriety: 7 }, outcomes: [{ id: "economia-calculadora-publica", weight: 100, headline: "Una calculadora muestra quién paga cada propuesta", text: "La cobertura obliga a candidatos y ministros a precisar costos.", effects: { approval: 6 } }] }),
      contextual(civilianOrigin("empresario"), { id: "economia-conservar-planilla", label: "Conservar la planilla y renegociar inversiones", hint: "Costo privado · protege empleos", effects: { cleanMoney: -70000, approval: 6 }, hiddenEffects: { businessSupport: 8, personalReputation: 7 }, nationalEffects: { unemployment: -1, investment: 2 }, outcomes: [{ id: "economia-empresa-resiste", weight: 100, headline: "La empresa atraviesa la recesión sin despidos masivos", text: "Proveedores y trabajadores aceptan ajustes temporales publicados.", effects: { influence: 5 } }] }),
      contextual(civilianOrigin("provincia"), { id: "economia-cooperativa-regional", label: "Organizar compras y ventas cooperativas", hint: "Mercado regional · coordinación difícil", effects: { cleanMoney: -7000, approval: 4 }, hiddenEffects: { ruralApproval: 10, regionalSupport: 10 }, outcomes: [{ id: "economia-feria-regional", weight: 100, headline: "Productores venden sin perder todo el margen", text: "La red regional reduce intermediarios durante los meses más difíciles." }] }),
      contextual(civilian, { id: "economia-red-cuidados", label: "Organizar una red de empleo y alimentos", hint: "Ayuda concreta · alcance limitado", effects: { cleanMoney: -5000, approval: 3 }, hiddenEffects: { personalReputation: 5 }, outcomes: [{ id: "economia-red-barrial", weight: 100, headline: "La red conecta trabajos temporales y comedores", text: "No cambia la recesión, pero evita que varias familias queden aisladas." }] }),
      contextual(civilian, { id: "economia-exigir-cuentas", label: "Exigir que cada medida publique costo y beneficiarios", hint: "Fiscalización · menor protagonismo", effects: { influence: 2 }, hiddenEffects: { credibility: 5 }, outcomes: [{ id: "economia-costos-publicos", weight: 100, headline: "El paquete económico llega con costos verificables", text: "La presión reduce anuncios vacíos y deja una base para fiscalizar su ejecución." }] }),
    ],
  }),

  "crisis-fronteriza": (event) => nationalize(event, {
    age: { min: 28, max: 69 },
    context: "tension-fronteriza",
    crisis: { id: "incidente-fronterizo", label: "Incidente diplomático en la frontera" },
    authority: president,
    patch: { group: "crisis-internacional", groupCooldown: 5 },
    options: [
      contextual(nationalAuthority, { id: "frontera-respaldo-bipartidario", label: "Respaldar la mediación y fiscalizar sus límites", hint: "Unidad institucional · menor rédito propio", effects: { approval: 4 }, hiddenEffects: { congressSupport: 6, internationalReputation: 9, polarization: -5 }, outcomes: [{ id: "frontera-respaldo-publico", weight: 100, headline: "El país llega unido a la mediación", text: "La comisión publica el mandato negociador y reduce rumores sobre concesiones secretas." }] }),
      contextual(nationalAuthority, { id: "frontera-nacionalismo-congreso", label: "Exigir una respuesta militar desde el Congreso", hint: "Apoyo rápido · escalada diplomática", effects: { influence: 7 }, hiddenEffects: { armedForcesSupport: 8, polarization: 11, internationalReputation: -8 }, nationalEffects: { investment: -4, socialConflict: 3 }, outcomes: [{ id: "frontera-presion-interna", weight: 100, headline: "La presión política endurece ambas posiciones", text: "El Gobierno gana margen interno, pero la liberación del personal se retrasa." }] }),
      contextual(localAuthority, { id: "frontera-logistica-civil", label: "Preparar refugios y abastecimiento civil", hint: "Prevención local · evita protagonismo militar", effects: { approval: 5 }, hiddenEffects: { regionalSupport: 9, credibility: 6 }, outcomes: [{ id: "frontera-municipios-preparados", weight: 100, headline: "Los municipios fronterizos coordinan abastecimiento", text: "La población recibe información y rutas sin alimentar rumores de guerra." }] }),
      contextual(localAuthority, { id: "frontera-marcha-bandera", label: "Convocar una marcha nacionalista", hint: "Visibilidad · tensión social", effects: { influence: 6 }, hiddenEffects: { regionalSupport: 5, polarization: 10 }, nationalEffects: { socialConflict: 4 }, outcomes: [{ id: "frontera-marcha-controlada", weight: 66, headline: "La marcha termina sin incidentes", text: "Tu figura gana espacio mientras continúan las negociaciones." }, { id: "frontera-marcha-ataques", weight: 34, headline: "La marcha deriva en ataques contra migrantes", text: "La violencia local desacredita tu convocatoria.", effects: { approval: -12, legalRisk: 4 }, hiddenEffects: { personalReputation: -10 } }] }),
      contextual(civilianOrigin("podcaster"), { id: "frontera-verificar-mapas", label: "Verificar mapas, comunicados y videos", hint: "Cobertura rigurosa · menor estridencia", effects: { influence: 4 }, hiddenEffects: { credibility: 13, mediaNotoriety: 7 }, outcomes: [{ id: "frontera-video-antiguo", weight: 100, headline: "El canal descubre que el video viral era antiguo", text: "La corrección frena un rumor de ataque mientras siguen las conversaciones.", effects: { approval: 6 } }] }),
      contextual(civilianOrigin("empresario"), { id: "frontera-abastecimiento-sin-especular", label: "Asegurar suministros sin subir precios", hint: "Menor margen · confianza pública", effects: { cleanMoney: -25000, approval: 5 }, hiddenEffects: { businessSupport: 5, personalReputation: 8 }, nationalEffects: { inflation: -1 }, outcomes: [{ id: "frontera-abastecimiento-estable", weight: 100, headline: "Los mercados fronterizos evitan el desabastecimiento", text: "Inventarios y precios publicados reducen las compras de pánico." }] }),
      contextual(civilianOrigin("provincia"), { id: "frontera-comunidades-dialogo", label: "Conectar comunidades de ambos lados", hint: "Diplomacia territorial · poca influencia oficial", effects: { approval: 4 }, hiddenEffects: { regionalSupport: 11, ruralApproval: 7 }, outcomes: [{ id: "frontera-feria-suspendida", weight: 100, headline: "Dirigentes acuerdan proteger familias y comercio local", text: "La red comunitaria conserva canales abiertos mientras los gobiernos negocian." }] }),
      contextual(civilian, { id: "frontera-no-difundir-rumores", label: "Verificar antes de compartir alertas", hint: "Reduce pánico · impacto discreto", hiddenEffects: { credibility: 5, polarization: -4 }, outcomes: [{ id: "frontera-rumor-contenido", weight: 100, headline: "Tu red descarta una falsa alerta de movilización", text: "La corrección evita compras de pánico y hostilidad contra extranjeros.", effects: { approval: 3 } }] }),
      contextual(civilian, { id: "frontera-ayuda-familias", label: "Apoyar a familias de la zona fronteriza", hint: "Ayuda concreta · alcance local", effects: { cleanMoney: -4000, approval: 3 }, hiddenEffects: { personalReputation: 5 }, outcomes: [{ id: "frontera-ayuda-local", weight: 100, headline: "Organizaciones locales reciben alimentos y transporte", text: "La asistencia sostiene a familias separadas por el cierre temporal." }] }),
    ],
  }),

  "conflicto-docente": (event) => nationalize(event, {
    age: { min: 28, max: 62 },
    context: "protestas",
    crisis: { id: "huelga-docente", label: "Huelga docente nacional" },
    authority: { careerTrack: "nationalInstitution" },
    patch: { maxOccurrences: 2 },
    options: [
      contextual(localAuthority, { id: "docentes-mesa-local", label: "Mediar una mesa local y sostener servicios escolares", hint: "Gestión territorial · sin control del pliego nacional", effects: { approval: 5 }, hiddenEffects: { regionalSupport: 10, unionSupport: 5 }, nationalEffects: { socialConflict: -2 }, outcomes: [{ id: "docentes-acuerdo-local", weight: 100, headline: "La provincia mantiene alimentación y espacios de estudio", text: "La huelga continúa, pero docentes y familias evitan que el conflicto local se rompa." }] }),
      contextual(localAuthority, { id: "docentes-reemplazo-improvisado", label: "Contratar reemplazos temporales", hint: "Clases parciales · choque sindical", effects: { approval: -2 }, hiddenEffects: { unionSupport: -12, regionalSupport: -4 }, nationalEffects: { socialConflict: 3 }, outcomes: [{ id: "docentes-reemplazos-fallan", weight: 100, headline: "Los reemplazos no sostienen el calendario", text: "La medida enfrenta a familias y docentes sin resolver la huelga.", effects: { approval: -7 } }] }),
      contextual(civilianOrigin("podcaster"), { id: "docentes-revisar-pliego", label: "Contrastar el pliego, el presupuesto y las aulas", hint: "Cobertura rigurosa · presión de ambos lados", effects: { influence: 4 }, hiddenEffects: { credibility: 12, mediaNotoriety: 7 }, outcomes: [{ id: "docentes-datos-publicos", weight: 100, headline: "El debate deja de reducirse a consignas", text: "Docentes, familias y autoridades deben responder con cifras verificables.", effects: { approval: 6 } }] }),
      contextual(civilianOrigin("empresario"), { id: "docentes-conectividad-temporal", label: "Financiar espacios temporales sin sustituir docentes", hint: "Apoyo limitado · evita lucrar con la huelga", effects: { cleanMoney: -30000, approval: 5 }, hiddenEffects: { personalReputation: 7, businessSupport: 4 }, outcomes: [{ id: "docentes-espacios-apoyo", weight: 100, headline: "Bibliotecas y conectividad sostienen a estudiantes", text: "El programa no rompe la huelga y publica cada gasto." }] }),
      contextual(civilianOrigin("provincia"), { id: "docentes-asamblea-familias", label: "Reunir docentes, familias y comunidades", hint: "Diálogo territorial · acuerdo parcial", effects: { approval: 5 }, hiddenEffects: { regionalSupport: 11, ruralApproval: 7, unionSupport: 5 }, outcomes: [{ id: "docentes-agenda-regional", weight: 100, headline: "La región acuerda servicios mínimos y una agenda común", text: "El pacto local no resuelve salarios, pero evita ataques entre familias y docentes." }] }),
      contextual(civilian, { id: "docentes-apoyar-reclamo", label: "Apoyar el reclamo y exigir servicios mínimos", hint: "Equilibrio ciudadano · poca capacidad de decisión", effects: { approval: 3 }, hiddenEffects: { unionSupport: 5, credibility: 4 }, outcomes: [{ id: "docentes-servicios-minimos", weight: 100, headline: "La presión ciudadana protege alimentación y recuperación", text: "El sindicato acepta servicios mínimos mientras continúa la negociación." }] }),
      contextual(civilian, { id: "docentes-organizar-familias", label: "Organizar a las familias para vigilar el acuerdo", hint: "Control ciudadano · desgaste", effects: { influence: 3 }, hiddenEffects: { personalReputation: 4 }, outcomes: [{ id: "docentes-familias-vigilan", weight: 100, headline: "Las familias publican días perdidos y compromisos", text: "El registro reduce promesas ambiguas de recuperación escolar." }] }),
    ],
  }),

  "reforma-salud": (event) => nationalize(event, {
    age: { min: 35, max: 69 },
    context: "crisis-salud",
    crisis: { id: "colapso-salud", label: "Colapso del sistema nacional de salud" },
    authority: { careerTrack: "nationalInstitution" },
    patch: { maxOccurrences: 2, description: "Hospitales y emergencias vuelven a saturarse por falta de camas, personal y medicinas. El Gobierno debate compras y presupuesto; regiones, empresas y ciudadanía enfrentan consecuencias distintas." },
    options: [
      contextual(localAuthority, { id: "salud-red-primaria-local", label: "Reforzar atención primaria y referencias", hint: "Alivio local · presupuesto limitado", effects: { approval: 5 }, hiddenEffects: { regionalSupport: 11, ruralApproval: 8 }, nationalEffects: { poverty: -1, deficit: 1 }, outcomes: [{ id: "salud-centros-descongestionan", weight: 100, headline: "Los centros locales descongestionan emergencias", text: "Equipos móviles y referencias compartidas detectan antes los casos graves.", effects: { approval: 6 } }] }),
      contextual(localAuthority, { id: "salud-convenio-clinicas-local", label: "Firmar un convenio temporal con clínicas locales", hint: "Capacidad rápida · contratos sensibles", effects: { influence: 3 }, hiddenEffects: { businessSupport: 6, leakExposure: 6 }, nationalEffects: { deficit: 1 }, outcomes: [{ id: "salud-convenio-funciona", weight: 62, headline: "El convenio reduce la lista de espera", text: "Tarifas publicadas contienen cuestionamientos." }, { id: "salud-convenio-sobrecosto", weight: 38, headline: "Una clínica factura atenciones duplicadas", text: "La respuesta rápida termina bajo auditoría.", effects: { approval: -9, legalRisk: 5 }, addInvestigations: [{ id: "convenio-salud-local", label: "Investigación de convenio sanitario local" }] }] }),
      contextual(civilianOrigin("podcaster"), { id: "salud-listas-espera", label: "Investigar listas de espera y compras", hint: "Datos públicos · enfrenta proveedores", effects: { influence: 5, cleanMoney: -5000 }, hiddenEffects: { credibility: 13, mediaNotoriety: 8 }, outcomes: [{ id: "salud-compras-fragmentadas", weight: 100, headline: "El reportaje revela compras fragmentadas y camas vacías", text: "La evidencia obliga a publicar inventarios y derivaciones.", effects: { approval: 7 }, addInvestigations: [{ id: "compras-salud-colapso", label: "Investigación de compras durante colapso sanitario" }] }] }),
      contextual(civilianOrigin("empresario"), { id: "salud-donar-capacidad", label: "Aportar insumos y capacidad con costos publicados", hint: "Costo privado · evita conflicto de interés", effects: { cleanMoney: -65000, approval: 6 }, hiddenEffects: { businessSupport: 5, credibility: 8 }, outcomes: [{ id: "salud-donacion-trazable", weight: 100, headline: "Hospitales reciben insumos sin contratos futuros", text: "La trazabilidad separa la ayuda de cualquier negociación comercial.", effects: { influence: 5 } }] }),
      contextual(civilianOrigin("provincia"), { id: "salud-brigadas-rurales", label: "Organizar brigadas y traslados rurales", hint: "Cobertura territorial · logística costosa", effects: { cleanMoney: -9000, approval: 5 }, hiddenEffects: { ruralApproval: 12, regionalSupport: 10 }, outcomes: [{ id: "salud-rutas-referencia", weight: 100, headline: "Las comunidades coordinan rutas de referencia", text: "Pacientes graves llegan antes y los puestos de salud comparten existencias." }] }),
      contextual(civilian, { id: "salud-red-cuidadores", label: "Organizar apoyo para pacientes y cuidadores", hint: "Ayuda directa · alcance limitado", effects: { cleanMoney: -4000, approval: 3 }, hiddenEffects: { personalReputation: 5 }, outcomes: [{ id: "salud-cuidadores-apoyo", weight: 100, headline: "Una red cubre alimentos, turnos y traslados", text: "La ayuda no reforma el sistema, pero evita abandonos durante la saturación." }] }),
      contextual(civilian, { id: "salud-vigilar-abastecimiento", label: "Vigilar inventarios y tiempos de atención", hint: "Fiscalización ciudadana · trabajo sostenido", effects: { influence: 2 }, hiddenEffects: { credibility: 5 }, outcomes: [{ id: "salud-tablero-ciudadano", weight: 100, headline: "Un tablero ciudadano expone faltantes y demoras", text: "Hospitales y autoridades deben actualizar datos antes de declarar resuelta la crisis.", effects: { approval: 3 } }] }),
    ],
  }),
};

export function globalizeNationalEvents(events) {
  const found = new Set(events.map((event) => event.id));
  const missing = Object.keys(globalizers).filter((id) => !found.has(id));
  if (missing.length) throw new Error(`No se encontraron eventos nacionales para adaptar: ${missing.join(", ")}`);
  return events.map((event) => globalizers[event.id]?.(event) ?? event);
}

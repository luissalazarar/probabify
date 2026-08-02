export const originBranchEvents = [
  {
    id: "dinastia-bancada", directedOnly: true, category: "party",
    title: "El apellido entra a la bancada", kicker: "Continuación de origen · la curul tiene dueños", description: "La bancada familiar exige disciplina. Tu primer voto importante decidirá si eres una heredera obediente o una figura con criterio propio.",
    options: [
      { id: "disciplina-bancada", label: "Votar con la familia", hint: "Estructura y protección · menor autonomía", effects: { influence: 8, approval: -3 }, hiddenEffects: { partyCohesion: 12, credibility: -5 }, addTags: ["partido-formal"], outcomes: [{ id: "familia-controla-voto", weight: 100, headline: "La bancada confirma que puede contar contigo", text: "Obtienes comisiones y operadores, pero cada favor queda anotado." }] },
      { id: "romper-bancada", label: "Votar con independencia", hint: "Credibilidad · conflicto familiar", effects: { approval: 7, influence: -5 }, hiddenEffects: { credibility: 10, familyStress: 9, partyCohesion: -8 }, addTags: ["ala-independiente"], outcomes: [{ id: "voto-propio-dinastia", weight: 100, headline: "Tu primer voto divide a la dinastía", text: "La prensa descubre una voz propia y tu familia empieza a poner límites." }] },
    ],
  },
  {
    id: "dinastia-gira-propia", directedOnly: true, category: "community",
    title: "Una gira sin el apellido en los afiches", kicker: "Continuación de origen · construir base propia", description: "Sin la maquinaria familiar, debes elegir entre escuchar organizaciones locales o contratar un equipo que fabrique una imagen independiente.",
    options: [
      { id: "gira-territorial-propia", label: "Recorrer barrios y provincias", hint: "Base lenta · mayor credibilidad", effects: { cleanMoney: -14000, approval: 8 }, hiddenEffects: { ruralApproval: 10, regionalSupport: 9, credibility: 7 }, addTags: ["base-territorial"], outcomes: [{ id: "red-propia-dinastia", weight: 100, headline: "Una red territorial empieza a responder a tu nombre", text: "Dirigentes locales se suman sin pedir permiso a la familia." }] },
      { id: "marca-independiente", label: "Contratar una estrategia de imagen", hint: "Notoriedad rápida · alto costo", effects: { cleanMoney: -26000, influence: 7 }, hiddenEffects: { mediaNotoriety: 12, credibility: -3 }, addTags: ["figura-mediatica"], outcomes: [{ id: "apellido-reinventado", weight: 100, headline: "La campaña intenta separar tu rostro del apellido", text: "La nueva imagen gana atención, aunque los rivales recuerdan de dónde vienes." }] },
    ],
  },
  {
    id: "provincia-control-obra", directedOnly: true, category: "regional",
    title: "La obra limpia también debe sobrevivir", kicker: "Continuación de origen · fiscalización local", description: "La licitación transparente avanza lentamente. Vecinos exigen vigilancia y la constructora pide ampliar el plazo.",
    options: [
      { id: "comite-vigilancia", label: "Crear vigilancia vecinal", hint: "Confianza · obra más lenta", effects: { approval: 6, cleanMoney: -5000 }, hiddenEffects: { credibility: 9, regionalSupport: 8 }, addTags: ["gestion-limpia"], outcomes: [{ id: "vecinos-fiscalizan", weight: 100, headline: "Los vecinos vigilan cada avance de la carretera", text: "La obra tarda, pero el expediente se vuelve un ejemplo regional." }] },
      { id: "acelerar-obra-limpia", label: "Acelerar dentro de las reglas", hint: "Costo presupuestal · resultado visible", effects: { cleanMoney: -13000, influence: 4 }, outcomes: [{ id: "obra-acelera", weight: 100, headline: "La carretera recupera el tiempo perdido", text: "La gestión demuestra que la transparencia no obliga a paralizar." }] },
    ],
  },
  {
    id: "provincia-favor-cobrado", directedOnly: true, category: "regional",
    title: "La constructora presenta su primera factura", kicker: "Continuación de origen · el favor vuelve", description: "Tras inaugurar la carretera, la empresa exige controlar un nuevo contrato municipal y recuerda el acuerdo que aceleró la obra.",
    options: [
      { id: "romper-constructora", label: "Romper el acuerdo", hint: "Pierde dinero y aliados · reduce riesgo", allowDirtyShortfall: true, effects: { influence: -6, legalRisk: -8, dirtyMoney: -8000 }, hiddenEffects: { credibility: 8 }, addEnemies: [{ id: "constructora-traicionada", label: "Constructora apartada tras el primer acuerdo" }], outcomes: [{ id: "empresa-amenaza", weight: 100, headline: "La constructora amenaza con revelar el acuerdo", text: "Recuperas autonomía, pero el expediente queda como riesgo futuro." }] },
      { id: "nuevo-favor-constructora", label: "Conceder el nuevo contrato", hint: "Caja y obras · exposición creciente", effects: { dirtyMoney: 42000, influence: 7, legalRisk: 13 }, hiddenEffects: { leakExposure: 12 }, addTags: ["red-contratos"], outcomes: [{ id: "red-municipal", weight: 100, headline: "La constructora amplía su dominio municipal", text: "Las obras avanzan y también crece el número de personas que conocen el trato." }] },
    ],
  },
  {
    id: "reinsercion-mesa-democratica", directedOnly: true, category: "community",
    title: "La mesa que pone a prueba tu retorno", kicker: "Continuación de origen · reconciliación real", description: "Familiares de víctimas, vecinos y antiguos compañeros aceptan conversar. Todos esperan una definición sobre tu pasado.",
    options: [
      { id: "reconocer-dano", label: "Reconocer responsabilidades y escuchar", hint: "Pierde a la vieja base · gana legitimidad", effects: { approval: 10, influence: -4, legalRisk: -5 }, hiddenEffects: { credibility: 14, polarization: -12, personalReputation: 10 }, addTags: ["ruta-democratica"], outcomes: [{ id: "mesa-reconciliacion", weight: 100, headline: "Una mesa difícil abre una ruta democrática", text: "No todos perdonan, pero nuevas organizaciones aceptan trabajar contigo." }] },
      { id: "defensa-historica", label: "Defender tu versión sin disculparte", hint: "Conserva base · reconciliación limitada", effects: { influence: 6, approval: -3 }, hiddenEffects: { polarization: 8, credibility: -4 }, addTags: ["memoria-disputada"], outcomes: [{ id: "mesa-tensa", weight: 100, headline: "La mesa termina sin acuerdo", text: "Mantienes a tus antiguos seguidores, mientras los vecinos exigen más claridad." }] },
    ],
  },
  {
    id: "reinsercion-red-radical", directedOnly: true, category: "community",
    title: "La vieja red quiere volver a operar", kicker: "Continuación de origen · poder bajo vigilancia", description: "Antiguos compañeros ofrecen movilización y recursos. A cambio quieren controlar el discurso y las decisiones del nuevo movimiento.",
    options: [
      { id: "limitar-vieja-red", label: "Aceptar apoyo con límites democráticos", hint: "Organización · ruptura posible", effects: { influence: 8, cleanMoney: 9000 }, hiddenEffects: { partyCohesion: 5, credibility: 4 }, addTags: ["partido-formal"], outcomes: [{ id: "red-se-formaliza", weight: 55, headline: "Parte de la vieja red acepta reglas democráticas", text: "El movimiento obtiene estructura sin volver completamente al pasado." }, { id: "radicales-rompen", weight: 45, headline: "El sector radical abandona el movimiento", text: "Pierdes operadores, pero reduces el riesgo de una nueva investigación.", effects: { influence: -6, legalRisk: -7 } }] },
      { id: "activar-vieja-red", label: "Entregarles el control territorial", hint: "Influencia rápida · alto riesgo", effects: { influence: 15, dirtyMoney: 26000, legalRisk: 18 }, hiddenEffects: { polarization: 14, credibility: -10 }, addTags: ["base-radical", "partido-formal"], outcomes: [{ id: "red-clandestina-activa", weight: 100, headline: "La vieja red reaparece dentro del nuevo movimiento", text: "La movilización crece y Fiscalía empieza a seguir a varios operadores." }] },
    ],
  },
  {
    id: "podcast-ruta-ideologica", directedOnly: true, category: "media",
    title: "La audiencia quiere convertirse en movimiento", kicker: "Continuación de origen · canal ideológico", description: "Los seguidores más activos proponen organizar círculos locales. La productora teme que el canal deje de informar y se vuelva una maquinaria.",
    options: [
      { id: "circulos-podcast", label: "Organizar círculos de seguidores", hint: "Base política · mayor polarización", effects: { influence: 10, cleanMoney: -7000 }, hiddenEffects: { partyCohesion: 9, polarization: 10 }, addTags: ["movimiento-digital", "partido-formal"], outcomes: [{ id: "comunidad-se-organiza", weight: 100, headline: "La audiencia empieza a reunirse fuera de internet", text: "El canal ya no es solo contenido: aparece una estructura política propia." }] },
      { id: "canal-ideologico-profesional", label: "Mantenerlo como medio editorial", hint: "Credibilidad · crecimiento más lento", effects: { cleanMoney: 12000, influence: 3 }, hiddenEffects: { credibility: 9, pressSupport: 5 }, addTags: ["medio-profesional"], outcomes: [{ id: "canal-opinion", weight: 100, headline: "El canal se consolida como medio de opinión", text: "La audiencia crece sin convertirse todavía en partido." }] },
    ],
  },
  {
    id: "podcast-ruta-sensacional", directedOnly: true, category: "media",
    title: "Los anunciantes quieren controlar el siguiente episodio", kicker: "Continuación de origen · viralidad rentable", description: "La denuncia viral atrae contratos. Una agencia ofrece ingresos altos si puede elegir objetivos y titulares.",
    options: [
      { id: "agencia-con-etiqueta", label: "Aceptar anuncios identificados", hint: "Dinero limpio · autonomía parcial", effects: { cleanMoney: 32000, approval: -2 }, hiddenEffects: { credibility: 4, businessSupport: 8 }, addTags: ["canal-comercial"], outcomes: [{ id: "temporada-patrocinada", weight: 100, headline: "El canal estrena una temporada patrocinada", text: "Los ingresos estabilizan la producción y los anuncios quedan claramente marcados." }] },
      { id: "agencia-control-oculto", label: "Vender titulares sin avisar", hint: "Dinero sucio · dependencia futura", effects: { dirtyMoney: 58000, influence: 7, legalRisk: 8 }, hiddenEffects: { credibility: -11, leakExposure: 16 }, addTags: ["medio-sensacionalista"], outcomes: [{ id: "titulares-comprados", weight: 100, headline: "Una agencia empieza a comprar la agenda del canal", text: "La audiencia sigue creciendo sin conocer quién decide algunos objetivos." }] },
    ],
  },
  {
    id: "podcast-ruta-independiente", directedOnly: true, category: "media",
    title: "Una investigación puede definir al canal", kicker: "Continuación de origen · independencia editorial", description: "Una periodista ofrece meses de trabajo sobre contrataciones públicas. Publicar exige dinero y paciencia; optar por debates produciría ingresos inmediatos.",
    options: [
      { id: "financiar-investigacion", label: "Financiar la investigación", hint: "Credibilidad alta · costo importante", effects: { cleanMoney: -16000, influence: 3 }, hiddenEffects: { credibility: 13, pressSupport: 10, mediaNotoriety: 5 }, addTags: ["periodismo-investigacion"], outcomes: [{ id: "reportaje-contratos", weight: 100, headline: "El canal publica su primera investigación extensa", text: "El reportaje gana respeto y también enemigos entre contratistas." }] },
      { id: "formato-debates", label: "Priorizar debates patrocinados", hint: "Ingresos y alcance · menor profundidad", effects: { cleanMoney: 24000, influence: 6 }, hiddenEffects: { mediaNotoriety: 9, credibility: -3 }, addTags: ["canal-debates"], outcomes: [{ id: "debates-crecen", weight: 100, headline: "Los debates convierten al canal en una plaza nacional", text: "Candidatos y dirigentes buscan tu estudio para llegar a nuevas audiencias." }] },
    ],
  },
];

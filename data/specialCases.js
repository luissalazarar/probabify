export const SPECIAL_CASE_DEFINITIONS = {
  trial: {
    id: "proceso-judicial",
    kind: "trial",
    title: "El caso principal",
    kicker: "Expediente judicial en curso",
    priority: 100,
    metrics: [
      { id: "evidence", label: "Carga fiscal", tone: "danger", direction: "low" },
      { id: "defense", label: "Defensa legal", tone: "good", direction: "high" },
      { id: "court", label: "Posición ante el juez", tone: "neutral", direction: "high" },
      { id: "media", label: "Presión mediática", tone: "warning", direction: "low" },
    ],
  },
  vacancy: {
    id: "crisis-vacancia",
    kind: "vacancy",
    title: "La cuenta en el Congreso",
    kicker: "Supervivencia presidencial",
    priority: 95,
    metrics: [
      { id: "survival", label: "Votos para resistir", tone: "good", direction: "high" },
      { id: "cabinet", label: "Gabinete unido", tone: "neutral", direction: "high" },
      { id: "institutions", label: "Respaldo institucional", tone: "neutral", direction: "high" },
      { id: "street", label: "Respaldo en la calle", tone: "good", direction: "high" },
    ],
  },
  disaster: {
    id: "emergencia-nacional",
    kind: "disaster",
    title: "Emergencia nacional",
    kicker: "Cobertura en desarrollo",
    priority: 90,
    metrics: [
      { id: "severity", label: "Daño acumulado", tone: "danger", direction: "low" },
      { id: "response", label: "Capacidad de respuesta", tone: "good", direction: "high" },
      { id: "supplies", label: "Ayuda y abastecimiento", tone: "neutral", direction: "high" },
      { id: "trust", label: "Confianza pública", tone: "good", direction: "high" },
    ],
  },
  campaign: {
    id: "campana-presidencial",
    kind: "campaign",
    title: "La carrera por Palacio",
    kicker: "Campaña presidencial",
    priority: 85,
    metrics: [
      { id: "intention", label: "Intención de voto", tone: "good", direction: "high" },
      { id: "organization", label: "Organización nacional", tone: "neutral", direction: "high" },
      { id: "resources", label: "Recursos de campaña", tone: "good", direction: "high" },
      { id: "rejection", label: "Rechazo electoral", tone: "danger", direction: "low" },
    ],
  },
  prison: {
    id: "vida-en-prision",
    kind: "prison",
    title: "Vida bajo custodia",
    kicker: "Situación penitenciaria",
    priority: 75,
    metrics: [
      { id: "appeal", label: "Ruta de apelación", tone: "good", direction: "high" },
      { id: "outside", label: "Red fuera del penal", tone: "neutral", direction: "high" },
      { id: "inside", label: "Influencia interna", tone: "warning", direction: "high" },
      { id: "family", label: "Estabilidad familiar", tone: "good", direction: "high" },
    ],
  },
  exile: {
    id: "vida-en-exilio",
    kind: "exile",
    title: "Política desde el exilio",
    kicker: "Caso internacional",
    priority: 74,
    metrics: [
      { id: "legalPath", label: "Ruta legal de retorno", tone: "good", direction: "high" },
      { id: "international", label: "Respaldo internacional", tone: "neutral", direction: "high" },
      { id: "remote", label: "Influencia a distancia", tone: "warning", direction: "high" },
      { id: "resources", label: "Recursos disponibles", tone: "good", direction: "high" },
    ],
  },
};

export const NATIONAL_EMERGENCY_CASES = {
  "nino-costero-nacional": { title: "El Niño Costero", kicker: "Lluvias, huaicos y reconstrucción", severity: 70 },
  "terremoto-costa-central": { title: "Terremoto en la costa central", kicker: "Rescate, réplicas y vivienda", severity: 82 },
  "sequia-sur-andino": { title: "Sequía en el sur andino", kicker: "Agua, agricultura y conflicto", severity: 64 },
  "incendios-amazonia-nacional": { title: "Incendios en la Amazonía", kicker: "Humo, bosques y comunidades", severity: 72 },
  "epidemia-respiratoria-nacional": { title: "Emergencia sanitaria", kicker: "Hospitales, evidencia y confianza", severity: 76 },
  "derrame-petroleo-amazonia": { title: "Derrame en la Amazonía", kicker: "Agua, reparación y responsabilidades", severity: 68 },
};

const MATERIAL_AID_OPTION_IDS = new Set([
  "nino-stream-donaciones", "nino-logistica-privada", "nino-alerta-comunal", "nino-colecta-ciudadana",
  "sismo-maquinaria-donada", "sismo-brigadas-reinsertadas", "sismo-fundacion-expresidencial", "sismo-donar-sangre",
  "sequia-riego-inversion", "sequia-faena-reservorio", "sequia-apoyo-alimentos",
  "incendios-aeronaves-privadas", "incendios-brigadas-rurales", "incendios-fondo-brigadistas",
  "epidemia-reconvertir-planta", "epidemia-clinicas-familiares", "epidemia-red-cuidados",
  "derrame-consorcio-limpieza", "derrame-difundir-monitoreo", "derrame-apoyar-agua",
]);

const EVENT_CASE_PATCHES = {
  "fiscalia-cerca": [{ kind: "trial", stage: { current: 1, total: 4, label: "Primera citación" } }],
  "investigacion-avanzada": [{ kind: "trial", stage: { current: 2, total: 4, label: "Acusación formal" } }],
  "orden-captura": [{ kind: "trial", stage: { current: 3, total: 4, label: "Medida cautelar" } }],
  "revision-arresto-domiciliario": [{ kind: "trial", stage: { current: 3, total: 4, label: "Revisión de restricciones" } }],
  "juicio-en-libertad": [{ kind: "trial", stage: { current: 4, total: 4, label: "Juicio oral" } }],
  "prision-decision": [
    { kind: "trial", observeOnly: true, stage: { current: 3, total: 4, label: "Prisión preventiva" } },
    { kind: "prison", stage: { current: 1, total: 3, label: "Ingreso al penal" } },
  ],
  "vida-prision": [
    { kind: "trial", observeOnly: true, stage: { current: 3, total: 4, label: "Proceso bajo custodia" } },
    { kind: "prison", stage: { current: 2, total: 3, label: "Custodia y apelación" } },
  ],
  "taller-penitenciario": [{ kind: "prison", stage: { current: 2, total: 3, label: "Vida penitenciaria" } }],
  "visita-politica-prision": [{ kind: "prison", stage: { current: 2, total: 3, label: "Poder desde el penal" } }],
  "vida-exilio": [
    { kind: "trial", observeOnly: true, stage: { current: 3, total: 4, label: "Proceso desde el extranjero" } },
    { kind: "exile", stage: { current: 1, total: 3, label: "Salida del país" } },
  ],
  "tribunal-internacional": [{ kind: "exile", stage: { current: 2, total: 3, label: "Litigio internacional" } }],
  "coalicion-exilio": [{ kind: "exile", stage: { current: 2, total: 3, label: "Oposición desde fuera" } }],
  "estrategia-presidencial": [{ kind: "campaign", stage: { current: 1, total: 4, label: "Primera vuelta" } }],
  "debate-presidencial": [{ kind: "campaign", stage: { current: 2, total: 4, label: "Debate nacional" } }],
  "escrutinio-presidencial": [{ kind: "campaign", stage: { current: 3, total: 4, label: "Conteo de votos" } }],
  "segunda-vuelta": [{ kind: "campaign", stage: { current: 4, total: 4, label: "Segunda vuelta" } }],
  "gabinete-presidencial": [{ kind: "vacancy", observeOnly: true, stage: { current: 1, total: 3, label: "Equilibrio de bancadas" } }],
  "coalicion-congreso": [{ kind: "vacancy", observeOnly: true, stage: { current: 1, total: 3, label: "Negociación parlamentaria" } }],
  "crisis-presidencial": [{ kind: "vacancy", observeOnly: true, stage: { current: 1, total: 3, label: "Gobierno bajo presión" } }],
  "fractura-altos-mandos": [{ kind: "vacancy", observeOnly: true, stage: { current: 1, total: 3, label: "Respaldo institucional" } }],
  "mamanivideos-obras": [{ kind: "vacancy", observeOnly: true, stage: { current: 1, total: 3, label: "Votos y obras bajo sospecha" } }],
  "los-ninos-obras": [{ kind: "vacancy", observeOnly: true, stage: { current: 1, total: 3, label: "Bancada bisagra" } }],
  "dinero-bano-palacio": [{ kind: "vacancy", observeOnly: true, stage: { current: 1, total: 3, label: "Círculo de Palacio" } }],
  "chifa-encapuchado": [{ kind: "vacancy", observeOnly: true, stage: { current: 1, total: 3, label: "Reuniones no registradas" } }],
  "casa-sarratea": [{ kind: "vacancy", observeOnly: true, stage: { current: 1, total: 3, label: "Despacho paralelo" } }],
  "hermano-en-la-sombra": [{ kind: "vacancy", observeOnly: true, stage: { current: 1, total: 3, label: "Poder familiar" } }],
  "mocion-vacancia": [{ kind: "vacancy", stage: { current: 2, total: 3, label: "Debate en el Pleno" } }],
};

const OPTION_CASE_EFFECTS = {
  colaborar: { trial: { evidence: -22, court: 12, media: 7 } },
  "presentar-descargos": { trial: { defense: 14, court: 6 } },
  obstruir: { trial: { evidence: 22, court: -16, media: 14 } },
  "defensa-institucional": { trial: { defense: 16, court: 9 } },
  "preparar-fuga": { trial: { evidence: 17, court: -20, media: 12 } },
  "entrega-justicia": { trial: { defense: 7, court: 14 } },
  "colaboracion-eficaz-propia": { trial: { evidence: -25, court: 18, media: 5 } },
  "fuga-clandestina": { trial: { evidence: 20, court: -22, media: 16 } },
  "cumplir-arresto-domiciliario": { trial: { defense: 11, court: 13 } },
  "romper-restricciones-domiciliarias": { trial: { evidence: 19, court: -22, media: 13 } },
  "ampliar-colaboracion-domiciliaria": { trial: { evidence: -21, court: 18 } },
  "litigar-juicio-principal": { trial: { defense: 19, court: 6 } },
  "admitir-responsabilidad-limitada": { trial: { evidence: -14, court: 13, media: -4 } },
  "presionar-testigo-juicio": { trial: { evidence: 27, court: -27, media: 21 } },
  "apelar-prision": { trial: { defense: 12, court: 6 }, prison: { appeal: 14, family: -3 } },
  "negociar-informacion-prision": { trial: { evidence: -16, court: 10 }, prison: { appeal: 12, outside: -6 } },
  "campana-centro": { campaign: { intention: 9, rejection: -9, organization: -3, resources: -5 } },
  "campana-base": { campaign: { intention: 5, organization: 11, rejection: 12, resources: -4 } },
  "campana-outsider": { campaign: { intention: 7, rejection: 11, resources: -7 } },
  "debate-programatico": { campaign: { intention: 7, rejection: -4, resources: -2 } },
  "debate-atacar": { campaign: { intention: 4, rejection: 8 } },
  "debate-memes": { campaign: { intention: 3, rejection: 5 } },
  "alianza-segunda-vuelta": { campaign: { organization: 13, rejection: -7, resources: -8 } },
  "base-segunda-vuelta": { campaign: { intention: 5, organization: 9, rejection: 12, resources: -5 } },
  "coalicion-vacancia": { vacancy: { survival: 19, cabinet: 7, institutions: 8 } },
  "comprar-votos-vacancia": { vacancy: { survival: 20, institutions: -18, street: -8 } },
  "calle-contra-vacancia": { vacancy: { street: 17, institutions: -4 } },
  "entrevista-prision": { prison: { outside: 11, inside: 8, family: -4 } },
  "sucesor-desde-prision": { prison: { outside: 13, inside: 5 } },
  "aceptar-condena": { prison: { appeal: -28, family: 8 } },
  "reparar-desde-prision": { prison: { family: 17, inside: -5 } },
  "entrevista-exilio": { exile: { remote: 12, international: 6, resources: 4 } },
  "retorno-negociado": { exile: { legalPath: 17, international: 7, resources: -6 } },
  "asesor-internacional": { exile: { international: 11, resources: 14, remote: -5 } },
};

const OUTCOME_CASE_PATCHES = {
  "centro-electoral": { kind: "campaign", polarity: "neutral" },
  "base-electoral": { kind: "campaign", polarity: "neutral" },
  "outsider-electoral": { kind: "campaign", polarity: "neutral" },
  "pase-segunda-vuelta": { kind: "campaign", polarity: "favorable" },
  "programa-convence": { kind: "campaign", polarity: "favorable" },
  "programa-no-conecta": { kind: "campaign", polarity: "adverse" },
  "ataque-debate": { kind: "campaign", polarity: "favorable" },
  "ataque-desesperado-debate": { kind: "campaign", polarity: "adverse" },
  "frase-viral-debate": { kind: "campaign", polarity: "favorable" },
  "meme-en-contra": { kind: "campaign", polarity: "adverse" },
  "manuscrito-prision": { kind: "prison", polarity: "favorable", weightMetric: "outside", applyPolarityEffects: false },
  "informacion-insuficiente": { kind: "prison", polarity: "adverse", weightMetric: "appeal" },
  "partido-carcel": { kind: "prison", polarity: "favorable", weightMetric: "outside", applyPolarityEffects: false },
  "sucesor-rompe": { kind: "prison", polarity: "adverse", weightMetric: "outside" },
  "apelacion-denegada": { kind: "prison", polarity: "adverse", weightMetric: "appeal" },
  "culto-prision": { kind: "prison", polarity: "favorable", weightMetric: "outside", applyPolarityEffects: false },
  "rutina-reparacion-prision": { kind: "prison", polarity: "favorable", weightMetric: "family", applyPolarityEffects: false },
  "taller-funciona": { kind: "prison", polarity: "favorable", weightMetric: "inside", applyPolarityEffects: false },
  "taller-restringido": { kind: "prison", polarity: "adverse", weightMetric: "inside" },
  "red-penal-crece": { kind: "prison", polarity: "favorable", weightMetric: "inside", newsTone: "warning", applyPolarityEffects: false },
  "registro-celda": { kind: "prison", polarity: "adverse", weightMetric: "inside" },
  "partido-se-modera": { kind: "prison", polarity: "favorable", weightMetric: "outside", applyPolarityEffects: false },
  "base-cierra-filas": { kind: "prison", polarity: "favorable", weightMetric: "outside", newsTone: "warning", applyPolarityEffects: false },
  "dirigentes-renuncian": { kind: "prison", polarity: "adverse", weightMetric: "outside" },
  "base-exilio": { kind: "exile", polarity: "favorable", weightMetric: "remote", applyPolarityEffects: false },
  "retorno-bloqueado": { kind: "exile", polarity: "adverse", weightMetric: "legalPath" },
  "consultor-exilio": { kind: "exile", polarity: "favorable", weightMetric: "international", applyPolarityEffects: false },
  "corte-admite-medidas": { kind: "exile", polarity: "favorable", weightMetric: "legalPath" },
  "corte-rechaza-caso": { kind: "exile", polarity: "adverse", weightMetric: "legalPath" },
  "gira-exilio-crece": { kind: "exile", polarity: "favorable", weightMetric: "international", applyPolarityEffects: false },
  "gira-cuestionada": { kind: "exile", polarity: "adverse", weightMetric: "international" },
  "frente-presiona-retorno": { kind: "exile", polarity: "favorable", weightMetric: "remote" },
  "frente-elige-otro": { kind: "exile", polarity: "adverse", weightMetric: "remote" },
  "red-propia-exilio": { kind: "exile", polarity: "favorable", weightMetric: "remote", newsTone: "warning", applyPolarityEffects: false },
  "dialogo-funciona": { kind: "vacancy", polarity: "favorable" },
  "dialogo-fracasa": { kind: "vacancy", polarity: "adverse" },
  "orden-restaurado": { kind: "vacancy", polarity: "favorable" },
  "represion-fatal": { kind: "vacancy", polarity: "adverse" },
  "crisis-sucesion-ordenada": { kind: "vacancy", polarity: "favorable" },
  "crisis-bloque-avanza": { kind: "vacancy", polarity: "favorable" },
  "crisis-bloque-expuesto": { kind: "vacancy", polarity: "adverse" },
  "crisis-ciudad-funciona": { kind: "vacancy", polarity: "favorable" },
  "crisis-marcha-pacifica": { kind: "vacancy", polarity: "favorable" },
  "crisis-marcha-desborda": { kind: "vacancy", polarity: "adverse" },
  "crisis-linea-tiempo": { kind: "vacancy", polarity: "favorable" },
  "crisis-empresas-no-financian": { kind: "vacancy", polarity: "favorable" },
  "crisis-observadores": { kind: "vacancy", polarity: "favorable" },
  "crisis-calle-calendario": { kind: "vacancy", polarity: "favorable" },
  "tecnicos-gabinete": { kind: "vacancy", polarity: "favorable" },
  "gabinete-politico": { kind: "vacancy", polarity: "favorable", weightMetric: "survival", newsTone: "warning", applyPolarityEffects: false },
  "ministro-cuestionado": { kind: "vacancy", polarity: "adverse" },
  "circulo-palacio": { kind: "vacancy", polarity: "neutral" },
  "amigo-filtra": { kind: "vacancy", polarity: "adverse" },
  "agenda-minima": { kind: "vacancy", polarity: "favorable" },
  "congreso-cede": { kind: "vacancy", polarity: "favorable" },
  "confianza-negada": { kind: "vacancy", polarity: "adverse" },
  "leyes-aprobadas": { kind: "vacancy", polarity: "favorable", weightMetric: "survival", newsTone: "warning", applyPolarityEffects: false },
  "chats-congreso": { kind: "vacancy", polarity: "adverse" },
  "relevo-militar-ordenado": { kind: "vacancy", polarity: "favorable" },
  "comunicado-mandos-rebeldes": { kind: "vacancy", polarity: "adverse" },
  "mandos-respaldan-gobierno": { kind: "vacancy", polarity: "favorable", weightMetric: "institutions", newsTone: "warning", applyPolarityEffects: false },
  "concesiones-militares-filtradas": { kind: "vacancy", polarity: "adverse" },
  "audiencia-control-civil": { kind: "vacancy", polarity: "favorable" },
  "mamanideos-votacion": { kind: "vacancy", polarity: "neutral", applyPolarityEffects: false },
  "mamanideos-publicados": { kind: "vacancy", polarity: "adverse" },
  "mamanideos-votos": { kind: "vacancy", polarity: "favorable", weightMetric: "survival", newsTone: "warning", applyPolarityEffects: false },
  "ninos-oposicion": { kind: "vacancy", polarity: "neutral", applyPolarityEffects: false },
  "ninos-votan": { kind: "vacancy", polarity: "favorable", weightMetric: "survival", newsTone: "warning", applyPolarityEffects: false },
  "ninos-colaboradores": { kind: "vacancy", polarity: "adverse" },
  "bano-colabora": { kind: "vacancy", polarity: "favorable" },
  "bano-fuga": { kind: "vacancy", polarity: "adverse" },
  "bano-silencio": { kind: "vacancy", polarity: "adverse" },
  "chifa-agenda": { kind: "vacancy", polarity: "favorable" },
  "chifa-camaras": { kind: "vacancy", polarity: "adverse" },
  "chifa-sin-registro": { kind: "vacancy", polarity: "adverse" },
  "sarratea-cerrada": { kind: "vacancy", polarity: "favorable" },
  "sarratea-videos": { kind: "vacancy", polarity: "adverse" },
  "sarratea-red": { kind: "vacancy", polarity: "adverse" },
  "hermano-rompe": { kind: "vacancy", polarity: "favorable" },
  "hermano-prefectos": { kind: "vacancy", polarity: "neutral" },
  "hermano-allanado": { kind: "vacancy", polarity: "adverse" },
  "retiro-colaborador": { kind: "trial", polarity: "favorable", close: true, resolution: "Acuerdo fiscal" },
  "diligencias-archivadas": { kind: "trial", polarity: "favorable", close: true, resolution: "Caso archivado" },
  "caso-archivado": { kind: "trial", polarity: "favorable", close: true, resolution: "Caso archivado" },
  "acusacion-ampliada": { kind: "trial", polarity: "adverse" },
  "prision-preventiva": { kind: "trial", polarity: "adverse" },
  "investigacion-se-acota": { kind: "trial", polarity: "favorable" },
  "allanamiento-fiscal": { kind: "trial", polarity: "adverse" },
  "salida-a-tiempo": { kind: "trial", polarity: "adverse" },
  "captura-aeropuerto": { kind: "trial", polarity: "adverse" },
  "arresto-domiciliario": { kind: "trial", polarity: "neutral" },
  "prision-preventiva-orden": { kind: "trial", polarity: "adverse" },
  "acuerdo-fiscal": { kind: "trial", polarity: "favorable", close: true, resolution: "Colaboración homologada" },
  "oferta-rechazada": { kind: "trial", polarity: "adverse" },
  "asilo-concedido": { kind: "trial", polarity: "adverse" },
  "extradicion-rapida": { kind: "trial", polarity: "adverse" },
  "arresto-revocado-con-reglas": { kind: "trial", polarity: "favorable" },
  "visitas-arresto-documentadas": { kind: "trial", polarity: "adverse" },
  "operacion-domiciliaria-no-probada": { kind: "trial", polarity: "neutral" },
  "acuerdo-domiciliario-homologado": { kind: "trial", polarity: "favorable", close: true, resolution: "Acuerdo judicial" },
  "absolucion-juicio-principal": { kind: "trial", polarity: "favorable", close: true, resolution: "Absolución" },
  "condena-suspendida-juicio": { kind: "trial", polarity: "adverse", close: true, resolution: "Condena e inhabilitación" },
  "acuerdo-reparacion-judicial": { kind: "trial", polarity: "neutral", close: true, resolution: "Sentencia acordada" },
  "testigo-retira-version": { kind: "trial", polarity: "favorable", close: true, resolution: "Caso cerrado" },
  "testigo-graba-presion": { kind: "trial", polarity: "adverse", close: true, resolution: "Prisión e inhabilitación" },
  "vacancia-fracasa-coalicion": { kind: "vacancy", polarity: "favorable", close: true, resolution: "Moción derrotada" },
  "coalicion-se-rompe": { kind: "vacancy", polarity: "adverse", close: true, resolution: "Vacancia aprobada" },
  "votos-comprados": { kind: "vacancy", polarity: "favorable", weightMetric: "survival", close: true, resolution: "Moción derrotada bajo sospecha", resolutionTone: "warning", newsTone: "warning", applyPolarityEffects: false },
  "audio-compra-votos": { kind: "vacancy", polarity: "adverse", close: true, resolution: "Supervivencia con investigación" },
  "movilizacion-salva": { kind: "vacancy", polarity: "favorable", close: true, resolution: "Moción retirada" },
  "calle-no-responde": { kind: "vacancy", polarity: "adverse", close: true, resolution: "Vacancia aprobada" },
  "beneficio-penitenciario": { kind: "prison", polarity: "favorable", weightMetric: "appeal", close: true, resolution: "Libertad vigilada" },
  "apelacion-libera": { kind: "prison", polarity: "favorable", weightMetric: "appeal", close: true, resolution: "Apelación concedida" },
  "sentencia-firme": { kind: "prison", polarity: "adverse", weightMetric: "appeal", resolution: "Condena firme" },
  "retorno-con-garantias": { kind: "exile", polarity: "favorable", weightMetric: "legalPath", close: true, resolution: "Retorno con garantías" },
};

const OUTCOME_ADDITIONAL_CASE_PATCHES = {
  "beneficio-penitenciario": [{ kind: "trial", polarity: "favorable" }],
  "apelacion-libera": [{ kind: "trial", polarity: "favorable", applyPolarityEffects: false }],
  "informacion-insuficiente": [{ kind: "trial", polarity: "adverse" }],
  "sentencia-firme": [{ kind: "trial", polarity: "adverse", close: true, resolution: "Condena firme", resolutionTone: "danger" }],
};

const OUTCOME_CASE_EFFECTS = {
  "acusacion-ampliada": { trial: { evidence: 12, defense: -9, court: -5, media: 6 } },
  "caso-archivado": { trial: { evidence: -36, defense: 5, court: 20, media: -19 } },
  "allanamiento-fiscal": { trial: { evidence: 15, defense: -15, court: -11, media: 9 } },
  "prision-preventiva-orden": { trial: { evidence: 12, defense: -11, court: -16, media: 8 } },
  "oferta-rechazada": { trial: { evidence: 30, defense: -10, court: -27, media: 11 } },
  "condena-suspendida-juicio": { trial: { evidence: 18, defense: -14, court: -18, media: 8 } },
  "testigo-retira-version": { trial: { evidence: -34, defense: 7, court: 27, media: -21 } },
  "apelacion-denegada": { prison: { appeal: -24, outside: -3, family: -2 } },
  "informacion-insuficiente": { prison: { appeal: -24, outside: -5 }, trial: { evidence: 20, court: -16 } },
  "sucesor-rompe": { prison: { outside: -18, inside: -8 } },
  "retorno-bloqueado": { exile: { legalPath: -22, international: -5, resources: -3 } },
  "corte-rechaza-caso": { exile: { legalPath: -14, international: -8 } },
  "frente-elige-otro": { exile: { remote: -18, international: -3 } },
  "registro-celda": { prison: { appeal: -8, inside: -14, outside: -7 } },
  "dirigentes-renuncian": { prison: { outside: -17, inside: -5 } },
  "manuscrito-prision": { prison: { outside: 12, inside: 3, family: -2 } },
  "taller-funciona": { prison: { appeal: 3, inside: 8, family: 5 } },
  "red-penal-crece": { prison: { appeal: -9, outside: 8, inside: 15, family: -6 } },
  "partido-se-modera": { prison: { appeal: 2, outside: 9, family: 3 } },
  "base-cierra-filas": { prison: { appeal: -8, outside: 12, inside: 8, family: -3 } },
  "gira-exilio-crece": { exile: { international: 9, remote: 13, resources: -3 } },
  "red-propia-exilio": { exile: { international: -6, remote: 15, resources: 5 } },
  "gabinete-politico": { vacancy: { survival: 8, cabinet: -3, institutions: -5, street: -3 } },
  "leyes-aprobadas": { vacancy: { survival: 9, cabinet: -2, institutions: -7, street: -5 } },
  "mandos-respaldan-gobierno": { vacancy: { survival: 4, cabinet: -5, institutions: 6, street: -6 } },
  "mamanideos-votacion": { vacancy: { survival: -11, institutions: 8, street: 6 } },
  "mamanideos-votos": { vacancy: { survival: 12, cabinet: -3, institutions: -13, street: -9 } },
  "ninos-oposicion": { vacancy: { survival: -12, institutions: 8, street: 5 } },
  "ninos-votan": { vacancy: { survival: 11, cabinet: -2, institutions: -12, street: -8 } },
  "coalicion-se-rompe": { vacancy: { survival: -31, cabinet: -16, institutions: -15, street: -10 } },
  "calle-no-responde": { vacancy: { survival: -17, cabinet: -8, institutions: -6, street: -27 } },
};

const DISASTER_OUTCOME_PROFILES = {
  "nino-fondo-trazable": { polarity: "favorable", effects: { response: 4, trust: 11 } },
  "nino-almacenes-expuestos": { polarity: "favorable", effects: { response: 5, supplies: 5, trust: 9 } },
  "nino-mapa-obras": { polarity: "favorable", effects: { response: 3, trust: 11 } },
  "nino-ministro-renuncia": { polarity: "favorable", effects: { response: 3, trust: 11 } },
  "nino-acusacion-falsa": { polarity: "adverse", effects: { response: -3, trust: -15 } },
  "nino-contratos-vinculados": { polarity: "adverse", effects: { response: 3, supplies: 4, trust: -14 } },
  "nino-padrones-publicados": { polarity: "favorable", effects: { supplies: 3, trust: 9 } },
  "sismo-ley-publica": { polarity: "favorable", effects: { response: 5, trust: 10 } },
  "sismo-mapa-verificado": { polarity: "favorable", effects: { response: 4, trust: 11 } },
  "sismo-mapa-barrial": { polarity: "favorable", effects: { response: 5, trust: 7 } },
  "sequia-licencias-corregidas": { polarity: "favorable", effects: { severity: -2, response: 5, supplies: 4, trust: 7 } },
  "sequia-mapa-concesiones": { polarity: "favorable", effects: { response: 3, trust: 11 } },
  "incendios-red-tierras": { polarity: "favorable", effects: { response: 3, trust: 10 } },
  "incendios-documentos-tierras": { polarity: "favorable", effects: { response: 3, trust: 11 } },
  "incendios-registro-ocupantes": { polarity: "favorable", effects: { response: 3, trust: 9 } },
  "epidemia-control-concurrente": { polarity: "favorable", effects: { response: 5, supplies: 3, trust: 9 } },
  "epidemia-programa-util": { polarity: "favorable", effects: { response: 6, trust: 8 } },
  "epidemia-rumores-reducen": { polarity: "favorable", effects: { response: 3, trust: 10 } },
  "epidemia-plataforma-sanciona": { polarity: "neutral", effects: { severity: -2, response: 3, trust: 6 } },
  "derrame-arbitraje": { polarity: "neutral", effects: { response: -3, supplies: -4, trust: 1 } },
  "derrame-acuerdo-operativo": { polarity: "neutral", effects: { severity: -3, response: 8, supplies: 7, trust: -7 } },
  "derrame-censo-publicado": { polarity: "favorable", effects: { response: 3, trust: 10 } },
  "derrame-mapa-contaminacion": { polarity: "favorable", effects: { response: 4, trust: 11 } },
  "derrame-fondo-aprobado": { polarity: "favorable", effects: { response: 6, supplies: 4, trust: 8 } },
  "derrame-reportaje-nacional": { polarity: "favorable", effects: { response: 3, trust: 12 } },
  "derrame-agenda-comunal": { polarity: "favorable", effects: { response: 5, trust: 8 } },
  "derrame-monitoreo-ciudadano": { polarity: "favorable", effects: { response: 4, trust: 10 } },
};

function outcomePolarity(outcome) {
  const visible = outcome.effects ?? {};
  const hidden = outcome.hiddenEffects ?? {};
  const score = Number(visible.approval ?? 0) * 1.2
    + Number(visible.influence ?? 0) * 0.4
    - Number(visible.legalRisk ?? 0) * 0.9
    + Number(hidden.credibility ?? 0)
    + Number(hidden.governmentStability ?? 0) * 0.7
    + Number(hidden.regionalSupport ?? 0) * 0.4
    - Number(hidden.leakExposure ?? 0) * 0.5;
  return score >= 0 ? "favorable" : "adverse";
}

function mergeCaseEffects(...groups) {
  const merged = {};
  for (const group of groups.filter(Boolean)) {
    for (const [kind, effects] of Object.entries(group)) {
      merged[kind] ??= {};
      for (const [metric, delta] of Object.entries(effects ?? {})) {
        merged[kind][metric] = Number(merged[kind][metric] ?? 0) + Number(delta ?? 0);
      }
    }
  }
  return Object.keys(merged).length ? merged : undefined;
}

function validateSpecialCasePatches(events) {
  const countBy = (items) => items.reduce((counts, id) => counts.set(id, (counts.get(id) ?? 0) + 1), new Map());
  const eventCounts = countBy(events.map((event) => event.id));
  const optionCounts = countBy(events.flatMap((event) => event.options.map((option) => option.id)));
  const outcomeCounts = countBy(events.flatMap((event) => event.options.flatMap((option) => (option.outcomes ?? []).map((outcome) => outcome.id))));
  const assertExactlyOnce = (ids, counts, type) => {
    for (const id of ids) {
      if (counts.get(id) !== 1) throw new Error(`Parche de expediente sin ${type} único: ${id}.`);
    }
  };
  assertExactlyOnce([...Object.keys(EVENT_CASE_PATCHES), ...Object.keys(NATIONAL_EMERGENCY_CASES)], eventCounts, "evento");
  assertExactlyOnce([...new Set([...Object.keys(OPTION_CASE_EFFECTS), ...MATERIAL_AID_OPTION_IDS])], optionCounts, "opción");
  assertExactlyOnce([...new Set([
    ...Object.keys(OUTCOME_CASE_PATCHES),
    ...Object.keys(OUTCOME_ADDITIONAL_CASE_PATCHES),
    ...Object.keys(OUTCOME_CASE_EFFECTS),
    ...Object.keys(DISASTER_OUTCOME_PROFILES),
  ])], outcomeCounts, "resultado");

  const assertDescriptor = (descriptor, label) => {
    const definition = SPECIAL_CASE_DEFINITIONS[descriptor?.kind];
    if (!definition) throw new Error(`${label} usa un tipo de expediente inexistente.`);
    if (descriptor.weightMetric && !definition.metrics.some((metric) => metric.id === descriptor.weightMetric)) {
      throw new Error(`${label} pondera una métrica inexistente: ${descriptor.weightMetric}.`);
    }
  };
  for (const [eventId, descriptors] of Object.entries(EVENT_CASE_PATCHES)) {
    descriptors.forEach((descriptor, index) => assertDescriptor(descriptor, `Evento ${eventId}[${index}]`));
  }
  for (const [outcomeId, descriptor] of Object.entries(OUTCOME_CASE_PATCHES)) assertDescriptor(descriptor, `Resultado ${outcomeId}`);
  for (const [outcomeId, descriptors] of Object.entries(OUTCOME_ADDITIONAL_CASE_PATCHES)) {
    descriptors.forEach((descriptor, index) => assertDescriptor(descriptor, `Resultado adicional ${outcomeId}[${index}]`));
  }
  const effectGroups = [...Object.entries(OPTION_CASE_EFFECTS), ...Object.entries(OUTCOME_CASE_EFFECTS)];
  for (const [payloadId, groups] of effectGroups) {
    for (const [kind, effects] of Object.entries(groups)) {
      const definition = SPECIAL_CASE_DEFINITIONS[kind];
      if (!definition) throw new Error(`Efectos de ${payloadId} usan un expediente inexistente: ${kind}.`);
      for (const metric of Object.keys(effects)) {
        if (!definition.metrics.some((entry) => entry.id === metric)) throw new Error(`Efectos de ${payloadId} usan una métrica inexistente: ${kind}.${metric}.`);
      }
    }
  }
  for (const [outcomeId, profile] of Object.entries(DISASTER_OUTCOME_PROFILES)) {
    for (const metric of Object.keys(profile.effects)) {
      if (!SPECIAL_CASE_DEFINITIONS.disaster.metrics.some((entry) => entry.id === metric)) throw new Error(`Perfil de ${outcomeId} usa una métrica inexistente: ${metric}.`);
    }
  }
}

export function applySpecialCaseCausality(events) {
  validateSpecialCasePatches(events);
  return events.map((event) => {
    const descriptors = [...(EVENT_CASE_PATCHES[event.id] ?? [])];
    if (NATIONAL_EMERGENCY_CASES[event.id]) {
      descriptors.push({ kind: "disaster", variant: event.id, stage: { current: 1, total: 3, label: "Impacto inicial" } });
    }
    const options = event.options.map((option) => ({
      ...option,
      caseEffects: OPTION_CASE_EFFECTS[option.id] ?? option.caseEffects,
      caseMaterialAid: option.caseMaterialAid === true || MATERIAL_AID_OPTION_IDS.has(option.id) ? true : undefined,
      outcomes: option.outcomes?.map((outcome) => {
        let caseOutcome = OUTCOME_CASE_PATCHES[outcome.id] ?? outcome.caseOutcome;
        const disasterProfile = NATIONAL_EMERGENCY_CASES[event.id] ? DISASTER_OUTCOME_PROFILES[outcome.id] : null;
        if (!caseOutcome && NATIONAL_EMERGENCY_CASES[event.id]) {
          caseOutcome = {
            kind: "disaster",
            variant: event.id,
            polarity: disasterProfile?.polarity ?? outcomePolarity(outcome),
            applyPolarityEffects: !disasterProfile,
          };
        }
        if (!caseOutcome && outcome.electionWon !== undefined) {
          caseOutcome = { kind: "campaign", polarity: outcome.electionWon ? "favorable" : "adverse", close: true, resolution: outcome.electionWon ? "Victoria electoral" : "Derrota electoral" };
        }
        const additionalOutcomes = OUTCOME_ADDITIONAL_CASE_PATCHES[outcome.id] ?? [];
        const caseOutcomes = caseOutcome ? [caseOutcome, ...additionalOutcomes] : additionalOutcomes;
        const disasterEffects = disasterProfile ? { disaster: disasterProfile.effects } : null;
        return {
          ...outcome,
          caseEffects: mergeCaseEffects(outcome.caseEffects, OUTCOME_CASE_EFFECTS[outcome.id], disasterEffects),
          caseOutcome,
          caseOutcomes: caseOutcomes.length ? caseOutcomes : undefined,
        };
      }),
    }));
    return { ...event, caseKinds: descriptors.length ? descriptors : event.caseKinds, options };
  });
}

const activeLife = { missingTag: ["en-prision", "en-exilio", "arresto-domiciliario"] };

export const statConsequenceEvents = [
  {
    id: "fractura-altos-mandos", maxOccurrences: 1, forced: true, priority: 75, weight: 100, group: "crisis-militar", groupCooldown: 2,
    requirements: { all: [{ age: { min: 35, max: 69 } }, { hasTag: "presidente-actual" }, { hidden: "armedForcesSupport", max: 45 }] }, category: "presidency",
    title: "Los altos mandos toman distancia", kicker: "Control civil · una cadena de mando debilitada",
    description: "Tres comandantes cuestionan decisiones del Gobierno y aplazan una ceremonia oficial. El desacuerdo todavía es institucional, pero la oposición ya habla de una ruptura dentro del Estado.",
    options: [
      { id: "relevo-mandos-institucional", label: "Relevar mandos con un proceso institucional", hint: "Control civil · transición sensible", effects: { approval: 3 }, hiddenEffects: { armedForcesSupport: 8, governmentStability: 6, credibility: 7 }, outcomes: [
        { id: "relevo-militar-ordenado", weight: 66, weightModifiers: [{ when: { hidden: "governmentStability", min: 52 }, multiply: 1.4 }, { when: { hidden: "internationalReputation", min: 55 }, multiply: 1.15 }], headline: "El relevo respeta la cadena de mando", text: "Los nuevos comandantes reconocen la autoridad civil y publican el cronograma de transición.", hiddenEffects: { armedForcesSupport: 11, vacancyRisk: -7 } },
        { id: "comunicado-mandos-rebeldes", weight: 34, weightModifiers: [{ when: { hidden: "armedForcesSupport", max: 25 }, multiply: 2.1 }], headline: "Los mandos salientes publican un comunicado desafiante", text: "La disputa deja de ser reservada y obliga al Congreso a convocar a los ministros responsables.", effects: { approval: -10 }, hiddenEffects: { armedForcesSupport: -16, governmentStability: -13, vacancyRisk: 12 }, addCrises: [{ id: "fractura-militar", label: "Fractura con los altos mandos" }] },
      ] },
      { id: "concesiones-mandos", label: "Conceder presupuesto y nombramientos", hint: "Recupera respaldo · debilita el control civil", effects: { influence: 4 }, hiddenEffects: { armedForcesSupport: 22, cabinetLoyalty: -7, credibility: -9, leakExposure: 8 }, nationalEffects: { deficit: 1 }, addFavors: [{ id: "concesiones-militares", label: "Concesiones reservadas a los altos mandos" }], outcomes: [
        { id: "mandos-respaldan-gobierno", weight: 72, headline: "Los comandantes vuelven a respaldar públicamente al Gobierno", text: "La crisis inmediata termina, aunque las concesiones condicionarán futuras decisiones." },
        { id: "concesiones-militares-filtradas", weight: 28, weightModifiers: [{ when: { hidden: "leakExposure", min: 60 }, multiply: 1.8 }], headline: "Se filtra la lista de concesiones a los mandos", text: "Ascensos y compras reservadas convierten la tregua en un nuevo escándalo.", effects: { approval: -13, legalRisk: 7 }, hiddenEffects: { governmentStability: -8 }, addScandals: [{ id: "concesiones-altos-mandos", label: "Concesiones reservadas a altos mandos" }] },
      ] },
      { id: "control-civil-congreso", label: "Pedir supervisión pública del Congreso", hint: "Contrapesos · cede iniciativa política", effects: { influence: -4, approval: 5 }, hiddenEffects: { congressSupport: 7, credibility: 10, armedForcesSupport: -3 }, outcomes: [{ id: "audiencia-control-civil", weight: 100, headline: "Una audiencia pública reafirma el control civil", text: "El Congreso escucha a los mandos y fija límites sin convertir la discrepancia en una negociación secreta.", hiddenEffects: { governmentStability: 8, vacancyRisk: -8 } }] },
    ],
  },
  {
    id: "cerco-mediatico", repeatable: true, cooldown: 7, maxOccurrences: 2, weight: 18, group: "media", groupCooldown: 3,
    requirements: { all: [{ age: { min: 30, max: 69 } }, { hidden: "pressSupport", max: 32 }, { hidden: "mediaNotoriety", min: 35 }, activeLife] }, category: "media",
    title: "Los principales medios cierran filas", kicker: "Portadas hostiles · tu versión ya no abre los noticieros",
    description: "Editoriales y programas repiten que ocultas información. Parte de la cobertura responde a tus propios ataques; otra parte se apoya en documentos que todavía no has explicado.",
    options: [
      { id: "abrir-archivo-prensa", label: "Abrir documentos y aceptar una entrevista extensa", hint: "Transparencia · preguntas sin control", effects: { cleanMoney: -5000 }, hiddenEffects: { credibility: 10, pressSupport: 12, leakExposure: -6 }, outcomes: [
        { id: "prensa-corrige-cobertura", weight: 58, weightModifiers: [{ when: { hidden: "credibility", min: 60 }, multiply: 1.5 }, { when: { hidden: "personalReputation", min: 60 }, multiply: 1.2 }], headline: "Dos medios corrigen parte de la cobertura", text: "Los documentos contradicen una acusación y obligan a separar hechos de opinión.", effects: { approval: 7 }, hiddenEffects: { pressSupport: 9 } },
        { id: "entrevista-abre-flancos", weight: 42, weightModifiers: [{ when: { hidden: "leakExposure", min: 60 }, multiply: 1.5 }], headline: "La entrevista revela nuevas contradicciones", text: "Una respuesta improvisada conecta fechas que tus abogados preferían mantener separadas.", effects: { approval: -10, legalRisk: 6 }, hiddenEffects: { pressSupport: -5, leakExposure: 9 } },
      ] },
      { id: "transmision-sin-medios", label: "Responder directamente en tus propias plataformas", hint: "Control del mensaje · mayor polarización", effects: { influence: 5 }, hiddenEffects: { mediaNotoriety: 10, pressSupport: -7, polarization: 8 }, outcomes: [
        { id: "audiencia-salta-medios", weight: 57, weightModifiers: [{ when: { hidden: "mediaNotoriety", min: 65 }, multiply: 1.4 }], headline: "La transmisión supera a los noticieros", text: "Tu base escucha la versión completa y vuelve a movilizarse.", effects: { approval: 6 } },
        { id: "respuesta-sin-preguntas", weight: 43, weightModifiers: [{ when: { hidden: "credibility", max: 38 }, multiply: 1.5 }], headline: "La transmisión parece una defensa sin preguntas", text: "Los fragmentos más débiles regresan a los mismos medios que intentabas evitar.", effects: { approval: -8 }, hiddenEffects: { credibility: -6 } },
      ] },
      { id: "comprar-portadas", label: "Comprar portadas mediante un intermediario", hint: "Alivio inmediato · rastro financiero", effects: { dirtyMoney: -18000, legalRisk: 7 }, hiddenEffects: { pressSupport: 9, leakExposure: 13, credibility: -8 }, outcomes: [
        { id: "portadas-cambian-tono", weight: 64, headline: "Las portadas cambian de tono durante varias semanas", text: "La cobertura se suaviza sin explicar el giro editorial." },
        { id: "tarifario-portadas-filtrado", weight: 36, weightModifiers: [{ when: { hidden: "leakExposure", min: 55 }, multiply: 1.6 }], headline: "Un tarifario revela pagos por cobertura", text: "Mensajes y facturas convierten el cerco mediático en una investigación sobre tus propios métodos.", effects: { approval: -15, legalRisk: 14 }, hiddenEffects: { pressSupport: -16 }, addScandals: [{ id: "compra-portadas", label: "Compra encubierta de portadas" }], addInvestigations: [{ id: "pagos-medios", label: "Investigación por pagos encubiertos a medios" }] },
      ] },
    ],
  },
  {
    id: "patrimonio-inexplicable", maxOccurrences: 1, weight: 22, group: "justicia", groupCooldown: 3,
    requirements: { all: [{ age: { min: 30, max: 69 } }, { any: [{ hidden: "undeclaredWealth", min: 35000 }, { stat: "dirtyMoney", min: 100000 }] }, activeLife] }, category: "investigation",
    title: "Tu patrimonio ya no coincide con tus ingresos", kicker: "Propiedades, préstamos y una declaración incompleta",
    description: "Una revisión cruza inmuebles, vehículos y movimientos de personas cercanas. La diferencia todavía puede corregirse, pero cada explicación abre nuevas preguntas.",
    options: [
      { id: "rectificar-patrimonio", label: "Rectificar la declaración y pagar lo pendiente", hint: "Costo limpio · reduce exposición", effects: { cleanMoney: -28000, legalRisk: -6, approval: 3 }, hiddenEffects: { undeclaredWealth: -80000, credibility: 10, leakExposure: -8, prosecutionRelation: 5 }, outcomes: [{ id: "patrimonio-rectificado", weight: 100, headline: "La rectificación cierra la inconsistencia administrativa", text: "Pagas una sanción y publicas el origen de los bienes antes de que aparezca una acusación penal." }] },
      { id: "prestamo-familiar-ficticio", label: "Presentar un préstamo familiar retroactivo", hint: "Conserva bienes · documentos vulnerables", effects: { dirtyMoney: -18000, legalRisk: 11 }, hiddenEffects: { undeclaredWealth: -18000, familyStress: 9, leakExposure: 15, credibility: -9 }, outcomes: [
        { id: "prestamo-familiar-aceptado", weight: 46, headline: "La explicación patrimonial supera la primera revisión", text: "El expediente queda archivado provisionalmente, aunque tu familia deberá sostener la misma versión." },
        { id: "firmas-prestamo-inconsistentes", weight: 54, weightModifiers: [{ when: { hidden: "undeclaredWealth", min: 70000 }, multiply: 1.5 }, { when: { hidden: "leakExposure", min: 60 }, multiply: 1.4 }], headline: "Las firmas del préstamo pertenecen a fechas distintas", text: "El documento agrava la revisión y Fiscalía incorpora a dos familiares.", effects: { approval: -13, legalRisk: 22 }, hiddenEffects: { prosecutionRelation: -10 }, addScandals: [{ id: "prestamo-patrimonial-falso", label: "Préstamo familiar usado para justificar patrimonio" }], addInvestigations: [{ id: "desbalance-patrimonial", label: "Investigación por desbalance patrimonial" }] },
      ] },
      { id: "transferir-bienes-tercero", label: "Transferir bienes a una persona de confianza", hint: "Oculta patrimonio · crea un futuro testigo", effects: { legalRisk: 12 }, hiddenEffects: { undeclaredWealth: -35000, leakExposure: 20, personalReputation: -8 }, addFavors: [{ id: "testaferro-patrimonial", label: "Bienes transferidos a una persona de confianza" }], outcomes: [{ id: "bienes-fuera-declaracion", weight: 62, headline: "Los bienes desaparecen de la siguiente declaración", text: "La revisión pierde una pista inmediata y otra persona obtiene control legal sobre tu patrimonio." }, { id: "testaferro-entrega-escrituras", weight: 38, weightModifiers: [{ when: { hidden: "personalReputation", max: 35 }, multiply: 1.4 }], headline: "La persona de confianza entrega las escrituras", text: "El intento de ocultamiento se convierte en prueba documental.", effects: { approval: -16, legalRisk: 28 }, hiddenEffects: { prosecutionRelation: -12 }, addInvestigations: [{ id: "testaferro-patrimonial", label: "Investigación por bienes transferidos a terceros" }] }] },
    ],
  },
];

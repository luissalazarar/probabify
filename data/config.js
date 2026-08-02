export const GAME_CONFIG = {
  name: "Probabify",
  subtitle: "Tu carrera política en el Perú",
  minAge: 18,
  maxAge: 70,
  currency: "S/",
  random: {
    queryParameter: "seed",
  },
  stats: {
    approval: { label: "Aceptación", min: 0, max: 100, format: "percent", icon: "♥" },
    influence: { label: "Influencia", min: 0, max: 100, format: "percent", icon: "◆" },
    cleanMoney: { label: "Dinero limpio", format: "money", icon: "S/" },
    dirtyMoney: { label: "Dinero sucio", format: "money", icon: "S/" },
    legalRisk: { label: "Riesgo judicial", min: 0, max: 100, format: "percent", icon: "⚖" },
  },
};

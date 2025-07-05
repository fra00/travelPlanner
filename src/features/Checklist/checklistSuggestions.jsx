const suggestions = {
  base: [
    "Documenti (Carta d'identità, Passaporto, Patente)",
    "Biglietti (aerei, treni, etc.)",
    "Prenotazioni hotel/alloggi",
    "Caricabatterie per telefono",
    "Spazzolino e dentifricio",
    "Medicine personali",
    "Kit di primo soccorso (cerotti, disinfettante...)",
    "Occhiali da sole",
    "Adattatore di corrente (se necessario)",
  ],
  byType: {
    Mare: [
      "Costume da bagno",
      "Crema solare",
      "Telo da mare",
      "Ciabatte/infradito",
      "Doposole",
      "Cappello per il sole",
    ],
    Montagna: [
      "Scarpe da trekking",
      "Giacca a vento/impermeabile",
      "Maglione/pile",
      "Zaino da escursione",
      "Borraccia",
      "Crema solare", // La crema solare è importante anche in montagna
    ],
    Città: [
      "Scarpe comode per camminare",
      "Zainetto/borsa per il giorno",
      "Guida turistica o app di mappe offline",
      "Abbigliamento a strati",
    ],
    Avventura: [
      "Kit di primo soccorso completo",
      "Coltellino multiuso",
      "Torcia frontale",
      "Bussola o GPS",
      "Barrette energetiche",
    ],
  },
  byDuration: [
    {
      minDays: 3,
      items: ["Caricabatterie portatile (Power Bank)"],
    },
    {
      minDays: 5,
      items: ["Sapone/shampoo da viaggio"],
    },
    {
      minDays: 7,
      items: ["Quantità sufficiente di vestiti per una settimana"],
    },
  ],
};

export const generateChecklistSuggestions = (tripTypes = [], duration) => {
  const finalSuggestions = new Set(suggestions.base);

  tripTypes.forEach((tripType) => {
    (suggestions.byType[tripType] || []).forEach((item) =>
      finalSuggestions.add(item)
    );
  });

  suggestions.byDuration.forEach((rule) => {
    if (duration >= rule.minDays) {
      rule.items.forEach((item) => finalSuggestions.add(item));
    }
  });

  return Array.from(finalSuggestions);
};

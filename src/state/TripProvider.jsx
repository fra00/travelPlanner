import React, { createContext, useReducer, useEffect } from "react";
import { tripReducer, initialState } from "./TripContext";

export const TripContext = createContext();

export const TripProvider = ({ children }) => {
  // Carica lo stato iniziale da localStorage o usa lo stato di default
  const [state, dispatch] = useReducer(tripReducer, initialState, (initial) => {
    const localData = localStorage.getItem("tripData");
    if (localData) {
      try {
        const parsedData = JSON.parse(localData);
        // Unisci i dati salvati con lo stato iniziale per garantire
        // che tutte le chiavi, specialmente quelle nuove, siano presenti.
        // Questo previene errori se la struttura dello stato cambia.
        return {
          ...initial,
          ...parsedData,
          // Assicura che l'oggetto 'fuel' sia unito e non sostituito
          fuel: {
            ...initial.fuel,
            ...(parsedData.fuel || {}),
          },
        };
      } catch (e) {
        console.error("Errore nel parsing dei dati dal localStorage", e);
        // In caso di errore, ritorna lo stato iniziale per evitare crash.
        return initial;
      }
    }
    return initial;
  });

  // Salva lo stato in localStorage ogni volta che cambia
  useEffect(() => {
    localStorage.setItem("tripData", JSON.stringify(state));
  }, [state]);

  return (
    <TripContext.Provider value={{ state, dispatch }}>
      {children}
    </TripContext.Provider>
  );
};

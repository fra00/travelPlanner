import React, {
  createContext,
  useReducer,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { tripReducer, initialState } from "./TripContext";
import { useAuth } from "../features/Auth/AuthProvider";
import {
  addTripParticipant,
  removeTripParticipant,
} from "../utils/supabaseClient";

// Custom hook per ottenere il valore precedente di una prop o dello stato
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

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

  const { user } = useAuth();
  const prevParticipants = usePrevious(state.participants);

  // Effetto per sincronizzare i partecipanti con Supabase
  useEffect(() => {
    // Esegui solo se l'utente è loggato, il viaggio ha un ID e la lista dei partecipanti è cambiata.
    if (!user || !state.tripId || !prevParticipants) {
      return;
    }

    const currentIds = new Set(state.participants.map((p) => p.id));
    const prevIds = new Set(prevParticipants.map((p) => p.id));

    const syncChanges = async () => {
      // Trova partecipanti aggiunti
      for (const id of currentIds) {
        if (!prevIds.has(id)) {
          console.log(`Aggiungo partecipante: ${id} al viaggio ${state.tripId}`);
          const { error } = await addTripParticipant(state.tripId, id);
          if (error) {
            console.error("Errore aggiunta partecipante:", error.message);
            // TODO: Notificare l'utente dell'errore
          }
        }
      }

      // Trova partecipanti rimossi
      for (const id of prevIds) {
        if (!currentIds.has(id)) {
          console.log(`Rimuovo partecipante: ${id} dal viaggio ${state.tripId}`);
          const { error } = await removeTripParticipant(state.tripId, id);
          if (error) {
            console.error("Errore rimozione partecipante:", error.message);
            // TODO: Notificare l'utente dell'errore
          }
        }
      }
    };

    if (currentIds.size !== prevIds.size || ![...currentIds].every(id => prevIds.has(id))) {
        syncChanges();
    }
  }, [state.participants, state.tripId, user, prevParticipants]);

  return (
    <TripContext.Provider value={{ state, dispatch }}>
      {children}
    </TripContext.Provider>
  );
};

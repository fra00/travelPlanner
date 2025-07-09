import React, {
  createContext,
  useReducer,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { tripReducer, initialState } from "./TripContext";
export { initialState } from "./TripContext";
import { useAuth } from "../features/Auth/AuthProvider";
import {
  addTripParticipant,
  removeTripParticipant,
} from "../utils/supabaseClient";
import { saveLocalTrip } from "../utils/db";

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
  const [state, dispatch] = useReducer(tripReducer, initialState);

  const { user } = useAuth();
  const prevParticipants = usePrevious(state.participants);

  // Salva lo stato in IndexedDB per gli utenti non loggati
  useEffect(() => {
    // Salva solo se non c'è un utente e il viaggio ha un ID locale
    if (!user && state.localId && state.isPlanningStarted) {
      saveLocalTrip(state).catch((err) => {
        console.error("Errore nel salvataggio locale del viaggio:", err);
      });
    }
  }, [state, user]);

  // Effetto per sincronizzare i partecipanti con Supabase
  useEffect(() => {
    // Esegui solo se l'utente è loggato, il viaggio ha un ID e la lista dei partecipanti è cambiata.
    if (!user || !state.tripId || !prevParticipants) {
      return;
    }

    const currentIds = new Set(state.participants.map((p) => p.id));
    const prevIds = new Set(prevParticipants.map((p) => p.id));

    const syncChanges = async () => {
      const addedParticipants = state.participants.filter(
        (p) => !prevIds.has(p.id)
      );

      for (const participant of addedParticipants) {
        // Aggiungi solo partecipanti con un UUID valido (utenti registrati)
        // e che non siano il proprietario del viaggio (già aggiunto dal trigger).
        if (participant.id !== user.id && !participant.id.startsWith("p_")) {
          console.log(
            `Aggiungo partecipante: ${participant.id} al viaggio ${state.tripId}`
          );
          const { error } = await addTripParticipant(state.tripId, participant.id);
          if (error) console.error("Errore aggiunta partecipante:", error.message);
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

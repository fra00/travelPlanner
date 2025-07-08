import React, { useContext, useState } from "react";
import { TripContext } from "../../state/TripProvider";
import { useAuth } from "../Auth/AuthProvider";
import {
  UPDATE_OVERVIEW,
  UPDATE_PARTICIPANTS,
  RESET_DATA,
} from "../../state/actions";
import FormInput from "../../components/ui/FormInput";
import ParticipantManager from "../Setup/ParticipantManager";
import Button from "../../components/ui/Button";
import { TRIP_TYPES } from "../../utils/constants";
import CheckboxGroup from "../../components/ui/CheckboxGroup";
import { FaPen } from "react-icons/fa";

function Overview() {
  const { state, dispatch } = useContext(TripContext);
  const { user } = useAuth();

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const payloadValue = type === "number" ? parseInt(value, 10) || 0 : value;
    dispatch({
      type: UPDATE_OVERVIEW,
      payload: { [name]: payloadValue },
    });
  };

  const handleTripTypesChange = (newTripTypes) => {
    dispatch({
      type: UPDATE_OVERVIEW,
      payload: {
        // Assicura che ci sia sempre almeno "Generico" se l'utente deseleziona tutto
        tripTypes: newTripTypes.length > 0 ? newTripTypes : [TRIP_TYPES[0]],
      },
    });
  };

  const handleParticipantsChange = (newParticipants) => {
    dispatch({
      type: UPDATE_PARTICIPANTS,
      payload: { participants: newParticipants },
    });
  };

  const handleReset = () => {
    if (
      window.confirm(
        "Sei sicuro di voler cancellare tutti i dati del viaggio? L'azione è irreversibile."
      )
    ) {
      dispatch({ type: RESET_DATA });
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-4 border rounded bg-gray-50 space-y-4">
        <h2 className="text-xl font-semibold mb-2">Panoramica Viaggio</h2>
        <CheckboxGroup
          label="Tipo di Viaggio (max 3):"
          options={TRIP_TYPES}
          selectedOptions={state.tripTypes || [TRIP_TYPES[0]]}
          onChange={handleTripTypesChange}
          maxSelections={3}
          description="Modifica le categorie del viaggio per personalizzare i suggerimenti della checklist."
        />
        <FormInput
          label={
            <span className="flex items-center">
              <FaPen className="mr-2 text-gray-400" /> Nome del Viaggio: <span className="text-red-500 ml-1">*</span>
            </span>
          }
          id="description"
          name="description"
          value={state.description}
          onChange={handleChange}
          placeholder="Es. Avventura in Scozia"
          description="Puoi cambiare il nome del tuo viaggio in qualsiasi momento."
        />
      </div>

      <div className="p-4 border rounded bg-gray-50 space-y-4">
        <h2 className="text-xl font-semibold mb-2">
          Gestisci Partecipanti <span className="text-red-500 ml-1">*</span>
        </h2>
        <ParticipantManager
          participants={state.participants.map((p) => ({
            ...p,
            name: p.name || p.email,
          }))}
          onParticipantsChange={handleParticipantsChange}
        />
        <p className="mt-2 text-xs text-gray-500">
          Aggiungi o rimuovi partecipanti. Se sei loggato, puoi aggiungerli tramite email per condividere il piano.
        </p>
        {!user && (
          <p className="text-sm text-gray-600 mt-2">
            * Per salvare permanentemente il tuo viaggio e accedervi da altri dispositivi, effettua il login.
          </p>
        )}
      </div>

      <div className="p-4 border rounded bg-red-50 border-red-200 space-y-4">
        <h2 className="text-xl font-semibold text-red-800">Area Pericolosa</h2>
        <p className="text-sm text-red-700">
          Cancellando i dati, l'intero piano di viaggio verrà rimosso e non
          potrà essere recuperato. Verrai riportato alla schermata iniziale.
        </p>
        <Button variant="danger" onClick={handleReset}>
          Cancella Tutti i Dati del Viaggio
        </Button>
      </div>
    </div>
  );
}

export default Overview;

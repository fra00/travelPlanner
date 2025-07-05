import React, { useContext } from "react";
import { TripContext } from "../../state/TripProvider";
import {
  UPDATE_OVERVIEW,
  UPDATE_PARTICIPANTS,
  RESET_DATA,
} from "../../state/actions";
import FormInput from "../../components/ui/FormInput";
import FormTextArea from "../../components/ui/FormTextArea";
import ParticipantManager from "../Setup/ParticipantManager";
import Button from "../../components/ui/Button";
import { TRIP_TYPES } from "../../utils/constants";
import CheckboxGroup from "../../components/ui/CheckboxGroup";

function Overview() {
  const { state, dispatch } = useContext(TripContext);

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
        />
        <FormTextArea
          label="Descrizione del Viaggio:"
          id="description"
          name="description"
          rows="3"
          value={state.description}
          onChange={handleChange}
          placeholder="Descrizione generale del viaggio..."
        />
      </div>

      <div className="p-4 border rounded bg-gray-50 space-y-4">
        <h2 className="text-xl font-semibold mb-2">Partecipanti</h2>
        <ParticipantManager
          participants={state.participants}
          onParticipantsChange={handleParticipantsChange}
        />
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

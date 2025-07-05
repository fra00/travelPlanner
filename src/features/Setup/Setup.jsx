import React, { useState, useContext } from "react";
import { TripContext } from "../../state/TripProvider";
import { START_PLANNING } from "../../state/actions";
import Button from "../../components/ui/Button";
import ParticipantManager from "./ParticipantManager";
import DataManager from "../Data/DataManager";
import { TRIP_TYPES } from "../../utils/constants";
import CheckboxGroup from "../../components/ui/CheckboxGroup";

function Setup() {
  const { dispatch } = useContext(TripContext);
  const [participants, setParticipants] = useState([
    { id: `p_${Date.now()}`, name: "Partecipante 1" },
  ]);
  const [tripTypes, setTripTypes] = useState([TRIP_TYPES[0]]);

  const handleStart = () => {
    if (participants.length > 0) {
      dispatch({
        type: START_PLANNING,
        payload: {
          participants,
          // Assicura che ci sia sempre almeno "Generico" se l'utente deseleziona tutto
          tripTypes: tripTypes.length > 0 ? tripTypes : [TRIP_TYPES[0]],
        },
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="p-6 border rounded-xl bg-blue-50 border-blue-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">
          Inizia un nuovo viaggio
        </h2>
        <div className="space-y-4">
          <CheckboxGroup
            label="Tipo di Viaggio (max 3):"
            options={TRIP_TYPES}
            selectedOptions={tripTypes}
            onChange={setTripTypes}
            maxSelections={3}
          />
          <h3 className="text-lg font-semibold text-slate-700">
            Aggiungi i partecipanti
          </h3>
          <ParticipantManager
            participants={participants}
            onParticipantsChange={setParticipants}
          />
        </div>
        <div className="mt-6">
          <Button onClick={handleStart} className="w-full">
            Inizia Pianificazione
          </Button>
        </div>
      </div>
      <div className="text-center">
        <span className="text-gray-500">oppure</span>
      </div>
      <div>
        <DataManager />
      </div>
    </div>
  );
}

export default Setup;

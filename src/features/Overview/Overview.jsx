import React, { useContext } from "react";
import { TripContext } from "../../state/TripProvider";
import { useAuth } from "../Auth/AuthProvider";
import {
  UPDATE_OVERVIEW,
  UPDATE_PARTICIPANTS,
  LOAD_DATA,
} from "../../state/actions";
import FormInput from "../../components/ui/FormInput";
import ParticipantManager from "../Setup/ParticipantManager";
import { TRIP_TYPES } from "../../utils/constants";
import CheckboxGroup from "../../components/ui/CheckboxGroup";
import { FaPen, FaGlobeAmericas, FaCrown } from "react-icons/fa";
import Button from "../../components/ui/Button";
import { saveTrip } from "../../utils/supabaseClient";
import toast from "react-hot-toast";

function Overview() {
  const { state, dispatch } = useContext(TripContext);
  const { user } = useAuth();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const payloadValue =
      type === "checkbox"
        ? checked
        : type === "number"
        ? parseInt(value, 10) || 0
        : value;
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

  const handleBecomeOwner = async () => {
    if (!user) return;

    const newParticipants = [...state.participants];
    const ownerIsParticipant = newParticipants.some((p) => p.id === user.id);

    if (!ownerIsParticipant) {
      const participantIndex = newParticipants.findIndex(
        (p) => p.email === user.email
      );
      if (participantIndex > -1) {
        // Aggiorna l'ID del partecipante esistente con l'ID cloud
        newParticipants[participantIndex] = {
          ...newParticipants[participantIndex],
          id: user.id,
        };
      } else {
        // Aggiungi il nuovo proprietario come partecipante
        newParticipants.push({ id: user.id, name: user.email, email: user.email });
      }
    }

    const tripToSave = { ...state, ownerId: user.id, participants: newParticipants };

    toast.loading("Salvataggio in corso...");
    try {
      // `saveTrip` gestisce sia la creazione che l'aggiornamento
      const { data: savedTrip, error } = await saveTrip(user.id, tripToSave, state.tripId);
      if (error) throw error;

      // Ricarica i dati dal DB per avere uno stato consistente
      const newTripData = { ...savedTrip.trip_data, tripId: savedTrip.id, ownerId: savedTrip.user_id, isPublic: savedTrip.is_public };
      dispatch({ type: LOAD_DATA, payload: newTripData });

      toast.dismiss();
      toast.success("Sei diventato il proprietario e il viaggio è stato salvato sul cloud!");
    } catch (err) {
      toast.dismiss();
      toast.error(err.message || "Errore durante il salvataggio.");
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
        {user && state.ownerId === user.id && (
          <div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2 flex items-center">
              <FaGlobeAmericas className="mr-2 text-gray-400" />
              Visibilità
            </h3>
            <div className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg">
              <input
                type="checkbox"
                id="is-public-checkbox-overview"
                name="isPublic"
                checked={state.isPublic || false}
                onChange={handleChange}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded mt-1"
              />
              <div>
                <label htmlFor="is-public-checkbox-overview" className="block text-sm font-medium text-gray-900">Rendi viaggio pubblico</label>
                <p className="text-xs text-gray-500">Selezionando questa opzione, il tuo viaggio (senza documenti o checklist) sarà visibile ad altri utenti.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {user && !state.ownerId && (
        <div className="p-4 border rounded bg-yellow-50 text-yellow-800">
          <h3 className="font-semibold flex items-center"><FaCrown className="mr-2"/> Reclama Proprietà Viaggio</h3>
          <p className="text-sm my-2">
            Questo viaggio è stato caricato da un file e non ha un proprietario.
            Reclamalo per poterlo salvare sul tuo account e gestirlo.
          </p>
          <Button onClick={handleBecomeOwner} variant="secondary">
            Diventa proprietario
          </Button>
        </div>
      )}

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
    </div>
  );
}

export default Overview;

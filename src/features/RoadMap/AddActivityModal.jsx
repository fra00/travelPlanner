import React, { useState, useContext } from "react";
import { TripContext } from "../../state/TripProvider";
import { UPDATE_DAY_DETAILS } from "../../state/actions";
import FormInput from "../../components/ui/FormInput";
import Button from "../../components/ui/Button";

function AddActivityModal({ isOpen, onClose, day }) {
  const { dispatch } = useContext(TripContext);
  const [description, setDescription] = useState("");
  const [mapLink, setMapLink] = useState("");

  // Resetta il form quando la modale si apre
  // I React Hooks devono essere chiamati incondizionatamente ad ogni render.
  // Spostato prima del return condizionale per rispettare le Regole degli Hooks.
  React.useEffect(() => {
    if (isOpen) {
      setDescription("");
      setMapLink("");
    }
  }, [isOpen]);

  if (!isOpen || !day) return null;

  const handleAddActivity = () => {
    if (description.trim() === "") {
      alert("Inserisci una descrizione per l'attività.");
      return;
    }
    const newActivity = {
      id: `act_${Date.now()}`,
      description,
      mapLink,
    };
    const updatedActivities = [...day.activities, newActivity];
    dispatch({
      type: UPDATE_DAY_DETAILS,
      payload: { dayId: day.id, details: { activities: updatedActivities } },
    });
    setDescription("");
    setMapLink("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          Aggiungi Attività al Giorno {day.id.split("_")[1]}
        </h2>
        <div className="space-y-4">
          <FormInput
            label="Descrizione"
            id="activity-modal-description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Es. Visita al Colosseo"
          />
          <FormInput
            label="Link Mappa (opzionale)"
            id="activity-modal-maplink"
            type="text"
            value={mapLink}
            onChange={(e) => setMapLink(e.target.value)}
            placeholder="https://maps.app.goo.gl/..."
          />
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <Button variant="secondary" onClick={onClose}>
            Annulla
          </Button>
          <Button onClick={handleAddActivity}>Aggiungi Attività</Button>
        </div>
      </div>
    </div>
  );
}

export default AddActivityModal;

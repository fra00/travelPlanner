import React, { useState, useContext } from "react";
import { TripContext } from "../../state/TripProvider";
import { UPDATE_DAY_DETAILS } from "../../state/actions";
import { FaTrash, FaMapMarkerAlt } from "react-icons/fa";
import FormInput from "../../components/ui/FormInput";
import Button from "../../components/ui/Button";

function ActivitiesSection({ dayId, activities }) {
  const { dispatch } = useContext(TripContext);
  const [description, setDescription] = useState("");
  const [mapLink, setMapLink] = useState("");

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
    const updatedActivities = [...activities, newActivity];
    dispatch({
      type: UPDATE_DAY_DETAILS,
      payload: { dayId, details: { activities: updatedActivities } },
    });
    setDescription("");
    setMapLink("");
  };

  const handleDeleteActivity = (activityId) => {
    const updatedActivities = activities.filter((act) => act.id !== activityId);
    dispatch({
      type: UPDATE_DAY_DETAILS,
      payload: { dayId, details: { activities: updatedActivities } },
    });
  };

  return (
    <div>
      <h4 className="text-md font-semibold mb-3">Attività / POI</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <FormInput
          label="Descrizione"
          id={`activity-description-${dayId}`}
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descrizione attività/POI"
        />
        <FormInput
          label="Link Mappa (opzionale)"
          id={`activity-map-link-${dayId}`}
          type="text"
          value={mapLink}
          onChange={(e) => setMapLink(e.target.value)}
          placeholder="Link Mappa (opzionale)"
        />
      </div>
      <Button variant="info" onClick={handleAddActivity}>
        Aggiungi Attività
      </Button>
      <ul className="mt-4 space-y-2">
        {activities.map((act) => (
          <li
            key={act.id}
            className="flex justify-between items-center p-2 bg-gray-50 rounded"
          >
            <span>
              {act.description}
              {act.mapLink && (
                <a
                  href={act.mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-blue-500 hover:underline inline-flex items-center"
                >
                  <FaMapMarkerAlt className="mr-1" /> Mappa
                </a>
              )}
            </span>
            <Button
              variant="dangerLink"
              onClick={() => handleDeleteActivity(act.id)}
            >
              <FaTrash />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ActivitiesSection;

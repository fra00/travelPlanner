import React, { useContext, useState } from "react";
import { TripContext } from "../../state/TripProvider";
import { UPDATE_DAY_DETAILS } from "../../state/actions";
import ActivitiesSection from "./ActivitiesSection";
import DayExpensesSection from "./DayExpensesSection";
import FormInput from "../../components/ui/FormInput";
import FormSelect from "../../components/ui/FormSelect";
import RoutePlannerDialog from "./RoutePlannerDialog";
import { ROUTE_TYPES } from "../../utils/constants";
import Button from "../../components/ui/Button";
import FormTextArea from "../../components/ui/FormTextArea";

function DayDetails({ day }) {
  if (!day) {
    return (
      <div className="p-4 border rounded h-full flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">
          Seleziona un giorno dalla lista per vedere i dettagli.
        </p>
      </div>
    );
  }

  const { state, dispatch } = useContext(TripContext);
  const [isRoutePlannerOpen, setIsRoutePlannerOpen] = useState(false);
  const dayIndex = state.days.findIndex((d) => d.id === day.id);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    // Converte in numero se il tipo è 'number', altrimenti usa la stringa
    const detailValue = type === "number" ? parseInt(value, 10) || 0 : value;

    dispatch({
      type: UPDATE_DAY_DETAILS,
      payload: {
        dayId: day.id,
        details: { [name]: detailValue },
      },
    });
  };

  const handleMapLinkGenerated = (link) => {
    dispatch({
      type: UPDATE_DAY_DETAILS,
      payload: {
        dayId: day.id,
        details: { mapLink: link },
      },
    });
  };

  const previousDayCity = dayIndex > 0 ? state.days[dayIndex - 1].city : "";

  // Estrae il numero del giorno dall'ID per la visualizzazione
  const dayNumber = day.id.split("_")[1];

  const travelSpeed = ROUTE_TYPES[day.routeType] || 80; // Default a 80km/h
  const travelTime = travelSpeed > 0 ? day.distance / travelSpeed : 0;

  return (
    <>
      <RoutePlannerDialog
        isOpen={isRoutePlannerOpen}
        onClose={() => setIsRoutePlannerOpen(false)}
        onConfirm={handleMapLinkGenerated}
        day={day}
        previousDayCity={previousDayCity}
      />
    <div className="p-4 border rounded">
      <h3 className="text-lg font-semibold mb-4">
        Dettagli Giorno {dayNumber}
      </h3>
      <div className="space-y-4">
        <FormInput
          label="Città di Arrivo:"
          id="day-city"
          type="text"
          name="city"
          value={day.city}
          onChange={handleChange}
        />
        <FormInput
          label="Link Struttura/Alloggio:"
          id="day-structure-link"
          type="text"
          name="structureLink"
          value={day.structureLink}
          onChange={handleChange}
          placeholder="Incolla qui il link dell'alloggio"
        />

        <div>
          <FormInput
            label="Link Google Maps (Itinerario):"
            id="day-map-link"
            type="text"
            name="mapLink"
            value={day.mapLink}
            onChange={handleChange}
            placeholder="Incolla il link o generane uno"
          />
          <div className="flex space-x-2 mt-2">
            <Button
              variant="secondary"
              onClick={() => setIsRoutePlannerOpen(true)}
            >
              Genera Link
            </Button>
            <Button
              variant="secondary"
              onClick={() => window.open(day.mapLink, "_blank")}
              disabled={!day.mapLink}
            >
              Visualizza Mappa
            </Button>
          </div>
        </div>

        <FormSelect
          label="Tipo di Percorso:"
          id="day-route-type"
          name="routeType"
          value={day.routeType || "Strada statale"}
          onChange={handleChange}
          options={Object.keys(ROUTE_TYPES)}
        />

        <FormInput
          label="Distanza percorsa (km):"
          id="day-distance"
          type="number"
          name="distance"
          min="0"
          value={day.distance}
          onChange={handleChange}
        />
        <div className="text-sm text-gray-600 -mt-2">
          <p>
            Tempo di viaggio stimato:{" "}
            <span className="font-bold text-gray-800">
              {travelTime.toFixed(2)} ore
            </span>
          </p>
        </div>
        <FormTextArea
          label="Note:"
          id="day-notes"
          name="notes"
          rows="3"
          value={day.notes}
          onChange={handleChange}
          placeholder="Appunti, ricordi..."
        />

        <div className="pt-4 border-t mt-6">
          <ActivitiesSection dayId={day.id} activities={day.activities} />
        </div>

        <div className="pt-4 border-t mt-6">
          <DayExpensesSection dayId={day.id} expenses={day.expenses} />
        </div>
      </div>
    </div>
    </>
  );
}

export default DayDetails;

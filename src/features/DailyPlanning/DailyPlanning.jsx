import React, { useState, useContext, useEffect } from "react";
import { TripContext } from "../../state/TripProvider";
import DayList from "./DayList";
import DayDetails from "./DayDetails";

function DailyPlanning() {
  const { state } = useContext(TripContext);
  const [selectedDayId, setSelectedDayId] = useState(null);

  // Effetto per impostare il giorno selezionato di default o quando i giorni cambiano
  useEffect(() => {
    // Se non ci sono giorni, non fare nulla e resetta la selezione.
    if (state.days.length === 0) {
      setSelectedDayId(null);
      return;
    }

    // Se nessun giorno è selezionato o il giorno selezionato non esiste più,
    // seleziona il primo giorno della lista.
    const dayExists = state.days.some((day) => day.id === selectedDayId);
    if (!selectedDayId || !dayExists) {
      setSelectedDayId(state.days[0].id);
    }
  }, [state.days, selectedDayId]);

  const selectedDay = state.days.find((day) => day.id === selectedDayId);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Pianificazione Giornaliera</h2>
      {state.days.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <DayList
              days={state.days}
              selectedDayId={selectedDayId}
              onSelectDay={setSelectedDayId}
            />
          </div>
          <div className="md:col-span-2">
            {selectedDay ? (
              <DayDetails day={selectedDay} />
            ) : (
              <p>Seleziona un giorno per vedere i dettagli.</p>
            )}
          </div>
        </div>
      ) : (
        <p>
          Nessun giorno pianificato. Inizia aggiungendo il primo giorno al tuo
          viaggio!
        </p>
      )}
    </div>
  );
}

export default DailyPlanning;

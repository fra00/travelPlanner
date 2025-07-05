import React, { useContext } from "react";
import { TripContext } from "../../state/TripProvider";
import RoadMapDayList from "./RoadMapDayList";
import RoadMapDayView from "./RoadMapDayView";
import Button from "../../components/ui/Button";
import { SET_VIEW_MODE, SWITCH_TAB } from "../../state/actions";
import { FaPencilAlt } from "react-icons/fa";

function RoadMap({
  selectedDayId,
  onSelectDay,
  onAddExpense,
  isSidebarOpen,
  setIsSidebarOpen,
}) {
  const { state, dispatch } = useContext(TripContext);

  const handleGoToPlanning = () => {
    dispatch({ type: SET_VIEW_MODE, payload: "planning" });
    dispatch({ type: SWITCH_TAB, payload: "planning" });
  };

  const selectedDay = state.days.find((day) => day.id === selectedDayId);

  if (state.days.length === 0) {
    return (
      <div className="text-center py-16 px-6 bg-white/50 rounded-2xl shadow-lg border border-stone-200/50">
        <h3 className="text-xl font-semibold text-stone-600">
          Il tuo viaggio non ha ancora tappe.
        </h3>
        <p className="text-stone-500 mt-2 mb-6">
          Inizia ad aggiungere i giorni del tuo itinerario per vederli qui.
        </p>
        <Button
          onClick={handleGoToPlanning}
          className="bg-amber-500 hover:bg-amber-600 text-white"
        >
          <FaPencilAlt className="mr-2" />
          Vai alla Pianificazione
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 relative">
      {/* Overlay for mobile, closes sidebar on click */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        ></div>
      )}

      {/* Sidebar container */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-sand-100 p-4 transform transition-transform duration-300 ease-in-out md:relative md:w-1/4 md:transform-none md:bg-transparent md:p-0 ${
          isSidebarOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
        }`}
      >
        <RoadMapDayList
          days={state.days}
          selectedDayId={selectedDayId}
          onSelectDay={onSelectDay}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      </div>
      <div className="md:w-3/4 w-full">
        {selectedDay && (
          <RoadMapDayView day={selectedDay} onAddExpense={onAddExpense} />
        )}
      </div>
    </div>
  );
}

export default RoadMap;

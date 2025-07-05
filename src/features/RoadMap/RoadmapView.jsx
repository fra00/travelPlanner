import React, { useContext, useState, useEffect } from "react";
import { TripContext } from "../../state/TripProvider";
import { SET_VIEW_MODE, SWITCH_TAB } from "../../state/actions";
import RoadMap from "./RoadMap"; // Il componente che mostra la vista giorno per giorno
import Button from "../../components/ui/Button";
import {
  FaBars,
  FaPencilAlt,
  FaPlusCircle,
  FaMoneyBillWave,
  FaHandHoldingUsd,
} from "react-icons/fa";
import AddExpenseModal from "./AddExpenseModal";
import AddActivityModal from "./AddActivityModal";
import SettlementModal from "./SettlementModal";

function RoadmapView() {
  const { state, dispatch } = useContext(TripContext);
  const [selectedDayId, setSelectedDayId] = useState(null);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [isSettlementModalOpen, setIsSettlementModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Imposta il primo giorno come selezionato di default
  useEffect(() => {
    if (state.days.length > 0 && !selectedDayId) {
      setSelectedDayId(state.days[0].id);
    }
  }, [state.days, selectedDayId]);

  const selectedDay = state.days.find((day) => day.id === selectedDayId);

  const handleGoToPlanning = () => {
    // Passa alla modalità di pianificazione
    dispatch({ type: SET_VIEW_MODE, payload: "planning" });
    // Passa alla scheda di pianificazione di default quando si entra in pianificazione
    dispatch({ type: SWITCH_TAB, payload: "planning" });
  };

  return (
    <>
      {selectedDay && (
        <>
          <AddExpenseModal
            isOpen={isExpenseModalOpen}
            onClose={() => setIsExpenseModalOpen(false)}
            day={selectedDay}
          />
          <AddActivityModal
            isOpen={isActivityModalOpen}
            onClose={() => setIsActivityModalOpen(false)}
            day={selectedDay}
          />
          <SettlementModal
            isOpen={isSettlementModalOpen}
            onClose={() => setIsSettlementModalOpen(false)}
          />
        </>
      )}
      <div className="bg-sand-100 -m-6 sm:-m-8 p-6 sm:p-8 min-h-screen">
        <div className="mb-6 pb-4 border-b border-stone-300">
          {/* Row 1: Title and Plan button */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-stone-700">
                RoadMap del Viaggio
              </h2>
              {state.description && (
                <p className="text-stone-500 mt-1">{state.description}</p>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="success"
                onClick={() => setIsSettlementModalOpen(true)}
              >
                <FaHandHoldingUsd className="mr-2" />
                Salda Spese
              </Button>
              <Button
                onClick={handleGoToPlanning}
                className="bg-amber-500 hover:bg-amber-600 text-white"
              >
                <FaPencilAlt className="mr-2" />
                Pianifica
              </Button>
            </div>
          </div>

          {/* Row 2: Mobile hamburger and Quick Add Toolbar */}
          <div className="flex justify-between items-center mt-4">
            <Button
              variant="secondary"
              className="md:hidden p-2"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              title="Mostra/Nascondi Giorni"
            >
              <FaBars />
            </Button>
            {/* ml-auto is needed to push the quick actions to the right when the hamburger is not visible */}
            <div className="flex justify-end items-center space-x-2 ml-auto">
              <Button
                variant="secondary"
                onClick={() => setIsExpenseModalOpen(true)}
                disabled={!selectedDay}
                title="Aggiungi Spesa Rapida"
              >
                <FaMoneyBillWave className="mr-0 sm:mr-2" />
                <span className="hidden sm:inline">Aggiungi Spesa</span>
              </Button>
              <Button
                variant="secondary"
                onClick={() => setIsActivityModalOpen(true)}
                disabled={!selectedDay}
                title="Aggiungi Attività Rapida"
              >
                <FaPlusCircle className="mr-0 sm:mr-2" />
                <span className="hidden sm:inline">Aggiungi Attività</span>
              </Button>
            </div>
          </div>
        </div>
        <RoadMap
          selectedDayId={selectedDayId}
          onSelectDay={setSelectedDayId}
          onAddExpense={() => setIsExpenseModalOpen(true)}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      </div>
    </>
  );
}

export default RoadmapView;

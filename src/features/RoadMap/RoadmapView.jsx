import React, { useContext, useState, useEffect } from "react";
import { TripContext } from "../../state/TripProvider";
import {
  SET_VIEW_MODE,
  SWITCH_TAB,
  UPDATE_DAY_DETAILS,
  CLEAR_DIRTY,
  SET_TRIP_ID,
  LOAD_DATA,
} from "../../state/actions";
import RoadMap from "./RoadMap"; // Il componente che mostra la vista giorno per giorno
import Button from "../../components/ui/Button";
import {
  FaBars,
  FaPencilAlt,
  FaPlusCircle,
  FaMoneyBillWave,
  FaHandHoldingUsd,
  FaFileArchive,
  FaSave,
  FaSync,
  FaSpinner,
} from "react-icons/fa";
import AddExpenseModal from "./AddExpenseModal";
import AddActivityModal from "./AddActivityModal";
import SettlementModal from "./SettlementModal";
import DocumentsModal from "./DocumentsModal";
import { useModalManager } from "../../hooks/useModalManager";
import { useAuth } from "../Auth/AuthProvider";
import { loadTripData, saveTrip } from "../../utils/supabaseClient";
import toast from "react-hot-toast";

function RoadmapView() {
  const { state, dispatch } = useContext(TripContext);
  const { user } = useAuth();
  const [selectedDayId, setSelectedDayId] = useState(null);
  const { openModal, closeModal, isModalOpen } = useModalManager();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isReloading, setIsReloading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Imposta il primo giorno come selezionato di default
  useEffect(() => {
    if (state.days.length > 0 && !selectedDayId) {
      setSelectedDayId(state.days[0].id);
    }
  }, [state.days, selectedDayId]);

  const selectedDay = state.days.find((day) => day.id === selectedDayId);

  const handleGoToPlanning = () => {
    if (state.isDirty) {
      toast.error("Salva le modifiche prima di tornare alla pianificazione!");
      return;
    }
    // Passa alla modalità di pianificazione
    dispatch({ type: SET_VIEW_MODE, payload: "planning" });
    // Passa alla scheda di pianificazione di default quando si entra in pianificazione
    dispatch({ type: SWITCH_TAB, payload: "planning" });
  };

  const handleAddExpense = (expenseData) => {
    if (!selectedDay) return;
    const newExpense = {
      id: `day_exp_${Date.now()}`,
      ...expenseData,
    };
    const updatedExpenses = [...selectedDay.expenses, newExpense];
    dispatch({
      type: UPDATE_DAY_DETAILS,
      payload: { dayId: selectedDay.id, details: { expenses: updatedExpenses } },
    });
  };

  const handleReload = async () => {
    if (!state.tripId) return;

    setIsReloading(true);
    toast.loading("Ricaricando il viaggio...", { id: "reloading-toast" });

    try {
      const { data, error } = await loadTripData(state.tripId);
      if (error) throw error;

      dispatch({ type: LOAD_DATA, payload: data });
      toast.success("Viaggio ricaricato con successo!", {
        id: "reloading-toast",
      });
    } catch (err) {
      toast.error(err.message || "Errore durante il ricaricamento.", {
        id: "reloading-toast",
      });
    } finally {
      setIsReloading(false);
    }
  };

  const handleSave = async () => {
    if (!user) {
      toast.error("Devi essere loggato per salvare i dati sul cloud.");
      return;
    }
    setIsSaving(true);
    toast.loading("Salvataggio in corso...", { id: "saving-toast" });

    try {
      const { data, error } = await saveTrip(user.id, state, state.tripId);

      if (error) {
        throw error;
      }

      if (data && data.id && !state.tripId) {
        dispatch({ type: SET_TRIP_ID, payload: data.id });
      }

      dispatch({ type: CLEAR_DIRTY });
      toast.success("Viaggio salvato con successo!", { id: "saving-toast" });
    } catch (err) {
      toast.error(err.message || "Errore durante il salvataggio.", { id: "saving-toast" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      {selectedDay && (
        <>
          <AddExpenseModal
            isOpen={isModalOpen("expense")}
            onClose={closeModal}
            onAddExpense={handleAddExpense}
            title={`Aggiungi spesa per il Giorno ${
              selectedDay.id.split("_")[1]
            }`}
          />
          <AddActivityModal
            isOpen={isModalOpen("activity")}
            onClose={closeModal}
            day={selectedDay}
          />
          <SettlementModal
            isOpen={isModalOpen("settlement")}
            onClose={closeModal}
          />
          <DocumentsModal
            isOpen={isModalOpen("documents")}
            onClose={closeModal}
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
                onClick={handleGoToPlanning}
                className="bg-amber-500 hover:bg-amber-600 text-white"
              >
                <FaPencilAlt className="mr-2" />
                Pianifica
              </Button>
              {user && (
                <Button
                  variant="secondary"
                  onClick={handleSave}
                  disabled={isSaving || isReloading}
                  title="Salva dati su cloud"
                  className={
                    state.isDirty ? "pulsing-save-button border-amber-500" : ""
                  }
                >
                  {isSaving ? <FaSpinner className="animate-spin" /> : <FaSave />}
                </Button>
              )}
              {user && state.tripId && (
                <Button
                  variant="secondary"
                  onClick={handleReload}
                  disabled={isReloading || isSaving}
                  title="Ricarica dati dal cloud"
                >
                  {isReloading ? <FaSpinner className="animate-spin" /> : <FaSync />}
                </Button>
              )}
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
                onClick={() => openModal("expense")}
                disabled={!selectedDay}
                title="Aggiungi Spesa Rapida"
              >
                <FaMoneyBillWave className="mr-0 sm:mr-2" />
                <span className="hidden sm:inline">Aggiungi Spesa</span>
              </Button>
              <Button
                variant="secondary"
                onClick={() => openModal("activity")}
                disabled={!selectedDay}
                title="Aggiungi Attività Rapida"
              >
                <FaPlusCircle className="mr-0 sm:mr-2" />
                <span className="hidden sm:inline">Aggiungi Attività</span>
              </Button>
              <Button
                variant="secondary"
                className="text-green-700 border-green-200 hover:bg-green-50"
                onClick={() => openModal("settlement")}
                title="Salda Spese Condivise"
              >
                <FaHandHoldingUsd className="mr-0 sm:mr-2" />
                <span className="hidden sm:inline">Salda Spese</span>
              </Button>
              <Button
                variant="secondary"
                onClick={() => openModal("documents")}
                title="Vedi Documenti"
              >
                <FaFileArchive className="mr-0 sm:mr-2" />
                <span className="hidden sm:inline">Documenti</span>
              </Button>
            </div>
          </div>
        </div>
        <RoadMap
          selectedDayId={selectedDayId}
          onSelectDay={setSelectedDayId}
          onAddExpense={() => openModal("expense")}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      </div>
    </>
  );
}

export default RoadmapView;

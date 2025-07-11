import React, { useContext } from "react";
import { TripContext } from "./state/TripProvider";
import { RESET_DATA, SET_SHOW_SETUP } from "./state/actions";
import PlanningView from "./features/Planning/PlanningView";
import RoadmapView from "./features/RoadMap/RoadmapView";
import WelcomePage from "./features/Welcome/WelcomePage";
import Setup from "./features/Setup/Setup";
import AuthStatus from "./features/Auth/AuthStatus";
import Button from "./components/ui/Button";
import { FaHome } from "react-icons/fa";
import { Toaster } from "react-hot-toast";

function App() {
  const { state, dispatch } = useContext(TripContext);

  const handleReset = () => {
    if (state.isDirty) {
      if (
        window.confirm(
          "Hai delle modifiche non salvate. Sei sicuro di voler tornare alla home? Le modifiche andranno perse."
        )
      ) {
        dispatch({ type: RESET_DATA });
      }
    } else {
      dispatch({ type: RESET_DATA });
    }
  };

  const renderContent = () => {
    if (!state.isPlanningStarted) {
      if (state.showSetup) {
        return <Setup />;
      }
      return (
        <WelcomePage onStart={() => dispatch({ type: SET_SHOW_SETUP, payload: true })} />
      );
    }

    if (state.viewMode === "roadmap") {
      return <RoadmapView />;
    }

    return <PlanningView />;
  };

  const titleColor =
    state.viewMode === "roadmap" || !state.isPlanningStarted
      ? "text-stone-700"
      : "text-slate-800";

  return (
    <div className="min-h-screen py-8">
      <div
        className="container mx-auto max-w-5xl bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 sm:p-8 relative"
      >
        {/* Aggiungo il componente Toaster qui per renderizzare le notifiche */}
        <Toaster
          position="top-center"
          reverseOrder={false}
        />
        {(state.isPlanningStarted || state.showSetup) && (
          <div className="absolute top-6 left-6 sm:top-8 sm:left-8 z-10">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleReset}
              title="Torna alla Home"
            >
              <FaHome />
            </Button>
          </div>
        )}
        <div className="absolute top-6 right-6 sm:top-8 sm:right-8 z-10">
          <AuthStatus />
        </div>
        {state.isPlanningStarted && (
          <h1
            className={`text-3xl sm:text-4xl font-bold mb-6 text-center ${titleColor}`}
          >
            {state.description || "React Travel Planner"}
          </h1>
        )}
        {renderContent()}
      </div>
    </div>
  );
}

export default App;

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

function App() {
  const { state, dispatch } = useContext(TripContext);

  const handleReset = () => {
    if (
      window.confirm(
        "Sei sicuro di voler tornare alla home? I dati del viaggio verranno cancellati e non potranno essere recuperati."
      )
    ) {
      dispatch({ type: RESET_DATA });
    }
  };

  const isRoadmapView = state.viewMode === "roadmap";

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

  const containerBg =
    isRoadmapView || !state.isPlanningStarted ? "bg-sand-100" : "bg-white";
  const titleColor =
    isRoadmapView || !state.isPlanningStarted
      ? "text-stone-700"
      : "text-slate-800";
  const showMainTitle = state.isPlanningStarted;

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div
        className={`container mx-auto max-w-5xl ${containerBg} rounded-2xl shadow-lg p-6 sm:p-8 relative`}
      >
        <div className="absolute top-6 right-6 sm:top-8 sm:right-8 z-10 flex items-center space-x-2">
          {state.isPlanningStarted && (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleReset}
              title="Torna alla Home"
            >
              <FaHome />
            </Button>
          )}
          <AuthStatus />
        </div>
        {showMainTitle && (
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

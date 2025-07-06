import React, { useContext, useState } from "react";
import { TripContext } from "./state/TripProvider";
import Setup from "./features/Setup/Setup";
import PlanningView from "./features/Planning/PlanningView";
import RoadmapView from "./features/RoadMap/RoadmapView";
import WelcomePage from "./features/Welcome/WelcomePage";

function App() {
  const { state } = useContext(TripContext);
  const [hasSeenWelcome, setHasSeenWelcome] = useState(
    () => localStorage.getItem("hasSeenWelcomePage") === "true"
  );

  const handleStartPlanning = () => {
    localStorage.setItem("hasSeenWelcomePage", "true");
    setHasSeenWelcome(true);
  };

  const isRoadmapView = state.viewMode === "roadmap";

  const renderContent = () => {
    if (!hasSeenWelcome) {
      return <WelcomePage onStart={handleStartPlanning} />;
    }

    if (!state.isPlanningStarted) {
      return <Setup />;
    }

    if (state.viewMode === "roadmap") {
      return <RoadmapView />;
    }

    // Default to planning view
    return <PlanningView />;
  };

  const containerBg =
    isRoadmapView || !hasSeenWelcome ? "bg-sand-100" : "bg-white";
  const titleColor =
    isRoadmapView || !hasSeenWelcome ? "text-stone-700" : "text-slate-800";
  const showMainTitle = hasSeenWelcome;

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div
        className={`container mx-auto max-w-5xl ${containerBg} rounded-2xl shadow-lg p-6 sm:p-8`}
      >
        {showMainTitle && (
          <h1
            className={`text-3xl sm:text-4xl font-bold mb-6 text-center ${titleColor}`}
          >
            React Travel Planner
          </h1>
        )}
        {renderContent()}
      </div>
    </div>
  );
}

export default App;

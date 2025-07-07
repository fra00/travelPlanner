import React, { useContext } from "react";
import { TripContext } from "../../state/TripProvider";
import { SET_VIEW_MODE } from "../../state/actions";
import Tabs from "../../components/layout/Tabs";
import Overview from "../Overview/Overview";
import DailyPlanning from "../DailyPlanning/DailyPlanning";
import GeneralExpenses from "../GeneralExpenses/GeneralExpenses";
import Summary from "../Summary/Summary";
import Stats from "../Stats/Stats";
import Checklist from "../Checklist/Checklist";
import DataManager from "../Data/DataManager";
import DocumentManager from "../Documents/DocumentManager";
import Button from "../../components/ui/Button";
import { FaArrowLeft } from "react-icons/fa";

function PlanningView() {
  const { state, dispatch } = useContext(TripContext);

  const handleGoToRoadmap = () => {
    dispatch({ type: SET_VIEW_MODE, payload: "roadmap" });
  };

  const renderActiveTab = () => {
    switch (state.activeTab) {
      case "overview":
        return <Overview />;
      case "general-expenses":
        return <GeneralExpenses />;
      case "planning":
        return <DailyPlanning />;
      case "checklist":
        return <Checklist />;
      case "summary":
        return <Summary />;
      case "stats":
        return <Stats />;
      case "data":
        return <DataManager />;
      case "documents":
        return <DocumentManager />;
      default:
        return <Overview />;
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button variant="secondary" onClick={handleGoToRoadmap}>
          <FaArrowLeft className="mr-2" />
          Torna alla RoadMap
        </Button>
      </div>
      <Tabs />
      <div className="mt-6">{renderActiveTab()}</div>
    </div>
  );
}

export default PlanningView;

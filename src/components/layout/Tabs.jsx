import React, { useContext } from "react";
import { TripContext } from "../../state/TripProvider";
import { SWITCH_TAB } from "../../state/actions";
import {
  FaThList,
  FaMoneyBillWave,
  FaRoute,
  FaListAlt,
  FaChartBar,
  FaCog,
  FaTasks,
  FaMapSigns,
} from "react-icons/fa";

const TABS = [
  { id: "overview", label: "Panoramica", icon: <FaThList /> },
  {
    id: "general-expenses",
    label: "Spese Generali",
    icon: <FaMoneyBillWave />,
  },
  { id: "planning", label: "Pianificazione", icon: <FaRoute /> },
  { id: "summary", label: "Riepilogo", icon: <FaListAlt /> },
  { id: "stats", label: "Statistiche", icon: <FaChartBar /> },
  { id: "data", label: "Dati", icon: <FaCog /> },
  { id: "checklist", label: "Checklist", icon: <FaTasks /> },
];

function Tabs() {
  const { state, dispatch } = useContext(TripContext);

  return (
    <div className="mb-6">
      <div className="p-1 bg-gray-100 rounded-xl overflow-x-auto">
        <nav className="flex space-x-2" aria-label="Tabs">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => dispatch({ type: SWITCH_TAB, payload: tab.id })}
              className={`flex-shrink-0 inline-flex items-center px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-gray-100 ${
                state.activeTab === tab.id
                  ? "bg-white text-indigo-600 shadow"
                  : "text-gray-600 hover:bg-gray-200/75 hover:text-gray-900"
              }`}
            >
              <span className="mr-2 text-base opacity-80">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}

export default Tabs;

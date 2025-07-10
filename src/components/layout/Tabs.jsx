import React, { useContext, useState, useEffect, useRef } from "react";
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
  FaFileArchive,
  FaEllipsisH,
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
  { id: "documents", label: "Documenti", icon: <FaFileArchive /> },
];

// Suddividiamo le schede per la vista mobile
const PRIMARY_TABS_COUNT = 3; // Numero di schede da mostrare sempre su mobile
const primaryTabs = TABS.slice(0, PRIMARY_TABS_COUNT);
const secondaryTabs = TABS.slice(PRIMARY_TABS_COUNT);

function Tabs({ highlightedTabId }) {
  const { state, dispatch } = useContext(TripContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Gestisce la chiusura del menu quando si clicca all'esterno
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  const handleTabClick = (tabId) => {
    dispatch({ type: SWITCH_TAB, payload: tabId });
    setIsMenuOpen(false); // Chiude il menu dopo la selezione
  };

  const isSecondaryTabActive = secondaryTabs.some(
    (tab) => tab.id === state.activeTab
  );

  const isSecondaryTabHighlighted =
    !isSecondaryTabActive &&
    secondaryTabs.some((tab) => tab.id === highlightedTabId);

  return (
    <div className="mb-6">
      {/* Vista Desktop: tutte le schede scorrevoli */}
      <div className="hidden md:block p-1 bg-gray-100 rounded-xl overflow-x-auto">
        <nav className="flex space-x-2" aria-label="Tabs">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`flex-shrink-0 inline-flex items-center px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-gray-100 ${
                state.activeTab === tab.id
                  ? "bg-white text-indigo-600 shadow"
                  : "text-gray-600 hover:bg-gray-200/75 hover:text-gray-900"
              } ${
                highlightedTabId === tab.id && state.activeTab !== tab.id
                  ? "pulsing-save-button border-amber-500"
                  : ""
              }`}
            >
              <span className="mr-2 text-base opacity-80">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Vista Mobile: schede principali + menu "Altro" */}
      <div className="md:hidden p-1 bg-gray-100 rounded-xl">
        <nav className="flex justify-around items-center" aria-label="Tabs">
          {primaryTabs.map((tab) => {
            const isActive = state.activeTab === tab.id;
            const isHighlighted = highlightedTabId === tab.id && !isActive;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`flex-1 inline-flex flex-col items-center px-2 py-2 text-xs font-semibold rounded-lg transition-all duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-gray-100 ${
                  isActive
                    ? "bg-white text-indigo-600 shadow"
                    : "text-gray-600 hover:bg-gray-200/75 hover:text-gray-900"
                } ${
                  isHighlighted ? "pulsing-save-button border-amber-500" : ""
                }`}
              >
                <span className="mb-1 text-base opacity-80">{tab.icon}</span>
                {tab.label}
              </button>
            );
          })}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`flex-1 inline-flex flex-col items-center px-2 py-2 text-xs font-semibold rounded-lg transition-all duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-gray-100 ${
                isSecondaryTabActive
                  ? "bg-white text-indigo-600 shadow"
                  : "text-gray-600 hover:bg-gray-200/75 hover:text-gray-900"
              } ${
                isSecondaryTabHighlighted
                  ? "pulsing-save-button border-amber-500"
                  : ""
              }`}
            >
              <span className="mb-1 text-base opacity-80">
                <FaEllipsisH />
              </span>
              Altro
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                <div className="py-1">
                  {secondaryTabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => handleTabClick(tab.id)}
                      className={`w-full text-left flex items-center px-4 py-2 text-sm transition-colors ${
                        state.activeTab === tab.id
                          ? "bg-indigo-50 text-indigo-700 font-semibold"
                          : "text-gray-700 hover:bg-gray-100"
                      } ${
                        highlightedTabId === tab.id && state.activeTab !== tab.id
                          ? "bg-amber-100"
                          : ""
                      }`}
                    >
                      <span className="mr-3 text-base opacity-80">
                        {tab.icon}
                      </span>
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
}

export default Tabs;

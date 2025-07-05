import React from "react";
import {
  FaThumbsUp,
  FaBalanceScale,
  FaRoad,
  FaExclamationTriangle,
  FaClipboardList,
} from "react-icons/fa";

const getIndicatorStyle = (level) => {
  switch (level) {
    case "Molto Buono":
    case "Rilassato":
      return {
        icon: <FaThumbsUp className="text-green-500" />,
        textClass: "text-green-600 font-semibold",
      };
    case "Buono":
    case "Moderato":
      return {
        icon: <FaBalanceScale className="text-yellow-500" />,
        textClass: "text-yellow-600 font-semibold",
      };
    case "Da Rivedere":
    case "Intenso":
      return {
        icon: <FaExclamationTriangle className="text-red-500" />,
        textClass: "text-red-600 font-semibold",
      };
    default:
      return {
        icon: <FaBalanceScale className="text-gray-400" />,
        textClass: "text-gray-500",
      };
  }
};

function Indicator({ title, value, description, icon }) {
  const { icon: valueIcon, textClass } = getIndicatorStyle(value);

  return (
    <div className="flex items-start space-x-4">
      <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-gray-100 rounded-lg text-gray-500 text-xl">
        {icon}
      </div>
      <div>
        <h4 className="text-md font-semibold text-gray-700">{title}</h4>
        <p className={`text-lg ${textClass}`}>{value}</p>
        <p className="text-xs text-gray-500 mt-1">{description}</p>
      </div>
    </div>
  );
}

function PlanningQuality({ metrics }) {
  const { costConsistency, pacing, scheduleIntensity } = metrics;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <h3 className="text-xl font-semibold mb-4 text-gray-700">
        Qualità della Pianificazione
      </h3>
      <div className="space-y-6">
        <Indicator
          title="Equilibrio Spese"
          value={costConsistency}
          description="Valuta quanto sono bilanciate le spese giornaliere. Un valore migliore indica una distribuzione più uniforme del budget."
          icon={<FaBalanceScale />}
        />
        <Indicator
          title="Ritmo di Viaggio"
          value={pacing}
          description="Valuta l'equilibrio delle ore di guida e la durata delle singole tappe. Un valore migliore indica un viaggio più rilassante e meno faticoso."
          icon={<FaRoad />}
        />
        <Indicator
          title="Programma Giornaliero"
          value={scheduleIntensity}
          description="Valuta il numero di attività pianificate ogni giorno. Un ritmo 'Intenso' potrebbe essere faticoso."
          icon={<FaClipboardList />}
        />
      </div>
    </div>
  );
}

export default PlanningQuality;

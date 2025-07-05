import React from "react";

function RoadMapDayList({
  days,
  selectedDayId,
  onSelectDay,
  setIsSidebarOpen,
}) {
  const handleSelectDay = (dayId) => {
    onSelectDay(dayId);
    // Chiude la sidebar dopo la selezione, utile solo su mobile
    setIsSidebarOpen(false);
  };

  return (
    <div className="h-full flex flex-col">
      <h3 className="text-lg font-semibold mb-4 text-stone-600 px-2 md:px-0">Giorni</h3>
      <div className="space-y-2 overflow-y-auto pr-2 flex-grow">
        {days.map((day, index) => (
          <button
            key={day.id}
            onClick={() => handleSelectDay(day.id)}
            className={`w-full text-left p-3 rounded-lg transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 ${
              day.id === selectedDayId
                ? "bg-sky-600 text-white shadow-lg"
                : "bg-white/50 hover:bg-sky-50 text-stone-700 border border-stone-200/80"
            }`}
          >
            <span className="font-semibold">Giorno {index + 1}</span>
            <span className="block text-sm opacity-80">
              {day.city || "Da definire"}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default RoadMapDayList;

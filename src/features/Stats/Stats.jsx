import React, { useContext } from "react";
import { TripContext } from "../../state/TripProvider";
import { useTripMetrics } from "../../hooks/useTripMetrics";
import ExpenseDistributionChart from "./ExpenseDistributionChart";
import DailyCostChart from "./DailyCostChart";
import DailyDistanceChart from "./DailyDistanceChart";
import DailyBalanceChart from "./DailyBalanceChart";
import ParticipantExpenseChart from "./ParticipantExpenseChart";
import PlanningQuality from "./PlanningQuality";

function Stats() {
  const { state } = useContext(TripContext);
  const {
    costPerPerson,
    costPerDay,
    totalDistance,
    avgDistancePerDay,
    totalDrivingTime,
    expenseDistributionData,
    dailyCostData,
    dailyDistanceData,
    dailyBalanceData,
    participantExpenseData,
    planningMetrics,
  } = useTripMetrics(state);

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
        Statistiche e Indicatori
      </h2>

      <div className="mt-6">
        <PlanningQuality metrics={planningMetrics} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg lg:col-span-2">
          <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">
            Riepilogo
          </h3>
          <ul className="space-y-3 text-sm">
            <li className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">
                Costo per Persona
              </span>
              <span className="font-semibold text-gray-800 dark:text-gray-200">
                {costPerPerson.toFixed(2)} €
              </span>
            </li>
            <li className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">
                Costo Medio per Giorno
              </span>
              <span className="font-semibold text-gray-800 dark:text-gray-200">
                {costPerDay.toFixed(2)} €
              </span>
            </li>
            <li className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">
                Distanza Totale
              </span>
              <span className="font-semibold text-gray-800 dark:text-gray-200">
                {totalDistance} km
              </span>
            </li>
            <li className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">
                Distanza Media per Giorno
              </span>
              <span className="font-semibold text-gray-800 dark:text-gray-200">
                {avgDistancePerDay.toFixed(2)} km
              </span>
            </li>
            <li className="flex justify-between items-center border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
              <span className="text-gray-600 dark:text-gray-400">
                Tempo di Guida Totale
              </span>
              <span className="font-semibold text-gray-800 dark:text-gray-200">
                {totalDrivingTime.toFixed(2)} h
              </span>
            </li>
          </ul>
        </div>
        {/* Distribuzione Spese */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-semibold text-center mb-4 text-gray-700 dark:text-gray-300">
            Distribuzione Spese
          </h3>
          <div className="h-64 flex justify-center">
            <ExpenseDistributionChart data={expenseDistributionData} />
          </div>
        </div>
        {/* Spesa per Partecipante */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-semibold text-center mb-4 text-gray-700 dark:text-gray-300">
            Spesa per Partecipante
          </h3>
          <div className="h-64 flex justify-center">
            <ParticipantExpenseChart data={participantExpenseData} />
          </div>
        </div>
      </div>

      {/* Grafici Dettagliati */}
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-3">
          Andamento Giornaliero
        </h3>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
          <h4 className="text-lg font-semibold text-center mb-4 text-gray-700 dark:text-gray-300">
            Bilancio Giornaliero (Guida vs Attività)
          </h4>
          <div className="h-80">
            <DailyBalanceChart data={dailyBalanceData} />
          </div>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
            <h4 className="text-lg font-semibold text-center mb-4 text-gray-700 dark:text-gray-300">
              Costo Giornaliero
            </h4>
            <div className="h-80">
              <DailyCostChart data={dailyCostData} />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
            <h4 className="text-lg font-semibold text-center mb-4 text-gray-700 dark:text-gray-300">
              Distanza Giornaliera
            </h4>
            <div className="h-80">
              <DailyDistanceChart data={dailyDistanceData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Stats;

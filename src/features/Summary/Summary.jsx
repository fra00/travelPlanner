import React, { useContext } from "react";
import { TripContext } from "../../state/TripProvider";
import { useTripMetrics } from "../../hooks/useTripMetrics";
import BalanceSettlement from "./BalanceSettlement";

function Summary() {
  const { state } = useContext(TripContext);
  const { totalCost, allExpenses, balanceTransactions } = useTripMetrics(state);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Riepilogo Spese</h2>
      <div className="text-2xl font-bold mb-6">
        Costo Totale Viaggio:{" "}
        <span className="text-indigo-600">{totalCost.toFixed(2)} €</span>
      </div>
      <div className="my-8">
        <BalanceSettlement transactions={balanceTransactions} />
      </div>
      <h3 className="text-lg font-semibold mb-3">Elenco Dettagliato Spese</h3>
      <div className="overflow-x-auto border rounded">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Giorno
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Descrizione
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Pagato da
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Importo (base)
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Tipo
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider"
              >
                Costo Calcolato
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {allExpenses.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  Nessuna spesa registrata.
                </td>
              </tr>
            ) : (
              allExpenses.map((expense) => (
                <tr key={expense.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {expense.dayIndex}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {expense.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {expense.paidByName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {expense.amount.toFixed(2)} €
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {expense.perPerson ? "Per Persona" : "Totale"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                    {expense.calculatedAmount.toFixed(2)} €
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Summary;

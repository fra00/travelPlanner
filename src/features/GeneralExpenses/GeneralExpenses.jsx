import React, { useContext, useState } from "react";
import { TripContext } from "../../state/TripProvider";
import { UPDATE_FUEL, UPDATE_GENERAL_EXPENSES } from "../../state/actions";
import { useTripMetrics } from "../../hooks/useTripMetrics";
import { FaTrash } from "react-icons/fa";
import FormInput from "../../components/ui/FormInput";
import Button from "../../components/ui/Button";
import AddExpenseModal from "../RoadMap/AddExpenseModal";

function GeneralExpenses() {
  const { state, dispatch } = useContext(TripContext);
  const { estimatedFuelCost, estimatedFuelCostPerPerson } =
    useTripMetrics(state);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFuelChange = (e) => {
    const { name, value } = e.target;
    const parsedValue = parseFloat(value);
    dispatch({
      type: UPDATE_FUEL,
      payload: {
        fuel: { ...state.fuel, [name]: isNaN(parsedValue) ? 0 : parsedValue },
      },
    });
  };

  const handleAddExpense = (expenseData) => {
    const newExpense = {
      id: `gen_exp_${Date.now()}`,
      ...expenseData,
    };
    dispatch({
      type: UPDATE_GENERAL_EXPENSES,
      payload: { generalExpenses: [...state.generalExpenses, newExpense] },
    });
  };

  const handleDeleteExpense = (id) => {
    dispatch({
      type: UPDATE_GENERAL_EXPENSES,
      payload: {
        generalExpenses: state.generalExpenses.filter((exp) => exp.id !== id),
      },
    });
  };

  return (
    <div>
      <AddExpenseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddExpense={handleAddExpense}
        title="Aggiungi Spesa Generale"
      />
      <h2 className="text-2xl font-bold text-slate-700 mb-6 border-b pb-2">
        Spese Generali (per tutto il viaggio)
      </h2>

      {/* Costi Carburante */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
        <h3 className="text-xl font-semibold mb-4 text-slate-600">
          Costi Carburante Stimati
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <FormInput
            label="Costo medio benzina (€/L):"
            id="costPerLiter"
            type="number"
            name="costPerLiter"
            min="0"
            step="0.01"
            value={state.fuel.costPerLiter}
            onChange={handleFuelChange}
          />
          <FormInput
            label="Consumo medio (km/L):"
            id="kmPerLiter"
            type="number"
            name="kmPerLiter"
            min="0.1"
            step="0.1"
            value={state.fuel.kmPerLiter}
            onChange={handleFuelChange}
          />
        </div>
        <div className="bg-slate-50 p-4 rounded-lg">
          <p className="text-slate-600">
            Costo Totale Stimato:
            <span className="font-bold text-lg text-slate-800 ml-2">
              {estimatedFuelCost.toFixed(2)} €
            </span>
          </p>
          <p className="text-slate-600 mt-1">
            Costo Per Persona:
            <span className="font-bold text-lg text-slate-800 ml-2">
              {estimatedFuelCostPerPerson.toFixed(2)} €
            </span>
          </p>
        </div>
      </div>

      {/* Altre Spese Generali */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-xl font-semibold mb-6 text-slate-600">
          Altre Spese Generali
        </h3>
        <Button
          variant="primary"
          onClick={() => setIsModalOpen(true)}
          className="w-full md:w-auto mb-6"
        >
          Aggiungi Spesa
        </Button>

        <ul className="space-y-3">
          {state.generalExpenses.length === 0 ? (
            <li className="text-center text-gray-500 py-4">
              Nessuna spesa generale aggiunta.
            </li>
          ) : (
            state.generalExpenses.map((expense) => {
              const paidBy = expense.paidById
                ? state.participants.find((p) => p.id === expense.paidById)
                    ?.name || "Sconosciuto"
                : null;
              return (
                <li
                  key={expense.id}
                  className="flex justify-between items-center p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors duration-200"
                >
                  <span>
                    {expense.description} - {expense.amount.toFixed(2)} €{" "}
                    {expense.perPerson ? "(per persona)" : "(totale)"}
                    {paidBy && (
                      <span className="text-xs text-gray-500 ml-2">
                        (Pagato da: {paidBy})
                      </span>
                    )}
                  </span>
                  <Button
                    variant="dangerLink"
                    size="sm"
                    onClick={() => handleDeleteExpense(expense.id)}
                  >
                    <FaTrash />
                  </Button>
                </li>
              );
            })
          )}
        </ul>
      </div>
    </div>
  );
}

export default GeneralExpenses;

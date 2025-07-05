import React, { useState, useContext } from "react";
import { TripContext } from "../../state/TripProvider";
import { UPDATE_DAY_DETAILS } from "../../state/actions";
import { FaTrash } from "react-icons/fa";
import Button from "../../components/ui/Button";
import AddExpenseModal from "../RoadMap/AddExpenseModal";

function DayExpensesSection({ dayId, expenses }) {
  const { state, dispatch } = useContext(TripContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddExpense = (expenseData) => {
    const newExpense = {
      id: `day_exp_${Date.now()}`,
      ...expenseData,
    };
    const updatedExpenses = [...expenses, newExpense];
    dispatch({
      type: UPDATE_DAY_DETAILS,
      payload: { dayId, details: { expenses: updatedExpenses } },
    });
  };

  const handleDeleteExpense = (expenseId) => {
    const updatedExpenses = expenses.filter((exp) => exp.id !== expenseId);
    dispatch({
      type: UPDATE_DAY_DETAILS,
      payload: { dayId, details: { expenses: updatedExpenses } },
    });
  };

  const dayNumber = dayId.split("_")[1];

  return (
    <div>
      <AddExpenseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddExpense={handleAddExpense}
        title={`Aggiungi Spesa per Giorno ${dayNumber}`}
      />
      <h4 className="text-md font-semibold mb-3">Spese del Giorno</h4>
      <Button variant="success" onClick={() => setIsModalOpen(true)}>
        Aggiungi Spesa
      </Button>
      <ul className="mt-4 space-y-2">
        {expenses.map((exp) => {
          const paidBy = exp.paidById
            ? state.participants.find((p) => p.id === exp.paidById)?.name ||
              "Sconosciuto"
            : null;
          return (
            <li
              key={exp.id}
              className="flex justify-between items-center p-2 bg-gray-50 rounded"
            >
              <span>
                {exp.description} - {exp.amount.toFixed(2)} €{" "}
                {exp.perPerson ? "(per persona)" : "(totale)"}
                {paidBy && (
                  <span className="text-xs text-gray-500 ml-2">
                    (Pagato da: {paidBy})
                  </span>
                )}
              </span>
              <Button variant="dangerLink" onClick={() => handleDeleteExpense(exp.id)}>
                <FaTrash />
              </Button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default DayExpensesSection;

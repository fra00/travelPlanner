import React, { useState, useContext, useMemo } from "react";
import { TripContext } from "../../state/TripProvider";
import { UPDATE_CHECKLIST } from "../../state/actions";
import FormInput from "../../components/ui/FormInput";
import Button from "../../components/ui/Button";
import { FaTrash, FaPlusCircle } from "react-icons/fa";
import { generateChecklistSuggestions } from "./checklistSuggestions";

function Checklist() {
  const { state, dispatch } = useContext(TripContext);
  const [newItem, setNewItem] = useState("");

  const suggestions = useMemo(() => {
    const generated = generateChecklistSuggestions( // Passa l'array di tipi di viaggio
      state.tripTypes,
      state.days.length
    );
    // Filtra i suggerimenti che sono già presenti nella checklist
    const existingDescriptions = new Set(
      state.checklist.map((item) => item.description)
    );
    return generated.filter((suggestion) => !existingDescriptions.has(suggestion));
    // La dipendenza ora è `state.tripTypes`
  }, [state.tripTypes, state.days.length, state.checklist]);

  const handleAddItem = (e) => {
    e.preventDefault();
    if (newItem.trim() === "") return;

    const newChecklistItem = {
      id: `item_${Date.now()}`,
      description: newItem.trim(),
      checked: false,
      suggested: false, // Items added by the user are not suggestions
    };

    const updatedChecklist = [...state.checklist, newChecklistItem];
    dispatch({ type: UPDATE_CHECKLIST, payload: updatedChecklist });
    setNewItem("");
  };

  const handleAddSuggestion = (description) => {
    const newChecklistItem = {
      id: `item_${Date.now()}`,
      description,
      checked: false,
      suggested: true, // This is a suggestion
    };

    const updatedChecklist = [...state.checklist, newChecklistItem];
    dispatch({ type: UPDATE_CHECKLIST, payload: updatedChecklist });
  };

  const handleToggleItem = (itemId) => {
    const updatedChecklist = state.checklist.map((item) =>
      item.id === itemId ? { ...item, checked: !item.checked } : item
    );
    dispatch({ type: UPDATE_CHECKLIST, payload: updatedChecklist });
  };

  const handleDeleteItem = (itemId) => {
    const updatedChecklist = state.checklist.filter(
      (item) => item.id !== itemId
    );
    dispatch({ type: UPDATE_CHECKLIST, payload: updatedChecklist });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-700 mb-6 border-b pb-2">
        Checklist di Viaggio
      </h2>

      {/* Form per aggiungere nuovi elementi */}
      <form onSubmit={handleAddItem} className="flex items-center gap-4 mb-6">
        <FormInput
          label={
            <>
              Nuovo elemento: <span className="text-red-500 ml-1">*</span>
            </>
          }
          id="new-checklist-item"
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Es. Passaporto, caricabatterie..."
          description="Aggiungi un elemento alla tua lista di cose da fare o da portare."
          className="flex-grow"
        />
        <Button type="submit" className="self-end">
          Aggiungi
        </Button>
      </form>

      {/* Lista degli elementi */}
      <div className="space-y-3">
        {state.checklist.length > 0 ? (
          state.checklist.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm border"
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id={`item-${item.id}`}
                  checked={item.checked}
                  onChange={() => handleToggleItem(item.id)}
                  className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label
                  htmlFor={`item-${item.id}`}
                  className={`ml-3 text-sm ${
                    item.checked
                      ? "text-gray-400 line-through"
                      : "text-gray-800"
                  }`}
                >
                  {item.description}
                </label>
              </div>
              <Button
                variant="dangerLink"
                onClick={() => handleDeleteItem(item.id)}
                aria-label={`Elimina ${item.description}`}
              >
                <FaTrash />
              </Button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-8">
            La tua checklist è vuota. Aggiungi qualcosa da ricordare!
          </p>
        )}
      </div>

      {/* Sezione Suggerimenti */}
      {suggestions.length > 0 && (
        <div className="mt-8 pt-6 border-t">
          <h3 className="text-xl font-semibold text-slate-600 mb-4">
            Suggerimenti per il tuo viaggio
          </h3>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => handleAddSuggestion(suggestion)}
                className="flex items-center bg-blue-50 text-blue-700 hover:bg-blue-100 text-sm font-medium px-3 py-1 rounded-full transition-colors"
              >
                <FaPlusCircle className="mr-2" />
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Checklist;

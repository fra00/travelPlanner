import React, { useState, useContext } from "react";
import Modal from "../../components/ui/Modal";
import FormInput from "../../components/ui/FormInput";
import Button from "../../components/ui/Button";
import { TripContext } from "../../state/TripProvider";
import FormSelect from "../../components/ui/FormSelect";

function AddExpenseModal({ isOpen, onClose, onAddExpense, title }) {
  const { state } = useContext(TripContext);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [perPerson, setPerPerson] = useState(false);
  const [paidById, setPaidById] = useState("");

  const participantOptions = [
    { value: "", label: "Nessuno / Non specificato" },
    ...state.participants.map((p) => ({
      value: p.id,
      label: p.name,
    })),
  ];

  const handleAddExpense = () => {
    const parsedAmount = parseFloat(amount);
    if (description.trim() && !isNaN(parsedAmount) && parsedAmount > 0) {
      const newExpense = {
        description,
        amount: parsedAmount,
        perPerson,
        paidById,
      };
      onAddExpense(newExpense);
      // Resetta e chiudi
      handleClose();
    } else {
      alert("Inserisci una descrizione e un importo validi.");
    }
  };

  // Resetta lo stato del form quando la modale viene chiusa
  const handleClose = () => {
    setDescription("");
    setAmount("");
    setPerPerson(false);
    setPaidById("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={title}>
      <div className="space-y-4">
        <FormInput
          label="Descrizione"
          id="modal-expense-description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descrizione spesa"
        />
        <FormInput
          label="Importo (€)"
          id="modal-expense-amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="0"
          step="0.01"
          placeholder="Importo"
        />
        <FormSelect
          label="Pagato da (Opzionale)"
          id="modal-expense-paid-by"
          value={paidById}
          onChange={(e) => setPaidById(e.target.value)}
          options={participantOptions}
        />
        <div className="flex items-center">
          <input
            id="modal-expense-per-person"
            type="checkbox"
            checked={perPerson}
            onChange={(e) => setPerPerson(e.target.checked)}
            className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
          />
          <label
            htmlFor="modal-expense-per-person"
            className="ml-2 block text-sm text-gray-900"
          >
            Per Persona
          </label>
        </div>
        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="secondary" onClick={handleClose}>
            Annulla
          </Button>
          <Button onClick={handleAddExpense}>Aggiungi Spesa</Button>
        </div>
      </div>
    </Modal>
  );
}

export default AddExpenseModal;

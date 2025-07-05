import React, { useState } from "react";
import FormInput from "../../components/ui/FormInput";
import Button from "../../components/ui/Button";
import { FaTrash, FaUserPlus } from "react-icons/fa";

function ParticipantManager({ participants, onParticipantsChange }) {
  const [name, setName] = useState("");

  const handleAdd = () => {
    if (name.trim()) {
      const newParticipant = {
        id: `p_${Date.now()}`,
        name: name.trim(),
      };
      onParticipantsChange([...participants, newParticipant]);
      setName("");
    }
  };

  const handleDelete = (id) => {
    if (participants.length <= 1) {
      alert("Deve esserci almeno un partecipante al viaggio.");
      return;
    }
    onParticipantsChange(participants.filter((p) => p.id !== id));
  };

  return (
    <div>
      <div className="flex gap-2 items-end">
        <FormInput
          label="Nome Partecipante:"
          id="participant-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Es. Mario Rossi"
          className="flex-grow"
        />
        <Button onClick={handleAdd} aria-label="Aggiungi partecipante">
          <FaUserPlus />
        </Button>
      </div>
      <ul className="mt-4 space-y-2">
        {participants.map((p) => (
          <li
            key={p.id}
            className="flex justify-between items-center p-2 bg-slate-100 rounded"
          >
            <span className="text-slate-800">{p.name}</span>
            <Button
              variant="dangerLink"
              onClick={() => handleDelete(p.id)}
              aria-label={`Rimuovi ${p.name}`}
            >
              <FaTrash />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ParticipantManager;

import React, { useState } from "react";
import FormInput from "../../components/ui/FormInput";
import Button from "../../components/ui/Button";
import { FaTrash, FaUserPlus, FaSpinner } from "react-icons/fa";
import { useAuth } from "../Auth/AuthProvider";
import { getUserIdByEmail } from "../../utils/supabaseClient";

function ParticipantManager({ participants, onParticipantsChange }) {
  const { user } = useAuth();
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAdd = async () => {
    const value = inputValue.trim();
    if (!value) return;

    setError(null);
    setLoading(true);

    try {
      let newParticipant;
      if (user) {
        // Se l'utente è loggato, cerca l'utente per email
        const { data: userData, error: userError } = await getUserIdByEmail(
          value
        );
        if (userError || !userData) {
          throw new Error("Utente non trovato o errore nella ricerca.");
        }
        newParticipant = { id: userData.id, name: value };
      } else {
        // Se non è loggato, aggiungi come partecipante locale
        newParticipant = { id: `p_${Date.now()}`, name: value };
      }

      if (participants.some((p) => p.id === newParticipant.id)) {
        throw new Error("Questo partecipante è già stato aggiunto.");
      }

      onParticipantsChange([...participants, newParticipant]);
      setInputValue("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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
          label={user ? "Email Partecipante:" : "Nome Partecipante:"}
          id="participant-name"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={user ? "mario.rossi@email.com" : "Es. Mario Rossi"}
          className="flex-grow"
        />
        <Button
          onClick={handleAdd}
          disabled={loading}
          aria-label="Aggiungi partecipante"
        >
          {loading ? <FaSpinner className="animate-spin" /> : <FaUserPlus />}
        </Button>
      </div>
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
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

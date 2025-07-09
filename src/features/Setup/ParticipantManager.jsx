import React, { useState } from "react";
import FormInput from "../../components/ui/FormInput";
import Button from "../../components/ui/Button";
import { FaTrash, FaUserPlus, FaSpinner } from "react-icons/fa";
import { useAuth } from "../Auth/AuthProvider";
import { getUserIdByEmail } from "../../utils/supabaseClient";

function ParticipantManager({ participants, onParticipantsChange }) {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAdd = async () => {
    const participantName = name.trim();
    const participantEmail = email.trim().toLowerCase();

    if (!participantName) {
      setError("Il nome descrittivo è obbligatorio.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      // Controlla se un partecipante con lo stesso nome o email (se fornita) esiste già
      if (
        participants.some(
          (p) =>
            p.name.toLowerCase() === participantName.toLowerCase() ||
            (participantEmail && p.email && p.email.toLowerCase() === participantEmail)
        )
      ) {
        throw new Error("Questo partecipante è già stato aggiunto.");
      }

      let newParticipant = {
        id: `p_${Date.now()}`,
        name: participantName,
        email: participantEmail || null,
      };

      // Se l'utente è loggato e viene fornita un'email, cerca l'utente nel cloud
      if (user && participantEmail) {
        const { data: userData, error: userError } = await getUserIdByEmail(participantEmail);

        if (userError) throw userError;

        // Se l'utente esiste nel cloud, usa il suo ID reale
        if (userData) {
          newParticipant.id = userData.id;
        }
      }

      onParticipantsChange([...participants, newParticipant]);
      setName("");
      setEmail("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    // Impedisce la rimozione dell'utente che ha creato il viaggio
    if (user && user.id === id) {
      setError("Non puoi rimuovere te stesso dal viaggio.");
      return;
    }
    onParticipantsChange(participants.filter((p) => p.id !== id));
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
        <FormInput
          label="Nome descrittivo:"
          id="participant-name-input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Es. Mario Rossi"
          required
        />
        <FormInput
          label="Email (opzionale):"
          id="participant-email-input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="mario.rossi@email.com"
          description="Per condivisione cloud"
        />
      </div>
      <Button onClick={handleAdd} disabled={loading || !name.trim()} className="w-full mb-4">
        {loading ? <FaSpinner className="animate-spin" /> : <FaUserPlus className="mr-2" />}
        Aggiungi Partecipante
      </Button>
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
      <ul className="mt-4 space-y-2">
        {participants.map((p) => (
          <li
            key={p.id}
            className="flex justify-between items-center p-2 bg-slate-100 rounded"
          >
            <div>
              <span className="text-slate-800 font-medium">{p.name}</span>
              {p.email && <span className="block text-xs text-slate-500">{p.email}</span>}
            </div>
            <Button
              variant="dangerLink"
              onClick={() => handleDelete(p.id)}
              aria-label={`Rimuovi ${p.name}`}
              disabled={user && user.id === p.id}
              title={user && user.id === p.id ? "Non puoi rimuovere te stesso" : `Rimuovi ${p.name}`}
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

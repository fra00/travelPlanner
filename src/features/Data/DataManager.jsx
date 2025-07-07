import React, { useState, useContext, useEffect } from "react";
import { TripContext } from "../../state/TripProvider";
import { LOAD_DATA, SET_TRIP_ID, CLEAR_DIRTY } from "../../state/actions";
import { saveDataToFile, loadDataFromFile } from "../../utils/fileUtils";
import { saveTrip } from "../../utils/supabaseClient";
import { useAuth } from "../Auth/AuthProvider";
import {
  FaSave,
  FaFolderOpen,
  FaCloudUploadAlt,
  FaCloudDownloadAlt,
} from "react-icons/fa";
import Button from "../../components/ui/Button";
import SavedTrips from "./SavedTrips";

function DataManager() {
  const { state, dispatch } = useContext(TripContext);
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(null);
  const [saveError, setSaveError] = useState(null);
  const [lastSaveTimestamp, setLastSaveTimestamp] = useState(null);

  const handleSave = () => {
    const date = new Date().toISOString().slice(0, 10);
    saveDataToFile(state, `travel-plan-${date}.json`);
  };

  const handleFileChange = async (event) => {
    setError(null);
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleLoad = async () => {
    if (!selectedFile) {
      setError("Per favore, seleziona un file da caricare.");
      return;
    }
    setError(null);
    try {
      const data = await loadDataFromFile(selectedFile);
      if (data && typeof data.isPlanningStarted !== "undefined") {
        // Quando si carica da file, non c'è un tripId di Supabase
        const payload = { ...data, tripId: null };
        dispatch({ type: LOAD_DATA, payload });
      } else {
        throw new Error("Il file non sembra essere un file di viaggio valido.");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSaveToCloud = async () => {
    if (!user) {
      setSaveError("Devi essere loggato per salvare i dati sul cloud.");
      return;
    }
    setIsSaving(true);
    setSaveSuccess(null);
    setSaveError(null);

    try {
      // Salva l'intero stato del viaggio, inclusi i partecipanti.
      const { data, error } = await saveTrip(user.id, state, state.tripId);

      if (error) {
        throw error;
      }

      if (data && data.id && !state.tripId) {
        // Se è un nuovo viaggio, imposta l'ID e aggiorna lo stato.
        dispatch({ type: SET_TRIP_ID, payload: data.id });
      }

      dispatch({ type: CLEAR_DIRTY });
      setSaveSuccess("Viaggio salvato con successo sul cloud!");
      setLastSaveTimestamp(Date.now());
    } catch (err) {
      setSaveError(err.message || "Errore durante il salvataggio sul cloud.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Gestione Dati</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-4 border rounded">
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <FaSave className="mr-2" /> Salva Dati Viaggio (File)
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            Salva i dati attuali in un file JSON per riprendere in seguito.
          </p>
          <Button onClick={handleSave}>Scarica File Dati</Button>
        </div>

        {/* ... (resto del codice) */}

        <div className="p-4 border rounded">
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <FaCloudUploadAlt className="mr-2" /> Salva su Cloud
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            {user
              ? "Salva il tuo viaggio su Supabase per accedervi da qualsiasi dispositivo."
              : "Accedi per salvare il tuo viaggio sul cloud."}
          </p>
          <Button onClick={handleSaveToCloud} disabled={!user || isSaving}>
            {isSaving
              ? "Salvataggio..."
              : state.tripId
              ? "Aggiorna su Cloud"
              : "Salva su Cloud"}
          </Button>
          {saveSuccess && (
            <p className="mt-2 text-sm text-green-600">{saveSuccess}</p>
          )}
          {saveError && (
            <p className="mt-2 text-sm text-red-600">{saveError}</p>
          )}
        </div>

        <div className="p-4 border rounded">
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <FaCloudDownloadAlt className="mr-2" /> Carica da Cloud
          </h3>
          {user ? (
            <SavedTrips lastSaveTimestamp={lastSaveTimestamp} />
          ) : (
            <p className="text-sm text-gray-500">
              Accedi per visualizzare e caricare i tuoi viaggi salvati.
            </p>
          )}
        </div>

        <div className="p-4 border rounded">
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <FaFolderOpen className="mr-2" /> Carica Dati Viaggio (File)
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            Carica i dati di un viaggio salvato da un file JSON.
          </p>
          <input
            type="file"
            id="load-data-file"
            aria-label="Carica file di viaggio"
            accept=".json"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
          <Button
            onClick={handleLoad}
            disabled={!selectedFile}
            className="mt-3"
            variant="secondary"
          >
            Carica Dati
          </Button>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  );
}

export default DataManager;

import React, { useState, useContext } from "react";
import { TripContext } from "../../state/TripProvider";
import { LOAD_DATA, SET_TRIP_ID, CLEAR_DIRTY } from "../../state/actions";
import { saveDataToFile, loadDataFromFile } from "../../utils/fileUtils";
import { saveLocalTrip } from "../../utils/db";
import { saveTrip as saveTripToCloud } from "../../utils/supabaseClient";
import { useAuth } from "../Auth/AuthProvider";
import {
  FaSave,
  FaFolderOpen,
  FaCloudUploadAlt,
  FaCloudDownloadAlt,
  FaDatabase,
} from "react-icons/fa";
import Button from "../../components/ui/Button";
import SavedTrips from "./SavedTrips";
import LocalSavedTrips from "./LocalSavedTrips";
import toast from "react-hot-toast";

function DataManager() {
  const { state, dispatch } = useContext(TripContext);
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);

  const [isSavingCloud, setIsSavingCloud] = useState(false);
  const [lastCloudSaveTimestamp, setLastCloudSaveTimestamp] = useState(null);

  // State per il salvataggio locale
  const [isSavingLocally, setIsSavingLocally] = useState(false);
  const [lastLocalSaveTimestamp, setLastLocalSaveTimestamp] = useState(null);

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
        // Quando si carica da file, non c'è un tripId di Supabase.
        // Assicuriamoci che ci sia un localId per il salvataggio locale.
        const payload = {
          ...data,
          tripId: null,
          localId: data.localId || `local_${Date.now()}`,
        };
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
      toast.error("Devi essere loggato per salvare i dati sul cloud.");
      return;
    }
    setIsSavingCloud(true);

    try {
      const { data, error } = await saveTripToCloud(user.id, state, state.tripId);

      if (error) {
        throw error;
      }

      if (data && data.id && !state.tripId) {
        // Se è un nuovo viaggio, imposta l'ID e aggiorna lo stato.
        dispatch({ type: SET_TRIP_ID, payload: data.id });
      }

      dispatch({ type: CLEAR_DIRTY });
      toast.success("Viaggio salvato con successo sul cloud!");
      setLastCloudSaveTimestamp(Date.now());
    } catch (err) {
      toast.error(err.message || "Errore durante il salvataggio sul cloud.");
    } finally {
      setIsSavingCloud(false);
    }
  };

  const handleSaveLocally = async () => {
    if (!state.localId) {
      toast.error(
        "Questo viaggio non ha un ID locale e non può essere salvato. Prova a crearne uno nuovo."
      );
      return;
    }
    setIsSavingLocally(true);
    try {
      await saveLocalTrip(state);
      toast.success("Viaggio salvato nel browser!");
      setLastLocalSaveTimestamp(Date.now());
    } catch (err) {
      toast.error(err.message || "Errore nel salvataggio locale.");
    } finally {
      setIsSavingLocally(false);
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

        {user ? (
          <>
            <div className="p-4 border rounded">
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <FaCloudUploadAlt className="mr-2" /> Salva su Cloud
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Salva il tuo viaggio per accedervi da qualsiasi dispositivo.
              </p>
              <Button onClick={handleSaveToCloud} disabled={isSavingCloud}>
                {isSavingCloud
                  ? "Salvataggio..."
                  : state.tripId
                  ? "Aggiorna su Cloud"
                  : "Salva su Cloud"}
              </Button>
            </div>

            <div className="p-4 border rounded">
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <FaCloudDownloadAlt className="mr-2" /> Carica da Cloud
              </h3>
              <SavedTrips lastSaveTimestamp={lastCloudSaveTimestamp} />
            </div>
          </>
        ) : (
          <>
            <div className="p-4 border rounded">
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <FaDatabase className="mr-2" /> Salva su Browser
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Salva le modifiche nel database di questo browser.
              </p>
              <Button onClick={handleSaveLocally} disabled={isSavingLocally}>
                {isSavingLocally ? "Salvataggio..." : "Salva nel Browser"}
              </Button>
            </div>

            <div className="p-4 border rounded">
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <FaDatabase className="mr-2" /> Carica da Browser
              </h3>
              <LocalSavedTrips lastSaveTimestamp={lastLocalSaveTimestamp} />
            </div>
          </>
        )}

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

import React, { useState, useContext } from "react";
import { TripContext } from "../../state/TripProvider";
import { LOAD_DATA } from "../../state/actions";
import { saveDataToFile, loadDataFromFile } from "../../utils/fileUtils";
import { FaSave, FaFolderOpen } from "react-icons/fa";
import Button from "../../components/ui/Button";

function DataManager() {
  const { state, dispatch } = useContext(TripContext);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);

  const handleSave = () => {
    const date = new Date().toISOString().slice(0, 10);
    saveDataToFile(state, `travel-plan-${date}.json`);
  };

  const handleFileChange = (event) => {
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
        dispatch({ type: LOAD_DATA, payload: data });
      } else {
        throw new Error("Il file non sembra essere un file di viaggio valido.");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Gestione Dati</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 border rounded">
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <FaSave className="mr-2" /> Salva Dati Viaggio
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            Salva i dati attuali in un file JSON per riprendere in seguito.
          </p>
          <Button onClick={handleSave}>Scarica File Dati</Button>
        </div>
        <div className="p-4 border rounded">
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <FaFolderOpen className="mr-2" /> Carica Dati Viaggio
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

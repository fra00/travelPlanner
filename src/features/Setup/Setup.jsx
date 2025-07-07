import React, { useState, useContext } from "react";
import { TripContext } from "../../state/TripProvider";
import { START_PLANNING, LOAD_DATA } from "../../state/actions";
import Button from "../../components/ui/Button";

import FormInput from "../../components/ui/FormInput";
import ParticipantManager from "./ParticipantManager";
import { useAuth } from "../Auth/AuthProvider";
import { TRIP_TYPES } from "../../utils/constants";
import CheckboxGroup from "../../components/ui/CheckboxGroup";
import { loadDataFromFile } from "../../utils/fileUtils";
import SavedTrips from "../Data/SavedTrips";
import {
  FaUsers,
  FaRoute,
  FaFolderOpen,
  FaPlusCircle,
  FaPen,
  FaCloudDownloadAlt,
} from "react-icons/fa";

function Setup() {
  const { dispatch } = useContext(TripContext);
  const { user } = useAuth();

  // State for new trip setup
  const [tripName, setTripName] = useState("");
  const [participants, setParticipants] = useState([
    { id: `p_${Date.now()}`, name: "Partecipante 1" },
  ]);
  const [tripTypes, setTripTypes] = useState([TRIP_TYPES[0]]);
  const [isLoading, setIsLoading] = useState(false); // For handling API calls

  // State for loading trip data
  const [selectedFile, setSelectedFile] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const handleAddParticipant = async (userId) => {
    setIsLoading(true);
    // Assuming you want to do something with the backend here.
    console.log(`Adding participant with ID: ${userId}`);
    setIsLoading(false);
  };

  const handleFileChange = (event) => {
    setLoadError(null);
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleStart = () => {
    if (participants.length > 0 && tripName.trim()) {
      dispatch({
        type: START_PLANNING,
        payload: {
          description: tripName,
          participants,
          tripTypes: tripTypes.length > 0 ? tripTypes : [TRIP_TYPES[0]],
        },
      });
    } else {
      alert("Per favore, inserisci un nome per il viaggio.");
    }
  };

  const handleLoad = async () => {
    if (!selectedFile) {
      setLoadError("Per favore, seleziona un file da caricare.");
      return;
    }
    setLoadError(null);
    try {
      const data = await loadDataFromFile(selectedFile);
      if (data && typeof data.isPlanningStarted !== "undefined") {
        dispatch({ type: LOAD_DATA, payload: data });
      } else {
        throw new Error("Il file non sembra essere un file di viaggio valido.");
      }
    } catch (err) {
      setLoadError(err.message);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-stone-700">
          Configura il tuo Viaggio
        </h1>
        <p className="text-stone-500 mt-2 max-w-2xl mx-auto">
          Crea un nuovo piano da zero definendo i partecipanti e il tipo di
          viaggio, oppure carica un'avventura salvata in precedenza.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start pt-6">
        {/* Card per nuovo viaggio */}
        <div className="p-6 border rounded-xl bg-white shadow-sm h-full flex flex-col">
          <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center">
            <FaPlusCircle className="mr-3 text-indigo-500" />
            Crea un nuovo viaggio
          </h2>
          <div className="space-y-6 flex-grow">
            <div>
              <h3 className="text-lg font-semibold text-slate-700 mb-2 flex items-center">
                <FaPen className="mr-2 text-gray-400" />
                Nome del Viaggio
              </h3>
              <FormInput
                id="trip-name"
                type="text"
                value={tripName}
                onChange={(e) => setTripName(e.target.value)}
                placeholder="Es. Avventura in Scozia"
                required
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-700 mb-2 flex items-center">
                <FaRoute className="mr-2" />
                Tipo di Viaggio
              </h3>
              <CheckboxGroup
                options={TRIP_TYPES}
                selectedOptions={tripTypes}
                onChange={setTripTypes}
                maxSelections={3}
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-700 mb-2 flex items-center">
                <FaUsers className="mr-2" />
                Partecipanti
              </h3>
              <ParticipantManager
                participants={participants}
                onParticipantsChange={setParticipants}
                onAddParticipant={handleAddParticipant}
              />
            </div>
          </div>
          <div className="mt-6">
            <Button
              onClick={handleStart}
              className="w-full"
              disabled={!tripName.trim()}
            >
              Inizia Pianificazione
            </Button>
          </div>
        </div>

        {/* Card per riprendere un viaggio */}
        <div className="p-6 border rounded-xl bg-white shadow-sm h-full flex flex-col">
          <div className="flex-grow">
            {user && (
              <div className="pb-6 border-b mb-6">
                <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center">
                  <FaCloudDownloadAlt className="mr-3 text-sky-500" />
                  Carica da Cloud
                </h2>
                <SavedTrips />
              </div>
            )}

            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center">
              <FaFolderOpen className="mr-3 text-amber-500" />
              Carica da File
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              {user
                ? "In alternativa, puoi caricare un piano di viaggio da un file JSON."
                : "Carica un piano di viaggio salvato da un file JSON."}
            </p>
            <input
              type="file"
              id="load-data-file-setup"
              aria-label="Carica file di viaggio"
              accept=".json"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
            {loadError && (
              <p className="mt-2 text-sm text-red-600">{loadError}</p>
            )}
          </div>
          <Button
            onClick={handleLoad}
            disabled={!selectedFile}
            className="mt-3 w-full"
            variant="secondary"
          >
            Carica e Continua
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Setup;

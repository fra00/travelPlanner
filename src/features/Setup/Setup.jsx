import React, { useState, useContext, useEffect } from "react";
import { TripContext, initialState } from "../../state/TripProvider";
import { START_PLANNING, LOAD_DATA } from "../../state/actions";
import Button from "../../components/ui/Button";

import FormInput from "../../components/ui/FormInput";
import ParticipantManager from "./ParticipantManager";
import { useAuth } from "../Auth/AuthProvider";
import { TRIP_TYPES } from "../../utils/constants";
import CheckboxGroup from "../../components/ui/CheckboxGroup";
import { loadDataFromFile } from "../../utils/fileUtils";
import SavedTrips from "../Data/SavedTrips";
import LocalSavedTrips from "../Data/LocalSavedTrips";
import { saveTrip } from "../../utils/supabaseClient";
import toast from "react-hot-toast";
import {
  FaUsers,
  FaRoute,
  FaFolderOpen,
  FaPlusCircle,
  FaDatabase,
  FaPen,
  FaCloudDownloadAlt,
  FaGlobeAmericas,
} from "react-icons/fa";

function Setup() {
  const { dispatch } = useContext(TripContext);
  const { user } = useAuth();

  // State for new trip setup
  const [tripName, setTripName] = useState("");
  const [participants, setParticipants] = useState([]);
  const [tripTypes, setTripTypes] = useState([TRIP_TYPES[0]]);
  const [isPublic, setIsPublic] = useState(false);

  // State for loading trip data
  const [selectedFile, setSelectedFile] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [lastSaveTimestamp, setLastSaveTimestamp] = useState(null);

  // Aggiunge automaticamente l'utente loggato come primo partecipante
  // e previene che venga rimosso se la lista è vuota.
  useEffect(() => {
    if (user && participants.length === 0) {
      setParticipants([{ id: user.id, name: user.email, email: user.email }]);
    }
  }, [user, participants.length]);

  const handleFileChange = (event) => {
    setLoadError(null);
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleStart = async () => {
    if (!tripName.trim()) {
      alert("Per favore, inserisci un nome per il viaggio.");
      return;
    }

    // Se l'utente è loggato, crea subito il viaggio nel cloud
    if (user) {
      toast.loading("Creazione del viaggio in corso...");
      try {
        // Crea uno stato temporaneo per il salvataggio iniziale
        const initialTripStateForSave = {
          ...initialState,
          ownerId: user.id,
          description: tripName,
          participants,
          tripTypes: tripTypes.length > 0 ? tripTypes : [TRIP_TYPES[0]],
          isPublic,
        };

        // saveTrip gestisce l'insert se tripId è null
        const { data: newTrip, error } = await saveTrip(
          user.id,
          initialTripStateForSave,
          null
        );
        if (error) throw error;

        // Avvia la pianificazione con il nuovo tripId
        dispatch({
          type: START_PLANNING,
          payload: {
            tripId: newTrip.id,
            ownerId: user.id,
            description: tripName,
            participants,
            tripTypes: tripTypes.length > 0 ? tripTypes : [TRIP_TYPES[0]],
            isPublic,
          },
        });
        toast.dismiss();
        toast.success("Viaggio creato con successo!");
        setLastSaveTimestamp(Date.now());
      } catch (err) {
        toast.dismiss();
        toast.error(err.message || "Errore durante la creazione del viaggio.");
      }
    } else {
      // Comportamento per utente non loggato
      dispatch({
        type: START_PLANNING,
        payload: {
          localId: `local_${Date.now()}`,
          ownerId: null, // I viaggi locali non hanno un proprietario cloud
          description: tripName,
          participants,
          tripTypes: tripTypes.length > 0 ? tripTypes : [TRIP_TYPES[0]],
          // I viaggi locali non possono essere pubblici
          isPublic: false,
        },
      });
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
                Nome del Viaggio <span className="text-red-500 ml-1">*</span>
              </h3>
              <FormInput
                id="trip-name"
                type="text"
                value={tripName}
                onChange={(e) => setTripName(e.target.value)}
                placeholder="Es. Avventura in Scozia"
                required
                description="Il titolo principale del tuo viaggio, es. 'Weekend a Roma'."
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
                description="Scegli fino a 3 categorie che descrivono il tipo di avventura. Questo influenzerà i suggerimenti per la checklist."
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-700 mb-2 flex items-center">
                <FaUsers className="mr-2" />
                Partecipanti <span className="text-red-500 ml-1">*</span>
              </h3>
              <ParticipantManager
                participants={participants}
                onParticipantsChange={setParticipants}
              />
              <p className="mt-2 text-xs text-gray-500">
                Aggiungi le persone che parteciperanno. Se sei loggato, puoi aggiungerle tramite email per condividere il piano.
              </p>
            </div>
            {user && (
              <div>
                <h3 className="text-lg font-semibold text-slate-700 mb-2 flex items-center">
                  <FaGlobeAmericas className="mr-2 text-gray-400" />
                  Visibilità
                </h3>
                <div className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg">
                  <input
                    type="checkbox"
                    id="is-public-checkbox"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded mt-1"
                  />
                  <div>
                    <label htmlFor="is-public-checkbox" className="block text-sm font-medium text-gray-900">Rendi viaggio pubblico</label>
                    <p className="text-xs text-gray-500">Selezionando questa opzione, il tuo viaggio (senza documenti o checklist) sarà visibile ad altri utenti.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="mt-6">
            <Button
              onClick={handleStart}
              className="w-full"
              disabled={!tripName.trim() || participants.length < 1}
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
                <SavedTrips lastSaveTimestamp={lastSaveTimestamp} />
              </div>
            )}

            {!user && (
              <div className="pb-6 border-b mb-6">
                <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center">
                  <FaDatabase className="mr-3 text-sky-500" />
                  Carica da Browser
                </h2>
                <LocalSavedTrips />
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

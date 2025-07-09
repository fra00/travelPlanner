import React, { useState, useEffect, useContext } from "react";
import { getLocalTripsList, deleteLocalTrip } from "../../utils/db";
import { TripContext } from "../../state/TripProvider";
import { LOAD_DATA } from "../../state/actions";
import Button from "../../components/ui/Button";
import {
  FaSpinner,
  FaExclamationTriangle,
  FaRedo,
  FaTrash,
} from "react-icons/fa";
import toast from "react-hot-toast";

function LocalSavedTrips({ lastSaveTimestamp }) {
  const { dispatch } = useContext(TripContext);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState(null);
  const [loadingTripId, setLoadingTripId] = useState(null);
  const [deletingTripId, setDeletingTripId] = useState(null);

  const fetchLocalTrips = async () => {
    setLoading(true);
    setListError(null);
    try {
      const data = await getLocalTripsList();
      setTrips(data || []);
    } catch (err) {
      setListError(err.message || "Errore nel caricamento dei viaggi locali.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocalTrips();
  }, [lastSaveTimestamp]);

  const handleLoadTrip = async (tripData) => {
    setLoadingTripId(tripData.localId);
    try {
      // L'intero stato del viaggio è già in tripData
      dispatch({ type: LOAD_DATA, payload: tripData });
      toast.success("Viaggio caricato con successo!");
    } catch (err) {
      toast.error(err.message || "Errore nel caricamento del viaggio.");
      console.error(err);
    } finally {
      setLoadingTripId(null);
    }
  };

  const handleDeleteTrip = async (localId, tripName) => {
    if (
      !window.confirm(
        `Sei sicuro di voler eliminare il viaggio "${tripName}"? Verrà rimosso solo da questo browser.`
      )
    ) {
      return;
    }
    setDeletingTripId(localId);
    try {
      await deleteLocalTrip(localId);
      toast.success("Viaggio locale eliminato con successo!");
      fetchLocalTrips(); // Aggiorna la lista
    } catch (err) {
      toast.error(err.message || "Errore durante l'eliminazione del viaggio.");
    } finally {
      setDeletingTripId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4 text-gray-500">
        <FaSpinner className="animate-spin mr-2" /> Caricamento viaggi...
      </div>
    );
  }

  if (listError) {
    return (
      <div className="p-4 text-center text-red-700 bg-red-50 rounded-lg">
        <FaExclamationTriangle className="mx-auto mb-2 h-6 w-6" />
        <p className="font-semibold">Impossibile caricare i viaggi</p>
        <p className="text-sm mb-3">{listError}</p>
        <Button variant="secondary" size="sm" onClick={fetchLocalTrips}>
          <FaRedo className="mr-2" />
          Riprova
        </Button>
      </div>
    );
  }

  if (trips.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        Nessun viaggio salvato in questo browser.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
        {trips.map((trip) => (
          <li
            key={trip.localId}
            className="flex justify-between items-center p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
          >
            <div>
              <p className="font-medium text-gray-800">{trip.description}</p>
              <p className="text-xs text-gray-500">
                Salvato il:{" "}
                {new Date(
                  parseInt(trip.localId.split("_")[1], 10)
                ).toLocaleString("it-IT")}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => handleLoadTrip(trip)}
                disabled={
                  loadingTripId === trip.localId ||
                  deletingTripId === trip.localId
                }
              >
                {loadingTripId === trip.localId ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  "Carica"
                )}
              </Button>
              <Button
                size="sm"
                variant="danger"
                onClick={() => handleDeleteTrip(trip.localId, trip.description)}
                disabled={
                  deletingTripId === trip.localId ||
                  loadingTripId === trip.localId
                }
              >
                {deletingTripId === trip.localId ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  <FaTrash />
                )}
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LocalSavedTrips;

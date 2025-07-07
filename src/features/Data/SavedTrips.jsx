import React, { useState, useEffect, useContext } from "react";
import { useAuth } from "../Auth/AuthProvider";
import { getTripsList, loadTripData } from "../../utils/supabaseClient";
import { TripContext } from "../../state/TripProvider";
import { LOAD_DATA } from "../../state/actions";
import Button from "../../components/ui/Button";
import { FaSpinner, FaExclamationTriangle, FaRedo } from "react-icons/fa";
import toast from "react-hot-toast";

function SavedTrips({ lastSaveTimestamp }) {
  const { user } = useAuth();
  const { dispatch } = useContext(TripContext);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true); // Inizia con lo stato di caricamento
  const [listError, setListError] = useState(null);
  const [loadingTripId, setLoadingTripId] = useState(null);

  const fetchTrips = async () => {
    if (!user) return;
    setLoading(true);
    setListError(null);
    try {
      const { data, error: fetchError } = await getTripsList();
      if (fetchError) throw fetchError;
      setTrips(data || []);
    } catch (err) {
      setListError(err.message || "Errore nel caricamento dei viaggi salvati.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, [user, lastSaveTimestamp]);

  const handleLoadTrip = async (tripId) => {
    setLoadingTripId(tripId);
    try {
      const { data, error: loadError } = await loadTripData(tripId);
      if (loadError) throw loadError;
      dispatch({ type: LOAD_DATA, payload: data });
      toast.success("Viaggio caricato con successo!");
    } catch (err) {
      toast.error(err.message || "Errore nel caricamento del viaggio.");
      console.error(err);
    } finally {
      setLoadingTripId(null);
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
        <Button variant="secondary" size="sm" onClick={fetchTrips}>
          <FaRedo className="mr-2" />
          Riprova
        </Button>
      </div>
    );
  }

  if (trips.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        Nessun viaggio salvato trovato sul cloud.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
        {trips.map((trip) => (
          <li
            key={trip.id}
            className="flex justify-between items-center p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
          >
            <div>
              <p className="font-medium text-gray-800">{trip.trip_name}</p>
              <p className="text-xs text-gray-500">
                Ultima modifica:{" "}
                {new Date(trip.updated_at).toLocaleString("it-IT")}
              </p>
            </div>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => handleLoadTrip(trip.id)}
              disabled={loadingTripId === trip.id}
            >
              {loadingTripId === trip.id ? (
                <FaSpinner className="animate-spin" />
              ) : (
                "Carica"
              )}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SavedTrips;

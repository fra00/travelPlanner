import React, { useState, useEffect, useContext } from "react";
import { useAuth } from "../Auth/AuthProvider";
import { getTripsList, loadTripData, deleteTrip } from "../../utils/supabaseClient";
import { TripContext } from "../../state/TripProvider";
import { deleteDocumentsForTrip } from "../../utils/db";
import { LOAD_DATA } from "../../state/actions";
import Button from "../../components/ui/Button";
import { FaSpinner, FaExclamationTriangle, FaRedo, FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";

function SavedTrips({ lastSaveTimestamp }) {
  const { user } = useAuth();
  const { dispatch } = useContext(TripContext);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true); // Inizia con lo stato di caricamento
  const [listError, setListError] = useState(null);
  const [loadingTripId, setLoadingTripId] = useState(null);
  const [deletingTripId, setDeletingTripId] = useState(null);

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

  const handleDeleteTrip = async (tripId, tripName) => {
    if (
      !window.confirm(
        `Sei sicuro di voler eliminare il viaggio "${tripName}" dal cloud? L'azione è irreversibile.`
      )
    ) {
      return;
    }
    setDeletingTripId(tripId);
    try {
      // La policy RLS di Supabase dovrebbe garantire che solo il proprietario possa eliminare.
      const { error } = await deleteTrip(tripId, user.id);
      if (error) throw error;

      // Elimina anche i documenti locali associati a questo viaggio
      await deleteDocumentsForTrip(tripId);

      toast.success("Viaggio eliminato con successo!");
      fetchTrips(); // Aggiorna la lista
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
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => handleLoadTrip(trip.id)}
                disabled={loadingTripId === trip.id || deletingTripId === trip.id}
              >
                {loadingTripId === trip.id ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  "Carica"
                )}
              </Button>
              {/* Mostra il pulsante Elimina solo se l'utente loggato è il proprietario del viaggio */}
              {trip.is_owner && (
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleDeleteTrip(trip.id, trip.trip_name)}
                  disabled={deletingTripId === trip.id || loadingTripId === trip.id}
                  title="Elimina viaggio"
                >
                  {deletingTripId === trip.id ? <FaSpinner className="animate-spin" /> : <FaTrash />}
                </Button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SavedTrips;

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Supabase URL or anon key is missing. Make sure to set it in your .env file."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Salva o aggiorna un viaggio nel database.
 * @param {string} userId - L'ID dell'utente.
 * @param {object} tripData - L'oggetto completo dello stato del viaggio.
 * @param {string | null} tripId - L'ID del viaggio se esiste già (per aggiornamento).
 * @returns {Promise<{data: object, error: object}>}
 */
export const saveTrip = async (userId, tripData, tripId) => {
  // Separa isPublic dal resto dei dati del viaggio per salvarlo in una colonna dedicata.
  const { isPublic, ...tripDataToSave } = tripData;
  const trip_name =
    tripDataToSave.description ||
    `Viaggio del ${new Date().toLocaleDateString()}`;

  if (tripId) {
    // Aggiorna un viaggio esistente
    const { data, error } = await supabase
      .from("trips")
      // Salva i dati del viaggio e lo stato di visibilità
      .update({ trip_data: tripDataToSave, trip_name, is_public: isPublic })
      .eq("id", tripId) // La policy RLS si occuperà di verificare se l'utente ha i permessi
      // .eq("user_id", userId) <-- Rimuoviamo questo controllo
      .select()
      .single();
    return { data, error };
  }
  // Inserisce un nuovo viaggio
  const { data, error } = await supabase
    .from("trips")
    .insert({
      user_id: userId,
      trip_data: tripDataToSave,
      trip_name,
      is_public: isPublic,
    })
    .select()
    .single();
  return { data, error };
};

/**
 * Recupera la lista dei viaggi salvati per un utente.
 * Include sia i viaggi di cui l'utente è proprietario sia quelli a cui partecipa.
 * @returns {Promise<{data: object[], error: object}>}
 */
export const getTripsList = async () => {
  // Chiama la funzione RPC 'get_user_trips' che restituisce tutti i viaggi
  // associati all'utente corrente (sia come proprietario che come partecipante).
  const { data, error } = await supabase.rpc("get_user_trips");
  return { data, error };
};

/**
 * Carica i dati completi di un viaggio specifico.
 * @param {string} tripId - L'ID del viaggio da caricare.
 * @returns {Promise<{data: object, error: object}>}
 */
export const loadTripData = async (tripId) => {
  const { data, error } = await supabase
    .from("trips")
    .select("trip_data, id, user_id, is_public")
    .eq("id", tripId)
    .single();

  if (error) return { data: null, error };

  // I partecipanti sono ora salvati in `trip_data`.
  // Questo codice gestisce il caricamento per i viaggi più vecchi
  // che potrebbero non avere i partecipanti nel JSON.
  const fullTripData = {
    ...data.trip_data,
    tripId: data.id,
    ownerId: data.user_id,
    isPublic: data.is_public || false,
  };

  if (!fullTripData.participants || fullTripData.participants.length === 0) {
    const { data: participants, error: participantsError } =
      await getTripParticipants(tripId);
    if (participantsError) return { data: null, error: participantsError };
    fullTripData.participants = participants || [];
  }

  return { data: fullTripData, error: null };
};

/**
 * Elimina un viaggio dal database.
 * @param {string} tripId - L'ID del viaggio da eliminare.
 * @param {string} userId - L'ID dell'utente proprietario del viaggio.
 * @returns {Promise<{data: object, error: object}>}
 */
export const deleteTrip = async (tripId, userId) => {
  const { data, error } = await supabase
    .from("trips")
    .delete()
    .eq("id", tripId)
    .eq("user_id", userId);

  return { data, error };
};

/**
 * Aggiunge un partecipante a un viaggio.
 * @param {string} tripId - L'ID del viaggio.
 * @param {string} userId - L'ID dell'utente da aggiungere.
 */
export const addTripParticipant = async (tripId, userId) => {
  return await supabase
    .from("trip_participants")
    // Usa upsert per evitare errori di "chiave duplicata" se il partecipante
    // (es. il proprietario) è già stato aggiunto da un trigger del database.
    // La policy RLS dovrebbe impedire a chiunque non sia il proprietario di aggiungere partecipanti.
    .upsert({ trip_id: tripId, user_id: userId, role: "editor" });
};

/**
 * Rimuove un partecipante da un viaggio.
 * @param {string} tripId - L'ID del viaggio.
 * @param {string} userId - L'ID dell'utente da rimuovere.
 */
export const removeTripParticipant = async (tripId, userId) => {
  return await supabase
    .from("trip_participants")
    .delete()
    .eq("trip_id", tripId)
    .eq("user_id", userId);
};

/**
 * Recupera i partecipanti di un viaggio.
 * @param {string} tripId - L'ID del viaggio.
 * @returns {Promise<{data: object[], error: object}>}
 */
export const getTripParticipants = async (tripId) => {
  // Chiama una funzione RPC per ottenere i partecipanti e le loro email,
  // gestendo il join con la tabella 'profiles' a livello di database.
  const { data, error } = await supabase.rpc("get_trip_participant_details", {
    trip_id_input: tripId,
  });

  if (error) return { data: null, error };

  // Trasforma i dati nel formato usato dall'app
  // La RPC restituisce { user_id, email }. Lo trasformiamo in { id, name }.
  const formattedParticipants = data.map((p) => ({
    id: p.user_id,
    name: p.email,
    email: p.email,
  }));

  return { data: formattedParticipants, error: null };
};

/**
 * Cerca l'ID di un utente tramite la sua email usando una funzione RPC.
 * @param {string} email - L'email dell'utente da cercare.
 * @returns {Promise<{data: {id: string} | null, error: object | null}>}
 */
export const getUserIdByEmail = async (email) => {
  const { data, error } = await supabase.rpc("get_user_id_by_email", {
    email_address: email,
  });

  // La RPC ritorna l'ID direttamente, o null se non trovato.
  return { data: data ? { id: data } : null, error };
};

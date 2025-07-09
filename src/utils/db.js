import { openDB } from "idb";

const DB_NAME = "TravelPlannerDB";
const DB_VERSION = 3;
const DOCS_STORE_NAME = "documents";
const TRIPS_STORE_NAME = "trips";

let dbPromise;

const initDB = () => {
  if (dbPromise) return dbPromise;

  dbPromise = openDB(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion) {
      if (oldVersion < 1) {
        db.createObjectStore(DOCS_STORE_NAME, {
          keyPath: "id",
          autoIncrement: true,
        });
      }
      if (oldVersion < 2) {
        const store = db.transaction(DOCS_STORE_NAME).objectStore(DOCS_STORE_NAME);
        if (!store.indexNames.contains("tripId")) {
          store.createIndex("tripId", "tripId", { unique: false });
        }
      }
      if (oldVersion < 3) {
        db.createObjectStore(TRIPS_STORE_NAME, {
          keyPath: "localId",
        });
      }
    },
  });
  return dbPromise;
};

export const addDocument = async (document, tripId) => {
  const db = await initDB();
  return db.add(DOCS_STORE_NAME, { ...document, tripId });
};

export const getDocuments = async (tripId) => {
  if (!tripId) return [];
  const db = await initDB();
  return db.getAllFromIndex(DOCS_STORE_NAME, "tripId", tripId);
};

export const deleteDocument = async (id) => {
  const db = await initDB();
  return db.delete(DOCS_STORE_NAME, id);
};

export const deleteDocumentsForTrip = async (tripId) => {
  if (!tripId) return;
  const db = await initDB();
  const tx = db.transaction(DOCS_STORE_NAME, "readwrite");
  const index = tx.store.index("tripId");
  for await (const cursor of index.iterate(tripId)) {
    await cursor.delete();
  }
  return tx.done;
};

/** Salva o aggiorna un viaggio in IndexedDB */
export const saveLocalTrip = async (tripState) => {
  const db = await initDB();
  return db.put(TRIPS_STORE_NAME, tripState);
};

/** Recupera la lista dei viaggi salvati localmente */
export const getLocalTripsList = async () => {
  const db = await initDB();
  return db.getAll(TRIPS_STORE_NAME);
};

/** Recupera un singolo viaggio da IndexedDB tramite il suo localId */
export const getLocalTrip = async (localId) => {
  const db = await initDB();
  return db.get(TRIPS_STORE_NAME, localId);
};

/** Elimina un viaggio e i suoi documenti da IndexedDB */
export const deleteLocalTrip = async (localId) => {
  const db = await initDB();
  await deleteDocumentsForTrip(localId); // Usa lo stesso ID per coerenza
  return db.delete(TRIPS_STORE_NAME, localId);
};

export default initDB;

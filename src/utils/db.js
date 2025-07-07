import { openDB } from "idb";

const DB_NAME = "TravelPlannerDB";
const DB_VERSION = 1;
const STORE_NAME = "documents";

let dbPromise;

const initDB = () => {
  if (dbPromise) return dbPromise;

  dbPromise = openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, {
          keyPath: "id",
          autoIncrement: true,
        });
      }
    },
  });
  return dbPromise;
};

export const addDocument = async (document) => {
  const db = await initDB();
  return db.add(STORE_NAME, document);
};

export const getDocuments = async () => {
  const db = await initDB();
  return db.getAll(STORE_NAME);
};

export const deleteDocument = async (id) => {
  const db = await initDB();
  return db.delete(STORE_NAME, id);
};

export default initDB;

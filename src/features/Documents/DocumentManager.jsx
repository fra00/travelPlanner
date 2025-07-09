import React, { useState, useEffect, useContext } from "react";
import { TripContext } from "../../state/TripProvider";
import { addDocument, getDocuments, deleteDocument } from "../../utils/db";
import Button from "../../components/ui/Button";
import {
  FaFileUpload,
  FaFileDownload,
  FaTrash,
  FaEye,
  FaFileAlt,
  FaInfoCircle,
} from "react-icons/fa";
import FormInput from "../../components/ui/FormInput";

function DocumentManager() {
  const { state } = useContext(TripContext);
  const { tripId } = state;

  const [documents, setDocuments] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [documentName, setDocumentName] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const docs = await getDocuments(tripId);
      setDocuments(docs);
    } catch (err) {
      setError("Errore nel caricamento dei documenti.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [tripId]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Pre-compila il nome con il nome del file, senza estensione
      setDocumentName(file.name.replace(/\.[^/.]+$/, ""));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !documentName.trim()) {
      setError("Seleziona un file e inserisci un nome per il documento.");
      return;
    }
    setError(null);
    try {
      // L'oggetto File è un Blob, che può essere memorizzato in IndexedDB.
      const newDoc = {
        name: documentName.trim(),
        file: selectedFile,
        type: selectedFile.type,
        size: selectedFile.size,
      };
      await addDocument(newDoc, tripId);
      setSelectedFile(null);
      setDocumentName("");
      document.getElementById("document-upload-input").value = ""; // Resetta l'input
      await fetchDocuments(); // Aggiorna la lista
    } catch (err) {
      setError("Errore durante il salvataggio del documento.");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Sei sicuro di voler eliminare questo documento?")) {
      try {
        await deleteDocument(id);
        await fetchDocuments(); // Aggiorna la lista
      } catch (err) {
        setError("Errore durante l'eliminazione del documento.");
        console.error(err);
      }
    }
  };

  const handleDownload = (doc) => {
    const url = URL.createObjectURL(doc.file);
    const link = document.createElement("a");
    link.href = url;
    link.download = doc.name; // Usa il nome memorizzato per il download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePreview = (doc) => {
    // Tipi di file che i browser possono visualizzare direttamente
    const viewableTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/gif",
      "text/plain",
    ];
    if (viewableTypes.includes(doc.file.type)) {
      const url = URL.createObjectURL(doc.file);
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      alert(
        `L'anteprima per i file di tipo '${doc.file.type}' non è supportata. Si prega di scaricare il file.`
      );
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Gestione Documenti</h2>
      <div className="p-4 mb-6 text-sm text-blue-800 rounded-lg bg-blue-50" role="alert">
        <div className="flex items-center">
          <FaInfoCircle className="mr-2 flex-shrink-0" />
          <span className="font-medium">I tuoi documenti sono privati e sicuri.</span>
        </div>
        <p className="mt-1 ml-6">I file caricati qui sono salvati <strong>solo nel database di questo browser</strong>. Non vengono sincronizzati sul cloud né condivisi con altri partecipanti.</p>
      </div>
      <div className="p-4 border rounded bg-gray-50 mb-6">
        <h3 className="text-lg font-semibold mb-2">
          Carica un nuovo documento
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          <div>
            <label
              htmlFor="document-upload-input"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Seleziona file <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="file"
              id="document-upload-input"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
            <p className="mt-1 text-xs text-gray-500">
              Scegli un file dal tuo dispositivo (PDF, JPG, PNG, etc.).
            </p>
          </div>
          <FormInput
            label={<>Nome del documento <span className="text-red-500 ml-1">*</span></>}
            id="document-name-input"
            type="text"
            value={documentName}
            onChange={(e) => setDocumentName(e.target.value)}
            placeholder="Es. Biglietto Aereo"
            disabled={!selectedFile}
            description="Un nome facile da ricordare per questo documento."
          />
        </div>
        <Button
          onClick={handleUpload}
          disabled={!selectedFile || !documentName.trim() || !tripId}
          className="mt-3"
        >
          <FaFileUpload className="mr-2" />
          Carica Documento
        </Button>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Documenti Salvati</h3>
        {loading ? (
          <p>Caricamento documenti...</p>
        ) : documents.length === 0 ? (
          <p className="text-gray-500">Nessun documento salvato.</p>
        ) : (
          <ul className="space-y-3">
            {documents.map((doc) => (
              <li
                key={doc.id}
                className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm border"
              >
                <div className="flex items-center">
                  <FaFileAlt className="mr-3 text-gray-400" />
                  <div>
                    <span className="font-medium text-gray-800">
                      {doc.name}
                    </span>
                    <span className="block text-xs text-gray-500">
                      {(doc.size / 1024).toFixed(2)} KB - {doc.type}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handlePreview(doc)}
                  >
                    <FaEye className="mr-2" />
                    Anteprima
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleDownload(doc)}
                  >
                    <FaFileDownload className="mr-2" />
                    Scarica
                  </Button>
                  <Button
                    variant="dangerLink"
                    size="sm"
                    onClick={() => handleDelete(doc.id)}
                  >
                    <FaTrash />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default DocumentManager;

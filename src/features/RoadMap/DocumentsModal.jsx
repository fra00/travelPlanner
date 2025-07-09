import React, { useState, useEffect, useContext } from "react";
import { getDocuments } from "../../utils/db";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import { FaFileDownload, FaEye, FaFileAlt, FaInfoCircle } from "react-icons/fa";
import { TripContext } from "../../state/TripProvider";

function DocumentsModal({ isOpen, onClose }) {
  const { state } = useContext(TripContext);
  const { tripId } = state;
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDocuments = async () => {
    if (!isOpen) {
      return;
    }
    if (!tripId) {
      setDocuments([]); // Svuota i documenti se non c'è un viaggio attivo
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
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
  }, [isOpen, tripId]);

  const handleDownload = (doc) => {
    const url = URL.createObjectURL(doc.file);
    const link = document.createElement("a");
    link.href = url;
    link.download = doc.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePreview = (doc) => {
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
    <Modal isOpen={isOpen} onClose={onClose} title="Documenti del Viaggio">
      <div className="p-3 mb-4 text-xs text-blue-800 rounded-lg bg-blue-50" role="alert">
        <div className="flex items-center">
          <FaInfoCircle className="mr-2 flex-shrink-0" />
          <span className="font-medium">I tuoi documenti sono privati e sicuri.</span>
        </div>
        <p className="mt-1 ml-6">I file sono salvati <strong>solo in questo browser</strong> e non sono condivisi con altri partecipanti.</p>
      </div>
      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
        {error && <p className="text-sm text-red-600">{error}</p>}
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
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="flex justify-end pt-4 mt-4 border-t">
        <Button onClick={onClose}>Chiudi</Button>
      </div>
    </Modal>
  );
}

export default DocumentsModal;

import React, { useState, useEffect } from "react";
import Modal from "../../components/ui/Modal";
import FormInput from "../../components/ui/FormInput";
import Button from "../../components/ui/Button";
import { FaExternalLinkAlt } from "react-icons/fa";

function RoutePlannerDialog({
  isOpen,
  onClose,
  onConfirm,
  day,
  previousDayCity,
}) {
  const [startCity, setStartCity] = useState("");
  const [endCity, setEndCity] = useState("");

  // Pre-compila i campi quando la dialog viene aperta
  useEffect(() => {
    if (isOpen) {
      setStartCity(previousDayCity || "");
      setEndCity(day.city || "");
    }
  }, [isOpen, previousDayCity, day.city]);

  const generateMapsLink = (start, end) => {
    if (!start || !end) return "";
    const baseUrl = "https://www.google.com/maps/dir/";
    return `${baseUrl}${encodeURIComponent(start)}/${encodeURIComponent(end)}`;
  };

  const handleConfirm = () => {
    const link = generateMapsLink(startCity, endCity);
    onConfirm(link);
    onClose();
  };

  const handleOpenMap = () => {
    const link = generateMapsLink(startCity, endCity);
    if (link) {
      window.open(link, "_blank");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Genera Link Google Maps">
      <div className="space-y-4">
        <FormInput
          label={
            <>
              Città di Partenza: <span className="text-red-500 ml-1">*</span>
            </>
          }
          id="start-city"
          value={startCity}
          onChange={(e) => setStartCity(e.target.value)}
          placeholder="Es. Roma"
          description="La città da cui inizia il percorso del giorno. Viene pre-compilata con la destinazione del giorno precedente."
        />
        <FormInput
          label={
            <>
              Città di Arrivo: <span className="text-red-500 ml-1">*</span>
            </>
          }
          id="end-city"
          value={endCity}
          onChange={(e) => setEndCity(e.target.value)}
          placeholder="Es. Milano"
          description="La destinazione finale del percorso del giorno. Viene pre-compilata con la città principale della tappa."
        />
        <div className="flex justify-end space-x-3 pt-4">
          <Button
            variant="secondary"
            onClick={handleOpenMap}
            disabled={!startCity || !endCity}
          >
            <FaExternalLinkAlt className="mr-2" />
            Apri Mappa
          </Button>
          <Button onClick={handleConfirm} disabled={!startCity || !endCity}>
            Conferma e Salva Link
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default RoutePlannerDialog;

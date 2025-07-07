import { useState, useCallback } from "react";

/**
 * Un custom hook per gestire lo stato di un singolo modale attivo alla volta.
 * Semplifica la gestione di più modali in un unico componente.
 *
 * @returns {{
 *   activeModal: string | null,
 *   isModalOpen: (modalName: string) => boolean,
 *   openModal: (modalName: string) => void,
 *   closeModal: () => void
 * }} Un oggetto con lo stato del modale attivo e le funzioni per controllarlo.
 */
export const useModalManager = () => {
  const [activeModal, setActiveModal] = useState(null);

  /**
   * Apre un modale specifico impostandone il nome come attivo.
   * @param {string} modalName - Il nome del modale da aprire.
   */
  const openModal = useCallback((modalName) => {
    setActiveModal(modalName);
  }, []);

  /**
   * Chiude qualsiasi modale attualmente attivo.
   */
  const closeModal = useCallback(() => {
    setActiveModal(null);
  }, []);

  const isModalOpen = useCallback(
    (modalName) => activeModal === modalName,
    [activeModal]
  );

  return { activeModal, isModalOpen, openModal, closeModal };
};

import React, { useContext } from "react";
import { TripContext } from "../../state/TripProvider";
import { useTripMetrics } from "../../hooks/useTripMetrics";
import Modal from "../../components/ui/Modal";
import BalanceSettlement from "../Summary/BalanceSettlement";
import Button from "../../components/ui/Button";

function SettlementModal({ isOpen, onClose }) {
  const { state } = useContext(TripContext);
  const { balanceTransactions } = useTripMetrics(state);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Saldo Spese Condivise">
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Di seguito sono elencate le transazioni necessarie per bilanciare i
          costi tra tutti i partecipanti.
        </p>
        <BalanceSettlement transactions={balanceTransactions} />
        <div className="flex justify-end pt-4">
          <Button onClick={onClose}>Chiudi</Button>
        </div>
      </div>
    </Modal>
  );
}

export default SettlementModal;

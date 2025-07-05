import React from "react";
import { FaBalanceScale, FaArrowRight } from "react-icons/fa";

function BalanceSettlement({ transactions }) {
  if (transactions.length === 0) {
    return (
      <div className="p-4 border rounded-lg bg-green-50 border-green-200 text-center">
        <p className="text-green-800 font-semibold">
          Tutti i conti sono in pari!
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded-lg bg-slate-50">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <FaBalanceScale className="mr-2 text-slate-500" />
        Bilancio Finale
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        Per pareggiare i conti, queste sono le transazioni suggerite:
      </p>
      <ul className="space-y-3">
        {transactions.map((t, index) => (
          <li
            key={index}
            className="flex items-center justify-between p-3 bg-white rounded-md shadow-sm"
          >
            <span className="font-medium text-gray-700">{t.from}</span>
            <div className="flex items-center text-gray-500">
              <FaArrowRight className="mx-2" />
              <span className="font-bold text-lg text-indigo-600">
                {t.amount.toFixed(2)} €
              </span>
              <FaArrowRight className="mx-2" />
            </div>
            <span className="font-medium text-gray-700">{t.to}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BalanceSettlement;

import React from "react";
import Button from "../../components/ui/Button";
import {
  FaRoute,
  FaMoneyBillWave,
  FaTasks,
  FaChartBar,
  FaUsers,
  FaMapMarkedAlt,
} from "react-icons/fa";

const FeatureCard = ({ icon, title, children }) => (
  <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center">
    <div className="flex items-center justify-center w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full mb-4">
      {icon}
    </div>
    <h3 className="text-lg font-semibold text-slate-800 mb-2">{title}</h3>
    <p className="text-slate-600 text-sm">{children}</p>
  </div>
);

function WelcomePage({ onStart }) {
  return (
    <div className="bg-sand-100 -m-6 sm:-m-8 p-6 sm:p-8 text-slate-700">
      <div className="text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold text-stone-800 mb-4">
          Benvenuto in React Travel Planner!
        </h1>
        <p className="text-lg text-stone-600 max-w-3xl mx-auto">
          Il tuo assistente di viaggio definitivo per pianificare, organizzare e
          goderti ogni avventura senza stress.
        </p>
      </div>

      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center text-stone-800 mb-10">
          Caratteristiche Principali
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={<FaMapMarkedAlt size={28} />}
            title="Pianificazione Itinerario"
          >
            Crea un itinerario dettagliato giorno per giorno. Aggiungi città,
            alloggi, distanze e attività per avere sempre tutto sotto controllo.
          </FeatureCard>
          <FeatureCard
            icon={<FaMoneyBillWave size={28} />}
            title="Gestione Spese di Gruppo"
          >
            Tieni traccia di tutte le spese. Il nostro sistema di bilanciamento
            automatico ti dirà esattamente chi deve dare soldi a chi.
          </FeatureCard>
          <FeatureCard
            icon={<FaTasks size={28} />}
            title="Checklist di Viaggio"
          >
            Non dimenticare più nulla! Usa la nostra checklist intelligente per
            preparare i bagagli e le cose da fare prima di partire.
          </FeatureCard>
          <FeatureCard
            icon={<FaChartBar size={28} />}
            title="Statistiche Dettagliate"
          >
            Visualizza grafici e statistiche sul tuo viaggio: costi per persona,
            distribuzione delle spese, chilometri percorsi e molto altro.
          </FeatureCard>
          <FeatureCard
            icon={<FaUsers size={28} />}
            title="Collaborazione Semplice"
          >
            Pianifica viaggi di gruppo senza fatica. Aggiungi partecipanti e
            dividi le spese in modo equo e trasparente.
          </FeatureCard>
          <FeatureCard icon={<FaRoute size={28} />} title="Roadmap Interattiva">
            Una volta pianificato, visualizza il tuo viaggio in una bellissima
            roadmap interattiva, pronta per essere seguita.
          </FeatureCard>
        </div>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-lg mb-12 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-stone-800 mb-6">
          Come Iniziare
        </h2>
        <ol className="space-y-4 list-decimal list-inside text-slate-600">
          <li>
            <strong>Crea il tuo viaggio:</strong> Clicca su "Inizia a
            Progettare", inserisci i partecipanti e il tipo di viaggio.
          </li>
          <li>
            <strong>Pianifica i giorni:</strong> Nella sezione "Pianificazione",
            aggiungi i giorni del tuo itinerario, specificando città, alloggi e
            attività.
          </li>
          <li>
            <strong>Aggiungi le spese:</strong> Inserisci le spese generali (es.
            voli) e quelle giornaliere (es. cene, biglietti).
          </li>
          <li>
            <strong>Controlla il riepilogo:</strong> Tieni d'occhio il budget
            totale e il bilancio tra i partecipanti nella sezione "Riepilogo".
          </li>
          <li>
            <strong>Parti!:</strong> Quando sei pronto, passa alla modalità
            "Roadmap" per una vista chiara e pulita del tuo itinerario giorno
            per giorno.
          </li>
        </ol>
      </div>

      <div className="text-center">
        <Button
          onClick={onStart}
          className="px-10 py-4 text-xl font-bold transform hover:scale-105 transition-transform duration-200"
        >
          Inizia a Progettare
        </Button>
      </div>
    </div>
  );
}

export default WelcomePage;

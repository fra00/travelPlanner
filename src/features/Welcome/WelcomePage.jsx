import React from "react";
import Button from "../../components/ui/Button";
import {
  FaPlaneDeparture,
  FaArrowRight,
  FaUsersCog,
  FaMapMarkedAlt,
  FaCalculator,
  FaChartBar,
} from "react-icons/fa";

// Un piccolo componente per le schede delle funzionalità per mantenere pulito il componente principale
function FeatureCard({ icon, title, children }) {
  return (
    <div className="bg-white/70 p-6 rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-center mb-4">
        <div className="bg-indigo-100 text-indigo-600 p-3 rounded-full mr-4">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-slate-800">{title}</h3>
      </div>
      <p className="text-slate-600 leading-relaxed">{children}</p>
    </div>
  );
}

function WelcomePage({ onStart }) {
  return (
    <div className="space-y-12 py-8">
      <div className="text-center">
        <FaPlaneDeparture className="mx-auto text-6xl text-amber-500 mb-4 animate-pulse" />
        <h1 className="text-4xl sm:text-5xl font-extrabold text-stone-800 mb-3 tracking-tight">
          React Travel Planner
        </h1>
        <p className="text-lg text-stone-600 max-w-3xl mx-auto">
          La tua avventura inizia qui. Pianifica itinerari, gestisci le spese
          di gruppo e tieni tutto sotto controllo in un unico posto. Semplice,
          intuitivo e sempre con te.
        </p>
      </div>

      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-center text-stone-700">
          Come funziona
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FeatureCard icon={<FaUsersCog size={24} />} title="1. Configura il Viaggio">
            Inizia definendo i dettagli base: aggiungi i partecipanti e
            seleziona il tipo di avventura che stai per intraprendere (es. On
            the Road, Culturale, Relax). Puoi anche caricare un viaggio salvato.
          </FeatureCard>
          <FeatureCard icon={<FaMapMarkedAlt size={24} />} title="2. Pianifica le Tappe">
            Aggiungi i giorni del tuo itinerario uno per uno. Per ogni giorno,
            puoi specificare la città di arrivo, l'alloggio, la distanza
            percorsa e le attività da non perdere.
          </FeatureCard>
          <FeatureCard icon={<FaCalculator size={24} />} title="3. Gestisci le Spese">
            Tieni traccia di tutte le spese, sia quelle generali (carburante,
            pedaggi) sia quelle giornaliere (cibo, biglietti). Specifica chi ha
            pagato e se la spesa è da dividere: il bilancio finale sarà
            automatico.
          </FeatureCard>
          <FeatureCard icon={<FaChartBar size={24} />} title="4. Analizza e Salva">
            Visualizza statistiche dettagliate, come il costo per persona e la
            distribuzione delle spese. Quando sei pronto, salva il tuo piano di
            viaggio in un file per non perdere i dati.
          </FeatureCard>
        </div>
      </div>

      <div className="text-center pt-4">
        <Button
          onClick={onStart}
          size="lg"
          className="shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          Inizia a Pianificare Ora
          <FaArrowRight className="ml-3" />
        </Button>
      </div>
    </div>
  );
}

export default WelcomePage;

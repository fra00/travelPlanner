import React, { useState } from "react";
import {
  FaBed,
  FaMapMarkedAlt,
  FaStickyNote,
  FaClock,
  FaRoad,
  FaMapMarkerAlt,
  FaExternalLinkAlt,
  FaEuroSign,
  FaPlusCircle,
} from "react-icons/fa";
import { ROUTE_TYPES } from "../../utils/constants.jsx";
import Button from "../../components/ui/Button";

// A smaller, more integrated info block for the new layout
function InfoCard({ icon, title, children, link, className = "" }) {
  if (!children && !link) return null;

  return (
    <div className={`bg-sand-200/50 p-4 rounded-lg ${className}`}>
      <h4 className="text-sm font-semibold text-stone-500 mb-2 flex items-center">
        {icon}
        <span className="ml-2">{title}</span>
      </h4>
      <div className="text-stone-700 break-words">
        {children}
        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-600 hover:text-sky-800 inline-flex items-center mt-1 text-sm font-semibold"
          >
            Apri link <FaExternalLinkAlt className="ml-2 h-3 w-3" />
          </a>
        )}
      </div>
    </div>
  );
}

function RoadMapDayView({ day, onAddExpense }) {
  if (!day) return null;

  const dayNumber = day.id.split("_")[1];
  const travelSpeed = ROUTE_TYPES[day.routeType] || 80;
  const travelTime = travelSpeed > 0 ? day.distance / travelSpeed : 0;
  const dailyTotalCost = day.expenses.reduce(
    (acc, exp) => acc + exp.amount,
    0
  );

  return (
    <>
      <div className="bg-white/50 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-lg border border-stone-200/50 space-y-6">
        {/* Day Header */}
        <div className="pb-4 border-b border-stone-200">
          <h3 className="text-3xl font-bold text-stone-700">
            Giorno {dayNumber}:{" "}
            <span className="text-sky-700">{day.city || "Tappa da definire"}</span>
          </h3>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column: Itinerary & Notes */}
          <div className="md:col-span-2 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoCard icon={<FaRoad />} title="Distanza">
                <p className="text-2xl font-bold">{day.distance || 0} km</p>
              </InfoCard>
              <InfoCard icon={<FaClock />} title="Tempo di guida stimato">
                <p className="text-2xl font-bold">{travelTime.toFixed(2)} ore</p>
              </InfoCard>
            </div>
            <InfoCard icon={<FaStickyNote />} title="Note">
              {day.notes ? (
                <p className="whitespace-pre-wrap text-sm">{day.notes}</p>
              ) : (
                <p className="text-stone-400 italic text-sm">Nessuna nota.</p>
              )}
            </InfoCard>
            <InfoCard
              icon={<FaMapMarkerAlt />}
              title="Attività e Luoghi da Visitare"
            >
              {day.activities.length > 0 ? (
                <ul className="space-y-3">
                  {day.activities.map((activity) => (
                    <li
                      key={activity.id}
                      className="p-3 bg-white rounded-lg border flex justify-between items-center text-sm"
                    >
                      <span className="text-stone-800">{activity.description}</span>
                      {activity.mapLink && (
                        <a
                          href={activity.mapLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sky-600 hover:text-sky-800 inline-flex items-center font-semibold"
                        >
                          Mappa <FaExternalLinkAlt className="ml-2 h-3 w-3" />
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-stone-400 italic text-sm">
                  Nessuna attività pianificata.
                </p>
              )}
            </InfoCard>
          </div>

          {/* Right Column: Accommodation & Expenses */}
          <div className="md:col-span-1 space-y-6">
            <InfoCard icon={<FaBed />} title="Alloggio" link={day.structureLink}>
              {!day.structureLink && (
                <p className="text-stone-400 italic text-sm">
                  Nessun link alloggio.
                </p>
              )}
            </InfoCard>
            <InfoCard
              icon={<FaMapMarkedAlt />}
              title="Link Google Maps"
              link={day.mapLink}
            >
              {!day.mapLink && (
                <p className="text-stone-400 italic text-sm">
                  Nessun link itinerario.
                </p>
              )}
            </InfoCard>
            <div className="bg-sand-200/50 p-4 rounded-lg">
              <h4 className="text-sm font-semibold text-stone-500 mb-2 flex items-center">
                <FaEuroSign className="mr-2" />
                Spese del Giorno
              </h4>
              <p className="text-3xl font-bold text-stone-700 mb-3">
                {dailyTotalCost.toFixed(2)} €
              </p>
              {day.expenses.length > 0 && (
                <ul className="space-y-2 text-xs mb-4">
                  {day.expenses.map((expense) => (
                    <li
                      key={expense.id}
                      className="flex justify-between items-center"
                    >
                      <span className="text-stone-600">
                        {expense.description}
                      </span>
                      <span className="font-semibold text-stone-800">
                        {expense.amount.toFixed(2)} €
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              <Button
                variant="secondary"
                onClick={onAddExpense}
                className="w-full"
              >
                <FaPlusCircle className="mr-2" /> Aggiungi
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default RoadMapDayView;
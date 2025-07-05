import React, { useContext } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { FaTrash } from "react-icons/fa";
import { TripContext } from "../../state/TripProvider";
import { REORDER_DAYS, DELETE_DAY, ADD_DAY } from "../../state/actions";
import { SortableItem } from "./SortableItem";
import Button from "../../components/ui/Button";

function DayList({ days, selectedDayId, onSelectDay }) {
  const { dispatch } = useContext(TripContext);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      // Non iniziare il trascinamento finché il puntatore non si è mosso di almeno 5px.
      // Questo permette al `onClick` di essere registrato correttamente.
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDeleteDay(e, dayId) {
    e.stopPropagation(); // Impedisce la selezione del giorno e l'inizio del trascinamento
    if (
      window.confirm(
        "Sei sicuro di voler eliminare questo giorno? L'azione è irreversibile."
      )
    ) {
      dispatch({ type: DELETE_DAY, payload: { dayId } });
    }
  }

  function handleAddDay() {
    dispatch({ type: ADD_DAY });
  }

  function handleDragEnd(event) {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = days.findIndex((day) => day.id === active.id);
      const newIndex = days.findIndex((day) => day.id === over.id);
      const reorderedDays = arrayMove(days, oldIndex, newIndex);
      dispatch({ type: REORDER_DAYS, payload: reorderedDays });
    }
  }

  return (
    <div className="bg-gray-50 p-4 rounded">
      <h3 className="text-lg font-semibold mb-4">
        Giorni (Trascina per riordinare)
      </h3>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={days} strategy={verticalListSortingStrategy}>
          <ul className="space-y-2">
            {days.map((day, index) => (
              <SortableItem key={day.id} id={day.id}>
                <div
                  onClick={() => onSelectDay(day.id)}
                  className={`w-full text-left p-2 rounded transition-colors duration-150 flex justify-between items-center cursor-grab ${
                    day.id === selectedDayId
                      ? "bg-indigo-500 text-white shadow"
                      : "bg-white hover:bg-gray-200"
                  }`}
                >
                  <span>
                    Giorno {index + 1}: {day.city || "Da definire"}
                  </span>
                  <Button
                    variant="dangerLink"
                    onClick={(e) => handleDeleteDay(e, day.id)}
                    className="p-1 text-sm opacity-60 hover:opacity-100"
                    aria-label={`Elimina Giorno ${index + 1}`}
                  >
                    <FaTrash />
                  </Button>
                </div>
              </SortableItem>
            ))}
          </ul>
        </SortableContext>
      </DndContext>
      <div className="mt-4">
        <Button variant="secondary" onClick={handleAddDay} className="w-full">
          Aggiungi Giorno
        </Button>
      </div>
    </div>
  );
}

export default DayList;

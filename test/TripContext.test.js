import { tripReducer, initialState } from "../src/state/TripContext";
import {
  START_PLANNING,
  LOAD_DATA,
  SWITCH_TAB,
  UPDATE_OVERVIEW,
  UPDATE_DAY_DETAILS,
  REORDER_DAYS,
} from "../src/state/actions";

describe("tripReducer", () => {
  test("should return the initial state for unknown actions", () => {
    const action = { type: "UNKNOWN_ACTION" };
    const newState = tripReducer(initialState, action);
    expect(newState).toEqual(initialState);
  });

  test("should handle START_PLANNING", () => {
    const action = {
      type: START_PLANNING,
      payload: { numDays: 3, numPeople: 2, avgDrivingSpeed: 90 },
    };
    const newState = tripReducer(initialState, action);

    expect(newState.isPlanningStarted).toBe(true);
    expect(newState.numDays).toBe(3);
    expect(newState.numPeople).toBe(2);
    expect(newState.avgDrivingSpeed).toBe(90);
    expect(newState.days).toHaveLength(3);
    expect(newState.days[0]).toHaveProperty("id");
    expect(newState.days[0].city).toBe("");
  });

  test("should handle LOAD_DATA", () => {
    const loadedData = {
      isPlanningStarted: false, // This will be overridden to true
      activeTab: "summary",
      numDays: 5,
      days: [{ id: "day1" }],
      // ... other properties
    };
    const action = { type: LOAD_DATA, payload: loadedData };
    const newState = tripReducer(initialState, action);

    expect(newState.isPlanningStarted).toBe(true);
    expect(newState.activeTab).toBe("summary");
    expect(newState.numDays).toBe(5);
  });

  test("should handle SWITCH_TAB", () => {
    const action = { type: SWITCH_TAB, payload: "planning" };
    const newState = tripReducer(initialState, action);
    expect(newState.activeTab).toBe("planning");
  });

  test("should handle UPDATE_OVERVIEW", () => {
    const action = {
      type: UPDATE_OVERVIEW,
      payload: { description: "A new trip" },
    };
    const newState = tripReducer(initialState, action);
    expect(newState.description).toBe("A new trip");
  });

  test("should handle UPDATE_DAY_DETAILS", () => {
    const stateWithDays = {
      ...initialState,
      days: [
        { id: "day1", city: "Rome", distance: 0 },
        { id: "day2", city: "Florence", distance: 0 },
      ],
    };
    const action = {
      type: UPDATE_DAY_DETAILS,
      payload: { dayId: "day2", details: { city: "Venice", distance: 300 } },
    };
    const newState = tripReducer(stateWithDays, action);

    // Controlla che il primo giorno non sia stato modificato
    expect(newState.days[0].city).toBe("Rome");
    // Controlla che il secondo giorno sia stato aggiornato correttamente
    expect(newState.days[1].city).toBe("Venice");
    expect(newState.days[1].distance).toBe(300);
  });

  test("should handle REORDER_DAYS", () => {
    const stateWithDays = {
      ...initialState,
      days: [
        { id: "day1", city: "A" },
        { id: "day2", city: "B" },
        { id: "day3", city: "C" },
      ],
    };
    const reorderedDays = [
      { id: "day3", city: "C" },
      { id: "day1", city: "A" },
      { id: "day2", city: "B" },
    ];
    const action = { type: REORDER_DAYS, payload: reorderedDays };
    const newState = tripReducer(stateWithDays, action);

    expect(newState.days).toEqual(reorderedDays);
    expect(newState.days[0].id).toBe("day3");
  });
});

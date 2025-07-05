import {
  START_PLANNING,
  LOAD_DATA,
  SWITCH_TAB,
  UPDATE_OVERVIEW,
  UPDATE_FUEL,
  UPDATE_GENERAL_EXPENSES,
  UPDATE_DAY_DETAILS,
  REORDER_DAYS,
  DELETE_DAY,
  ADD_DAY,
  UPDATE_PARTICIPANTS,
  RESET_DATA,
  UPDATE_CHECKLIST,
  SET_VIEW_MODE,
} from "./actions";

export const initialState = {
  isPlanningStarted: false,
  activeTab: "overview",
  description: "",
  viewMode: "planning", // 'planning' or 'roadmap'
  tripTypes: ["Generico"], // Da stringa ad array
  overallMapLink: "",
  fuel: {
    costPerLiter: 1.8,
    kmPerLiter: 15,
  },
  generalExpenses: [], // { id, description, amount, perPerson }
  participants: [], // { id, name }
  days: [], // { id, city, structureLink, mapLink, distance, notes, activities: [], expenses: [], routeType }
  checklist: [], // { id, description, checked, suggested }
};

export const tripReducer = (state, action) => {
  switch (action.type) {
    case START_PLANNING:
      return {
        ...state,
        isPlanningStarted: true,
        participants: action.payload.participants,
        viewMode: "planning", // Vai alla pianificazione dopo il setup
        tripTypes: action.payload.tripTypes,
        // Inizia sempre con 1 giorno, può essere modificato dopo
        days: Array.from({ length: 1 }, (_, i) => ({
          id: `day_${i + 1}_${Date.now()}`,
          city: "",
          structureLink: "",
          mapLink: "",
          distance: 0,
          notes: "",
          activities: [],
          expenses: [],
          routeType: "Strada statale",
        })),
        checklist: [], // Resetta la checklist all'inizio di un nuovo viaggio
      };
    case LOAD_DATA:
      return {
        ...action.payload,
        viewMode: "roadmap", // All'avvio, mostra la roadmap
        isPlanningStarted: true,
      };
    case SWITCH_TAB:
      return { ...state, activeTab: action.payload };
    case UPDATE_OVERVIEW:
    case UPDATE_FUEL:
    case UPDATE_GENERAL_EXPENSES:
      return { ...state, ...action.payload };
    case UPDATE_DAY_DETAILS:
      return {
        ...state,
        days: state.days.map((day) =>
          day.id === action.payload.dayId
            ? { ...day, ...action.payload.details }
            : day
        ),
      };
    case REORDER_DAYS:
      return {
        ...state,
        days: action.payload,
      };
    case DELETE_DAY: {
      const newDays = state.days.filter(
        (day) => day.id !== action.payload.dayId
      );
      return {
        ...state,
        days: newDays,
      };
    }
    case ADD_DAY: {
      const newDay = {
        id: `day_${state.days.length + 1}_${Date.now()}`,
        city: "",
        structureLink: "",
        mapLink: "",
        distance: 0,
        notes: "",
        activities: [],
        expenses: [],
        routeType: "Strada statale",
      };
      return { ...state, days: [...state.days, newDay] };
    }
    case UPDATE_PARTICIPANTS:
      return {
        ...state,
        participants: action.payload.participants,
      };
    case RESET_DATA:
      return { ...initialState };
    case UPDATE_CHECKLIST:
      return { ...state, checklist: action.payload };
    case SET_VIEW_MODE:
      return { ...state, viewMode: action.payload };

    default:
      return state;
  }
};

import { renderHook } from "@testing-library/react";
import { useTripMetrics } from "../src/hooks/useTripMetrics";
import { initialState } from "../src/state/TripContext";

describe("useTripMetrics Custom Hook", () => {
  test("should return zero values for the initial state", () => {
    // Renderizza l'hook con lo stato iniziale vuoto
    const { result } = renderHook(() => useTripMetrics(initialState));

    expect(result.current.totalDistance).toBe(0);
    expect(result.current.estimatedFuelCost).toBe(0);
    expect(result.current.totalCost).toBe(0);
    expect(result.current.costPerPerson).toBe(0);
  });

  test("should calculate metrics correctly for a simple trip", () => {
    const mockState = {
      ...initialState,
      numPeople: 2,
      numDays: 2,
      fuel: { costPerLiter: 2, kmPerLiter: 10 },
      days: [
        {
          id: "day1",
          distance: 100,
          expenses: [{ id: "de1", amount: 50, perPerson: false }],
        },
        { id: "day2", distance: 150, expenses: [] },
      ],
      generalExpenses: [{ id: "ge1", amount: 30, perPerson: false }],
    };

    const { result } = renderHook(() => useTripMetrics(mockState));

    // Distanza totale = 100 + 150 = 250
    expect(result.current.totalDistance).toBe(250);

    // Costo carburante = (250km / 10km/L) * 2€/L = 50€
    expect(result.current.estimatedFuelCost).toBe(50);

    // Costo totale = 50 (carburante) + 30 (generale) + 50 (giorno 1) = 130€
    expect(result.current.totalCost).toBe(130);

    // Costo per persona = 130€ / 2 = 65€
    expect(result.current.costPerPerson).toBe(65);

    // Costo per giorno = 130€ / 2 = 65€
    expect(result.current.costPerDay).toBe(65);
  });

  test('should handle "per person" expenses correctly', () => {
    const mockState = {
      ...initialState,
      numPeople: 2,
      numDays: 1,
      fuel: { costPerLiter: 2, kmPerLiter: 10 },
      days: [
        {
          id: "day1",
          distance: 100,
          expenses: [{ id: "de1", amount: 25, perPerson: true }],
        },
      ],
      generalExpenses: [{ id: "ge1", amount: 15, perPerson: true }],
    };

    const { result } = renderHook(() => useTripMetrics(mockState));

    // Costo carburante = (100km / 10km/L) * 2€/L = 20€
    expect(result.current.estimatedFuelCost).toBe(20);

    // Spesa generale calcolata = 15€ * 2 persone = 30€
    // Spesa giorno 1 calcolata = 25€ * 2 persone = 50€
    // Costo totale = 20 (carburante) + 30 (generale) + 50 (giorno 1) = 100€
    expect(result.current.totalCost).toBe(100);

    // Costo per persona = 100€ / 2 = 50€
    expect(result.current.costPerPerson).toBe(50);
  });

  test("should prepare data correctly for expense distribution chart", () => {
    const mockState = {
      ...initialState,
      numPeople: 1,
      fuel: { costPerLiter: 1, kmPerLiter: 10 },
      days: [
        {
          id: "day1",
          distance: 100,
          expenses: [{ id: "de1", amount: 30, perPerson: false }],
        },
      ],
      generalExpenses: [{ id: "ge1", amount: 20, perPerson: false }],
    };

    const { result } = renderHook(() => useTripMetrics(mockState));

    const chartData = result.current.expenseDistributionData.datasets[0].data;
    // Dati attesi: [costo carburante, totale spese generali, totale spese giornaliere]
    // Costo carburante = (100/10)*1 = 10
    expect(chartData).toEqual([10, 20, 30]);
  });
});

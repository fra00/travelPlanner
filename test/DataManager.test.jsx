import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DataManager from "../src/features/Data/DataManager";
import { TripContext } from "../src/state/TripProvider";
import * as fileUtils from "../src/utils/fileUtils";

// Mock del modulo fileUtils per evitare interazioni reali con il file system
jest.mock("../src/utils/fileUtils");

// Funzione helper per renderizzare il componente con un provider di contesto fittizio
const renderWithProvider = (component, providerProps) => {
  return render(
    <TripContext.Provider value={providerProps}>
      {component}
    </TripContext.Provider>
  );
};

describe("DataManager Component", () => {
  let mockDispatch;
  let mockState;

  // Resetta i mock e lo stato prima di ogni test
  beforeEach(() => {
    mockDispatch = jest.fn();
    mockState = { isPlanningStarted: true, days: [] }; // Un semplice stato fittizio
    // Pulisce le chiamate precedenti ai mock
    fileUtils.saveDataToFile.mockClear();
    fileUtils.loadDataFromFile.mockClear();
  });

  test("dovrebbe chiamare saveDataToFile con lo stato corrente quando si clicca il bottone di salvataggio", async () => {
    renderWithProvider(<DataManager />, {
      state: mockState,
      dispatch: mockDispatch,
    });

    const saveButton = screen.getByRole("button", {
      name: /scarica file dati/i,
    });
    await userEvent.click(saveButton);

    expect(fileUtils.saveDataToFile).toHaveBeenCalledTimes(1);
    // Controlla che sia stato chiamato con lo stato e un nome file nel formato atteso
    expect(fileUtils.saveDataToFile).toHaveBeenCalledWith(
      mockState,
      expect.stringContaining("travel-plan-")
    );
  });

  test("dovrebbe chiamare loadDataFromFile e inviare un'azione quando un file valido viene caricato", async () => {
    const mockTripData = { isPlanningStarted: true, days: [{ id: "day1" }] };
    // Simula il valore risolto della promise dalla funzione di utilità
    fileUtils.loadDataFromFile.mockResolvedValue(mockTripData);

    renderWithProvider(<DataManager />, {
      state: mockState,
      dispatch: mockDispatch,
    });

    const fileInput = screen.getByLabelText(/carica file di viaggio/i);
    const loadButton = screen.getByRole("button", { name: /carica dati/i });

    // Crea un file fittizio
    const file = new File([JSON.stringify(mockTripData)], "trip.json", {
      type: "application/json",
    });

    // Simula la selezione di un file da parte dell'utente
    await userEvent.upload(fileInput, file);

    // Simula il click sul bottone di caricamento
    await userEvent.click(loadButton);

    expect(fileUtils.loadDataFromFile).toHaveBeenCalledTimes(1);
    expect(fileUtils.loadDataFromFile).toHaveBeenCalledWith(file);

    // Usa `waitFor` per attendere che le operazioni asincrone (incluso il dispatch) si completino.
    // Questo assicura che l'aggiornamento di stato causato dal dispatch sia
    // "avvolto" in un act() prima che il test termini.
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledTimes(1);
      expect(mockDispatch).toHaveBeenCalledWith({
        type: "LOAD_DATA",
        payload: mockTripData,
      });
    });
  });

  test("dovrebbe mostrare un errore se il file caricato non è valido", async () => {
    // Simula la funzione che lancia un errore
    const errorMessage = "Errore nel parsing del file JSON.";
    fileUtils.loadDataFromFile.mockRejectedValue(new Error(errorMessage));

    renderWithProvider(<DataManager />, {
      state: mockState,
      dispatch: mockDispatch,
    });

    const fileInput = screen.getByLabelText(/carica file di viaggio/i);
    const loadButton = screen.getByRole("button", { name: /carica dati/i });

    const file = new File(["contenuto invalido"], "trip.json", {
      type: "application/json",
    });
    await userEvent.upload(fileInput, file);
    await userEvent.click(loadButton);

    // Controlla che il messaggio di errore della promise rigettata sia visualizzato
    expect(await screen.findByText(errorMessage)).toBeInTheDocument();
    expect(mockDispatch).not.toHaveBeenCalled();
  });
});

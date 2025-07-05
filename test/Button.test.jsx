import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Button from "../src/components/ui/Button";

describe("Button Component", () => {
  test("renders children correctly", () => {
    render(<Button>Click Me</Button>);
    // Cerca un elemento con il ruolo 'button' e il nome 'Click Me'
    expect(
      screen.getByRole("button", { name: /click me/i })
    ).toBeInTheDocument();
  });

  test("applies the correct variant class", () => {
    render(<Button variant="success">Success</Button>);
    const button = screen.getByRole("button", { name: /success/i });
    // Controlla che la classe specifica per la variante 'success' sia presente
    expect(button).toHaveClass("bg-green-600");
  });

  test("calls onClick handler when clicked", async () => {
    const handleClick = jest.fn(); // Crea una funzione "spia"
    render(<Button onClick={handleClick}>Clickable</Button>);

    const button = screen.getByRole("button", { name: /clickable/i });
    await userEvent.click(button);

    // Verifica che la nostra funzione spia sia stata chiamata esattamente una volta
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});

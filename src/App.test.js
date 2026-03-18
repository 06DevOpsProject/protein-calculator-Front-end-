import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

jest.mock("./components/ProteinList", () => () => <div data-testid="protein-list-mock">Protein List Mock</div>);

describe("App", () => {
  test("renders main title and protein list", () => {
    render(<App />);

    expect(screen.getByText(/Protein Calculator/i)).toBeInTheDocument();
    expect(screen.getByTestId("protein-list-mock")).toBeInTheDocument();
  });
});

import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

jest.mock("./components/ProteinList", () => () => <div>Mocked Protein List</div>);

describe("App", () => {
  it("renders title and protein list placeholder", () => {
    render(<App />);

    expect(screen.getByText(/Protein Calculator/i)).toBeInTheDocument();
    expect(screen.getByText(/Mocked Protein List/i)).toBeInTheDocument();
  });
});

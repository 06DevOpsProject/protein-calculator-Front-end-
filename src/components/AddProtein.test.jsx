import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AddProtein from "./AddProtein";
import ProteinService from "../services/ProteinService";

jest.mock("../services/ProteinService", () => {
  return {
    __esModule: true,
    default: {
      create: jest.fn()
    }
  };
});

const mockedService = ProteinService;

describe("AddProtein", () => {
  beforeAll(() => {
    window.alert = jest.fn();
  });

  beforeEach(() => {
    mockedService.create.mockReset();
    jest.clearAllMocks();
  });

  it("submits form and calls ProteinService.create on success", async () => {
    mockedService.create.mockResolvedValueOnce({ data: { id: 1 } });

    render(<AddProtein />);

    await userEvent.type(screen.getByPlaceholderText("Name"), "John");
    await userEvent.type(screen.getByPlaceholderText("Age"), "30");
    await userEvent.type(screen.getByPlaceholderText("Weight"), "70");
    await userEvent.type(screen.getByPlaceholderText("Height"), "180");
    await userEvent.type(
      screen.getByPlaceholderText("Goal (bulking/cutting)"),
      "bulking"
    );

    await userEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(mockedService.create).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith("User Added Successfully");
    });
  });

  it("shows error alert when create fails", async () => {
    const error = { response: { data: { message: "Backend error" } } };
    mockedService.create.mockRejectedValueOnce(error);

    render(<AddProtein />);

    await userEvent.type(screen.getByPlaceholderText("Name"), "John");
    await userEvent.type(screen.getByPlaceholderText("Age"), "30");
    await userEvent.type(screen.getByPlaceholderText("Weight"), "70");
    await userEvent.type(screen.getByPlaceholderText("Height"), "180");
    await userEvent.type(
      screen.getByPlaceholderText("Goal (bulking/cutting)"),
      "bulking"
    );

    await userEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(mockedService.create).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalled();
    });
  });
});

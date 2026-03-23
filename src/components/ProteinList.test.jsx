import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProteinList from "./ProteinList";
import ProteinService from "../services/ProteinService";

jest.mock("../services/ProteinService", () => {
  return {
    __esModule: true,
    default: {
      getAll: jest.fn(),
      create: jest.fn(),
      updatePartial: jest.fn(),
      delete: jest.fn()
    }
  };
});

const mockedService = ProteinService;

describe("ProteinList", () => {
  beforeEach(() => {
    mockedService.getAll.mockReset();
    mockedService.create.mockReset();
    mockedService.updatePartial.mockReset();
    mockedService.delete.mockReset();
  });

  it("loads and displays users from the service", async () => {
    mockedService.getAll.mockResolvedValueOnce({
      data: [
        {
          id: 1,
          name: "John",
          age: 30,
          weight: 70,
          height: 180,
          goal: "bulking",
          proteinRequired: 120.1234
        }
      ]
    });

    render(<ProteinList />);

    expect(screen.getByText(/Loading users/i)).toBeInTheDocument();

    expect(await screen.findByText("Users List")).toBeInTheDocument();
    expect(screen.getByText("John")).toBeInTheDocument();
    expect(screen.getByText("120.12")).toBeInTheDocument();
  });

  it("can open the add user form", async () => {
    mockedService.getAll.mockResolvedValueOnce({ data: [] });

    const user = userEvent.setup();
    render(<ProteinList />);

    const addButton = await screen.findByText("+ Add New User");
    await user.click(addButton);

    expect(screen.getByText("Add New User")).toBeInTheDocument();
  });

  it("can delete a user after confirmation", async () => {
    mockedService.getAll.mockResolvedValueOnce({
      data: [
        {
          id: 1,
          name: "John",
          age: 30,
          weight: 70,
          height: 180,
          goal: "bulking",
          proteinRequired: 120
        }
      ]
    });

    mockedService.delete.mockResolvedValueOnce({});

    const confirmSpy = jest.spyOn(window, "confirm").mockReturnValue(true);
    const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {});

    const user = userEvent.setup();
    render(<ProteinList />);

    const deleteButton = await screen.findByText("Delete");
    await user.click(deleteButton);

    await waitFor(() => {
      expect(mockedService.delete).toHaveBeenCalledWith(1);
    });

    confirmSpy.mockRestore();
    alertSpy.mockRestore();
  });
});

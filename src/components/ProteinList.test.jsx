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
  beforeAll(() => {
    window.alert = jest.fn();
    window.confirm = jest.fn();
    window.prompt = jest.fn();
  });

  beforeEach(() => {
    mockedService.getAll.mockReset();
    mockedService.create.mockReset();
    mockedService.updatePartial.mockReset();
    mockedService.delete.mockReset();
    jest.clearAllMocks();
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

    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();

    expect(await screen.findByText("Users List")).toBeInTheDocument();
    expect(await screen.findByText("John")).toBeInTheDocument();
    expect(screen.getByText("120.12")).toBeInTheDocument();
  });

  it("can open the add user form", async () => {
    mockedService.getAll.mockResolvedValueOnce({ data: [] });

    render(<ProteinList />);

    const addButton = await screen.findByText("+ Add New User");
    await userEvent.click(addButton);

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

    window.prompt.mockReturnValue("2005");
    window.confirm.mockReturnValue(true);

    render(<ProteinList />);

    const deleteButton = await screen.findByText("Delete");
    await userEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockedService.delete).toHaveBeenCalledWith(1);
    });
  });

  it("shows validation error when submitting empty form", async () => {
    mockedService.getAll.mockResolvedValueOnce({ data: [] });

    render(<ProteinList />);

    const addButton = await screen.findByText("+ Add New User");
    await userEvent.click(addButton);

    const saveButton = screen.getByRole("button", { name: /add/i });
    await userEvent.click(saveButton);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Please fill all fields");
    });
  });

  it("creates a new user successfully", async () => {
    mockedService.getAll.mockResolvedValueOnce({ data: [] });
    mockedService.create.mockResolvedValueOnce({ data: { id: 2 } });

    render(<ProteinList />);

    const addButton = await screen.findByText("+ Add New User");
    await userEvent.click(addButton);

    await userEvent.type(screen.getByPlaceholderText("Name"), "Alice");
    await userEvent.type(screen.getByPlaceholderText("Age"), "25");
    await userEvent.type(screen.getByPlaceholderText("Weight"), "60");
    await userEvent.type(screen.getByPlaceholderText("Height"), "170");
    await userEvent.selectOptions(screen.getByRole("combobox"), "bulking");

    const saveButton = screen.getByRole("button", { name: /add/i });
    await userEvent.click(saveButton);

    await waitFor(() => {
      expect(mockedService.create).toHaveBeenCalled();
    });
  });

  it("loads users error path when service fails", async () => {
    const error = { response: { data: { message: "Server down" } } };
    mockedService.getAll.mockRejectedValueOnce(error);

    render(<ProteinList />);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalled();
    });
  });

  it("does not delete user when wrong password is entered", async () => {
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

    window.prompt.mockReturnValue("wrong-password");
    window.confirm.mockReturnValue(true);

    render(<ProteinList />);

    const deleteButton = await screen.findByText("Delete");
    await userEvent.click(deleteButton);

    expect(mockedService.delete).not.toHaveBeenCalled();
    expect(window.confirm).not.toHaveBeenCalled();
  });
});

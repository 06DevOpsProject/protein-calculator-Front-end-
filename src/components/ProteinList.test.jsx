import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import ProteinList from "./ProteinList";
import ProteinService from "../services/ProteinService";

jest.mock("../services/ProteinService");

const mockUsers = [
  {
    id: 1,
    name: "John",
    age: 30,
    weight: 80,
    height: 180,
    goal: "bulking",
    proteinRequired: 160
  }
];

beforeEach(() => {
  jest.clearAllMocks();
});

describe("ProteinList", () => {
  test("loads and displays users", async () => {
    ProteinService.getAll.mockResolvedValueOnce({ data: mockUsers });

    render(<ProteinList />);

    expect(screen.getByText(/Loading users.../i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("John")).toBeInTheDocument();
      expect(screen.getByText("Users List")).toBeInTheDocument();
    });
  });

  test("opens add form and validates required fields", async () => {
    ProteinService.getAll.mockResolvedValueOnce({ data: [] });
    window.alert = jest.fn();

    render(<ProteinList />);

    await waitFor(() => {
      expect(screen.getByText(/No users found/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/Add New User/i));

    const submitButton = screen.getByRole("button", { name: /Add/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Please fill all fields");
    });
  });

  test("deletes a user when confirmed", async () => {
    ProteinService.getAll.mockResolvedValueOnce({ data: mockUsers });
    ProteinService.delete.mockResolvedValueOnce({});
    window.confirm = jest.fn(() => true);

    render(<ProteinList />);

    await waitFor(() => {
      expect(screen.getByText("John")).toBeInTheDocument();
    });

    const deleteButton = screen.getByRole("button", { name: /Delete/i });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(ProteinService.delete).toHaveBeenCalledWith(1);
    });
  });
});

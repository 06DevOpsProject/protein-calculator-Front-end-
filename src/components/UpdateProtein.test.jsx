import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import UpdateProtein from "./UpdateProtein";
import ProteinService from "../services/ProteinService";

jest.mock("../services/ProteinService", () => {
  return {
    __esModule: true,
    default: {
      updatePartial: jest.fn()
    }
  };
});

const mockedService = ProteinService;

describe("UpdateProtein", () => {
  beforeAll(() => {
    window.alert = jest.fn();
  });

  beforeEach(() => {
    mockedService.updatePartial.mockReset();
    jest.clearAllMocks();
  });

  it("returns null when no selectedUser is provided", () => {
    const { container } = render(<UpdateProtein selectedUser={null} refresh={() => {}} />);
    expect(container.firstChild).toBeNull();
  });

  it("updates user and calls refresh on success", async () => {
    const selectedUser = {
      id: 1,
      name: "John",
      age: 30,
      weight: 70,
      height: 180,
      goal: "bulking",
      proteinRequired: 120
    };

    const refresh = jest.fn();
    mockedService.updatePartial.mockResolvedValueOnce({});

    render(<UpdateProtein selectedUser={selectedUser} refresh={refresh} />);

    await userEvent.type(screen.getByPlaceholderText("Name"), " Doe");

    await userEvent.click(screen.getByRole("button", { name: /update/i }));

    await waitFor(() => {
      expect(mockedService.updatePartial).toHaveBeenCalled();
      expect(refresh).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith("Updated successfully");
    });
  });
});

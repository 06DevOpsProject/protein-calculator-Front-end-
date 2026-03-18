import { apiRequest } from "./apiService";
import axios from "axios";

jest.mock("axios");

const mockPrimaryClient = {
  request: jest.fn()
};

const mockSecondaryClient = {
  request: jest.fn()
};

jest.mock("axios", () => ({
  create: jest.fn((config) => {
    if (!axios.__primaryCreated) {
      axios.__primaryCreated = true;
      return mockPrimaryClient;
    }
    return mockSecondaryClient;
  })
}));

describe("apiRequest", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test("uses primary client for successful request", async () => {
    mockPrimaryClient.request.mockResolvedValueOnce({ data: { ok: true } });

    const { apiRequest: freshApiRequest } = await import("./apiService");

    const result = await freshApiRequest({ method: "get", url: "/test" });

    expect(result).toEqual({ data: { ok: true } });
  });
});

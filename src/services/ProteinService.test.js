import proteinService from "./ProteinService";
import { apiRequest } from "./apiService";

jest.mock("./apiService", () => ({
  apiRequest: jest.fn()
}));

describe("ProteinService", () => {
  beforeEach(() => {
    apiRequest.mockReset();
  });

  it("getAll calls apiRequest with GET", async () => {
    const mockResponse = { data: [] };
    apiRequest.mockResolvedValueOnce(mockResponse);

    const result = await proteinService.getAll();

    expect(apiRequest).toHaveBeenCalledWith({
      method: "get",
      url: "/api/protein"
    });
    expect(result).toBe(mockResponse);
  });

  it("create sends normalized payload", async () => {
    const user = { name: "John", age: "30", weight: "70", height: "180", goal: "bulking" };
    apiRequest.mockResolvedValueOnce({ data: { id: 1 } });

    await proteinService.create(user);

    expect(apiRequest).toHaveBeenCalledWith({
      method: "post",
      url: "/api/protein",
      data: {
        name: "John",
        age: 30,
        weight: 70,
        height: 180,
        goal: "bulking"
      }
    });
  });

  it("updatePartial sends normalized payload with id", async () => {
    const user = { name: "Jane", age: "25", weight: "60", height: "170", goal: "cutting" };
    apiRequest.mockResolvedValueOnce({ data: { id: 2 } });

    await proteinService.updatePartial(2, user);

    expect(apiRequest).toHaveBeenCalledWith({
      method: "put",
      url: "/api/protein/2",
      data: {
        name: "Jane",
        age: 25,
        weight: 60,
        height: 170,
        goal: "cutting"
      }
    });
  });

  it("delete calls apiRequest with delete method and id", async () => {
    apiRequest.mockResolvedValueOnce({});

    await proteinService.delete(5);

    expect(apiRequest).toHaveBeenCalledWith({
      method: "delete",
      url: "/api/protein/5"
    });
  });
});

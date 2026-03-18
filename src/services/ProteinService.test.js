import ProteinService from "./ProteinService";
import { apiRequest } from "./apiService";

jest.mock("./apiService", () => ({
  apiRequest: jest.fn()
}));

describe("ProteinService", () => {
  const user = {
    name: "John",
    age: "30",
    weight: "80",
    height: "180",
    goal: "bulking"
  };

  beforeEach(() => {
    apiRequest.mockClear();
  });

  test("getAll calls apiRequest with correct config", async () => {
    await ProteinService.getAll();
    expect(apiRequest).toHaveBeenCalledWith({
      method: "get",
      url: "/api/protein"
    });
  });

  test("create sends normalized payload", async () => {
    await ProteinService.create(user);
    expect(apiRequest).toHaveBeenCalledWith({
      method: "post",
      url: "/api/protein",
      data: {
        name: "John",
        age: 30,
        weight: 80,
        height: 180,
        goal: "bulking"
      }
    });
  });

  test("updatePartial sends normalized payload with id", async () => {
    await ProteinService.updatePartial(1, user);
    expect(apiRequest).toHaveBeenCalledWith({
      method: "put",
      url: "/api/protein/1",
      data: {
        name: "John",
        age: 30,
        weight: 80,
        height: 180,
        goal: "bulking"
      }
    });
  });

  test("delete calls apiRequest with correct config", async () => {
    await ProteinService.delete(1);
    expect(apiRequest).toHaveBeenCalledWith({
      method: "delete",
      url: "/api/protein/1"
    });
  });
});

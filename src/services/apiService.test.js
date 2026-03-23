describe("apiRequest", () => {
  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    delete process.env.REACT_APP_ENABLE_CROSS_BACKEND_FALLBACK;
  });

  it("returns response from primary client when successful", async () => {
    jest.doMock("axios", () => {
      const primary = jest.fn().mockResolvedValue({ data: "primary" });
      const secondary = jest.fn();
      const create = jest
        .fn()
        .mockReturnValueOnce(primary)
        .mockReturnValueOnce(secondary);

      return {
        __esModule: true,
        default: { create },
        create
      };
    });

    let apiRequest;
    jest.isolateModules(() => {
      ({ apiRequest } = require("./apiService"));
    });

    const result = await apiRequest({ method: "get", url: "/test" });
    expect(result).toEqual({ data: "primary" });
  });

  it("falls back to secondary client when enabled and primary fails with retryable error", async () => {
    process.env.REACT_APP_ENABLE_CROSS_BACKEND_FALLBACK = "true";

    jest.doMock("axios", () => {
      const primary = jest.fn().mockRejectedValue({
        message: "Server error",
        response: { status: 500 }
      });
      const secondary = jest.fn().mockResolvedValue({ data: "secondary" });

      const create = jest
        .fn()
        .mockReturnValueOnce(primary)
        .mockReturnValueOnce(secondary);

      return {
        __esModule: true,
        default: { create },
        create
      };
    });

    const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});

    let apiRequest;
    jest.isolateModules(() => {
      ({ apiRequest } = require("./apiService"));
    });

    const result = await apiRequest({ method: "get", url: "/test" });

    expect(result).toEqual({ data: "secondary" });
    expect(warnSpy).toHaveBeenCalled();

    warnSpy.mockRestore();
  });
});

import { apiRequest } from "./apiService";

const BASE_PATH = "/api/protein";

function buildUserPayload(user) {
  return {
    name: user?.name,
    age: Number(user?.age),
    weight: Number(user?.weight),
    height: Number(user?.height),
    goal: user?.goal
  };
}

class ProteinService {

  async getAll() {
    return apiRequest({
      method: "get",
      url: BASE_PATH
    });
  }

  async create(user) {
    const payload = buildUserPayload(user);

    return apiRequest({
      method: "post",
      url: BASE_PATH,
      data: payload
    });
  }

  async updatePartial(id, user) {
    const payload = buildUserPayload(user);

    try {
      return await apiRequest({
        method: "patch",
        url: `${BASE_PATH}/${id}`,
        data: payload
      });
    } catch (error) {
      // Some deployments reject PATCH (403/405) but accept PUT.
      if (error?.response?.status === 403 || error?.response?.status === 405) {
        return apiRequest({
          method: "put",
          url: `${BASE_PATH}/${id}`,
          data: payload
        });
      }

      throw error;
    }
  }

  async delete(id) {
    return apiRequest({
      method: "delete",
      url: `${BASE_PATH}/${id}`
    });
  }
}

const proteinService = new ProteinService();

export default proteinService;

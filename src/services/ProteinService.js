import axios from "axios";

const BASE_URL = "https://protein-calculator-back-end.onrender.com/api/protein";

class ProteinService {

  getAll() {
    return axios.get(BASE_URL);
  }

  create(user) {
    return axios.post(BASE_URL, user);
  }

  updatePartial(id, user) {
    return axios.patch(`${BASE_URL}/${id}`, user);
  }

  delete(id) {
    return axios.delete(`${BASE_URL}/${id}`);
  }
}

const proteinService = new ProteinService();

export default proteinService;

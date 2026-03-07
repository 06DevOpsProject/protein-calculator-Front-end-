import axios from "axios";

// Base URL for the backend API
// - In production (Vercel), you can override this with REACT_APP_API_BASE_URL
// - By default, it points to the Render backend URL
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL ||
  "https://protein-calculator-back-end.onrender.com";

const BASE_URL = `${API_BASE_URL}/api/protein`;

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

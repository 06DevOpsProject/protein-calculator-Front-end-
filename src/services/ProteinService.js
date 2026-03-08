import axios from "axios";

function resolveApiBaseUrl() {
  const renderUrl = "https://protein-calculator-back-end.onrender.com";
  const localUrl = "http://localhost:8080";
  const envUrl = process.env.REACT_APP_API_BASE_URL;

  // Highest priority: explicit env override
  if (envUrl) {
    return envUrl;
  }

  // If running in a browser, choose URL based on host
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    const isLocalHost =
      host === "localhost" || host === "127.0.0.1" || host === "::1";

    // Local React dev → talk to local Spring Boot on 8080
    if (isLocalHost) {
      return localUrl;
    }

    // Deployed frontend (e.g. Vercel) → use Render backend
    return renderUrl;
  }

  // Fallback (e.g. during build) → Render URL
  return renderUrl;
}

const API_BASE_URL = resolveApiBaseUrl();
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

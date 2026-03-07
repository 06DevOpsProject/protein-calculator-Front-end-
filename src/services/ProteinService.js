import axios from "axios";

// Resolve backend base URL in a way that works both
// locally and on hosted environments (Vercel + Render).
// - Default: Render backend URL
// - Env override: REACT_APP_API_BASE_URL
// - Safety: if env points to localhost but the app is running
//   on a non-localhost domain (e.g. Vercel), fall back to Render.
function resolveApiBaseUrl() {
  const defaultUrl = "https://protein-calculator-back-end.onrender.com";
  const envUrl = process.env.REACT_APP_API_BASE_URL;

  if (!envUrl) {
    return defaultUrl;
  }

  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    const isLocalHost =
      host === "localhost" || host === "127.0.0.1" || host === "::1";
    const envIsLocal =
      envUrl.includes("localhost") ||
      envUrl.includes("127.0.0.1") ||
      envUrl.includes("::1");

    // Prevent using a localhost backend from a deployed frontend
    if (envIsLocal && !isLocalHost) {
      return defaultUrl;
    }
  }

  return envUrl;
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

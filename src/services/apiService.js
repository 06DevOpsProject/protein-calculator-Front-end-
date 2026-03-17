import axios from "axios";

const AZURE_API_BASE_URL =
  process.env.REACT_APP_AZURE_API_BASE_URL ||
  "https://protein-backend-karthick-cthnh3awa4gybcgm.austriaeast-01.azurewebsites.net";

const RENDER_API_BASE_URL =
  process.env.REACT_APP_RENDER_API_BASE_URL ||
  "https://protein-calculator-back-end.onrender.com";

const isLocalDev =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

// In local dev, use CRA proxy (package.json -> proxy) to avoid CORS/preflight issues.
const LOCAL_DEV_PROXY_BASE_URL = "";

// Keep a single primary backend by default to avoid cross-backend data mismatch.
const PRIMARY_API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || (isLocalDev ? LOCAL_DEV_PROXY_BASE_URL : AZURE_API_BASE_URL);

const SECONDARY_API_BASE_URL =
  PRIMARY_API_BASE_URL === RENDER_API_BASE_URL
    ? AZURE_API_BASE_URL
    : RENDER_API_BASE_URL;

// Off by default: switching between different backend databases can break update/delete.
const ENABLE_CROSS_BACKEND_FALLBACK =
  process.env.REACT_APP_ENABLE_CROSS_BACKEND_FALLBACK === "true";

// Render free-tier cold starts can take up to ~60 seconds.
// Keep timeout higher to avoid failing update/create calls during wake-up.
const REQUEST_TIMEOUT_MS = Number(process.env.REACT_APP_REQUEST_TIMEOUT_MS || 90000);

const primaryClient = axios.create({
  baseURL: PRIMARY_API_BASE_URL,
  timeout: REQUEST_TIMEOUT_MS
});

const secondaryClient = axios.create({
  baseURL: SECONDARY_API_BASE_URL,
  timeout: REQUEST_TIMEOUT_MS
});

function shouldRetryWithFallback(error, config = {}) {
  if (!ENABLE_CROSS_BACKEND_FALLBACK) {
    return false;
  }

  const method = String(config.method || "get").toLowerCase();

  // Avoid retrying non-idempotent operations on a different backend
  // to prevent cross-database inconsistencies.
  if (method !== "get") {
    return false;
  }

  // Network error / timeout
  if (!error.response) {
    return true;
  }

  // Azure server unavailable / gateway issues
  const retryStatusCodes = [500, 502, 503, 504];
  return retryStatusCodes.includes(error.response.status);
}

export async function apiRequest(config) {
  try {
    return await primaryClient(config);
  } catch (primaryError) {
    if (!shouldRetryWithFallback(primaryError, config)) {
      throw primaryError;
    }

    console.warn("Primary API failed. Retrying with fallback API.", {
      primaryBaseURL: PRIMARY_API_BASE_URL,
      fallbackBaseURL: SECONDARY_API_BASE_URL,
      message: primaryError.message,
      code: primaryError.code,
      status: primaryError.response?.status
    });

    return secondaryClient(config);
  }
}

export { AZURE_API_BASE_URL, RENDER_API_BASE_URL };

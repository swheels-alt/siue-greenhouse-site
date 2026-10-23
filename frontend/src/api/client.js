// The only place the front end talks to the server (QA plan 3.1).
const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

/**
 * Fetch JSON from the greenhouse API.
 * @param {string} path API path, for example "/health".
 * @returns {Promise<unknown>} The parsed JSON body.
 * @throws {Error} When the server answers with a non-2xx status.
 */
export async function getJson(path) {
  const response = await fetch(`${API_BASE}${path}`);
  if (!response.ok) {
    throw new Error(`GET ${path} failed with status ${response.status}`);
  }
  return response.json();
}

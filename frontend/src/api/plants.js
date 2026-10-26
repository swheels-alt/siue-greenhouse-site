// Plant inventory data. Components get plants only through this module (QA plan 3.1).
//
// Prototype: returns the sample list in content/plants.sample.json. When ADR 0001 picks the
// web framework and GET /api/v1/plants exists, this function calls getJson("/api/v1/plants")
// instead, and no component changes.
import sample from "../content/plants.sample.json";

/**
 * @typedef {object} Plant
 * @property {number} id Inventory id.
 * @property {string} commonName The name most visitors know.
 * @property {string} scientificName Genus and species.
 * @property {string} category The group the plant is filed under, for example "Tropical".
 */

/**
 * List the plants in the greenhouse inventory.
 * @returns {Promise<{plants: Plant[], sample: boolean, sampleNote: string}>} The plants, and
 *   whether they are sample data.
 */
export async function listPlants() {
  return { plants: sample.plants, sample: sample.sample, sampleNote: sample.sampleNote };
}

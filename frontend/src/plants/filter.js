// Plant search and filtering for the inventory page.

/**
 * Lower-case text and strip accents, so "Café" and "cafe" match.
 * @param {string} text Any text.
 * @returns {string} The text, ready to compare.
 */
export function normalize(text) {
  return (text ?? "")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

/**
 * Keep the plants whose common or scientific name contains the query, in the chosen category.
 * @param {import("../api/plants.js").Plant[]} plants The whole inventory.
 * @param {{query?: string, category?: string}} criteria What the visitor typed and chose; an
 *   empty query or category matches everything.
 * @returns {import("../api/plants.js").Plant[]} The matching plants, sorted by common name.
 */
export function filterPlants(plants, { query = "", category = "" } = {}) {
  const wanted = normalize(query);
  return plants
    .filter((plant) => !category || plant.category === category)
    .filter(
      (plant) =>
        !wanted ||
        normalize(plant.commonName).includes(wanted) ||
        normalize(plant.scientificName).includes(wanted),
    )
    .sort((first, second) => first.commonName.localeCompare(second.commonName));
}

/**
 * List the categories in the inventory, for the filter menu.
 * @param {import("../api/plants.js").Plant[]} plants The whole inventory.
 * @returns {string[]} Each category once, alphabetically.
 */
export function categoriesOf(plants) {
  return [...new Set(plants.map((plant) => plant.category))].sort((first, second) =>
    first.localeCompare(second),
  );
}

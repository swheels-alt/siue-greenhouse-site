import { useEffect, useMemo, useState } from "react";
import { listPlants } from "../api/plants.js";
import { categoriesOf, filterPlants } from "../plants/filter.js";

/**
 * The search box and the category menu.
 * @param {object} props Component props.
 * @param {string} props.query What the visitor typed.
 * @param {string} props.category The chosen category; "" for all.
 * @param {string[]} props.categories Every category in the inventory.
 * @param {(query: string) => void} props.onQuery Called as the visitor types.
 * @param {(category: string) => void} props.onCategory Called when a category is chosen.
 * @returns {import("react").JSX.Element} The search form.
 */
function PlantSearchForm({ query, category, categories, onQuery, onCategory }) {
  return (
    <form className="plant-search" role="search" onSubmit={(event) => event.preventDefault()}>
      <div className="field">
        <label htmlFor="plant-query">Search by name</label>
        <input
          id="plant-query"
          type="search"
          value={query}
          placeholder="Common or scientific name"
          onChange={(event) => onQuery(event.target.value)}
        />
      </div>
      <div className="field">
        <label htmlFor="plant-category">Type of plant</label>
        <select
          id="plant-category"
          value={category}
          onChange={(event) => onCategory(event.target.value)}
        >
          <option value="">All types</option>
          {categories.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>
    </form>
  );
}

/**
 * The matching plants, or a message when nothing matches.
 * @param {object} props Component props.
 * @param {import("../api/plants.js").Plant[]} props.plants The plants to show.
 * @param {() => void} props.onClear Clears the search.
 * @returns {import("react").JSX.Element} The results.
 */
function PlantResults({ plants, onClear }) {
  if (plants.length === 0) {
    return (
      <div className="card">
        <p>No plants match your search.</p>
        <button type="button" className="button" onClick={onClear}>
          Clear search
        </button>
      </div>
    );
  }
  return (
    <ul className="plant-list">
      {plants.map((plant) => (
        <li key={plant.id} className="plant-card">
          <h2 className="plant-name">{plant.commonName}</h2>
          <p className="plant-scientific">{plant.scientificName}</p>
          <p className="plant-category">{plant.category}</p>
        </li>
      ))}
    </ul>
  );
}

/**
 * Plant inventory: search by common or scientific name and filter by type.
 * @returns {import("react").JSX.Element} The plants page.
 */
export default function PlantsPage() {
  const [inventory, setInventory] = useState(null);
  const [failed, setFailed] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    listPlants()
      .then(setInventory)
      .catch(() => setFailed(true));
  }, []);

  const plants = useMemo(() => inventory?.plants ?? [], [inventory]);
  const categories = useMemo(() => categoriesOf(plants), [plants]);
  const matches = useMemo(
    () => filterPlants(plants, { query, category }),
    [plants, query, category],
  );
  const clear = () => {
    setQuery("");
    setCategory("");
  };

  return (
    <>
      <h1>Plant inventory</h1>
      {inventory?.sample && (
        <p className="notice" role="note">
          {inventory.sampleNote}
        </p>
      )}
      {failed && <p role="alert">The plant list could not be loaded. Please try again later.</p>}
      {!failed && !inventory && <p>Loading plants…</p>}
      {inventory && (
        <>
          <PlantSearchForm
            query={query}
            category={category}
            categories={categories}
            onQuery={setQuery}
            onCategory={setCategory}
          />
          <p className="result-count" aria-live="polite">
            Showing {matches.length} of {plants.length} plants
          </p>
          <PlantResults plants={matches} onClear={clear} />
        </>
      )}
    </>
  );
}

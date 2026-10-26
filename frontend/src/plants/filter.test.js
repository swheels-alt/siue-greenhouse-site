import { describe, expect, it } from "vitest";
import { categoriesOf, filterPlants, normalize } from "./filter.js";

const plants = [
  {
    id: 1,
    commonName: "Venus flytrap",
    scientificName: "Dionaea muscipula",
    category: "Carnivorous",
  },
  { id: 2, commonName: "Coffee plant", scientificName: "Coffea arabica", category: "Tropical" },
  { id: 3, commonName: "Cape sundew", scientificName: "Drosera capensis", category: "Carnivorous" },
];
const names = (list) => list.map((plant) => plant.commonName);

describe("normalize", () => {
  it("lower-cases, trims and strips accents", () => {
    expect(normalize("  Café ")).toBe("cafe");
  });

  it("treats a missing value as empty", () => {
    expect(normalize(undefined)).toBe("");
  });
});

describe("filterPlants", () => {
  it("returns every plant, sorted by common name, with no criteria", () => {
    expect(names(filterPlants(plants))).toEqual(["Cape sundew", "Coffee plant", "Venus flytrap"]);
  });

  it("matches part of a common name, ignoring case", () => {
    expect(names(filterPlants(plants, { query: "FLY" }))).toEqual(["Venus flytrap"]);
  });

  it("matches part of a scientific name", () => {
    expect(names(filterPlants(plants, { query: "arabica" }))).toEqual(["Coffee plant"]);
  });

  it("ignores spaces around the query", () => {
    expect(names(filterPlants(plants, { query: "  sundew  " }))).toEqual(["Cape sundew"]);
  });

  it("keeps only the chosen category", () => {
    expect(names(filterPlants(plants, { category: "Carnivorous" }))).toEqual([
      "Cape sundew",
      "Venus flytrap",
    ]);
  });

  it("applies the query and the category together", () => {
    expect(filterPlants(plants, { query: "coffee", category: "Carnivorous" })).toEqual([]);
  });

  it("returns nothing when no name matches", () => {
    expect(filterPlants(plants, { query: "orchid" })).toEqual([]);
  });

  it("does not change the list it was given", () => {
    const copy = [...plants];
    filterPlants(plants, { query: "c" });
    expect(plants).toEqual(copy);
  });
});

describe("categoriesOf", () => {
  it("lists each category once, alphabetically", () => {
    expect(categoriesOf(plants)).toEqual(["Carnivorous", "Tropical"]);
  });
});

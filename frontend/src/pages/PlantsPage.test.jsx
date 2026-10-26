import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import * as plantsApi from "../api/plants.js";
import PlantsPage from "./PlantsPage.jsx";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("PlantsPage", () => {
  it("lists the inventory and says it is sample data", async () => {
    render(<PlantsPage />);
    expect(await screen.findByText("Venus flytrap")).toBeInTheDocument();
    expect(screen.getByRole("note")).toHaveTextContent(/Sample plants/);
    expect(screen.getByText("Showing 13 of 13 plants")).toBeInTheDocument();
  });

  it("narrows the list as the visitor types a name", async () => {
    render(<PlantsPage />);
    fireEvent.change(await screen.findByLabelText("Search by name"), {
      target: { value: "cacao" },
    });
    expect(screen.getByText("Showing 1 of 13 plants")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Cacao tree" })).toBeInTheDocument();
  });

  it("filters by type of plant", async () => {
    render(<PlantsPage />);
    fireEvent.change(await screen.findByLabelText("Type of plant"), {
      target: { value: "Ferns" },
    });
    expect(screen.getByText("Showing 1 of 13 plants")).toBeInTheDocument();
    expect(screen.getByText("Boston fern")).toBeInTheDocument();
  });

  it("says when nothing matches and lets the visitor clear the search", async () => {
    render(<PlantsPage />);
    fireEvent.change(await screen.findByLabelText("Search by name"), {
      target: { value: "no such plant" },
    });
    expect(screen.getByText("No plants match your search.")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Clear search" }));
    expect(screen.getByLabelText("Search by name")).toHaveValue("");
    expect(screen.getByText("Showing 13 of 13 plants")).toBeInTheDocument();
  });

  it("tells the visitor in plain language when the list cannot load", async () => {
    vi.spyOn(plantsApi, "listPlants").mockRejectedValue(new Error("network down"));
    render(<PlantsPage />);
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "The plant list could not be loaded. Please try again later.",
    );
    expect(screen.queryByLabelText("Search by name")).not.toBeInTheDocument();
  });
});

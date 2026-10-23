import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App.jsx";

describe("App", () => {
  it("shows the site heading as the page's main heading", () => {
    render(<App />);
    expect(screen.getByRole("heading", { level: 1, name: "SIUE Greenhouse" })).toBeInTheDocument();
  });

  it("puts the content in a main landmark for screen readers", () => {
    render(<App />);
    expect(screen.getByRole("main")).toBeInTheDocument();
  });
});

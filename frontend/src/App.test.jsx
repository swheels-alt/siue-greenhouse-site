import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import App from "./App.jsx";

/**
 * Show a page by changing the location hash, as a link click does.
 * @param {string} hash The new hash, for example "#/plants".
 */
function goTo(hash) {
  act(() => {
    window.location.hash = hash;
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  });
}

afterEach(() => {
  window.location.hash = "";
});

describe("App", () => {
  it("shows the site heading as the page's main heading", () => {
    render(<App />);
    expect(screen.getByRole("heading", { level: 1, name: "SIUE Greenhouse" })).toBeInTheDocument();
  });

  it("puts the content in a main landmark for screen readers", () => {
    render(<App />);
    expect(screen.getByRole("main")).toBeInTheDocument();
  });

  it("marks the current page in the main navigation", () => {
    render(<App />);
    const nav = screen.getByRole("navigation", { name: "Main" });
    expect(nav.querySelector('[aria-current="page"]')).toHaveTextContent("Home");
  });

  it("shows a not-found page with a way home for an unknown address", () => {
    render(<App />);
    goTo("#/no-such-page");
    expect(screen.getByRole("heading", { level: 1, name: "Page not found" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Go to the home page" })).toHaveAttribute("href", "#/");
    expect(document.title).toBe("Page not found · SIUE Greenhouse");
  });

  it("moves focus to the main content after a page change", () => {
    render(<App />);
    goTo("#/no-such-page");
    expect(screen.getByRole("main")).toHaveFocus();
  });

  it("skip link moves focus to the main content without changing the page", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("link", { name: "Skip to main content" }));
    expect(screen.getByRole("main")).toHaveFocus();
    expect(window.location.hash).toBe("");
  });
});

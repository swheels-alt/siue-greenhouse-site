import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import VisitSection from "./VisitSection.jsx";

const visit = {
  placeholder: false,
  placeholderNote: "",
  addressLines: ["Example Building", "Edwardsville, IL 62026"],
  mapUrl: "https://maps.example.test/greenhouse",
  hours: [
    { day: "Monday", open: "09:00", close: "17:00" },
    { day: "Sunday", closed: true },
  ],
};

describe("VisitSection (issue #3)", () => {
  it('is a section headed "Visit the greenhouse"', () => {
    render(<VisitSection visit={visit} />);
    expect(screen.getByRole("region", { name: "Visit the greenhouse" })).toBeInTheDocument();
  });

  it("shows every address line", () => {
    render(<VisitSection visit={visit} />);
    expect(screen.getByText("Example Building")).toBeInTheDocument();
    expect(screen.getByText("Edwardsville, IL 62026")).toBeInTheDocument();
  });

  it("links to the map in a new tab and says so to screen readers", () => {
    render(<VisitSection visit={visit} />);
    const link = screen.getByRole("link", {
      name: /^Get directions\s*\(opens a map in a new tab\)$/,
    });
    expect(link).toHaveAttribute("href", visit.mapUrl);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("shows each day's hours as text, and Closed for a closed day", () => {
    render(<VisitSection visit={visit} />);
    const monday = screen.getByText("Monday").closest(".hours-row");
    const sunday = screen.getByText("Sunday").closest(".hours-row");
    expect(within(monday).getByText("9:00 AM – 5:00 PM")).toBeInTheDocument();
    expect(within(sunday).getByText("Closed")).toBeInTheDocument();
  });

  it("shows the placeholder note only while the content is unconfirmed", () => {
    const { rerender } = render(<VisitSection visit={visit} />);
    expect(screen.queryByRole("note")).not.toBeInTheDocument();
    rerender(
      <VisitSection visit={{ ...visit, placeholder: true, placeholderNote: "Not final" }} />,
    );
    expect(screen.getByRole("note")).toHaveTextContent("Not final");
  });

  it("shows hours edited in the content file with no code change", () => {
    const edited = { ...visit, hours: [{ day: "Monday", open: "10:00", close: "14:00" }] };
    render(<VisitSection visit={edited} />);
    expect(screen.getByText("10:00 AM – 2:00 PM")).toBeInTheDocument();
  });
});

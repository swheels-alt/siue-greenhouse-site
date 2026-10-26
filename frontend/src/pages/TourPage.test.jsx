import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as toursApi from "../api/tours.js";
import TourPage from "./TourPage.jsx";

/**
 * Fill in a complete, valid request.
 */
function fillValidRequest() {
  fireEvent.change(screen.getByLabelText("Your name"), { target: { value: "Test Visitor" } });
  fireEvent.change(screen.getByLabelText("Email address"), {
    target: { value: "visitor@example.com" },
  });
  fireEvent.change(screen.getByLabelText("Number of people"), { target: { value: "8" } });
  fireEvent.change(screen.getByLabelText("Preferred date"), { target: { value: "2026-11-10" } });
}

/**
 * Submit the form and let the async handler finish.
 */
async function submit() {
  await act(async () => {
    fireEvent.click(screen.getByRole("button", { name: "Check my request" }));
  });
}

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date(2026, 9, 26, 10, 0));
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("TourPage", () => {
  it("says it is a prototype and needs no SIUE account", () => {
    render(<TourPage />);
    expect(screen.getByRole("note")).toHaveTextContent("does not send them yet");
    expect(screen.getByText(/No SIUE account needed/)).toBeInTheDocument();
  });

  it("lists every problem, links each to its field and marks the fields invalid", async () => {
    render(<TourPage />);
    await submit();
    const summary = screen.getByRole("alert");
    expect(summary).toHaveTextContent("Please fix these problems");
    expect(screen.getAllByRole("link", { name: /^(Enter|Choose)/ })).toHaveLength(4);
    const name = screen.getByLabelText("Your name");
    expect(name).toHaveAttribute("aria-invalid", "true");
    expect(name).toHaveAccessibleDescription("Enter your name.");
    expect(screen.getByLabelText(/Phone number/)).not.toHaveAttribute("aria-invalid");
  });

  it("moves focus to a field when its error link is used", async () => {
    render(<TourPage />);
    await submit();
    fireEvent.click(screen.getByRole("link", { name: "Enter your email address." }));
    expect(screen.getByLabelText("Email address")).toHaveFocus();
  });

  it("confirms a valid request, says it was not sent, and can start again", async () => {
    const send = vi.spyOn(toursApi, "submitTourRequest");
    render(<TourPage />);
    fillValidRequest();
    await submit();
    expect(send).toHaveBeenCalledTimes(1);
    const status = screen.getByRole("status");
    expect(status).toHaveTextContent("Thank you, Test Visitor.");
    expect(status).toHaveTextContent("Tuesday, November 10, 2026");
    expect(status).toHaveTextContent("This is a prototype, so the request was not sent.");
    fireEvent.click(screen.getByRole("button", { name: "Start another request" }));
    expect(screen.getByLabelText("Your name")).toHaveValue("");
  });

  it("drops a request that fills in the spam trap without sending it", async () => {
    const send = vi.spyOn(toursApi, "submitTourRequest");
    const { container } = render(<TourPage />);
    fillValidRequest();
    fireEvent.change(container.querySelector("#tour-website"), {
      target: { value: "http://spam.example" },
    });
    await submit();
    expect(send).not.toHaveBeenCalled();
    expect(screen.getByRole("status")).toBeInTheDocument();
  });
});

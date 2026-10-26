import { describe, expect, it } from "vitest";
import { describeDay, formatTime } from "./hours.js";
import visit from "./visit.json";

describe("formatTime", () => {
  it.each([
    ["00:00", "12:00 AM"],
    ["08:05", "8:05 AM"],
    ["12:00", "12:00 PM"],
    ["16:30", "4:30 PM"],
    ["23:59", "11:59 PM"],
  ])("formats %s as %s", (time, expected) => {
    expect(formatTime(time)).toBe(expected);
  });

  it.each(["24:00", "12:60", "8:00", "noon", "", undefined])("rejects %s", (time) => {
    expect(() => formatTime(time)).toThrow(/HH:MM/);
  });
});

describe("describeDay", () => {
  it('says "Closed" for a closed day', () => {
    expect(describeDay({ day: "Sunday", closed: true })).toBe("Closed");
  });

  it("gives the opening and closing times for an open day", () => {
    expect(describeDay({ day: "Monday", open: "08:00", close: "16:30" })).toBe("8:00 AM – 4:30 PM");
  });
});

describe("visit.json", () => {
  it("lists all seven days once, Monday first", () => {
    expect(visit.hours.map((entry) => entry.day)).toEqual([
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ]);
  });

  it("has valid times for every open day, closing after opening", () => {
    for (const entry of visit.hours.filter((day) => !day.closed)) {
      expect(() => describeDay(entry)).not.toThrow();
      expect(entry.close > entry.open).toBe(true);
    }
  });
});

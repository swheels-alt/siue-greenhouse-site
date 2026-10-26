import { describe, expect, it } from "vitest";
import { LIMITS, localToday, validateTourRequest } from "./validate.js";

const TODAY = "2026-10-26";
const valid = {
  name: "Test Visitor",
  email: "visitor@example.com",
  phone: "",
  groupSize: "12",
  date: "2026-11-10",
  message: "",
  website: "",
};
const check = (changes) => validateTourRequest({ ...valid, ...changes }, TODAY);

describe("validateTourRequest", () => {
  it("accepts a complete request with no errors and no spam", () => {
    expect(check({})).toEqual({ errors: {}, spam: false });
  });

  it.each([
    ["name", "", "Enter your name."],
    ["name", "   ", "Enter your name."],
    ["name", "x".repeat(LIMITS.name + 1), `Your name must be ${LIMITS.name} characters or fewer.`],
    ["email", "", "Enter your email address."],
    ["email", "not-an-email", "Enter an email address like name@example.com."],
    ["email", "a@b", "Enter an email address like name@example.com."],
    ["phone", "call me", "Enter a phone number using digits, or leave it blank."],
    ["groupSize", "", "Enter how many people are coming, as a whole number of 1 or more."],
    ["groupSize", "0", "Enter how many people are coming, as a whole number of 1 or more."],
    ["groupSize", "-3", "Enter how many people are coming, as a whole number of 1 or more."],
    ["groupSize", "2.5", "Enter how many people are coming, as a whole number of 1 or more."],
    ["date", "", "Choose the date you would like to visit."],
    ["date", "2026-10-26", "Choose a date after today."],
    ["date", "2025-01-01", "Choose a date after today."],
    [
      "message",
      "x".repeat(LIMITS.message + 1),
      `Your message must be ${LIMITS.message} characters or fewer.`,
    ],
  ])("rejects %s = %j", (field, value, message) => {
    expect(check({ [field]: value }).errors).toEqual({ [field]: message });
  });

  it.each([
    ["phone", "(618) 650-0000"],
    ["phone", "+1 618.650.0000"],
    ["name", "x".repeat(LIMITS.name)],
    ["message", "x".repeat(LIMITS.message)],
    ["date", "2026-10-27"],
  ])("accepts %s = %j at the edge", (field, value) => {
    expect(check({ [field]: value }).errors).toEqual({});
  });

  it("reports every failing field at once, in form order", () => {
    const { errors } = check({ name: "", email: "", groupSize: "", date: "" });
    expect(Object.keys(errors)).toEqual(["name", "email", "groupSize", "date"]);
  });

  it("flags a request that fills in the hidden website field as spam", () => {
    expect(check({ website: "http://spam.example" }).spam).toBe(true);
  });
});

describe("localToday", () => {
  it("writes the local date as YYYY-MM-DD with zero padding", () => {
    expect(localToday(new Date(2027, 0, 5, 23, 30))).toBe("2027-01-05");
  });
});

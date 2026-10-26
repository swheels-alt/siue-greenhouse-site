// Checks a public tour request before it is sent (QA plan 3.1: plain-language errors).
// The server repeats every check when the tours API exists; the browser never has the last word.

export const LIMITS = { name: 100, message: 1000 };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE = /^[0-9 ()+.-]{7,20}$/;

/**
 * Check the name, email and phone fields.
 * @param {Record<string, string>} values The form values.
 * @returns {Record<string, string>} An error message for each field that fails.
 */
function contactErrors(values) {
  const errors = {};
  const name = values.name.trim();
  if (!name) {
    errors.name = "Enter your name.";
  } else if (name.length > LIMITS.name) {
    errors.name = `Your name must be ${LIMITS.name} characters or fewer.`;
  }
  if (!values.email.trim()) {
    errors.email = "Enter your email address.";
  } else if (!EMAIL.test(values.email.trim())) {
    errors.email = "Enter an email address like name@example.com.";
  }
  if (values.phone.trim() && !PHONE.test(values.phone.trim())) {
    errors.phone = "Enter a phone number using digits, or leave it blank.";
  }
  return errors;
}

/**
 * Check the group size, date and message fields.
 * @param {Record<string, string>} values The form values.
 * @param {string} today Today's date as YYYY-MM-DD, in the visitor's time zone.
 * @returns {Record<string, string>} An error message for each field that fails.
 */
function visitErrors(values, today) {
  const errors = {};
  if (!/^[1-9]\d*$/.test(values.groupSize.trim())) {
    errors.groupSize = "Enter how many people are coming, as a whole number of 1 or more.";
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(values.date)) {
    errors.date = "Choose the date you would like to visit.";
  } else if (values.date <= today) {
    errors.date = "Choose a date after today.";
  }
  if (values.message.length > LIMITS.message) {
    errors.message = `Your message must be ${LIMITS.message} characters or fewer.`;
  }
  return errors;
}

/**
 * Check a tour request.
 * @param {Record<string, string>} values Every form field, as typed (including the hidden
 *   "website" field, which only spam bots fill in).
 * @param {string} today Today's date as YYYY-MM-DD.
 * @returns {{errors: Record<string, string>, spam: boolean}} Field errors in form order, and
 *   whether the request looks like spam.
 */
export function validateTourRequest(values, today) {
  return {
    errors: { ...contactErrors(values), ...visitErrors(values, today) },
    spam: Boolean(values.website),
  };
}

/**
 * Today's date in the visitor's time zone, as YYYY-MM-DD.
 * @param {Date} [now] The current time; tests pass a fixed one.
 * @returns {string} The date.
 */
export function localToday(now = new Date()) {
  const pad = (number) => String(number).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

// Turns the hours in content/visit.json into the text visitors read (issue #3).

/**
 * Format a 24-hour "HH:MM" time as a 12-hour clock time, for example "16:30" as "4:30 PM".
 * @param {string} time A time written as "HH:MM", 00:00 to 23:59.
 * @returns {string} The time as visitors read it.
 * @throws {Error} When the time is not written as "HH:MM" or is out of range.
 */
export function formatTime(time) {
  const match = /^(\d{2}):(\d{2})$/.exec(time ?? "");
  const hours = match ? Number(match[1]) : NaN;
  const minutes = match ? Number(match[2]) : NaN;
  if (!(hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59)) {
    throw new Error(`Hours in visit.json must be written as HH:MM, got "${time}"`);
  }
  const suffix = hours < 12 ? "AM" : "PM";
  const clockHour = hours % 12 === 0 ? 12 : hours % 12;
  return `${clockHour}:${match[2]} ${suffix}`;
}

/**
 * Describe one day's opening hours.
 * @param {{day: string, open?: string, close?: string, closed?: boolean}} entry One day from visit.json.
 * @returns {string} "Closed", or the opening and closing times, for example "8:00 AM – 4:30 PM".
 */
export function describeDay(entry) {
  if (entry.closed) {
    return "Closed";
  }
  return `${formatTime(entry.open)} – ${formatTime(entry.close)}`;
}

// Public tour requests. Components send requests only through this module (QA plan 3.1).
//
// Prototype: nothing is sent or stored. When ADR 0001 picks the web framework and
// POST /api/v1/tour-requests exists (public, rate-limited, never logged: QA plan R7), this
// function takes the checked request and posts it there, and no component changes.

/**
 * Send a tour request to the greenhouse staff. The prototype sends nothing.
 * @returns {Promise<{sent: boolean}>} Whether the request reached the staff; always false in the
 *   prototype.
 */
export async function submitTourRequest() {
  return { sent: false };
}

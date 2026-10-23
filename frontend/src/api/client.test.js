import { afterEach, describe, expect, it, vi } from "vitest";
import { getJson } from "./client.js";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("getJson", () => {
  it("returns the parsed body on success", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: () => ({ status: "ok" }) });
    vi.stubGlobal("fetch", fetchMock);
    await expect(getJson("/health")).resolves.toEqual({ status: "ok" });
    expect(fetchMock).toHaveBeenCalledWith(expect.stringMatching(/\/health$/));
  });

  it("throws with the status on failure", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 503 }));
    await expect(getJson("/health")).rejects.toThrow("status 503");
  });
});

// Hash-based page routing for the prototype: "#/plants" shows the plants page. It needs no
// server configuration on SIUE hosting and no extra dependency.
import { useEffect, useState } from "react";

/**
 * Read the page path from a location hash.
 * @param {string} hash A location hash, for example "#/plants".
 * @returns {string} The page path, for example "/plants"; "/" when the hash names no page.
 */
export function pathFromHash(hash) {
  const path = (hash ?? "").replace(/^#/, "");
  return path.startsWith("/") ? path : "/";
}

/**
 * Follow the page path in the address bar as the visitor moves between pages.
 * @returns {string} The current page path.
 */
export function useHashRoute() {
  const [path, setPath] = useState(() => pathFromHash(window.location.hash));
  useEffect(() => {
    const onHashChange = () => setPath(pathFromHash(window.location.hash));
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);
  return path;
}

import { useEffect, useRef } from "react";
import SiteHeader from "./components/SiteHeader.jsx";
import HomePage from "./pages/HomePage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import PlantsPage from "./pages/PlantsPage.jsx";
import { useHashRoute } from "./routing.js";

// Each page: its path, its name in the navigation and the browser tab, and its component.
export const PAGES = [
  { path: "/", label: "Home", Component: HomePage },
  { path: "/plants", label: "Plants", Component: PlantsPage },
];

/**
 * The site: header, the page for the current path, and footer.
 * @returns {import("react").JSX.Element} The whole site.
 */
export default function App() {
  const path = useHashRoute();
  const mainRef = useRef(null);
  const firstRender = useRef(true);
  const page = PAGES.find((candidate) => candidate.path === path);
  const Page = page ? page.Component : NotFoundPage;

  useEffect(() => {
    document.title = page ? `${page.label} · SIUE Greenhouse` : "Page not found · SIUE Greenhouse";
    // After a page change, move focus to the new content so screen readers announce it.
    if (firstRender.current) {
      firstRender.current = false;
    } else {
      mainRef.current?.focus();
    }
  }, [page, path]);

  return (
    <>
      <SiteHeader currentPath={path} links={PAGES} onSkip={() => mainRef.current?.focus()} />
      <main id="main-content" className="page" tabIndex={-1} ref={mainRef}>
        <Page />
      </main>
      <footer className="site-footer">
        <p>
          SIUE Greenhouse · Department of Biological Sciences · Southern Illinois University
          Edwardsville
        </p>
        <p>Prototype built by the CS 425 senior project team. Content is not final.</p>
      </footer>
    </>
  );
}

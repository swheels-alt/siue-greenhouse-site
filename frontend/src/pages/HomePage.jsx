import VisitSection from "../components/VisitSection.jsx";
import visit from "../content/visit.json";

/**
 * Home page: what the greenhouse is, then where and when to visit (issue #3).
 * @returns {import("react").JSX.Element} The home page.
 */
export default function HomePage() {
  return (
    <>
      <div className="hero">
        <h1>SIUE Greenhouse</h1>
        <p className="hero-lead">
          The Department of Biological Sciences greenhouse, used for teaching and research and open
          to students, faculty and the public.
        </p>
        <p className="hero-actions">
          <a className="button" href="#/plants">
            Browse plants
          </a>
        </p>
      </div>
      <VisitSection visit={visit} />
    </>
  );
}

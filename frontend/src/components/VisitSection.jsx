import { describeDay } from "../content/hours.js";

/**
 * "Visit the greenhouse": address, a directions link and the hours for each day (issue #3).
 * @param {object} props Component props.
 * @param {object} props.visit The contents of content/visit.json.
 * @returns {import("react").JSX.Element} The visit section.
 */
export default function VisitSection({ visit }) {
  return (
    <section className="visit" aria-labelledby="visit-heading">
      <h2 id="visit-heading">Visit the greenhouse</h2>
      {visit.placeholder && (
        <p className="notice" role="note">
          {visit.placeholderNote}
        </p>
      )}
      <div className="visit-grid">
        <div className="card">
          <h3>Location</h3>
          <address className="visit-address">
            {visit.addressLines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </address>
          <a className="button" href={visit.mapUrl} target="_blank" rel="noopener noreferrer">
            Get directions
            <span className="visually-hidden"> (opens a map in a new tab)</span>
          </a>
        </div>
        <div className="card">
          <h3>Hours</h3>
          <dl className="hours">
            {visit.hours.map((entry) => (
              <div className="hours-row" key={entry.day}>
                <dt>{entry.day}</dt>
                <dd>{describeDay(entry)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

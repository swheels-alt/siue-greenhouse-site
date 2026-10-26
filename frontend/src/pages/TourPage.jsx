import { useRef, useState } from "react";
import { submitTourRequest } from "../api/tours.js";
import { LIMITS, localToday, validateTourRequest } from "../tours/validate.js";

const EMPTY = { name: "", email: "", phone: "", groupSize: "", date: "", message: "", website: "" };

const FIELDS = [
  { id: "name", label: "Your name", type: "text", autoComplete: "name", required: true },
  { id: "email", label: "Email address", type: "email", autoComplete: "email", required: true },
  { id: "phone", label: "Phone number (optional)", type: "tel", autoComplete: "tel" },
  {
    id: "groupSize",
    label: "Number of people",
    type: "text",
    inputMode: "numeric",
    required: true,
  },
  { id: "date", label: "Preferred date", type: "date", required: true },
];

/**
 * One labeled input, with its error message linked for screen readers.
 * @param {object} props Component props.
 * @param {object} props.field One entry of FIELDS.
 * @param {string} props.value The current value.
 * @param {string} [props.error] The error message, if the value failed a check.
 * @param {(id: string, value: string) => void} props.onChange Called as the visitor types.
 * @returns {import("react").JSX.Element} The field.
 */
function Field({ field, value, error, onChange }) {
  const { id, label, ...inputProps } = field;
  return (
    <div className="field">
      <label htmlFor={`tour-${id}`}>{label}</label>
      {error && (
        <p className="field-error" id={`tour-${id}-error`}>
          {error}
        </p>
      )}
      <input
        id={`tour-${id}`}
        name={id}
        value={value}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `tour-${id}-error` : undefined}
        onChange={(event) => onChange(id, event.target.value)}
        {...inputProps}
      />
    </div>
  );
}

/**
 * The list of problems shown above the form, each linked to its field.
 * @param {object} props Component props.
 * @param {Record<string, string>} props.errors Error messages by field id.
 * @param {import("react").RefObject<HTMLDivElement>} props.summaryRef Receives focus on submit.
 * @returns {import("react").JSX.Element} The error summary.
 */
function ErrorSummary({ errors, summaryRef }) {
  return (
    <div className="error-summary" role="alert" tabIndex={-1} ref={summaryRef}>
      <h2>Please fix {Object.keys(errors).length === 1 ? "this problem" : "these problems"}</h2>
      <ul>
        {Object.entries(errors).map(([id, message]) => (
          <li key={id}>
            <a
              href={`#tour-${id}`}
              onClick={(event) => {
                event.preventDefault();
                document.getElementById(`tour-${id}`)?.focus();
              }}
            >
              {message}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * What the visitor sees after a request passes every check.
 * @param {object} props Component props.
 * @param {{name: string, date: string, groupSize: string}} props.request The checked request.
 * @param {() => void} props.onAnother Starts a new request.
 * @returns {import("react").JSX.Element} The confirmation.
 */
function Confirmation({ request, onAnother }) {
  return (
    <div className="card confirmation" role="status">
      <h2>Your request is ready</h2>
      <p>
        Thank you, {request.name.trim()}. Your request for {request.groupSize.trim()} people on{" "}
        {new Date(`${request.date}T12:00`).toLocaleDateString("en-US", { dateStyle: "full" })}{" "}
        passed every check.
      </p>
      <p>
        <strong>This is a prototype, so the request was not sent.</strong> In the finished site,
        greenhouse staff will reply by email.
      </p>
      <button type="button" className="button" onClick={onAnother}>
        Start another request
      </button>
    </div>
  );
}

/**
 * The form itself: the fields, the optional message, a hidden spam trap and the submit button.
 * @param {object} props Component props.
 * @param {Record<string, string>} props.values The current values.
 * @param {Record<string, string>} props.errors Error messages by field id.
 * @param {(id: string, value: string) => void} props.onChange Called as the visitor types.
 * @param {(event: Event) => void} props.onSubmit Called when the visitor submits.
 * @returns {import("react").JSX.Element} The form.
 */
function TourForm({ values, errors, onChange, onSubmit }) {
  return (
    <form className="tour-form" noValidate onSubmit={onSubmit}>
      {FIELDS.map((field) => (
        <Field
          key={field.id}
          field={field}
          value={values[field.id]}
          error={errors[field.id]}
          onChange={onChange}
        />
      ))}
      <div className="field">
        <label htmlFor="tour-message">Anything we should know? (optional)</label>
        {errors.message && (
          <p className="field-error" id="tour-message-error">
            {errors.message}
          </p>
        )}
        <textarea
          id="tour-message"
          rows={4}
          maxLength={LIMITS.message + 1}
          value={values.message}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? "tour-message-error" : undefined}
          onChange={(event) => onChange("message", event.target.value)}
        />
      </div>
      {/* Spam trap (QA plan R7): hidden from people and screen readers; bots fill it in. */}
      <div className="honeypot" aria-hidden="true">
        <label htmlFor="tour-website">Leave this field empty</label>
        <input
          id="tour-website"
          tabIndex={-1}
          autoComplete="off"
          value={values.website}
          onChange={(event) => onChange("website", event.target.value)}
        />
      </div>
      <button type="submit" className="button">
        Check my request
      </button>
    </form>
  );
}

/**
 * Public tour request form: no login needed (Problem Specification).
 * @returns {import("react").JSX.Element} The tour page.
 */
export default function TourPage() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(null);
  const summaryRef = useRef(null);
  const update = (id, value) => setValues((current) => ({ ...current, [id]: value }));
  const hasErrors = Object.keys(errors).length > 0;

  const submit = async (event) => {
    event.preventDefault();
    const result = validateTourRequest(values, localToday());
    setErrors(result.errors);
    if (Object.keys(result.errors).length > 0) {
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    // A request that fills in the spam trap is dropped quietly, so bots learn nothing.
    if (!result.spam) await submitTourRequest(values);
    setDone(values);
  };
  const startAgain = () => {
    setValues(EMPTY);
    setDone(null);
  };

  return (
    <>
      <h1>Request a tour</h1>
      {done ? (
        <Confirmation request={done} onAnother={startAgain} />
      ) : (
        <>
          <p className="notice" role="note">
            Prototype: this form checks your answers but does not send them yet.
          </p>
          <p>No SIUE account needed. Fields marked optional can be left blank.</p>
          {hasErrors && <ErrorSummary errors={errors} summaryRef={summaryRef} />}
          <TourForm values={values} errors={errors} onChange={update} onSubmit={submit} />
        </>
      )}
    </>
  );
}

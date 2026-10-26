/**
 * Shown when the address names a page the site does not have.
 * @returns {import("react").JSX.Element} The not-found page.
 */
export default function NotFoundPage() {
  return (
    <>
      <h1>Page not found</h1>
      <p>
        That page does not exist. <a href="#/">Go to the home page</a>.
      </p>
    </>
  );
}

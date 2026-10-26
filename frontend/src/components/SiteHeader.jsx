/**
 * Site header: skip link, site name and the main navigation.
 * @param {object} props Component props.
 * @param {string} props.currentPath The page path being shown, for example "/plants".
 * @param {{path: string, label: string}[]} props.links The pages in the main navigation.
 * @param {() => void} props.onSkip Moves keyboard focus to the main content.
 * @returns {import("react").JSX.Element} The header.
 */
export default function SiteHeader({ currentPath, links, onSkip }) {
  const skipToContent = (event) => {
    // The hash holds the page path, so the skip link moves focus instead of changing the hash.
    event.preventDefault();
    onSkip();
  };
  return (
    <header className="site-header">
      <a className="skip-link" href="#main-content" onClick={skipToContent}>
        Skip to main content
      </a>
      <div className="site-header-inner">
        <a className="site-header-name" href="#/">
          SIUE Greenhouse
        </a>
        <nav aria-label="Main">
          <ul className="site-nav">
            {links.map((link) => (
              <li key={link.path}>
                <a
                  className="site-nav-link"
                  href={`#${link.path}`}
                  aria-current={link.path === currentPath ? "page" : undefined}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}

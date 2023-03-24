import "./links.scss";

export function Links() {
  return (
    <div className="links">
      <h1 className="links__title">christianchownsan.github.io</h1>
      <p className="links__p">
        Link to{" "}
        <a
          target="_blank"
          href="https://d3ech8keeyzc99.cloudfront.net/from-web-browser"
          className="links__a"
          rel="noreferrer"
        >
          https://d3ech8keeyzc99.cloudfront.net/from-web-browser
        </a>
      </p>
      <p className="links__p">
        Link to{" "}
        <a
          target="_blank"
          href="https://d3ech8keeyzc99.cloudfront.net/other-link-from-web"
          className="links__a"
          rel="noreferrer"
        >
          https://d3ech8keeyzc99.cloudfront.net/other-link-from-web
        </a>
      </p>
    </div>
  );
}

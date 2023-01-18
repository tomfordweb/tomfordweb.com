import { Link } from "gatsby";
import React from "react";

export default function Layout({ pageClass, children }) {
  return (
    <>
      <header id="site-header">
        <div className="container">
          <p id="logo">
            <Link to="/">
              Tom Ford: <strong>Web Developer</strong>
            </Link>
          </p>
          <nav>
            <ul>
              <li>
                <Link to="/about">About</Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <main className={pageClass}>{children}</main>
      <footer id="site-footer">
        &copy; {new Date().getFullYear()} - tomfordweb.com
      </footer>
    </>
  );
}

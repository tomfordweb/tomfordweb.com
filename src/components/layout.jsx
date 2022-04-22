import { Link } from "gatsby";
import React from "react";

export default function Layout({ children }) {
  return (
    <main>
      <header id="site-header">
        <p>Tom Ford: Web Developer</p>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
          </ul>
        </nav>
      </header>
      {children}
    </main>
  );
}

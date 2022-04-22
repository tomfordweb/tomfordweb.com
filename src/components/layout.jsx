import React from "react";

export default function Layout({ children }) {
  return (
    <main>
      <nav>
        <ul>
          <li>Home</li>
          <li>About</li>
        </ul>
      </nav>
      {children}
    </main>
  );
}

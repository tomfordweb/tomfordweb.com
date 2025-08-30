import { Link } from "gatsby";
import React, { useEffect, useState } from "react";
import Cookies from 'js-cookie'

// const checkIsDarkSchemePreferred = () => window?.matchMedia?.('(prefers-color-scheme:dark)')?.matches ?? false;
//
// const getDefualtColorValue = () => Cookies.get('preferredViewMode') ?? checkIsDarkSchemePreferred() ?? "dark";


export default function Layout({ pageName, children }) {

  //
  // const [viewMode, setViewMode] = useState(getDefualtColorValue());
  //
  // useEffect(() => {
  //   Cookies.set('preferredViewMode', viewMode)
  // }, [viewMode]);
  //
  // const toggleColor = () => {
  //   setViewMode(viewMode === "dark" ? "light" : "dark");
  // }

        // <div className="form-check form-switch d-flex align-items-center">
        //   <input className="form-check-input" type="checkbox" role="switch" id="toggleViewMode" onChange={toggleColor} />
        //   <label className="ms-3 form-check-label fs-3" htmlFor="toggleViewMode">
        //     {viewMode === "dark" ?
        //       <i class="bi bi-sun text-gruvbox-yellow"></i>
        //       :
        //       <i class="bi bi-moon-stars text-info"></i>
        //     }
        //   </label>
        // </div>
  return (
    <div className="bg-dark text-light" style={{ transition: 'background-color 0.2s linear' }}>
      <header className="container py-3 py-lg-5 text-center d-flex justify-content-between" id="main-header">
        <Link to="/" className="text-decoration-none">
          <span className="cursor fira-code-semibold h3 text-light">
            <span className="text-success">tomfordweb.com</span><span className="text-primary">:~</span><span className="text-secondary">$</span>&nbsp;
          </span>
        </Link>
      </header>
      <main id={pageName} className="container min-vh-100">
        {children}
      </main>
      <footer className="container py-5 text-warning d-flex align-items-center justify-content-center">
        <small>&copy; {new Date().getFullYear()} - tomfordweb.com</small>
        <a href="https://github.com/tomfordweb" aria-label="tomfordweb github" className="ms-3"><i className="bi bi-github"></i></a>
      </footer>
    </div>
  );
}

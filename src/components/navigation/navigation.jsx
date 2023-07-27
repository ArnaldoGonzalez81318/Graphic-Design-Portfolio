import React from "react";
import { Link } from "react-router-dom";

import { navbar } from "../../Portfolio";

import "./navigation.css";

const Navigation = () => {
  return (
    <nav className="nav">
      <div className="nav-header">
        <Link to="/" className="nav-logo">
          {navbar.logo}
        </Link>
      </div>
      <ul className="nav-list">
        {navbar.navLinks.map((navLink, index) => (
          <li key={index} className="nav-list-item">
            <Link to={navLink.url} className="nav-link">
              {navLink.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Navigation;
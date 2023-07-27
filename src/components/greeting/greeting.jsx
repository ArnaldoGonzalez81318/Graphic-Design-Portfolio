import React from "react";

import { greeting } from "../../Portfolio";

import "./greeting.css";

const Greeting = () => {
  return (
    <section className="greeting-section" id="greeting">
      <div className="greeting-container">
        <h1 className="greeting-name">
          Hi, I'm <span className="greeting-name-highlight">{greeting.username}</span>
        </h1>
        <p className="greeting-role">
          {greeting.profession}
        </p>
        <p className="greeting-description">
          {greeting.description}
        </p>
      </div>
    </section>
  );
}

export default Greeting;
import React from "react";

import { technologies } from "../../Portfolio";

import './technologies.css';

const Technologies = () => {
  return (
    <section className="technologies">
      <h2 className="technologies-title">Technologies</h2>
      <p className="technologies-subtitle">
        A summary of the technologies I have worked with.
      </p>
      <div className="technologies-container">
        {technologies.data.map((tech, index) => {
          return (
            <div className={`technology ${tech.className}`} key={index}>
              <div className="technology-logo">
                <img src={tech.logo} alt={tech.name} />
              </div>
              <p className="technology-name">{tech.name}</p>
            </div>
          );
        })}
      </div>
    </section>
  )
}

export default Technologies;
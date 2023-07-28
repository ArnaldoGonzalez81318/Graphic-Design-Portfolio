import React from "react";

import { greeting, socialMedia } from "../../Portfolio";

import "./greeting.css";

const Greeting = () => {
  return (
    <section className="greeting-section" id="greeting">
      <div className="greeting-shape-1"></div>
      <div className="greeting-shape-2"></div>
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
        <div className="greeting-social-links">
          {socialMedia.data.map(socialLink => {
            return (
              <a
                href={socialLink.url}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                key={socialLink.name}
              >
                {socialLink.icon}
              </a>
            );
          })}
        </div>
        <div className="greeting-resume">
          <a
            href={greeting.resumeLink}
            target="_blank"
            rel="noopener noreferrer"
            className="button"
          >
            Download CV
          </a>
        </div>
        <div className="greeting-scroll-down">
          <a href="#about">
            <div className="greeting-scroll-down-button">
              <div className="greeting-scroll-down-button-line"></div>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}

export default Greeting;
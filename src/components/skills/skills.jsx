import React from "react";

import { skills } from "../../Portfolio";

import './skills.css';

const Skills = () => {
  return (
    <section className="skills-section" id="skills">
      <div className="skills-header">
        <h2>Skills</h2>
        <p>Here are some of my skills that I have acquired over the years.</p>
      </div>
      <div className="skills-container">
        {skills.data.map((skill, index) => {
          return (
            <div className="skill-card" key={index}>
              <div className="skill-card-content">
                <div className="skill-name">{skill.name}</div>
                <p className="skill-description">{skill.description}</p>
                <button className="skill-btn">Learn More</button>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  );
}

export default Skills;
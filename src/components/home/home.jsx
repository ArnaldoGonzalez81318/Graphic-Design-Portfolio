import React from "react";

import Greeting from "../greeting/greeting";
import Skills from "../skills/skills";

import './home.css';

const Home = () => {
  return (
    <div className="home">
      <Greeting />
      <Skills />
    </div>
  );
}

export default Home;
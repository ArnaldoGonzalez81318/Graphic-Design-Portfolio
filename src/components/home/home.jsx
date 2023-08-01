import React from "react";

import Greeting from "../greeting/greeting";
import Skills from "../skills/skills";
import Technologies from "../technologies/technologies";
import Footer from "../footer/footer";

import './home.css';

const Home = () => {
  return (
    <div className="home">
      <Greeting />
      <Skills />
      <Technologies />
      <Footer />
    </div>
  );
}

export default Home;
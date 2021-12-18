import React, { useState } from "react";
import "./home.css";

const PromoCode = () => {
  let [hidden, setHidden] = useState(false);
  return (
    <div className='PromoCodeBanner' data-aos='fade-down'  data-aos-delay='200' style={{ transform: hidden ? "translateY(-5vh)" : "" }}>
      <h3>Extra 20% OFF This Festive Season {">>"} Use Code </h3>
      <h2>CONNEXT20</h2>
      <p onClick={() => setHidden(true)}>X</p>
    </div>
  );
};

export default PromoCode;

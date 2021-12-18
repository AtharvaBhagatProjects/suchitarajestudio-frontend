import React from "react";
import HomeSection from "./homeSection";

import "./home.css";
import PromoCode from "./promocode";

const HomePage = () => {
  return (
    <div className='MainHolder'>
      <PromoCode />
      <HomeSection />
    </div>
  );
};

export default HomePage;

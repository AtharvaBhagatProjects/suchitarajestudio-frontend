import React from "react";
import { Link } from "react-router-dom";

import HomeImage from "../resources/landing.gif";
import logo from "../resources/suchitarajeTransparentLogo.png";

import "./home.css";

const HomeSection = () => {
  return (
    <div className='HomeSection'>
      <div id='HomeNavBar' data-aos='fade-down' data-aos-offset='0'>
        <img src={logo} id='logo'></img>

        <ul>
          <li>
            <Link to='/catalogue'>Catalogue </Link>
          </li>
          <li>
            <Link to='/about-us'>FAQs</Link>
          </li>
          <li>
            <Link to='/trackOrders'>Track Orders</Link>
          </li>
        </ul>
      </div>
      <img src={HomeImage} id='HomeImage' data-aos='fade-up' data-aos-offset='0'></img>

      <div className='HomeText'>
        <h2 data-aos='fade-down' data-aos-offset='0'>
          Wear your moments of Spark <br />
          Discover a new yourself with us ! <br />
        </h2>

        <ul id='FeaturesList'>
          <li data-aos='fade-in' data-aos-offset='0' data-aos-delay='500'>
            {" "}
            Exclusive range of Handcrafted Elegant Dresses{" "}
          </li>
          <li data-aos='fade-in' data-aos-offset='0' data-aos-delay='1000'>
            {" "}
            Best Quality Assured{" "}
          </li>
          <li data-aos='fade-in' data-aos-offset='0' data-aos-delay='1500'>
            {" "}
            Discover Unique Styles{" "}
          </li>
          <li data-aos='fade-in' data-aos-offset='0' data-aos-delay='2000'>
            {" "}
            Free Shipping on all orders across India{" "}
          </li>
        </ul>
      </div>

      <Link to='/catalogue'>
        <button data-aos='fade-up' data-aos-offset='0' data-aos-delay='500'>
          Discover Catalogue &nbsp; &nbsp; &nbsp; {"  >   "}
        </button>
      </Link>
    </div>
  );
};

export default HomeSection;

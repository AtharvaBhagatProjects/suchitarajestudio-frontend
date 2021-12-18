import React from "react";
import "./footer.css";

import connext from "./resources/connextTransparent.png";
import logo from "./resources/suchitarajeTransparentLogo.png";
import mail from "./resources/mail.png";
import whatsapp from "./resources/whatsapp.png";
import instagram from "./resources/instagram.png";
import { Link } from "react-router-dom";
const Footer = () => {
  return (
    <div className='Footer' data-aos='fade-up' data-aos-offset='0'>
      <div className='FooterText'>
        <a href=''>
          <img src={logo} id='logo' />
        </a>
        <div className='contacts'>
          <h2>Contact us</h2>
          <div className='contactInfo'>
            <img src={mail}></img>
            <h3>
              <a href='mailto:suchitaraje.studio@gmail.com'>suchitaraje.studio@gmail.com</a>
            </h3>
          </div>
          <div className='contactInfo'>
            <img src={whatsapp}></img>
            <h3>
              <a href='https://wa.me/918097985835?text=Hello%20Suchita!%20Visited%20your%20web%20store.%20I%20wanted%20to%20' target='_blank'>
                +91 80979 85835{" "}
              </a>
            </h3>
          </div>
          <div className='contactInfo'>
            <img src={instagram}></img>
            <h3>
              <a href='https://instagram.com/'>instagram/suchitaraje.studio</a>
            </h3>
          </div>
        </div>
      </div>
      <a href='https://atharvabhagat.netlify.app' target='_blank'>
        <div className='connextDiv'>
          <h3>Website Designed & Maintained By</h3> <img src={connext} id='connext'></img>
        </div>
      </a>

      <p>All Rights Reserved | CONNEXT SOLUTIONS for Suchita Raje Studio </p>
    </div>
  );
};

export default Footer;

import React, { useEffect, useState } from "react";
import "./catalogue.css";
import { db } from "../firebase";
import Bag from "../bag";

import { Link } from "react-router-dom";
import logo from "../resources/suchitarajeTransparentLogo.png";

import logo2 from "../resources/floral.jpg";
import logo3 from "../resources/floral2.jpg";
import logo4 from "../resources/floral4.jpg";
import logo5 from "../resources/floral3.jpg";

import ProductCard from "./productcard";

const CataloguePage = () => {
  let [Catalog1Array, setCatalog1Array] = useState([]);
  let [Catalog2Array, setCatalog2Array] = useState([]);
  let [Catalog3Array, setCatalog3Array] = useState([]);
  let PaymentAmount = window.btoa("PaymentAmount");
  let applied = localStorage.getItem([PaymentAmount]);
  applied && localStorage.removeItem([PaymentAmount]);

  const SetArray = () => {
    let Catalog1 = [];
    let Catalog2 = [];

    db.collection("KurtaCatalog")
      .get()
      .then(snapshot => {
        snapshot.docs.forEach(product => {
          let appObj = { ...product.data() };
          Catalog1.push(appObj);
        });
        setCatalog1Array(Catalog1);
      });
    db.collection("KurtiCatalog")
      .get()
      .then(snapshot => {
        snapshot.docs.forEach(product => {
          let appObj = { ...product.data() };
          Catalog2.push(appObj);
        });
        setCatalog2Array(Catalog2);
      });
  };

  useEffect(() => {
    setTimeout(SetArray, 10);
  }, []);

  return (
    <>
      <Bag></Bag>
      <div className='MainHolder'>
        <div className='NavBar' data-aos='fade-down' data-aos-offset='0'>
          <Link to='/home'>
            <img src={logo} id='logo'></img>
          </Link>
          <h2>Catalogue</h2>
            <Link to='/about-us' className='hideME'>FAQs</Link>
            <Link to='/trackOrders' className='hideME'>Track Orders</Link>
        </div>
        <h1
          className='CollectionName'
          id='firstCollection'
          data-aos='fade-down'
          data-aos-offset='0'>
          {" "}
          KURTA SETS{" "}
        </h1>
        <div className='Collection'>
          {Catalog1Array.map(items => (
            <ProductCard
              Description={items.Description}
              CollectionDescription='The authentic Kurta Catalog'
              ProductName={items.ProductName}
              ProductID={items.ProductID}
              Price={items.Price}
              ImageLink={items.Link}
              ImageLink2={logo2}
              ImageLink3={logo3}
              ImageLink4={logo4}
              ImageLink5={logo5}
            />
          ))}
        </div>
        <h1 className='CollectionName' data-aos='fade-down'>
          KURTIS
        </h1>
        <div className='Collection'>
          {Catalog2Array.map(items => (
            <ProductCard
              Description={items.Description}
              CollectionDescription='The authentic Kurti Catalog'
              ProductName={items.ProductName}
              ProductID={items.ProductID}
              Price={items.Price}
              ImageLink={items.Link}
              ImageLink2={logo2}
              ImageLink3={logo3}
              ImageLink4={logo4}
              ImageLink5={logo5}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default CataloguePage;

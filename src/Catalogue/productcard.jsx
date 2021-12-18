import React, { useEffect, useState } from "react";
import "./catalogue.css";

import openProduct from "../resources/openProduct.png";
import bagButton from "../resources/bag3.png";
import { Link } from "react-router-dom";
import logo from "../resources/suchitarajeTransparentLogo.png";

import returnIcon from "../resources/returnIcon.png";
import ecoIcon from "../resources/ecoIcon.png";
import deliveryIcon from "../resources/deliveryIcon.png";
import cottonIcon from "../resources/cottonIcon.png";
import trustIcon from "../resources/trustIcon.png";
import AOS from "aos";

import { db } from "../firebase";

const ProductCard = props => {
  let ProductID = props.ProductID;
  let [modal, setModal] = useState(false);
  let [selectedSize, setSelectedSize] = useState("");
  let [sizeAlert, setSizeAlert] = useState(false);

  let locale1 = window.btoa("MyBag");
  let locale2 = window.btoa("BagProducts");
  let CartPrice = window.btoa("CartPayment");

  let totalPrice = 0;

  let [added, setAdded] = useState(false);

  let ImagesArray = [
    props.ImageLink,
    props.ImageLink2,
    props.ImageLink3,
    props.ImageLink4,
    props.ImageLink5,
  ];

  let [catalogImage, setCatalogImage] = useState(ImagesArray[0]);

  const HandleAddtoBag = (product_name, product_price, product_id, product_size, product_image) => {
    let MyBagLength = localStorage.getItem([locale1]);
    if (selectedSize == "") {
      setSizeAlert(true);
      return;
    }

    let product_qty = 1;
    let MyBagArray = [];
    let BagProducts = [];

    product_name = window.btoa(product_name);
    product_price = window.btoa(product_price);
    product_id = window.btoa(product_id);
    product_size = window.btoa(product_size);
    product_qty = window.btoa(product_qty);
    product_image = window.btoa(product_image);

    let product_nameKey = window.btoa("product_name");
    let product_priceKey = window.btoa("product_price");
    let product_idKey = window.btoa("product_id");
    let product_sizeKey = window.btoa("product_size");
    let product_qtyKey = window.btoa("product_qty");
    let product_imageKey = window.btoa("product_image");

    if (!MyBagLength) {
      MyBagArray.push({
        [product_nameKey]: product_name,
        [product_priceKey]: product_price,
        [product_idKey]: product_id,
        [product_sizeKey]: product_size,
        [product_imageKey]: product_image,
        [product_qtyKey]: product_qty,
      });
      BagProducts.push(product_id);
      localStorage.setItem([locale1], JSON.stringify(MyBagArray));
      localStorage.setItem([locale2], JSON.stringify(BagProducts));
    } else {
      MyBagArray = JSON.parse(localStorage.getItem([locale1]));
      BagProducts = JSON.parse(localStorage.getItem([locale2]));

      if (BagProducts.includes(product_id)) {
        let idx = BagProducts.indexOf(product_id);
        MyBagArray[idx][product_qtyKey] =
          parseInt(window.atob(MyBagArray[idx][product_qtyKey])) + 1;
        MyBagArray[idx][product_priceKey] =
          parseInt(window.atob(product_price)) * MyBagArray[idx][product_qtyKey];
        MyBagArray[idx][product_qtyKey] = window.btoa(MyBagArray[idx][product_qtyKey]);
        MyBagArray[idx][product_priceKey] = window.btoa(MyBagArray[idx][product_priceKey]);
        localStorage.setItem([locale1], JSON.stringify(MyBagArray));
      } else {
        MyBagArray.push({
          [product_nameKey]: product_name,
          [product_priceKey]: product_price,
          [product_idKey]: product_id,
          [product_sizeKey]: product_size,
          [product_imageKey]: product_image,
          [product_qtyKey]: product_qty,
        });
        BagProducts.push(product_id);
        localStorage.setItem([locale1], JSON.stringify(MyBagArray));
        localStorage.setItem([locale2], JSON.stringify(BagProducts));
      }
    }
    setAdded(true);
    setModal(false);

    MyBagArray.forEach(element => {
      totalPrice = totalPrice + parseInt(window.atob(element[product_priceKey]));
    });

    localStorage.setItem([CartPrice], window.btoa(totalPrice));
  };

  useEffect(() => {
    setTimeout(setAdded, 2000);
    setInterval(setAdded, 5000);
  }, []);

  return (
    <>
      <div className='ProductCard'>
        <img
          src={props.ImageLink}
          data-aos='fade-down'
          onClick={ProductID => {
            setModal(!modal);
          }}></img>

        <hr data-aos='fade-left' />
        <h2 data-aos='fade-up'>{props.ProductName}</h2>
        <h3 data-aos='fade-up'> &#8377; {props.Price}</h3>

        <img
          data-aos='fade-right'
          src={openProduct}
          id='OpenProduct'
          onClick={ProductID => setModal(!modal)}
        />
      </div>

      <div
        className='AddedModal'
        style={{ transform: added ? "translateY(0vh)" : "translateY(-32vh)" }}>
        <h1
          id='closeButton'
          onClick={() => {
            setAdded(false);
          }}>
          X
        </h1>
        <img src={props.ImageLink} />
        <div>
          <h1>{props.ProductName}</h1>
          <h2>{props.Price}</h2>
          <h2>Size: {selectedSize}</h2>
          <p>Added to your Bag !</p>
        </div>
      </div>

      <div
        className='ProductModal'
        style={{ transform: modal ? "translateX(0vh)" : "translateY(100vh)" }}>
        <div className='ModalInfo'>
          <img id='productInsideLogo' src={logo} />

          <h1
            id='closeButton'
            onClick={() => {
              setModal(false);
            }}>
            X
          </h1>
          <div className='Images' onMouseLeave={() => setCatalogImage(ImagesArray[0])}>
            <div className='MainImageHolder'>
              <img
                src={catalogImage}
                className='MainImage'
                
              />
            </div>
            <div className='smallPicsHolder'>
              <img
                className='smallPic'
                src={ImagesArray[0]}
                onMouseOver={() => setCatalogImage(ImagesArray[0])}
                onClick={() => setCatalogImage(ImagesArray[0])}
                style={{
                  borderColor: catalogImage == ImagesArray[0] ? "" : "transparent",
                  opacity: catalogImage == ImagesArray[0] ? "" : "1",
                }}
              />
              <img
                className='smallPic'
                src={ImagesArray[1]}
                onMouseOver={() => setCatalogImage(ImagesArray[1])}
                onClick={() => setCatalogImage(ImagesArray[1])}
                style={{
                  borderColor: catalogImage == ImagesArray[1] ? "" : "transparent",
                  opacity: catalogImage == ImagesArray[1] ? "" : "1",
                }}
              />
              <img
                className='smallPic'
                src={ImagesArray[2]}
                onMouseOver={() => setCatalogImage(ImagesArray[2])}
                onClick={() => setCatalogImage(ImagesArray[2])}
                style={{
                  borderColor: catalogImage == ImagesArray[2] ? "" : "transparent",
                  opacity: catalogImage == ImagesArray[2] ? "" : "1",
                }}
              />
              <img
                className='smallPic'
                src={ImagesArray[3]}
                onMouseOver={() => setCatalogImage(ImagesArray[3])}
                onClick={() => setCatalogImage(ImagesArray[3])}
                style={{
                  borderColor: catalogImage == ImagesArray[3] ? "" : "transparent",
                  opacity: catalogImage == ImagesArray[3] ? "" : "1",
                }}
              />
              <img
                className='smallPic'
                src={ImagesArray[4]}
                onMouseOver={() => setCatalogImage(ImagesArray[4])}
                onClick={() => setCatalogImage(ImagesArray[4])}
                style={{
                  borderColor: catalogImage == ImagesArray[4] ? "" : "transparent",
                  opacity: catalogImage == ImagesArray[4] ? "" : "1",
                }}
              />
            </div>
          </div>
          <div className='ProductInfo'>
            <h1 className='ProductName'>{props.ProductName}</h1>
            <h2>{props.CollectionDescription}</h2>
            <h6 className='ProductPrice'>&#8377; {props.Price} </h6>
            <h4>Select Size</h4>

            <div className='SizeSelection'>
              <p
                style={{
                  borderColor: selectedSize == "S" ? "orange" : "",
                  color: selectedSize == "S" ? "orange" : "",
                }}
                onClick={() => {
                  setSelectedSize("S");
                  setSizeAlert(false);
                }}>
                S
              </p>
              <p
                style={{
                  borderColor: selectedSize == "M" ? "orange" : "",
                  color: selectedSize == "M" ? "orange" : "",
                }}
                onClick={() => {
                  setSelectedSize("M");
                  setSizeAlert(false);
                }}>
                M
              </p>
              <p
                style={{
                  borderColor: selectedSize == "L" ? "orange" : "",
                  color: selectedSize == "L" ? "orange" : "",
                }}
                onClick={() => {
                  setSelectedSize("L");
                  setSizeAlert(false);
                }}>
                L
              </p>
              <p
                style={{
                  borderColor: selectedSize == "XL" ? "orange" : "",
                  color: selectedSize == "XL" ? "orange" : "",
                }}
                onClick={() => {
                  setSelectedSize("XL");
                  setSizeAlert(false);
                }}>
                XL
              </p>
              <h4 id='sizeAlertText' style={{ display: sizeAlert ? "" : "none" }}>
                Please Select a Size
              </h4>
            </div>

            <button
              id='AddtoBagButton'
              onClick={() => {
                HandleAddtoBag(
                  props.ProductName,
                  props.Price,
                  props.ProductID + selectedSize,
                  selectedSize,
                  props.ImageLink
                );
              }}>
              <img src={bagButton}></img>Add to Bag{" "}
            </button>
            <br />
            <h4>Custom Sizes Available : Order via Whatsapp/Instagram Shop </h4>

            <div className='CatalogShower'>
              <div className='featureBox'>
                <img src={trustIcon} />
                <h6>Quality Hancrafted Products</h6>
              </div>
              <div className='featureBox'>
                <img src={cottonIcon} />
                <h6>100% Pure Cotton</h6>
              </div>
              <div className='featureBox'>
                <img src={ecoIcon} />
                <h6>Eco-friendly Standards</h6>
              </div>
              <div className='featureBox'>
                <img src={deliveryIcon} />
                <h6>7-10 Days Express Delivery</h6>
              </div>
              <div className='featureBox'>
                <img src={returnIcon} />
                <h6>7 Days Easy Returns Policy</h6>
              </div>
            </div>

            <hr />
            <br />

            <b>Product Description</b>
            <p>{props.Description}</p>
            <br />

            <hr />
            <br />

            <b>Specifications</b>
            <p>Sleeves: Full</p>
            <p>Dupatta : Yes</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductCard;

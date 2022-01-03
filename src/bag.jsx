import React, { useEffect, useState } from "react";
import bag from "./resources/bag.gif";
import "./bag.css";
import { Link } from "react-router-dom";

import emptyBag from "./resources/emptyBag.gif";
import deleteIcon from "./resources/delete.png";

const Bag = () => {
  let locale1 = window.btoa("MyBag");
  let locale2 = window.btoa("BagProducts");
  let [showMyBag, setShowMyBag] = useState(false);
  let bagObjects = JSON.parse(localStorage.getItem(locale1));
  let BagProducts = JSON.parse(localStorage.getItem([locale2]));

  let totalPrice = 0;
  let [no_of_products, setNOP] = useState(0);

  let PaymentAmount = window.btoa("PaymentAmount");
  let applied = localStorage.getItem([PaymentAmount]);
  applied && localStorage.removeItem([PaymentAmount]);

  let product_nameKey = window.btoa("product_name");
  let product_priceKey = window.btoa("product_price");
  let product_idKey = window.btoa("product_id");
  let product_sizeKey = window.btoa("product_size");
  let product_qtyKey = window.btoa("product_qty");
  let product_imageKey = window.btoa("product_image");

  let CartPrice = window.btoa("CartPayment");

  if (bagObjects) {
    if (bagObjects.length == 0) {
      localStorage.clear();
      return;
    }
    bagObjects.forEach(element => {
      totalPrice = totalPrice + parseInt(window.atob(element[product_priceKey]));
      no_of_products = no_of_products + parseInt(window.atob(element[product_qtyKey]));
    });
    localStorage.setItem([CartPrice], window.btoa(totalPrice));
  }

  return (
    <div>
      <div
        id='bagContainer'
        onClick={() => {
          setShowMyBag(true);
        }}>
        <h3>My Bag</h3>
        <img src={bag} id='bag'></img>
        <h4>{no_of_products}</h4>
      </div>
      <div className='MyBag' style={{ transform: showMyBag ? "translateX(0vw)" : "" }}>
        <div className='Header'>
          <h1>My Bag </h1>
          <img src={bag} id='bag' />
        </div>
        <h1
          id='closeButton'
          onClick={() => {
            setShowMyBag(false);
          }}>
          X
        </h1>
        <div className='ProductsContainer'>
          <div className='ProductBox'>
            <div>
              {bagObjects &&
                bagObjects.map((items, index) => (
                  <div className='ProductInfo'>
                    <div className='BagButtons'>
                      <div>
                        <b
                          id='plusSign'
                          title='Add 1'
                          onClick={e => {
                            items[product_qtyKey] =
                              parseInt(window.atob(items[product_qtyKey])) + 1;
                            items[product_priceKey] =
                              parseInt(
                                window.atob(items[product_priceKey]) / (items[product_qtyKey] - 1)
                              ) * items[product_qtyKey];
                            items[product_qtyKey] = window.btoa(items[product_qtyKey]);
                            items[product_priceKey] = window.btoa(items[product_priceKey]);
                            localStorage.setItem([locale1], JSON.stringify(bagObjects));
                            window.location.reload();
                          }}>
                          +
                        </b>
                        <b
                          id='minusSign'
                          title='Remove 1'
                          onClick={e => {
                            items[product_qtyKey] =
                              parseInt(window.atob(items[product_qtyKey])) - 1;
                            items[product_priceKey] =
                              parseInt(
                                window.atob(items[product_priceKey]) / (items[product_qtyKey] + 1)
                              ) * items[product_qtyKey];
                            items[product_qtyKey] = window.btoa(items[product_qtyKey]);
                            items[product_priceKey] = window.btoa(items[product_priceKey]);
                            if (items[product_qtyKey] == window.btoa(0)) {
                              bagObjects.splice(index, 1);
                              BagProducts.splice(index, 1);
                              localStorage.setItem([locale1], JSON.stringify(bagObjects));
                              localStorage.setItem([locale2], JSON.stringify(BagProducts));
                            }
                            localStorage.setItem([locale1], JSON.stringify(bagObjects));
                            window.location.reload();
                          }}>
                          -
                        </b>
                      </div>
                      <b
                        id='deleteSign'
                        title='Delete Item'
                        onClick={e => {
                          bagObjects.splice(index, 1);
                          BagProducts.splice(index, 1);
                          localStorage.setItem([locale2], JSON.stringify(BagProducts));

                          localStorage.setItem([locale1], JSON.stringify(bagObjects));
                          window.location.reload();
                        }}>
                        <img src={deleteIcon} />
                      </b>
                    </div>
                    <img className='ProductImage' src={window.atob(items[product_imageKey])}></img>
                    <div className='ProductText'>
                      <h3>{window.atob(items[product_nameKey])}</h3>
                      <h4>Size : {window.atob(items[product_sizeKey])}</h4>
                      <h4>Qty: {window.atob(items[product_qtyKey])} </h4>
                      <h3>Price: &#8377; {window.atob(items[product_priceKey])}</h3>
                    </div>
                  </div>
                ))}

              {!bagObjects && (
                <div className='emptyCartDiv'>
                  <img src={emptyBag} />
                  <h3>Your bag looks empty</h3>
                  <h3>Shop some happiness</h3>
                </div>
              )}
            </div>
          </div>
        </div>
        {bagObjects && <h3>Price Total: &#8377; {totalPrice}</h3>}
        <Link
          to='/checkout'
          onClick={() => localStorage.setItem([CartPrice], window.btoa(totalPrice))}>
          <button
            id='checkoutbutton'
            style={{
              backgroundColor: !bagObjects ? "gray" : "",
              cursor: !bagObjects ? "not-allowed" : "",
            }}
            disabled={!bagObjects}>
            Proceed to Checkout {">"}
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Bag;

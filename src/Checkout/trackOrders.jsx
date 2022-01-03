import React, { useEffect, useState } from "react";
import "./track.css";
import BackendUrl from "../BackendUrl";

import axios from "axios";
import logo from "../resources/suchitarajeTransparentLogo.png";

import { db } from "../firebase";
import { Link } from "react-router-dom";
const TrackOrders = () => {
  let urlParameter = window.location.href.split("?");

  let [IDRequested, setIDRequested] = useState(urlParameter[1]);
  let [dataReceived, setDataReceived] = useState("");
  let [OrderObject, setOrderObject] = useState({});
  const fetchOrder = () => {
    db.collection("Orders")
      .doc(IDRequested)
      .get()
      .then(doc => {
        console.log(IDRequested);
        let appObj = { ...doc.data() };
        setOrderObject(appObj);
      });
    setDataReceived(true);
    console.log(OrderObject.id);
  };

  return (
    <div className='MainHolder'>
      <div className='NavBar'>
        <Link to='/home'>
          <img src={logo} id='logo'></img>
        </Link>
        <Link to='/catalogue'>
          <h2>Catalogue</h2>
        </Link>{" "}
        <Link to='/about-us'>
          <h2>FAQs</h2>
        </Link>
      </div>
      <div className='TrackBox'>
        <h1>Tracking Details</h1>
        <div onLoad={fetchOrder}>
          <input
            type='text'
            placeholder='Enter your Order ID'
            autoFocus
            value={IDRequested}
            onChange={e => {
              setIDRequested(e.target.value.replace(/\s+/g, ""));

              fetchOrder();
            }}
          />
          <button onClick={fetchOrder} className='PaymentButtons'>
            Submit
          </button>
        </div>
        {dataReceived && (
          <table>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Mobile</th>
              <th>Order Details</th>
              <th id='AddressTable'>Shipping Address</th>
              <th>Payment Balance</th>
              <th>ORDER STATUS</th>
            </tr>
            <tr>
              <td>{OrderObject.id}</td>
              <td>{OrderObject.CustomerName}</td>
              <td>{OrderObject.CustomerMobile}</td>
              <td>{OrderObject.ProductKeys}</td>
              <td id='AddressTable'>
                {OrderObject.Address +
                  ", " +
                  OrderObject.City +
                  ", " +
                  OrderObject.Tehsil +
                  ", " +
                  OrderObject.District +
                  ", " +
                  OrderObject.State +
                  ", " +
                  OrderObject.PinCode}
              </td>
              <td>{OrderObject.BillBalance}</td>
              <td>
                {OrderObject.OrderStatus}{" "}
                {OrderObject.CourierLink && OrderObject.OrderStatus == "Shipped" && (
                  <><br/><a href={OrderObject.CourierLink}>Shipment Link</a></>
                )}
                {OrderObject.OrderStatus == "Delivered" && (
                  <button
                    onClick={() => {
                      db.collection("Orders").doc(OrderObject.id).update({
                        OrderStatus: "Return Requested",
                      });

                      axios.post(BackendUrl + "/Mail", {
                        email: OrderObject.CustomerEmail,
                        subject: `Your Return Request is Received`,
                        message: `Dear ${OrderObject.CustomerName}, <br ></br><br ></br>
                        Return Request Received for your OrderID :  ${OrderObject.id}. <br ></br>Please reply to this email with your concerns and we will contact you immediately and process the return as soon as possible. Please keep all the tags and branding values intact for hassle-free returns <br></br>. Thank You for Shopping <br></br> <img src='cid:logo'></img>`,
                        orderID: OrderObject.id,
                      });
                      window.location.reload();
                    }}>
                    Request Return
                  </button>
                )}
              </td>
            </tr>
          </table>
        )}
      </div>
    </div>
  );
};

export default TrackOrders;

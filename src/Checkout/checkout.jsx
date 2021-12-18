import React, { useState, useEffect } from "react";
import "./checkout.css";

import { Link } from "react-router-dom";
import logo from "../resources/suchitarajeTransparentLogo.png";
import orderPlaced from "../resources/placed.gif";

import { db } from "../firebase";

import axios from "axios";

const CheckOutPage = () => {
  let dakhavRe = document.getElementById("ShowCost");

  let locale1 = window.btoa("MyBag");
  let CartPrice = window.btoa("CartPayment");
  let PaymentAmount = window.btoa("PaymentAmount");

  let PaytotalCost = 0;

  let totalCost = localStorage.getItem([CartPrice]);
  let bagObjects = JSON.parse(localStorage.getItem(locale1));
  let product_nameKey = window.btoa("product_name");
  let product_priceKey = window.btoa("product_price");
  let product_idKey = window.btoa("product_id");
  let product_sizeKey = window.btoa("product_size");
  let product_qtyKey = window.btoa("product_qty");
  let product_imageKey = window.btoa("product_image");
  let [customerName, setCustomerName] = useState("");
  let [city, setCity] = useState("");
  let [address1, setAddressLine1] = useState("");
  let [customerMob, setCustomerMob] = useState("");
  let [customerEmail, setCustomerEmail] = useState("");
  let [pincode, setPincode] = useState("");
  let [state, setState] = useState("");
  let [district, setDistrict] = useState("");
  let [taluka, setTaluka] = useState("");
  let applied = localStorage.getItem([PaymentAmount]);
  applied && localStorage.removeItem([PaymentAmount]);

  let pattern = new RegExp(
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
  let MobilePattern = new RegExp("[0-9]{10}");

  let [invalidPincode, setInvalidPincode] = useState(false);
  let [invalidName, setInvalidName] = useState(false);
  let [invalidNumber, setInvalidNumber] = useState(false);
  let [invalidEmail, setInvalidEmail] = useState(false);
  let [invalidCity, setInvalidCity] = useState(false);
  let [allValid, setAllValid] = useState(false);
  let [showPaymentModal, setShowPaymentModal] = useState(false);

  const handlePincode = async e => {
    pincode = e.target.value;
    setPincode(pincode);
    let data = await axios.get(
      `https://api.worldpostallocations.com?postalcode=${pincode}&countrycode=IN`
    );
    if (data.data.result.length == 0) {
      setInvalidPincode(true);
    } else {
      setInvalidPincode(false);
      setState(data.data.result[0].state);
      setDistrict(data.data.result[0].district);
      setTaluka(data.data.result[0].province);
    }
  };
  const handleChanges = async e => {
    if (customerName.length < 5) {
      setInvalidName(true);

      return;
    } else {
      setInvalidName(false);
    }
    if (city.length < 1) {
      setInvalidCity(true);
      return;
    } else {
      setInvalidCity(false);
    }
    if (MobilePattern.test(customerMob) === false) {
      setInvalidNumber(true);
      return;
    } else {
      setInvalidNumber(false);
    }
    if (pattern.test(customerEmail) === false) {
      setInvalidEmail(true);
      return;
    } else {
      setInvalidEmail(false);
    }
    if (!invalidCity && !invalidEmail && !invalidName && !invalidNumber && !invalidPincode) {
      setAllValid(true);
    }
  };
  let UserDetails = {
    CustomerName: customerName,
    CustomerMobile: customerMob,
    CustomerEmail: customerEmail,
    Address: address1,
    PinCode: pincode,
    City: city,
    Tehsil: taluka,
    District: district,
    State: state,
  };
  const handleSubmit = e => {
    e.preventDefault();
    UserDetails = {
      CustomerName: customerName,
      CustomerMobile: customerMob,
      CustomerEmail: customerEmail,
      Address: address1,
      PinCode: pincode,
      City: city,
      Tehsil: taluka,
      District: district,
      State: state,
    };
    localStorage.setItem("Person", JSON.stringify(UserDetails));

    setShowPaymentModal(true);
  };

  // After RazorPay

  let [orderID, setOrderID] = useState("");
  let [Successfully, SetSuccessfully] = useState(false);

  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();

  today = dd + "/" + mm + "/" + yyyy;

  const setFirebaseOrder = (orderID, paidAmount) => {
    let ProductKeys = " ";

    bagObjects.forEach(element => {
      ProductKeys =
        ProductKeys +
        window.atob(element[product_idKey]) +
        " : " +
        window.atob(element[product_qtyKey]) +
        " & ";
    });
    db.collection("Orders").doc(orderID).set({
      id: orderID,
      CustomerName: customerName,
      CustomerMobile: customerMob,
      CustomerEmail: customerEmail,
      Address: address1,
      PinCode: pincode,
      City: city,
      Tehsil: taluka,
      District: district,
      State: state,
      ProductKeys: ProductKeys,
      Bill: orderAmount,
      BillBalance: paidAmount,
      OrderStatus: "Order Received",
      Date: today,
    });
    axios.post("/Mail", {
      email: customerEmail,
      subject: `Your Order is Placed Successfully`,
      message: `Dear ${customerName}, <br ></br><br ></br>
      We have received your order with <br></br> OrderID :  ${orderID} <br></br> <br></br> We will process the order shortly and keep you updated. <br></br> Payment Received : ${
        orderAmount - paidAmount
      } <br></br> Your Payment Balance is Rs. ${paidAmount}. <br></br> Thank you for Shopping with us. <br></br> <img src='cid:logo'></img>`,
      orderID: orderID,
    });
    axios.post("/sendSMS", {
      message: `We have received your order : ${orderID} and will start processing it quickly. Thank you for shopping WIth us. - Suchita Raje Studio`,
      number: [customerMob],
    });
    axios.post("/Mail", {
      email: "atharvabhagatprojects@gmail.com",
      subject: `New Order Received !!`,
      message: `From ${customerName}, ${customerEmail} , ${customerMob} <br ></br><br ></br>
         OrderID :  ${orderID} <br></br> <br></br>  <br></br> Payment Received : ${
        orderAmount - paidAmount
      } <br></br>Payment Balance is Rs. ${paidAmount}. <br></br><br><br/> ${ProductKeys} <br></br>`,
      orderID: orderID,
    });
  };

  const showOrderID = () => {
    SetSuccessfully(true);
    localStorage.clear();
  };

  //Pay on Delivery
  let [payOnDeliveryModal, setPayOnDeliveryModal] = useState(false);
  const loadPayOnDelivery = () => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onerror = () => {
      alert("Razorpay SDK failed to load. Are you online?");
    };
    script.onload = async () => {
      try {
        setLoading(true);
        const result = await axios.post("/create-order", {
          amount: 1 + "00",
        });
        const { amount, id: order_id, currency } = result.data;
        const {
          data: { key: razorpayKey },
        } = await axios.get("/get-razorpay-key");

        setOrderID(result.data.id);

        const options = {
          key: razorpayKey,
          amount: amount.toString(),
          currency: currency,
          name: "Suchita Raje Studio",
          description: "Payment",
          order_id: order_id,
          handler: async function (response) {
            const result = await axios.post("/pay-order", {
              amount: amount,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
            });
            alert(result.data.msg);
            setFirebaseOrder(order_id, orderAmount - 1);
            showOrderID();
          },

          theme: {
            color: "#FF4F00",
          },
        };

        setLoading(false);
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      } catch (err) {
        alert(err);
        setLoading(false);
      }
    };
    document.body.appendChild(script);
  };

  //  RAZORPAY

  const [loading, setLoading] = useState(false);
  const [orderAmount, setOrderAmount] = useState(window.atob(totalCost));

  function loadRazorpay() {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onerror = () => {
      alert("Razorpay SDK failed to load. Are you online?");
    };
    script.onload = async () => {
      try {
        setLoading(true);
        const result = await axios.post("/create-order", {
          amount: orderAmount + "00",
        });
        const { amount, id: order_id, currency } = result.data;
        const {
          data: { key: razorpayKey },
        } = await axios.get("/get-razorpay-key");

        setOrderID(result.data.id);

        const options = {
          key: razorpayKey,
          amount: amount.toString(),
          currency: currency,
          name: "Suchita Raje Studio",
          description: "Payment",
          order_id: order_id,
          handler: async function (response) {
            const result = await axios.post("/pay-order", {
              amount: amount,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
            });
            alert(result.data.msg);
            setFirebaseOrder(order_id, 0);
            showOrderID();
          },

          theme: {
            color: "#FF8C00",
          },
        };

        setLoading(false);
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      } catch (err) {
        alert(err);
        setLoading(false);
      }
    };
    document.body.appendChild(script);
  }

  return (
    <div className='MainHolder'>
      <div className='NavBar'>
        <Link to='/home'>
          <h2>Home</h2>
        </Link>
        <Link to='/catalogue'>
          <h2>Catalogue</h2>
        </Link>
        <img src={logo} id='logo'></img>

        <Link to='/about-us'>
          <h2>About Us</h2>
        </Link>

        <Link to='/contact-us'>
          <h2>Contact Us</h2>
        </Link>
      </div>
      {Successfully && (
        <div className='SuccessfulPayment'>
          <img src={orderPlaced} />
          <h1> Order Placed Successfully</h1>
          <h2 id='trackingID'>Order ID : {orderID}</h2>
          <p>You will Receive Notifications via Mail and SMS </p>

          <Link to='/trackOrders'>Track Your Order Status Here</Link>
          <Link to='/catalogue'>Shop Again</Link>
        </div>
      )}
      {!Successfully && (
        <>
          <div
            className='PaymentModal'
            style={{ transform: showPaymentModal ? "translateX(0vh)" : "translateY(100vh)" }}>
            <div className='PaymentInfo'>
              <img id='productInsideLogo' src={logo} />

              <h1
                id='closeButton'
                onClick={() => {
                  dakhavRe.innerHTML = "Total : &#8377;" + window.atob(totalCost);

                  applied && localStorage.removeItem([PaymentAmount]);

                  setShowPaymentModal(false);
                }}>
                X
              </h1>

              <h1>Order Summary</h1>
              <div className='ActualSummary'>
                <div className='BagDetails'>
                  <h2>Order Details</h2>
                  {bagObjects &&
                    bagObjects.map((items, index) => (
                      <div className='OrderSummaryItems'>
                        <div className='OrderBox'>
                          <img
                            className='ProductImage'
                            src={window.atob(items[product_imageKey])}></img>
                          <div className='ProductText'>
                            <div>
                              <h3>{window.atob(items[product_nameKey])}</h3>
                              {/* <h6>ID : {window.atob(items[product_idKey])}</h6> */}
                              <h3>Size : {window.atob(items[product_sizeKey])}</h3>
                            </div>
                            <div>
                              <h4>Qty: {window.atob(items[product_qtyKey])} </h4>
                              <h3>Price: &#8377; {window.atob(items[product_priceKey])}</h3>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  <hr />
                  <h6 id='ShowCost'>Total : &#8377; {window.atob(totalCost)}</h6>

                  <hr />
                  <div id='couponBox'>
                    <b>Apply Promo Code</b>
                    <div>
                      <input type='text' id='couponChecker' placeholder='COUPON'></input>
                      <button
                        onClick={() => {
                          let couponTyped = document.getElementById("couponChecker").value;
                          if (
                            couponTyped == "CONNEXT20" &&
                            parseInt(window.atob(totalCost)) >= 1499
                          ) {
                            if (!applied) {
                              PaytotalCost = Math.floor(parseInt(window.atob(totalCost)) * 0.8);
                              localStorage.setItem(
                                [PaymentAmount],
                                window.btoa("XFBCCRBJA7764NA9J2MJSAFE")
                              );
                              dakhavRe.innerHTML = "Total : &#8377;" + PaytotalCost;
                              setOrderAmount(PaytotalCost);
                            }
                          } else {
                            alert("Invalid Code / Order Value less than 1499");
                          }
                        }}>
                        Apply
                      </button>
                    </div>
                  </div>
                </div>

                <div className='UserDetails'>
                  <h2>Shipping Details</h2>
                  <h4>{UserDetails.CustomerName}</h4>
                  <h5>{UserDetails.CustomerMobile}</h5>
                  <h5>{UserDetails.CustomerEmail}</h5>
                  <h4>{UserDetails.Address + " , "}</h4>
                  <h4>
                    {UserDetails.City +
                      " , " +
                      UserDetails.Tehsil +
                      " , " +
                      UserDetails.District +
                      " , " +
                      UserDetails.State}
                  </h4>
                  <h4>{UserDetails.PinCode}</h4>
                  <div className='PaymentHolder'>
                    <button disabled={loading} onClick={loadRazorpay} className='PaymentButtons'>
                      Pay Now
                    </button>

                    <button
                      disabled={loading}
                      onClick={() => setPayOnDeliveryModal(true)}
                      className='PaymentButtons'>
                      Pay &#8377; 1 now & Rest on Delivery
                    </button>

                    <div
                      className='PayOnDelivery'
                      style={{ display: payOnDeliveryModal ? "" : "none" }}>
                      <p>
                        You will Receive a Link on Mail / Mobile No. once the product is shipped.
                        You can complete the Online Payment then. Cash won't be accepted by the
                        delivery person
                      </p>
                      <button
                        disabled={loading}
                        onClick={loadPayOnDelivery}
                        className='PaymentButtons'>
                        Pay &#8377; 1 and Place Order
                      </button>
                    </div>
                  </div>
                </div>

                {/* {loading && <div>Loading...</div>} */}
              </div>
            </div>
          </div>

          <div className='CheckOutHolder'>
            <div className='PersonalDetails'>
              <h1>Shipping Details</h1>

              <form className='CheckOutForm' onSubmit={handleSubmit}>
                <div className='formfield'>
                  <label for='CustomerName'>Name</label>
                  <input
                    onChange={e => {
                      setAllValid(false);
                      setCustomerName(e.target.value);
                    }}
                    type='text'
                    value={customerName}
                    id='CustomerName'
                    name='CustomerName'
                    placeholder='Enter Your Name'></input>
                  <p className='invalidIndicator' style={{ display: invalidName ? "" : "none" }}>
                    {"Min 5 Characters Required"}
                  </p>
                </div>
                <div className='formfield'>
                  <label for='CustomerMobile'>Mobile No.</label>
                  <input
                    onChange={e => {
                      setAllValid(false);
                      setCustomerMob(e.target.value);
                    }}
                    onClick={e => {
                      setCustomerMob(e.target.value);
                    }}
                    type='tel'
                    value={customerMob}
                    maxLength='10'
                    id='CustomerMobile'
                    name='CustomerMobile'
                    placeholder='Enter Mobile No.'></input>
                  <p className='invalidIndicator' style={{ display: invalidNumber ? "" : "none" }}>
                    {"Please Enter Valid Mobile"}
                  </p>
                </div>
                <div className='formfield'>
                  <label for='CustomerEmail'>Email ID</label>
                  <input
                    onChange={e => {
                      setAllValid(false);
                      setCustomerEmail(e.target.value);
                    }}
                    type='email'
                    value={customerEmail}
                    id='CustomerMobile'
                    name='CustomerMobile'
                    placeholder='Enter Email Address'></input>
                  <p className='invalidIndicator' style={{ display: invalidEmail ? "" : "none" }}>
                    {"Please Enter Valid Email"}
                  </p>
                </div>
                <div className='formfield'>
                  <label for='AddressLine1'>Address</label>
                  <input
                    onChange={e => {
                      setAllValid(false);
                      setAddressLine1(e.target.value);
                    }}
                    value={address1}
                    type='text'
                    id='AddressLine1'
                    name='AddressLine1'
                    placeholder='House No. , Building Name , Locality'></input>
                </div>
                <div className='formfield'>
                  <label for='PinCode'>Pin Code</label>
                  <input
                    value={pincode}
                    style={{ color: invalidPincode ? "red" : "green" }}
                    onChange={e => {
                      setAllValid(false);
                      handlePincode(e);
                    }}
                    type='text'
                    maxLength='6'
                    id='PinCode'
                    name='PinCode'
                    placeholder='Enter Pin Code'></input>
                  <p className='invalidIndicator' style={{ display: invalidPincode ? "" : "none" }}>
                    {"Please Enter Valid Code"}
                  </p>
                </div>

                <div className='formfield'>
                  <label for='City'>City</label>
                  <input
                    onChange={e => {
                      setAllValid(false);
                      setCity(e.target.value);
                    }}
                    value={city}
                    type='text'
                    id='City'
                    name='City'
                    placeholder='Enter City'></input>
                  <p className='invalidIndicator' style={{ display: invalidCity ? "" : "none" }}>
                    {"Please Enter Valid City"}
                  </p>
                </div>
                <div className='formfield'>
                  <label for='Taluka'>Tehsil</label>
                  <input
                    value={taluka}
                    type='text'
                    id='Taluka'
                    name='Taluka'
                    placeholder='Province'
                    disabled></input>
                </div>
                <div className='formfield'>
                  <label for='District'>District</label>
                  <input
                    value={district}
                    type='text'
                    id='AddressLine2'
                    name='AddressLine2'
                    placeholder='District'
                    disabled></input>
                </div>
                <div className='formfield'>
                  <label for='State'>State</label>
                  <input
                    value={state}
                    type='text'
                    id='AddressLine2'
                    name='AddressLine2'
                    placeholder='State'
                    disabled></input>
                </div>
                <br />
                {!allValid && (
                  <input
                    type='button'
                    onClick={handleChanges}
                    id='SaveDetails'
                    value='Place Order > '
                    disabled={!bagObjects}
                    style={{
                      backgroundColor: !bagObjects ? "gray" : "",
                      cursor: !bagObjects ? "not-allowed" : "",
                    }}></input>
                )}

                {allValid && (
                  <span>
                    <input type='submit' id='SaveDetails' value='Proceed to Pay > '></input>
                    <b>Saved Successfully !</b>
                  </span>
                )}
              </form>
            </div>
            <div className='BagSummary'>
              <h1>Bag Summary</h1>

              <hr />
              <h3 id='ShowCost'>Total : &#8377; {window.atob(totalCost)}</h3>

              <hr />

              {bagObjects &&
                bagObjects.map((items, index) => (
                  <div className='OrderSummaryItems'>
                    <div className='OrderBox'>
                      <img
                        className='ProductImage'
                        src={window.atob(items[product_imageKey])}></img>
                      <div className='ProductText'>
                        <div>
                          <h3>{window.atob(items[product_nameKey])}</h3>
                          <h6>ID : {window.atob(items[product_idKey])}</h6>
                          <h3>Size : {window.atob(items[product_sizeKey])}</h3>
                        </div>
                        <div>
                          <h4>Qty: {window.atob(items[product_qtyKey])} </h4>
                          <h3>Price: &#8377; {window.atob(items[product_priceKey])}</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CheckOutPage;

import React from "react";

import Footer from "./footer";

import HomePage from "./HomePage/HomePage";
import CataloguePage from "./Catalogue/cataloguePage";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import CheckOutPage from "./Checkout/checkout";
import TrackOrders from "./Checkout/trackOrders";

function App() {
  return (
    <div className='App'>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<HomePage />} exact />
          <Route path='/home' element={<HomePage />} exact />
          <Route path='/catalogue' element={<CataloguePage />} exact />
          <Route path='/checkout' element={<CheckOutPage />} exact />
          <Route path='/trackOrders' element={<TrackOrders />} exact />
        </Routes>
      </BrowserRouter>
      <Footer />
    </div>
  );
}

export default App;

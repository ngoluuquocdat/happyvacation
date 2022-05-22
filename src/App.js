import React, { Component } from 'react';
import { onMessageListener } from './firebase';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import Home from './Components/HomePage/Home';
import ToursPage from './Components/ToursPage';
import TourDetailPage from './Components/TourDetail/TourDetailPage';
import ProviderPage from './Components/TourProviderPage';
import UserMain from './Components/User/UserMain';
import ProviderMain from './Components/ForProvider/ProviderMain';
import Login from './Components/Login/LoginPage';
import PlacePage from './Components/Place/PlacePage'
import TouristSitePage from './Components/Place/TouristSitePage'
import logo from './Images/HappyVacation.png';
import Footer from './Components/Footer/Footer';
import Register from './Components/Register/RegisterPage';
import Checkout from './Components/Checkout';
import PaypalSuccess from './Components/PaypalSuccess';
import ProviderOrderDetailModal from './Components/ForProvider/ProviderOrderDetailModal';
import UserOrderDetailModal from './Components/User/UserTourOrder/UserOrderDetailModal';
import NotFoundPage from './Components/NotFoundPage';
import {
  BrowserRouter,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { ToastContainer} from 'react-toastify';


class App extends Component {
  state = { width: 0, height: 0 };

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }
  updateWindowDimensions = () =>
    this.setState({ width: window.innerWidth, height: window.innerHeight });

  render() {
    const { width } = this.state;
    const mobileTablet = width <= 1100;

    if (mobileTablet) {
      return (
        <div className="mobile-tablet">
          <img src={logo} alt="Headout" />
          <p>
            Currently, we're not supporting Mobile & Tablets{' '}
            <span role="img" aria-label="Warn">
              🙏
            </span>
          </p>
        </div>
      );
    } else {
      return (
        <PayPalScriptProvider options={{"client-id": "ARqrsuQnlbgJc1KFc3MCUHtEc9s6NZC15MtmYVuGL9HLZRoLX804chAwPoOwygzSI-z5ld9Rh52N3tSL"}}>
          <BrowserRouter>
            <>
              <ToastContainer
                position="top-right"
                autoClose={2500}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
              />
              <Switch>
                <Route path="/" exact>
                  <Home />
                  <Footer />
                </Route >
                <Route path="/tours" exact >
                  <ToursPage />
                  <Footer />
                </Route >
                <Route path="/tours/:id" >
                  <TourDetailPage />
                  <Footer />
                </Route >
                <Route path="/providers/:id" >
                  <ProviderPage />
                  <Footer />
                </Route >
                <Route path="/places/:id" >
                  <PlacePage />
                  <Footer />
                </Route >
                <Route path="/sites/:id" >
                  <TouristSitePage />
                  <Footer />
                </Route >
                <Route path="/checkout" exact>
                  <Checkout />
                  <Footer />
                </Route >
                <Route path="/checkout/successful">
                    <PaypalSuccess />
                    <Footer />
                </Route >
                <Route path="/login" >
                  <Login />
                </Route >
                <Route path="/register" >
                  <Register />
                </Route >
                <Route path="/user" >
                  <UserMain />
                </Route >
                <Route path="/for-provider">
                  <ProviderMain />
                </Route >
                <Route path="/provider/view/orders/:id" exact>
                    <ProviderOrderDetailModal />
                </Route >
                <Route path="/customer/view/orders/:id" exact>
                    <UserOrderDetailModal />
                </Route >
                <Route path="/not-found" exact>
                    <NotFoundPage />
                </Route >
              </Switch>          
            </>
          </BrowserRouter>
        </PayPalScriptProvider>
        
      )
    }
  }
}

export default App;

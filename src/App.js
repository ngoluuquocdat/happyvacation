import React, { Component } from 'react';
import Home from './Components/HomePage/Home';
import ToursPage from './Components/ToursPage';
import TourDetailPage from './Components/TourDetail/TourDetailPage';
import ProviderPage from './Components/ProviderPage';
import ProviderMain from './Components/ForProvider/ProviderMain';
import logo from './Images/HappyVacation.png';
import Footer from './Components/Footer/Footer';
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
              <Route path="/for-provider">
                <ProviderMain />
              </Route >
            </Switch>
            
          </>
        </BrowserRouter>
      )
    }
  }
}

export default App;

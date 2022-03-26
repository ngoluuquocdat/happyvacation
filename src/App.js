import React, { Component } from 'react';
import Home from './Components/HomePage/Home';
import ToursPage from './Components/ToursPage';
import logo from './Images/HappyVacation.png';
import Footer from './Components/Footer/Footer';
import {
  BrowserRouter,
  Switch,
  Route,
  Link
} from "react-router-dom";

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
            <Switch>
              <Route path="/" exact>
                <Home />
              </Route >
              <Route path="/tours" >
                <ToursPage />
              </Route >
            </Switch>
            <Footer />
          </>
        </BrowserRouter>
      )
    }
  }
}

export default App;

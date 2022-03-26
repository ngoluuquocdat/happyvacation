import React, { Component } from 'react';
import Header from '../Header/Header';
import TopDestinations from './TopDestinations';
import TopTours from './TopTours';
import '../../Styles/home.css';

class Home extends Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }
  render() {
    return (
      <div className="App">
        <Header isSmall={false}/>
        <TopDestinations />
        <TopTours />
      </div>
    );
  }
}

export default Home;

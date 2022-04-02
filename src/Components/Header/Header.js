import React, { Component } from 'react';
import MyBackgroundCarousel from './MyBackground';
import '../../Styles/header.css';
import SearchBar from './SearchBar';
import HeaderNav from './HeaderNav'

class Header extends Component {
  state = {
    filter: this.props.filter
  };

  render() {
    const {
      history,
      isSmall
    } = this.props;
    const filter = this.state.filter;
    //console.log('filter from header', filter)
    const className = isSmall ? "search-bar-container small" : "search-bar-container"
    return (
      <React.Fragment>
        <div className="header-container">
          <HeaderNav
            history={history}
            currentUser={this.state.currentUser}
          />
          <MyBackgroundCarousel backgroundImagesData={backgroundImagesData} isSmall={isSmall}/>
          <div className={className}> 
            {
              isSmall ||
              <div className="welcome-container">
                <h1 className="welcome-text">Hi there!</h1>
                <p className="sub-welcome-text">Where would you like to go?</p>
              </div>
            }
            
            <SearchBar filter={filter}/>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

// Caraousel Images for Home
const backgroundImagesData = [
  {
    id: 1,
    url:
      'https://hoianexpress.com.vn/wp-content/uploads/2019/10/BP_3242-Edit.jpg'
  },
  {
    id: 2,
    url:
      'https://hoianexpress.com.vn/wp-content/uploads/2020/03/slide4-1.jpg'
  }
];


export default Header;

import React, { Component } from 'react';
import HeaderNav from './HeaderNav'
import MyBackgroundCarousel from './MyBackground';
import SearchBar from './SearchBar';
import SearchBarHotel from './SearchBarHotel';
import '../../Styles/header.css';

class Header extends Component {
  state = {
    filter: this.props.filter,
    search_option: 'tours'
  };

  // handle change search option
  handleChangeSearchOption = (event) => {
    const search_option = event.target.id.length > 0 ?  event.target.id : event.target.closest('li').id;
    this.setState({
      search_option: search_option
    })
  }

  render() {
    const {
      history,
      isSmall
    } = this.props;
    const filter = this.state.filter;
    const search_option = this.state.search_option;
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
            <ul className="search-option-list">
              <li className={search_option === 'tours' ? "search-option-item active" : "search-option-item"} id="tours" onClick={this.handleChangeSearchOption}>
                <span className="search-option-name" >Tours</span>
              </li>
              <li className={search_option === 'hotels' ? "search-option-item active" : "search-option-item"} id="hotels" onClick={this.handleChangeSearchOption}>
                <span className="search-option-name">Hotels</span>
              </li>
            </ul>
            {
              search_option === 'tours' ? 
              <SearchBar filter={filter}/>
              :
              <SearchBarHotel filter={filter}/>
            }
          </div>
        </div>
      </React.Fragment>
    );
  }
}

// Carousel Images for Home
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

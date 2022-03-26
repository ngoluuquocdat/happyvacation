import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FaCaretDown } from 'react-icons/fa';
import HappyVacationLogo from '../../Images/HappyVacation.png';
import '../../Styles/header-nav.scss';

class HeaderNav extends Component {

    state = {
      currentUser: null,
      isShowUserMenu: false
    };

    componentDidMount() {
      // call api to get user or get user from local storage
      // fake api response
      const currentUser = {
        username: 'quocdat',
        avatarPath: 'https://secure.gravatar.com/avatar/413b990ccd2cf5ba69d609fdba4f0302',
        token: ''
      }
      this.setState({
        currentUser: currentUser
      })
    }

    // click open user menu
    handleClickUserMenu = () => {
      const isShowUserMenu = this.state.isShowUserMenu;
      
      this.setState({
        isShowUserMenu: !isShowUserMenu
      })
    }

  render() {
    const currentUser = this.state.currentUser;
    const isShowUserMenu = this.state.isShowUserMenu;
    return (
      <div className="header-wrap">
            <div className="nav-bar">             
                <Link to={{ pathname: `/` }}>
                  <div>
                    <img id="logo" src={HappyVacationLogo} alt="Headout" />
                  </div>
                </Link>
                <div className="list-nav">
                  <Link to="/" exact="true" className="list-nav-item">Home</Link>
                  <Link to="/" exact="true" className="list-nav-item">Best Sellers</Link>
                  <Link to="/" exact="true" className="list-nav-item">Abu Dhabi City Tours</Link>
                  <Link to="/" exact="true" className="list-nav-item">Policy</Link>
                  {
                    !!currentUser ? // check current user null, maybe check token later
                      <div className="sign-in" onClick={() => this.handleClickUserMenu()}>
                        <div className="user-avatar">
                          <img
                            src={currentUser.avatarPath}
                            alt="lastnamearya"
                          />
                        </div>
                        <div className="user-name">
                          <p className="user-name-text">
                            {currentUser.username} <FaCaretDown size="0.8em"/>
                          </p>
                          {
                            isShowUserMenu &&
                            <div className="user-menu">
                              <ul className="user-menu-list">
                                <li className="user-menu-item">Profile</li>
                                <li className="user-menu-item">Sign out</li>
                              </ul>
                            </div>
                          }
                        </div>
                      </div>
                      :
                      <Link to="/" exact="true" className="list-nav-item">Login</Link>
                  }                                    
                </div>
              
            </div>
      </div>
    );
  }
}

export default HeaderNav;
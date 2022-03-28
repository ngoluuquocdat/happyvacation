import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FaCaretDown } from 'react-icons/fa';
import HappyVacationLogo from '../../Images/HappyVacation.png';
import '../../Styles/header-nav.scss';
import {connect} from 'react-redux';

class HeaderNav extends Component {

    state = {
      isShowUserMenu: false
    };

    componentDidMount() {
      // call api to get user or get user from local storage
      // fake api response
      // const currentUser = {
      //   username: 'quocdat',
      //   avatarPath: 'https://secure.gravatar.com/avatar/413b990ccd2cf5ba69d609fdba4f0302',
      //   token: ''
      // }
    }

    // click open user menu
    handleClickUserMenu = () => {
      const isShowUserMenu = this.state.isShowUserMenu;
      
      this.setState({
        isShowUserMenu: !isShowUserMenu
      })
    }

  render() {
    const currentUser = this.props.reduxData.user;
    const isShowUserMenu = this.state.isShowUserMenu;
    const isCurrentUserExist = ((currentUser!=null)&&(Object.keys(currentUser).length !== 0 && currentUser.constructor === Object));

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
                  <Link to="/" exact="true" className="list-nav-item">Comnunity Blog</Link>
                  <Link to="/" exact="true" className="list-nav-item">Policy</Link>
                  {
                    isCurrentUserExist ? // check current user null, maybe check token later
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

const mapStateToProps = (state) => {
  return {
      reduxData: state
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
      saveUserRedux: (user) => dispatch({type: 'SAVE_USER', payload: user})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HeaderNav);
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { FaCaretDown } from 'react-icons/fa';
import HappyVacationLogo from '../../Images/HappyVacation.png';
import '../../Styles/header-nav.scss';
import {connect} from 'react-redux';

class HeaderNav extends Component {

    state = {
      isShowUserMenu: false
    };

    baseUrl = this.props.reduxData.baseUrl;

    async componentDidMount() {
      window.scrollTo(0, 0);
      console.log("call get user info")
      const token = localStorage.getItem('user-token');
      if(!token) {
        return;
      }
      try {
        let res = await axios.get(
          `${this.baseUrl}/api/Users/me`,
          {
            headers: { Authorization:`Bearer ${token}` }
          }
        );          
        console.log(res);
        const user = {
            username: res.data.username,
            fullName: `${res.data.firstName} ${res.data.lastName}`,
            phone: res.data.phone,
            email: res.data.email,
            avatarUrl: res.data.avatarUrl
        }
        // set current user in redux
        this.props.saveUserRedux(user);

      } catch (error) {
        if (!error.response) {
          toast.error("Network error");
          console.log(error)
          return;
        }
        if (error.response.status === 400) {
          console.log(error)
        }
        if (error.response.status === 401) {
          console.log(error);
          // redirect to login page or show notification
          this.props.history.push('/login', {prevPath: this.props.location.pathname});
        }
      } finally {
        
      }  
    }

    // click open user menu
    handleClickUserMenu = () => {
      const isShowUserMenu = this.state.isShowUserMenu;     
      this.setState({
        isShowUserMenu: !isShowUserMenu
      })
    }

    // go to profile
    toProfile = () => {
      this.props.history.push('/user/profile');
    }

    // sign out
    signOut = () => {
      localStorage.removeItem('user-token');
      // set current user in redux to null
      this.props.saveUserRedux(null);
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
                  <Link to="/" exact="true" className="list-nav-item">Destinations</Link>
                  <Link to="/" exact="true" className="list-nav-item">Comnunity Blog</Link>
                  <Link to="/" exact="true" className="list-nav-item">Policy</Link>
                  {
                    isCurrentUserExist ? // check current user null, maybe check token later
                      <div className="sign-in" onClick={() => this.handleClickUserMenu()}>
                        <div className="user-avatar">
                          <img
                            src={this.baseUrl + currentUser.avatarUrl}
                            alt="avatar"
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
                                <li className="user-menu-item" onClick={this.toProfile}>Profile</li>
                                <li className="user-menu-item" onClick={this.signOut}>Sign out</li>
                              </ul>
                            </div>
                          }
                        </div>
                      </div>
                      :
                      <Link 
                        to={{
                          pathname:"/login", 
                          state:{
                            prevPath:this.props.location.pathname,
                            filter: this.props.location.state ? this.props.location.state.filter : null
                          }
                        }} 
                        exact="true" 
                        className="list-nav-item"
                      >
                        Login
                      </Link>
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(HeaderNav));
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import {  subscribeToTopic } from '../../firebase';
import ReactLoading from "react-loading";
import { withRouter } from 'react-router-dom';
import { FaCaretDown } from 'react-icons/fa';
import HappyVacationLogo from '../../Images/HappyVacation.png';
import '../../Styles/header-nav.scss';
import { connect } from 'react-redux';

class HeaderNav extends Component {

    state = {
      places: [],
      isShowDestinationsMenu: false,
      isShowUserMenu: false,
      isLoading: false
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
        this.setState({
          isLoading: true
        })
        let res = await axios.get(
          `${this.baseUrl}/api/Users/me`,
          {
            headers: { Authorization:`Bearer ${token}` }
          }
        );          
        const user = {
            username: res.data.username,
            firstName: res.data.firstName,
            lastName: res.data.lastName,
            phone: res.data.phone,
            email: res.data.email,
            avatarUrl: res.data.avatarUrl,
            providerId: res.data.providerId
        }
        // set current user in redux
        this.props.saveUserRedux(user);
        // subscribe topic
        if(user.providerId !== 0) {
          const topic = `Tour_Provider_${user.providerId}`;
          subscribeToTopic(topic);
        }
      } catch (error) {
        if (!error.response) {
          toast.error("Network error");
          console.log(error)
        } else {
          if (error.response.status === 400) {
            console.log(error)
          }
          if (error.response.status === 401) {
            console.log(error);
            // clear expired token
            localStorage.removeItem('user-token');
            // set current user in redux to null
            this.props.saveUserRedux(null);
          }
        }
      } finally {
        this.setState({
          isLoading: false
        })
      }

      // call api to get places
      this.getPlaces();
    }

    // get places
    getPlaces = async() => {
      try {
        let res = await axios.get(`${this.baseUrl}/api/Places`);
        this.setState({
            places: res.data,
        }) 
      } catch (error) {
          if (!error.response) {
              // fake api response
              this.setState({
                places: listPlaces
              })           
          } 
      }
    }

    // click open destinations menu
    handleClickDestinationMenu = () => {
      const isShowDestinationsMenu = this.state.isShowDestinationsMenu;     
      this.setState({
        isShowDestinationsMenu: !isShowDestinationsMenu
      })
    }

    // handle place select
    handleDestinationItemSelect = (item) => {
      this.props.history.push(`/places/${item.id}`);
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
    const places = this.state.places;
    const { isShowDestinationsMenu, isShowUserMenu  }= this.state;
    const isCurrentUserExist = ((currentUser!=null)&&(Object.keys(currentUser).length !== 0 && currentUser.constructor === Object));
    const isLoading = this.state.isLoading;
    
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
                  <span className="list-nav-item" style={{position: 'relative'}} onClick={this.handleClickDestinationMenu}>
                    Destinations
                    {
                      isShowDestinationsMenu &&
                      <ul className="destination-menu">
                          {
                              places.map((item) => {
                                  return (
                                      <li 
                                          key={item.id}
                                          className="destination-item"
                                          onClick={() => this.handleDestinationItemSelect(item)}
                                      >
                                          {item.placeName}
                                      </li>
                                  )
                              })
                          }
                      </ul>
                    }
                  </span>
                  <Link to="/" exact="true" className="list-nav-item">Community Blog</Link>
                  <Link to="/" exact="true" className="list-nav-item">Policy</Link>
                  {
                    isLoading ?
                    <div className="loading-container list-nav-item">
                        <ReactLoading
                            className="loading-component"
                            type={"spin"}
                            color={"#df385f"}
                            height={20}
                            width={20}
                        />
                    </div>
                    :
                    <>
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
                    </>
                  }                                                   
                </div>
              
            </div>
      </div>
    );
  }
}

const listPlaces = [
  { id: 1, placeName: 'Da Nang' },
  { id: 2, placeName: 'Hue' },
  { id: 3, placeName: 'Hoi An' },
  { id: 4, placeName: 'Ha Long' },
  { id: 5, placeName: 'Ha Noi' },
  { id: 6, placeName: 'Ho Chi Minh' },
  { id: 7, placeName: 'Da Lat' },
  { id: 8, placeName: 'Nha Trang' },
  { id: 9, placeName: 'Phu Quoc' },
  { id: 10, placeName: 'Quy Nhon' },
  { id: 11, placeName: 'Sa Pa' },
  { id: 12, placeName: 'Vung Tau' },
  { id: 13, placeName: 'Mui Ne' },
  { id: 14, placeName: 'Con Dao' },
  { id: 15, placeName: 'Trang An' }
];

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
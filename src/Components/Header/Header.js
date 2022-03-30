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

// export class MyHeaderNav extends Component {

//     state = {
//       isShowUserMenu: false
//     };

//     // click open user menu
//     handleClickUserMenu = () => {
//       const isShowUserMenu = this.state.isShowUserMenu;
      
//       this.setState({
//         isShowUserMenu: !isShowUserMenu
//       })
//     }

//   render() {
//     const { currentUser } = this.props;
//     const isShowUserMenu = this.state.isShowUserMenu;
//     return (
//       <div className="header-wrap">
        
//             <div className="nav-bar">             
//                 <Link to={{ pathname: `/myhome` }}>
//                   <div>
//                     <img id="logo" src={HappyVacationLogo} alt="Headout" />
//                   </div>
//                 </Link>
//                 <div className="list-nav">
//                   <Link to="/" exact="true" className="list-nav-item">Home</Link>
//                   <Link to="/" exact="true" className="list-nav-item">Best Sellers</Link>
//                   <Link to="/" exact="true" className="list-nav-item">Abu Dhabi City Tours</Link>
//                   <Link to="/" exact="true" className="list-nav-item">Policy</Link>
//                   {
//                     !!currentUser ? // check current user null, maybe check token later
//                       <div className="sign-in" onClick={() => this.handleClickUserMenu()}>
//                         <div className="user-avatar">
//                           <img
//                             src={currentUser.avatarPath}
//                             alt="lastnamearya"
//                           />
//                         </div>
//                         <div className="user-name">
//                           <p className="user-name-text">
//                             {currentUser.username} <FaCaretDown size="0.8em"/>
//                           </p>
//                           {
//                             isShowUserMenu &&
//                             <div className="user-menu">
//                               <ul className="user-menu-list">
//                                 <li className="user-menu-item">Profile</li>
//                                 <li className="user-menu-item">Sign out</li>
//                               </ul>
//                             </div>
//                           }
//                         </div>
//                       </div>
//                       :
//                       <Link to="/" exact="true" className="list-nav-item">Login</Link>
//                   }                                    
//                 </div>
              
//             </div>


//       </div>
//     );
//   }
// }

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

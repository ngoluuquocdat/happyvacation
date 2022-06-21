import React from 'react';
import ReactDOM from 'react-dom';
import { FaCaretDown } from 'react-icons/fa';
import { RiFileList3Line } from 'react-icons/ri'
import { NavLink, Link } from "react-router-dom";
import '../../Styles/user-side-nav.scss'

class UserSideNav extends React.Component {

    render() {
        return (
            <div className='user-side-nav-container'>
                <ul className='side-nav-menu'>
                    <li className='side-nav-item'>
                        <div className='header'>
                            <RiFileList3Line />
                            <span className='item-text'>Booked tours</span>
                            <FaCaretDown />
                        </div>
                        <ul className='side-nav-submenu'>
                            <li className='submenu-item' onClick={this.handleItemSelect}>
                                <NavLink className="item-link" to="/user/orders" exact={true}>
                                    Your Orders
                                </NavLink>
                            </li>
                            <li className='submenu-item' onClick={this.handleItemSelect}>
                                <NavLink className="item-link" to="/user/orders/pending">
                                    Pending
                                </NavLink>
                            </li>
                            <li className='submenu-item' onClick={this.handleItemSelect}>
                                <NavLink className="item-link" to="/user/orders/processed">
                                    Processed
                                </NavLink>
                            </li>
                        </ul>
                    </li>           
                    <li className='side-nav-item'>
                        <div className='header'>
                            <RiFileList3Line />
                            <span className='item-text'>Account</span>
                            <FaCaretDown />
                        </div>
                        <ul className='side-nav-submenu'>
                            <li className='submenu-item' onClick={this.handleItemSelect}>
                                <NavLink className="item-link" to="/user/profile">
                                    Profile
                                </NavLink>
                            </li>
                            <li className='submenu-item' onClick={this.handleItemSelect}>
                                <NavLink className="item-link" to="/user/password">
                                    Change password
                                </NavLink>
                            </li>
                        </ul>
                    </li>
                    <li className='side-nav-item'>
                        <div className='header'>
                            <RiFileList3Line />
                            <span className='item-text'>Favorite</span>
                            <FaCaretDown />
                        </div>
                        <ul className='side-nav-submenu'>
                            <li className='submenu-item' onClick={this.handleItemSelect}>
                                <NavLink className="item-link" to="/user/favorite-tours">
                                    Tours
                                </NavLink>
                            </li>
                        </ul>
                    </li>
                    <li className='side-nav-item'>
                        <div className='header'>
                            <RiFileList3Line />
                            <span className='item-text'>Chat</span>
                            <FaCaretDown />
                        </div>
                        <ul className='side-nav-submenu'>
                            <li className='submenu-item' onClick={this.handleItemSelect}>
                                <NavLink className="item-link" to="/user/chat">
                                    Chat page
                                </NavLink>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        )
    }
}

export default UserSideNav;
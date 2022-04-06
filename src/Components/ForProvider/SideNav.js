import React from 'react';
import ReactDOM from 'react-dom';
import { FaCaretDown } from 'react-icons/fa';
import { RiFileList3Line } from 'react-icons/ri'
import { NavLink, Link } from "react-router-dom";
import '../../Styles/ForProvider/side-nav.scss'

class SideNav extends React.Component {

    SideNavMenuRef = React.createRef();

    handleItemSelect = (event) => {
        // // remove active of other link
        // var item_links = this.SideNavMenuRef.current.getElementsByClassName('item-link');
        // for(let i = 0; i < item_links.length; i++){
        //     item_links[i].classList.remove('active');
        // } 
        // // add active to this link
        // if(event.target.className === 'submenu-item') {
        //     event.target.getElementsByClassName('item-link')[0].classList.add('active');
        // } else {
        //     event.target.classList.add('active');
        // }
    }

    render() {
        return (
            <div className='side-nav-container'>
                <div className="logo-section"> </div>
                <ul className='side-nav-menu' ref={this.SideNavMenuRef}>
                    <li className='side-nav-item'>
                        <div className='header'>
                            <RiFileList3Line />
                            <span className='item-text'>Orders Management</span>
                            <FaCaretDown />
                        </div>
                        <ul className='side-nav-submenu'>
                            <li className='submenu-item' onClick={this.handleItemSelect}>
                                <NavLink className="item-link" to="/for-provider/orders">
                                    Your Orders
                                </NavLink>
                            </li>
                            <li className='submenu-item' onClick={this.handleItemSelect}>
                                <NavLink className="item-link" to="/for-provider/orders/pending">
                                    Pending
                                </NavLink>
                            </li>
                            <li className='submenu-item' onClick={this.handleItemSelect}>
                                <NavLink className="item-link" to="/for-provider/orders/processed">
                                    Processed
                                </NavLink>
                            </li>
                        </ul>
                    </li>
                    <li className='side-nav-item'>
                        <div className='header'>
                            <RiFileList3Line />
                            <span className='item-text'>Tours Management</span>
                            <FaCaretDown />
                        </div>
                        <ul className='side-nav-submenu'>
                            <li className='submenu-item' onClick={this.handleItemSelect}>
                                <NavLink className="item-link" to="/for-provider/tours" exact={true}>
                                    Your Tours
                                </NavLink>
                            </li>
                            <li className='submenu-item' onClick={this.handleItemSelect}>
                                <NavLink className="item-link" to="/for-provider/tours/new">
                                    Create new tour
                                </NavLink>
                            </li>
                            <li className='submenu-item' onClick={this.handleItemSelect}>
                                <NavLink className="item-link" to="/for-provider/tours/processed">
                                    Processed
                                </NavLink>
                            </li>
                        </ul>
                    </li>
                    <li className='side-nav-item'>
                        <div className='header'>
                            <RiFileList3Line />
                            <span className='item-text'>Company</span>
                            <FaCaretDown />
                        </div>
                        <ul className='side-nav-submenu'>
                            <li className='submenu-item' onClick={this.handleItemSelect}>
                                <NavLink className="item-link" to="/for-provider/profile">
                                    Profile
                                </NavLink>
                            </li>
                            <li className='submenu-item' onClick={this.handleItemSelect}>
                                <NavLink className="item-link" to="/for-provider/pending">
                                    Pending
                                </NavLink>
                            </li>
                            <li className='submenu-item' onClick={this.handleItemSelect}>
                                <NavLink className="item-link" to="/for-provider/processed">
                                    Processed
                                </NavLink>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        )
    }
}

export default SideNav;
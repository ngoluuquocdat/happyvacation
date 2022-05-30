import React from 'react';
import ReactDOM from 'react-dom';
import { FaCaretDown } from 'react-icons/fa';
import { RiFileList3Line } from 'react-icons/ri'
import { NavLink, Link } from "react-router-dom";
import '../../Styles/ForAdmin/admin-side-nav.scss'

class AdminSideNav extends React.Component {

    render() {
        return (
            <div className='side-nav-container'>
                <div className="logo-section"> </div>
                <ul className='side-nav-menu'>
                    <li className='side-nav-item'>
                        <div className='header'>
                            <RiFileList3Line />
                            <span className='item-text'>Provider Management</span>
                            <FaCaretDown />
                        </div>
                        <ul className='side-nav-submenu'>
                            <li className='submenu-item' onClick={this.handleItemSelect}>
                                <NavLink className="item-link" to="/for-admin/providers" exact>
                                    Tour Providers
                                </NavLink>
                            </li>
                            <li className='submenu-item' onClick={this.handleItemSelect}>
                                <NavLink className="item-link" to="/for-admin/providers/disabled">
                                    Disabled
                                </NavLink>
                            </li>
                            <li className='submenu-item' onClick={this.handleItemSelect}>
                                <NavLink className="item-link" to="/for-admin/providers/registrations">
                                    Registrations
                                </NavLink>
                            </li>
                        </ul>
                    </li>
                    <li className='side-nav-item'>
                        <div className='header'>
                            <RiFileList3Line />
                            <span className='item-text'>Members Management</span>
                            <FaCaretDown />
                        </div>
                        <ul className='side-nav-submenu'>
                            <li className='submenu-item' onClick={this.handleItemSelect}>
                                <NavLink className="item-link" to="/for-admin/members" exact={true}>
                                    Members
                                </NavLink>
                            </li>
                            <li className='submenu-item' onClick={this.handleItemSelect}>
                                <NavLink className="item-link" to="/for-admin/members/disabled">
                                    Disabled
                                </NavLink>
                            </li>
                        </ul>
                    </li>
                    <li className='side-nav-item'>
                        <div className='header'>
                            <RiFileList3Line />
                            <span className='item-text'>Tourist Sites Management</span>
                            <FaCaretDown />
                        </div>
                        <ul className='side-nav-submenu'>
                            <li className='submenu-item' onClick={this.handleItemSelect}>
                                <NavLink className="item-link" to="/for-admin/tourist-sites" exact={true}>
                                    Tourist Sites
                                </NavLink>
                            </li>
                            <li className='submenu-item' onClick={this.handleItemSelect}>
                                <NavLink className="item-link" to="/for-admin/tourist-sites/new">
                                    Create new site
                                </NavLink>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        )
    }
}

export default AdminSideNav;
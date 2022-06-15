import React from 'react';
import ReactDOM from 'react-dom';
import { FaCaretDown } from 'react-icons/fa';
import { RiFileList3Line } from 'react-icons/ri'
import { NavLink, Link } from "react-router-dom";
import '../../Styles/ForProvider/side-nav.scss'

class SideNav extends React.Component {

    onChatClick = () => {
        this.props.onChatClick()
    }

    render() {
        const { isChatNew } = this.props;
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
                            <li className='submenu-item'>
                                <NavLink className="item-link" to="/for-provider/orders" exact>
                                    Your Orders
                                </NavLink>
                            </li>
                            <li className='submenu-item'>
                                <NavLink className="item-link" to="/for-provider/orders/pending">
                                    Pending
                                </NavLink>
                            </li>
                            <li className='submenu-item'>
                                <NavLink className="item-link" to="/for-provider/orders/processed">
                                    Processed
                                </NavLink>
                            </li>
                            <li className='submenu-item'>
                                <NavLink className="item-link" to="/for-provider/orders/tourists">
                                    Tourist Groups
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
                            <li className='submenu-item'>
                                <NavLink className="item-link" to="/for-provider/tours" exact={true}>
                                    Your Tours
                                </NavLink>
                            </li>
                            <li className='submenu-item'>
                                <NavLink className="item-link" to="/for-provider/tours/new">
                                    Create new tour
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
                            <li className='submenu-item'>
                                <NavLink className="item-link" to="/for-provider/profile">
                                    Profile
                                </NavLink>
                            </li>
                            <li className='submenu-item'>
                                <NavLink className="item-link" to="/for-provider/statistic">
                                    Statistic
                                </NavLink>
                            </li>
                            <li className='submenu-item chat' onClick={this.onChatClick}>
                                <NavLink className="item-link" to="/for-provider/chat" target="_blank">
                                    Chat
                                {
                                    isChatNew &&
                                    <span>New</span>
                                }
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
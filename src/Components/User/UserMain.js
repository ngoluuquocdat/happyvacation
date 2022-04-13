import React from 'react';
import {
    Switch,
    Route
} from "react-router-dom";
import HeaderNav from '../Header/HeaderNav'
import UserSideNav from '../User/UserSideNav';
import UserProfile from './UserProfile/UserProfile';
import UserOrder from './UserTourOrder/UserOrder';
import ChangeEmail from './UserProfile/ChangeEmail';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../Styles/user-main.scss';

class UserMain extends React.Component {
    render() {
        return(
            <>
                <ToastContainer
                    position="top-right"
                    autoClose={2500}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                />
                <div className='user-main-wrap'>
                    <div className="small-header">
                        <HeaderNav />
                    </div>
                    <div className='user-main-container'>
                        <div className='side-nav-wrap'>
                            <UserSideNav />
                        </div>
                        <div className='content-page-wrap'>
                            <div className='content-page'>
                                <Switch>
                                    <Route path="/for-provider/tours" exact>
                                        <div>Your Tours</div>
                                    </Route >
                                    <Route path="/for-provider/tours/new">
                                        <div>

                                        </div>
                                    </Route >
                                    <Route path="/user/orders">
                                        <UserOrder />
                                    </Route >
                                    <Route path="/for-provider/orders/pending" exact>
                                        <UserOrder orderState="Pending"/>
                                    </Route >
                                    <Route path="/for-provider/orders/processed" exact>
                                        <UserOrder orderState="Processed"/>
                                    </Route >
                                    <Route path="/user/profile" exact>
                                        <UserProfile />
                                    </Route >
                                    <Route path="/user/profile/email" exact>
                                        <ChangeEmail />
                                    </Route >
                                </Switch>
                            </div>
                        </div>
                    </div>
                </div>        
            </>
        )
    }
}

export default UserMain;
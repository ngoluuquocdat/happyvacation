import React from 'react';
import {
    Switch,
    Route,
    withRouter
} from "react-router-dom";
import { connect } from 'react-redux';
import axios from 'axios';
import HeaderNav from '../Header/HeaderNav'
import UserSideNav from '../User/UserSideNav';
import UserProfile from './UserProfile/UserProfile';
import UserOrder from './UserTourOrder/UserOrder';
import ChangeEmail from './UserProfile/ChangeEmail';
import WishList from './WishList';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../Styles/user-main.scss';

class UserMain extends React.Component {

    state = {
        isEnabled: true
    }

    baseUrl = this.props.reduxData.baseUrl;

    componentDidMount() {
        const currentUser = this.props.reduxData.baseUrl;
        if(!currentUser) {
            this.props.history.push('/for-provider/register');
        }
        this.checkUserEnabled();
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.reduxData.user !== this.props.reduxData.user){
            // set state if new user data save in redux
            if(this.props.reduxData.user === null) {
                this.props.history.push('/login', {prevPath: this.props.location.pathname});
                return;
            }
        }
    }

    // check if user is disabled or not
    checkUserEnabled = async() => {
        const token = localStorage.getItem('user-token');
        if(!token) {
            this.props.history.push('/login');
        }
        try {            
            let res = await axios.get(
                `${this.baseUrl}/api/Users/me/check-enabled`,
                {
                    headers: { Authorization:`Bearer ${token}` }
                }
            );                     
            this.setState({
                isEnabled: res.data.isEnabled
            })        
        } catch (error) {
            if (!error.response) {
                toast.error("Network error");
                console.log(error)
            }         
            if (error.response.status === 401) {
                console.log(error);
                // redirect to login page or show notification
                this.props.history.push('/login', {prevPath: this.props.location.pathname});
            }
        }
    }

    render() {
        const { isEnabled } = this.state;
        return(
            <>
                {/* <ToastContainer
                    position="top-right"
                    autoClose={2500}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                /> */}
                <div className='user-main-wrap'>
                    <div className="small-header">
                        <HeaderNav />
                    </div>
                    <div className='user-main-container'>
                        <div className='side-nav-wrap'>
                            <UserSideNav />
                        </div>
                        <div className='content-page-wrap'>
                            {
                                !isEnabled &&
                                <>
                                    <h1 className='disable-title'>You have been disabled.</h1> 
                                    <p className='disable-sub-title'>Please contact us to solve this problem.</p>
                                </>
                            }
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
                                    <Route path="/users/orders/pending" exact>
                                        <UserOrder orderState="Pending"/>
                                    </Route >
                                    <Route path="/users/orders/processed" exact>
                                        <UserOrder orderState="Processed"/>
                                    </Route >
                                    <Route path="/user/profile" exact>
                                        <UserProfile />
                                    </Route >
                                    <Route path="/user/profile/email" exact>
                                        <ChangeEmail />
                                    </Route >
                                    <Route path="/user/favorite-tours" exact>
                                        <WishList />
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

const mapStateToProps = (state) => {
    return {
        reduxData: state
    }
}

export default connect(mapStateToProps)(withRouter(UserMain));
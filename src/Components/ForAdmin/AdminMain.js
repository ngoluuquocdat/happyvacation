import React from 'react';
import {
    Switch,
    Route,
    withRouter
} from "react-router-dom";
import { connect } from 'react-redux';
import HeaderNav from '../Header/HeaderNav'
import AdminSideNav from './AdminSideNav';
import { requestForToken, onMessageListener } from '../../firebase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../Styles/ForAdmin/admin-main.scss';

class AdminMain extends React.Component {

    componentDidMount() {
        const currentUser = this.props.reduxData.baseUrl;
        if(currentUser.providerId === 0) {
            this.props.history.push('/login');
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.reduxData.user !== this.props.reduxData.user){
            // set state if new user data save in redux
            if(this.props.reduxData.user === null) {
                this.props.history.push('/login', {prevPath: this.props.location.pathname});
                return;
            }
            if(this.props.reduxData.user.providerId === 0) {
                this.props.history.push('/login');
            }
        }
    }

    render() {

        // receive firebase cloud message
        // onMessageListener()
        // .then((payload) => {
        //     toast.success("You have a new order.");      
        // })
        // .catch((err) => console.log('failed: ', err));

        return(
            <>
                <div className='admin-main-wrap'>
                    <div className="small-header">
                        <HeaderNav />
                    </div>
                    <div className='provider-main-container'>
                        <div className='side-nav-wrap'>
                            <AdminSideNav />
                        </div>
                        <div className='content-page-wrap'>
                            <div className='content-page'>
                                <Switch>
                                    <Route path="/for-admin/providers" exact>
                                        Providers list page
                                    </Route >
                                    <Route path="/for-admin/providers/disabled">
                                        Disabled providers list page
                                    </Route >
                                    <Route path="/for-admin/providers/registrations">
                                        Provider registrations
                                    </Route >
                                    <Route path="/for-admin/members" exact>
                                        Members list page
                                    </Route >
                                    <Route path="/for-admin/members/disabled">
                                        Disabled members list page
                                    </Route >
                                    <Route path="/for-admin/tourist-sites">
                                        Tourist sites list page
                                    </Route >
                                    <Route path="/for-admin/tourist-sites/new" exact>
                                        Create new tourist site
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

export default connect(mapStateToProps)(withRouter(AdminMain));
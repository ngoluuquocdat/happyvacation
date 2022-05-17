import React from 'react';
import {
    Switch,
    Route,
    withRouter
} from "react-router-dom";
import { connect } from 'react-redux';
import HeaderNav from '../Header/HeaderNav'
import SideNav from './SideNav';
import ProviderTour from './ProviderTour';
import ProfilePage from './ProfilePage';
import ProviderOrder from './ProviderOrder';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CreateTour from './CreateTour';
import UpdateTour from './UpdateTour';
import '../../Styles/ForProvider/provider-main.scss';

class ProviderMain extends React.Component {

    componentDidMount() {
        const currentUser = this.props.reduxData.baseUrl;
        if(currentUser.providerId === 0) {
            this.props.history.push('/for-provider/register');
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
                this.props.history.push('/for-provider/register');
            }
        }
    }

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
                <div className='provider-main-wrap'>
                    <div className="small-header">
                        <HeaderNav />
                    </div>
                    <div className='provider-main-container'>
                        <div className='side-nav-wrap'>
                            <SideNav />
                        </div>
                        <div className='content-page-wrap'>
                            <div className='content-page'>
                                <Switch>
                                    <Route path="/for-provider/tours" exact>
                                        <ProviderTour />
                                    </Route >
                                    <Route path="/for-provider/tours/new">
                                        <CreateTour />
                                    </Route >
                                    <Route path="/for-provider/tours/:id/edit">
                                        <UpdateTour />
                                    </Route >
                                    <Route path="/for-provider/orders" exact>
                                        <ProviderOrder />
                                    </Route >
                                    <Route path="/for-provider/orders/pending">
                                        <ProviderOrder />
                                    </Route >
                                    <Route path="/for-provider/orders/processed">
                                        <ProviderOrder />
                                    </Route >
                                    <Route path="/for-provider/profile" exact>
                                        <ProfilePage />
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

export default connect(mapStateToProps)(withRouter(ProviderMain));
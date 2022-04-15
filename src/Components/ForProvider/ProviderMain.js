import React from 'react';
import {
    Switch,
    Route
} from "react-router-dom";
import HeaderNav from '../Header/HeaderNav'
import SideNav from './SideNav';
import ProfilePage from './ProfilePage';
import ProviderOrder from './ProviderOrder';
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CreateTour from './CreateTour';
import '../../Styles/ForProvider/provider-main.scss';

class ProviderMain extends React.Component {
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
                                        <div>Your Tours</div>
                                    </Route >
                                    <Route path="/for-provider/tours/new">
                                        <div><CreateTour /></div>
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

export default ProviderMain;
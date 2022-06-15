import React from 'react';
import {
    Switch,
    Route,
    withRouter
} from "react-router-dom";
import { connect } from 'react-redux';
import axios from 'axios';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { requestForToken, onMessageListener } from '../../firebase';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HeaderNav from '../Header/HeaderNav'
import SideNav from './SideNav';
import ProviderTour from './ProviderTour';
import ProfilePage from './ProfilePage';
import ProviderOrder from './ProviderOrder';
import CreateTour from './CreateTour';
import UpdateTour from './UpdateTour';
import OrderedTouristPage from './OrderedTourists/OrderedTouristPage';
import '../../Styles/ForProvider/provider-main.scss';
import ProviderStatistic from './ProviderStatistic';

class ProviderMain extends React.Component {

    state = {
        isEnabled: true,
        isChatNew: false
    }

    baseUrl = this.props.reduxData.baseUrl;

    componentDidMount() {
        // const currentUser = this.props.reduxData.user;
        // if(currentUser.providerId === 0) {
        //     this.props.history.push('/login');
        // }
        this.checkProviderEnabled();
    }

    async componentDidUpdate(prevProps, prevState) {
        if(prevProps.reduxData.user !== this.props.reduxData.user){
            // set state if new user data save in redux
            if(this.props.reduxData.user === null) {
                this.props.history.push('/login', {prevPath: this.props.location.pathname});
                return;
            }
            if(this.props.reduxData.user.providerId === 0) {
                this.props.history.push('/login');
            }
            // connect signal r again if current_user change
            await this.connectToChatHub();
        }
    }

    async componentWillUnmount() {
        // close current connection before un mount
        const connection = this.state.connection;      
        if(connection) {
            try {              
                await connection.stop();
            } catch(e) {
                console.log(e)
            }
        }
    }

    checkProviderEnabled = async() => {
        const token = localStorage.getItem('user-token');
        if(!token) {
            this.props.history.push('/login', {prevPath: this.props.location.pathname});
        }
        try {            
            let res = await axios.get(
                `${this.baseUrl}/api/Providers/me/check-enabled`,
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
            if (error.response.status === 403) {
                console.log(error)
                this.props.history.push('/login', {prevPath: this.props.location.pathname});
            }
        }
    }

    // connect to chat hub to receive message notification 
    connectToChatHub = async () => {
        let current_user_id = `provider${this.props.reduxData.user.providerId}`;   // format: provider1
        console.log('current user id', current_user_id)

        try {
            const connection = new HubConnectionBuilder()
            .withUrl(`${this.baseUrl}/chat`)
            .configureLogging(LogLevel.Information)
            .build();
    
            // method to receive message from our server
            connection.on("ShakeHandMessage", (message) => {
                console.log('Shake hand message:', message);
            });

            // method to receive message from our server
            connection.on("ReceiveMessage", async (message) => {
                console.log('message received:', message); 
                // check if the sender is not provider       
                if(!message.senderId.includes('provider')) {
                    this.setState({
                        isChatNew: true
                    })
                    toast.info('You have a new message',
                    {
                        onClick: () => {
                            window.open(`/for-provider/chat`, "_blank");
                            this.setState({
                                isChatNew: false
                            })
                        }
                    });                   
                }
            });
        
            // connection stop handler
            connection.onclose(e => {
                //setConnection();
                //setMessages([]);
            });
        
            await connection.start();
            await connection.invoke("ConnectUserToChatHub", current_user_id.toString());
            this.setState({
                connection: connection
            })
        } catch(e) {
            console.log(e);
        }
    }

    render() {
        const { isEnabled, isChatNew } = this.state;
        // receive firebase cloud message
        onMessageListener()
        .then((payload) => {
            toast.success("You have a new order.");      
        })
        .catch((err) => console.log('failed: ', err));

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
                <div className='provider-main-wrap'>
                    <div className="small-header">
                        <HeaderNav />
                    </div>
                    <div className='provider-main-container'>
                        <div className='side-nav-wrap'>
                            <SideNav isChatNew={isChatNew} onChatClick={() => this.setState({isChatNew: false})}/>
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
                                    <Route path="/for-provider/orders/tourists">
                                        <OrderedTouristPage />
                                    </Route >
                                    <Route path="/for-provider/profile" exact>
                                        <ProfilePage />
                                    </Route >
                                    <Route path="/for-provider/statistic" exact>
                                        <ProviderStatistic />
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
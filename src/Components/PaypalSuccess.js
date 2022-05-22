import React from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import ReactLoading from "react-loading";
import HeaderNav from './Header/HeaderNav';
import { GiCheckMark } from 'react-icons/gi';
import '../Styles/paypal-success.scss';

class PaypalSuccess extends React.Component {

    state = {
        tourName: '',
        providerName: '',
        totalPrice: '',
        isLoading: false
    }

    baseUrl = this.props.reduxData.baseUrl;

    // async componentDidMount() {
        
    //     const token = new URLSearchParams(this.props.location.search).get("token");
    //     const payerId = new URLSearchParams(this.props.location.search).get("PayerID");
    //     const orderId = new URLSearchParams(this.props.location.search).get("orderId");
    //     console.log('orderId', orderId)

    //     if(token && payerId) {       
    //         this.setState({
    //             isLoading: true
    //         })
    //         // request paypal access token
    //         const access_token = await this.getPaypalAccessToken();
    
    //         // post to paypal api to capture payment
    //         let transactionId = '';
    //         try {
    //             let res = await axios.post(
    //                 `https://api.sandbox.paypal.com/v2/checkout/orders/${token}/capture`,
    //                 {
    //                     data: 'something'
    //                 },
    //                 {
    //                     headers: { Authorization:`Bearer ${access_token}` }
    //                 }
    //             )
    //             console.log(res);
    //             transactionId = res.data.purchase_units[0].payments.captures[0].id;
    //             console.log(transactionId);
    //         } catch (error) {
    //             console.log(error)
    //         }

    //         // confirm order's transaction in DB
    //         await this.confirmOrderTransaction(access_token, "transactionId", orderId);

    //         this.setState({
    //             isLoading: false
    //         })
    //     }
    // }

    getPaypalAccessToken = async() => {
        const clientId = "ARqrsuQnlbgJc1KFc3MCUHtEc9s6NZC15MtmYVuGL9HLZRoLX804chAwPoOwygzSI-z5ld9Rh52N3tSL";
        const secretKey = "EKuCtrMuiONf7UxZXzxaqVK61jeictXiiamROPfXvb_-a_f0aZS6aCrnsEzf2YPB5B_0YF0Q2y4Jsc70";
        try {
            let res = await axios.post(
                `https://api.sandbox.paypal.com/v1/oauth2/token?grant_type=client_credentials`,
                {
                    
                },
                {
                    auth: {
                      username: clientId,
                      password: secretKey
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    }
                }
            )
            return res.data.access_token;
        } catch (error) {
            console.log(error)
        }
    }

    confirmOrderTransaction = async(access_token, transactionId, orderId) => {
        // check token
        const user_token = localStorage.getItem('user-token');
        if(!user_token) {
            this.props.history.push(`/login`);
        }
        // post to paypal api
        try {
            let res = await axios.patch(
                `${this.baseUrl}/api/Orders/${orderId}/confirm-transaction?transactionId=${transactionId}`,
                {},
                {
                    headers: { Authorization:`Bearer ${user_token}` }
                }
            )
            console.log(res);
            this.setState({
                tourName: res.data.tourName,
                providerName: res.data.providerName,
                totalPrice: res.data.totalPrice
            })
        } catch (error) {
            console.log(error);
            toast.error("Error when confirm order");
        }
    }

    render() {
        //const { tourName, providerName, totalPrice, isLoading } = this.state;

        const { tourName, providerName, totalPrice } = this.props.location.state;

        return(               
            <div className='paypal-payment-success-wrapper'>
                <div className='small-header'>
                    <HeaderNav />
                </div>
                {/* {
                    isLoading ? 
                    <div className="loading-container">
                        <h1>Processing your order</h1>
                        <h2>Don't close this page until the process is done.</h2>
                        <ReactLoading
                            className="loading-component"
                            type={"spin"}
                            color={"#df385f"}
                            height={50}
                            width={50}
                        />
                    </div>
                    :
                    <div className='paypal-payment-success__content'>
                        <div className='green-check-icon'>
                            <GiCheckMark />u
                        </div>
                        <h1 className='title'>Payment Success!</h1>
                        <p className='sub-title'>Tour booking confirmation has been send to your email!</p>
                        <div className='booking-detail'>
                            <p className='you-paid-for-title'>You paid for:</p>
                            <p className='description'>{tourName} from {providerName}</p>
                            <p className='total-price'>Total price: ${totalPrice}</p>
                        </div>
                    </div>
                } */}
                <div className='paypal-payment-success__content'>
                    <div className='green-check-icon'>
                        <GiCheckMark />
                    </div>
                    <h1 className='title'>Payment Success!</h1>
                    <p className='sub-title'>Tour booking confirmation has been send to your email!</p>
                    <div className='booking-detail'>
                        <p className='you-paid-for-title'>You paid for:</p>
                        <p className='description'>{tourName} from {providerName}</p>
                        <p className='total-price'>Total price: ${totalPrice}</p>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        reduxData: state
    }
}

export default connect(mapStateToProps)(withRouter(PaypalSuccess));
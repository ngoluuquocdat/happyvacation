import React from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import HeaderNav from './Header/HeaderNav';
import { GiCheckMark } from 'react-icons/gi';
import { CgClose } from 'react-icons/cg';
import '../Styles/paypal-success.scss';

class PaypalSuccess extends React.Component {

    state = {
        tourName: '',
        providerName: '',
        totalPrice: '',
        isLoading: false
    }

    baseUrl = this.props.reduxData.baseUrl;

    render() {
        //const { tourName, providerName, totalPrice, isLoading } = this.state;

        const { tourName, providerName, totalPrice } = this.props.location.state;

        const { hasFailed } = this.props.location.state;

        return(               
            <div className='paypal-payment-success-wrapper'>
                <div className='small-header'>
                    <HeaderNav />
                </div>
                <div className='paypal-payment-success__content'>
                    <div className='green-check-icon'>
                        {
                            !hasFailed
                            ? <GiCheckMark />
                            : <CgClose />
                        }
                    </div>
                    <h1 className='title'>
                        {
                            !hasFailed 
                            ? 'Payment Success!'
                            : 'Payment Failed.'
                        }
                    </h1>
                    <p className='sub-title'>
                        {
                            !hasFailed
                            ? 'Tour booking confirmation has been send to your email!'
                            : 'Your payment has failed. Please try again later.'
                        }
                    </p>
                    {
                        !hasFailed &&
                        <div className='booking-detail'>
                            <p className='you-paid-for-title'>You paid for:</p>
                            <p className='description'>{tourName} from {providerName}</p>
                            <p className='total-price'>Total price: ${totalPrice}</p>
                        </div>
                    }
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
import React from 'react';
import HeaderNav from './Header/HeaderNav';
import axios from 'axios';
import { toast } from 'react-toastify';
import ReactLoading from "react-loading";
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { FaCaretDown } from 'react-icons/fa';
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai'
import { VscLocation } from 'react-icons/vsc';
import { BsClock, BsPeople, BsTag } from 'react-icons/bs';
import { FiStar } from 'react-icons/fi';
import { BiCategoryAlt } from 'react-icons/bi';
import { BsArrowRight } from 'react-icons/bs';
import '../Styles/check-out.scss';


class Checkout extends React.Component {

    state = {
        firstName: this.props.reduxData.user ? this.props.reduxData.user.firstName : '',
        lastName: this.props.reduxData.user ? this.props.reduxData.user.lastName : '',
        phone: this.props.reduxData.user ? this.props.reduxData.user.phone : '',
        email: this.props.reduxData.user ? this.props.reduxData.user.email : '',
        identifyNumber: '',
        pickingPlace: '',
        isBooking: false,
    }

    baseUrl = this.props.reduxData.baseUrl;

    async componentDidMount() {
        const token = localStorage.getItem('user-token');
        if(!token) {
            this.props.history.push('/login');
        }
        this.setState({
            firstName: this.props.reduxData.user ? this.props.reduxData.user.firstName : '',
            lastName: this.props.reduxData.user ? this.props.reduxData.user.lastName : '',
            phone: this.props.reduxData.user ? this.props.reduxData.user.phone : '',
            email: this.props.reduxData.user ? this.props.reduxData.user.email : '',
        })
    }
    
    componentDidUpdate(prevProps, prevState) {
        if(prevProps.reduxData.user !== this.props.reduxData.user){
            // set state if new user data save in redux
            this.setState({
                firstName: this.props.reduxData.user ? this.props.reduxData.user.firstName : '',
                lastName: this.props.reduxData.user ? this.props.reduxData.user.lastName : '',
                phone: this.props.reduxData.user ? this.props.reduxData.user.phone : '',
                email: this.props.reduxData.user ? this.props.reduxData.user.email : '',
            })
        }
    }

    // text field handlers
    handleInputChange = (event) => {
        const key = event.target.name
        const value = event.target.value
        this.setState({
            [key]: value
        })
    }

    // handle cancel
    handleCancel = () => {
        this.props.history.push(`/tours/${this.props.location.state.bookingSubRequest.tourId}`);
    }

    // handle confirm booking
    handleConfirm = async () => {
        // check token
        const token = localStorage.getItem('user-token');
        if(!token) {
            this.props.history.push(`/login`);
        }
        // check valid
        const { firstName, lastName, phone, email, identifyNumber, pickingPlace } = this.state;

        // submit to api
        const bookingSubRequest = this.props.location.state.bookingSubRequest;
        let bookingRequest = {
            tourId: bookingSubRequest.tourId,
            departureDate: bookingSubRequest.departureDate,
            adults: bookingSubRequest.adults,
            children: bookingSubRequest.children,
            touristName: `${firstName} ${lastName}`,
            touristPhone: phone,
            touristEmail: email,
            touristIdentify: identifyNumber,
            startPoint: `CustomerPoint&${pickingPlace}&${bookingSubRequest.startPoint.split('&')[2]}`,
            endPoint: `CustomerPoint&${pickingPlace}&${bookingSubRequest.startPoint.split('&')[2]}`
        }
        try {
            this.setState({
                isBooking: true
            })
            let res = await axios.post(
                `${this.baseUrl}/api/Orders`,
                bookingRequest,
                {
                    headers: { Authorization:`Bearer ${token}` }
                }
            )

            // show toast notify
            setTimeout(() => {
                toast.success('Booking successful!');
            }, 1500) 
            // to successful page
            this.props.history.push(`/checkout/successful`);
            
        } catch(error) {
            if (!error.response) {
                toast.error("Network error");
                console.log(error)
                return;
              }
              if (error.response.status === 400) {
                console.log(error)
              }
              if (error.response.status === 401) {
                console.log(error);
                // redirect to login page or show notification
                this.props.history.push('/login');
              }
        } finally {
            setTimeout(() => {
                this.setState({
                    isBooking: false
                })
            }, 1500) 
        } 
    }
    
    render() {
        const { bookingSubRequest } = this.props.location.state;
        const { firstName, lastName, phone, email, identifyNumber, pickingPlace } = this.state;
        const avatarUrl = `url('${this.baseUrl + bookingSubRequest.thumbnailUrl}')`;
        const { isLoading } = this.state;
        return (
            <div className="App">
                <div className="small-header">
                    <HeaderNav />
                </div>
                {
                    isLoading ? 
                    <div className="loading-container">
                        <ReactLoading
                            className="loading-component"
                            type={"spin"}
                            color={"#df385f"}
                            height={50}
                            width={50}
                        />
                    </div>
                    :
                    <div className="check-out-page-container">
                        <h2 className="check-out-page__title">Your booking detail</h2>
                        <div className="check-out-page__content">
                            <div className="tour-booking-detail">
                                <div className='left'>
                                    <div className="tour-thumbnail" style={{backgroundImage: avatarUrl}}></div>
                                </div>
                                <div className='right'>
                                    <h5 className='tour-name'>{bookingSubRequest.tourName}</h5>
                                    <div className='tour-order-start-end'>
                                        <span><VscLocation />
                                            Start:&nbsp;
                                            {
                                                bookingSubRequest.startPoint.includes('&CustomerPoint') ?
                                                `${bookingSubRequest.startPoint.replace('&CustomerPoint', '')} (Customer's location)`
                                                :
                                                bookingSubRequest.startPoint
                                            }
                                        </span>
                                        <span><VscLocation />End:&nbsp;{bookingSubRequest.endPoint}</span>
                                    </div>
                                    <div className='tour-order-info'>
                                        <div className='tour-order-description-wrap'>
                                            <p className='tour-order-description'>
                                                <span>Tour type: </span>
                                                {
                                                    bookingSubRequest.isPrivate ? 'Private' : 'Shared'
                                                }
                                            </p>
                                            <p className='tour-order-description'>
                                                <span>Departure day: </span>
                                                {bookingSubRequest.departureDate}
                                            </p>
                                            <p className='tour-order-description'>
                                                <span>Duration: </span>
                                                {
                                                    bookingSubRequest.duration<1 ? 
                                                    (
                                                        bookingSubRequest.duration===0.5 ?
                                                        'Half day'
                                                        :
                                                        `${Math.round(bookingSubRequest.duration*24)} hours`
                                                    )                                    
                                                    : 
                                                    `${bookingSubRequest.duration} days`
                                                }
                                            </p>
                                        </div>
                                        <div className='booking-detail-wrap'>
                                            <p className='tour-order-price'><small>Booking detail</small></p>
                                            <p className='tour-order-price'>
                                                <span>Adults: </span>
                                                {bookingSubRequest.adults} X ${bookingSubRequest.pricePerAdult} <BsArrowRight className='arrow-icon'/> ${bookingSubRequest.adults * bookingSubRequest.pricePerAdult}
                                            </p>
                                            <p className='tour-order-price'>
                                                <span>Children: </span>
                                                {bookingSubRequest.children} X ${bookingSubRequest.pricePerChild} <BsArrowRight className='arrow-icon'/> ${bookingSubRequest.children * bookingSubRequest.pricePerChild}
                                            </p>
                                            <p className='tour-order-total-price'>
                                                <span>Total price: </span>
                                                ${bookingSubRequest.adults * bookingSubRequest.pricePerAdult + bookingSubRequest.children * bookingSubRequest.pricePerChild}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="customer-information">
                                <div className="customer-form-group">
                                    <label className='input-label'>First Name</label>
                                    <input 
                                        type="text" 
                                        className='input-field' 
                                        name='firstName'
                                        value={firstName}
                                        onChange={this.handleInputChange}
                                    />
                                </div>
                                <div className="customer-form-group">
                                    <label className='input-label'>Last Name</label>
                                    <input 
                                        type="text" 
                                        className='input-field' 
                                        name='lastName'
                                        value={lastName}
                                        onChange={this.handleInputChange}
                                    />
                                </div>
                                <div className="customer-form-group">
                                    <label className='input-label'>Phone</label>
                                    <input 
                                        type="text" 
                                        className='input-field' 
                                        name='phone'
                                        value={phone}
                                        onChange={this.handleInputChange}
                                    />
                                </div>
                                <div className="customer-form-group">
                                    <label className='input-label'>Email</label>
                                    <input 
                                        type="email" 
                                        className='input-field'
                                        name='email'
                                        value={email}
                                        onChange={this.handleInputChange} 
                                    />
                                </div>
                                <div className="customer-form-group">
                                    <label className='input-label'>Identify number</label>
                                    <input 
                                        type="text" 
                                        className='input-field' 
                                        placeholder='Citizen identification, passport,...'
                                        name='identifyNumber'
                                        value={identifyNumber}
                                        onChange={this.handleInputChange} 
                                    />
                                </div>
                                {
                                    bookingSubRequest.startPoint.includes('CustomerPoint&') &&
                                    <div className="customer-form-group">
                                        <label className='input-label'>Your location in {bookingSubRequest.startPoint.split('&')[2]}</label>
                                        <input 
                                            type="text" 
                                            className='input-field' 
                                            placeholder='Street address, ward,...'
                                            name='pickingPlace'
                                            value={pickingPlace}
                                            onChange={this.handleInputChange} 
                                        />
                                        <div className='note'>
                                            <span className='asterisk'>*</span>
                                            <div className='note__content'>
                                                This tour has pick up/drop-off service.<br></br>
                                                Please provide your location in&nbsp;
                                                <span className='pick-up-range'>{bookingSubRequest.startPoint.split('&')[2]}.</span>
                                            </div>
                                        </div>
                                    </div>
                                }
                                <div className='information-policy'>
                                    <span className='information-policy__content'>Your personal data will be used to process your order, support your experience throughout this website, 
                                    and for other purposes described in our <a className='policy-link'>privacy policy</a>.</span>
                                </div>
                            </div>
                        </div>
                        <div className='check-out-controls'>
                            <button className='btn btn--cancel' onClick={this.handleCancel}>Cancel</button>
                            <button className='btn btn--confirm' onClick={this.handleConfirm}>CONFIRM</button>
                        </div>
                    </div>           
                }
          </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        reduxData: state
    }
}

export default connect(mapStateToProps)(withRouter(Checkout));
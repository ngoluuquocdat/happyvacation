import React from 'react';
import HeaderNav from './Header/HeaderNav';
import axios from 'axios';
import { toast } from 'react-toastify';
import ReactLoading from "react-loading";
import { Calendar } from 'react-date-range';
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
        adultsList: [],
        showingAdultIndex: 0,
        invalidAdultItem: false,
        childrenList: [],
        showingChildIndex: 0,
        invalidChildItem: false,
        showDatePickerAdult: [],     // list of true/false values
        showDatePickerChild: [],     // list of true/false values
        isBooking: false,
    }

    baseUrl = this.props.reduxData.baseUrl;

    componentDidMount() {
        const token = localStorage.getItem('user-token');
        if(!token) {
            this.props.history.push('/login');
        }
        // initiate adults and children list
        const { adults, children } = this.props.location.state.bookingSubRequest;

        this.setState({
            firstName: this.props.reduxData.user ? this.props.reduxData.user.firstName : '',
            lastName: this.props.reduxData.user ? this.props.reduxData.user.lastName : '',
            phone: this.props.reduxData.user ? this.props.reduxData.user.phone : '',
            email: this.props.reduxData.user ? this.props.reduxData.user.email : '',
            adultsList: new Array(adults).fill({identityNumber: '', firstName: '', lastName: '', dob: new Date()}),
            childrenList: new Array(children).fill({identityNumber: '', firstName: '', lastName: '', dob: new Date()}),
            showDatePickerAdult: new Array(adults).fill(false),
            showDatePickerChild: new Array(adults).fill(false),
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

    // click date picker toggle in adults section
    handleAdultDateClick = (index) => {
        let showDatePickerAdult = this.state.showDatePickerAdult;
        showDatePickerAdult[index] = !showDatePickerAdult[index];
        this.setState({
            showDatePickerAdult: showDatePickerAdult
        })
    }
    // click date picker toggle in children section
    handleChildDateClick = (index) => {
        let showDatePickerChild = this.state.showDatePickerChild;
        showDatePickerChild[index] = !showDatePickerChild[index];
        this.setState({
            showDatePickerChild: showDatePickerChild
        })
    }

    // dob adult select
    handleDobAdultSelect = (date, index) => {
        let adultsList = this.state.adultsList;
        adultsList[index] = {
            ...adultsList[index],
            dob: date
        }
        this.setState({
            adultsList: adultsList
        })
    }
    // dob child select
    handleDobChildSelect = (date, index) => {
        let childrenList = this.state.childrenList;
        childrenList[index] = {
            ...childrenList[index],
            dob: date
        }
        this.setState({
            childrenList: childrenList
        })
    }

    // text field handlers
    handleInputChange = (event) => {
        const key = event.target.name
        const value = event.target.value
        this.setState({
            [key]: value
        })
    }

    // text field adults list handlers
    handleInputAdultsList = (event, index) => {
        let adultsList = this.state.adultsList;
        const key = event.target.name;
        const value = event.target.value;

        adultsList[index] = {
            ...adultsList[index],
            [key]: value
        }

        this.setState({
            adultsList: adultsList
        })
    }

    // text field children list handlers
    handleInputChildrenList = (event, index) => {
        let childrenList = this.state.childrenList;
        const key = event.target.name;
        const value = event.target.value;

        childrenList[index] = {
            ...childrenList[index],
            [key]: value
        }

        this.setState({
            childrenList: childrenList
        })
    }

    // check adult item valid
    checkAdultItem = (adult_index) => {
        let adult = this.state.adultsList[adult_index];
        const values = Object.values(adult)
        if(values.includes('')) {
            return false;
        }
        return true;
    }

    // check child item valid
    checkChildItem = (child_index) => {
        let child = this.state.childrenList[child_index];
        const values = Object.values(child)
        if(values.includes('')) {
            return false;
        }
        return true;
    }

    // handle show more adult
    handleShowMoreAdult = () => {
        const showingAdultIndex = this.state.showingAdultIndex;
        for(let i=0; i <= showingAdultIndex; i++) {
            if(this.checkAdultItem(i) === false) {
                this.setState({
                    invalidAdultItem: true
                })
                return;
            }
        }
        this.setState({
            invalidAdultItem: false,
            showingAdultIndex: showingAdultIndex + 1
        })
    }

    // handle show more child
    handleShowMoreChild = () => {
        const showingChildIndex = this.state.showingChildIndex;
        for(let i=0; i <= showingChildIndex; i++) {
            if(this.checkChildItem(i) === false) {
                this.setState({
                    invalidChildItem: true
                })
                return;
            }
        }
        this.setState({
            invalidChildItem: false,
            showingChildIndex: showingChildIndex + 1
        })
    }

    // check child age
    checkChildAge = (dob) => {
        const MAX_CHILD_AGE = 16;
        let today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        var month_diff = today.getMonth() - dob.getMonth();
        if(month_diff < 0 || (month_diff === 0 && today.getDate() < dob.getDate())) {
            age--;
        }
        return age < MAX_CHILD_AGE;
    }

    // convert date time to string dd/MM/yyyy
    dateTimeToString = (date) => {
        return `${("0" + date.getDate()).slice(-2)}/${("0" + (date.getMonth()+1)).slice(-2)}/${date.getFullYear()}`
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
        const { adultsList, childrenList } = this.state;

        let customerValid = true;
        if(Object.values(this.state).includes('')) {
            customerValid = false;
        }

        let listsValid = true;
        // valid adults list
        for(let i=0; i<adultsList.length; i++) {
            if(this.checkAdultItem(i) === false) {
                listsValid = false;
            }
        }
        // valid children list
        for(let i=0; i<childrenList.length; i++) {
            if(this.checkChildItem(i) === false) {
                listsValid = false;
            }
            if(this.checkChildAge(childrenList[i].dob) === false) {
                listsValid = false;
            }
        }
        // change date time format to string dd/MM/yyyy
        for(let i=0; i<adultsList.length; i++) {
            adultsList[i].dob = this.dateTimeToString(adultsList[i].dob);
        }
        for(let i=0; i<childrenList.length; i++) {
            childrenList[i].dob = this.dateTimeToString(childrenList[i].dob);
        }

        if(customerValid === false || listsValid === false) {
            toast.warning('Your information is invalid!');
            return;
        }

        // submit to api
        const bookingSubRequest = this.props.location.state.bookingSubRequest;
        let bookingRequest = {
            tourId: bookingSubRequest.tourId,
            departureDate: bookingSubRequest.departureDate,
            adults: bookingSubRequest.adults,
            adultsList: adultsList,
            childrenList: childrenList,
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
        const { adultsList, showingAdultIndex, childrenList, showingChildIndex } = this.state;
        const { showDatePickerAdult, showDatePickerChild } = this.state;
        const { invalidAdultItem, invalidChildItem } = this.state;
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
                                        <span>
                                            <VscLocation />
                                            Start:&nbsp;
                                            {
                                                bookingSubRequest.startPoint.includes('CustomerPoint&') ?
                                                'We will pick you up at your chosen place.'
                                                :
                                                bookingSubRequest.startPoint
                                            }
                                        </span>
                                        <span>
                                            <VscLocation />
                                            End:&nbsp;
                                            {
                                                bookingSubRequest.endPoint.includes('CustomerPoint&') ?
                                                'We will take you back to your chosen place.'
                                                :
                                                bookingSubRequest.endPoint
                                            }
                                        </span>
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
                                <h3 className="section__title">Your information as a representative</h3>
                                <div className="customer-information-main">

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
                                        <label className='input-label'>Identity number</label>
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
                                </div>                              
                            </div>
                            <div className='member-information'>
                                <h3 className="section__title">Your members information</h3>
                                {
                                    adultsList.length > 0 &&
                                    <div className='member-information__adults'>
                                        {
                                            adultsList.map((item, index) => {
                                                return(
                                                    <>
                                                        <h4 key={'title-adult'+index} className='member-information__form-title' style={{display: index > showingAdultIndex ? 'none' : 'block'}}>
                                                             Adult {index+1}
                                                        </h4>
                                                        <div key={'adult'+index} className='member-information__form' style={{display: index > showingAdultIndex ? 'none' : 'flex'}}>
                                                            <div className="member-form-group">
                                                                <label className='input-label'>First Name</label>
                                                                <input 
                                                                    type="text" 
                                                                    className='input-field' 
                                                                    placeholder='First name'
                                                                    name='firstName'
                                                                    value={item.firstName}
                                                                    onChange={(event) => this.handleInputAdultsList(event, index)}
                                                                />
                                                            </div>
                                                            <div className="member-form-group">
                                                                <label className='input-label'>Last Name</label>
                                                                <input 
                                                                    type="text" 
                                                                    className='input-field' 
                                                                    placeholder='Last name'
                                                                    name='lastName'
                                                                    value={item.lastName}
                                                                    onChange={(event) => this.handleInputAdultsList(event, index)}
                                                                />
                                                            </div>
                                                            <div className="member-form-group">
                                                                <label className='input-label'>Identity number</label>
                                                                <input 
                                                                    type="text" 
                                                                    className='input-field' 
                                                                    placeholder='Citizen identification, passport,...'
                                                                    name='identityNumber'
                                                                    value={item.identifyNumber}
                                                                    onChange={(event) => this.handleInputAdultsList(event, index)} 
                                                                />                                                              
                                                            </div>
                                                            <div className="member-form-group">
                                                                <label className='input-label'>Date of Birth</label>
                                                                {/* <input 
                                                                    type="date" 
                                                                    className='input-field' 
                                                                    placeholder='Date of birth...'
                                                                    name='dob'
                                                                    value={item.dob}
                                                                    onChange={(event) => this.handleInputAdultsList(event, index)} 
                                                                /> */}
                                                                <div className="date-input" onClick={() => this.handleAdultDateClick(index)}>
                                                                    <div className="date-display">
                                                                        <span>{`${("0" + item.dob.getDate()).slice(-2)}/${("0" + (item.dob.getMonth()+1)).slice(-2)}/${item.dob.getFullYear()}`} <FaCaretDown /></span>
                                                                    </div>
                                                                    {
                                                                        showDatePickerAdult[index] && 
                                                                        <div className="date-picker" onClick={(event) => event.stopPropagation()}>
                                                                            <Calendar
                                                                                date={item.dob}
                                                                                maxDate={new Date()}
                                                                                onChange={(date) => this.handleDobAdultSelect(date, index)}
                                                                            />
                                                                        </div>
                                                                    }                                        
                                                                </div>
                                                            </div>
                                                        </div>                                                            
                                                    </>
                                                )
                                            })
                                        }
                                        {
                                            invalidAdultItem &&
                                            <span className='fill-all-warning'>Fill all information above and try again.</span>
                                        }
                                        {
                                            adultsList.length !== showingAdultIndex + 1 &&
                                            <button className='btn-more' onClick={this.handleShowMoreAdult}>
                                                {adultsList.length-1-showingAdultIndex}&nbsp;
                                                {adultsList.length-1-showingAdultIndex > 1 ? 'adults' : 'adult'}&nbsp;left
                                            </button>
                                        }
                                    </div>
                                }
                                {
                                    childrenList.length > 0 &&
                                    <div className='member-information__children'>
                                        {
                                            childrenList.map((item, index) => {
                                                return(
                                                    <>
                                                        <h4 key={'title-child'+index} className='member-information__form-title' style={{display: index > showingChildIndex ? 'none' : 'block'}}> 
                                                            Children {index+1}
                                                        </h4>
                                                        <div key={'child'+index} className='member-information__form' style={{display: index > showingChildIndex ? 'none' : 'flex'}}>
                                                            <div className="member-form-group">
                                                                <label className='input-label'>First Name</label>
                                                                <input 
                                                                    type="text" 
                                                                    className='input-field' 
                                                                    placeholder='First name'
                                                                    name='firstName'
                                                                    value={item.firstName}
                                                                    onChange={(event) => this.handleInputChildrenList(event, index)}
                                                                />
                                                            </div>
                                                            <div className="member-form-group">
                                                                <label className='input-label'>Last Name</label>
                                                                <input 
                                                                    type="text" 
                                                                    className='input-field' 
                                                                    placeholder='Last name'
                                                                    name='lastName'
                                                                    value={item.lastName}
                                                                    onChange={(event) => this.handleInputChildrenList(event, index)}
                                                                />
                                                            </div>
                                                            <div className="member-form-group">
                                                                <label className='input-label'>Identity number</label>
                                                                <input 
                                                                    type="text" 
                                                                    className='input-field' 
                                                                    placeholder='Citizen identification, passport,...'
                                                                    name='identityNumber'
                                                                    value={item.identifyNumber}
                                                                    onChange={(event) => this.handleInputChildrenList(event, index)} 
                                                                />
                                                            </div>
                                                            <div className="member-form-group">
                                                                <label className='input-label'>Date of Birth</label>
                                                                <div className="date-input" onClick={() => this.handleChildDateClick(index)}>
                                                                    <div className="date-display">
                                                                        <span>{`${("0" + item.dob.getDate()).slice(-2)}/${("0" + (item.dob.getMonth()+1)).slice(-2)}/${item.dob.getFullYear()}`} <FaCaretDown /></span>
                                                                    </div>
                                                                    {
                                                                        showDatePickerChild[index] && 
                                                                        <div className="date-picker" onClick={(event) => event.stopPropagation()}>
                                                                            <Calendar
                                                                                date={item.dob}
                                                                                maxDate={new Date()}
                                                                                onChange={(date) => this.handleDobChildSelect(date, index)}
                                                                            />
                                                                        </div>
                                                                    }   
                                                                    {
                                                                        !this.checkChildAge(item.dob) &&
                                                                        <span className='age-warning'>This person is considered an adult.</span>                                   
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </>
                                                )
                                            })
                                        }
                                        {
                                            invalidChildItem &&
                                            <span className='fill-all-warning'>Fill all information above and try again.</span>
                                        }
                                        {
                                            childrenList.length !== showingChildIndex + 1 &&
                                            <button className='btn-more' onClick={this.handleShowMoreChild}>
                                                {childrenList.length-1-showingChildIndex}&nbsp;
                                                {childrenList.length-1-showingChildIndex > 1 ? 'children' : 'child'}&nbsp;left
                                            </button>
                                        }
                                    </div>
                                }
                            </div>
                            <div className='information-policy'>
                                <span className='information-policy__content'>Your provided data will be used to process your order, support your experience throughout this website, 
                                and for other purposes described in our <a className='policy-link'>privacy policy</a>.</span>
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
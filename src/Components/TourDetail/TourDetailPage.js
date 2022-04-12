import React from 'react';
import HeaderNav from '../Header/HeaderNav';
import axios from 'axios';
import Slider from 'react-slick';
import { toast } from 'react-toastify';
import ReactLoading from "react-loading";
import Itinerary from './Itinerary';
import ExpenseTable from './ExpenseTable';
import ReviewSection from './ReviewSection';
import { connect } from 'react-redux';
import { Left, Right } from '../Header/Arrows';
import { withRouter } from 'react-router-dom';
import { Calendar } from 'react-date-range';
import { FaCaretDown } from 'react-icons/fa';
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai'
import { VscLocation } from 'react-icons/vsc';
import { BsClock, BsPeople, BsTag } from 'react-icons/bs';
import { FiStar } from 'react-icons/fi';
import { BiCategoryAlt } from 'react-icons/bi';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../../Styles/tour-detail.scss'

class TourDetailPage extends React.Component {

    state = {
        date: new Date(),
        adults: 1,
        children: 0,
        price: 0,
        tour: {},
        showDatePicker: false,
        fullname: this.props.reduxData.user ? this.props.reduxData.user.fullName : '',
        phone: this.props.reduxData.user ? this.props.reduxData.user.phone : '',
        email: this.props.reduxData.user ? this.props.reduxData.user.email : '',
        isLoading: true,
        networkFailed: false
    }

    baseUrl = this.props.reduxData.baseUrl;

    async componentDidMount() {
        this.setState({
            fullname: this.props.reduxData.user ? this.props.reduxData.user.phone : '',
            phone: this.props.reduxData.user ? this.props.reduxData.user.phone : '',
            email: this.props.reduxData.user ? this.props.reduxData.user.email : ''
        })
        console.log('fullname', this.state.fullname)
        // call api to get tour, and set state
        const tourId = this.props.match.params.id
        try {
            this.setState({
                isLoading: true
            })
            let res = await axios.get(
                `https://localhost:7079/api/Tours/${tourId}`
            );       
            //console.log(res);
            const resTour = res.data;
            this.setState({
                tour: resTour,
                adults: resTour.minAdults,
                price: resTour.pricePerAdult*resTour.minAdults,
            })
        } catch (error) {
            if (!error.response) {
                toast.error("Network error");
                // fake api response
                const resTour = tour;
                this.setState({
                    tour: resTour,
                    adults: resTour.minAdults,
                    price: resTour.pricePerAdult*resTour.minAdults,
                    networkFailed: true,
                });            
                return;
            } 
            if (error.response.status === 404) {
                console.log(error)
            }
            if (error.response.status === 400) {
              console.log(error)
            }
        } finally {
            setTimeout(() => {
                this.setState({
                    isLoading: false
                })
            }, 1000)         
        }  
    }
    componentDidUpdate(prevProps, prevState) {
        if(prevProps.reduxData.user !== this.props.reduxData.user){
            // set state if new user data save in redux
            this.setState({
                fullname: this.props.reduxData.user ? this.props.reduxData.user.fullName : '',
                phone: this.props.reduxData.user ? this.props.reduxData.user.phone : '',
                email: this.props.reduxData.user ? this.props.reduxData.user.email : ''
            })
        }
    }

    // click date picker toggle
    handleDateClick = () => {
        let showDatePicker = this.state.showDatePicker;
        this.setState({
            showDatePicker: !showDatePicker
        })
    }

    // date select
    handleDateSelect = (date) => {
        console.log('selected date', date);
        this.setState({
            date: date,
            showDatePicker: false
        })
    }

    // ------------------------- adults and children quantity picker
    priceCalc = (adults, children) => {
        return adults*this.state.tour.pricePerAdult + children*this.state.tour.pricePerChild;
    }
    // handle adult minus
    handleAdultsMinus = () => {
        let {adults, children} = this.state;
        if(adults > this.state.tour.minAdults) {
            adults -= 1;
        }
        this.setState({
            adults: adults,
            price: this.priceCalc(adults, children)
        })
    }
    // handle adult minus
    handleAdultsAdd = () => {
        let {adults, children} = this.state;
        if(adults < this.state.tour.groupSize) {
            adults += 1;
        } 
        this.setState({
            adults: adults,
            price: this.priceCalc(adults, children)
        }) 
    }
    // handle children minus
    handleChildrenMinus = () => {
        let {adults, children} = this.state;
        if(children !== 0) {
            children -= 1;
        } 
        this.setState({
            children: children,
            price: this.priceCalc(adults, children)
        })
    }
    // handle children minus
    handleChildrenAdd = () => {
        let {adults, children} = this.state;
        if(children < this.state.tour.groupSize - this.state.adults) {
            children += 1;
        }
        this.setState({
            children: children,
            price: this.priceCalc(adults, children)
        }) 
    }
    // ------------------------------------------------------
    // text field handlers
    handleInputChange = (event) => {
        const key = event.target.name
        const value = event.target.value
        this.setState({
            [key]: value
        })
    }
    // booking submit
    handleBookingSubmit = () => {
        // call api post order
        const bookingRequest = {
            tourId: this.state.tour.id,
            date: this.state.date,
            adults: this.state.adults,
            children: this.state.children,
            customerName: this.state.fullname,
            customerPhone: this.state.phone,
            customerEmail: this.state.email
        }
        console.log("POST /orders/", bookingRequest)
    }
    // visit provider
    handleVisitProvider = () => {
        this.props.history.push(`/providers/${this.state.tour.providerId}`)
    }
    
    
    render() {
        const showDatePicker = this.state.showDatePicker; 
        const { date, adults, children, price } = this.state;
        const { tour } = this.state;
        const { fullname, phone, email } = this.state;
        const baseUrl = this.state.networkFailed ? '' : this.baseUrl;
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
                    <div className="tour-detail-page-container">
                        <div className="left-side">
                            <div className="tour-detail-section">
                                <div className="tour-detail-heading"> 
                                    <h2 className="tour-name">{tour.tourName}</h2>
                                    <div className='tour-rating'>
                                        {
                                            tour.rating > 0 ?
                                            <span className="rating">{Number.isInteger(tour.rating) ? `${tour.rating}.0` : tour.rating}&nbsp;<FiStar className="icon"/></span>
                                            :
                                            <span className='not-rated-label'>Not rated</span>
                                        }
                                        <span className="review">{tour.reviews} reviews</span>
                                    </div>
                                    <div className='tour-location-destination'>
                                        <div className="tour-location">
                                            <VscLocation /> Start: {tour.location}
                                        </div>
                                        <div className="tour-destination">
                                            <VscLocation /> End: {tour.destination}
                                        </div> 
                                    </div>   
                                    <div className='tour-categories'>
                                            <BsTag /> 
                                            {
                                                tour.categories.map((item) => ` ${item.categoryName},`)
                                            }                               
                                    </div>                        
                                </div>
                                <div className='tour-feature'>
                                    <div className='tour-feature-item'>
                                        <div className='logo'>
                                            <BsClock />
                                        </div>
                                        <div className='tour-feature-content'>
                                            <label className='title'>Duration</label>
                                            <span className='feature-text'>
                                            {
                                                tour.duration<1 ? 
                                                (
                                                    tour.duration===0.5 ?
                                                    'Half day'
                                                    :
                                                    `${Math.round(tour.duration*24)} hours`
                                                )                                    
                                                : 
                                                `${tour.duration} days`
                                            }
                                            </span>
                                        </div>
                                    </div>
                                    <div className='tour-feature-item'>
                                        <div className='logo'>
                                            <BiCategoryAlt />
                                        </div>
                                        <div className='tour-feature-content'>
                                            <label className='title'>Tour Type</label>
                                            <span className='feature-text'>
                                            {
                                                tour.isPrivate ?
                                                'Private'
                                                :
                                                'Shared'
                                            }
                                            </span>
                                        </div>
                                    </div>
                                    <div className='tour-feature-item'>
                                        <div className='logo'>
                                            <BsPeople />
                                        </div>
                                        <div className='tour-feature-content'>
                                            <label className='title'>Group Size</label>
                                            <span className='feature-text'>{tour.groupSize}</span>
                                        </div>
                                    </div>
                                    <div className='tour-feature-item'>
                                        <div className='logo'>
                                            <BsClock />
                                        </div>
                                        <div className='tour-feature-content'>
                                            <label className='title'>Duration</label>
                                            <span className='feature-text'>
                                            {
                                                tour.duration<1 ? 
                                                (
                                                    tour.duration===0.5 ?
                                                    'Half day'
                                                    :
                                                    `${Math.round(tour.duration*24)} hours`
                                                )                                    
                                                : 
                                                `${tour.duration} days`
                                            }
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <ImageSlider backgroundImagesData={tour.images} baseUrl={baseUrl}/>
                                <div className='tour-overview'>
                                    <h3 className="tour-detail-title">Overview</h3>
                                    <p className='tour-overview-content'>
                                        {tour.overview}
                                    </p>
                                </div>
                                <div className='tour-itinerary'>
                                    <h3 className="tour-detail-title">Itinerary</h3>    
                                    <div className="intinerary-content">
                                        {
                                            (tour.itineraries && tour.itineraries.length > 0) &&
                                            tour.itineraries.map((item) => {
                                                return (
                                                    <Itinerary key={item.id} itinerary={item}/>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                                <div className='tour-expense'>
                                    <h3 className="tour-detail-title">Included/Exclude expenses</h3>
                                    {
                                        (tour.expenses && tour.expenses.length > 0) &&
                                        <ExpenseTable expenses={tour.expenses}/>
                                    }
                                </div>
                                <div className='tour-reviews'>
                                    <h3 className="tour-detail-title">Reviews</h3>
                                    <ReviewSection tourId={this.props.match.params.id}/>
                                </div>
                            </div>                          
                        </div>
                    <div className="right-side">
                            <div className="booking-section">
                                    <div className="booking-header">
                                        <div className="price">
                                            <span className='label'>{price>tour.pricePerAdult*tour.minAdults?'price':'from'}</span>
                                            <span className='value'>${price},00</span>
                                        </div>
                                    </div>
                                    <div className="booking-body">
                                        <div className="date-booking" onClick={() => this.handleDateClick()}>
                                            <div className="date-display">
                                                <label className='title'>Date</label>
                                                <span>{`${("0" + date.getDate()).slice(-2)}/${("0" + (date.getMonth()+1)).slice(-2)}/${date.getFullYear()}`} <FaCaretDown /></span>
                                            </div>
                                            {
                                                showDatePicker && 
                                                <div className="date-picker" onClick={(event) => event.stopPropagation()}>
                                                    <Calendar
                                                        date={date}
                                                        minDate={new Date()}
                                                        onChange={this.handleDateSelect}
                                                    />
                                                </div>
                                            }
                                            
                                        </div>
                                        <div className="adults-booking">
                                            <div>
                                                <label className='title'>Adults</label>                                            
                                            </div>
                                            <div className='quantity-picker-wrap'>
                                                <div className='quantity-picker'>
                                                    <span className='minus-btn' onClick={() => this.handleAdultsMinus()}><AiOutlineMinus /></span>
                                                    <span className='quantity-value'>{adults}</span>
                                                    <span className='add-btn' onClick={() => this.handleAdultsAdd()}><AiOutlinePlus /></span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="children-booking">
                                            <div>
                                                <label className='title'>Children</label>
                                            </div>
                                            <div className='quantity-picker-wrap'>
                                                <div className='quantity-picker'>
                                                    <span className='minus-btn' onClick={() => this.handleChildrenMinus()}><AiOutlineMinus /></span>
                                                    <span className='quantity-value'>{children}</span>
                                                    <span className='add-btn' onClick={() => this.handleChildrenAdd()}><AiOutlinePlus /></span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="customer-info-group">
                                            <label className='title'>Full name</label>
                                            <input 
                                                type="text" 
                                                name="fullname"
                                                className='input-field' 
                                                value={fullname} 
                                                onChange={this.handleInputChange}
                                            />
                                        </div>
                                        <div className="customer-info-group">
                                            <label className='title'>Phone</label>
                                            <input 
                                                type="phone" 
                                                name="phone"
                                                className='input-field'
                                                value={phone}  
                                                onChange={this.handleInputChange}
                                            />
                                        </div>
                                        <div className="customer-info-group">
                                            <label className='title'>Email</label>
                                            <input 
                                                type="email" 
                                                name="email"
                                                className='input-field'
                                                value={email} 
                                                onChange={this.handleInputChange}
                                            />
                                        </div>
                                        <div className="submit-booking">
                                            <button className="submit" onClick={this.handleBookingSubmit}>BOOK NOW</button>
                                        </div>
                                    </div>
                            </div>
                            <div className="provider-section">
                                <div className="provide-title">
                                    Provided by
                                </div>
                                <div className="provider-main-info">
                                    <img src={baseUrl + tour.providerAvatar}></img>
                                    <span className="provider-name">{tour.providerName}</span>
                                </div>
                                <button className='visit' onClick={this.handleVisitProvider}>VISIT</button>
                            </div>
                    </div>            
                    </div>           
                }
          </div>
        )
    }
}

class ImageSlider extends React.Component {
    render() {
      const backgroundImagesData = this.props.backgroundImagesData;
      const baseUrl = this.props.baseUrl;
      var settings = {
        dots: true,
        fade: true,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        nextArrow: <Right />,
        prevArrow: <Left />
      };
      return (
        <Slider {...settings}>
            {
                backgroundImagesData &&
                backgroundImagesData.map((item) => {
                    return (                      
                        <BackgroundImageDiv key={item.id} url={baseUrl+item.url} />
                    )
                })
            }
        </Slider>
      );
    }
}

class BackgroundImageDiv extends React.Component {
    render() {
      const url = `url(${this.props.url})`;
      return (
        <div
          className="tour-image"
          style={{
            backgroundImage: url
          }}
        />
      );
    }
}

const tour = {
    id: 1,
    tourName: 'HALF-DAY FOODIE TOUR BY BICYCLE & VISIT TRA QUE VEGETABLE VILLAGE',
    overview: 'Take a journey through Hoi An’s culinary history; head out to the beautiful countryside by bicycle'+ 
    'to experience some traditional local food favorites, including the most famous of Hoi An specialties; Cao Lau.'+
    '\n Try the traditional Hoi An specialty, Cao Lau; intoxicating pork noodle broth, featuring sticky rice noodles that must be soaked in water from the oldest well in Hoi An, Ba Le Well.',
    location: 'Hội An, Quang Nam Province, Vietnam',
    destination: 'Hội An, Quang Nam Province, Vietnam',
    reviews: 12,
    rating: 4.4,
    viewCount: 10,
    isPrivate: false,
    minPrice: 45,
    duration: 0.5,
    categories: [ 
        { id: 4, categoryName: 'biking tour' },
        { id: 7, categoryName: 'classic tour' },
        { id: 8, categoryName: 'cooking tour' },
        { id: 11, categoryName: 'culinary tour' }
    ],
    itineraries: [
        {
            id: 1,
            title: 'Part 1',
            content: 'Discover Hoi An’s countryside and its local foods by bicycle. Local foods in Hoi An are known and enjoyed by the tourists once setting foot here. In Hoi An, these cuisines are very popular and sold everywhere in all streets. Moreover, these cuisines are considered as unique symbols for the culture and introduced to every tourist. We bike through the countryside to a Tra Que Village.'
        },
        {
            id: 2,
            title: 'Part 2',
            content: 'Vegetables from this village are distributed to most of the restaurants in town and specially make the Cao Lau to have a perfect taste. Go back to town and learn how to make special “white rose” dumpling cakes with a local family and taste your products.'
        },
        {
            id: 3,
            title: 'Part 3',
            content: 'Continue riding to Cam Nam to enjoy the Yin and Yang food such as: Banh Dap (“cracked or smashed rice pancake”), Che Bap (“corn and coconut sweet soup”). We then ride to a famous local restaurant for Hoi An specialty - Cao Lau. Cao Lau is a traditional Hoi An specialty composed of local noodles, pork, fresh vegetables and rice paper.'
        },
        {
            id: 4,
            title: 'Part 4',
            content: 'We will ride back to the company at the end of our trip.'
        }
    ],
    expenses: [
        {
            id: 1,
            isIncluded: true,
            content: 'Hotel pickup and drop-off in Hoi An City Center'
        },
        {
            id: 2,
            isIncluded: true,
            content: 'Transportation with air-conditioning'
        },
        {
            id: 3,
            isIncluded: true,
            content: 'Bicycle'
        },
        {
            id: 4,
            isIncluded: true,
            content: 'Entrance fees'
        },
        {
            id: 5,
            isIncluded: true,
            content: 'Foods and Bottled drinking water'
        },
        {
            id: 6,
            isIncluded: false,
            content: 'Tips and gratuities'
        },
        {
            id: 5,
            isIncluded: false,
            content: 'Personal expenses such as: shopping, telephone, beverage, etc.'
        }
    ],
    images:[
        {
            id: 1,
            url: 'https://hoianexpress.com.vn/wp-content/uploads/2019/12/IMG_9925-870x555.jpg'
        },
        {
            id: 2,
            url: 'https://hoianexpress.com.vn/wp-content/uploads/2019/12/IMG_3740-870x555.jpg'
        }
        ,
        {
            id: 3,
            url: 'https://hoianexpress.com.vn/wp-content/uploads/2019/12/IMG_9892-870x555.jpg'
        }
        ,
        {
            id: 4,
            url: 'https://hoianexpress.com.vn/wp-content/uploads/2019/12/z1577810441855_9034cb5e3abd4c3b6fcebb3b2f4c4ce3-870x555.jpg'
        }
    ],    
    groupSize: 15,
    minAdults: 2,
    pricePerAdult: 89,
    pricePerChild: 30,
    providerId: 1,
    providerName: "Hoi An Express",
    providerAvatar: "https://hoianexpress.com.vn/wp-content/uploads/2020/09/logo-moi.png",
}

const mapStateToProps = (state) => {
    return {
        reduxData: state
    }
}

export default connect(mapStateToProps)(withRouter(TourDetailPage));
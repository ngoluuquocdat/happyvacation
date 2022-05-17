import React from 'react'
import HeaderNav from '../../Header/HeaderNav'
import { toast } from 'react-toastify';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import ReactLoading from "react-loading";
import { Link } from 'react-router-dom';
import { BsArrowRight } from 'react-icons/bs';
import { VscLocation } from 'react-icons/vsc';
import { DateRange } from 'react-date-range';
import { Pagination } from "@mui/material";
import '../../../Styles/order-detail-modal.scss';

class UserOrderDetailModal extends React.Component {

    state = {
        order: {},
        isLoading: false
    }

    baseUrl = this.props.reduxData.baseUrl;

    componentDidMount() {
        this.getOrderDetailManage();
    }

    // handle click close modal
    closeModal = () => {
        this.props.closeModal();
    }

    // get order detail manage
    getOrderDetailManage = async() => {
        const token = localStorage.getItem('user-token');
        if(!token) {
            this.props.history.push('/login', {prevPath: this.props.location.pathname});
        }
        const orderId = this.props.match.params.id
        try {
            this.setState({
                isLoading: true
            })  
            let res = await axios.get(
                `${this.baseUrl}/api/Orders/${orderId}/detail`,
                {
                    headers: { Authorization:`Bearer ${token}` }
                }
            );
            this.setState({
                order: res.data,
            })  
        } catch(error) {
            if (!error.response) {
                console.log(error)
                toast.error("Network error");
                return;
            }
            if (error.response.status === 400) {
                if(error.response === 'Invalid state.'){
                    console.log(error)
                }
                if(error.response === 'Already in this state.'){
                    console.log(error)
                }
            }
            if (error.response.status === 401) {
                toast.error("Login to continue");
                console.log(error)
            }
            if (error.response.status === 404) {
                this.props.history.push('/not-found');
            }
            if (error.response.status === 403) {
                toast.error("Not allowed");
                // redirect to provider register page or show notification
                //this.props.history.push('/for-provider/register');
            }
        } finally {
            this.setState({
                isLoading: false
            })
        }
    }

    render() {
        const order = this.state.order;
        const isOrderLoaded = Object.values(order).length > 0;
        const avatarUrl = `url('${this.baseUrl + order.thumbnailUrl}')`;
        const isLoading = this.state.isLoading;

        return (
            <div className="order-detail-page-wrapper">               
                <div className="small-header">
                    <HeaderNav />
                </div>
                {
                    !isOrderLoaded ? 
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
                    <div className="order-detail-page-content">
                        <div className='order-id'> 
                            <span>Order ID: </span>
                            <span>{order.id}</span>             
                            <p>Order date: {order.orderDate}</p>
                        </div>
                        <div className="order-billing-info">
                            <div className='left'>
                                <div className="tour-thumbnail" style={{backgroundImage: avatarUrl}}></div>
                            </div>
                            <div className='right'>
                                <h5 className='tour-order-title'>
                                    {order.tourName}
                                </h5>
                                <div className='tour-order-start-end'>
                                    <span><VscLocation />
                                        Start:&nbsp;
                                        {
                                            order.startPoint.includes('CustomerPoint&') ?
                                            `${order.startPoint.split('&')[1]} (Customer's location in ${order.startPoint.split('&')[2]})`
                                            :
                                            order.startPoint
                                        }
                                    </span>
                                    <span><VscLocation />
                                        End:&nbsp;
                                        {
                                            order.endPoint.includes('CustomerPoint&') ?
                                            `${order.endPoint.split('&')[1]} (Customer's location in ${order.endPoint.split('&')[2]})`
                                            :
                                            order.endPoint
                                        }
                                    </span>
                                </div>
                                <div className='tour-order-info'>
                                    <div className='tour-order-description-wrap'>
                                        <p className='tour-order-description'>
                                            <span>Tour Id: </span>
                                            {order.tourId}
                                        </p>
                                        <p className='tour-order-description'>
                                            <span>Tour type: </span>
                                            {
                                                order.isPrivate ? 'Private' : 'Shared'
                                            }
                                        </p>
                                        <p className='tour-order-description'>
                                            <span>Departure day: </span>
                                            {order.departureDate}
                                        </p>
                                        <p className='tour-order-description'>
                                            <span>Duration: </span>
                                            {
                                                order.duration<1 ? 
                                                (
                                                    order.duration===0.5 ?
                                                    'Half day'
                                                    :
                                                    `${Math.round(order.duration*24)} hours`
                                                )                                    
                                                : 
                                                `${order.duration} days`
                                            }
                                        </p>
                                        <p className='tour-order-description'>
                                            <span>State: </span>
                                            <span className={`order-state ${order.state.toLowerCase()}`}>{order.state}</span>
                                        </p>
                                        <p className='tour-order-description'>
                                            <span>Modified at: </span>
                                            {order.modifiedDate}
                                        </p>
                                    </div>
                                    <div className='booking-detail-wrap'>                               
                                        <p className='tour-order-price'><small>Booking detail</small></p>
                                        <p className='tour-order-price'>
                                            <span>Adults: </span>
                                            {order.adults} X ${order.pricePerAdult} <BsArrowRight className='arrow-icon'/> ${order.adults * order.pricePerAdult}
                                        </p>
                                        <p className='tour-order-price'>
                                            <span>Children: </span>
                                            {order.children} X ${order.pricePerChild} <BsArrowRight className='arrow-icon'/> ${order.children * order.pricePerChild}
                                        </p>
                                        <p className='tour-order-total-price'>
                                            <span>Total price: </span>
                                            ${order.totalPrice}
                                        </p>
                                    </div>
                                    {/* <div className='tourist-information-wrap'>
                                        <p className='tour-order-price'><small>Customer Information</small></p>
                                        <p className='tour-order-description'>
                                            {order.touristName}
                                        </p>
                                        <p className='tour-order-description'>
                                            {order.touristPhone}
                                        </p>
                                        <p className='tour-order-description'>
                                            {order.touristEmail}
                                        </p>
                                    </div> */}
                                </div>
                            </div>
                        </div>
                        <div className="order-members">
                            <h2 className="section-title">Registered members</h2>
                            <h3 className="section-sub-title">Adults</h3>
                            <div className="adults-table">
                                <div className="adults-table-heading">
                                    <span>No.</span>
                                    <span className="name">Full Name</span>
                                    <span>Identity Number</span>
                                    <span>Date of Birth</span>
                                </div>
                                <div className="adults-list">
                                {
                                    order.adultsList.map((item, index) => {
                                        return(
                                            <div className="adult-item">
                                                <span>{index+1}</span>
                                                <span className="name">{item.fullName}</span>
                                                <span>{item.identityNumber}</span>
                                                <span>{item.dob}</span>
                                            </div>
                                        )
                                    })
                                }
                                </div>
                            </div>
                            <h3 className="section-sub-title">Children</h3>
                            <div className="children-table">
                                <div className="children-table-heading">
                                    <span>No.</span>
                                    <span className="name">Full Name</span>
                                    <span>Identity Number</span>
                                    <span>Date of Birth</span>
                                </div>
                                <div className="children-list">
                                {
                                    order.childrenList.map((item, index) => {
                                        return(
                                            <div className="child-item">
                                                <span>{index+1}</span>
                                                <span className="name">{item.fullName}</span>
                                                <span>{item.identityNumber}</span>
                                                <span>{item.dob}</span>
                                            </div>
                                        )
                                    })
                                }
                                </div>
                            </div>
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

export default connect(mapStateToProps)(withRouter(UserOrderDetailModal));
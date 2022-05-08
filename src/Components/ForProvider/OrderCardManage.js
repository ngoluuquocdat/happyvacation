import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { BsArrowRight } from 'react-icons/bs';
import { VscLocation } from 'react-icons/vsc';
import '../../Styles/order-card.scss'

class OrderCardManage extends Component {

    state = {
        openMore: false,
        isLoading: false
    }

    baseUrl = this.props.reduxData.baseUrl;

    // order process click
    orderProcessClick = (event, orderId) => {
        this.props.changeOrderState(orderId, event.target.name)
    }

    render() {
        const order = this.props.order;
        const avatarUrl = `url('${this.baseUrl + order.thumbnailUrl}')`;
        //const avatarUrl = `url('${order.thumbnailUrl}')`;
        return (           
            <div className='order-card'>
                <div className='order-id'> 
                    <span>Order ID: </span>
                    <span>{order.id}</span>             
                </div>
                <div className='order-content'>
                    <div className='left small'>
                        <div className="tour-thumbnail" style={{backgroundImage: avatarUrl}}></div>
                    </div>
                    <div className='right'>
                        <h5 className='tour-order-title'>
                            <Link to={`/tours/${order.tourId}`} exact="true" className="link">{order.tourName}</Link>
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
                            <div className='tourist-information-wrap'>
                                <p className='tour-order-price'><small>Tourist Information</small></p>
                                <p className='tour-order-description'>
                                    {order.touristName}
                                </p>
                                <p className='tour-order-description'>
                                    {order.touristPhone}
                                </p>
                                <p className='tour-order-description'>
                                    {order.touristEmail}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                {
                    order.state !== 'canceled' &&
                    <div className='order-process'>
                        {/* <p className='open-more'>MORE</p> */}
                        <div className='order-process-button-wrap'>
                            {
                                order.state === 'pending' &&
                                <button className='order-confirm' name='confirmed' onClick={(event) => this.orderProcessClick(event, order.id)}>CONFIRM</button>  
                            }
                            <button className='order-cancel' name='canceled' onClick={(event) => this.orderProcessClick(event, order.id)}>CANCEL</button>
                        </div>        
                    </div>
                }
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        reduxData: state
    }
}

export default connect(mapStateToProps)(OrderCardManage);

  
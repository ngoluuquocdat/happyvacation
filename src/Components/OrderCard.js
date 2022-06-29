import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { BsArrowRight } from 'react-icons/bs';
import { VscLocation } from 'react-icons/vsc';
import '../Styles/order-card.scss'

class OrderCard extends Component {

    // click order card
    handleOpenContent = () => {

    }

    // see order detail click
    seeOrderDetail = (event, orderId) => {
        this.props.openDetailModal(orderId);
    }

    baseUrl = this.props.reduxData.baseUrl;

    render() {
        const order = this.props.order;
        const avatarUrl = `url('${this.baseUrl + order.thumbnailUrl}')`;
        //const avatarUrl = `url('${order.thumbnailUrl}')`;
        let card_class_name = 'order-card';
        //if(order.hasDeparted && order.state === 'confirmed') {
        if(order.hasDeparted) {
            card_class_name = 'order-card--departed'
        }
        if(order.state === 'canceled') {
            card_class_name = 'order-card--canceled'
        }

        return (           
            <div className={card_class_name} onClick={() => this.handleOpenContent()}>
                <div className='provider-info'> 
                    <Link to={`/providers/${order.providerId}`} exact="true" className="link"><span>{order.providerName}</span></Link>             
                </div>
                <p className='order-date'>Order date: {order.orderDate}</p>
                <div className='order-content'>
                    <div className='left'>
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
                                {
                                    order.pricePerChild >= 0 &&
                                    <p className='tour-order-price'>
                                        <span>Children: </span>
                                        {order.children} X ${order.pricePerChild} <BsArrowRight className='arrow-icon'/> ${order.children * order.pricePerChild}
                                    </p>
                                }
                                <p className='tour-order-total-price'>
                                    <span>Total price: </span>
                                    ${order.totalPrice}
                                </p>
                                <p className='tour-order-see-detail' onClick={(event) => this.seeOrderDetail(event, order.id)}>Detail</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        reduxData: state
    }
}

export default connect(mapStateToProps)(OrderCard);

  
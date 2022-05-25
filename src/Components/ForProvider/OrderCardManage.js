import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
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

    // see order detail click
    seeOrderDetail = (event, orderId) => {
        window.open(`/provider/view/orders/${orderId}`, "_blank");
        //this.props.history.push(`/provider/view/orders/${orderId}`);
    }

    // open change departure date modal
    openChangeDateModal = (event, orderId, departureDate) => {
        console.log('cdate', departureDate)
        this.props.openChangeDateModal(orderId, departureDate);
    }

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
            <div className={card_class_name}>
                <div className='order-id'> 
                    <span>Order ID: </span>
                    <span>{order.id}</span>             
                </div>
                <div className='order-content'>
                    <div className='left small'>
                        <div className="tour-thumbnail" style={{backgroundImage: avatarUrl}}>
                            {
                                (order.hasDeparted || order.state === 'canceled') && 
                                <>
                                    <div className="thumbnail-overlay"></div>
                                    <span 
                                        className={order.state === 'canceled' ? 'thumbnail-label canceled' : 'thumbnail-label departed'}
                                    >
                                        {
                                            order.state === 'canceled' ? 'Canceled' : 'Departed'
                                        }
                                    </span>
                                </>
                            }
                        </div>                       
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
                            </div>
                            <div className='tourist-information-wrap'>
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
                                <p className='tour-order-see-detail' onClick={(event) => this.seeOrderDetail(event, order.id)}>Detail</p>
                                {
                                    !order.hasDeparted && order.state !== 'canceled' &&
                                    <p className='tour-order-see-detail' onClick={(event) => this.openChangeDateModal(event, order.id, order.departureDate)}>Change Departure date</p>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                {
                    !order.hasDeparted && order.state !== 'canceled' &&
                    <div className='order-process'>
                        {/* <p className='open-more'>MORE</p> */}
                        <div className='order-process-button-wrap'>
                            {
                                order.state === 'pending' &&
                                <button className='order-confirm' name='confirmed' onClick={(event) => this.orderProcessClick(event, order.id)}>CONFIRM</button>  
                            }
                            <button className='order-cancel' name='canceled' onClick={(event) => this.orderProcessClick(event, order.id, order.departureDate)}>CANCEL</button>
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

export default connect(mapStateToProps)(withRouter(OrderCardManage));

  
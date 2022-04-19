import React, { Component } from 'react';
import { BsArrowRight } from 'react-icons/bs';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ReactLoading from "react-loading";
import { BsClock, BsPeople, BsPen } from 'react-icons/bs';
import { BiCategoryAlt } from 'react-icons/bi';
import { toast } from 'react-toastify';
import '../../Styles/ForProvider/tour-manage-card.scss'

class TourCardManage extends Component {

    state = {
        openMore: false,
        isLoading: false
    }

    baseUrl = this.props.reduxData.baseUrl;

    // tour providing state click
    changeProvidingState = (tourId) => {
        this.props.changeProvidingState(tourId)
    }

    render() {
        const tour = this.props.tour;
        const avatarUrl = `url('${this.baseUrl + tour.thumbnailPath}')`;
        //const avatarUrl = `url('${tour.thumbnailPath}')`;
        return (           
            <div className='tour-manage-card'>
                <div className='tour-info-item tour-id'>{tour.id}</div>
                <div className='tour-info-item tour-name'>
                    <div className='info-item-header'>{tour.tourName}</div>
                    <div className='info-item-body'>
                        <div className='info-item-body-left'>
                            <div className='tour-thumbnail' style={{backgroundImage: avatarUrl}}></div>
                        </div><div className='info-item-body-right'>
                            <div className='info-item-group'>
                                <BsClock />
                                {
                                    tour.duration<1 ? 
                                    ( tour.duration===0.5 ? 'Half day' : `${Math.round(tour.duration*24)} hours` )                                    
                                    : 
                                    `${tour.duration} days`
                                }
                            </div>
                            <div className='info-item-group'>
                                <BiCategoryAlt />
                                {tour.isPrivate ? 'Private' : 'Shared'}
                            </div>
                            <div className='info-item-group'>
                                <BsPeople />
                                {tour.groupSize} people
                            </div>
                            <div className='info-item-group'>
                                <BsPen />
                                {tour.reviews} reviews
                            </div>
                        </div>
                    </div>
                </div>
                <div className='tour-info-item sites'>
                    {
                        tour.places.map(item => {
                            return (
                                <div key={'site'+item.id} className='sub-info-list'>
                                    <span className='sub-info-item'>{item.placeName},</span>
                                </div>
                            )
                        })
                    }
                </div>
                <div className='tour-info-item categories'>
                    {
                        tour.categories.map(item => {
                            return (
                                <div key={'cate'+item.id} className='sub-info-list'>
                                    <span className='sub-info-item'>{item.categoryName},</span>
                                </div>
                            )
                        })
                    }
                </div>
                <div className='tour-info-item tour-price'>
                    Adult:&nbsp;
                    ${tour.pricePerAdult}
                    <br></br>
                    Child:&nbsp;
                    ${tour.pricePerChild}
                </div>
                <div className='tour-info-item rating'>{tour.rating}</div>
                <div className='tour-info-item orders'>{tour.orderCount}</div>
                <div className='tour-info-item tour-action'>
                    <Link className='link' to={`/for-provider/tours/${tour.id}/edit`}>
                        Edit
                    </Link>
                    <Link className='link' to={`/tours/${tour.id}`}>
                        Preview
                    </Link>
                    {
                        tour.isAvailable ?
                        <button className='available-btn' onClick={()=>this.changeProvidingState(tour.id)}>Stop Providing</button>
                        :
                        <button className='available-btn not-providing' onClick={()=>this.changeProvidingState(tour.id)}>Start Providing</button>
                    }                  
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

export default connect(mapStateToProps)(TourCardManage);

  
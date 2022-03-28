import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../Styles/tour-card.scss';
import { BsClock } from 'react-icons/bs';
import { FiStar } from 'react-icons/fi'

class TourCard extends Component {

    render() {
      const thumbnailPath = `url(${this.props.tour.thumbnailPath})`;
      const tour = this.props.tour
      const isSlideItem = this.props.isSlideItem
      const wrapperClassName = isSlideItem ? "tour-card-wrapper slider-item" : "tour-card-wrapper"
      
      return (
          <div className={wrapperClassName}>
              <Link
                to={{ pathname: `/tours/${tour.id}` }}
                className="link"
              >
                  <div className="tour-card">
                      <div className="tour-card-top">
                          <div
                              className="tour-card-img"
                              style={{backgroundImage: thumbnailPath}}
                          />
                          {
                              tour.isPrivate &&
                              <span className="private-label">Private</span>
                          }                   
                      </div>
                      <div className="tour-card-bottom">
                          <div className="tour-details-top">
                              <span className="tour-name">{tour.tourName}</span>
                              <div className="tour-review">
                                  <span className="rating">{tour.rating}&nbsp;<FiStar className="icon"/></span>
                                  <span className="review-count">{tour.reviews} reviews</span>
                              </div>                       
                          </div>
                          <div className="tour-details-bottom">
                              <span className="duration"><BsClock className="icon"/>
                                &nbsp;&nbsp;
                                {
                                    tour.duration<1 ? 
                                    (
                                        tour.duration==0.5 ?
                                        'Half day'
                                        :
                                        `${Math.round(tour.duration*24)} hours`
                                    )                                    
                                    : 
                                    `${tour.duration} days`
                                }
                              </span>
                              <span className="min-price">from <span className="min-price-value">${tour.minPrice},00</span></span>
                          </div>
                      </div>
                  </div>
              </Link>
          </div>
      );
    }
}

export default TourCard;
  
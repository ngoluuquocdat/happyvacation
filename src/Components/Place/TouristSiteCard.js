import React, { Component } from "react";
import { Link } from "react-router-dom";
import { BsClock } from "react-icons/bs";
import { FiStar } from "react-icons/fi";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../Styles/tourist-site-card.scss";

class TouristSiteCard extends Component {
    render() {
        const baseUrl = this.props.baseUrl;
        const site = this.props.site;
        const thumbnailPath = `url(${baseUrl+site.thumbnailUrl})`;
        const isSlideItem = this.props.isSlideItem;
        // const wrapperClassName = isSlideItem
        //     ? "tour-card-wrapper slider-item"
        //     : "tour-card-wrapper";

        return (
            <div className='site-card-wrapper'>
                <Link to={{ pathname: `/sites/${site.id}` }} className="link">
                    <div className="site-card">
                        <div className="site-card-top">
                            <div
                                className="site-card-img"
                                style={{ backgroundImage: thumbnailPath }}
                            />
                        </div>
                        <div className="site-card-bottom">
                            <span className="site-name">
                                {site.siteName}
                            </span>
                        </div>
                    </div>
                </Link>
            </div>
        );
    }
}

export default TouristSiteCard;

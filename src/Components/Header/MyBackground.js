import React, { Component } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import '../../Styles/background.css';

class MyBackgroundCarousel extends React.Component {
  render() {
    var settings = {
      dots: true,
      fade: true,
      infinite: true,
      speed: 3000,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 3000,
    };
    const { backgroundImagesData, isSmall } = this.props;
    return (
      <div className="slider-div">
        <Slider {...settings}>
          {backgroundImagesData &&
            backgroundImagesData.map(({ id, url }) => (
              <BackgroundImageDiv key={id} url={url} isSmall={isSmall}/>
            ))}
        </Slider>
      </div>
    );
  }
}

class BackgroundImageDiv extends Component {
  render() {
    const url = `url(${this.props.url})`;
    const isSmall = this.props.isSmall;
    const className = isSmall ? "background-image-div small" : "background-image-div";
    return (
      <div
        className={className}
        style={{
          backgroundImage: url
        }}
      />
    );
  }
}

export default MyBackgroundCarousel;

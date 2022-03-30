import React, { Component } from 'react';
import Slider from 'react-slick';
import { Left, Right } from '../Header/Arrows';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../../Styles/top-tours.scss';
import TourCard from '../TourCard';

class TopTours extends Component {

  state = {
    topTours: []
  }
  
  componentDidMount() {
    const providerId = this.props.providerId;
    // call api to get list top tour
    if(providerId) {
      console.log(`GET providers/${providerId}/tours/top`)
    } else {
      console.log("GET tours/top")
    }
    // fake api response
    const resTopTours = topTours_temp;
    // set state
    this.setState({
      topTours: resTopTours
    })
  }

  render() {
    const topTours = this.state.topTours;

    const isSmall = this.props.isSmall;
    const className = isSmall ? "top-tours-section small" : "top-tours-section";

    return (
        <div className="top-tours-container">
            <div className="title-section">
                <h1 className="title">Popular tours</h1>
                <h3 className="sub-title">Take a look at some most-viewed tours!</h3>
            </div>
            <div className={className}>
                  <TourSlider tours={topTours} />
                <hr
                    style={{
                    height: '1px',
                    color: '#e7e7e7',
                    borderTop: 'none',
                    borderLeft: 'none'
                    }}
                />
            </div>
        </div>
    );
  }
}

class TourSlider extends React.Component {
  render() {
    const tours = this.props.tours;
    let slidesToShow = 4;
    let slidesToScroll = 4;
    let wrapperClass = "slider-wrap"
    if(tours.length < 4 && tours.length > 0) {
      slidesToShow = tours.length;
      slidesToScroll = tours.length;
      wrapperClass = tours.length === 1 ? "slider-wrap tiny" : "slider-wrap small"
    } else {
      const windowWidth = window.innerWidth;
      if(windowWidth > 1700) {
        slidesToShow = 5;
        slidesToScroll = 5;
      }
    }
    var settings = {
        infinite: true,
        speed: 500,
        slidesToShow: slidesToShow,
        slidesToScroll: slidesToScroll,
        nextArrow: <Right />,
        prevArrow: <Left />
    };
    return (
      <div className={wrapperClass}>
        <Slider {...settings}>
          {tours &&
            tours.map((item) => (
                <TourCard tour={item} key={item.id} isSlideItem={true}/>
            ))}
        </Slider>
      </div>
    );
  }
}


const topTours_temp = [
  {
    id: 1,
    tourName: 'FULL-DAY HAI VAN PASS & LANG CO BEACH & IN HUE CITY',
    reviews: 10,
    rating: 4.8,
    viewCount: 10,
    isPrivate: false,
    minPrice: 384,
    duration: 1,
    route: 'london',
    description: 'For everything hunky-dory',
    thumbnailPath:
      'https://hoianexpress.com.vn/wp-content/uploads/2019/12/LANG-CO-BEACH-10.jpg'
  },
  {
    id: 2,
    tourName: 'HALF-DAY FOODIE TOUR BY BICYCLE & VISIT TRA QUE VEGETABLE VILLAGE',
    reviews: 10,
    rating: 4.4,
    viewCount: 10,
    isPrivate: false,
    minPrice: 45,
    duration: 0.5,
    route: 'las-vegas',
    description: "An offer you can't refuse",
    thumbnailPath:
      'https://hoianexpress.com.vn/wp-content/uploads/2019/12/Foodie_11-680x500.jpg'
  },
  {
    id: 3,
    tourName: 'HOI AN MYSTERIOUS NIGHT TOUR WITH DINNER FROM DA NANG',
    reviews: 10,
    rating: 3.8,
    viewCount: 10,
    isPrivate: true,
    minPrice: 46,
    duration: 0.16666666,
    route: 'rome',
    description: 'Roam the eternal city',
    thumbnailPath:
      'https://hoianexpress.com.vn/wp-content/uploads/2019/12/1-25-870x555.jpg'
  },
  {
    id: 4,
    tourName: 'HOI AN COUNTRYSIDE ADVENTURE BY ELECTRIC SCOOTER',
    reviews: 10,
    rating: 4.2,
    viewCount: 10,
    isPrivate: false,
    minPrice: 62,
    duration: 0.5,
    route: 'paris',
    description: "C'est La Vie",
    thumbnailPath:
      'https://hoianexpress.com.vn/wp-content/uploads/2019/12/1-Briefing-Hoi-An-Town-6-870x555.jpg'
  },
  {
    id: 5,
    tourName: 'Private Tour: FULL-DAY GOLF TOUR FROM HA NOI',
    reviews: 10,
    rating: 4.6,
    viewCount: 10,
    isPrivate: true,
    minPrice: 100,
    duration: 0.33333333,
    route: 'new-york',
    description: 'Take a bite of the Big Apple',
    thumbnailPath:
      'https://hoianexpress.com.vn/wp-content/uploads/2019/12/GOLF_6-680x500.jpg'
  },
  {
    id: 6,
    tourName: '13 DAYS AUTHENTIC VIETNAM PLUS GOLDEN BRIDGE',
    reviews: 10,
    rating: 4.6,
    viewCount: 10,
    isPrivate: false,
    minPrice: 200,
    duration: 13,
    thumbnailPath:
      'https://hoianexpress.com.vn/wp-content/uploads/2019/12/GBS0056_13days9-680x500.jpg'
  },
  {
    id: 7,
    tourName: 'HALF-DAY FOODIE TOUR BY BICYCLE & VISIT TRA QUE VEGETABLE VILLAGE',
    reviews: 10,
    rating: 4.4,
    viewCount: 10,
    isPrivate: true,
    minPrice: 32,
    duration: 0.5,
    thumbnailPath:
      'https://hoianexpress.com.vn/wp-content/uploads/2019/12/Hoi-An-Food-tour-by-bike-_7-1-680x500.jpg'
  },
  {
    id: 8,
    tourName: 'HALF-DAY DA NANG MUSEUMS AND BRIDGES TOUR',
    reviews: 10,
    rating: 4.8,
    viewCount: 10,
    isPrivate: false,
    minPrice: 35,
    duration: 0.5,
    thumbnailPath:
      'https://hoianexpress.com.vn/wp-content/uploads/2019/12/HCM-MUSEUM_49-680x500.jpg'
  },
  {
    id: 9,
    tourName: 'FULL-DAY DMZ TOUR FROM HUE CITY',
    reviews: 10,
    rating: 4.8,
    viewCount: 10,
    isPrivate: false,
    minPrice: 89,
    duration: 1,
    thumbnailPath:
      'https://hoianexpress.com.vn/wp-content/uploads/2021/06/1-680x500.jpg'
  },
  {
    id: 10,
    tourName: 'BA NA HILLS AND GOLDEN BRIDGE FROM CHAN MAY PORT',
    reviews: 10,
    rating: 4.2,
    viewCount: 10,
    isPrivate: false,
    minPrice: 100,
    duration: 0.29166666,
    thumbnailPath:
      'https://hoianexpress.com.vn/wp-content/uploads/2019/12/BA-NA-HILLS_44-1-680x500.jpg'
  },
  {
    id: 11,
    tourName: 'Private Tour: HUE HERITAGE',
    reviews: 10,
    rating: 3.8,
    viewCount: 10,
    isPrivate: true,
    minPrice: 1.043,
    duration: 2,
    thumbnailPath:
      'https://hoianexpress.com.vn/wp-content/uploads/2019/12/HUE-CITY-_6-680x500.jpg'
  },
  {
    id: 12,
    tourName: 'FOOD TOUR IN HUE CITY',
    reviews: 10,
    rating: 4.4,
    viewCount: 10,
    isPrivate: true,
    minPrice: 162,
    duration: 0.16666666,
    thumbnailPath:
      'https://hoianexpress.com.vn/wp-content/uploads/2021/08/Food-Tour-Hue_4-680x500.jpg'
  },
  {
    id: 13,
    tourName: 'FOOD TOUR IN HUE CITY',
    reviews: 10,
    rating: 4.8,
    viewCount: 10,
    isPrivate: false,
    minPrice: 63,
    duration: 2,
    thumbnailPath:
      'https://hoianexpress.com.vn/wp-content/uploads/2021/06/dnp-Top-10-mon-an-vat-ngon-nhat-o-hue-banh-be%CC%80o-870x555.jpeg'
  },
  {
    id: 14,
    tourName: 'HOIANIAN’S BELIEFS AND VEGETARIAN DINNER FROM HOI AN',
    reviews: 10,
    rating: 3.8,
    viewCount: 10,
    isPrivate: true,
    minPrice: 46,
    duration: 0.16666666,
    thumbnailPath:
      'https://cdn-imgix.headout.com/cities/edinburgh/images/mobile/morning.jpg?auto=compress&fm=webp&w=412.5&h=486&crop=faces&fit=min'
  },
  {
    id: 15,
    tourName: 'FULL-DAY HUE CITY TOUR & CRAFT VILLAGES',
    reviews: 10,
    rating: 4.8,
    viewCount: 10,
    isPrivate: false,
    minPrice: 79,
    duration: 2,
    thumbnailPath:
      'https://hoianexpress.com.vn/wp-content/uploads/2021/06/Screen-Shot-2021-05-23-at-08.47.26-680x500.png'
  },
  {
    id: 16,
    tourName: 'Private Tour: HALF-DAY COUNTRYSIDE BY BICYCLE FROM HUE CITY',
    reviews: 10,
    rating: 4.8,
    viewCount: 10,
    isPrivate: true,
    minPrice: 174,
    duration: 0.16666666,
    thumbnailPath:
      'https://hoianexpress.com.vn/wp-content/uploads/2021/08/Food-Tour-Hue_5-680x500.jpg'
  },
  {
    id: 17,
    tourName: 'Private Tour: FULL-DAY HUE CITY TOUR & CRAFT VILLAGES',
    reviews: 10,
    rating: 4.8,
    viewCount: 10,
    isPrivate: true,
    minPrice: 307,
    duration: 1,
    route: 'florence',
    description: 'Enjoy and have fun in the City',
    thumbnailPath:
      'https://hoianexpress.com.vn/wp-content/uploads/2021/08/Hue_18-680x500.jpg'
  },
  {
    id: 18,
    tourName: 'Private Tour: THREE-DAY DA LAT FLOWER & WATERFALL CITY',
    reviews: 10,
    rating: 4.8,
    viewCount: 10,
    isPrivate: true,
    minPrice: 1.223,
    duration: 3,
    route: 'florence',
    description: 'Enjoy and have fun in the City',
    thumbnailPath:
      'https://hoianexpress.com.vn/wp-content/uploads/2019/12/hinh-anh-da-lat-5-680x500.jpg'
  }
];

export default TopTours;

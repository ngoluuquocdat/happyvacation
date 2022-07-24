import React, { Component } from 'react';
import axios from "axios";
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';
import ReactLoading from "react-loading";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../../Styles/top-destinations.scss';

class TopDestinations extends Component {

  state = {
    topDestinations: [],
    isLoading: false
  }

  baseUrl = this.props.reduxData.baseUrl;

  componentDidMount = async() => {
    await this.getPlaces();
  }

  handlePlaceSelect = (item) => {
    this.props.history.push(`places/${item.id}`);
  }

  getPlaces = async() => {
    try {
      this.setState({
        isLoading: true,
      });
      let res = await axios.get(`${this.baseUrl}/api/Places?count=6&sort=orders`);
      this.setState({
        topDestinations: res.data
      })
    } catch(e) {
      this.setState({
        topDestinations: topDestinations_temp
      })
    } finally {
      this.setState({
        isLoading: false
      });
    }
  }

  render() {
    const { topDestinations, isLoading } = this.state;
    return (
        <>
          <div className="top-dest-section">
            <h1 className="title">Top Destinations</h1>
            <h3 className="sub-title">See some interesting places you may like!</h3>
            <div className="top-dest-container">
              {
                isLoading ?
                <div className="loading-container">
                  <ReactLoading
                      className="loading-component"
                      type={"spin"}
                      color={"#df385f"}
                      height={40}
                      width={40}
                  />
                </div>
                :
                <ul className="top-dest-list">
                    {
                      topDestinations.map((item) => {
                          return (
                              <li className="top-dest-item" key={item.id} onClick={() => this.handlePlaceSelect(item)}>
                                  <img src={this.baseUrl + item.thumbnailUrl}></img>
                                  <h4 className="item-name">{item.placeName}</h4>
                              </li>
                          )
                      })
                    }
                </ul>
              }
            </div>
          </div>
          <hr className="section-divide-hr" />
        </>
    );
  }
}

const topDestinations_temp = [
    {
        id: 1,
        placeName: 'Da Nang',
        thumbnailPath: 'https://windows10spotlight.com/wp-content/uploads/2021/02/45c195ece73433a3bff0eaa9168b0eed.jpg'
    },
    {
        id: 2,
        placeName: 'Hue',
        thumbnailPath: 'https://owa.bestprice.vn/images/destinations/uploads/kinh-thanh-hue-5ffd6e0fc7d1c.jpg'
    },
    {
        id: 3,
        placeName: 'Hoi An',
        thumbnailPath: 'https://hoianexpress.com.vn/wp-content/uploads/2016/08/BP_2444-740x540.jpg'
    },
    {
        id: 5,
        placeName: 'Ha Noi',
        thumbnailPath: 'https://img4.thuthuatphanmem.vn/uploads/2020/08/27/anh-nen-mua-he-ha-noi_054023198.jpg'
    },
    {
        id: 6,
        placeName: 'Ho Chi Minh',
        thumbnailPath: 'https://hoianexpress.com.vn/wp-content/uploads/2020/03/Nha-tho-Duc-Ba-5-740x540.jpg'
    },
    {
        id: 8,
        placeName: 'Nha Trang',
        thumbnailPath: 'https://haycafe.vn/wp-content/uploads/2022/01/Hinh-anh-thanh-pho-Nha-Trang-dep.jpg'
    },
]



const topCitiesData = [
  {
    id: 1,
    city: 'New York',
    route: 'new-york',
    description: 'Take a bite of the Big Apple',
    url:
      'https://cdn-imgix.headout.com/cities/new-york/images/mobile/morning.jpg?auto=compress&fm=webp&w=412.5&h=486&crop=faces&fit=min'
  },
  {
    id: 2,
    city: 'Las Vegas',
    route: 'las-vegas',
    description: "An offer you can't refuse",
    url:
      'https://cdn-imgix.headout.com/cities/las-vegas/images/mobile/morning.jpg?auto=compress&fm=webp&w=412.5&h=486&crop=faces&fit=min'
  },
  {
    id: 3,
    city: 'Rome',
    route: 'rome',
    description: 'Roam the eternal city',
    url:
      'https://cdn-imgix.headout.com/cities/rome/images/mobile/morning.jpg?auto=compress&fm=webp&w=412.5&h=486&crop=faces&fit=min'
  },
  {
    id: 4,
    city: 'Paris',
    route: 'paris',
    description: "C'est La Vie",
    url:
      'https://cdn-imgix.headout.com/cities/paris/images/mobile/morning.jpg?auto=compress&fm=webp&w=412.5&h=486&crop=faces&fit=min'
  },
  {
    id: 5,
    city: 'London',
    route: 'london',
    description: 'For everything hunky-dory',
    url:
      'https://cdn-imgix.headout.com/cities/london/images/mobile/morning.jpg?auto=compress&fm=webp&w=412.5&h=486&crop=faces&fit=min'
  },
  {
    id: 6,
    city: 'Dubai',
    route: 'dubai',
    description: 'An Oasis like no other',
    url:
      'https://cdn-imgix.headout.com/cities/dubai/images/mobile/morning.jpg?auto=compress&fm=webp&w=412.5&h=486&crop=faces&fit=min'
  },
  {
    id: 7,
    city: 'Barcelona',
    route: 'barcelona',
    description: 'Hacer Peunte a Catalunya',
    url:
      'https://cdn-imgix.headout.com/cities/barcelona/images/mobile/morning.jpg?auto=compress&fm=webp&w=412.5&h=486&crop=faces&fit=min'
  },
  {
    id: 8,
    city: 'Madrid',
    route: 'madrid',
    description: 'Discover the hear of Spain',
    url:
      'https://cdn-imgix.headout.com/cities/madrid/images/mobile/morning.jpg?auto=compress&fm=webp&w=412.5&h=486&crop=faces&fit=min'
  },
  {
    id: 9,
    city: 'Singapore',
    route: 'singapore',
    description: 'The Lion City',
    url:
      'https://cdn-imgix.headout.com/cities/singapore/images/mobile/morning.jpg?auto=compress&fm=webp&w=412.5&h=486&crop=faces&fit=min'
  },
  {
    id: 10,
    city: 'Venice',
    route: 'venice',
    description: 'Enjoy and have fun in the City',
    url:
      'https://cdn-imgix.headout.com/cities/venice/images/mobile/morning.jpg?auto=compress&fm=webp&w=412.5&h=486&crop=faces&fit=min'
  },
  {
    id: 11,
    city: 'Milan',
    route: 'milan',
    description: 'Enjoy and have fun in the City',
    url:
      'https://cdn-imgix.headout.com/cities/milan/images/mobile/morning.jpg?auto=compress&fm=webp&w=412.5&h=486&crop=faces&fit=min'
  },
  {
    id: 12,
    city: 'Naples',
    route: 'naples',
    description: 'Enjoy and have fun in the City',
    url:
      'https://cdn-imgix.headout.com/cities/naples/images/mobile/morning.jpg?auto=compress&fm=webp&w=412.5&h=486&crop=faces&fit=min'
  },
  {
    id: 13,
    city: 'Budapest',
    route: 'budapest',
    description: 'Enjoy and have fun in the City',
    url:
      'https://cdn-imgix.headout.com/cities/budapest/images/mobile/morning.jpg?auto=compress&fm=webp&w=412.5&h=486&crop=faces&fit=min'
  },
  {
    id: 14,
    city: 'Edinburg',
    route: 'edinburg',
    description: 'Enjoy and have fun in the City',
    url:
      'https://cdn-imgix.headout.com/cities/edinburgh/images/mobile/morning.jpg?auto=compress&fm=webp&w=412.5&h=486&crop=faces&fit=min'
  },
  {
    id: 15,
    city: 'Florence',
    route: 'florence',
    description: 'Enjoy and have fun in the City',
    url:
      'https://cdn-imgix.headout.com/cities/florence/images/mobile/morning.jpg?auto=compress&fm=webp&w=412.5&h=486&crop=faces&fit=min'
  }
];

const mapStateToProps = (state) => {
  return {
      reduxData: state,
  };
};

export default connect(mapStateToProps)(withRouter(TopDestinations));

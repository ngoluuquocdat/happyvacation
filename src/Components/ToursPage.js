import React from 'react';
import Header from './Header/Header'
import TourCard from './TourCard'
import '../Styles/tours-page.scss'
import { withRouter } from 'react-router-dom';
import { Pagination } from '@mui/material';

class ToursPage extends React.Component {

    state = {
        tours: [],
        totalPage: 2,
        totalCount: 18,
        page: 1,
        perPage: 12,
        // initialize filter froom props
      }
    
    filter = this.props.location.state ? this.props.location.state.filter :  {
      selectedPlace: null,
      startDate: new Date(),
      endDate: new Date(),
      keyword: '',
      priceRange: [0, 3000],
      selectedCategories: [],
      isPrivate: false
    }

    componentDidMount() {
        const {page, perPage} = this.state;
        // call api to get tours and set state
        const request = {
          ...this.filter,
          page: page,
          perPage: perPage
        }
        console.log('request to api', request)
        // fake api response
        const resTours = listTours.slice((page-1)*perPage, (page-1)*perPage+perPage);
        this.setState({
            tours: resTours,
        })
    }

    componentDidUpdate (prevProps, prevState) {
      // if get a new filter, fetch api with the new filter
      // and set 'page' to 1
      // 
      //if (this.filter !== this.props.location.state.filter)
      if(prevProps.location.key !== this.props.location.key)
      {
        // reset the filter
        this.filter = this.props.location.state.filter;

        //console.log('Your tour filter in tour page update: ', this.filter);
        const {perPage} = this.state;
         // call api to get tours and set state
         const request = {
          ...this.filter,
          page: 1,
          perPage: perPage
        }
        console.log('request to api', request)
         // fake api response
        const resTours = listTours.slice(0, perPage);
        this.setState({
            tours: resTours,
            page: 1
        })
        return;
      }       
      if(prevState.page !== this.state.page && this.state.page !== 1) {
        const {page, perPage} = this.state;
        //console.log('page in state update', page)
         // call api to get tours and set state
          const request = {
            ...this.filter,
            page: page,
            perPage: perPage
          }
        console.log('request to api', request)
         // fake api response
        const resTours = listTours.slice((page-1)*perPage, (page-1)*perPage+perPage);
        const resToursFake = listTours.slice(1, 12);
        this.setState({
            tours: resTours,
        })
      }
      

      const element = document.getElementById('tour-page-container');
      element.scrollIntoView({behavior: 'smooth'});
    }

    handleOnChangePage = (event, page) => {
      this.setState({
        page: page
      })
    }
 
    
    render() {
        const { tours, totalCount, page, totalPage } = this.state;
        // let selectedPlace = this.props.location.state ? this.props.location.state.filter.selectedPlace : null;
        const filter = this.filter;
        // let selectedPlace = null;
        // if(this.props.location.state) {
        //   selectedPlace =this.props.location.state.filter.selectedPlace
        // }
        const selectedPlace = filter.selectedPlace;
        return (
            <div className="App">
              <Header filter={filter} isSmall={true}/>
                {/* check if list tours empty here */}
                <div className="tour-page-container" id="tour-page-container">
                  {
                    // if selectedPlace not null or empty
                    selectedPlace&&!(Object.keys(selectedPlace).length === 0 && selectedPlace.prototype === Object) ?
                    <h3 className="result-text">{selectedPlace.placeName}: {totalCount} tours found!</h3>
                    :
                    <h3 className="result-text"> {totalCount} tours found!</h3>
                  }
                    <div className="list-tours">
                        {
                            tours.map((item) => {
                                return (
                                    <TourCard tour={item} key={item.id} isSlideItem={false}/>
                                )
                            })
                        }
                    </div>
                    {
                        totalPage > 1 &&
                        <div className="pagination-container">
                          <Pagination 
                            count={totalPage} 
                            shape="rounded" 
                            siblingCount={1}
                            page={this.state.page}
                            onChange={(event, page) => this.handleOnChangePage(event, page)}
                          />
                        </div>
                    }
                </div>
            </div>
        )
    }
}

const listTours = [
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

// Caraousel Images for Home
const backgroundImagesData = [
    {
      id: 1,
      url:
        'https://hoianexpress.com.vn/wp-content/uploads/2019/10/BP_3242-Edit.jpg'
    },
    {
      id: 2,
      url:
        'https://hoianexpress.com.vn/wp-content/uploads/2020/03/slide4-1.jpg'
    }
  ];

// Header Navigation Data
const HeaderNavData = [
    {
      id: 1,
      name: 'Headout Picks'
    },
    {
      id: 2,
      name: 'Best Sellers'
    },
    {
      id: 3,
      name: 'Abu Dhabi City Tours'
    },
    {
      id: 4,
      name: 'Amsterdam Attractions'
    },
    {
      id: 5,
      name: 'Burj Khalifa'
    }
  ];

export default withRouter(ToursPage);
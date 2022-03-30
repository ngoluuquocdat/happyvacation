import React from 'react'
import HeaderNav from './Header/HeaderNav';
import TopTours from './HomePage/TopTours';
import TourCard from './TourCard';
import { withRouter } from 'react-router-dom'
import { Pagination } from "@mui/material";
import { FaCaretDown } from 'react-icons/fa';
import { FiStar } from 'react-icons/fi'
import { HiOutlineMail, HiOutlinePhone } from 'react-icons/hi'
import { GrLocation } from 'react-icons/gr';

import '../Styles/provider-page.scss'

class ProviderPage extends React.Component {

    state = {
        provider: {},
        tours: [],
        totalPage: 2,
        totalCount: 18,
        page: 1,
        perPage: 8,
        sort: 'latest',
        isShowSortMenu: false
    }

    componentDidMount() {
        // call api to get providers     
        const providerId = this.props.match.params.id;
        console.log(`GET providers/${providerId}`);
        //fake api response
        const resProvider = provider;

        // call api to get tours
        const { page, perPage, sort } = this.state;
        console.log(`GET providers/${providerId}/tours?page=1&perPage=${perPage}&sort=latest`)
        // fake api response
        const resTours = listTours.slice(0, perPage);

        // set state`   
        this.setState({
            tours: resTours,
            provider: resProvider,
        }); 
    }

    componentDidUpdate(prevProps, prevState) { 
        const providerId = this.props.match.params.id;
        // when page change
        if(prevState.page !== this.state.page && prevState.tours === this.state.tours) {
            const { page, perPage, sort } = this.state;
            // call api to get tours and set state
            console.log(`GET providers/${providerId}/tours?page=${page}&perPage=${perPage}&sort=${sort}`);
            // fake api response
            const resTours = listTours.slice((page - 1) * perPage, (page - 1) * perPage + perPage);
            this.setState({
                tours: resTours
            });   
        }
        // when sort option change 
        if(prevState.sort !== this.state.sort) {
            const { perPage, sort } = this.state;
            // call api to get tours and set state
            console.log(`GET providers/${providerId}/tours?page=1&perPage=${perPage}&sort=${sort}`);
            // fake api response
            const resTours = listTours.slice(0, perPage);
            this.setState({
                tours: resTours,
                page: 1,
            });
        }
    }

    // toggle sort menu
    handleToggleSortMenu = () => {
        const isShowSortMenu = this.state.isShowSortMenu;
        this.setState({
            isShowSortMenu: !isShowSortMenu
        })
    }

    // change sort option
    handleSortOptionChange = (event) => {
        this.setState({
            sort: event.target.value,
            isShowSortMenu: false
        })
    }

      // change page
    handleOnChangePage = (event, page) => {
        this.setState({
            page: page,
        });
    };

    render() {
        const providerId = this.props.match.params.id;
        const { tours, provider, totalCount, page, totalPage } = this.state;
        const isToursEmtpy = provider.tourAvailable === 0;
        const {sort, isShowSortMenu} = this.state;
        const url = `url('${provider.thumbnailPath}')`;

        return (
            <div className="App">
                <div className="small-header">
                    <HeaderNav />
                </div>
                <div className="provider-page-container">
                    <div className="provider-section">
                        <div className="provider-section-left">
                            <div className="provider-avatar" style={{backgroundImage: url}} />
                        </div>
                        <div className='provider-section-right'>
                            <h2 className='provider-name'>{provider.name}</h2>
                            <div className='provider-info'>
                                <div className='provider-main-info'>
                                    <div className='info-item'>
                                        <HiOutlineMail/>
                                        <div className="group">
                                            Member Since:
                                            <span className="content">{provider.dateCreated}</span>
                                        </div>
                                    </div>
                                    <div className='info-item'>
                                        <FiStar/>
                                        <div className="group">
                                            Average Rating:
                                            <span className="content">{provider.averageRating}</span>
                                        </div>
                                    </div>
                                    <div className='info-item'>
                                        <HiOutlineMail/>
                                        <div className="group">
                                            Available:
                                            <span className="content">{provider.tourAvailable} tours</span>
                                        </div>
                                    </div>                               
                                </div>
                                <div className='provider-contact-info'>
                                    <div className='info-item'>
                                        <HiOutlineMail/>
                                        <div className="group">
                                            Email:
                                            <span className="content">{provider.email}</span>
                                        </div>
                                    </div>
                                    <div className='info-item'>
                                        <HiOutlinePhone/>
                                        <div className="group">
                                            Phone:
                                            <span className="content">{provider.phone}</span>
                                        </div>
                                    </div>
                                    <div className='info-item'>
                                        <GrLocation/>
                                        <div className="group">
                                            Address:
                                            <p className="content">{provider.address}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr className="section-divide-hr"></hr>
                    {
                        isToursEmtpy ?
                        <div>This provider doesn't have any available tour now...</div>
                        :
                        <>
                            <TopTours isSmall={true} providerId={providerId}/>
                            <hr className="section-divide-hr"></hr>
                            <div className="available-tours-section">
                                <div className="header">
                                    <h3 className="title">Available Tours</h3>
                                    <div className="sort-container">
                                        <span className="sort-btn" onClick={this.handleToggleSortMenu}>Sort <FaCaretDown /></span>
                                        {
                                            isShowSortMenu &&
                                            <div className="sort-option-list">
                                                <h3 className="sort-title">SORT BY</h3>
                                                <form className="sort-form">
                                                    <span className="sort-sub-title">New Tours</span>
                                                    <div className="sort-form-group">
                                                    <input 
                                                        type="radio" 
                                                        id="latest"  
                                                        name="sort"
                                                        value="latest"
                                                        checked={sort==='latest'}
                                                        onChange={(event) => this.handleSortOptionChange(event)}
                                                    />
                                                    <label htmlFor="latest">Latest</label>
                                                    </div>
                                                    <span className="sort-sub-title">Price</span>
                                                    <div className="sort-form-group">
                                                    <input 
                                                        type="radio" 
                                                        id="price-up"  
                                                        name="sort"
                                                        value="price-up"
                                                        checked={sort==='price-up'}
                                                        onChange={(event) => this.handleSortOptionChange(event)}
                                                    />
                                                    <label htmlFor="price-up">Low to High</label>
                                                    </div>
                                                    <div className="sort-form-group">
                                                    <input 
                                                        type="radio" 
                                                        id="price-down" 
                                                        name="sort"
                                                        value="price-down" 
                                                        checked={sort==='price-down'}
                                                        onChange={(event) => this.handleSortOptionChange(event)}
                                                    />
                                                    <label htmlFor="price-down">High to Low</label>
                                                    </div>
                                                    <span className="sort-sub-title">Rating</span>
                                                    <div className="sort-form-group">
                                                    <input 
                                                        type="radio" 
                                                        id="rating"  
                                                        name="sort"
                                                        value="rating"
                                                        checked={sort==='rating'}
                                                        onChange={(event) => this.handleSortOptionChange(event)}
                                                    />
                                                    <label htmlFor="rating">Highest</label>
                                                    </div>
                                                </form>
                                            </div>
                                        }
                                    </div>
                                </div>
                                <div className="list-tours">
                                    {tours.map((item) => {
                                        return <TourCard tour={item} key={item.id} isSlideItem={false} />;
                                    })}
                                </div>
                                {
                                    totalPage > 1 && (
                                    <div className="pagination-container">
                                        <Pagination
                                            count={totalPage}
                                            shape="rounded"
                                            siblingCount={1}
                                            page={page}
                                            onChange={(event, page) => this.handleOnChangePage(event, page)}
                                        />
                                    </div>
                                )}
                            </div>
                        </>
                    }
                </div>
            </div>
        )
    }
}

const provider = {
    id: 1,
    name: 'Hoi An Express',
    phone: '0905123456',
    email: 'info@hoianexpress.com.vn',
    address: '32 Tien Giang St, Tan Binh, Ho Chi Minh City, Viet Nam',
    dateCreated: '28/03/2022',
    averageRating: 4.4,
    tourAvailable: 180,
    description: '',
    thumbnailPath: 'https://pbs.twimg.com/profile_images/721952678016737280/ppDehV3R_400x400.jpg'
}

const listTours = [
    {
      id: 1,
      tourName: "FULL-DAY HAI VAN PASS & LANG CO BEACH & IN HUE CITY",
      reviews: 10,
      rating: 4.8,
      viewCount: 10,
      isPrivate: false,
      minPrice: 384,
      duration: 1,
      route: "london",
      description: "For everything hunky-dory",
      thumbnailPath:
        "https://hoianexpress.com.vn/wp-content/uploads/2019/12/LANG-CO-BEACH-10.jpg",
    },
    {
      id: 2,
      tourName:
        "HALF-DAY FOODIE TOUR BY BICYCLE & VISIT TRA QUE VEGETABLE VILLAGE",
      reviews: 10,
      rating: 4.4,
      viewCount: 10,
      isPrivate: false,
      minPrice: 45,
      duration: 0.5,
      route: "las-vegas",
      description: "An offer you can't refuse",
      thumbnailPath:
        "https://hoianexpress.com.vn/wp-content/uploads/2019/12/Foodie_11-680x500.jpg",
    },
    {
      id: 3,
      tourName: "HOI AN MYSTERIOUS NIGHT TOUR WITH DINNER FROM DA NANG",
      reviews: 10,
      rating: 3.8,
      viewCount: 10,
      isPrivate: true,
      minPrice: 46,
      duration: 0.16666666,
      route: "rome",
      description: "Roam the eternal city",
      thumbnailPath:
        "https://hoianexpress.com.vn/wp-content/uploads/2019/12/1-25-870x555.jpg",
    },
    {
      id: 4,
      tourName: "HOI AN COUNTRYSIDE ADVENTURE BY ELECTRIC SCOOTER",
      reviews: 10,
      rating: 4.2,
      viewCount: 10,
      isPrivate: false,
      minPrice: 62,
      duration: 0.5,
      route: "paris",
      description: "C'est La Vie",
      thumbnailPath:
        "https://hoianexpress.com.vn/wp-content/uploads/2019/12/1-Briefing-Hoi-An-Town-6-870x555.jpg",
    },
    {
      id: 5,
      tourName: "Private Tour: FULL-DAY GOLF TOUR FROM HA NOI",
      reviews: 10,
      rating: 4.6,
      viewCount: 10,
      isPrivate: true,
      minPrice: 100,
      duration: 0.33333333,
      route: "new-york",
      description: "Take a bite of the Big Apple",
      thumbnailPath:
        "https://hoianexpress.com.vn/wp-content/uploads/2019/12/GOLF_6-680x500.jpg",
    },
    {
      id: 6,
      tourName: "13 DAYS AUTHENTIC VIETNAM PLUS GOLDEN BRIDGE",
      reviews: 10,
      rating: 4.6,
      viewCount: 10,
      isPrivate: false,
      minPrice: 200,
      duration: 13,
      thumbnailPath:
        "https://hoianexpress.com.vn/wp-content/uploads/2019/12/GBS0056_13days9-680x500.jpg",
    },
    {
      id: 7,
      tourName:
        "HALF-DAY FOODIE TOUR BY BICYCLE & VISIT TRA QUE VEGETABLE VILLAGE",
      reviews: 10,
      rating: 4.4,
      viewCount: 10,
      isPrivate: true,
      minPrice: 32,
      duration: 0.5,
      thumbnailPath:
        "https://hoianexpress.com.vn/wp-content/uploads/2019/12/Hoi-An-Food-tour-by-bike-_7-1-680x500.jpg",
    },
    {
      id: 8,
      tourName: "HALF-DAY DA NANG MUSEUMS AND BRIDGES TOUR",
      reviews: 10,
      rating: 4.8,
      viewCount: 10,
      isPrivate: false,
      minPrice: 35,
      duration: 0.5,
      thumbnailPath:
        "https://hoianexpress.com.vn/wp-content/uploads/2019/12/HCM-MUSEUM_49-680x500.jpg",
    },
    {
      id: 9,
      tourName: "FULL-DAY DMZ TOUR FROM HUE CITY",
      reviews: 10,
      rating: 4.8,
      viewCount: 10,
      isPrivate: false,
      minPrice: 89,
      duration: 1,
      thumbnailPath:
        "https://hoianexpress.com.vn/wp-content/uploads/2021/06/1-680x500.jpg",
    },
    {
      id: 10,
      tourName: "BA NA HILLS AND GOLDEN BRIDGE FROM CHAN MAY PORT",
      reviews: 10,
      rating: 4.2,
      viewCount: 10,
      isPrivate: false,
      minPrice: 100,
      duration: 0.29166666,
      thumbnailPath:
        "https://hoianexpress.com.vn/wp-content/uploads/2019/12/BA-NA-HILLS_44-1-680x500.jpg",
    },
    {
      id: 11,
      tourName: "Private Tour: HUE HERITAGE",
      reviews: 10,
      rating: 3.8,
      viewCount: 10,
      isPrivate: true,
      minPrice: 1.043,
      duration: 2,
      thumbnailPath:
        "https://hoianexpress.com.vn/wp-content/uploads/2019/12/HUE-CITY-_6-680x500.jpg",
    },
    {
      id: 12,
      tourName: "FOOD TOUR IN HUE CITY",
      reviews: 10,
      rating: 4.4,
      viewCount: 10,
      isPrivate: true,
      minPrice: 162,
      duration: 0.16666666,
      thumbnailPath:
        "https://hoianexpress.com.vn/wp-content/uploads/2021/08/Food-Tour-Hue_4-680x500.jpg",
    },
    {
      id: 13,
      tourName: "FOOD TOUR IN HUE CITY",
      reviews: 10,
      rating: 4.8,
      viewCount: 10,
      isPrivate: false,
      minPrice: 63,
      duration: 2,
      thumbnailPath:
        "https://hoianexpress.com.vn/wp-content/uploads/2021/06/dnp-Top-10-mon-an-vat-ngon-nhat-o-hue-banh-be%CC%80o-870x555.jpeg",
    },
    {
      id: 14,
      tourName: "HOIANIAN’S BELIEFS AND VEGETARIAN DINNER FROM HOI AN",
      reviews: 10,
      rating: 3.8,
      viewCount: 10,
      isPrivate: true,
      minPrice: 46,
      duration: 0.16666666,
      thumbnailPath:
        "https://cdn-imgix.headout.com/cities/edinburgh/images/mobile/morning.jpg?auto=compress&fm=webp&w=412.5&h=486&crop=faces&fit=min",
    },
    {
      id: 15,
      tourName: "FULL-DAY HUE CITY TOUR & CRAFT VILLAGES",
      reviews: 10,
      rating: 4.8,
      viewCount: 10,
      isPrivate: false,
      minPrice: 79,
      duration: 2,
      thumbnailPath:
        "https://hoianexpress.com.vn/wp-content/uploads/2021/06/Screen-Shot-2021-05-23-at-08.47.26-680x500.png",
    },
    {
      id: 16,
      tourName: "Private Tour: HALF-DAY COUNTRYSIDE BY BICYCLE FROM HUE CITY",
      reviews: 10,
      rating: 4.8,
      viewCount: 10,
      isPrivate: true,
      minPrice: 174,
      duration: 0.16666666,
      thumbnailPath:
        "https://hoianexpress.com.vn/wp-content/uploads/2021/08/Food-Tour-Hue_5-680x500.jpg",
    },
    {
      id: 17,
      tourName: "Private Tour: FULL-DAY HUE CITY TOUR & CRAFT VILLAGES",
      reviews: 10,
      rating: 4.8,
      viewCount: 10,
      isPrivate: true,
      minPrice: 307,
      duration: 1,
      route: "florence",
      description: "Enjoy and have fun in the City",
      thumbnailPath:
        "https://hoianexpress.com.vn/wp-content/uploads/2021/08/Hue_18-680x500.jpg",
    },
    {
      id: 18,
      tourName: "Private Tour: THREE-DAY DA LAT FLOWER & WATERFALL CITY",
      reviews: 10,
      rating: 4.8,
      viewCount: 10,
      isPrivate: true,
      minPrice: 1.223,
      duration: 3,
      route: "florence",
      description: "Enjoy and have fun in the City",
      thumbnailPath:
        "https://hoianexpress.com.vn/wp-content/uploads/2019/12/hinh-anh-da-lat-5-680x500.jpg",
    },
];

export default withRouter(ProviderPage)
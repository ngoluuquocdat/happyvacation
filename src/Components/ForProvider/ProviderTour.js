import React from 'react'
import { toast } from 'react-toastify';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import ReactLoading from "react-loading";
import { BsArrowDown, BsArrowUp } from 'react-icons/bs';
import { Pagination } from "@mui/material";
import '../../Styles/ForProvider/provider-tour.scss'
import TourCardManage from './TourCardManage';

class ProviderTour extends React.Component {

    state = {
        places: [],
        categories:  [],

        tours: [],
        totalPage: 2,
        totalCount: 0,
        sort: 'latest',
        page: 1,
        perPage: 3,
        tourId: '',
        tourName: '',
        selectedCategories: [],
        selectedPlaces: [],
        checkedCategoryStates: [],
        checkedPlaceStates: [],
        showListPlace: false,
        showListCate: false, 
        priceArrow: '',
        ratingArrow: '',
        ordersArrow: '',
        isLoading: false
    }

    // listPlaces = [];
    // categories =  [];
    baseUrl = this.props.reduxData.baseUrl;

    getCategories = async() => {
        try {
            let res = await axios.get(`${this.baseUrl}/api/Tours/categories`);
            let checkedCategoryStates = new Array(res.data.length).fill(false);
            this.setState({
                categories: res.data,
                checkedCategoryStates:  checkedCategoryStates,
            }) 
        } catch (error) {
            if (!error.response) {
                toast.error("Network error!");            
            } 
        }
    }

    // get places
    getPlaces = async() => {
        try {
          let res = await axios.get(`${this.baseUrl}/api/Places`);
          let checkedPlaceStates = new Array(res.data.length).fill(false);
          this.setState({
                places: res.data,
                checkedPlaceStates: checkedPlaceStates
          }) 
        } catch (error) {
            if (!error.response) {
                toast.error("Network error!");       
            } 
        }
    }

    async getTours(token, tourId, tourName, selectedPlaces, selectedCategories, sort, page, perPage) {
        try {          
            this.setState({
                isLoading: true,
            });            
            var params = new URLSearchParams();
            params.append("tourId", tourId);
            params.append("tourName", tourName);
            selectedPlaces.forEach((item) => {
                params.append("placeIds", item.id);
            });
            selectedCategories.forEach((item) => {
                params.append("categoryIds", item.id);
            });
            params.append("sort", sort);
            params.append("page", page);
            params.append("perPage", perPage);

            let res = await axios.get(
                `${this.baseUrl}/api/Providers/me/tours`,
                {
                    headers: { Authorization:`Bearer ${token}` },
                    params: params,
                }
            );          
            // console.log(res);            
            // set state
            this.setState({
                totalPage: res.data.totalPage,
                totalCount: res.data.totalCount,
                tours: res.data.items                
            })
        } catch (error) {
            if (!error.response) {
                toast.error("Network error");
                console.log(error)
                //fake api response
                const resTours = tours_temp;
                // set state`   
                this.setState({
                    tours: resTours
                }); 
                return;
            }
            if (error.response.status === 400) {
                console.log(error)
            }
            if (error.response.status === 401) {
                console.log(error);
                // redirect to login page or show notification
                this.props.history.push('/login', {prevPath: this.props.location.pathname});
            }
            if (error.response.status === 403) {
                console.log(error);
                // redirect to login page or show notification
                this.props.history.push('/login', {prevPath: this.props.location.pathname});
            }
        } finally {
            this.setState({
                isLoading: false
            })
        }        
    }

    async componentDidMount() {
        // check jwt token
        const token = localStorage.getItem('user-token');
        if(!token) {
            this.props.history.push('/login', {prevPath: this.props.location.pathname});
        }
        // call api to get list categories, list places
        await this.getCategories();
        await this.getPlaces();
        // // fake api response
        // const resCategories = categories_temp;
        // const resPlaces = listPlaces;
        // // set the checked states
        // var checkedCategoryStates;
        // var checkedPlaceStates;
        // checkedCategoryStates = new Array(resCategories.length).fill(false);
        // checkedPlaceStates = new Array(resPlaces.length).fill(false);
        // this.categories = resCategories;
        // this.listPlaces = resPlaces;
        // this.setState({          
        //     checkedCategoryStates:  checkedCategoryStates,
        //     checkedPlaceStates: checkedPlaceStates
        // })
        
        // call api to get provider's tours
        let { tourId, tourName, selectedPlaces, selectedCategories, sort, page, perPage } = this.state;
        tourId = tourId !== '' ? tourId : 0;
        this.getTours(token, tourId, tourName, selectedPlaces, selectedCategories, sort, page, perPage)
    }

    async componentDidUpdate(prevProps, prevState) {
        // check jwt token
        const token = localStorage.getItem('user-token');
        if(!token) {
            this.props.history.push('/login', {prevPath: this.props.location.pathname});
        }
        
        // when sort option change
        if (prevState.sort !== this.state.sort) {
            // call api to get provider's tours
            let { tourId, tourName, selectedPlaces, selectedCategories, sort, page, perPage } = this.state;
            tourId = tourId !== '' ? tourId : 0;
            this.getTours(token, tourId, tourName, selectedPlaces, selectedCategories, sort, page, perPage);
        }

        // when page change
        if (prevState.page !== this.state.page) {
            // call api to get orders and set state
            let { tourId, tourName, selectedPlaces, selectedCategories, sort, page, perPage } = this.state;
            tourId = tourId !== '' ? tourId : 0;
            this.getTours(token, tourId, tourName, selectedPlaces, selectedCategories, sort, page, perPage);           
        }
    } 

    // change page
    handleOnChangePage = (event, page) => {
        this.setState({
            page: page,
        });
    };

    // handle input change
    inputChange = (event) => {
        const key = event.target.name;
        this.setState({
            [key]: event.target.value
        })
    }

    // click places toggle
    togglePlaces = () => {
        const showListPlace = this.state.showListPlace;
        this.setState({
            showListPlace: !showListPlace
        })
    }

    // click categories toggle
    toggleCategories = () => {
        const showListCate = this.state.showListCate;
        this.setState({
            showListCate: !showListCate
        })
    }

    // handle place checkbox click
    handlePlaceSelect = (event, item, index) => {
        const isChecked = event.target.checked;
        // set state checkedPlaceStates
        const checkedPlaceStates = this.state.checkedPlaceStates;
        checkedPlaceStates[index] = isChecked;
        this.setState({
            checkedPlaceStates: checkedPlaceStates
        })
        // add or remove place item in filter
        const selectedPlaces = this.state.selectedPlaces;
        if(isChecked) {
            this.setState({
                selectedPlaces: [...selectedPlaces, item]           
            })
        } else {
            this.setState({
                selectedPlaces: selectedPlaces.filter((element) => element.id !== item.id)
            })
        }
    }

    // handle category checkbox click
    handleCategorySelect = (event, item, index) => {
        const isChecked = event.target.checked;
        // set state checked category States
        const checkedCategoryStates = this.state.checkedCategoryStates;
        checkedCategoryStates[index] = isChecked;
        this.setState({
            checkedCategoryStates: checkedCategoryStates
        })
        // add or remove category item in filter
        const selectedCategories = this.state.selectedCategories;
        if(isChecked) {
            this.setState({
                selectedCategories: [...selectedCategories, item]           
            })
        } else {
            this.setState({
                selectedCategories: selectedCategories.filter((element) => element.id !== item.id)
            })
        }
    }

    // handle search tour click
    searchTour = () => {
        const token = localStorage.getItem('user-token');
        if(!token) {
            this.props.history.push('/login', {prevPath: this.props.location.pathname});
            return;
        }
        let { tourId, tourName, selectedPlaces, selectedCategories, sort, page, perPage } = this.state;
        tourId = tourId !== '' ? tourId : 0;
        this.getTours(token, tourId, tourName, selectedPlaces, selectedCategories, sort, page, perPage)
    }

    // handle reset search tour
    resetSearch = () => {
        this.setState({
            tourId: '',
            tourName: '',
            selectedCategories: [],
            selectedPlaces: [],
            checkedCategoryStates: new Array(this.state.categories.length).fill(false),
            checkedPlaceStates: new Array(this.state.places.length).fill(false)
        })
    }

    // change providing state
    changeProvidingState = async (tourId) => {
        const token = localStorage.getItem('user-token');
        if(!token) {
            this.props.history.push('/login', {prevPath: this.props.location.pathname});
        }
        // post to api
        try {
            let res = await axios.put(
                `${this.baseUrl}/api/Tours/${tourId}/providingState`,
                {
                    state: 'providingState'
                },
                {
                    headers: { Authorization:`Bearer ${token}` }
                }
            );  

            // set state with updated order
            const index = this.state.tours.findIndex((element) => element.id === res.data.id);
            let tours = this.state.tours;
            tours[index] = res.data
            this.setState({
                tours: tours
            })     
            // show toast notify
            
        } catch (error) {
            if (!error.response) {
                console.log(error)
                toast.error("Network error");
                return;
            }
            if (error.response.status === 401) {
                toast.error("Login to continue");
                console.log(error)
                this.props.history.push('/login', {prevPath: this.props.location.pathname});
            }
            if (error.response.status === 403) {
                toast.error("Not allowed");
                // redirect to provider register page or show notification
                this.props.history.push('/login', {prevPath: this.props.location.pathname});
            }
        } finally {
            this.setState({
                isCreating: false
            })
        }
    }

    // change sort option
    changeSortOption = (event) => {
        // clear all arrow
        this.setState({
            priceArrow: '',
            ratingArrow: '',
            ordersArrow: '',
        })
        const key = event.target.id;
        const arrowKey = `${key}Arrow`;
        let arrowValue = this.state[arrowKey];
        let newArrowValue = '';
        if(arrowValue === '') {
            newArrowValue='up';
        }
        if(arrowValue === 'up') {
            newArrowValue = 'down';
        }
        this.setState({
            [arrowKey]: newArrowValue,
            sort: newArrowValue === '' ? 'latest' : `${key}-${newArrowValue}`
        })
    }



    render() {
        const { tours, page, totalPage, totalCount, isLoading } = this.state;
        const { tourId, tourName } = this.state;
        const { categories, places, selectedPlaces, selectedCategories } = this.state;
        const { checkedCategoryStates, checkedPlaceStates } = this.state;
        const { showListPlace, showListCate } = this.state;
        const { priceArrow, ratingArrow, ordersArrow } = this.state;

        return (
            <div className='provider-tour-container'>
                <div className='provider-tour-header'>
                    <div className='title'>Tours management</div>
                    <div className='sub-title'>See and management tours of your company</div>
                </div>
                <div className='search-area'>
                    <div className='search-area-upper'>
                        <div className='search-group'>
                            <span className='search-label'>Tour ID: </span>
                            <input className='search-input' name='tourId' placeholder='Type here' value={tourId} onChange={this.inputChange}/>
                        </div>
                        <div className='search-group'>
                            <span className='search-label'>Tour Name: </span>
                            <input className='search-input name' name='tourName' placeholder='Type here' value={tourName} onChange={this.inputChange}/>
                        </div>
                    </div>
                    <div className='search-area-below'>
                        <div className='search-group'>
                            <span className='search-label'>Tourist sites: </span>
                            <span className='drop-down-holder' onClick={this.togglePlaces}>
                                {
                                    selectedPlaces.length > 0 ?
                                    selectedPlaces.map(item => item.placeName+', ')
                                    :
                                    'Select'
                                }
                            </span>
                            {
                                showListPlace &&
                                <div className='drop-down-list'>
                                    {
                                        places.map((item, index) => {
                                            return (
                                                <div key={'place'+item.id} className='drop-down-item'>
                                                    <input 
                                                        type="checkbox" 
                                                        id={'place'+item.id} 
                                                        value={item.placeName} 
                                                        checked={checkedPlaceStates[index]}
                                                        onChange={(event) => this.handlePlaceSelect(event, item, index)}
                                                    />
                                                    <label htmlFor={'place'+item.id}>{item.placeName}</label>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            }
                        </div>
                        <div className='search-group'>
                            <span className='search-label'>Categories: </span>
                            <span className='drop-down-holder' onClick={this.toggleCategories}>
                                {
                                    selectedCategories.length > 0 ?
                                    selectedCategories.map(item => item.categoryName+', ')
                                    :
                                    'Select'
                                }
                            </span>
                            {
                                showListCate &&
                                <div className='drop-down-list category'>
                                    {
                                        categories.map((item, index) => {
                                            return (
                                                <div key={'category'+item.id} className='drop-down-item'>
                                                    <input 
                                                        type="checkbox" 
                                                        id={'category'+item.id} 
                                                        value={item.categoryName} 
                                                        checked={checkedCategoryStates[index]}
                                                        onChange={(event) => this.handleCategorySelect(event, item, index)}
                                                    />
                                                    <label htmlFor={'category'+item.id}>{item.categoryName}</label>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            }
                        </div>
                    </div>
                    <div className='button-area'>
                        <button className='btn-search' onClick={this.searchTour}>Search</button>
                        <button className='btn-reset' onClick={this.resetSearch}>Reset</button>
                    </div>
                </div>
                <div className='provider-tour-body'>
                    <div className='list-tour-wrap'>
                        <div className='tour-number'>
                            {
                                isLoading ? ' ' : (totalCount > 1 ? `${totalCount} Tours` : `${totalCount} Tour`)
                            }                       
                        </div>
                        <div className='list-tour'>
                            <div className='list-tour-header'>
                                <div className='list-tour-header-item tour-id'>ID</div>
                                <div className='list-tour-header-item tour-name'>Tour Name</div>
                                <div className='list-tour-header-item sites'>Sites</div>
                                <div className='list-tour-header-item categories'>Categories</div>
                                <div className='list-tour-header-item tour-price' id='price' onClick={this.changeSortOption}>
                                    Price &nbsp;
                                    {
                                        priceArrow == 'down' &&
                                        <BsArrowDown className='arrow-icon' />
                                    }
                                    {
                                        priceArrow == 'up' &&
                                        <BsArrowUp className='arrow-icon'/>
                                    }
                                </div>
                                <div className='list-tour-header-item rating' id='rating' onClick={this.changeSortOption}>
                                    Rating
                                    {
                                        ratingArrow == 'down' &&
                                        <BsArrowDown className='arrow-icon'/>
                                    }
                                    {
                                        ratingArrow == 'up' &&
                                        <BsArrowUp className='arrow-icon'/>
                                    }
                                </div>
                                <div className='list-tour-header-item orders' id='orders' onClick={this.changeSortOption}>
                                    Orders &nbsp;
                                    {
                                        ordersArrow == 'down' &&
                                        <BsArrowDown className='arrow-icon'/>
                                    }
                                    {
                                        ordersArrow == 'up' &&
                                        <BsArrowUp className='arrow-icon'/>
                                    }
                                </div>
                                <div className='list-tour-header-item tour-action'>Action</div>
                            </div>
                            <div className='list-tour-content'>
                                {
                                    isLoading && 
                                    <div className="loading-container">
                                        <ReactLoading
                                            className="loading-component"
                                            type={"spin"}
                                            color={"#df385f"}
                                            height={50}
                                            width={50}
                                        />
                                    </div>
                                }
                                {
                                    tours.map((item) => {
                                        return (
                                            <TourCardManage key={'tour'+item.id} tour={item} changeProvidingState={this.changeProvidingState}/>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
                {totalPage > 1 && (
                    <div className="pagination-container">
                        <Pagination
                            count={totalPage}
                            shape="rounded"
                            siblingCount={1}
                            page={page}
                            onChange={(event, page) =>
                                this.handleOnChangePage(event, page)
                            }
                        />
                    </div>
                )}
            </div>
        )
    }
}

const tours_temp = []

const listPlaces = [
    { id: 1, placeName: 'Da Nang' },
    { id: 2, placeName: 'Hue' },
    { id: 3, placeName: 'Hoi An' },
    { id: 4, placeName: 'Ha Long' },
    { id: 5, placeName: 'Ha Noi' },
    { id: 6, placeName: 'Ho Chi Minh' },
    { id: 7, placeName: 'Da Lat' },
    { id: 8, placeName: 'Nha Trang' },
    { id: 9, placeName: 'Phu Quoc' },
    { id: 10, placeName: 'Quy Nhon' },
    { id: 11, placeName: 'Sa Pa' },
    { id: 12, placeName: 'Vung Tau' },
    { id: 13, placeName: 'Mui Ne' },
    { id: 14, placeName: 'Con Dao' },
    { id: 15, placeName: 'Trang An' }
];

const categories_temp = [
    { id: 1, categoryName: 'adventure tour' },
    { id: 2, categoryName: 'artistic tour' },
    { id: 3, categoryName: 'beach tour' },
    { id: 4, categoryName: 'biking tour' },
    { id: 5, categoryName: 'boating tour' },
    { id: 6, categoryName: 'camping' },
    { id: 7, categoryName: 'classic tour' },
    { id: 8, categoryName: 'cooking tour' },
    { id: 9, categoryName: 'craft tour' },
    { id: 10, categoryName: 'cruises' },
    { id: 11, categoryName: 'culinary tour' },
    { id: 12, categoryName: 'cultural tour' },
    { id: 13, categoryName: 'discovery tour' },
    { id: 14, categoryName: 'fishing tour' },
    { id: 15, categoryName: 'heritage tour' },
    { id: 16, categoryName: 'historical tour' },
    { id: 17, categoryName: 'homestay tour' },
    { id: 18, categoryName: 'honeymoon tour' },
    { id: 19, categoryName: 'luxury tour' },
    { id: 20, categoryName: 'motorcycle tour' },
    { id: 21, categoryName: 'nature-based tour' },
    { id: 29, categoryName: 'photography tour' },
    { id: 23, categoryName: 'relaxing tour' },
    { id: 24, categoryName: 'shopping tour' },
    { id: 25, categoryName: 'snorkeling tour' },
    { id: 26, categoryName: 'sports tour' },
    { id: 27, categoryName: 'trekking tour' },
    { id: 28, categoryName: 'walking tour' }
];

const mapStateToProps = (state) => {
    return {
        reduxData: state
    }
}

export default connect(mapStateToProps)(withRouter(ProviderTour));
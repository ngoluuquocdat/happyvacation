import React from 'react'
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import Slider from '@mui/material/Slider';
import { VscLocation, VscCalendar } from 'react-icons/vsc';
import { BsPeople } from 'react-icons/bs';
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai'
import { FaCaretDown } from 'react-icons/fa';

import { withRouter } from 'react-router-dom';
import '../../Styles/search-bar-hotel.scss'

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

class SearchBarHotel extends React.Component {
    state = {
        categories: [],
        listPlaces: [],       
        filter_hotel: ((this.props.filter_hotel!=null)&&(Object.keys(this.props.filter_hotel).length !== 0 && this.props.filter_hotel.constructor === Object)) ? this.props.filter_hotel :  {
                selectedPlace: null,
                checkIn: new Date(),
                checkOut: new Date(),
                adults: 1,
                children: [],
                rooms: 1,
                keyword: '',
                priceRange: [0, 3000],               
            },
        showListPlace: false,
        showDatePicker: false,
        showGuestCount: false,
        showAdvance: false
    };

    componentDidMount() {
        // call api to get list categories, list places
        // fake api response
        const resPlaces = listPlaces;
        // set the checked states

        this.setState({
            listPlaces: resPlaces,
        })
    }


    // click places menu toggle
    handleDestinationClick = () => {
        let showListPlace = this.state.showListPlace;
        this.setState({
            showListPlace: !showListPlace
        })
    }

    // click date picker toggle
    handleDateClick = () => {
        let showDatePicker = this.state.showDatePicker;
        this.setState({
            showDatePicker: !showDatePicker
        })
    }

    // click guest menu toggle
    handleGuestClick = () => {
        let showGuestCount = this.state.showGuestCount;
        this.setState({
            showGuestCount: !showGuestCount
        })
    }

    // click advance toggle
    handleAdvanceClick = () => {
        let showAdvance = this.state.showAdvance;
        this.setState({
            showAdvance: !showAdvance
        })
    }

    // select 1 destination
    handleDestinationItemSelect = (item) => {
        const selectedPlace = this.state.listPlaces.filter((element) => element.id === item.id)
        const filter_hotel = this.state.filter_hotel;
        this.setState({
            filter_hotel: {
                ...filter_hotel, 
                selectedPlace: selectedPlace[0]
            }
        })
    }

    // select date range
    handleDateRangeChange = (ranges) => {
        const filter_hotel = this.state.filter_hotel;
        this.setState({
            filter_hotel: {
                ...filter_hotel, 
                checkIn: ranges.selection.startDate,
                checkOut: ranges.selection.endDate
            }
        })
    }
    // on change keyword input
    handleKeywordInput = (event) => {
        const filter_hotel = this.state.filter_hotel;
        this.setState({
            filter_hotel: {
                ...filter_hotel, 
                keyword: event.target.value
            }   
        })
    }
    // select price range
    handlePriceRangeChange = (event, newRange, activeThumb) => {
        const minDistance = 210;
        const filter_hotel = this.state.filter_hotel;
        const currentRange = this.state.filter_hotel.priceRange

        // handle min range
        if (activeThumb === 0) {
            newRange = [Math.min(newRange[0], currentRange[1] - minDistance), currentRange[1]];
        } else {
            newRange = [currentRange[0], Math.max(newRange[1], currentRange[0] + minDistance)];
        }

        this.setState({
            filter_hotel: {
                ...filter_hotel, 
                priceRange: newRange
            }
        })
    }
    // display price label for price range picker
    displayPrice = (value) => {
        return `$${value}`;
    }
    
    // handle adults minus
    handleAdultsMinus = (event) => {
        event.stopPropagation()
        let { adults } = this.state.filter_hotel;
        const filter_hotel = this.state.filter_hotel;
        if(adults > 1) {
            adults -= 1;
        } 

        this.setState({
            filter_hotel: {
                ...filter_hotel, 
                adults: adults
            }           
        })
    }
    // handle adult add
    handleAdultsAdd = (event) => {
        event.stopPropagation()
        let { adults } = this.state.filter_hotel;
        const filter_hotel = this.state.filter_hotel;
        if(adults < 30) {
            adults += 1;
        }

        this.setState({
            filter_hotel: {
                ...filter_hotel, 
                adults: adults
            }           
        })
    }
    // handle children minus
    handleChildrenMinus = (event) => {
        event.stopPropagation()
        let { children } = this.state.filter_hotel;
        const filter_hotel = this.state.filter_hotel;
        if(children.length > 0) {
            children.pop()
        } 
        this.setState({
            filter_hotel: {
                ...filter_hotel, 
                children: children
            }           
        })
    }
    // handle children add
    handleChildrenAdd = (event) => {
        event.stopPropagation()
        let { children } = this.state.filter_hotel;
        const filter_hotel = this.state.filter_hotel;
        if(children.length < 10) {
            this.setState({
                filter_hotel: {
                    ...filter_hotel, 
                    children: [...children, 10]
                }           
            })
        }
    }
    //handle children age select
    handleChildrenAgeSelect = (event, index) => {
        let { children } = this.state.filter_hotel;
        const filter_hotel = this.state.filter_hotel;
        children[index] = parseInt(event.target.value);
        this.setState({
            filter_hotel: {
                ...filter_hotel, 
                children: children
            }           
        })
    }
    // handle rooms minus
    handleRoomsMinus = (event) => {
        event.stopPropagation()
        let { rooms } = this.state.filter_hotel;
        const filter_hotel = this.state.filter_hotel;
        if(rooms > 1) {
            rooms -= 1;
        } 
        this.setState({
            filter_hotel: {
                ...filter_hotel, 
                rooms: rooms
            }           
        })
    }
    // handle rooms add
    handleRoomsAdd = (event) => {
        event.stopPropagation()
        let { rooms, adults } = this.state.filter_hotel;
        const filter_hotel = this.state.filter_hotel;
        if(rooms < adults) {
            rooms += 1;
        }
        this.setState({
            filter_hotel: {
                ...filter_hotel, 
                rooms: rooms
            }           
        })
    }

    // submit click
    handleSubmit = () => {
        // const filter = {
        //     selectedPlace: this.state.filter.selectedPlace,
        //     startDate: this.state.filter.startDate,
        //     endDate: this.state.filter.endDate,
        //     keyword: this.state.filter.keyword,
        //     minPrice: this.state.filter.priceRange[0],
        //     maxPrice: this.state.filter.priceRange[1],
        //     isPrivate: this.state.filter.isPrivate,
        //     categoryIds: this.state.filter.selectedCategories.map(element => element.id)
        // }
        let filter_hotel = this.state.filter_hotel
        console.log('Your hotel filter from state: ', filter_hotel);
        this.props.history.push('/hotels', {filter_hotel: filter_hotel});
    }

    render() {
        const {listPlaces, showListPlace, showDatePicker, showGuestCount, showAdvance} = this.state;
        const { selectedPlace } = this.state.filter_hotel;
        const { checkIn, checkOut } = this.state.filter_hotel;
        const { adults, children, rooms } = this.state.filter_hotel;
        const { keyword } = this.state.filter_hotel;
        const priceRange = this.state.filter_hotel.priceRange;
        const isPlaceSelected =  selectedPlace && selectedPlace !== 'null' && selectedPlace !== 'undefined';
        const isDateSelected =  !!((checkIn.getDate() !== checkOut.getDate()));
        const ages = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

        const dateSelectionRange = {
            startDate: checkIn,
            endDate: checkOut,
            key: 'selection',
        }        
        
        return (
            <div className="search-bar-hotel">
                <div 
                    className="place"
                    onClick={() => this.handleDestinationClick()}
                >
                    <VscLocation size="1.6em" color="#5E6D77" className="icon"/>
                    <div>
                        <label>Destination</label>
                        <p className="destination">
                        {
                            isPlaceSelected ?
                            selectedPlace.placeName
                            :
                            'Where are you going?'
                            }
                        </p>
                    </div>
                    {
                        showListPlace &&                        
                        <ul className="destination-menu">
                            {
                                listPlaces.map((item) => {
                                    return (
                                        <li 
                                            key={item.id}
                                            className="destination-item"
                                            onClick={() => this.handleDestinationItemSelect(item)}
                                        >
                                            {item.placeName}
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    }
                </div>
                <div 
                    className="date"
                    onClick={() => this.handleDateClick()}
                >
                    <VscCalendar size="1.4em" color="#5E6D77" className="icon"/>
                    <div>
                        <label>Check In - Check Out</label>
                        <p>
                            {
                                isDateSelected ?
                                `${("0" + checkIn.getDate()).slice(-2)}/${("0" + (checkIn.getMonth()+1)).slice(-2)}/${checkIn.getFullYear()}
                                -
                                ${("0" + checkOut.getDate()).slice(-2)}/${("0" + (checkOut.getMonth()+1)).slice(-2)}/${checkOut.getFullYear()}`
                                :
                                'dd/mm/yyyy - dd/mm/yyyy'
                            } 
                        </p>
                        {
                            showDatePicker &&
                            <div
                                className='data-range-picker'
                                onClick={(event) => event.stopPropagation()}
                            >
                                <DateRange
                                    editableDateInputs={true}
                                    onChange={this.handleDateRangeChange}
                                    moveRangeOnFirstSelection={false}
                                    ranges={[dateSelectionRange]}
                                    minDate={new Date()}
                                />
                            </div>
                        }
                    </div>                   
                </div>
                <div className="guest-count" onClick={() => this.handleGuestClick()}>
                    <BsPeople size="1.4em" color="#5E6D77" className="icon"/>
                    <div>
                        <label>Guests</label>     
                        <p>
                            {adults} {adults > 1 ? 'Adults' : 'Adult'}&nbsp;-&nbsp;
                            {children.length} {children.length > 1 ? 'Children' : 'Child'}&nbsp;-&nbsp;
                            {rooms} {rooms > 1 ? 'Rooms' : 'Room'}
                        </p>   
                        {
                            showGuestCount &&
                            <div className='guest-menu' onClick={(event) => event.stopPropagation()}>
                                <div className='guest-menu-item'>
                                    <div>
                                        <label className='title'>Rooms</label>                                            
                                    </div>
                                    <div className='quantity-picker-wrap'>
                                        <div className='quantity-picker'>
                                            <span className='minus-btn' onClick={(event) => this.handleRoomsMinus(event)}><AiOutlineMinus /></span>
                                            <span className='quantity-value'>{rooms}</span>
                                            <span className='add-btn' onClick={(event) => this.handleRoomsAdd(event)}><AiOutlinePlus /></span>
                                        </div>
                                    </div>
                                </div>
                                <div className='guest-menu-item'>
                                    <div>
                                        <label className='title'>Adults</label>                                            
                                    </div>
                                    <div className='quantity-picker-wrap'>
                                        <div className='quantity-picker'>
                                            <span className='minus-btn' onClick={(event) => this.handleAdultsMinus(event)}><AiOutlineMinus /></span>
                                            <span className='quantity-value'>{adults}</span>
                                            <span className='add-btn' onClick={(event) => this.handleAdultsAdd(event)}><AiOutlinePlus /></span>
                                        </div>
                                    </div>
                                </div>
                                <div className='guest-menu-item'>
                                    <div>
                                        <label className='title'>Children</label>                                            
                                    </div>
                                    <div className='quantity-picker-wrap'>
                                        <div className='quantity-picker'>
                                            <span className='minus-btn' onClick={(event) => this.handleChildrenMinus(event)}><AiOutlineMinus /></span>
                                            <span className='quantity-value'>{children.length}</span>
                                            <span className='add-btn' onClick={(event) => this.handleChildrenAdd(event)}><AiOutlinePlus /></span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className='children-age-wrap' onClick={(event) => event.stopPropagation()}>
                                    {
                                        children.map((item, index) => {
                                            return (
                                                <select name="age" 
                                                    className='age-select' 
                                                    key={'children-age'+index} 
                                                    onChange={(event) => this.handleChildrenAgeSelect(event, index)}
                                                >    
                                                {
                                                    ages.map(age => {
                                                        return (
                                                            <option value={age} selected={item === age}>
                                                                {age} {age !== 1 ? 'years' : 'year'} old
                                                            </option>                                               
                                                        )
                                                    })
                                                }                                      
                                                    
                                                </select>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        }
                    </div>                  
                </div>
                <div className="advance-submit">
                    <div 
                        className="advance"
                        onClick={() => this.handleAdvanceClick()}
                    >
                        <label>Advance</label>
                        <span>More <FaCaretDown size="0.8em"/></span>
                        {
                            showAdvance && 
                            <div className="advance-menu" onClick={(event) => event.stopPropagation()}>
                                <div className="advance-menu-section">
                                    <div className="item-title">
                                        <h4>Keyword</h4>
                                    </div>        
                                    <input 
                                        className="keyword" 
                                        type="text" 
                                        value={keyword} 
                                        placeholder='e.g.city, region, district, address or specific hotel'
                                        onChange={(event) => this.handleKeywordInput(event)}
                                    />
                                </div>
                                <div className="advance-menu-section">
                                    <div className="item-title">
                                        <h4>Filter Price</h4>
                                    </div>
                                    <div className="price-slider">
                                        <Slider
                                            value={priceRange}
                                            onChange={this.handlePriceRangeChange}
                                            valueLabelDisplay="on"
                                            getAriaValueText={this.displayPrice}
                                            valueLabelFormat={this.displayPrice}
                                            disableSwap={true}
                                            min={0}
                                            max={3000}
                                            step={10}
                                            size="small"
                                        />
                                    </div>
                                </div>                               
                            </div>
                        }
                    </div>
                    <button className="submit" onClick={() => this.handleSubmit()}>SEARCH</button>
                </div>
            </div>
        )
    }
}

export default withRouter(SearchBarHotel)
import React from 'react'
import '../../Styles/search-bar.scss'
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import Slider from '@mui/material/Slider';
import { VscLocation, VscCalendar } from 'react-icons/vsc';
import { FaCaretDown } from 'react-icons/fa';
import { withRouter } from 'react-router-dom';

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
    { id: 22, categoryName: 'photography tour' },
    { id: 23, categoryName: 'relaxing tour' },
    { id: 24, categoryName: 'shopping tour' },
    { id: 25, categoryName: 'snorkeling tour' },
    { id: 26, categoryName: 'sports tour' },
    { id: 27, categoryName: 'trekking tour' },
    { id: 28, categoryName: 'walking tour' }
];

class SearchBar extends React.Component {
    state = {
        categories: [],
        listPlaces: [],
        
        filter: ((this.props.filter!=null)&&(Object.keys(this.props.filter).length !== 0 && this.props.filter.constructor === Object)) ? this.props.filter :  {
                selectedPlace: null,
                startDate: new Date(),
                endDate: new Date(),
                keyword: '',
                priceRange: [0, 3000],
                selectedCategories: [],
                isPrivate: false,
                matchAll: false
            },
        // filter: {
        //     selectedPlace: null,
        //     startDate: new Date(),
        //     endDate: new Date(),
        //     keyword: '',
        //     priceRange: [0, 6406],
        //     selectedCategories: [],
        //     isPrivate: false,
        // },
        //checkedStates: new Array(categories.length).fill(false),
        checkedStates: [],
        showListPlace: false,
        showDatePicker: false,
        showAdvance: false
    };

    componentDidMount() {
        // call api to get list categories, list places
        // fake api response
        const resCategories = categories_temp;
        const resPlaces = listPlaces;
        // set the checked states
        var checkedStates;
        if(this.state.filter.selectedCategories.length !== 0) {
            const selected = this.state.filter.selectedCategories;
            checkedStates = resCategories.map((item) => selected.filter((element)=>element.id===item.id).length > 0)
        } else {
            checkedStates = new Array(resCategories.length).fill(false);
        }
        this.setState({
            categories: resCategories,
            listPlaces: resPlaces,
            checkedStates: checkedStates
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
        const filter = this.state.filter;
        this.setState({
            filter: {
                ...filter, 
                selectedPlace: selectedPlace[0]
            }
        })
    }

    // select date range
    handleDateRangeChange = (ranges) => {
        const filter = this.state.filter;
        this.setState({
            filter: {
                ...filter, 
                startDate: ranges.selection.startDate,
                endDate: ranges.selection.endDate
            }
        })
    }
    // on change keyword input
    handleKeywordInput = (event) => {
        const filter = this.state.filter;
        this.setState({
            filter: {
                ...filter, 
                keyword: event.target.value
            }   
        })
    }
    // select price range
    handlePriceRangeChange = (event, newRange, activeThumb) => {
        const minDistance = 210;
        const filter = this.state.filter;
        const currentRange = this.state.filter.priceRange

        // handle min range
        if (activeThumb === 0) {
            newRange = [Math.min(newRange[0], currentRange[1] - minDistance), currentRange[1]];
        } else {
            newRange = [currentRange[0], Math.max(newRange[1], currentRange[0] + minDistance)];
        }

        this.setState({
            filter: {
                ...filter, 
                priceRange: newRange
            }
        })
    }
    // display price
    displayPrice = (value) => {
        return `$${value}`;
    }
    // private tour only checkbox click
    handleTourTypeSelect = () => {
        const isPrivate = this.state.filter.isPrivate;
        const filter = this.state.filter;
        this.setState({
            filter: {
                ...filter, 
                isPrivate: !isPrivate
            }
        })
    }
    // handleMatchAllSelect
    handleMatchAllSelect = (event) => {
        const filter = this.state.filter;
        this.setState({
            filter: {
                ...filter, 
                matchAll: event.target.checked
            }
        })
    }

    // category checkbox click
    handleCategorySelect = (event, item, index) => {
        const filter = this.state.filter;
        const isChecked = event.target.checked;
        // set state checkedStates
        const checkedStates = this.state.checkedStates;
        checkedStates[index] = isChecked;
        this.setState({
            checkedStates: checkedStates
        })
        // add or remove category item in filter
        const selectedCategories = this.state.filter.selectedCategories;
        if(isChecked) {
            this.setState({
                filter: {
                    ...filter, 
                    selectedCategories: [...selectedCategories, item]
                }
            })
        } else {
            this.setState({
                filter: {
                    ...filter, 
                    selectedCategories: selectedCategories.filter((element) => element.id !== item.id)
                }
            })
        }
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
        const filter = this.state.filter
        //console.log('Your tour filter from state: ', filter);
        this.props.history.push('/tours', {filter: filter});
    }

    render() {
        const {listPlaces, categories, checkedStates, showListPlace, showDatePicker, showAdvance} = this.state;
        const { selectedPlace } = this.state.filter;
        const {startDate, endDate} = this.state.filter;
        const priceRange = this.state.filter.priceRange;
        const isPlaceSelected =  selectedPlace && selectedPlace !== 'null' && selectedPlace !== 'undefined';
        const isDateSelected =  !!((startDate.getDate() !== endDate.getDate()));

        const dateSelectionRange = {
            startDate: startDate,
            endDate: endDate,
            key: 'selection',
        }        
        
        return (
            <div className="search-bar">
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
                        <label>From - To</label>
                        <p>
                            {
                                isDateSelected ?
                                `${("0" + startDate.getDate()).slice(-2)}/${("0" + (startDate.getMonth()+1)).slice(-2)}/${startDate.getFullYear()}
                                -
                                ${("0" + endDate.getDate()).slice(-2)}/${("0" + (endDate.getMonth()+1)).slice(-2)}/${endDate.getFullYear()}`
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
                                        value={this.state.filter.keyword} 
                                        placeholder='Search for tour name...'
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
                                <div className="advance-menu-section">
                                    <div className="item-title">
                                        <h4>Tour Type</h4>
                                    </div>
                                    <div className='tour-type'>
                                        <input 
                                            type="checkbox" 
                                            id="tour-type" 
                                            checked={this.state.filter.isPrivate} 
                                            onChange={() => this.handleTourTypeSelect()}
                                        />
                                        <label htmlFor="tour-type">Is Private only?</label>
                                    </div>
                                </div>
                                <div className="advance-menu-section">
                                    <div className="item-title">
                                        <h4>Tour Categories</h4>
                                    </div>
                                    <div className='match-all'>
                                        <input 
                                            type="checkbox" 
                                            id="match-all" 
                                            checked={this.state.filter.matchAll} 
                                            onChange={(event) => this.handleMatchAllSelect(event)}
                                        />
                                        <label htmlFor="match-all">Match All?</label>
                                    </div>
                                    <div className="tour-categories">
                                        {
                                            categories.map((item, index) => {
                                                return (
                                                    <div key={item.id} className='item-category'>
                                                        <input 
                                                            type="checkbox" 
                                                            id={item.id} 
                                                            name="topping" 
                                                            value={item.categoryName} 
                                                            checked={checkedStates[index]}
                                                            onChange={(event) => this.handleCategorySelect(event, item, index)}
                                                        />
                                                        <label htmlFor={item.id}>{item.categoryName}</label>
                                                    </div>
                                                )
                                            })
                                        }
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

export default withRouter(SearchBar)
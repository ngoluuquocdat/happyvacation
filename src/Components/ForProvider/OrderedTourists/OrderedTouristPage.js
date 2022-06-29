import React from 'react'
import { toast } from 'react-toastify';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import ReactLoading from "react-loading";
import { Calendar } from 'react-date-range';
import { BsArrowDown, BsArrowUp } from 'react-icons/bs';
import { Pagination } from "@mui/material";
import { ReactSearchAutocomplete } from 'react-search-autocomplete'
import TouristsGroupByOrder from './TouristsGroupByOrder';
import '../../../Styles/ForProvider/ordered-tourist-page.scss';

class OrderedTouristPage extends React.Component {

    state = {
        tours: [],
        touristsCollection: {
            tourId: 1, 
            tourName: '',
            departureDate: '',
            touristGroups: [],
            totalCount: 10
        },
        tourId: '',
        date: new Date(),
        openTours: false,
        showDatePicker: false,
        isLoading: false
    }

    baseUrl = this.props.reduxData.baseUrl;

    async componentDidMount() {
        const token = localStorage.getItem('user-token');
        if(!token) {
            this.props.history.push('/login', {prevPath: this.props.location.pathname});
            return;
        }
        try {
            this.setState({
                isLoading: true
            })
            let res = await axios.get(
                `${this.baseUrl}/api/Providers/me/tours/simple`,         
                {
                    headers: { Authorization:`Bearer ${token}` }
                }
            );  

            this.setState({
                tours: res.data
            })
        } catch(e) {
            console.log(e);
            toast.error('Error occurred');
        } finally {
            this.setState({
                isLoading: false
            })
        }
    }

    // input change
    inputTourId = (e) => {
        this.setState({
            tourId: e.target.value
        })
    }

    // toggle date picker
    handleDateClick = () => {
        let showDatePicker = this.state.showDatePicker;
        this.setState({
            showDatePicker: !showDatePicker
        })
    }

    // date select
    handleDateSelect = (date) => {
        this.setState({
            date: date,
            showDatePicker: false
        })
    }

    // function for autocomplete
    handleOnSelect = (item) => {
        this.setState({
            tourId: item.id
        })
    }
    handleOnClear = () => {
        this.setState({
            tourId: ''
        })
    }
    formatResult = (item) => {
        return (
          <>
            <span className='autocomplete-item'>ID: {item.id}</span>
            <span className='autocomplete-item'>Tour name: {item.tourName}</span>
          </>
        )
    }

    // convert date time to string dd-MM-yyyy
    dateTimeToString = (date) => {
        return `${("0" + date.getDate()).slice(-2)}-${("0" + (date.getMonth()+1)).slice(-2)}-${date.getFullYear()}`
    }

    // handle search tour click
    searchTourist = async () => {
        const token = localStorage.getItem('user-token');
        if(!token) {
            this.props.history.push('/login', {prevPath: this.props.location.pathname});
            return;
        }
        let { tourId, date } = this.state;
        if(tourId === '') {
            toast.warning('Please select a tour.');
            return;
        }
        date = this.dateTimeToString(date);

        try {
            this.setState({
                isLoading: true
            })
            let res = await axios.get(
                `${this.baseUrl}/api/Orders/tourists?tourId=${tourId}&departureDateStr=${date}`,         
                {
                    headers: { Authorization:`Bearer ${token}` }
                }
            );  

            this.setState({
                touristsCollection: res.data
            })
        } catch(e) {
            console.log(e);
            toast.error('Error occurred');
        } finally {
            setTimeout(() => {
                this.setState({
                    isLoading: false
                })
            }, 1500)            
        }
    }

    // handle reset search tour
    resetSearch = () => {
        this.setState({
            tourId: '',
            date: new Date()
        })
    }

    render() {
        const { tourId, date } = this.state;
        const { tours, openTours, showDatePicker } = this.state;
        const { touristsCollection, isLoading } = this.state;

        return (
            <div className='ordered-tourist-page-container'>
                <div className='ordered-tourist-page-header'>
                    <div className='title'>Ordered tourists</div>
                    <div className='sub-title'>See tourists who booked a specific tour on a specific date</div>
                </div>
                <div className='search-area'>
                    <div className='search-area-upper'>
                        <div className='search-group'>
                            <span className='search-label'>Select a tour:</span>
                            <ReactSearchAutocomplete
                                className='search-autocomplete'
                                items={tours}
                                onSelect={this.handleOnSelect}
                                placeholder='Tour ID or Tour name...'
                                styling={
                                    {
                                        border: "1px solid #df385f",
                                        borderRadius: "5px",                                       
                                        zIndex: '10'
                                    }
                                }
                                fuseOptions={{keys: ["id", "tourName"]}}
                                resultStringKeyName="tourName"
                                formatResult={this.formatResult}
                            />
                        </div>
                    </div>
                    <div className='search-area-below'>
                        <div className='search-group'>
                            <span className='search-label'>Departure: </span>
                            <span className='departure-date-input'
                                onClick={this.handleDateClick}
                            >
                                {
                                    `${("0" + date.getDate()).slice(-2)}/${("0" + (date.getMonth()+1)).slice(-2)}/${date.getFullYear()}`
                                }                              
                                {
                                    showDatePicker &&
                                    <div className="date-picker" onClick={(event) => event.stopPropagation()}>
                                        <Calendar
                                            date={date}
                                            onChange={(date) => this.handleDateSelect(date)}
                                        />
                                    </div>
                                }
                            </span>
                        </div>
                    </div>
                    <div className='button-area'>
                        <button className='btn-search' onClick={this.searchTourist}>Search</button>
                    </div>
                </div>
                {
                    touristsCollection.departureDate !== '' &&
                    <>
                        {
                            isLoading ?
                            <div className="loading-container">
                                <ReactLoading
                                    className="loading-component"
                                    type={"spin"}
                                    color={"#df385f"}
                                    height={50}
                                    width={50}
                                />
                            </div>
                            :
                            <div className='ordered-tourist-page-content'>
                                <button className='btn-get-file' 
                                    onClick={() => { window.location.href = this.baseUrl+touristsCollection.exportFilePath}}
                                >
                                    Get file
                                </button>
                                <h2 className='tour-name'>{touristsCollection.tourName}</h2>
                                <div className='departure-total-wrapper'>
                                    <div className='departure'>
                                        <span className='label'>Departure:&nbsp; </span>
                                        <span className='value'>{touristsCollection.departureDate}</span>
                                    </div>
                                    <div className='total-count'>
                                        <span className='value'>{touristsCollection.totalCount} tourists</span>
                                    </div>
                                </div>
                                <div className='tourist-groups-list'>
                                    {
                                        touristsCollection.touristGroups.map(item => {
                                            return (
                                                <TouristsGroupByOrder key={item.orderId} touristGroup={item} />
                                            )
                                        })
                                    }
                                </div>
                            </div>                
                        }
                    </>                    
                }                               
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        reduxData: state
    }
}

export default connect(mapStateToProps)(withRouter(OrderedTouristPage));
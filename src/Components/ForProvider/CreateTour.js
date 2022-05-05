import React from 'react';
import axios from 'axios';
import PlacePicker from '../PlacePicker';
import ReactLoading from "react-loading";
import { toast } from 'react-toastify';
import { connect } from 'react-redux';
import { BsTrash } from 'react-icons/bs'
import { GrClose } from 'react-icons/gr'
import { VscAdd } from 'react-icons/vsc'
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import '../../Styles/ForProvider/create-tour.scss'

class CreateTour extends React.Component {

    state = {
        tourName: '',
        overview: '',
        isPrivate: false,
        selectedCategories: [],
        selectedPlaces: [],
        checkedCategoryStates: [],
        checkedPlaceStates: [],
        startingLocation: '',
        startingAddress: '',
        endingLocation: '',
        endingAddress: '',
        pickUpAsChoice: false,
        pickUpRange: {id: 0, placeName: ''},
        startingTime: '',
        duration: 1,
        durationUnit: 'Days',
        groupSize: 1,
        minAdults: 1,
        pricePerAdult: 0,
        includeChildren: true,
        pricePerChild: 0,
        itineraries: [ { title: '', content: ''} ],
        expenses: [ { content: '', isIncluded: true } ],
        images: [ { url: '', file: null } ],
        isCreating: false   
    }

    listPlaces = [];
    categories =  [];
    baseUrl = this.props.reduxData.baseUrl;

    componentDidMount() {
        // call api to get list categories, list places
        // fake api response
        const resCategories = categories_temp;
        const resPlaces = listPlaces;
        // set the checked states
        var checkedCategoryStates;
        var checkedPlaceStates;
        // if(this.state.filter.selectedCategories.length !== 0) {
        //     const selected = this.state.filter.selectedCategories;
        //     checkedStates = resCategories.map((item) => selected.filter((element)=>element.id===item.id).length > 0)
        // } else {
        //     checkedStates = new Array(resCategories.length).fill(false);
        // }
        checkedCategoryStates = new Array(resCategories.length).fill(false);
        checkedPlaceStates = new Array(resPlaces.length).fill(false);
        this.categories = resCategories;
        this.listPlaces = resPlaces;
        this.setState({          
            checkedCategoryStates:  checkedCategoryStates,
            checkedPlaceStates: checkedPlaceStates
        })
    }

    // input text change
    handleInputText = (event) => {
        const key = event.target.name;
        this.setState({
            [key]: event.target.value
        })
    }

    // toggle tour type
    handleTourType = (event) => {
        this.setState({
            isPrivate: event.target.checked
        })
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

    // handle place checkbox click
    handlePlaceSelect = (event, item, index) => {
        const isChecked = event.target.checked;
        // set state checked place States
        const checkedPlaceStates = this.state.checkedPlaceStates;
        checkedPlaceStates[index] = isChecked;
        this.setState({
            checkedPlaceStates: checkedPlaceStates
        })
        // add or remove place item in filter
        let selectedPlaces = this.state.selectedPlaces;
        if(isChecked) {
            selectedPlaces = [...selectedPlaces, item]; 
        } else {
            selectedPlaces = selectedPlaces.filter((element) => element.id !== item.id);
        }
        // check about pickup range
        let pickUpRange = this.state.pickUpRange;
        if(selectedPlaces.findIndex((element) => element.id === pickUpRange.id) < 0) {
            pickUpRange = selectedPlaces.length > 0 ? selectedPlaces[0] : {id: 0, placeName: ''};
        }
        // set state
        this.setState({
            selectedPlaces: selectedPlaces,
            pickUpRange: pickUpRange
        })
    }

    // handle change location option
    toggleLocationOption = () => {
        const pickUpAsChoice = !this.state.pickUpAsChoice;
        if(pickUpAsChoice === true) {
            let pickUpRange = this.state.selectedPlaces.length > 0 ? this.state.selectedPlaces[0] : {id: 0, placeName: ''}
            this.setState({
                pickUpAsChoice: pickUpAsChoice,
                pickUpRange: pickUpRange
            })
        } else {
            this.setState({
                pickUpAsChoice: pickUpAsChoice
            })
        }
    }

    // handle pickup range select
    handlePickUpRangeSelect = (event, item, index) => {
        this.setState({
            pickUpRange: item
        })
    }

    // handle location picking
    onStartingPlacePick = (place) => {
        this.setState({
            startingLocation: place
        })
    }

    onDestinationPlacePick = (place) => {
        this.setState({
            endingLocation: place
        })
    }

    // handle new time pick
    handleNewTimeValue = (newValue) => {
        this.setState({
            startingTime: newValue
        })
    }

    // toggle duration unit 
    toggleUnit = () => {
        const unit = this.state.durationUnit;
        this.setState({
            durationUnit: unit==='Days' ? 'Hours' : 'Days',
            duration: 1
        })
    }

    // handle input number change 
    onChangeInputNumber = (event) => {
        const key = event.target.name;
        let value = event.target.value;
        if(key === 'duration') {
            const durationUnit = this.state.durationUnit;           
            value = durationUnit === 'Hours' ? value/24 : value;
        }
        this.setState({
            [key]: value
        })
    }

    // toggle include children
    handleIncludeChildren = (event) => {
        this.setState({
            includeChildren: event.target.checked
        })
    }

    // handle itinerary input
    handleItineraryInput = (event, item, index) => {
        const key = event.target.name;
        let itineraries = this.state.itineraries;
        itineraries[index][key] = event.target.value;
        this.setState({
            itineraries: itineraries
        })
    }

    // more itinerary click
    handleMoreItineraryClick = () => {
        const itineraries = this.state.itineraries;
        this.setState({
            itineraries: [...itineraries, { title: '', content: ''}]
        })
    }

    // remove itinerary
    handleRemoveItineraryClick = (index) => {
        let itineraries = this.state.itineraries;
        if(itineraries.length > 1) {
            itineraries.splice(index, 1);
            this.setState({
                itineraries: itineraries
            })
        }
    }

    // more expense click
    handleMoreExpenseClick = () => {
        const expenses = this.state.expenses;
        this.setState({
            expenses: [...expenses, { content: '', isIncluded: true}]
        })
    }

    // handle expense input
    handleExpenseInput = (event, item, index) => {
        const key = event.target.name;
        let expenses = this.state.expenses;
        expenses[index][key] = event.target.value;
        this.setState({
            expenses: expenses
        })
    }

    // handle expense included check 
    handleExpenseIncludedCheck = (event, item, index) => {
        let expenses = this.state.expenses;
        expenses[index].isIncluded = event.target.checked;
        this.setState({
            expenses: expenses
        })
    }

    // remove itinerary
    handleRemoveExpenseClick = (index) => {
        let expenses = this.state.expenses;
        if(expenses.length > 1) {
            expenses.splice(index, 1);
            this.setState({
                expenses: expenses
            })
        }
    }

    // more image click 
    handleMoreImageClick = () => {
        const images = this.state.images;
        if(images.length < 6) {
            this.setState({
                images: [...images, { url: '', file: null}]
            })
        }
    }

    // on image change
    onImageChange = (event, index) => {
        if (event.target.files && event.target.files[0]) {
            let images = this.state.images;
            images[index].url = URL.createObjectURL(event.target.files[0]);
            images[index].file = event.target.files[0];
            this.setState({
                images: images
            });
        }
    }

    // remove image
    handleRemoveImageClick = (index) => {
        let images = this.state.images;
        if(images.length > 1) {
            images.splice(index, 1);
            this.setState({
                images: images
            })
        }
    }     

    // handle on submit 
    handleOnSave = async() => {
        const token = localStorage.getItem('user-token');
        if(!token) {
            this.props.history.push('/login', {prevPath: this.props.location.pathname});
        }

        const { tourName, overview} = this.state;
        const { selectedCategories, selectedPlaces } = this.state;
        const { startingLocation, endingLocation, startingAddress, endingAddress, startingTime } = this.state;
        const { pickUpAsChoice, pickUpRange } = this.state;
        const { isPrivate, duration, groupSize, minAdults, pricePerAdult, includeChildren, pricePerChild } = this.state;
        let { itineraries, expenses, images } = this.state;
        itineraries = itineraries.filter(element => (element.title !== '') && (element.content !== ''));
        expenses = expenses.filter(element => element.content !== '');
        images = images.filter(element => element.file !== null);

        let isLocationsValid = false;
        if(pickUpAsChoice === true && pickUpRange.id !== 0) {
            isLocationsValid = true;
        }
        if(pickUpAsChoice === false) {
            isLocationsValid = (startingLocation !== '') && (startingAddress !== '') &&
            (endingLocation !== '') && (endingAddress !== '');
        }
        console.log('location check', isLocationsValid);

        const isValid = (tourName !== '') && (overview !== '') &&
                        (selectedCategories.length > 0) && (selectedPlaces.length > 0) &&
                        isLocationsValid &&
                        (startingTime !== '') &&
                        (itineraries.length > 0) && (expenses.length > 0) && (images.length > 0);
        
        // if(!isValid) {
        //     toast.warning('Please fill all information!');
        //     return;
        // }
        this.setState({
            isCreating: true
        })
        // change starting time format
        let period = startingTime.getHours() >= 12 ? 'PM' : 'AM';
        let hour = startingTime.getHours() % 12;
        let minute = startingTime.getMinutes() < 10 ? '0'+startingTime.getMinutes() : startingTime.getMinutes();
        let startTime = `${hour}:${minute} ${period}`
        // starting/ending point format
        let startPoint='';
        let endPoint='';
        if(pickUpAsChoice === true) {
            startPoint = `CustomerPoint&${pickUpRange.id}&${pickUpRange.placeName}`;
            endPoint = `CustomerPoint&${pickUpRange.id}&${pickUpRange.placeName}`;
        } else {
            startPoint = `${startingAddress}, ${startingLocation}`;
            endPoint = `${endingAddress}, ${endingLocation}`;
        }
        
        // post to api
        let data = new FormData();
        data.append('tourName', tourName);
        data.append('overview', overview);
        data.append('isPrivate', isPrivate);
        data.append('duration', duration);
        data.append('groupSize', groupSize);
        data.append('minAdults', minAdults);
        data.append('pricePerAdult', pricePerAdult);
        data.append('includeChildren', includeChildren);
        data.append('pricePerChild', pricePerChild); 
        data.append('startTime', startTime); 
        data.append('startPoint', startPoint);     
        data.append('endPoint', endPoint);     
        selectedCategories.map((item, index) => {
            data.append(`categoryIds[${index}]`, item.id); 
        })
        selectedPlaces.map((item, index) => {
            data.append(`placeIds[${index}]`, item.id); 
        })
        itineraries.forEach((item, index) => {
            data.append(`itineraries[${index}].title`, item.title);
            data.append(`itineraries[${index}].content`, item.content);
        })  
        expenses.forEach((item, index) => {
            data.append(`expenses[${index}].content`, item.content);
            data.append(`expenses[${index}].isIncluded`, item.isIncluded);
        }) 
        images.map(item => {
            data.append('images', item.file);
        })
        
        try {
            let res = await axios.post(
              `${this.baseUrl}/api/Tours`,
              data,
              {
                headers: { Authorization:`Bearer ${token}` }
              }
            );          

            // show toast notify
            toast.success('Create your tour successfully!');
            // redirect to list tours management page
            setTimeout(() => {              
                this.props.history.push('/for-provider/tours');
            }, 2000)
        } catch (error) {
            if (!error.response) {
              toast.error("Network error");
              return;
            }
            if (error.response.status === 400) {
                console.log(error)
                this.props.history.push('/login');
            }
            if (error.response.status === 403) {
                console.log(error)
                // redirect to login/register for provider
                this.props.history.push('/for-provider/register');
            }
        } finally {
            this.setState({
                isCreating: false
            })
        }   
    }

    render() {
        const categories = this.categories;
        const listPlaces = this.listPlaces;
        const { tourName, overview} = this.state;
        const { isPrivate, includeChildren } = this.state;
        const { checkedCategoryStates, checkedPlaceStates } = this.state;
        const { startingAddress, endingAddress, pickUpAsChoice, pickUpRange } = this.state;
        const { startingTime } = this.state;
        const { duration, durationUnit } = this.state;
        const { groupSize, minAdults, pricePerAdult, pricePerChild } = this.state;
        const { selectedPlaces } = this.state;
        const { itineraries, expenses, images } = this.state;        
        const { isCreating } = this.state;
        return (
            <div className='create-tour-container'>
                
                <div className='create-tour-header'>
                    <div className='title'>Create new tour</div>
                    <div className='sub-title'>Create your new tour with detailed information</div>
                </div>
                <div className='create-tour-body'>
                    {
                        isCreating &&
                        <div className="loading-modal"></div>
                    }
                    <div className='form-group'>
                        <label className="form-title tour-name">Tour name</label>
                        <input className="input-field tour-name" name='tourName' type='text' value={tourName} onChange={this.handleInputText}/>
                    </div>
                    <div className='form-group'>
                        <label className="form-title">Overview</label>
                        <textarea className="input-area" name='overview' value={overview} onChange={this.handleInputText}/>
                    </div>
                    <div className='form-group'>
                        <label className="form-title">Tour Type</label>
                        <input 
                            id="tour-type" 
                            className="input-check" 
                            name='tour-type' 
                            type='checkbox' 
                            value={isPrivate}
                            onChange={(event)=>this.handleTourType(event)}
                        />
                        <label htmlFor='tour-type' className='tour-type'>Is Private?</label>
                    </div>
                    <div className='form-group'>
                        <label className="form-title">Categories</label>
                        <div className="tour-categories">
                            {
                                categories.map((item, index) => {
                                    return (
                                        <div key={'category'+item.id} className='item-category'>
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
                    </div>
                    <div className='form-group'>
                        <label className="form-title">Tourist Sites</label>
                        <div className="places">
                            {
                                listPlaces.map((item, index) => {
                                    return (
                                        <div key={'place'+item.id} className='item-place'>
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
                    </div>
                    <div className='location-options'>
                        <label className="location-label">Location</label>    
                        <label htmlFor='include-children' className='location-option-name'>
                            {
                                pickUpAsChoice ?
                                'Pick up and drop-off customers at their location'
                                :
                                'Fixed location provided by tour provider'
                            }
                        </label>   
                        <span className="change-location-option" onClick={this.toggleLocationOption}>Change option</span> 
                    </div>
                    {
                        pickUpAsChoice ?
                        <div className='location-customer-choice'>
                            <div className='form-group'>
                                <label className="form-title--small">Select place that you provide your pick up/drop-off</label>
                                <div className="pickup-range-select">
                                    {
                                        selectedPlaces.length > 0 ?
                                        selectedPlaces.map((item, index) => {
                                            return (
                                                <div key={'pickup'+item.id} className='item-place'>
                                                    <input 
                                                        type="checkbox" 
                                                        id={'pickup'+item.id} 
                                                        value={item.placeName} 
                                                        checked={pickUpRange.id === item.id}
                                                        onChange={(event) => this.handlePickUpRangeSelect(event, item, index)}
                                                    />
                                                    <label htmlFor={'pickup'+item.id}>{item.placeName}</label>
                                                </div>
                                            )
                                        })
                                        :
                                        <span className="no-tourist-sites-warn">You need to choose tourist sites first.</span>
                                    }
                                </div>
                            </div>
                        </div>
                        :
                        <>
                            <div className='form-group'>
                                <label className="form-title--small">Starting</label>
                                <div className="place-picker-container">
                                    <PlacePicker onPlacePick={this.onStartingPlacePick}/>
                                </div>
                                <input 
                                    className="input-field address" 
                                    type='text' 
                                    placeholder="Detailed number and street..."
                                    value={startingAddress}
                                    name='startingAddress'
                                    onChange={this.handleInputText}
                                />
                            </div>
                            <div className='form-group'>
                                <label className="form-title--small">Ending</label>
                                <div className="place-picker-container">
                                    <PlacePicker onPlacePick={this.onDestinationPlacePick}/>
                                </div>
                                <input 
                                    className="input-field address" 
                                    type='text' 
                                    placeholder="Detailed number and street..."
                                    value={endingAddress}
                                    name='endingAddress'
                                    onChange={this.handleInputText}
                                />
                            </div>
                        </>
                    }
                    <div className='form-group'>
                        <label className="form-title">Starting Time</label>
                        <div className="starting-time">
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <TimePicker
                                    value={startingTime}
                                    onChange={(newValue) => this.handleNewTimeValue(newValue)}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </LocalizationProvider>
                        </div>                       
                    </div>
                    <div className='form-group'>
                        <label className="form-title">Duration</label>
                        {
                            durationUnit==="Days" ?
                            <input 
                                className="input-number" 
                                type="number" 
                                name='duration' 
                                min="1"
                                value={duration}
                                onChange={(event)=>this.onChangeInputNumber(event)}
                            />
                            :
                            <input 
                                className="input-number" 
                                type="number" 
                                name='duration' 
                                min="1" 
                                max="24"
                                value={duration*24}
                                onChange={(event)=>this.onChangeInputNumber(event)}
                            />
                        }
                        <span className="duration-unit">{durationUnit}</span>
                        <span className="change-unit" onClick={this.toggleUnit}>Change unit</span>
                    </div>
                    <div className='tourist-number'>
                        <div className='form-group'>
                            <label className="form-title">Group Size</label>
                            <input 
                                className="input-number" 
                                type="number" 
                                name='groupSize'  
                                min="1"
                                value={groupSize}
                                onChange={(event)=>this.onChangeInputNumber(event)}
                            />
                        </div>
                        <div className='form-group'>
                            <label className="form-title">Minimum Adults amount</label>
                            <input 
                                className="input-number" 
                                type="number" 
                                name='minAdults'  
                                min="1"
                                value={minAdults}
                                onChange={(event)=>this.onChangeInputNumber(event)}
                            />
                        </div> 
                    </div>
                    <div className='price'>
                        <div className='form-group'>
                            <label className="form-title">Price per Adult</label>
                            <input 
                                className="input-number" 
                                type="number" 
                                name='pricePerAdult'  
                                min="1"
                                value={pricePerAdult}
                                onChange={(event)=>this.onChangeInputNumber(event)}
                            />
                        </div>
                        <div className='form-group'>
                            <label className={includeChildren ? 'form-title' : 'form-title disabled'}>Price per Child</label>
                            <input 
                                className="input-number" 
                                type="number" 
                                name='pricePerChild'  
                                min="1"
                                value={includeChildren ? pricePerChild : 0}
                                disabled={!includeChildren}
                                onChange={(event)=>this.onChangeInputNumber(event)}
                            />
                        </div> 
                        <div className='include-children-wrap'>
                            <input 
                                id="include-children" 
                                className="include-children" 
                                name='tour-type' 
                                type='checkbox' 
                                checked={includeChildren}
                                onChange={(event)=>this.handleIncludeChildren(event)}
                            />
                            <label htmlFor='include-children' className='include-children'>Include Children ?</label>
                        </div>
                    </div>
                    <div className='form-group'>
                        <label className="form-title">Itinerary</label>
                        {
                            itineraries.map((item, index) => {
                                return (
                                    <div className="itinerary-input" key={'iti'+index}>
                                        <div className="input-section">
                                            <input 
                                                className="input-field itinerary-title" 
                                                name='title' 
                                                placeholder='Title...' 
                                                value={item.title}
                                                onChange={(event)=>this.handleItineraryInput(event, item, index)}
                                            />
                                            <textarea 
                                                className="input-area itinerary-content" 
                                                name='content' 
                                                placeholder='Content...'
                                                value={item.content}
                                                onChange={(event)=>this.handleItineraryInput(event, item, index)}
                                            />
                                        </div>
                                        <span className="remove-btn" onClick={() => this.handleRemoveItineraryClick(index)}><BsTrash/></span>
                                    </div>
                                )
                            })
                        }
                        <p className="more-btn" onClick={this.handleMoreItineraryClick}>More...</p>
                    </div>   
                    <div className='form-group'>
                        <label className="form-title">Expense</label>
                        {
                            expenses.map((item, index) => {
                                return (
                                    <div className="expense-input" key={'exp'+index}>
                                        <div className="input-section">
                                            <input 
                                                className="input-field expense-content" 
                                                name='content' 
                                                placeholder='Expense...' 
                                                value={item.content}
                                                onChange={(event)=>this.handleExpenseInput(event, item, index)}
                                            />
                                            <div className='is-included'>
                                                <input 
                                                    id={`included-${index}`} 
                                                    type="checkbox" 
                                                    className="input-check"
                                                    name="isIncluded"
                                                    checked={item.isIncluded}
                                                    onChange={(event)=>this.handleExpenseIncludedCheck(event, item, index)}
                                                />
                                                <label htmlFor={`included-${index}`}>Is included ?</label>
                                            </div>
                                        </div>
                                        <span className="remove-btn" onClick={() => this.handleRemoveExpenseClick(index)}><BsTrash/></span>
                                    </div>
                                )
                            })
                        }
                        <p className="more-btn" onClick={this.handleMoreExpenseClick}>More...</p>
                    </div> 
                    <div className='form-group'>
                        <label className="form-title">Tour Images</label>
                        <div className='tour-images-list'>
                            {
                                images.map((item, index) => {
                                    return (
                                        <div key={'image'+index} className='tour-image-wrapper'>
                                            <div className='tour-image' style={{backgroundImage: `url('${item.url}')`}}>
                                                <label className='overlay-click' htmlFor={`image-${index}`}>
                                                    {item.url.length===0 && <VscAdd/>}
                                                </label>
                                                <input className='image-input' id={`image-${index}`} type='file' onChange={(event)=>this.onImageChange(event, index)}/>
                                                <span className='remove-image' onClick={()=>this.handleRemoveImageClick(index)}><GrClose/></span>
                                            </div>
                                            <span className='image-name'>{index===0 ? 'Thumbnail' : `Image ${index}`}</span>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <p className="more-btn" onClick={this.handleMoreImageClick}>More...</p>
                    </div>   
                    <div className="save-btn-wrapper">
                        <button className="save-btn" onClick={this.handleOnSave}>CREATE</button>
                        {
                            isCreating &&
                            <ReactLoading
                                className="loading-component"
                                type={"spin"}
                                color={"#df385f"}
                                height={30}
                                width={30}
                            />
                        }
                    </div>                  
                </div>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
            </div>
        )
    }
}

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

const mapStateToProps = (state) => {
    return {
        reduxData: state
    }
}

export default connect(mapStateToProps)(CreateTour);

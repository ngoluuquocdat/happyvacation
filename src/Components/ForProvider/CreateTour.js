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
import { withRouter, Link } from 'react-router-dom';
import '../../Styles/ForProvider/create-tour.scss';

class CreateTour extends React.Component {

    state = {
        places: [],
        categories:  [],

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
        pricePerAdult: 1,
        includeChildren: true,
        pricePerChild: 0,
        itineraries: [ { title: '', content: ''} ],
        expenses: [ { content: '', isIncluded: true } ],
        images: [ { url: '', file: null } ],
        isCreating: false,   

        tourNameValid: true,
        overviewValid: true,
        categoryValid: true,
        placeValid: true,
        locationsValid: true,
        startTimeValid: true,
        itineraryValid: true,
        expenseValid: true,
        imagesValid: true
    }

    // listPlaces = [];
    // categories =  [];
    baseUrl = this.props.reduxData.baseUrl;

    async componentDidMount () {
        // call api to get list categories, list places
        await this.getCategories();
        await this.getPlaces();
    }

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

    // input text change
    handleInputText = (event) => {
        const key = event.target.name;
        this.setState({
            [key]: event.target.value,
            [key+'Valid']: event.target.value.length > 0
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
                categoryValid: true,    // add this
                selectedCategories: [...selectedCategories, item]           
            })
        } else {
            this.setState({
                categoryValid: selectedCategories.length !== 1, // this selectedCategories is before setState
                selectedCategories: selectedCategories.filter((element) => element.id !== item.id)
            })
        }      
    }

    // handle place checkbox click
    handlePlaceSelect = (event, item, index) => {
        let placeValid = false; // add this
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
            placeValid = true;    // add this
            selectedPlaces = [...selectedPlaces, item]; 
        } else {
            placeValid = selectedPlaces.length !== 1; // this selectedPlaces is before setState
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
            pickUpRange: pickUpRange,
            placeValid: placeValid
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
        if(Number(value) !== 0) {
            if(Number.isInteger(Number(value))) {
                if(key === 'duration') {
                    const durationUnit = this.state.durationUnit;    
                    if(durationUnit === 'Hours')  {
                        if(Number(value) < 25) {
                            value = value/24
                        } else {
                            value = 1
                        }
                        this.setState({
                            duration: value
                        })
                        return;
                    }     
                    //value = durationUnit === 'Hours' ? value/24 : value;
                }               
                this.setState({
                    [key]: value
                })
            }
        } else {
            if(key === 'pricePerChild') {
                this.setState({
                    pricePerChild: value
                })      
            }
        }     
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

    // // image validation 
    // imageValid = (imageFile) => {
    //     if (!imageFile) {
    //         console.log("image null")
    //         return false;
    //     }
    //     if (!imageFile.name.match(/\.(jpg|jpeg|png)$/)) {
    //         console.log("image extension invalid")
    //         return false;
    //     }
    //     // valid image file content
    //     // file reader for image validation 
    //     let fileReader = new FileReader();
    //     fileReader.onload = e => {
    //         const img = new Image();
    //         // img.onload = () => {
    //         //     return true;
    //         // };
    //         img.onerror = () => {
    //             console.log("image content invalid");
    //             return false;
    //         };
    //         img.src = e.target.result;
    //         // // if nothing wrong, return true
    //         // return true;
    //     };
    //     fileReader.readAsDataURL(imageFile);      
    // }

    // on image change
    onImageChange = (event, index) => {
        if (event.target.files && event.target.files[0]) {
            const imageFile = event.target.files[0];
            // file extension check
            if (!imageFile.name.match(/\.(jpg|jpeg|png)$/)) {
                console.log("image extension invalid");
                toast.warning("Please choose valid image file.");
                return false;
            }
            // image file content check
            // file reader for image validation 
            let fileReader = new FileReader();
            fileReader.onload = e => {
                const img = new Image();
                img.onload = () => {
                    let images = this.state.images;
                    images[index].url = URL.createObjectURL(imageFile);
                    images[index].file = imageFile;
                    this.setState({
                        images: images
                    });
                };
                img.onerror = () => {
                    console.log("image content invalid");
                    toast.warning("Please choose valid image file.");
                    return false;
                };
                img.src = e.target.result;
            };
            fileReader.readAsDataURL(imageFile); 
            // reset input 
            event.target.value = null;
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
        } else {
            toast.info("Must have at least 01 image.")
        }
    }     

    // valid
    valid = () => {
        const { categories, places } = this.state;
        const { tourName, overview} = this.state;
        const { selectedCategories, selectedPlaces } = this.state;
        const { startingLocation, endingLocation, startingAddress, endingAddress, startingTime } = this.state;
        const { pickUpAsChoice, pickUpRange } = this.state;
        const { isPrivate, duration, groupSize, minAdults, pricePerAdult, includeChildren, pricePerChild } = this.state;
        let { itineraries, expenses, images } = this.state;
        itineraries = itineraries.filter(element => (element.title !== '') && (element.content !== ''));
        expenses = expenses.filter(element => element.content !== '');
        images = images.filter(element => element.file !== null);

        // valid flags
        let tourNameValid = false, overviewValid = false;
        let categoryValid = false, placeValid = false;
        let locationsValid = false, startTimeValid = false, priceValid = false;
        let itineraryValid = false, expenseValid = false, imagesValid = false;

        if(tourName !== '') tourNameValid = true;
        if(overview !== '') overviewValid = true;
        if(selectedCategories.length > 0) categoryValid = true;
        if(selectedPlaces.length > 0) placeValid = true;

        if(pickUpAsChoice === true && pickUpRange.id !== 0) {
            locationsValid = true;
        }
        if(pickUpAsChoice === false) {
            locationsValid = (startingLocation !== '') && (startingAddress !== '') &&
            (endingLocation !== '') && (endingAddress !== '');
        }
        if(startingTime !== '') startTimeValid = true;
        if(pricePerAdult > 0)   priceValid = true;

        if(itineraries.length > 0) itineraryValid = true;
        if(expenses.length > 0) expenseValid = true;
        if(images.length > 0) imagesValid = true;
        // if(images.length > 0) {
        //     // image content valid 
        //     for(let i = 0; i < images.length; i++) {

        //     }
        // }


        // set state for valid flags:
        this.setState({
            tourNameValid: tourNameValid, overviewValid: overviewValid,
            categoryValid: categoryValid, placeValid: placeValid,locationsValid: locationsValid, 
            startTimeValid: startTimeValid, priceValid: priceValid,
            itineraryValid: itineraryValid, expenseValid: expenseValid, imagesValid: imagesValid
        })

        return tourNameValid && overviewValid && categoryValid && placeValid &&
               locationsValid && startTimeValid && priceValid &&
               itineraryValid && expenseValid && imagesValid;
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

        if(!this.valid()) {
            toast.warning('Please fill all information!');
            return;
        }
        this.setState({
            isCreating: true
        })
        // change starting time format
        let period = startingTime.getHours() >= 12 ? 'PM' : 'AM';
        let hour = startingTime.getHours() % 12;
        let minute = startingTime.getMinutes() < 10 ? '0'+startingTime.getMinutes() : startingTime.getMinutes();
        let startTime = `${hour}:${minute} ${period}`;

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
            }, 1000)
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
        const { tourName, overview} = this.state;
        const { isPrivate, includeChildren } = this.state;
        const { categories, places, checkedCategoryStates, checkedPlaceStates } = this.state;
        const { startingAddress, endingAddress, pickUpAsChoice, pickUpRange } = this.state;
        const { startingTime } = this.state;
        const { duration, durationUnit } = this.state;
        const { groupSize, minAdults, pricePerAdult, pricePerChild } = this.state;
        const { selectedPlaces } = this.state;
        const { itineraries, expenses, images } = this.state;        
        const { isCreating } = this.state;
        const { tourNameValid, overviewValid, categoryValid, placeValid,
            locationsValid, startTimeValid, itineraryValid, expenseValid, imagesValid } = this.state;

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
                        <span className={tourNameValid ? "valid-label" : "valid-label invalid"}>*This field is required.</span>
                    </div>
                    <div className='form-group'>
                        <label className="form-title">Overview</label>
                        <textarea className="input-area" name='overview' value={overview} onChange={this.handleInputText}/>
                        <span className={overviewValid ? "valid-label" : "valid-label invalid"}>*This field is required.</span>
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
                        <span className={categoryValid ? "valid-label" : "valid-label invalid"}>*Please choose at least 01 category.</span>
                    </div>
                    <div className='form-group'>
                        <label className="form-title">Tourist Sites</label>
                        <div className="places">
                            {
                                places.map((item, index) => {
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
                        <span className={placeValid ? "valid-label" : "valid-label invalid"}>*Please choose at least 01 place.</span>
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
                    <span className={locationsValid ? "valid-label" : "valid-label invalid"}>*Please provide valid locations and try again.</span>                    
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
                        <span className={startTimeValid ? "valid-label" : "valid-label invalid"}>*This field is required.</span>                       
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
                            <label className="form-title">Price per Adult ($)</label>
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
                            <label className={includeChildren ? 'form-title' : 'form-title disabled'}>Price per Child ($)</label>
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
                        <span className={itineraryValid ? "valid-label" : "valid-label invalid"}>*Please provide tour's itinerary.</span>
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
                        <span className={expenseValid ? "valid-label" : "valid-label invalid"}>*Please provide tour's expense.</span>
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
                                                <input 
                                                    className='image-input' 
                                                    id={`image-${index}`} 
                                                    type='file' 
                                                    accept="image/png, image/jpg, image/jpeg"
                                                    onChange={(event)=>this.onImageChange(event, index)}
                                                />
                                                <span className='remove-image' onClick={()=>this.handleRemoveImageClick(index)}><GrClose/></span>
                                            </div>
                                            <span className='image-name'>{index===0 ? 'Thumbnail' : `Image ${index}`}</span>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <p className="more-btn" onClick={this.handleMoreImageClick}>More...</p>
                        <span className={imagesValid ? "valid-label" : "valid-label invalid"}>*Please provide as least 01 image.</span>
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
    { id: 29, categoryName: 'photography tour' },
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

export default connect(mapStateToProps)(withRouter(CreateTour));

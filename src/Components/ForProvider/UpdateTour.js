import React from 'react';
import axios from 'axios';
import PlacePicker from '../PlacePicker';
import ReactLoading from "react-loading";
import { withRouter, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { connect} from 'react-redux';
import { BsTrash } from 'react-icons/bs'
import { GrClose } from 'react-icons/gr'
import { VscAdd } from 'react-icons/vsc'
import { VscEdit } from 'react-icons/vsc'
import { IoIosReturnLeft } from 'react-icons/io'
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import '../../Styles/ForProvider/update-tour.scss'

class UpdateTour extends React.Component {

    state = {
        categories: [],
        places: [],

        tourId: 0,
        tourName: '',
        overview: '',
        isPrivate: false,
        selectedCategories: [],
        selectedPlaces: [],
        checkedCategoryStates: [],
        checkedPlaceStates: [],
        openStartingLocationField: false,
        openEndingLocationField: false,
        startPoint: '',
        endPoint: '',
        startingTime: this.stringToDateTime("8:30 AM"),
        startingLocation: '',
        startingAddress: '',
        endingLocation: '',
        endingAddress: '',
        pickUpAsChoice: false,
        pickUpRange: {id: 0, placeName: ''},
        duration: 1,
        durationUnit: 'Days',
        groupSize: 1,
        minAdults: 1,
        pricePerAdult: 0,
        pricePerChild: 0,
        includeChildren: true,
        itineraries: [ { title: '', content: ''} ],
        expenses: [ { content: '', isIncluded: true } ],
        images: [ { id:0, url: '', newUrl: '', file: null , deleted: false} ],
        isLoading: false,
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

    // places = [];
    // categories =  [];
    baseUrl = this.props.reduxData.baseUrl;

    stringToDateTime(timeAsString) {
        // timeAsString format: 8:30 AM
        let period = timeAsString.slice(-2);
        let hour_minute_str = timeAsString.replace(period, '').trim();
        let hour = parseInt(hour_minute_str.split(':')[0]);
        if(period === 'PM' && hour < 12) {
            hour = hour + 12;
        }
        if(period === 'AM' && hour === 12) {
            hour = 0;
        }
        let minute = parseInt(hour_minute_str.split(':')[1]);
        let date = new Date();
        date.setHours(hour, minute, 0);
        return date;
    }

    async componentDidMount() {
        // call api to get list categories, list places
        await this.getCategories();
        await this.getPlaces();

        const categories = this.state.categories;
        const places = this.state.places;

        // get the tour by id
        const tourId = this.props.match.params.id
        try {
            this.setState({
                isLoading: true
            })
            let res = await axios.get(
                `${this.baseUrl}/api/Tours/${tourId}`
            );       
            console.log('call api')
            //console.log(res);
            const resTour = res.data;
            const pickUpAsChoice = resTour.startPoint.includes('CustomerPoint&');
            let pickUpRange = {id: 0, placeName: ''};
            if(pickUpAsChoice === true) {
                pickUpRange = {id: parseInt(resTour.startPoint.split('&')[1]), placeName: resTour.startPoint.split('&')[2]}
            }
            // set state
            this.setState({
                tourId: resTour.id,
                tourName: resTour.tourName,
                overview: resTour.overview,
                isPrivate: resTour.isPrivate,
                selectedCategories: resTour.categories,
                selectedPlaces: resTour.places,
                startPoint: resTour.startPoint,
                endPoint: resTour.endPoint,
                
                pickUpAsChoice: pickUpAsChoice,
                pickUpRange: pickUpRange,
                startingTime: this.stringToDateTime(resTour.startTime),
                duration: resTour.duration,
                groupSize: resTour.groupSize,
                minAdults: resTour.minAdults,
                pricePerAdult: resTour.pricePerAdult,
                includeChildren: resTour.pricePerChild >= 0,
                pricePerChild: resTour.pricePerChild >= 0 ? resTour.pricePerChild: 0,
                itineraries: resTour.itineraries,
                expenses: resTour.expenses,
                durationUnit: resTour.duration >= 1 ? 'Days' : 'Hours',
                checkedCategoryStates:  categories.map((item) => resTour.categories.filter((element)=>element.id===item.id).length > 0),
                checkedPlaceStates: places.map((item) => resTour.places.filter((element)=>element.id===item.id).length > 0),
                images: resTour.images.map((item) => ({ id: item.id, url: item.url, newUrl: '', file: null, deleted: false }))
            })
        } catch (error) {
            if (!error.response) {
                toast.error("Network error");
                // fake api response
                const resTour = tour_temp;
                this.setState({
                    tour: resTour,
                    adults: resTour.minAdults,
                    price: resTour.pricePerAdult*resTour.minAdults,
                    networkFailed: true,
                });            
                return;
            } 
            if (error.response.status === 404) {
                console.log(error)
            }
            if (error.response.status === 400) {
              console.log(error)
            }
        } finally {
            setTimeout(() => {
                this.setState({
                    isLoading: false
                })
            }, 1000)       
        }  
        
    }

    getCategories = async() => {
        try {
            let res = await axios.get(`${this.baseUrl}/api/Tours/categories`);
            this.setState({
                categories: res.data
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
          this.setState({
                places: res.data
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
                categoryValid: true,
                selectedCategories: [...selectedCategories, item]           
            })
        } else {
            this.setState({
                categoryValid: selectedCategories.length !== 1,
                selectedCategories: selectedCategories.filter((element) => element.id !== item.id)
            })
        }
    }

    // handle place checkbox click
    handlePlaceSelect = (event, item, index) => {
        let placeValid = false;
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
            placeValid = true;
            selectedPlaces = [...selectedPlaces, item]; 
        } else {
            placeValid = selectedPlaces.length !== 1;
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
        } else {    // switch to fixed address
            let openStartingLocationField, openEndingLocationField = false;
            if(this.state.startPoint.includes('CustomerPoint&')) {  // if current startPoint of the tour is pick up as choice
                // set to true to know address should be edit
                openStartingLocationField = true;
                openEndingLocationField = true;
            }
            this.setState({
                pickUpAsChoice: pickUpAsChoice,
                openStartingLocationField: openStartingLocationField,
                openEndingLocationField: openEndingLocationField
            })
        }
    }

    // handle pickup range select
    handlePickUpRangeSelect = (event, item, index) => {
        this.setState({
            pickUpRange: item
        })
    }

    // toggle place picker
    handleAddressEditClick = (event) => {
        const key = event.target.id;
        console.log(key)
        const value = this.state[`open${key}LocationField`];
        this.setState({
            [`open${key}LocationField`]: !value,
        })
        if(key === "Starting") {
            this.setState({
                startingLocation: '',
                startingAddress: ''
            })
        }
        if(key === "Ending") {
            this.setState({
                endingLocation: '',
                endingAddress: ''
            })
        }
    }
    // handle location picking
    onStartingPlacePick = (place) => {
        this.setState({
            startingLocation: place,
            //openStartingLocationField: false
        })
    }
    onEndingPlacePick = (place) => {
        this.setState({
            endingLocation: place,
            //openEndingLocationField: false
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
        // const key = event.target.name;
        // let value = event.target.value;
        // if(key === 'duration') {
        //     const durationUnit = this.state.durationUnit;           
        //     value = durationUnit === 'Hours' ? value/24 : value;
        // }
        // this.setState({
        //     [key]: value
        // })
        const key = event.target.name;
        let value = event.target.value;
        console.log('input number', value);
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
        if(images.filter((element) => element.deleted === false).length < 6) {
            const newId = Math.floor(Math.random()*100) - 100;
            this.setState({
                images: [...images, { id:newId, url: '', newUrl: '', file: null, deleted: false }]
            })
        }
    }

    // on image change
    onImageChange = (event, item) => {    
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
                    let index = images.findIndex(element=>element.id===item.id);
                    images[index].newUrl = URL.createObjectURL(imageFile);
                    images[index].file = imageFile
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
        // if (event.target.files && event.target.files[0]) {
        //     let images = this.state.images;
        //     let index = images.findIndex(element=>element.id===item.id);
        //     images[index].newUrl = URL.createObjectURL(event.target.files[0]);
        //     images[index].file = event.target.files[0];
        //     this.setState({
        //         images: images
        //     });
        // }
    }

    // remove image
    handleRemoveImageClick = (item) => {
        let images = this.state.images;    
        if(images.filter((element) => element.deleted === false).length > 1) {
            let index = images.findIndex(element=>element.id===item.id);
            images[index].deleted = true;
            this.setState({
                images: images
            })
        }else {
            toast.info("Must have at least 01 image.")
        }
    }     

    valid = () => {
        const { tourName, overview} = this.state;
        const { categories, places, selectedCategories, selectedPlaces } = this.state;
        const { startingLocation, endingLocation, startingAddress, endingAddress, startingTime } = this.state;
        const { pickUpAsChoice, pickUpRange } = this.state;
        const { openStartingLocationField, openEndingLocationField } = this.state;
        const { isPrivate, duration, groupSize, minAdults, pricePerAdult, includeChildren, pricePerChild } = this.state;
        let { itineraries, expenses, images } = this.state;
        itineraries = itineraries.filter(element => (element.title !== '') && (element.content !== ''));
        expenses = expenses.filter(element => element.content !== '');
        images = images.filter(element => !((element.file == null && element.id < 0) || (element.deleted === true && element.id < 0)));

        // valid flags
        let tourNameValid = false, overviewValid = false;
        let categoryValid = false, placeValid = false;
        let locationsValid = false, startTimeValid = false, priceValid = false;
        let itineraryValid = false, expenseValid = false, imagesValid = false;

        if(tourName !== '') tourNameValid = true;
        if(overview !== '') overviewValid = true;
        if(selectedCategories.length > 0) categoryValid = true;
        if(selectedPlaces.length > 0) placeValid = true;

        let isStartValid = false;
        let isEndValid = false;
        if(pickUpAsChoice === true){
            if(pickUpRange.id !== 0) {
                locationsValid = true;
            }
        } else { // no pick up as choice
            // check start
            if(openStartingLocationField === true) {    // if start point edit open
                if((startingLocation !== '') && (startingAddress !== '')) {
                    isStartValid = true;
                } else {
                    isStartValid = false;
                }
            } else {    // if end point edit NOT open
                isStartValid = true
            }
            // check end
            if(openEndingLocationField === true) {    // if end point edit open
                if((endingLocation !== '') && (endingAddress !== '')) {
                    isEndValid = true;
                } else {
                    isEndValid = false;
                }
            } else {    // if end point edit NOT open
                isEndValid = true
            }
            locationsValid = isStartValid && isEndValid;
        }
        
        if(startingTime !== '') startTimeValid = true;
        if(pricePerAdult > 0)   priceValid = true;

        if(itineraries.length > 0) itineraryValid = true;
        if(expenses.length > 0) expenseValid = true;
        if(images.length > 0) imagesValid = true;

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
        
        const { tourName, overview } = this.state;
        const { selectedCategories, selectedPlaces } = this.state;
        const { isPrivate, duration, groupSize, minAdults, pricePerAdult, pricePerChild, includeChildren } = this.state;
        const { startingLocation, endingLocation, startingAddress, endingAddress, startingTime } = this.state;
        const { openStartingLocationField, openEndingLocationField } = this.state; // fields to check start/end point change or not
        const { pickUpAsChoice, pickUpRange } = this.state;
        let { itineraries, expenses, images } = this.state;
        itineraries = itineraries.filter(element => (element.title !== '') && (element.content !== ''));
        expenses = expenses.filter(element => element.content !== '');
        images = images.filter(element => !((element.file == null && element.id < 0) || (element.deleted === true && element.id < 0)));
        
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
        let startPoint = this.state.startPoint;   // current start point of tour
        let endPoint = this.state.endPoint;       // current end point of tour
        if(pickUpAsChoice === true) {
            startPoint = `CustomerPoint&${pickUpRange.id}&${pickUpRange.placeName}`;
            endPoint = `CustomerPoint&${pickUpRange.id}&${pickUpRange.placeName}`;
        } else {
            if(openStartingLocationField === true) {
                startPoint = `${startingAddress}, ${startingLocation}`;
            }
            if(openEndingLocationField === true) {
                endPoint = `${endingAddress}, ${endingLocation}`;
            }
        }

        // post to api
        const tourId = this.props.match.params.id;
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
        images.map((item, index) => {
            data.append(`images[${index}].id`, item.id);
            data.append(`images[${index}].file`, item.file);
            data.append(`images[${index}].deleted`, item.deleted);
        })
        
        try {
            let res = await axios.put(
              `${this.baseUrl}/api/Tours/${tourId}`,
              data,
              {
                headers: { Authorization:`Bearer ${token}` }
              }
            );          
            //console.log(res);

            // show toast notify
            toast.success('Update your tour successfully!');
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
            }
            if (error.response.status === 401) {
                console.log(error);
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
        const { duration, durationUnit } = this.state;
        const { groupSize, minAdults, pricePerAdult, pricePerChild } = this.state;
        const { itineraries, expenses, images } = this.state;
        const { startingAddress, endingAddress, pickUpAsChoice, pickUpRange } = this.state;
        const { selectedPlaces } = this.state;
        const { startingTime } = this.state;
        const { startPoint, endPoint } = this.state;
        const { openStartingLocationField, openEndingLocationField } = this.state;
        const { isCreating, isLoading } = this.state;
        const { tourNameValid, overviewValid, categoryValid, placeValid,
            locationsValid, startTimeValid, itineraryValid, expenseValid, imagesValid } = this.state;
        
        return (
            <div className='update-tour-container'>
                
                <div className='update-tour-header'>
                    <div className='title'>Tour Information</div>
                    <div className='sub-title'>See and Update your tour information</div>
                </div>
                <div className='update-tour-body'>
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
                        <>
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
                                <label className="form-title">Category</label>
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
                                <div 
                                    className="places"
                                >
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
                                <label className='location-option-name'>
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
                                        {
                                            openStartingLocationField || startPoint.includes('CustomerPoint&') ?
                                            <div className="address-change">
                                                <div className="address-inputs">
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
                                                {
                                                    !startPoint.includes('CustomerPoint&') &&
                                                    <span className="back-btn" id='Starting' onClick={this.handleAddressEditClick}><IoIosReturnLeft/> Back</span>
                                                }
                                            </div>
                                            :
                                            <div className='address-display'>
                                                <input className="input-field address" type='text' value={startPoint} readOnly/>
                                                <span className="edit-btn" id='Starting' onClick={this.handleAddressEditClick}><VscEdit/> Edit</span>
                                            </div>
                                        }
                                    </div>                               
                                    <div className='form-group'>
                                        <label className="form-title--small">Ending</label>
                                        {
                                            openEndingLocationField || endPoint.includes('CustomerPoint&')?
                                            <div className="address-change">
                                                <div className="address-inputs">
                                                    <div className="place-picker-container">
                                                        <PlacePicker onPlacePick={this.onEndingPlacePick}/>
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
                                                {
                                                    !endPoint.includes('CustomerPoint&') &&
                                                    <span className="back-btn" id='Ending' onClick={this.handleAddressEditClick}><IoIosReturnLeft/> Back</span>
                                                }
                                            </div>
                                            :
                                            <div className='address-display'>
                                                <input className="input-field address" type='text' value={endPoint} readOnly/>
                                                <span className="edit-btn" id='Ending' onClick={this.handleAddressEditClick}><VscEdit/> Edit</span>
                                            </div>
                                        }
                                    </div>
                                </>
                            }      
                            <span className={locationsValid ? "valid-label" : "valid-label invalid"}>*Please provide valid locations and try again..</span>                                                    
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
                                        value={Math.round(duration*24)}
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
                                        images.filter((element) => element.deleted === false).map((item, index) => {
                                            return (
                                                <div key={'image'+index} className='tour-image-wrapper'>
                                                    <div 
                                                        className='tour-image' 
                                                        style={
                                                            item.newUrl.length === 0 ?
                                                            {                                                  
                                                                backgroundImage: `url('${this.baseUrl+item.url}')`
                                                            }
                                                            :
                                                            {                                                  
                                                                backgroundImage: `url('${item.newUrl}')`
                                                            }
                                                        }
                                                    >
                                                        <label className='overlay-click' htmlFor={`image-${index}`}>
                                                            {item.newUrl.length===0 && item.url.length===0 && <VscAdd/>}
                                                        </label>
                                                        <input 
                                                            className='image-input' 
                                                            id={`image-${index}`} 
                                                            type='file' 
                                                            accept="image/png, image/jpg, image/jpeg"
                                                            onChange={(event)=>this.onImageChange(event, item)}
                                                        />
                                                        <span className='remove-image' onClick={()=>this.handleRemoveImageClick(item)}><GrClose/></span>
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
                                <button className="save-btn" onClick={this.handleOnSave}>SAVE</button>
                                <button className="reset-btn">
                                    <Link to={`/for-provider/tours`}>
                                        Back
                                    </Link>                 
                                </button>
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
                        </>
                    }                            
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

const tour_temp = {
    id: 1,
    tourName: 'HALF-DAY FOODIE TOUR BY BICYCLE & VISIT TRA QUE VEGETABLE VILLAGE',
    overview: 'Take a journey through Hoi An???s culinary history; head out to the beautiful countryside by bicycle'+ 
    'to experience some traditional local food favorites, including the most famous of Hoi An specialties; Cao Lau.'+
    '\n Try the traditional Hoi An specialty, Cao Lau; intoxicating pork noodle broth, featuring sticky rice noodles that must be soaked in water from the oldest well in Hoi An, Ba Le Well.',
    location: 'H???i An, Quang Nam Province, Vietnam',
    destination: 'H???i An, Quang Nam Province, Vietnam',
    reviews: 12,
    rating: 4.4,
    viewCount: 10,
    isPrivate: false,
    minPrice: 45,
    duration: 0.5,
    categories: [ 
        { id: 4, categoryName: 'biking tour' },
        { id: 7, categoryName: 'classic tour' },
        { id: 8, categoryName: 'cooking tour' },
        { id: 11, categoryName: 'culinary tour' }
    ],
    itineraries: [
        {
            id: 1,
            title: 'Part 1',
            content: 'Discover Hoi An???s countryside and its local foods by bicycle. Local foods in Hoi An are known and enjoyed by the tourists once setting foot here. In Hoi An, these cuisines are very popular and sold everywhere in all streets. Moreover, these cuisines are considered as unique symbols for the culture and introduced to every tourist. We bike through the countryside to a Tra Que Village.'
        },
        {
            id: 2,
            title: 'Part 2',
            content: 'Vegetables from this village are distributed to most of the restaurants in town and specially make the Cao Lau to have a perfect taste. Go back to town and learn how to make special ???white rose??? dumpling cakes with a local family and taste your products.'
        },
        {
            id: 3,
            title: 'Part 3',
            content: 'Continue riding to Cam Nam to enjoy the Yin and Yang food such as: Banh Dap (???cracked or smashed rice pancake???), Che Bap (???corn and coconut sweet soup???). We then ride to a famous local restaurant for Hoi An specialty - Cao Lau. Cao Lau is a traditional Hoi An specialty composed of local noodles, pork, fresh vegetables and rice paper.'
        },
        {
            id: 4,
            title: 'Part 4',
            content: 'We will ride back to the company at the end of our trip.'
        }
    ],
    expenses: [
        {
            id: 1,
            isIncluded: true,
            content: 'Hotel pickup and drop-off in Hoi An City Center'
        },
        {
            id: 2,
            isIncluded: true,
            content: 'Transportation with air-conditioning'
        },
        {
            id: 3,
            isIncluded: true,
            content: 'Bicycle'
        },
        {
            id: 4,
            isIncluded: true,
            content: 'Entrance fees'
        },
        {
            id: 5,
            isIncluded: true,
            content: 'Foods and Bottled drinking water'
        },
        {
            id: 6,
            isIncluded: false,
            content: 'Tips and gratuities'
        },
        {
            id: 5,
            isIncluded: false,
            content: 'Personal expenses such as: shopping, telephone, beverage, etc.'
        }
    ],
    images:[
        {
            id: 1,
            url: 'https://hoianexpress.com.vn/wp-content/uploads/2019/12/IMG_9925-870x555.jpg'
        },
        {
            id: 2,
            url: 'https://hoianexpress.com.vn/wp-content/uploads/2019/12/IMG_3740-870x555.jpg'
        }
        ,
        {
            id: 3,
            url: 'https://hoianexpress.com.vn/wp-content/uploads/2019/12/IMG_9892-870x555.jpg'
        }
        ,
        {
            id: 4,
            url: 'https://hoianexpress.com.vn/wp-content/uploads/2019/12/z1577810441855_9034cb5e3abd4c3b6fcebb3b2f4c4ce3-870x555.jpg'
        }
    ],    
    groupSize: 15,
    minAdults: 2,
    pricePerAdult: 89,
    pricePerChild: 30,
    providerId: 1,
    providerName: "Hoi An Express",
    providerAvatar: "https://hoianexpress.com.vn/wp-content/uploads/2020/09/logo-moi.png",
}

const mapStateToProps = (state) => {
    return {
        reduxData: state
    }
}

export default connect(mapStateToProps)(withRouter(UpdateTour));

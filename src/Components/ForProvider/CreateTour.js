import React from 'react';
import PlacePicker from '../PlacePicker'
import { toast } from 'react-toastify';
import { BsTrash } from 'react-icons/bs'
import { GrClose } from 'react-icons/gr'
import { VscAdd } from 'react-icons/vsc'
import '../../Styles/ForProvider/create-tour.scss'

class CreateTour extends React.Component {

    state = {
        isPrivate: false,
        selectedCategories: [],
        selectedPlace: null,
        checkedStates: [],
        showListPlace: false,
        startingLocation: '',
        destinationLocation: '',
        duration: 1,
        durationUnit: 'Days',
        groupSize: 1,
        minAdults: 1,
        itineraries: [ { title: '', content: ''} ],
        expenses: [ { content: '', isIncluded: true } ],
        images: [ { url: '', file: null } ]    
    }

    listPlaces = [];
    categories =  [];

    componentDidMount() {
        // call api to get list categories, list places
        // fake api response
        const resCategories = categories_temp;
        const resPlaces = listPlaces;
        // set the checked states
        var checkedStates;
        // if(this.state.filter.selectedCategories.length !== 0) {
        //     const selected = this.state.filter.selectedCategories;
        //     checkedStates = resCategories.map((item) => selected.filter((element)=>element.id===item.id).length > 0)
        // } else {
        //     checkedStates = new Array(resCategories.length).fill(false);
        // }
        checkedStates = new Array(resCategories.length).fill(false);
        this.categories = resCategories;
        this.listPlaces = resPlaces;
        this.setState({          
            checkedStates: checkedStates
        })
    }

    // toggle tour type
    handleTourType = (event) => {
        this.setState({
            isPrivate: event.target.checked
        })
    }

    // category checkbox click
    handleCategorySelect = (event, item, index) => {
        const isChecked = event.target.checked;
        // set state checkedStates
        const checkedStates = this.state.checkedStates;
        checkedStates[index] = isChecked;
        this.setState({
            checkedStates: checkedStates
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

    // click places menu toggle
    handleDestinationClick = () => {
        let showListPlace = this.state.showListPlace;
        this.setState({
            showListPlace: !showListPlace
        })
    }

    // select 1 destination
    handleDestinationItemSelect = (item) => {
        const selectedPlace = this.listPlaces.filter((element) => element.id === item.id)
        this.setState({
            selectedPlace: selectedPlace[0]
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
            destinationLocation: place
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
        console.log('image index', index);
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
    handleOnSave = () => {
        const {selectedCategories, selectedPlace, startingLocation, destinationLocation} = this.state;
        const {isPrivate, duration, groupSize, minAdults} = this.state;
        let {itineraries, expenses, images} = this.state;
        itineraries = itineraries.filter(element => (element.title !== '') && (element.content !== ''));
        expenses = expenses.filter(element => element.content !== '');
        images = images.filter(element => element.file !== null);

        const isValid = (selectedCategories.length > 0) && (selectedPlace !== null) &&
                        (startingLocation !== '') && (destinationLocation !== '') &&
                        (itineraries.length > 0) && (expenses.length > 0) && (images.length > 0);
        
        if(!isValid) {
            toast.warning('Please fill all information!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                progress: undefined,
            });
            return;
        }
        const newTour = {
            isPrivate: isPrivate,
            duration: duration,
            groupSize: groupSize,
            minAdults: minAdults,
            selectedCategories: selectedCategories.map(item => item.id),
            selectedPlace: selectedPlace.id,
            startingLocation: startingLocation,
            destinationLocation: destinationLocation,
            itineraries: itineraries,
            expenses: expenses,
            images: images.map(item => item.file)
        }
        // post to api
        console.log('New tour: ', newTour);
        // show toast notify
        toast.success('Create your tour successfully!', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            progress: undefined,
        });
    }

    render() {
        const categories = this.categories;
        const listPlaces = this.listPlaces;
        const { isPrivate, checkedStates, showListPlace } = this.state;
        const { duration, durationUnit } = this.state;
        const { groupSize, minAdults} = this.state;
        const { selectedPlace } = this.state;
        const { itineraries, expenses, images } = this.state;
        const isPlaceSelected =  selectedPlace && selectedPlace !== 'null' && selectedPlace !== 'undefined';
        return (
            <div className='create-tour-container'>
                <div className='create-tour-header'>
                    <div className='title'>Create new tour</div>
                    <div className='sub-title'>Create your new tour with detailed information</div>
                </div>
                <div className='create-tour-body'>
                    <div className='form-group'>
                        <label className="form-title tour-name">Tour name</label>
                        <input className="input-field tour-name" name='name' type='text'/>
                    </div>
                    <div className='form-group'>
                        <label className="form-title">Overview</label>
                        <textarea className="input-area" name='overview'/>
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
                    <div className='form-group'>
                        <label className="form-title">Main Tourist Site</label>
                        <div 
                            className="place"
                            onClick={() => this.handleDestinationClick()}
                        >
                            <div>
                                <label>
                                {
                                    isPlaceSelected ?
                                    selectedPlace.placeName
                                    :
                                    'Select place...'
                                }
                                </label>
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
                    </div>
                    <div className='form-group'>
                        <label className="form-title">Starting Location</label>
                        <div className="place-picker-container">
                            <PlacePicker onPlacePick={this.onStartingPlacePick}/>
                        </div>
                    </div>
                    <div className='form-group'>
                        <label className="form-title">Destination</label>
                        <div className="place-picker-container">
                            <PlacePicker onPlacePick={this.onDestinationPlacePick}/>
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
                                        <div className='tour-image-wrapper'>
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
                    <button className="save-btn" onClick={this.handleOnSave}>CREATE</button>
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

export default CreateTour;
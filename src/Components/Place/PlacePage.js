import React from 'react';
import HeaderNav from '../Header/HeaderNav';
import TravelTip from './TravelTip';
import TopTours from '../HomePage/TopTours';
import TouristSiteList from './TouristSiteList';
import Map from '../Map';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import ReactMapGL, { Marker }   from 'react-map-gl';
import Slider from 'react-slick';
import Speech from 'react-speech';
import { Left, Right } from '../Header/Arrows';
import MapMarker from '../../Images/map-marker.jpg'
import "../../Styles/place-page.scss";

class PlacePage extends React.Component {

    state = {        
        place: {},
        temperature: '',
        weatherIconUrl: '',
        expandOverview: false,
        expandVideoSection: false,
        viewport: {
            width: "100%",
            height: "100%",
            latitude: 42.430472,
            longitude: -123.334102,
            zoom: 12
        }
    }

    googleMapApiKey = 'AIzaSyCnqmCh9e-OgrVje1EzceHJKtiG4J38oh0';
    mapboxToken = "pk.eyJ1IjoibmdvbHV1cXVvY2RhdCIsImEiOiJjbDM0MzNldTYwMDFnM2ptcTU1aHVnN3ljIn0.CxQxo8WP9r2f4xkPPsfX4g";
    openWeatherApiKey = '8d2de98e089f1c28e1a22fc19a24ef04';
    baseUrl = this.props.reduxData.baseUrl;

    async componentDidMount () {
        // cancel the ongoing speech
        speechSynthesis.cancel();
        // call api to get place
        const placeId = this.props.match.params.id
        try {
            let res = await axios.get(`${this.baseUrl}/api/Places/${placeId}`);
            this.setState({
                place: res.data,
                viewport: {
                    width: "100%",
                    height: "100%",
                    latitude: res.data.latitude,
                    longitude: res.data.longitude,
                    zoom: 12
                }
            }) 
        } catch (error) {
            if (!error.response) {
                toast.error("Network error");
                // fake api response
                this.baseUrl = '';
                this.setState({
                    place: place_temp,
                    viewport: {
                        width: "100%",
                        height: "100%",
                        latitude: place_temp.latitude,
                        longitude: place_temp.longitude,
                        zoom: 12
                    }
                })            
                return;
            } 
        }
          
        // set interval call get weather
        var intervalId = setInterval(async() => this.getWeather(), 600000);     
        // store intervalId in the state so it can be accessed later:
        this.setState({intervalId: intervalId});
    }

    componentDidUpdate (prevProps, prevState) {
        // call api to get temperature
        if(prevState.place !== this.state.place) {
            this.getWeather();
        }
    }

    componentWillUnmount() {
        // use intervalId from the state to clear the interval
        clearInterval(this.state.intervalId);
        // cancel the ongoing speech
        speechSynthesis.cancel();
    }

    // call openweatherapi to get weather info
    getWeather = async () => {
        const place = this.state.place;
        if(!(place.latitude && place.longitude)) {
            return 
        }
        const { latitude, longitude } = this.state.place;
        try {
            let res = await axios.get(`http://api.openweathermap.org/data/2.5/weather?units=metric&lat=${latitude}&lon=${longitude}&appid=${this.openWeatherApiKey}`);
            console.log(res)
            this.setState({
                temperature: Math.round(res.data.main.temp),
                weatherIconUrl: `http://openweathermap.org/img/w/${res.data.weather[0].icon}.png` ,
            })

        } catch (error) {
            console.log(error)
            if(!error.response) {
                if (error.response.status === 404) {              
                    console.log("Can not find out this city...");
                }
            }
        }
    }

    // toggle expand overview
    toggleExpandOverview = () => {
        this.setState({
            expandOverview: !this.state.expandOverview
        })
    }

    // toggle expand video section
    toggleExpandVideoSection = () => {
        this.setState({
            expandVideoSection: !this.state.expandVideoSection
        })
    }

    // see all tours in place
    seeToursInPlace = () => {
        const { id, placeName } = this.state.place;
        const filter = {
            selectedPlace: {
              id: id,
              placeName: placeName
            },
            startDate: new Date(),
            endDate: new Date(),
            keyword: '',
            priceRange: [0, 3000],
            selectedCategories: [],
            isPrivate: false,
            matchAll: false
          }
          this.props.history.push('/tours', {filter: filter});
    }
    

    render() {
        const { place, temperature, weatherIconUrl } = this.state;
        const thumbnailUrl = `url(${this.baseUrl+place.thumbnailUrl})`;       
        const { expandOverview, expandVideoSection } = this.state;

        return (         
            <div className="App">
                <div className="place-page__header"
                    style={{
                        backgroundImage: thumbnailUrl
                    }}
                >
                    <div className='header-background-overlay'></div>
                    <HeaderNav />
                    <div className='place-page__title'>
                        <div className='place-weather'>
                            <img className='weather-icon' src={weatherIconUrl}></img>
                            <h3 className='place__temperature'>{temperature ? `${temperature}° C` : String.fromCharCode(160)}</h3>
                        </div>
                        <h1 className='place__name'>{place.placeName}</h1>
                    </div>
                </div>
                <div className='place-page__content'>
                    <div className='place-page__overview-section'>
                        <h1 className='section__title'>Overview</h1>      
                        <p className='reminder-text'>
                            You can listen to this content while visit other parts of this page.
                            Find a player on the left corner of your screen!
                        </p>                                        
                        <div className='speech-section'>
                            <Speech 
                                stop={true}
                                pause={true}
                                resume={true}
                                text={place.description ? place.description.join(' ') : 'description'}
                                pitch={2}
                                lang={'EN-US'}
                            />
                        </div>
                        <div className='overview-text-map-wrapper'>
                            <div className='overview-left'>
                                <div className={expandOverview ? 'overview-section__content expand' : 'overview-section__content'}>                           
                                {
                                    place.description &&
                                    place.description.map((item, index) => {
                                        return(
                                            <p key={'overview'+index} className='overview-paragraph'>{item}</p>
                                        )
                                    })
                                }
                                </div>     
                                {
                                    !expandOverview && 
                                    <p style={{fontSize: '18px', marginTop: '10px'}}>...</p>
                                }                 
                                <span className='expand-collapse-overview' onClick={this.toggleExpandOverview}>
                                    {expandOverview ? 'Collapse' : 'Show more'}
                                </span>
                            </div>
                            <div className='overview-right'>
                                {/* <div className='place-page__map-section'> */}
                                    {/* <h1 className='section__title'>Location</h1> */}
                                    <div className='map-wrapper'>
                                        {
                                            place.latitude && place.longitude &&
                                            <ReactMapGL 
                                                {...this.state.viewport}
                                                mapboxApiAccessToken={this.mapboxToken}
                                                mapStyle="mapbox://styles/mapbox/streets-v11"
                                                onViewportChange={(viewport => this.setState({viewport: viewport}))}
                                            >
                                                <Marker
                                                    latitude={place.latitude}
                                                    longitude={place.longitude}
                                                    offsetLeft={-20}
                                                    offsetTop={-30}
                                                >
                                                    <img src={MapMarker} alt="pin" height="30px" width="30px" />
                                                </Marker>
                                            </ReactMapGL>
                                            // <Map 
                                            //     latitude={place.latitude}
                                            //     longitude={place.longitude}
                                            //     defaultZoom={12}
                                            //     googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${this.googleMapApiKey}`}
                                            //     loadingElement={<div style={{ height: `100%` }} />}
                                            //     containerElement={<div style={{ height: `500px`, margin: `auto`, border: '1px solid black' }} />}
                                            //     mapElement={<div style={{ height: `100%` }} />}
                                            // />
                                        }
                                    </div>
                                {/* </div> */}
                            </div>
                        </div>                   
                    </div>
                    <div className='place-page__image-section'>
                        {/* <h1 className='section__title'>The beauty of {place.placeName}</h1> */}
                        <ImageSlider backgroundImagesData={place.images} baseUrl={this.baseUrl}/>
                    </div>
                    <div className='place-page__travel-tips-section'>
                        <h1 className='section__title'>Travel tips</h1>
                        <h3 className='section__sub-title'>Our tips that help you have a good experience in {place.placeName}!</h3>
                        <div className='travel-tips__content'>
                            {
                                place.travelTips &&
                                place.travelTips.map((item) => {
                                    return(
                                        <TravelTip key={item.id} travelTip={item}/>
                                    )
                                })
                            }
                        </div>
                    </div>           
                    <div className='place-page__360-video-section'>
                        <h1 className='section__title'>Experience</h1>
                        <h3 className='section__sub-title'>Take an overview look of {place.placeName} through a 360 view!</h3>
                        {
                            expandVideoSection &&
                            <div className='video-wrapper'>
                                <dl8-video
                                    title={place.placeName}
                                    format="MONO_360"
                                    className={'dl8-video-player'}
                                    width={'100%'}
                                    height={'80vh'}
                                >
                                    <source src="https://localhost:7079/storage/HoiAn360.mp4" type="video/mp4" />
                                </dl8-video>
                            </div>
                        }
                        <button
                            className={!expandVideoSection ? 'expand-collapse-video-section' : 'expand-collapse-video-section--close'}
                            onClick={this.toggleExpandVideoSection}
                        >
                            {
                                !expandVideoSection ? 
                                'Watch video!'
                                :
                                'Collapse'
                            }
                        </button>
                    </div>
                    <div className='place-page__top-tours-section'>
                        {
                            place.id &&
                            <TopTours 
                                count={8} 
                                placeId={place.id} 
                                width='100%'
                                subTitle={`Top popular tours in ${place.placeName} that you may like!`}
                            />
                        }
                        <span className='see-all-tours' onClick={this.seeToursInPlace}>
                            Explore more available tours in {place.placeName}!
                        </span>
                    </div>
                    <div className='place-page__tourist-sites-section'>
                        <h1 className='section__title'>Tourist sites</h1>
                        <h3 className='section__sub-title'>Want to explore more? See some famous sites in {place.placeName}!</h3>
                        {
                            place.id &&
                            <TouristSiteList placeId={place.id} />
                        }
                    </div>
                </div>				
            </div>
        );
    }
}

class ImageSlider extends React.Component {
    render() {
      const backgroundImagesData = this.props.backgroundImagesData;
      const baseUrl = this.props.baseUrl;
      var settings = {
        fade: true,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        nextArrow: <Right />,
        prevArrow: <Left />
      };
      return (
        <Slider {...settings}>
            {
                backgroundImagesData &&
                backgroundImagesData.map((item) => {
                    return (                      
                        <BackgroundImageDiv key={item.id} url={baseUrl+item.url} />
                    )
                })
            }
        </Slider>
      );
    }
}

class BackgroundImageDiv extends React.Component {
    render() {
      const url = `url(${this.props.url})`;
      return (
        <div
          className="place-image"
          style={{
            backgroundImage: url
          }}
        />
      );
    }
}

const place_temp = {
    id: 3,
    placeName: "Hoi An", 
    thumbnailUrl: "https://hoianexpress.com.vn/wp-content/uploads/2016/08/BP_2444.jpg",
    description: [
        "Possibly the most beautiful town in Vietnam and definitely the most atmospheric heritage town, Hoi An (which means ‘peaceful place’ in Vietnamese) has the perfect combination of old-world charm and modern-day comforts and luxuries. This historical town is gloriously devoid of high-rises and ugly concrete buildings thanks to its Unesco World Heritage Site status. Chinese merchant shop fronts dating as far back as the 15th Century encase shops, restaurants, art galleries, museums and especially tailors, ensuring Hoi An has something to suit all tastes.",
        "What really makes Hoi An live up to its ‘peaceful place’ name is the blissful ban on motorbikes and scooters in the old town during certain parts of the day and most of the evening.",
        "The Venice of Vietnam.",
        "One of the biggest factors in creating the rich cultural history that brings such a special ambience to Hoi An, is the river that it’s built around. The ‘Thu Bon’ river has been responsible for bringing in foreign traders and settlers from far-flung places for hundreds of years and brings a beautiful, romantic, ‘Venice of Vietnam’ quality to the town.",
        "A Culinary Mecca & Shopper’s Paradise.",
        "Several centuries of foreign trade has influenced the local cuisine as well as the architecture, earning Hoi An the reputation as a culinary mecca. Hoi An’s narrow streets offer a dazzling array of eateries ranging from traditional local cuisine to regional favourites, western fare and just about everything in between.",
        "Hoi An is also a heaven for shopaholics; talented tailors can whip up bespoke suits, dresses, skirts and shirts for a fraction of the price they’d cost back home."
    ],
    latitude: 15.87944,
    longitude: 108.335,
    images: [
        {
          "id": 1,
          "url": "https://hoianexpress.com.vn/wp-content/uploads/2016/08/BP_2444.jpg"
        },
        {
          "id": 2,
          "url": "https://media.myquangnam.vn/resources/portal/Images/QNM/qlquantri/55_diem_hoi_an/pho_co_hoi_an/dao_pho_co_hoi_an_ngo_thanh_minh_502858808.jpg"
        },
        {
          "id": 3,
          "url": "https://media.myquangnam.vn/resources/portal/Images/QNM/qlquantri/55_diem_hoi_an/pho_co_hoi_an/anh_trang_pho_hoi_nguyen_ngoc_quang_702591255.jpg"
        },
        {
          "id": 4,
          "url": "https://media.myquangnam.vn/resources/portal/Images/QNM/qlquantri/buoi_sang_yen_binh_tren_pho_co_trinh_nhan_hieu_835907189.jpg"
        }
    ],
    travelTips: [
        {
            "id": 1,
            "title": "Transportations in Hoi An",
            "content": "You can visit Hoi An by taxi, motorbike, bicycle, cyclo, or walking. If you choose to use a motorbike, remember to know clearly about some streets where the motorbikes are crossing prohibited. In the evening, it will be great if you walk along the Thu Bon river to admire the stunning beauty of Hoi An at night. Another choice that you can go by cyclo but when walking you can save your expenses and enjoy street foods here."
        },
        {
            "id": 2,
            "title": "Should pay in VND",
            "content": "Some hotels, restaurants, and shops may accept payment in USD, but you should always pay in VND. If something is priced in VND, then you should definitely pay for it in VND because using any other currency will lead to terrible exchange rates. As advised, the best place to get VND in Hoi An is at gold/jewelry shops and banks, or from ATMs."
        },
        {
            "id": 3,
            "title": "Weather in Hoi An",
            "content": "If you are visiting during the hot summer months, don’t forget to hydrate. In summer, the temperature can reach 34-37C. Made sure each of us had 2L bottle of water and drank all of it by the end of each day. The best time to visit Hoi An is from February to July, with low rainfall and amicable weather. The period from May to July can be extremely hot, but with the cool breeze from the ocean and the low intensity of buildings, Hoi An is just as nice to visit."
        }
        ,
        {
            "id": 4,
            "title": "Dress sensibly",
            "content": "T-shirts and shorts are okay almost anywhere, but it’s preferable to wear longer trousers and cover your shoulders if you’re visiting temples and other holy places. Likewise, bikinis and swim-shorts are fine on the beach, but refrain from dressing scantily in towns or on the street."
        }
    ],
    tourCount: 6,
    subTouristSiteCount: 4
}

const mapStateToProps = (state) => {
    return {
        reduxData: state,
    };
};

export default connect(mapStateToProps)(withRouter(PlacePage))
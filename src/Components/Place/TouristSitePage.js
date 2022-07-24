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
import { VscLocation } from 'react-icons/vsc';
import { BsClock, BsPeople, BsTag } from 'react-icons/bs';
import { FaHandPointRight } from 'react-icons/fa'
import { Left, Right } from '../Header/Arrows';
import MapMarker from '../../Images/map-marker.jpg'
import "../../Styles/tourist-site-page.scss";

class TouristSitePage extends React.Component {

    state = {        
        site: {},
        temperature: '',
        weatherIconUrl: '',
        expandOverview: false,
        expandVideoSection: false,
        viewport: {
            width: "100%",
            height: "100%",
            latitude: 42.430472,
            longitude: -123.334102,
            zoom: 14
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
        const siteId = this.props.match.params.id
        try {
            let res = await axios.get(`${this.baseUrl}/api/Places/touristSites/${siteId}`);
            this.setState({
                site: res.data,
                viewport: {
                    width: "100%",
                    height: "100%",
                    latitude: res.data.latitude,
                    longitude: res.data.longitude,
                    zoom: 14
                }
            }) 
        } catch (error) {
            if (!error.response) {
                toast.error("Network error");
                // fake api response
                this.baseUrl = '';
                this.setState({
                    site: {},
                    viewport: {
                        width: "100%",
                        height: "100%",
                        latitude: 42.430472,
                        longitude: -123.334102,
                        zoom: 14
                    }
                })            
                return;
            } 
        }
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
    
    // toggle expand video section
    toggleExpandVideoSection = () => {
        this.setState({
            expandVideoSection: !this.state.expandVideoSection
        })
    }

    seePlace = () => {
        const { placeId } = this.state.site;

          this.props.history.push(`/places/${placeId}`);
    }

    render() {
        const { site, temperature, weatherIconUrl } = this.state;
        let thumbnailUrl = '';    
        if(site.images) {
            if(site.images[0].url.includes('/storage')) {
                thumbnailUrl = `url(${this.baseUrl+site.images[0].url})`             
            }
            if(site.images[0].url.includes('http')) {
                thumbnailUrl = `url(${site.images[0].url})`
            }
        }
        const { expandOverview, expandVideoSection } = this.state;

        return (         
            <div className="App">
                <div className="tourist-site-page__header"
                    style={{
                        backgroundImage: thumbnailUrl
                    }}
                >
                    <div className='header-background-overlay'></div>
                    <HeaderNav />
                    <div className='tourist-site-page__title'>
                        <div className='place-weather'>
                            <img className='weather-icon' src={weatherIconUrl}></img>
                            <h3 className='place__temperature'>{temperature ? `${temperature}° C` : String.fromCharCode(160)}</h3>
                        </div>
                        <h1 className="tourist-site__name">{site.siteName}</h1>
                    </div>
                </div>	
                <div className="tourist-site-page-container">                                   
                    <div className="tourist-site__overview">
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
                                text={site.description ? site.description.join(' ') : 'description'}
                                pitch={2}
                                lang={'EN-US'}
                            />
                        </div>
                        <div className={'overview__content'}>                           
                        {
                            site.description &&
                            site.description.map((item, index) => {
                                return(
                                    <p key={'overview'+index} className='overview-paragraph'>{item}</p>
                                )
                            })
                        }
                        </div> 
                    </div>
                    <div className="tourist-site__main-info">
                        <p className="tourist-site__address">
                            <VscLocation className='icon-location'/>{site.address}
                        </p>
                        <p className="tourist-site__open-close">
                            {
                                site.openCloseTime && site.openCloseTime !== 'None' &&
                                <>
                                    <BsClock className='icon-time'/> Open {site.openCloseTime.split('-')[0].trim()}
                                    <span style={{display: 'inline-block', width: '40px'}}></span>
                                    <BsClock className='icon-time'/> Close {site.openCloseTime.split('-')[1].trim()}
                                </>
                            }
                        </p>
                    </div>   
                    <div className="tourist-site__images">
                        <ImageSlider backgroundImagesData={site.images} baseUrl={this.baseUrl} />
                    </div>
                    <div className="tourist-site__tips">
                        <h1 className='section__title'>Things you should know</h1>                                           
                        <div className={'tips__content'}>                           
                        {
                            site.highLights &&
                            site.highLights.map((item, index) => {
                                return(
                                    <div className='tips-item'>
                                        <div className='icon-point-wrapper'><FaHandPointRight /></div>                                      
                                        <p key={'tips'+index} className='tips-item-text'>{item}</p>
                                    </div>
                                )
                            })
                        }
                        </div> 
                    </div>
                    {/* <div className='tourist-site-page__360-video-section'>
                        <h1 className='section__title'>Experience</h1>
                        <h3 className='section__sub-title'>Take an overview look of this tourist site through a 360 view!</h3>
                        {
                            expandVideoSection &&
                            <div className='video-wrapper'>
                                <dl8-video
                                    title={site.siteName}
                                    format="MONO_360"
                                    className={'dl8-video-player'}
                                    width={'100%'}
                                    height={'80vh'}
                                >
                                    <source src={`${this.baseUrl+site.overviewVideoUrl}`} type="video/mp4" />
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
                    </div> */}
                    <div className='tourist-site-page__360-video-section'>
                        <h1 className='section__title'>Location</h1>
                    </div>
                        {/* <h1 className='section__title'>Location</h1> */}
                    <div className='tourist-site__map'>
                        <div className='map-wrapper'>
                            {
                                site.latitude && site.longitude &&
                                <ReactMapGL 
                                    {...this.state.viewport}
                                    mapboxApiAccessToken={this.mapboxToken}
                                    mapStyle="mapbox://styles/mapbox/streets-v11"
                                    onViewportChange={(viewport => this.setState({viewport: viewport}))}
                                >
                                    <Marker
                                        latitude={site.latitude}
                                        longitude={site.longitude}
                                        offsetLeft={-20}
                                        offsetTop={-30}
                                    >
                                        <img src={MapMarker} alt="pin" height="30px" width="30px" />
                                    </Marker>
                                </ReactMapGL>
                            }
                        </div>
                    </div>
                    <span className='see-place' onClick={this.seePlace}>
                        Discover other interesting things in <span className='place-name'>{site.placeName}!</span>
                    </span>
                    <br></br>
                    <br></br>
                    <br></br>
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
                        <BackgroundImageDiv 
                            key={item.id} 
                            url={item.url.includes('http') ? item.url : baseUrl+item.url} 
                        />
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
          className="site-image"
          style={{
            backgroundImage: url
          }}
        />
      );
    }
}


const mapStateToProps = (state) => {
    return {
        reduxData: state,
    };
};

export default connect(mapStateToProps)(withRouter(TouristSitePage))
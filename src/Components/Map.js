import React from 'react'
import { withGoogleMap, withScriptjs, GoogleMap, Marker } from "react-google-maps"

class Map extends React.Component {
  
  render() {
    let { latitude, longitude, defaultZoom } = this.props;
    if(!latitude) {
      latitude = -34.397;
    }
    if(!longitude) {
      longitude = 150.644;
    }
    if(!defaultZoom) {
      defaultZoom = 8;
    }
    return (
      <div>
        <GoogleMap
            defaultZoom={defaultZoom}
            defaultCenter={{ lat: latitude, lng: longitude }}
            defaultOptions={{mapTypeControl: false, streetViewControl: false}}            
          >
            <Marker
                // icon={{
                //   url: 'https://insulationpads.co.uk/wp-content/uploads/2017/10/Home.png',
                //   scaledSize: new window.google.maps.Size(40, 40),
                // }}
                position={{ lat: latitude, lng: longitude }}
            />
        </GoogleMap>
      </div>
    );
  }
}

export default withScriptjs(withGoogleMap(Map));
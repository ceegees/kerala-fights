
import  React,{ Component } from 'react';   

export default class GoogleMapWidget extends Component {
    constructor(arg){
        super(arg);
        this.map = null;
        this.marker = null;

        this.setMarker = this.setMarker.bind(this);
        this.onChangePosition = this.onChangePosition.bind(this);
    }
    componentDidMount () {
        const {location = {lat:10.034,lng : 76.32460} } = this.props;
        this.initialiseGMap(location);
    }

    componentWillReceiveProps(nextProps) {

        // if (nextProps.location && nextProps.location != this.props.location) {
        //     this.setMarker(nextProps.location);
        //     return;
        // }
 
        if (nextProps.place == this.props.place) {
            return;
        }
    
        const {place} = nextProps;
        if (!place) {
            return;
        }

        this.marker.setVisible(false);
        if (place.geometry.viewport) {
            this.map.fitBounds(place.geometry.viewport);
        } else {
            this.map.setCenter(place.geometry.location);
            this.map.setZoom(17);  
        }

        this.setMarker({
            lat:place.geometry.location.lat(),
            lng:place.geometry.location.lng()
        }); 
    }

    setMarker(location){  
        if (this.marker == null) {
            this.marker = new google.maps.Marker({
                position: location,
                map: this.map,
                draggable:  this.props.locationSelect ? true:false
            });

            google.maps.event.addListener(this.marker, 'dragend', (event) => {
                this.onChangePosition(this.marker.getPosition())
            });
        } else {                    
            this.marker.setPosition(location);
        }
        if (this.props.locationSelect){
            this.props.locationSelect(location.lat,location.lng);  
        }
        this.map.setCenter(location);
        this.marker.setVisible(true);
    }

    onChangePosition(location) {
        if(!this.props.locationSelect){
            return;
        }
        let geocoder = new google.maps.Geocoder();
        geocoder.geocode({
            latLng: location
        }, (responses) => {
            if (responses && responses.length > 0) {
                if (this.props.locationSelect){
                    this.props.locationSelect(location.lat(),location.lng(), responses[0]);  
                }
            } else { 
                if (this.props.locationSelect){
                    this.props.locationSelect(location.lat(),location.lng());  
                }
            }
        });
    }

    initialiseGMap (location) { 
        if (this.map){
            return;
        }

        this.map = new google.maps.Map(document.getElementById(this.props.mapId), {
            center: location,
            zoom: 10    ,
            zoomControl: true,
            scaleControl:true,
            mapTypeControl: false,
            streetViewControl: false,
            rotateControl: false,
            fullscreenControl: true,
            styles: [{
                featureType: 'poi',
                stylers: [{ visibility: 'off' }]  // Turn off points of interest.
            }, {
                featureType: 'transit.station',
                stylers: [{ visibility: 'off' }]  // Turn off bus stations, train stations, etc.
            }],
        });

        this.map.addListener('click',  (e) => {
            this.setMarker({lat:e.latLng.lat(),lng:e.latLng.lng()});
        }); 
        this.setMarker(location);        
    }

    render() {
        return  <div id={this.props.mapId} style={this.props.mapStyle}>
        </div>
    }
}
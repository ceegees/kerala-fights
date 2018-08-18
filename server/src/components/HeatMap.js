import React, { Component } from 'react'; 

import {NavLink,withRouter,Switch,Route} from 'react-router-dom';
import {HeaderSection} from './Helper';
import axios from 'axios';

class HeatMap extends Component {
    constructor(arg){
        super(arg);
        this.map = null;
        this.markers =[];
    }

    fetchData(){
        axios.get('/api/v1/rescue-list?location=1&per_page=3000').then(resp => {
            resp.data.data.list.map(item => {
                if(item.latLng && item.latLng.coordinates && item.latLng.coordinates.length == 2) {
                    var marker = new google.maps.Marker({
                        position: {
                            lat:item.latLng.coordinates[0], 
                            lng:item.latLng.coordinates[1]
                        },
                        map: this.map
                    }); 
                    this.markers.push(marker);
                    console.log('new marker');
                }
            });
        });
    }
    componentDidMount () {
        this.initialiseGMap(10.10,76.65);
        
      
    }
    initialiseGMap (latitude,longitude) {
        if (!this.map){
            this.map = new google.maps.Map(document.getElementById('google-map'), {
                center: {lat: latitude, lng: longitude},
                zoom: 5,
                zoomControl: true,
                scaleControl:true,
                styles: [{
                    featureType: 'poi',
                    stylers: [{ visibility: 'off' }]  // Turn off points of interest.
                }, {
                    featureType: 'transit.station',
                    stylers: [{ visibility: 'off' }]  // Turn off bus stations, train stations, etc.
                }],
            });
            setTimeout(()=> {
                this.fetchData();
            },5000);
        }  
    }
    render() {
        return <div>
            <HeaderSection/>
            <div id="google-map" style={{width:"100vw",height:"100vh"}}></div>
        </div>
    }
}

export default withRouter(HeatMap);
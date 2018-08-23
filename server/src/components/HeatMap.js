import React, { Component } from 'react'; 
import { connect } from 'react-redux';
import {NavLink,withRouter,Switch,Route} from 'react-router-dom';
import {HeaderSection,Reveal,DemanSupplyTab} from './Helper';
import axios from 'axios';   
import AppMessage from './AppMessage.js';
import {getLatLng} from '../redux/actions';
import DetailsModal from './DetailsModal';
import FilterComponent from './FilterComponent';
import {ServiceProviderDetail} from './ServiceProviderList';
import VolunteerDetail from './VolunteerDetail';
import qs from 'query-string';

class HeatMap extends Component {
    constructor(arg){
        super(arg);
        this.state = {
            modal:null,
            data:null,
            tabName:'demand'
        }
        this.map = null;
        this.markerCluster = null;
        this.markers =[];
        this.filter = {};
    }

    fetchData(){
        const {requestTypeList, mapIconList} = this.props;

        const REQUEST_TYPES = requestTypeList.map((reqType) => {
            return reqType.value;
        })

        if(this.markerCluster){ 
            this.markerCluster.removeMarkers(this.markers);
            this.markerCluster.repaint();
        }

        this.markers.map(item =>{
            item.setMap(null);
        });

        this.markers = [];
        const {status = 'new'} = this.props.match.params;

        let obj = {
            location:1,
            status:status,
            per_page:3000
        }
        
        obj = Object.assign(obj,this.filter);
        const str = qs.stringify(obj); 
        axios.get(`/api/v1/rescue-list?${str}`).then(resp => {
            resp.data.data.list.map(item => {
                if (REQUEST_TYPES.indexOf(item.type) == -1) {
                    return;
                }
                var marker = new google.maps.Marker({
                    position: getLatLng(item),
                    map: this.map,
                    icon: (REQUEST_TYPES.indexOf(item.type) != -1)? mapIconList[item.type]['demand'].icon : null,
                }); 
                this.attachInfo(marker, item, 'demand');
                this.markers.push(marker); 
            });
            // this.markerCluster = new MarkerClusterer(this.map, this.markers, {
            //     imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
            // }); 
            this.setState({
                data:resp.data.data
            });
        });

        axios.get(`/api/v1/service-provider-list?${str}`).then(resp => {
            resp.data.data.list.map(item => {
                if (REQUEST_TYPES.indexOf(item.type) == -1) {
                    return;
                }
                var marker = new google.maps.Marker({
                    position: getLatLng(item),
                    icon: (REQUEST_TYPES.indexOf(item.type) != -1)? mapIconList[item.type]['provider'].icon : null,
                    map: this.map
                }); 
                this.attachInfo(marker, item, 'provider');
                this.markers.push(marker); 
            });
        });

        axios.get(`/api/v1/volunteer-list?${str}`).then(resp => {
            resp.data.data.list.map(item => {
                // if (REQUEST_TYPES.indexOf(item.type) == -1) {
                //     return;
                // }
                var marker = new google.maps.Marker({
                    position: {
                        lat: parseFloat(""+item.latitude),
                        lng: parseFloat(""+item.longitude)
                    },
                    icon: (REQUEST_TYPES.indexOf(item.type) != -1)? mapIconList[item.type]['volunteer'].icon : null,
                    map: this.map
                }); 
                this.attachInfo(marker, item, 'volunteer');
                this.markers.push(marker); 
            });
        });
    }
    hideModal(msg){
        this.setState({modal:null})
    }

    handleFilterData(filterData) {
        this.filter = filterData;
        this.fetchData(this.props);
    }

    componentDidUpdate(nextProps,nextState){
        if (nextProps.match.params.status != this.props.match.params.status){
            this.fetchData();
        }
    }

    showDetailModal(item, type){
        switch(type) {
            case 'provider':
                this.setState({
                    modal: (
                        <Reveal onClose={this.hideModal.bind(this)}>
                            <ServiceProviderDetail item={item} hideModal={this.hideModal.bind(this)} />
                        </Reveal>
                    )
                });
                break;
            case 'volunteer':
                this.setState({
                    modal: (
                        <Reveal onClose={this.hideModal.bind(this)}>
                            <VolunteerDetail item={item} hideModal={this.hideModal.bind(this)} />
                        </Reveal>
                    )
                });
                break;
            default :
                this.setState({
                    modal: (
                        <Reveal onClose={this.hideModal.bind(this)}>
                            <DetailsModal item={item}   hideModal={this.hideModal.bind(this)}   />
                        </Reveal>
                    )
                });
        }
        
    }

    attachInfo(marker,item, type='demand'){
        marker.addListener('click', () => {
           this.showDetailModal(item, type);
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

            setTimeout(()=>{
                this.fetchData();
            },2000)
        
        }  
    }
    tabChange(name){
        this.setState({tabName:name});
    }
    render() {
        return <div>
            <AppMessage />
            <HeaderSection authUser={this.props.authUser}>
            <div className="w3-bar w3-teal  kf-top-bar">
                <div className="w3-right "> 
                    {this.props.statusList.map(item=>{
                            return <NavLink key={item.key}
                            activeClassName="active" 
                            className={`w3-bar-item w3-button w3-small ${item.cls}`}
                            to={`/heatmap/${item.key}`}>
                                {item.title}
                        </NavLink>
                    })} 
                </div>
            </div>
            </HeaderSection>
            {this.state.modal}
            <div className="w3-row-padding" >
                <div className="w3-col s12 m9 l3">
                    <FilterComponent data={this.state.data} handleFilterData={this.handleFilterData.bind(this)} />
                </div>
                <div className="w3-col s12 l9 m9">
                    <DemanSupplyTab >
                        <div id="google-map" style={{height:"90vh"}}></div>
                        <iframe  src="https://www.google.com/maps/d/embed?mid=19pdXYBAk8RyaMjazX7mjJIJ9EqAyoRs5" style={{width:"100%",height:"900px"}}/>
                    </DemanSupplyTab>
                </div>
            </div>
        </div>
    }
}

function mapStateToProps(state) {  
    return {
        statusList: state.statusList,
        authUser: state.authUser,
        requestTypeList: state.requestTypeList,
        mapIconList: state.mapIconList
    }
}

export default connect(mapStateToProps)(withRouter(HeatMap))
import  React,{ Component } from 'react';
import { connect } from 'react-redux';
import { FormTextField,FormTextarea,Spinner,SelectField,Reveal, HeaderSection} from './Helper.js';  
import axios from 'axios';
import moment from 'moment';
import {NavLink,Link,withRouter,Switch,Route} from 'react-router-dom';
import qs from 'query-string';

class ServiceProvider extends Component {

    render() {
        const {item} = this.props;

        return (
            <div key={`item_${item.id}`} className="w3-col l4 m6 w3-medium" style={{height: '100%'}}>
                <div className="w3-margin w3-white w3-padding w3-small w3-border" style={{position: 'relative'}}>
                    <strong className="w3-text-gray">Contact Name:</strong> {item.contactName}<br/>
                    <strong className="w3-text-gray">Phone:</strong> {item.phoneNumber}<br/>
                    <strong className="w3-text-gray">Type:</strong> <span className="w3-tag w3-round w3-amber" style={{textTransform: 'capitalize'}}>{item.type.replace(/_/g, ' ')}</span><br/>
                    <strong className="w3-text-gray">Number of People:</strong> {item.peopleCount}<br/>
                    <strong className="w3-text-gray">Number of Kids:</strong> {item.kidsCount}<br/>
                    <strong className="w3-text-gray">Created:</strong> {moment(item.createdAt).fromNow()}<br/>
                    <strong className="w3-text-gray">Service End Date:</strong> {moment(item.serviceEndDate).fromNow()}<br/>
                    <div>
                        <button className="w3-display-bottomright w3-small w3-button w3-blue w3-padding-small" 
                            onClick={e => this.props.showDetailModal(item)}>View Details</button>
                    </div>
                </div>
            </div>
        );
    }
}

export const Paginator = ({page,status,data}) => {
    page = page - 10;
    const pages = [];
    if(page < 1){
        page = 1;
    }
    const lastPage = data.page_max;
    for(var idx = page;idx < page + 18 && idx < lastPage;idx++){
        pages.push(idx);
    }

    if (data.total < data.per_page){
        return <div></div>
    }

    return <div className="w3-bar">
        <NavLink to={`/service-providers/list/1`} className="w3-button">&laquo;</NavLink> 
        {
            pages.map( page=> <NavLink key={`page_${page}`} to={`/service-providers/list/${page}`} 
                className="w3-button">{page}</NavLink> )
        }
        <NavLink to={`/service-providers/list/${lastPage}`} className="w3-button">&raquo;</NavLink>
    </div>
}


class DetailsModal extends Component {

    componentDidMount() {
        const {item} = this.props;
        if (item.latLng && item.latLng.coordinates && item.latLng.coordinates.length == 2){
            this.initialiseGMap(item.latLng.coordinates[0],item.latLng.coordinates[1]);
        }
    }

    initialiseGMap (latitude,longitude) {
        if (!this.map){
            this.map = new google.maps.Map(document.getElementById('google-map-detail'), {
                center: {lat: latitude, lng: longitude},
                zoom: 14,
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
        } 
        this.marker = new google.maps.Marker({
            position: {lat: latitude, lng: longitude},
            map: this.map
        });
        this.map.setCenter({lat:latitude,lng:longitude});
        this.marker.setVisible(true);
    }

    render() {
        const {item} = this.props;

        let leftCont = (
            <div className="w3-col l6 s12">
                <div className="w3-padding-small"><strong className="w3-text-gray">Contact Name:</strong> {item.contactName}</div>
                <div className="w3-padding-small"><strong className="w3-text-gray">Phone Number:</strong> <span>
                    <a className="w3-buttom w3-tag w3-redice w3-round w3-blue" href={`tel:${item.phoneNumber}`}>{item.phoneNumber}</a>
                    </span>
                </div>
                <div className="w3-padding-small"><strong className="w3-text-gray">Type of help:</strong> <span className="w3-tag w3-round w3-amber" style={{textTransform: 'capitalize'}}>{item.type.replace(/_/g, ' ')}</span></div>
                <div className="w3-padding-small"><strong className="w3-text-gray">Address:</strong> 
                    <div className="w3-border w3-padding-small w3-light-gray">{item.address}</div>
                </div>
                <div className="w3-padding-small"><strong className="w3-text-gray">Number of people:</strong> {item.peopleCount}</div>
                <div className="w3-padding-small"><strong className="w3-text-gray">Number of kids:</strong> {item.kidsCount}</div>
                <div className="w3-padding-small"><strong className="w3-text-gray">Number of Females:</strong> {item.femaleCount}</div>
                <div className="w3-padding-small"><strong className="w3-text-gray">Number of Males:</strong> {item.maleCount}</div>
                <div className="w3-padding-small"><strong className="w3-text-gray">More Information:</strong> 
                    {(item.information)?
                        <div className="w3-border w3-padding-small w3-light-gray">{item.information}</div>
                        : null
                    }
                </div>
                <div className="w3-padding-small"><strong className="w3-text-gray">CreatedAt:</strong> {moment(item.createdAt).fromNow()}</div>
                <div className="w3-padding-small"><strong className="w3-text-gray">Service End Date:</strong> {moment(item.serviceEndDate).format('DD-MMM-YYYY')}</div>
            </div>
        );

       return (
            <div className="w3-container w3-padding">   
                <h4 className="w3-center w3-margin-bottom">Service Provider Details</h4>
                <div className="w3-row w3-margin-bottom">
                    {leftCont}
                    <div className="w3-col l6"> 
                        <div id="google-map-detail" style={{minHeight:"250px"}}></div>
                    </div>
                </div>
            </div>
        )
    }
}

class ServiceProviderList extends Component {
    constructor(arg){
        super(arg);
        this.state = {
            data: null,
            modal: null
        }
        this.filter = {}
    }

    fetchData(props){
        let {page=1, status='list', search=''} = props.match.params;
        this.setState({data: null});

        if (status == 'search'){ 
            search = page;
            page = 1;
        }

        const obj = {
            status: status,
            page: page,
            q: search,
        }
        const str = qs.stringify(obj); 
        axios.get(`/api/v1/service-provider-list?${str}`).then(resp=>{
            this.setState({
                data:resp.data.data
            });
        });
    }

    componentDidMount() {
        this.fetchData(this.props);
    }

    searchRequests(e){
        console.log('val',e.target.value)
        if (e.target.value != '') {
            this.props.history.replace('/service-providers/search/'+e.target.value)
        } else {
            this.props.history.replace('/service-providers/list/')
        }
    }

    componentWillReceiveProps(nextProps){
        if (nextProps.match.params != this.props.match.params){ 
            this.fetchData(nextProps);
        }
    }

    handleFilterData(filterData) {
        this.filter = filterData;
        this.fetchData(this.props);
    }

    hideModal(){
        this.setState({modal:null})
    }

    showDetailModal(item){
        this.setState({
            modal: (
                <Reveal onClose={this.hideModal.bind(this)}>
                    <DetailsModal hideModal={this.hideModal.bind(this)} 
                        item={item} />
                </Reveal>
            )
        });
    }

    render() {
        const {data} = this.state;
        const {page=1} = this.props;

        let pagination = null;
        let content = null;
        let totalCount = '';
        if (!data){
            content = <Spinner />
        } else if (data.list.length == 0){
             content = <div className="w3-padding-64 w3-large w3-center">The List is empty</div>
        } else {
            pagination = <Paginator data={data} page={page} />
            totalCount = `Total: ${data.total}`;
            content = data.list.map((item, idx) => 
                <ServiceProvider key={idx} item={item}  
                    showDetailModal={this.showDetailModal.bind(this)} />
            );
        }

        return (
            <div style={{minHeight: "100vh"}}>
                <HeaderSection authUser={this.props.authUser} />
                <div>
                    <div className="w3-padding">
                        <input className="w3-padding-small w3-border" onChange={this.searchRequests.bind(this)} placeholder="Name / Phone number" /> 
                        <div className="w3-bar-item w3-right-align">{totalCount}</div>
                    </div>
                    <div className="w3-row" style={{display: 'flex', flexFlow: 'wrap'}}> 
                        {content}
                    </div>
                    <div className="w3-center ">
                        {pagination}
                    </div>

                    {this.state.modal}
                </div>
            </div>
        ) 
    }
}

function mapStateToProps(state) {  
    return {
       authUser: state.authUser
    }
}

export default connect(mapStateToProps)(withRouter(ServiceProviderList))
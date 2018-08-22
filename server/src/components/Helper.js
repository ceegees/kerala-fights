import React, {Component} from 'react'; 
import {Link,NavLink} from 'react-router-dom';
import axios from 'axios'; 

export class ErrorHelperText extends Component {
    static get defaultProps() {
        return {
            errors: null
        };
    }
    render() {
        let errorContent = null;
        if (!this.props.errors) {
            return <span />;
        }
        if (typeof (this.props.errors) === 'string') {
            errorContent = (<div className="w3-text-red">* {this.props.errors}</div>);
        } else {
            errorContent = (<div className="w3-text-red">* {this.props.errors.join(',')}</div>);
        }
        return errorContent;
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
        <NavLink to={`/manage/${status}/1`} className="w3-button">&laquo;</NavLink> 
        {
            pages.map( page=> <NavLink key={`page_${page}`} to={`/manage/${status}/${page}`} 
                className="w3-button">{page}</NavLink> )
        }
        <NavLink to={`/manage/${status}/${lastPage}`} className="w3-button">&raquo;</NavLink>
    </div>
}

export const Spinner = (props = {message:'Loading Data', mode:'big' }) => { 
    let  paddingCls = 'w3-padding-64';
    if (props.mode == 'small'){
        paddingCls='w3-padding-small cgs-loader-small';
    }
    return <div className={`w3-center ${paddingCls} w3-block`} > 
        <div className="w3-center w3-padding">
        <div className="cgs-loader"></div>
        </div>
       {props.message}
    </div>
}

export class Reveal extends Component {

    static get defaultProps() {
        return {
            openCls: '',
            modalClass:''
        }
    }
    
    render() {
        let cls ='';
 
        return (
            <div className={ this.props.modalClass+" w3-modal w3-show "  } >     
                <div className={"w3-modal-content  "}  >
                    { this.props.onClose ?
                        <button className="w3-button w3-right w3-large close-button" 
                            onClick={this.props.onClose}  type="button">
                            <span aria-hidden="true">&times;</span>
                        </button> : null
                    }
                    {this.props.children}
                </div>  
            </div>
        )
    }
}

export class FormTextField extends Component {
    static get defaultProps() {
        return {
            type: "text",
            valueChange: null,
            inputClass: '',
            textClass: '',
            onBlur: function () {}
        };
    }

    constructor(args) {
        super(args);
        this.state = {
            value: null
        };
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            value: newProps.value
        });
    }

    onChange(evt) {
        var val = evt.target.value;
        this.setState({value: val});
        if (this.props.valueChange) {
            this.props.valueChange(this.props.name, val);
        }
    }

    render() { 
        let {inputClass}   = this.state;
        if (this.state.value === null || this.state.value === undefined) {
            this.state.value = this.props.value;
        }
        var errorClass = '';
        if (this.props.errors != undefined) {
            errorClass = 'is-invalid-input';
        }
        if (this.props.inputClass != undefined) {
            inputClass = this.props.inputClass;
        }
        let mandatoryField = '';
        if (this.props.isMandatory) {
            mandatoryField = (<span className="w3-text-red">*</span>);
        }
        return (
            <div className={"f10t-input-padding"}>
                <label className="w3-text-black">{this.props.label} {mandatoryField} </label>
                <input
                    className={this.props.textClass}
                    type={this.props.type}
                    id={this.props.id}
                    autoComplete={this.props.name}
                    name={this.props.name}
                    defaultValue={this.props.defaultVal}
                    onBlur={this.props.onBlur}
                    value={this.state.value ? this.state.value : ""}
                    onChange = {this.onChange.bind(this)}
                    placeholder={this.props.placeholder || this.props.label}
                    className={`${this.props.inputClass} ${errorClass}`}
                />
                <ErrorHelperText errors={this.props.errors} />
            </div>
        );
    }
}

export class FormTextarea extends Component {
    static get defaultProps() {
        return {
            valueChange: null
        };
    }

    constructor(args) {
        super(args);
        this.state = {
            value:null
        }
    }
  

    componentWillReceiveProps(newProps) {
        this.setState({
            value: newProps.value
        });
    }

    onChange(evt) {
        var val = evt.target.value;
        this.setState({value: val});
        if (this.props.valueChange) {
            this.props.valueChange(this.props.name, val);
        }
    }

    render() {
        if (this.state.value == null) {
            this.state.value = this.props.value;
        }
        var errorClass = '';
        if (this.props.errors != undefined) {
            errorClass = 'is-invalid-input';
        }

        let mandatoryField = '';
        if (this.props.isMandatory) {
            mandatoryField = (<span className="w3-text-red">*</span>);
        }

        return (
            <div className = "f10t-input-padding">
                <label>{this.props.label} {mandatoryField}</label>
                <textarea className="fm-text-input" id={this.props.id}
                    name={this.props.name}
                    onChange = {this.onChange.bind(this)}
                    placeholder={this.props.placeholder ? this.props.placeholder: this.props.label}
                    value={this.state.value  ? this.state.value :''}
                    className={`${this.props.inputClass} ${errorClass}`}/>
                <ErrorHelperText errors={this.props.errors} />
            </div>
        );
    }
}

export class SelectField extends Component {


    constructor(args) {
        super(args);
        this.state = {
            value: null,
        }
    }

    static get defaultProps() {
        return {
            valueChange: null, 
            options: [],  
        };
    }
    
    componentDidMount() {
        this.setState({
            value: this.props.value
        });
    }

    onChange(evt) {
        var val = evt.target.value;
        this.setState({value: val});
        if (this.props.valueChange) {
            this.props.valueChange(this.props.name, val);
        }
    }

    componentWillReceiveProps(nextProps) {
        // if (nextProps.valueChange) {
        //     nextProps.valueChange(nextProps.name, nextProps.defaultValue);
        // }
    }

    componentDidMount() {
        if (this.props.defaultValue) {
            this.props.valueChange(this.props.name, this.props.defaultValue);
        }
    }

    render() {
        if (this.state.value == null) {
            this.state.value = this.props.value;
        }
        let mandatoryField = '';
        if (this.props.isMandatory) {
            mandatoryField = (<span className="w3-text-red">*</span>);
        }
        var errorClass = '';
        if (this.props.errors != undefined) {
            errorClass = 'is-invalid-input';
        } 

        return (
            <div className="" >
                <label>{this.props.label} {mandatoryField}</label>
                <select id={this.props.id}
                    name={this.props.name}
                    defaultValue={this.props.defaultValue}
                    value={this.state.value ? this.state.value : ''}
                    className={this.props.selectClass + " " + errorClass}
                    placeholder={this.props.label}
                    style={{height:"40px"}}
                    onChange = {this.onChange.bind(this)}> 
                    {this.props.children}
                </select>
                <ErrorHelperText errors={this.props.errors} />
            </div>
        );
    }
}

export class GooglePlacesAutoComplete extends Component {
    constructor(args){
        super(args);
        this.locationInput = React.createRef();
    }

    componentDidMount(){
        var input = document.getElementById('map_location');
        var autocomplete = new google.maps.places.Autocomplete(input);  
        autocomplete.addListener('place_changed', () => {
            var place = autocomplete.getPlace();
            if (this.props.onPlaceChange) {
                this.props.onPlaceChange(place)
            }
        });
    }
 
    render() {
        return (
            <div id="autocomplete-container">
                <input id="map_location" type="text"
                    label="Album/Event Location"
                    className = "w3-input w3-border"
                    placeholder= {this.props.placeholder} 
                    autoComplete="on"
                    ref={this.locationInput}
                />
            </div>
        )
    }
}
export class GoogleMapWidget extends Component {
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

        console.log('place :',nextProps.place);
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

export class HeaderSection extends Component {

    constructor(arg) {
        super(arg);
        this.state = {
            mobileMenu: 'w3-hide'
        }
    }

    togggleMobile() {
        this.setState({mobileMenu:(this.state.mobileMenu == 'w3-hide')? 'w3-show' : 'w3-hide'})
    }

    render(){
        return (
            <section className="top_section"> 
                <nav className="w3-bar w3-blue header-top-bar">
                    <div className="w3-left">
                        <a className="w3-bar-item w3-button" href="/">Kerala Flood Relief - കേരളം പൊരുതുന്നു , ഒരുമിച്ച് </a>
                    </div>
                    <button className="w3-bar-item w3-small w3-sand  w3-button  w3-hide-large w3-hide-medium w3-display-topright" onClick={this.togggleMobile.bind(this)}>&#9776;</button>
                    <div className="w3-right w3-hide-small">  
                        {this.props.authUser ? <a className="w3-bar-item   w3-button " href="/manage">Manage</a> : <a className="w3-bar-item  w3-yellow w3-button " href="/manage">Volunteer Login</a>} 
                        {!this.props.authUser ? <a className="w3-bar-item w3-hide w3-button " href="/auth/facebook">Fb Login</a> : null} 
                        <a target="_blank" href="https://www.keralarescue.in/relief_camps/" className="w3-bar-item w3-button ">Rescue Centers</a> 
                        <a target="_blank" href="https://www.keralarescue.in/contactus/" className="w3-bar-item w3-button ">Contact Rescue</a> 
                        <NavLink className="w3-bar-item w3-button " to="/heatmap/need_help">HeatMap</NavLink>
                    </div>
                </nav> 
                <div className={`w3-bar-block w3-border-top w3-hide-large w3-hide-medium ${this.state.mobileMenu}`}>
                    {this.props.authUser ? <a className="w3-bar-item   w3-button " href="/manage">Manage</a> : <a className="w3-bar-item  w3-yellow w3-button " href="/manage">Volunteer Login</a>} 
                    {!this.props.authUser ? <a className="w3-bar-item w3-hide w3-button " href="/auth/facebook">Fb Login</a> : null} 
                    <a target="_blank" href="https://www.keralarescue.in/relief_camps/" className="w3-bar-item w3-button w3-blue">Rescue Centers</a> 
                    <a target="_blank" href="https://www.keralarescue.in/contactus/" className="w3-bar-item w3-button w3-blue">Contact Rescue</a> 
                    <NavLink className="w3-bar-item w3-button w3-blue" to="/heatmap/need_help">HeatMap</NavLink>
                </div>
                {this.props.children}
            </section> 
        )
    }
}


export class DemanSupplyTab extends Component {
    constructor(arg){
        super(arg);
        this.state = {
            tabName : 'demand'
        }
    }
    tabChange(name){
        this.setState({tabName:name});
    }
    render(){
        const {tabName} = this.state;
        const demandBtnCls = tabName == 'demand' ? 'w3-green':'w3-light-grey';
        const supplyBtnCls = tabName != 'demand' ? 'w3-green':'w3-light-grey';

        const demandTabCls = this.state.tabName == 'demand' ? 'w3-show':'w3-hide';
        const supplyTabCls = this.state.tabName != 'demand' ? 'w3-show':'w3-hide';
        let message = '';
        if (this.state.tabName != 'demand') {
            message = 'Drag and Zoom the map to Kerala / മാപ്പ് കേരളത്തിലേക്ക് സൂം (Zoom ) ചെയ്യുക'
        }

        
        
        return <div>
            <div className="w3-bar">
                <button className={"w3-button w3-bar-item w3-orange "+demandBtnCls}  
                    onClick={this.tabChange.bind(this,'demand')}> Demand / ആവശ്യക്കാർ </button>
                <button className={"w3-button w3-bar-item w3-green "+supplyBtnCls} 
                    onClick={this.tabChange.bind(this,'supply')}>Supply / സഹായം കൊടുക്കുന്നവർ </button>
                <div className="w3-bar-item" >
                    <span className="w3-small w3-text-red">{message}</span></div>
            </div>
            <div className={demandTabCls}>
                {this.props.children[0]}
            </div>
            <div className={supplyTabCls}>
                {this.props.children[1]}
            </div>
        </div> 
    }
}
export class Leaderboard extends Component {

    constructor(arg){
        super(arg);
        this.state = {
            data:null
        }
    }

    componentDidMount(){
        axios.get('/api/v1/angels').then(resp=>{ 
            this.setState({
                data:resp.data
            })
        });

    }

    render(){
        let content = <Spinner />
        
        if (this.state.data) {
            content = 
            <table className="w3-table w3-table-all">   
                <tbody className="w3-right-align">
                {
                    this.state.data.map((item, idx) => {
                    return <tr key={`pos_${idx}`}>
                        <td style={{width:"40px",lineHeight:'32px'}}> {idx + 1} </td>
                        <td style={{width:"40px",lineHeight:'32px'}}>
                        <img src={item.picture} style={{width:"32px",height:"32px"}} />
                        </td>
                        <td style={{lineHeight:'32px'}}>  {item.name}</td>
                        <td  style={{lineHeight:'32px'}}>   {item.total} help requests updated </td>
                    </tr>
                })}
                </tbody>
            </table>
        }
        
        return <div className=" w3-small w3-margin"> 
            <h5 className="w3-center">The Fighters</h5>        
            {content}
        </div>
    }
}
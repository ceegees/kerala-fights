import React, {Component} from 'react'; 
import {Link,NavLink} from 'react-router-dom';
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
                        <button className="w3-button w3-right w3-medium close-button" 
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


export  class FormTextField extends Component {
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
                    defaultValue={this.props.defaultValue}
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
    }

    componentDidMount(){
        var input = document.getElementById('album_location');
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
                <input id="album_location" type="text"
                    label="Album/Event Location"
                    className = "w3-input w3-border"
                    defaultValue = {this.props.albumLocation}
                    placeholder= {this.props.placeholder} 
                    autoComplete="on"
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
    }
    componentDidMount () {
        this.initialiseGMap(10.10,76.65);
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.setLocation && nextProps.setLocation != this.props.setLocation) {
            this.setMarker(
                nextProps.setLocation.lat,
                nextProps.setLocation.lon
            );
        }
        if (nextProps.place == this.props.place) {
            return;
        }
        const {place} = nextProps;
        this.marker.setVisible(false);
        if (place.geometry.viewport) {
            this.map.fitBounds(place.geometry.viewport);
        } else {
            this.map.setCenter(place.geometry.location);
            this.map.setZoom(17);  
        }

        this.setMarker(
            place.geometry.location.lat(),
            place.geometry.location.lng()
        ); 
    }
    setMarker(lat,lon){ 
        if (this.marker == null) {
            this.marker = new google.maps.Marker({
                position: {lat: lat, lng: lon},
                map: this.map
            });
        } else {                    
            this.marker.setPosition({
                lat:lat, 
                lng: lon
            });
        }
        this.map.setCenter({lat:lat,lng:lon});
        this.marker.setVisible(true);
        if (this.props.locationSelect){
            this.props.locationSelect(lat,lon);  
        }
    }

    initialiseGMap (latitude,longitude) {
        if (!this.map){
            this.map = new google.maps.Map(document.getElementById('google-map'), {
                center: {lat: latitude, lng: longitude},
                zoom: 15,
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
            this.map.addListener('click',  (e) => {
                this.setMarker(e.latLng.lat(),e.latLng.lng());
            }); 
        } 
        this.setMarker(latitude,longitude);
    }

    render() {
        return  <div id="google-map" style={this.props.mapStyle}>
        </div>
    }
}


export class HeaderSection extends Component {
    render(){
        return <section className="top_section w3-top "> 
            <nav className="w3-bar w3-blue" >
                <div className="w3-left">
                    <a className="w3-bar-item w3-button" href="/">Kerala Flood Relief - കേരളം പൊരുതുന്നു , ഒരുമിച്ച് </a>
                </div>
                <div className="w3-right"> 
                       {this.props.authUser ? <a className="w3-bar-item w3-button " href="/manage">Manage</a> : <a className="w3-bar-item w3-button " href="/manage">Volunteer Login</a>}
                        <a target="_blank" href="https://www.keralarescue.in/relief_camps/" className="w3-bar-item w3-button ">Rescue Centers</a> 
                        <a target="_blank" href="https://www.keralarescue.in/contactus/" className="w3-bar-item w3-button ">Contact Rescue</a> 
                        <NavLink className="w3-bar-item w3-button " to="/heatmap">HeatMap</NavLink>
                </div>
            </nav> 
            {this.props.children}
        </section> 
    }
}
import  React,{ Component } from 'react'; 
import { FormTextField,FormTextarea,GooglePlacesAutoComplete,GoogleMapWidget ,SelectField,Reveal} from './Helper.js';  
import axios from 'axios';
import { connect } from 'react-redux';

import { showMessage, hideMessage } from './../redux/actions.js';

class MarkSafe extends Component{

    constructor(arg) {
        super(arg);
        this.state =   {
            place: null,
            setLocation: null,
            form: {},
            errors: {}, 
            successMessage: ''
        }
        this.handlePlaceChange = this.handlePlaceChange.bind(this);
    }

    componentDidMount() {
        this.getLocation();
    }

    getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.showPosition.bind(this));
        } else { 
            console.log("Geolocation is not supported by this browser.");
        }
    }

    showPosition(pos) {
        this.state.form.location_lat = pos.coords.latitude;
        this.state.form.location_lon = pos.coords.longitude;
        this.setState({
            setLocation: {
                lat: pos.coords.latitude,
                lon: pos.coords.longitude
            }
        });
    }

    locationSelect(lat,lon, geoLocation){

        let newLocation = {
            lat: lat,
            lon: lon
        };

        if(geoLocation) {
            newLocation.place_id = geoLocation.place_id;
            newLocation.formatted_address = geoLocation.formatted_address;
        }
        this.setState({
            setLocation: newLocation
        });
        this.state.form.location_lat = lat;
        this.state.form.location_lon = lon;
    }

    handlePlaceChange(place){ 
        if (!place.geometry) {
          return;
        }
        this.state.form.address_components  = place.address_components;
        this.setState({
            place:place
        });
    }

    changeFormValue(name,value) {
        this.state.form[name] = value;
    }
    
    handleSubmit() {
        let formData = Object.assign({},this.state.form);

        let errors = {};
        if (!formData.name) {
            errors['name'] = "Name is required"
        }
        if (!formData.phoneNumber) {
            errors['phoneNumber'] = "Phone Number is required"
        }

        if (!formData.currentLocationType) {
            errors['currentLocationType'] = "Current Place is required"
        }

        if (this.props.type == 'BEHALF') {
            if (!formData.creatorName) {
                errors['creatorName'] = "Name is required"
            }
            if (!formData.creatorPhone) {
                errors['creatorPhone'] = "Phone Number is required"
            }
        }

        if (Object.keys(errors).length != 0) {
            this.setState({
                errors: errors
            });
            return false;
        }

        formData['type'] = this.props.type;
        axios.post('/api/v1/add-safe-user',formData)
        .then(resp=> {
            resp = resp.data;
            if (!resp.meta.success) {
                // this.setState({errors: resp.data});
                this.props.showMessage('fail', resp.meta.message);
            } else {
                this.setState({errors: ''});
                this.props.showMessage('success', "Info added successfully.");
                this.props.hideModal(); 
            }
        });
        return false;
    }

    render () {
        var clsSuccess = 'hidden';
        if (this.state.successMessage != '') {
            clsSuccess = '';
        }
        var googlePlace = this.state.setLocation && this.state.setLocation.formatted_address ? this.state.setLocation.formatted_address : '';

        return (
            <Reveal onClose={this.props.hideModal} >
               <div className="w3-container ">   
                    <h4 className="w3-center w3-margin" style={{paddingBottom: "20px"}}>
                        {(this.props.type == 'BEHALF')?
                            <div className="w3-center">
                                <div className="w3-row">Mark People Whom you know are Safe</div>
                                <div className="w3-row">നിങ്ങൾക്കറിയാവുന്ന സുരക്ഷിതരായവരുടെ വിവരം</div>
                            </div>
                            :
                            <div className="w3-center">
                                <div className="w3-row">Mark Yourselves Safe</div>
                                <div className="w3-row">നിങ്ങൾ സുരക്ഷിതനാണോ</div>
                            </div>
                        }
                    </h4> 
                    <form className="w3-row-padding">
                        <div className="l4 s12 w3-col">
                            <FormTextField 
                                label="പേര്"
                                placeholder="Name"
                                name="name"
                                isMandatory="true"
                                inputClass="w3-input w3-border"
                                value = {this.state.form.name}
                                valueChange={this.changeFormValue.bind(this)}
                                errors = {this.state.errors.name} /> 
                        </div>
                        <div className="l4 s12 w3-col">
                            <FormTextField
                             label="മൊബൈൽ നമ്പർ"
                                placeholder="Phone Number"
                                name="phoneNumber"
                                isMandatory="true"
                                type="number"
                                value = {this.state.form.phoneNumber}
                                inputClass="w3-input w3-border"
                                valueChange={this.changeFormValue.bind(this)}
                                errors = {this.state.errors.phoneNumber} />
                        </div>

                        <div className="l4 s12 w3-col">   
                            <SelectField
                                label="എവിടെയാണ് തങ്ങിയിരിക്കുന്നതു "
                                placeholder="Current Place"
                                name="currentLocationType"
                                selectClass="w3-select w3-border"
                                isMandatory="true"
                                value = {this.state.form.currentLocationType}
                                valueChange={this.changeFormValue.bind(this)}
                                errors = {this.state.errors.currentLocationType}>
                                <option value=""> - Select Current Place - </option>
                                <option value="at_home">At Home</option>
                                <option value="at_rescue_center">At Rescue Center</option>
                                <option value="at_friend_or_relative">At friend/relative place</option>
                                <option value="other_place">Other place</option> 
                            </SelectField> 
                        </div>

                        <div className="w3-col l6 s12 " id="location">
                            <label className="w3-margin-bottom">
                                മാപ്പിൽ ലൊക്കേഷൻ കൃത്യതയോടെ അടയാളപ്പെടുത്തുക / Mark the location</label>

                            <GooglePlacesAutoComplete
                                albumLocation={googlePlace}
                                onPlaceChange={place => this.handlePlaceChange(place)}
                                placeholder = "Location"  />

                            <div className="w3-row">
                                <GoogleMapWidget mapStyle={{height: '250px'}} 
                                    lat={this.state.form.location_lat}
                                    lon={this.state.form.location_lon}
                                    setLocation={this.state.setLocation}
                                    place={this.state.place}
                                    mapId='google-map-safe'
                                    locationSelect={this.locationSelect.bind(this)}/>
                            </div>
                        </div>

                        <div className="w3-col l6 s12">
                            <FormTextarea 
                                name="contactInfo"
                                label="കൂടുതൽ വിവരങ്ങൾ "
                                placeholder="More Information" 
                                inputClass="w3-input w3-border" 
                                valueChange={this.changeFormValue.bind(this)}
                                value = {this.state.form.contactInfo}
                                type="text" />

                            {(this.props.type == 'BEHALF')?
                                <div className="w3-row">
                                    <div className="w3-col" style={{paddingTop: "40px"}}>
                                        <FormTextField 
                                            label="നിങ്ങളുടെ  പേര്"
                                            placeholder="Your Name"
                                            name="creatorName"
                                            inputClass="w3-input w3-border"
                                            value = {this.state.form.creatorName}
                                            valueChange={this.changeFormValue.bind(this)}
                                            errors = {this.state.errors.creatorName} />

                                        <FormTextField 
                                            type="number"
                                            label="നിങ്ങളുടെ  മൊബൈൽ നമ്പർ"
                                            placeholder="Your Phone Number"
                                            name="creatorPhone"
                                            inputClass="w3-input w3-border"
                                            value = {this.state.form.creatorPhone}
                                            valueChange={this.changeFormValue.bind(this)}
                                            errors = {this.state.errors.creatorPhone} />

                                    </div>
                                </div>
                                : null
                            }
                        </div> 

                        <div className={"m12 s12 w3-col w3-center w3-text-green" + clsSuccess} role="alert">{this.state.successMessage}</div>
                        <div className="w3-panel m12 s12 w3-col">
                            <div className="w3-right">
                                <button type="button" className="w3-button w3-dark-grey" onClick={this.props.hideModal}>Cancel</button>
                                <button type="button" className="w3-button w3-blue"  onClick={this.handleSubmit.bind(this)}>Submit</button>
                            </div>
                        </div>
                    </form>
                </div>   
            </Reveal>
        )
    }
} 


function mapStateToProps(state) {
    return {}
}
export default connect(mapStateToProps, { 
    showMessage
})(MarkSafe);

import  React,{ Component } from 'react'; 
import { FormTextField,FormTextarea,GooglePlacesAutoComplete,GoogleMapWidget ,SelectField,Reveal} from './Helper.js';  
import axios from 'axios';
import { connect } from 'react-redux';

import { showMessage, hideMessage } from './../redux/actions.js';

class AddHelpCentre extends Component{

    constructor(arg) {
        super(arg);
        this.state =   {
            place: null,
            setLocation: null,
            form: {},
            errors: {}, 
            successMessage: '',
            isSending: false
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

    locationSelect(lat,lon, geoLocation) {
        let newLocation = {
            lat: lat,
            lon: lon
        };
        
        let form = this.state.form;
        if(geoLocation) {
            let location = geoLocation.address_components.filter(item=>item.types.indexOf('sublocality') > -1)
                .map(item=>item.long_name)
                .join(',');
            newLocation.place_id = geoLocation.place_id;
            newLocation.formatted_address = geoLocation.formatted_address;
            newLocation.location = location;

            form.address = newLocation.formatted_address;
        }
        this.setState({
            setLocation: newLocation,
            form
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
        const {isSending} = this.state;

        if (isSending) {
            return;
        }

        let formData = Object.assign({},this.state.form);
        console.log(formData);

        let errors = {};
        if (!formData.contactName) {
            errors['contactName'] = "Name is required"
        }
        if (!formData.phoneNumber) {
            errors['phoneNumber'] = "Phone Number is required"
        }

        if (!formData.type) {
            errors['type'] = "Service Type is required"
        }

        if (!formData.address) {
            errors['address'] = "Address is required"
        }

        if (!formData.serviceEndDate) {
            errors['serviceEndDate'] = "Service End Date is required"
        }

        if (!formData.peopleCount) {
            errors['peopleCount'] = "People Count is required"
        }

        if (Object.keys(errors).length != 0) {
            this.setState({
                errors: errors
            });
            return false;
        }

        this.setState({
            isSending: true
        });
        axios.post('/api/v1/add-service-provider',formData)
        .then(resp=> {
            resp = resp.data;
            if (!resp.meta.success) {
                // this.setState({errors: resp.data});
                this.props.showMessage('fail', resp.meta.message);
            } else {
                this.setState({errors: ''});
                this.props.showMessage('success', "Service Infomation added successfully.");
                this.props.hideModal(); 
            }
            this.setState({
                isSending: false
            });
        });
        return false;
    }

    render () {
        var clsSuccess = 'hidden';
        if (this.state.successMessage != '') {
            clsSuccess = '';
        }
        var googlePlace = this.state.setLocation && this.state.setLocation.location ? this.state.setLocation.location : '';

        return (
            <Reveal onClose={this.props.hideModal} >
               <div className="w3-container ">   
                    <h4 className="w3-center w3-margin" style={{paddingBottom: "10px"}}>
                        <div className="w3-center">
                            <div className="w3-row">Add Service Provider</div>
                            <div className="w3-row">സേവനദാതാവ്</div>
                        </div>
                    </h4> 
                    <form className="w3-row-padding">
                        <div className="l4 s12 w3-col">
                            <FormTextField 
                                label="പേര്"
                                placeholder="Contact Name"
                                name="contactName"
                                isMandatory="true"
                                inputClass="w3-input w3-border"
                                value = {this.state.form.contactName}
                                valueChange={this.changeFormValue.bind(this)}
                                errors = {this.state.errors.contactName} /> 
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
                                label="സേവന തരം"
                                placeholder="Type of help"
                                name="type"
                                selectClass="w3-select w3-border"
                                isMandatory="true"
                                value = {this.state.form.type}
                                valueChange={this.changeFormValue.bind(this)}
                                errors = {this.state.errors.type}>
                                <option value=""> - Select Service Type - </option>
                                <option value="shelter_camp">ഷെൽട്ടർ ക്യാംപുകൾ / Shelter camps</option>
                                <option value="food_and_water">ഭക്ഷണം & വെള്ളം / Food & Water</option>
                                <option value="medicines">മരുന്നുകൾ വിതരണം / Medicines Supply</option> 
                                <option value="utensils">പാത്രങ്ങൾ വിതരണം / Utensils Supply</option> 
                                <option value="cleaning_services">വൃത്തിയാക്കൽ സേവനങ്ങൾ / Cleaning Services</option> 
                                <option value="sanitary_items_supply">സാനിറ്ററി വസ്തുക്കൾ വിതരണം / Sanitary Items Supply</option> 
                                <option value="clothing_supply">വസ്ത്രങ്ങൾ വിതരണം / Clothing Supply</option> 
                                <option value="other">Other</option> 
                            </SelectField> 
                        </div>

                        <div className="w3-col l6 s12 " id="location">
                            <label className="w3-margin-bottom">
                                മാപ്പിൽ ലൊക്കേഷൻ കൃത്യതയോടെ അടയാളപ്പെടുത്തുക / Mark the location</label>
                            <GooglePlacesAutoComplete
                                albumLocation={googlePlace}
                                onPlaceChange={place => this.handlePlaceChange(place)}
                                placeholder = "Location" />

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
                                name="address"
                                label="അഡ്രെസ്സ്"
                                placeholder="Address" 
                                isMandatory="true"
                                inputClass="w3-input w3-border" 
                                valueChange={this.changeFormValue.bind(this)}
                                value = {this.state.form.address}
                                errors = {this.state.errors.address}
                                type="text" />

                            <FormTextField
                                label="സേവനം അവസാനിക്കുന്ന തീയതി / Service End Date"
                                name="serviceEndDate"
                                isMandatory="true"
                                type="date"
                                value = {this.state.form.serviceEndDate}
                                inputClass="w3-input w3-border"
                                valueChange={this.changeFormValue.bind(this)}
                                errors = {this.state.errors.serviceEndDate} />

                            <FormTextField
                                label="സേവിക്കാവുന്ന ആളുകളുടെ എണ്ണം(ഏകദേശം)"
                                placeholder="Total number of people that can be served"
                                name="peopleCount"
                                isMandatory="true"
                                type="number"
                                value = {this.state.form.peopleCount}
                                inputClass="w3-input w3-border"
                                valueChange={this.changeFormValue.bind(this)}
                                errors = {this.state.errors.peopleCount} />

                            <FormTextField
                                label="കുട്ടികളുടെ എണ്ണം"
                                placeholder="Number of kids"
                                name="kidsCount"
                                type="number"
                                value = {this.state.form.kidsCount}
                                inputClass="w3-input w3-border"
                                valueChange={this.changeFormValue.bind(this)}
                                errors = {this.state.errors.kidsCount} />

                            <FormTextField
                                label="സ്ത്രീകളുടെ എണ്ണം"
                                placeholder="Number of females"
                                name="femaleCount"
                                type="number"
                                value = {this.state.form.femaleCount}
                                inputClass="w3-input w3-border"
                                valueChange={this.changeFormValue.bind(this)}
                                errors = {this.state.errors.femaleCount} />

                            <FormTextField
                                label="പുരുഷന്മാരുടെ എണ്ണം"
                                placeholder="Number of males"
                                name="maleCount"
                                type="number"
                                value = {this.state.form.maleCount}
                                inputClass="w3-input w3-border"
                                valueChange={this.changeFormValue.bind(this)}
                                errors = {this.state.errors.maleCount} />

                        </div>

                        <div className="w3-col" style={{paddingTop: '15px'}}>
                            <FormTextarea 
                                name="information"
                                label="കൂടുതൽ വിവരങ്ങൾ"
                                placeholder="More Information - About quantity / Time of availability" 
                                inputClass="w3-input w3-border" 
                                valueChange={this.changeFormValue.bind(this)}
                                value = {this.state.form.information}
                                type="text" />
                        </div>

                        <div className={"m12 s12 w3-col w3-center w3-text-green" + clsSuccess} role="alert">{this.state.successMessage}</div>
                        <div className="w3-panel m12 s12 w3-col">
                            <div className="w3-right">
                                <button type="button" className="w3-button w3-dark-grey" onClick={this.props.hideModal}>Cancel</button>
                                <button type="button" className="w3-button w3-blue" 
                                    onClick={this.handleSubmit.bind(this)}
                                    disabled={(this.state.isSending)?true:false}>Submit</button>
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
})(AddHelpCentre);

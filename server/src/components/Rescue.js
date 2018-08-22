import  React,{ Component } from 'react'; 
import { FormTextField,FormTextarea,GooglePlacesAutoComplete,GoogleMapWidget ,SelectField,Reveal} from './Helper.js';  
import axios from 'axios';
import { connect } from 'react-redux';

import { showMessage, hideMessage } from './../redux/actions.js';

class Rescue extends Component{

    constructor(arg) {
        super(arg);
        this.state =   {
            place:null,
            form: {},
            errors: {}, 
            data:null,
            successMessage: ''
        }
        this.handlePlaceChange = this.handlePlaceChange.bind(this);
    } 
    
    locationSelect(lat,lon, geoLocation){ 
        this.state.form.location_lat = lat;
        this.state.form.location_lon = lon;
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


    changeFormValue (name,value) {
        this.state.form[name] = value;
    }
    
    handleSubmit () {
        var formData = this.state.form;
        console.log(formData);

        return;

        let errors = {};
        if (!formData.name) {
            errors['name'] = "Name is required"
        }
        if (!formData.phone_number) {
            errors['phone_number'] = "Phone Number is required"
        }
        if (!formData.help_type) {
            errors['help_type'] = "This field is required"
        }
        if (!formData.district) {
            errors['district'] = "This field is required"
        }
        if (!formData.district) {
            errors['district'] = "This field is required"
        }

        if (Object.keys(errors).length != 0) {
            this.setState({
                errors: errors
            });
            return false;
        }

        axios.post('/api/v1/add-rescue',formData)
        .then(resp=> {
            resp = resp.data;
            if (!resp.meta.success) { 
                this.props.showMessage('fail', resp.meta.message,1);
            } else {
                this.setState({
                    errors: '',
                    successMessage:resp.meta.message,
                    data:resp.data
                });
                // this.props.showMessage('success', resp.meta.message);
                
                // this.props.hideModal(); 
            }
        });
        return false;
    }

    render () {
        var clsSuccess = 'hidden';
        if (this.state.successMessage != '') {
            
            return <Reveal  onClose={this.props.hideModal} >
                <div className="w3-green w3-padding-64 w3-center">
                   <h4> {this.state.successMessage}</h4>
                   <h3>{this.state.data.id}</h3>
                </div>
            </Reveal>
            
        }

        var googlePlace = this.state.setLocation && this.state.setLocation.location ? this.state.setLocation.location : '';
    return (
            <Reveal  onClose={this.props.hideModal} >
               <div className="w3-container ">   
                    <h4 className=" w3-center w3-margin">
                        Add Information
                    </h4> 
                    <form className="w3-row-padding">

                        <div className="l4 s12 w3-col">   
                        <SelectField
                            label="എന്ത് സഹായം ആണ് വേണ്ടത്"
                            placeholder="What Help you want"
                            name="help_type"
                            selectClass="w3-select w3-border"
                            isMandatory="true"
                            value = {this.state.form.help_type}
                            valueChange={this.changeFormValue.bind(this)}
                            errors = {this.state.errors.help_type}>
                            <option value=""> - select help type - </option>
                            {this.props.requestTypes.map((item, idx) => {
                                return <option key={idx} value={item.key}>{item.name}</option>
                            })} 
                        </SelectField> 
                        </div>
                        <div className="l4 s12 w3-col">
                            <FormTextField 
                                isMandatory="true"
                                label="പേര്"
                                placeholder="Name"
                                name="name"
                                inputClass="w3-input w3-border"
                                value = {this.state.form.name}
                                valueChange={this.changeFormValue.bind(this)}
                                errors = {this.state.errors.name} 
                            /> 
                        </div>
                        <div className="l4 s12 w3-col">
                            <FormTextField
                                isMandatory="true"
                                label="മൊബൈൽ നമ്പർ"
                                placeholder="Phone Number"
                                name="phone_number"
                                type="number"
                                value = {this.state.form.phone_number}
                                inputClass="w3-input w3-border"
                                valueChange={this.changeFormValue.bind(this)}
                                errors = {this.state.errors.phone_number} />
                        </div>
                        <div className="l4 s12 w3-col">
                            <FormTextField
                            label="എത്ര ആളുകൾ ഉണ്ട് "
                                placeholder="Number of people"
                                name="member_count"
                                type="number"
                                value = {this.state.form.member_count}
                                inputClass="w3-input w3-border"
                                valueChange={this.changeFormValue.bind(this)}
                                errors = {this.state.errors.member_count} />
                        </div>    
                        <div className="l4 s12 w3-col">
                            <FormTextField
                                label="മറ്റു ഫോൺ നമ്പറുകൾ "
                                placeholder="Other Contact Numbers"
                                name="aleternate_number" 
                                value = {this.state.form.aleternate_number}
                                inputClass="w3-input w3-border"
                                valueChange={this.changeFormValue.bind(this)}
                                errors = {this.state.errors.aleternate_number} />
                        </div>
                        
                        <div className="l4 s12 w3-col">  
                        <SelectField
                            label="ജില്ല"
                            place="district"
                            name="district"
                            selectClass="w3-select w3-border"
                            isMandatory="true"
                            value = {this.state.form.district}
                            valueChange={this.changeFormValue.bind(this)}
                            errors = {this.state.errors.district}
                            >
                            <option value="">----</option>
                            <option value="Alappuzha">Alappuzha</option>
                            <option value="Ernakulam">Ernakulam</option>
                            <option value="Idukki">Idukki</option>

                            <option value="Kannur">Kannur</option>
                            <option value="Kasaragod">Kasaragod</option>
                            <option value="Kollam">Kollam</option>

                            <option value="Kottayam">Kottayam</option>
                            <option value="Kozhikode">Kozhikode</option>
                            <option value="Malappuram">Malappuram</option>

                            <option value="Palakkad">Palakkad</option>
                            <option value="Pathanamthitta">Pathanamthitta</option>
                            <option value="Thiruvananthapuram">Thiruvananthapuram</option>
                            <option value="Thrissur">Thrissur</option>
                            <option value="Wayanad">Wayanad</option>
                        </SelectField> 
                        </div>
                        <div className="l6 s12 w3-col">
                            <FormTextarea
                                label="അഡ്രെസ്സ്"
                                placeholder="Address"
                                name="address"
                                inputClass="w3-input w3-border"
                                isMandatory="true"
                                value = {this.state.form.address}
                                valueChange={this.changeFormValue.bind(this)}
                                errors = {this.state.errors.address} />
                        </div> 
                        <div className="l6 s12 w3-col">
                            <FormTextarea 
                                name="member_details"
                                label="കൂടുതൽ വിവരങ്ങൾ "
                                placeholder="Add information that will help us resolve this faster, Contact information to get back to you if you are raising request on behalf of others" 
                                inputClass="w3-input w3-border" 
                                valueChange={this.changeFormValue.bind(this)}
                                value = {this.state.form.information}
                                type="text" />
                        </div> 

                        <div className="w3-col l12 s12 " id="location" style={{marginTop:"20px"}}>
                            <label className="w3-text-black">സ്ഥലം (മാപ്പിൽ ലൊക്കേഷൻ കൃത്യതയോടെ അടയാളപ്പെടുത്തുക / Search and mark your location) </label> 
                            <GooglePlacesAutoComplete
                                albumLocation={googlePlace}
                                onPlaceChange={place => this.handlePlaceChange(place)}
                                placeholder = "Location"
                            />
                        </div>
                        <div className="m12 s12 w3-col " >
                               <GoogleMapWidget mapStyle={{height: '250px'}} 
                               place={this.state.place}
                               mapId='google-map-rescue'
                               locationSelect={this.locationSelect.bind(this)}/>    
                        </div>
                      
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
    return {
        requestTypes:state.requestTypeList,
        authUser: state.authUser,
    }
}
export default connect(mapStateToProps, { 
    showMessage,
    hideMessage
})(Rescue);

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
            successMessage: ''
        }
        this.handlePlaceChange = this.handlePlaceChange.bind(this);
    }
    locationSelect(lat,lon){
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


    changeFormValue (name,value) {
        this.state.form[name] = value;
    }
    
    handleSubmit () {
        var formData = this.state.form; 
        axios.post('/api/v1/add-rescue',formData)
        .then(resp=> {
            resp = resp.data;
            if (!resp.meta.success) {
                // this.setState({errors: resp.data});
                this.props.showMessage('fail', resp.meta.message);
            } else {
                this.setState({errors: ''});
                this.props.showMessage('success', resp.meta.message);
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
        var googlePlace = '';
        return (
            <Reveal  onClose={this.props.hideModal} >
               <div className="w3-container ">   
                    <h4 className=" w3-center w3-margin">
                        Add Information
                    </h4> 
                    <form className="w3-row-padding">
                        <div className="l4 s12 w3-col">
                            <FormTextField 
                                label="താങ്കളുടെ പേര്"
                                placeholder="Your Name"
                                name="name"
                                inputClass="w3-input w3-border"
                                value = {this.state.form.name}
                                valueChange={this.changeFormValue.bind(this)}
                                errors = {this.state.errors.name} 
                            /> 
                        </div>
                        <div className="l4 s12 w3-col">
                            <FormTextField
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

                        <div className="l6 s12 w3-col">
                            <FormTextField
                                label="മറ്റു ഫോൺ നമ്പറുകൾ "
                                placeholder="Other Contact Numbers"
                                name="aleternate_number" 
                                value = {this.state.form.aleternate_number}
                                inputClass="w3-input w3-border"
                                valueChange={this.changeFormValue.bind(this)}
                                errors = {this.state.errors.aleternate_number} />
                        </div>

                        
                        <div className="w3-col l6 s12 " id="location">
                            <label className="w3-text-black">സ്ഥലം </label> 
                            <GooglePlacesAutoComplete
                                albumLocation={googlePlace}
                                onPlaceChange={place => this.handlePlaceChange(place)}
                                placeholder = "Location"
                            />
                        </div>
                        <div className="l4 s12 w3-col">   
                        <SelectField
                                label="എന്ത് സഹായം ആണ് വേണ്ടത്"
                                placeholder="What Help you want"
                                name="help_type"
                                selectClass="w3-select w3-border"
                                isMandatory="true"
                                value = {this.state.form.district}
                                valueChange={this.changeFormValue.bind(this)}
                                errors = {this.state.errors.district}
                            >
                            <option value="food_and_water">ഭക്ഷണം വെള്ളം / Food &amp; Water</option>
                            <option value="medicine_blankets">മരുന്നുകൾ സാമഗ്രികൾ / Medicine &amp; Blankets</option>
                            <option value="rescue">രക്ഷപെടുത്തൂ / Rescue Me </option> 
                            <option value="reach_relatives">പ്രിയപ്പെട്ടവരുടെ വിവരം അറിയുക /Reach my Dear ones</option> 
                            <option value="rescue_someone"> മറ്റൊരാളെ രക്ഷപെടുത്തൂ /Rescue Someone</option> 
                            <option value="other">Other</option> 
                        </SelectField> 
                        </div>
                        <div className="l4 s12 w3-col">  
                        <SelectField
                            label="നിങ്ങളുടെ മൊബൈൽ ചാർജ്"
                            placeholder="Your Power backup"
                            name="power_backup"
                            selectClass="w3-select w3-border"
                            isMandatory="true"
                            value = {this.state.form.power_backup}
                            valueChange={this.changeFormValue.bind(this)}
                            errors = {this.state.errors.power_backup}
                            >
                            <option value="0_1">&lt; 1 hr / ഒരു മണിക്കൂറിൽ താഴെ </option>
                            <option value="1_4">1-4 hrs / മണിക്കൂർ  </option>
                            <option value="4_24">4-24 hours / മണിക്കൂർ </option> 
                        </SelectField> 
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
                        <div className="l12 s12 w3-col">
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
                        <div className="l12 s12 w3-col">
                            <FormTextarea 
    
                                name="member_details"
                                label="കൂടുതൽ വിവരങ്ങൾ "
                                placeholder="How Many Members need to be resuced Mention name:age format in spearate lines" 
                                inputClass="w3-input w3-border" 
                                valueChange={this.changeFormValue.bind(this)}
                                value = {this.state.form.information}
                                type="text" />
                        </div> 
                       
                        <div className="m12 s12 w3-col ">
                            <label className="w3-margin-bottom">
                                മാപ്പിൽ ലൊക്കേഷൻ കൃത്യതയോടെ അടയാളപ്പെടുത്തുക / Mark your location</label>
                            <div className="w3-row">
                               <GoogleMapWidget mapStyle={{height: '300px'}} 
                               place={this.state.place}
                               locationSelect={this.locationSelect.bind(this)}/>
                            </div>
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
    return {
        authUser: state.authUser
    }
}
export default connect(mapStateToProps, { 
    showMessage,
    hideMessage
})(Rescue);

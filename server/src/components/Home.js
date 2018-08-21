import React, {Component} from 'react'
import { connect } from 'react-redux'
const productDataMap = {}; 
import AppMessage from './AppMessage';
import Rescue from './Rescue';
import MarkSafe from './MarkSafe'; 
import AddServiceProvider from './AddServiceProvider'; 
import StatusWidget from './StatusWidget';
import { FormTextField,FormTextarea,GooglePlacesAutoComplete ,SelectField,Reveal,HeaderSection
} from './Helper.js';  
import { NavLink } from 'react-router-dom';


class MarkSafeModal extends Component {
    render(){
        return (
            <Reveal onClose={this.props.hideModal}>
                <FormTextField label="Enter Your Phone Number"/>
            </Reveal>
        )
    }
}

class MarkElseSafeModal extends Component {
    render(){
        return <Reveal onClose={this.props.hideModal}>
            <div>The reveal comes</div>
        </Reveal>
    }
}

class MarkWillingToHelp extends Component {
    render(){
        return <Reveal onClose={this.props.hideModal}>
            <div>The reveal comes</div>
        </Reveal>
    }
}

class Home extends Component {
    
    constructor(arg){
        super(arg);
        this.state = {
            modalContent:null,
            status:[]
        }   
    }

   
    componentDidMount(){
        // this.initialiseGMap(10.10,76.65);
    } 

    initialiseGMap (latitude,longitude) {
        if (!this.map){
            this.map = new google.maps.Map(document.getElementById('google-map-home'), {
                center: {lat: latitude, lng: longitude},
                zoom: 8,
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

        // this.map.setZoom(17); 
        this.map.setCenter({lat:latitude,lng:longitude});
        this.marker.setVisible(true);
    }
 
    hideModal() {
        this.setState({modalContent:null});
    }

    showModal(name){
        let content = null;
        if (name == 'help_center') {
            content = <AddServiceProvider hideModal={this.hideModal.bind(this)} />
        } else if (name == 'mark_safe') {
            content = <MarkSafe type="SELF" hideModal={this.hideModal.bind(this)} />
        } else if (name == 'mark_other_safe'){
            content = <MarkSafe type="BEHALF" hideModal={this.hideModal.bind(this)}/>
        } else if (name == 'willing_to_help'){
            content = <MarkWillingToHelp  hideModal={this.hideModal.bind(this)}/>

        } else {
            content = <Rescue hideModal={this.hideModal.bind(this)}/>;
        }
        this.setState({modalContent:content})
    }
 

    render() {
    const { 
        isFetching, works 
    } = this.props 
    return (
       <div>
        <AppMessage />
         <HeaderSection authUser={this.props.authUser} />
        <div className="w3-content ">
            {this.state.modalContent}
            <div className="w3-padding-64">
                <NavLink to="/service-providers/"><button className="w3-button w3-green w3-right">Service Providers</button></NavLink>
                <h1 className="w3-center">Application for handling Help Requests    </h1>
                <div className="w3-padding-64">
                    <button className="w3-button w3-margin-bottom w3-block w3-cyan" 
                        onClick={this.showModal.bind(this, 'help_center')}>Add Service Provider / <br className="w3-hide-large" />സേവനദാതാവ്</button>

                    <button  onClick={this.showModal.bind(this,'mark_safe')} className="w3-button w3-margin-bottom w3-block w3-green">Mark Yourselves Safe /<br className="w3-hide-large" />നിങ്ങൾ സുരക്ഷിതനാണോ </button>
                    <button  onClick={this.showModal.bind(this,'mark_other_safe')} className="w3-button w3-margin-bottom w3-block w3-green">Mark People Whom you know are Safe /<br className="w3-hide-large" /> നിങ്ങൾക്കറിയാവുന്ന സുരക്ഷിതരായവരുടെ വിവരം </button>
                    
                    <button onClick={this.showModal.bind(this,'willing_to_help')} className="w3-button   w3-margin-bottom w3-hide w3-block w3-blue">Register as an On Field Volunteer /<br className="w3-hide-large" /> നിങ്ങൾ സേവന സന്നദ്ധനാണെന്ന് അടയാളപ്പെടുത്തുക </button>

                    <button className="w3-button w3-margin-bottom w3-block w3-orange" 
                        onClick={this.showModal.bind(this,'request')}>Request For Help / <br className="w3-hide-large" />സേവനം ആവശ്യപ്പെടുക  </button>
                </div>
                <div className="w3-row">
                    <div className="w3-col m6 s12">
                        <ul>
                            <li>Volunteers can co-odinate on requests received</li>
                            <li> make calls and update status </li>
                            <li>  Mark complete Help requests to completion</li>
                            <li>Currently added "Help requests" from keralarescue.in </li>
                        </ul>
                    </div>
                    <div className="w3-col m6 s12">
                        <StatusWidget />
                    </div> 
                </div>
                <iframe className="w3-margin-top" src="https://www.google.com/maps/d/embed?mid=19pdXYBAk8RyaMjazX7mjJIJ9EqAyoRs5" style={{width:"100%",height:"500px"}}></iframe>
            </div> 
        </div>

        <footer className="w3-container w3-padding w3-center" 
            >
            <p> for any feedback on changes / data / api   please mail your feedback to keralafights@ceegees.in / <a target="_blank" href="https://github.com/Ceegees/kerala-fights">GitHub</a> </p>
        </footer>
        <template id="form_success">             
            <div className="w3-center w3-container">
                <h4>Thank you, we will get back to you shortly.</h4>
                <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"><circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none"/><path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/></svg>
            </div> 
        </template>
       </div>
    );
  }
}
 
function mapStateToProps(state) {  
    return {
       authUser:state.authUser
    }
}

export default connect(mapStateToProps)(Home)
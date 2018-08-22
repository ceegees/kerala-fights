import React, {Component} from 'react'
import { connect } from 'react-redux'
import {withRouter} from 'react-router-dom'
const productDataMap = {}; 
import AppMessage from './AppMessage';
import Rescue from './Rescue';
import MarkSafe from './MarkSafe'; 
import AddServiceProvider from './AddServiceProvider'; 
import StatusWidget from './StatusWidget';
import { FormTextField,FormTextarea,GooglePlacesAutoComplete ,SelectField,Reveal,HeaderSection, Leaderboard
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
        if(this.props.match.params.label){
            this.showModal(this.props.match.params.label);
        }
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
                    <div className=" ">
                        <div className="w3-padding-32" style={{padding:"10px"}}>
                            <NavLink to="/service-providers/list/"><button className="w3-button w3-green w3-right w3-margin-bottom">List Service Providers</button></NavLink>
                            <button className="w3-button w3-round w3-large w3-padding-32    w3-margin-bottom w3-block w3-blue-grey" 
                            onClick={this.showModal.bind(this,'request')}>Request For Help / <br className="w3-hide-large" />സേവനം ആവശ്യപ്പെടുക  </button>
                            <button className="w3-button w3-margin-bottom w3-block w3-cyan" 
                        onClick={this.showModal.bind(this, 'help_center')}>Add Service Provider / <br className="w3-hide-large" />സേവനദാതാവ്</button>
                            <button  onClick={this.showModal.bind(this,'mark_safe')} className="w3-button w3-margin-bottom w3-round w3-block w3-green">Mark Yourselves Safe /<br className="w3-hide-large" />നിങ്ങൾ സുരക്ഷിതനാണോ </button>
                            <button  onClick={this.showModal.bind(this,'mark_other_safe')} className="w3-button w3-round w3-margin-bottom w3-block w3-green">Mark People Whom you know are Safe /<br className="w3-hide-large" /> നിങ്ങൾക്കറിയാവുന്ന സുരക്ഷിതരായവരുടെ വിവരം </button>
                            
                            <button onClick={this.showModal.bind(this,'willing_to_help')} className="w3-button   w3-margin-bottom w3-hide w3-block w3-blue">Register as an On Field Volunteer /<br className="w3-hide-large" /> നിങ്ങൾ സേവന സന്നദ്ധനാണെന്ന് അടയാളപ്പെടുത്തുക </button>
                            <a className="w3-hide" href="https://dfb7zgpusuvzh.cloudfront.net/kerala_fights.apk" className="w3-block w3-green w3-padding w3-round">
                                <img  style={{width:"80px",height:"80px",marginRight:"20px"}} src="https://image.flaticon.com/icons/png/512/61/61120.png" />
                                Download Field Volunteer Android App
                            </a>
                        </div>
                        <div className="w3-row">
                        <h2 className="w3-center w3-padding-33"> Solving the largest crisis Kerala have seen in a 100 Years    </h2>
                            <div className="w3-col m6 s12">
                                <b>How You can Help</b>
                                <ul>
                                    <li>Check the tickets and see if the location is marked correctly</li>
                                    <li>Check if the tickets are having the Needs Marked correctly</li>
                                    <li>Talk to affected people and see if their needs are met.</li>
                                    <li>Coordinate with on field Volunteer to make sure help is reaching the needy.</li>
                                    <li><a target="_blank" href="https://docs.google.com/document/d/1jM_hdHgP-kxkzOtxl0n8mUGY4EzP6di2NyHIEvFp8YI/edit" >How To Use</a> , <a target="_blank"  href="https://docs.google.com/document/d/1oMs4JwHMDS9agR3voVpeGL0SMhfE35fETYNbD5rZLN8/edit">ഉപയോഗക്രമം </a></li>
                                </ul>
                                <div className="w3-padding">
                                    <a href="/auth/facebook" className="w3-indigo w3-hide w3-block w3-margin-bottom w3-round w3-padding ">What are you waiting for ? Login with your Facebook Id and be part of the Cause</a>
                                <StatusWidget />
                                </div>
                            </div>
                            <div className="w3-col m6 s12">
                                <Leaderboard />
                            </div> 
                        </div>
                        <iframe className="w3-margin-top" src="https://www.google.com/maps/d/embed?mid=19pdXYBAk8RyaMjazX7mjJIJ9EqAyoRs5" style={{width:"100%",height:"500px"}}></iframe>
                    </div> 
                </div>

                <footer className="w3-container w3-padding w3-center" 
                    >
                    <p> For any feedback on changes / data / api, please mail your feedback to keralafights@ceegees.in | <a target="_blank" href="https://github.com/Ceegees/kerala-fights">GitHub</a> | <a href="/disclaimer" target="_blank">Disclaimer</a></p>
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

export default connect(mapStateToProps)(withRouter(Home))
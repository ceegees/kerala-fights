import React, { Component } from 'react'; 
import { connect } from 'react-redux';
import {hideMessage} from './../redux/actions.js';

class AppMessage extends Component {
    render(){
        const { appMessage } = this.props; 
        let message = null;
        if (appMessage && appMessage.text !== '') { 
            message =  <div className={`${appMessage.cls} app-top-alert`} >
                <button onClick={this.props.hideMessage} 
                    className={`w3-display-topright w3-button w3-padding-small`} >&times;
                </button>
                <h5>{appMessage.text}</h5>
            </div>
            if (appMessage.cls == 'w3-green' && appMessage.stay == 0){
                setTimeout(this.props.hideMessage,2000);
            }
        }
        return message;
    }
}

export default connect((s)=>{return {
    appMessage:s.appMessage
}},{
    hideMessage
})(AppMessage)
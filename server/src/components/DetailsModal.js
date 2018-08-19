import  React,{ Component } from 'react'; 
import { FormTextField,FormTextarea,Spinner ,SelectField} from './Helper.js';  
import axios from 'axios';
import { connect } from 'react-redux';
import moment from 'moment';
import { showMessage, hideMessage } from './../redux/actions.js';    
 
import Rescue from './Rescue';
const RowItem =({name,value}) => {
    return <div  >
        <span>{name}:</span>
        <span>{value}</span>
    </div>
}

class DetailsModal extends Component {
    constructor(args){
        super(args);
        this.state =   {
            workLog:null,
            update:null,
            form: {},
            errors: {}, 
            successMessage: ''
        }
        this.map = null;
        this.marker = null;
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
    componentDidMount(){
        const {item} = this.props;
        this.state.form.id = item.id;
        this.state.form.severity = item.operatorSeverity;
        if (item.latLng && item.latLng.coordinates && item.latLng.coordinates.length == 2){
            this.initialiseGMap(item.latLng.coordinates[0],item.latLng.coordinates[1]);
        }
        $("#severity_select").val(item.operatorSeverity);
        axios.get(`/api/v1/rescue-worklog?id=${item.id}`).then(resp=>{
            this.setState({
                update:resp.data.data.request,
                workLog:resp.data.data.log
            });
        })
    }
    componentWillUnmount(){
        axios.post('/api/v1/rescue-release-lock',{id:this.props.item.id}).then(res => {
            console.log(res);
        });
    }
    changeFormValue (name,value) {
        this.state.form[name] = value;
    }
    handleUpdate(e){
        axios.post('/api/v1/rescue-update',this.state.form).then(resp=>{
            if(!resp.data.meta.success){
                this.props.showMessage('fail',resp.data.meta.message);  
                if (resp.data.meta.message.indexOf('login') != -1) {
                    setTimeout(()=>{
                        document.location.href = "/";
                    },5000)
                }
                return;
            }
            this.props.showMessage('success','Changes updated');
            this.props.hideModal('reload');
        });
    }

    render(){
        const {item }  = this.props;
        const {workLog,update} = this.state;
        const obj = this.props.statusList.find(i=> i.key.toLowerCase() == item.status.toLowerCase());
        const link = <a target="_blank" 
            href={`https://www.keralarescue.in/request_details/${item.remoteId}/`} 
            >{item.source}</a>;
        let mapStyle={display:'none'};
        if (item.latLng){
            mapStyle = {minHeight:"200px"}
        }
        let content = <Spinner />
        if (workLog){
            content = workLog.map(item => {
                return <div className="w3-panel " key={`item_${item.id}`}>
                    <div   style={{whiteSpace:'pre-wrap'}}> 
                        <a href={item.providerId}><img className="w3-round " src={item.actor.profileLink} style={{display:"inline-block",marginRight:"10px",width:"32px",height:"32px"}}/> 
                        </a>
                        {item.comments}</div>
                    <div>
                    <div className="w3-row">
                        <div className="w3-left">
                        <span className="w3-tag w3-purple w3-padding-small w3-tiny w3-round">{item.statusIn}</span> to <span className="w3-tag w3-purple w3-padding-small w3-tiny w3-round">{item.statusOut}</span>
                        </div>
                            <div className="w3-right w3-small">
                                Updated by {item.actor.name} {moment(item.createdAt).fromNow()}</div>
                            </div>
                    </div> 
                    <hr/>
                </div>
            })
        }

        let form = null;
        if (update && (!update.operator || update.operator.id == this.props.authUser.id) ) {
            form = <form className="w3-row-padding"> 
                <div className="w3-col s12">  
                        <FormTextarea 
                            label="Comments"
                            placeholder="Add your comments after action, eg: called them they are fine"
                            name="comments"
                            inputClass="w3-input w3-border"
                            isMandatory="true"
                            value = {this.state.form.comments}
                            valueChange={this.changeFormValue.bind(this)}
                            errors = {this.state.errors.comments} 
                        />
                </div>
                <div className="w3-col  s12"><SelectField 
                    label="How Severe is the issue"
                    id="severity_select"
                    name="severity"
                    selectClass="w3-select w3-border"
                    isMandatory="true"
                    defaultValue={item.operatorSeverity}
                    value = {this.state.form.severity}
                    valueChange={this.changeFormValue.bind(this)}
                    errors = {this.state.errors.severity}
                    >
                <option value="-">---</option>
                <option value="0">Not Severe</option>
                <option value="1">Moderate</option>
                <option value="3">Needs Help</option>
                <option value="4">Urgent</option>
                <option value="6">Very Urgent</option>
                <option value="8">Life Threatening</option>
                </SelectField>
            </div>
                <div className="w3-col  s12">
                    <SelectField 
                        label="Change Status"
                        name="status"
                        selectClass="w3-select w3-border"
                        isMandatory="true"
                        value = {this.state.form.status}
                        valueChange={this.changeFormValue.bind(this)}
                        errors = {this.state.errors.status}
                        >
                        <option value="--">---</option>
                    {obj && obj.nextStates.map(item => <option value={item.value}>{item.text}</option>)}
                    </SelectField>
                </div>
                <div className="w3-col s12 w3-margin-top">
                    <button type="button"
                    onClick={this.handleUpdate.bind(this)} className="w3-button w3-green w3-right w3-small">Update</button> 
                </div> 
            </form>
        } else if (update && update.operator) { 
            form = <div>Working :{update.operator.name}</div>
        }
       return <div className="w3-container w3-padding ">   
                <div className="w3-row-padding w3-margin-bottom">
                    <div className="w3-col l5 s12">
                        <RowItem name="CaseId" value={item.id+'-'+item.remoteId} />
                        <RowItem name="Name" value={item.personName} />
                        <RowItem name="Phone" value={<a className="w3-buttom w3-tag w3-redice w3-round w3-blue" href={`tel:${item.phoneNumber}`} > {item.phoneNumber}</a>} />
                        <RowItem name="Source" value={link} />
                        <RowItem name="Location" value={item.location} />
                        <RowItem name="District" value={item.district} />
                        <RowItem name="Type" value={item.type} />
                        <RowItem name="Address" value={item.address} />
                        <RowItem name="Serverity" value={item.operatorSeverity == -1 ? 'Not Updated':item.operatorSeverity}  />
                        <RowItem name="Information" value={item.infomration} />
                        <RowItem name="Status" value={item.status} />
                        <RowItem name="CreatedAt" value={moment(item.createdAt).fromNow()} />
                        <RowItem name="Volunteer Status" value={item.operatorStatus} />
                        <RowItem name="Volunteer Acted At" value={item.operatorLastUpdated} />
                    </div> 
                    <div className="w3-col l7 s12">
                        <div id="google-map-detail" style={mapStyle}></div> 
                       {form}
                    </div>
                </div>    
                <hr/>
                {content}
            </div>
        
    }
}

export default connect((state)=>{
    return {
        statusList:state.statusList
    }
}, { 
    showMessage, 
    hideMessage
})(DetailsModal);
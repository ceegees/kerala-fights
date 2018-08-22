import  React,{ Component } from 'react'; 
import { FormTextField,FormTextarea,Spinner ,GoogleMapWidget,SelectField, GooglePlacesAutoComplete} from './Helper.js';  
import axios from 'axios';
import { connect } from 'react-redux';
import moment from 'moment';
import { showMessage, hideMessage,getLatLng } from './../redux/actions.js';    
 
import Rescue from './Rescue';

const RowItem =({name,value}) => {
    return <div  style={{padding:"2px 0px"}} >
        <div style={{color:"#888"}}>{name}:</div>
        <div style={{wordWrap:'break-word',marginLeft:"2px"}}>{value}</div>
    </div>
}

class DetailsModal extends Component {
    constructor(args){
        super(args);
        this.state =   {
            mode:'status',
            updateForm:{},
            updateErrors:{},
            workLog:null,
            update:null,
            place:null,
            form: {},
            errors: {}, 
            successMessage: ''
        }
        this.map = null;
        this.marker = null;
        this.handlePlaceChange = this.handlePlaceChange.bind(this);
    }

    locationSelect(lat,lon){ 
        this.state.updateForm.location_lat = lat;
        this.state.updateForm.location_lon = lon;
    }

    handlePlaceChange(place){ 
        if (!place.geometry) {
          return;
        }
        this.state.updateForm.address_components  = place.address_components;
        this.setState({
            place:place
        });
    } 
    componentDidMount(){
        const {item} = this.props;
        this.state.form.id = item.id;
        this.state.form.severity = item.operatorSeverity;
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

    saveDetails(){
        axios.post('/api/v1/resuce-edit',this.state.updateForm).then(resp=>{
            this.setState({
                update:resp.data.data,
                mode:'status'
            });
            
        });
    }

    changeUpdateValue(name,value){
        this.state.updateForm[name]= value;
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

    changeMode(mode){
        const {update} = this.state;
        this.state.updateForm = {
            id:update.id,
            type:update.type,
            personName:update.personName,
            phoneNumber:update.phoneNumber,
            address:[update.location,update.address].join('') ,
            information:update.information,
            peopleCount:update.peopleCount,
            
            detailrescue:update.json.detailrescue,
            detailwater:update.json.detailwater,
            detailtoilet:update.json.detailtoilet,
            detailfood:update.json.detailfood,
            detailmed:update.json.detailmed,
            detailkit_util:update.json.detailkit_util,
            detailcloth:update.json.detailcloth,
            detail:update.json.detail,
        } 
        this.state.updateErrors={};
        this.setState({mode:mode});
    }

    renderEdit(){
        const {update} = this.state; 
        const latLng = getLatLng(update);
        return <div className="w3-panel w3-padding w3-white">
                <div className="w3-row-padding w3-margin-bottom"> 
                    <div  className="w3-col l12"> Case ID {update.id}-{update.remoteId}</div>
                    <div className="w3-col l12 w3-margin-bottom">
                    <GooglePlacesAutoComplete  
                        onPlaceChange={place => this.handlePlaceChange(place)}
                        placeholder = "Search Location to drop pin" /> 
                    <GoogleMapWidget mapStyle={{height: '300px'}} 
                        mapId="google-edit-map" 
                        place={this.state.place} 
                        location={{lat:latLng.lat,lng:latLng.lng}}
                        locationSelect={this.locationSelect.bind(this)}/>
                        
                    </div>
                <div className="w3-col l6 s12">
                     <SelectField inputClass="w3-input w3-small w3-border" 
                        label="Request Type"
                        name="type" 
                        isMandatory="true"
                        defaultVal={update.type}
                        value = {this.state.updateForm.type}
                        valueChange={this.changeUpdateValue.bind(this)}
                        errors = {this.state.updateErrors.type} 
                    >
                    <option type="rescue_request">Un Categorized from Kerala rescue</option>
                    {this.props.requestTypeList.map(item =><option 
                            key={item.value} 
                            value={item.value}>{item.name}</option>)}
                    </SelectField>

                    <FormTextField inputClass="w3-input w3-small w3-border" 
                        label="Name"
                        name="personName" 
                        isMandatory="true"
                        defaultVal={update.personName}
                        value = {this.state.updateForm.personName}
                        valueChange={this.changeUpdateValue.bind(this)}
                        errors = {this.state.updateErrors.personName} 
                    />
                    <FormTextField inputClass="w3-input w3-small w3-border" 
                        label="Phone Number"
                        name="phoneNumber" 
                        isMandatory="true"
                        defaultVal={update.phoneNumber}
                        value = {this.state.updateForm.phoneNumber}
                        valueChange={this.changeUpdateValue.bind(this)}
                        errors = {this.state.updateErrors.phoneNumber} 
                    />
                    <FormTextField inputClass="w3-input w3-small w3-border" 
                        name="peopleCount"
                        defaultVal={update.peopleCount}
                        value = {this.state.updateForm.peopleCount}
                        valueChange={this.changeUpdateValue.bind(this)}
                        errors = {this.state.updateErrors.peopleCount} 
                        label="Number of People"  />
                    <FormTextField inputClass="w3-input w3-small w3-border" 
                        label="Requeste for [self /others]" 
                        name="ownRequest"
                        defaultVal={update.ownRequest}
                        value = {this.state.updateForm.ownRequest}
                        valueChange={this.changeUpdateValue.bind(this)}
                        errors = {this.state.updateErrors.ownRequest}  />

                    <FormTextarea inputClass="w3-input w3-small w3-border"  
                        label="Address"  
                        name="address" 
                        isMandatory="true"
                        defaultVal={update.address}
                        value = {this.state.updateForm.address}
                        valueChange={this.changeUpdateValue.bind(this)}
                        errors = {this.state.updateErrors.address}  />
                    <FormTextarea inputClass="w3-input w3-small w3-border" 
                        label="Extra Information" 
                        name="information"  
                        value = {this.state.updateForm.information}
                        valueChange={this.changeUpdateValue.bind(this)}
                        errors = {this.state.updateErrors.information} 
                        />
                </div>
                <div className="w3-col l6 s12">
                
                <FormTextField inputClass="w3-input w3-small w3-border" 
                        name="detailrescue" 
                        
                        defaultVal={update.json.detailrescue}
                        value = {this.state.updateForm.detailrescue}
                        valueChange={this.changeUpdateValue.bind(this)}
                        errors = {this.state.updateErrors.detailrescue} 

                    placeholder="leave empty if not needed" 
                    label="Need Rescue/ Evacuation" />
                <FormTextField inputClass="w3-input w3-small w3-border" 
                    placeholder="leave empty if not needed" 
                    label="Water Requirements" 
                        name="detailwater" 
                        
                        defaultVal={update.json.detailwater}
                        value = {this.state.updateForm.detailwater}
                        valueChange={this.changeUpdateValue.bind(this)}
                        errors = {this.state.updateErrors.detailwater} 
                    />
                <FormTextField inputClass="w3-input w3-small w3-border" 
                    placeholder="leave empty if not needed" 
                    label="Toiletry Requirements" 
                    name="detailtoilet" 
                        
                        defaultVal={update.json.detailtoilet}
                        value = {this.state.updateForm.detailtoilet}
                        valueChange={this.changeUpdateValue.bind(this)}
                        errors = {this.state.updateErrors.detailtoilet} 
                    />
                <FormTextField inputClass="w3-input w3-small w3-border" 
                    placeholder="leave empty if not needed" 
                    label="Food Requirements if any" 
                    name="detailfood" 
                        
                        defaultVal={update.json.detailfood}
                        value = {this.state.updateForm.detailfood}
                        valueChange={this.changeUpdateValue.bind(this)}
                        errors = {this.state.updateErrors.detailfood} 
                    />
                <FormTextField inputClass="w3-input w3-small w3-border" 
                        placeholder="leave empty if not needed" 
                        label="Medicines Required" 
                        name="detailmed" 
                        
                        defaultVal={update.json.detailmed}
                        value = {this.state.updateForm.detailmed}
                        valueChange={this.changeUpdateValue.bind(this)}
                        errors = {this.state.updateErrors.detailmed} 
                    />
                <FormTextField inputClass="w3-input w3-small w3-border" 
                    placeholder="leave empty if not needed" 
                    label="Kitchen Utencils" 
                    name="detailkit_util" 
                        
                        defaultVal={update.json.detailkit_util}   
                        value = {this.state.updateForm.detailkit_util}
                        valueChange={this.changeUpdateValue.bind(this)}
                        errors = {this.state.updateErrors.detailkit_util} 
                    />

                     <FormTextField inputClass="w3-input w3-small w3-border" 
                    placeholder="leave empty if not needed" 
                    label="Other  Requirements" 
                    name="detail_other" 
                        
                        defaultVal={update.json.detail_other}   
                        value = {this.state.updateForm.detail_other}
                        valueChange={this.changeUpdateValue.bind(this)}
                        errors = {this.state.updateErrors.detail_other}     
                    />
                    <div className="w3-margin-top">
                    <button className="w3-button w3-small w3-black w3-left" 

                        onClick={this.changeMode.bind(this,'status')}>Cancel</button>
                    <button onClick={this.saveDetails.bind(this)} 
                        className="w3-button w3-small w3-green w3-right">Save Infomration</button>
                    </div>
                </div>
                </div> 
        </div>
    }
    render(){
        let {item }  = this.props;
        const {workLog,update} = this.state;
        if(update){
            item = update;
        }
        const obj = this.props.statusList.find(i=> i.key.toLowerCase() == item.status.toLowerCase());
        const link = <a target="_blank" 
            href={`https://www.keralarescue.in/request_details/${item.remoteId}/`} 
            >{item.source}</a>;


        let mapStyle= { display:'none' };
        if (item.latLng){
            mapStyle = {minHeight:"200px"}
        }

        let content = <Spinner />
        if (workLog){
            content = workLog.map(item => {
                return <div  className="w3-panel " key={`item_${item.id}`}>
                    <div style={{whiteSpace:'pre-wrap',wordWrap:'break-word'}}> 
                        <a href={item.providerId}>
                            <img className="w3-round " src={item.actor.profileLink} style={{display:"inline-block",marginRight:"10px",width:"32px",height:"32px"}}/> 
                        </a>
                        {item.comments.indexOf('DATA_EDIT') == 0 ? 'Fields Updated': item.comments}</div>
                    <div>
                        <div className="w3-row">
                            <div className="w3-left">
                                <span className="w3-tag w3-purple w3-padding-small w3-tiny w3-round">   {item.statusIn}</span> to <span className="w3-tag w3-purple w3-padding-small w3-tiny w3-round">{item.statusOut}</span>
                            </div>
                            <div className="w3-right w3-small">
                                Updated by {item.actor.name} {moment(item.createdAt).fromNow()}</div>
                        </div>
                    </div> 
                    <hr/>
                </div>
            })
        }

        let updateForm = null; 
        if (update && (!update.operator || update.operator.id == this.props.authUser.id) ) {
        
            updateForm = <form className="w3-row-padding"> 
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
                <div className="w3-col s12"><SelectField 
                    label="How Severe is the issue"
                    id="severity_select"
                    name="severity"
                    selectClass="w3-select w3-border"
                    isMandatory="true"
                    defaultVal={item.operatorSeverity}
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
                <div className="w3-col s12">
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
                <button onClick={this.changeMode.bind(this,'edit')} 
                className="w3-button w3-tiny w3-deep-orange" type="button" >Edit Information</button>
                    <button type="button"
                    onClick={this.handleUpdate.bind(this)} className="w3-button w3-green w3-right w3-small">Update</button> 
                </div> 
            </form>
        } else if (update && update.operator) { 
            updateForm = <div>Working :{update.operator.name}</div>
        }

        if (this.state.mode == 'edit' && update) {
            return this.renderEdit();
        }

        let leftCont = <div className="w3-col l6 s12">
           
            <RowItem name="CaseId" value={[item.id,item.remoteId].join('-')} />

            <RowItem name="Type" value={item.type} />
            <RowItem name="People Count" value={item.peopleCount} />
            <RowItem name="Name" value={item.personName} />
            <RowItem name="Phone" value={<a className="w3-buttom w3-tag w3-redice w3-round w3-blue" href={`tel:${item.phoneNumber}`} > {item.phoneNumber}</a>} />
            <RowItem name="Source" value={link} />
            <RowItem name="Location" value={item.location} />
            <RowItem name="District" value={item.district} />
            <RowItem name="Address" value={item.address} />
            <RowItem name="Serverity" value={item.operatorSeverity == -1 ? 'Not Updated':item.operatorSeverity}  />
            <RowItem name="Information" value={item.information} />
            <RowItem name="Status" value={item.status} />
            <RowItem name="CreatedAt" value={moment(item.createdAt).fromNow()} />
            <RowItem name="Volunteer Status" value={item.operatorStatus} />
            <RowItem name="Volunteer Acted" value={moment(item.operatorUpdatedAt).fromNow()} />
     
        </div> ;

        const latlng = getLatLng(item);

       return <div className="w3-container w3-padding ">   
                <div className="w3-row-padding w3-margin-bottom">
                    {leftCont}
                    <div className="w3-col l6 s12">  
                        <GoogleMapWidget mapStyle={{minHeight:"200px"}} 
                            mapId="google-map-detail" 
                            location={latlng} />
                       {updateForm}
                    </div>
                </div>    
                <hr/>
                {content}
            </div>
        
    }
}

export default connect((state)=>{
    return {
        requestTypeList:state.requestTypeList,
        severityList:state.severityList,
        statusList:state.statusList
    }
}, { 
    showMessage, 
    hideMessage
})(DetailsModal);

import  React,{ Component } from 'react';   
import { FormTextField,FormTextarea,Spinner,Paginator ,SelectField,Reveal} from './Helper.js';  
import axios from 'axios';
import moment from 'moment';
import FilterComponent from './FilterComponent';
import {NavLink,Link,withRouter,Switch,Route} from 'react-router-dom';
import qs from 'query-string';

export default class RequestLister extends Component {
    constructor(arg){
        super(arg);
        this.state = {
            data:null,
        }
        this.filter = {}
    }
    fetchData(props){
        let {page=1,status ='new',search=''} = props;
        this.setState({data:null});
        if (status == 'search'){ 
            search = page;
            page = 1;
        }

        if (status == 'duplicates'){ 
            search = page;
            if (search == "1"){
                search = "";
            }
            page = 1;
        }
        const obj = {
            status:status,
            page:page,
            q:search,
        }
        if (this.filter.district){
            obj.district = this.filter.district;
        }
        
        if (this.filter.timeRange){
            obj.startAt = this.filter.timeRange.start,
            obj.endAt = this.filter.timeRange.end
        }
        const str = qs.stringify(obj); 
        axios.get(`/api/v1/rescue-list?${str}`).then(resp=>{
            this.setState({
                data:resp.data.data
            });
        });
    }

    markDuplicate(item){
        axios.post('/api/v1/rescue-update',{
            id:item.id,
            comments:'Duplicate Confirmed',
            severity:1,
            status:'cleanup_duplicate'
        }).then(resp=>{
            if(!resp.data.meta.success){
                this.props.showMessage('fail',resp.data.meta.message);  
                return   
            }
            this.props.showMessage('success','Changes updated'); 
            this.fetchData(this.props);
        });
    }
    componentDidMount () {   
        this.fetchData(this.props);
    }
    componentWillReceiveProps(nextProps){
        if (nextProps.page  != this.props.page){ 
            this.fetchData(nextProps);
        } else if (nextProps.status != this.props.status){
            this.fetchData(nextProps);   
        } else if (nextProps.search != this.props.search){
            this.fetchData(nextProps);       
        }
    }
    handleFilterData(filterData) {
        this.filter = filterData;
        this.fetchData(this.props);
    }
    render(){
        const {data} = this.state;
        const {page=1 ,status='new'} = this.props;

        let pagination = null;
        let content = null;
        let totalCount = '';
        if (!data){
            content = <Spinner />
        } else if (data.list.length == 0){
             content = <div className="w3-padding-64 w3-large w3-center">The List is empty</div>
        } else {
            pagination = <Paginator data={data} status={status} page={page} />
            totalCount = `Total: ${data.total}`;

            content = data.list.map(item => { 
                let inPageOption = null;
                if(item.parentId){
                    if (status == 'duplicates'  && item.status != 'RESOLVED' && item.parentId == page){
                       inPageOption = <button onClick={this.markDuplicate.bind(this,item)} className="w3-display-topright w3-small w3-button w3-amber">Mark Duplicate
                           of {item.parentId}-XXXX)</button> 
                    } else if (page != item.parentId) {
                        inPageOption = <Link to={`/manage/duplicates/${item.parentId}`}   
                        className="w3-display-topright w3-small w3-button w3-amber" >
                        View Dupliates</Link>
                    }
                } 

                let actionItem = null;
                if (!item.operator || item.operator.id == this.props.authUser.id) {
                    actionItem = <button className="w3-display-bottomright w3-small w3-button w3-green" 
                    onClick={this.props.showDetailModal.bind(this,item)}>Help</button>
                } else {
                    actionItem = <div className="w3-tag w3-round w3-padding-small w3-display-bottomright w3-yellow">Working: {item.operator.name}</div>
                }


                return (<div key={`item_${item.id}`} className="w3-display-container w3-white w3-margin w3-padding">
                        CaseID : {`${item.id}-${item.remoteId}`}<br/><br/>
                        Name :{item.personName}<br/>
                        Phone : {item.phoneNumber}<br/>
                        Source :<a href={`https://www.keralarescue.in/request_details/${item.remoteId}/`}  target="_blank">{item.source}</a><br/>
                        District :{item.district}<br/>
                        Details  :{item.information}<br/>
                        Created :{moment(item.createdAt).fromNow()}<br/>
                        {(status == 'duplicates' || status == 'search') ?
                            [`Operator Status:${item.operatorStatus}`,<br/>, `Status : ${item.status}`]
                         :null}
                        <br/>

                        <div>

                        {item.json && item.json.tags.map(name => 
                            <div key={name} className="w3-small w3-round w3-margin-right w3-tag w3-purple">{name}</div>)}
                        </div>
                        {inPageOption}
                        {actionItem}
                        
                    </div>);
            });
        }
            return <div style={{minHeight:"100vh",marginTop:"64px"}} > 
                        <FilterComponent  handleFilterData={this.handleFilterData.bind(this)} >
                        <div className="w3-bar-item w3-right" >{totalCount}</div>

                        </FilterComponent>  
                    
                    {content}
                    <div className="w3-center ">
                    {pagination}
                    </div>
                </div> 
    }
}
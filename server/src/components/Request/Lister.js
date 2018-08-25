
import  React,{ Component } from 'react';   
import {Spinner,Paginator ,Reveal} from '../Common/Helper.js';  
import axios from 'axios';
import moment from 'moment';;
import {NavLink,Link,withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import qs from 'query-string'; 
import DetailsModal from './Details';
import { showMessage, hideMessage } from './../../redux/actions.js';   
class  RequestItem extends Component {
    render() {

        const {item,authUser,status,page,showDetailModal} = this.props;
        let inPageOption = null;
        if(item.parentId){
            if (status == 'duplicates'  && item.status != 'RESOLVED' 
            && item.parentId == page){
                inPageOption = <button onClick={e => this.props.markDuplicate(item) } className="w3-display-topright w3-small w3-round w3-button w3-amber">Mark Duplicate
                    of {item.parentId}-XXXX)</button> 
            } else if (page != item.parentId) {
                inPageOption = <Link to={`/manage/duplicates/${item.parentId}`}   
                className="w3-display-topright w3-small w3-button w3-round w3-amber" >
                View Duplicates</Link>
            }
        } 

        let actionItem = null;
        if (!authUser) {
        actionItem = <a  className="w3-tag w3-round w3-padding-small w3-display-bottomright w3-yellow" href="/dashboard">Login to Help</a>
        }else if (!item.operator  || item.operator.id ==  authUser.id) {
            actionItem = <button type="button" 
            className="w3-display-bottomright w3-small w3-round w3-button w3-green" 
            onClick={e => showDetailModal(item)}>Help</button>
        } else {
            actionItem = <div className="w3-tag w3-round w3-padding-small w3-display-bottomright w3-yellow">Working: {item.operator.name}</div>
        }

        let wfitem = this.props.statusList.find(st => st.key.toLowerCase() == item.status.toLowerCase()) ;
        let color = 'w3-border-purple';
        if (wfitem){
            color = `w3-border-${wfitem.color}`
        }
        

        return (<div    key={`item_${item.id}`} 
        className={`${color} w3-leftbar  w3-display-container w3-margin-bottom w3-white kf-request-item  w3-padding`}>

            CaseID : {[ item.id,item.remoteId].join('-')}<br/><br/>
            Name :{item.personName}<br/> 
            Type : {item.type}<br/>
            Source :<a href={`https://www.keralarescue.in/request_details/${item.remoteId}/`}  target="_blank">{item.source}</a><br/>
            District :{item.district}<br/>
            Details  :{item.information}<br/>
            People Count  :{item.peopleCount}<br/>

            Operator Status  :{item.operatorStatus}<br/>
            Created :{moment(item.createdAt).fromNow()}<br/>
            {(status == 'duplicates' || status == 'search') ?
                <div>
                Operator Status : {item.operatorStatus} <br/>
                Satus : {item.status}
                </div>:null
                }
            <br/>
            <div>
            {item.json && item.json.tags && item.json.tags.map(name => 
                <div key={name} 
                    className="w3-small w3-round w3-margin-right w3-tag w3-purple">{name}</div>)}
            </div>
            {inPageOption}
            {actionItem}
            
        </div>);
    }
}

class RequestLister extends Component {
    constructor(arg){
        super(arg);
        this.state = {
            data:null,
            modal:null
        }; 
    }
    showDetailModal(item){
        this.setState({
            modal:<Reveal  onClose={this.hideModal.bind(this)} >
                <DetailsModal  authUser={this.props.authUser} 
                hideModal={this.hideModal.bind(this)} 
                 item={item}   />
            </Reveal>
        });
    }
    hideModal(msg = ''){
        this.setState({modal:null});
        if (msg == 'reload'){
            this.fetchData(this.props);
        }
    }

    fetchData(props){
        let {page=1,status ='',search=''} = props;
        this.setState({data:null});
        let obj = {
            status:status,
            page:page,
            q:search,
        }
        obj = Object.assign(obj,props.filter);
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
            status:'duplicate_resolved'
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
        const {page=1 ,status='all'} = this.props;

        let pagination = null;
        let content = null;
        let totalDemand= null;
        let totalRequests = null;
        if (!data){
            content = <Spinner />
        } else if (data.list.length == 0){
             content = <div className="w3-padding-64 w3-large w3-center">The List is empty</div>
        } else {
            pagination = <Paginator data={data} base={`/requests/${status}`} page={page} />
            content = data.list.map(item => <RequestItem  key={item.id}
                markDuplicate={this.markDuplicate.bind(this)} 
                showDetailModal={this.showDetailModal.bind(this)}
                item={item}  
                {...this.props} 
            />);
        }
        return <div > 
            {content} 
            <div className="w3-center ">
            {pagination}
            </div>
        </div> 
    }
}

const mapStateToProps = (state) => {
    return {
        authUser:state.authUser,
        statusList:state.statusList,
        search:state.searchText 
    }
}

export default connect(mapStateToProps,{
    showMessage:showMessage
})(RequestLister); 

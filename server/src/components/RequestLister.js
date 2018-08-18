
import  React,{ Component } from 'react';   
import { FormTextField,FormTextarea,Spinner,Paginator ,SelectField,Reveal} from './Helper.js';  
import axios from 'axios';
import moment from 'moment';
import {NavLink,withRouter,Switch,Route} from 'react-router-dom';

export default class RequestLister extends Component {
    constructor(arg){
        super(arg);
        this.state = {
            data:null
        }
    }
    fetchData(props){
        let {page=1,status ='new',search=''} = props;
        this.setState({data:null});
        if (status == 'search'){ 
            search = page;
            page = 1;
        }
        axios.get(`/api/v1/rescue-list?status=${status}&page=${page}&q=${search}`).then(resp=>{
            this.setState({
                data:resp.data.data
            });
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
    render(){
        const {data} = this.state;
        const {page=1 ,status='new'} = this.props;

        let pagination = null;
        let content = null;
        if (!data){
            content = <Spinner />
        } else if (data.list.length == 0){
             content = <div className="w3-padding-64 w3-large w3-center">The List is empty</div>
        } else {
            pagination = <Paginator data={data} status={status} page={page} />
            content = data.list.map(item => { 
                return (<div key={`item_${item.id}`} className="w3-display-container w3-white w3-margin w3-padding">
                        CaseID:{`${item.id}-${item.remoteId}`}<br/><br/>
                        Name:{item.personName}<br/>
                        Phone: {item.phoneNumber}<br/>
                        Source:<a href={`https://www.keralarescue.in/request_details/${item.remoteId}/`}  target="_blank">{item.source}</a><br/>
                        District:{item.district}<br/>
                        Details:{item.information}<br/>
                        Created:{moment(item.createdAt).fromNow()}<br/>
                        {(status == 'duplicate' || status == 'search') ?
                            [`Operator Status:${item.operatorStatus}`,<br/>, `Status : ${item.status}`]
                         :null}
                        <div>
                        {item.json && item.json.tags.map(name => <div key={name} className="w3-small w3-round w3-margin-right w3-tag w3-purple">{name}</div>)}
                        </div>
                        <button className="w3-display-bottomright  w3-small w3-button w3-green" 
                            onClick={this.props.showDetailModal.bind(this,item)}>Help</button>
                    </div>);
            });
        }
            return <div>
                <div style={{minHeight:"100vh"}} >
                    {content}
                    <div className="w3-center ">
                    {pagination}
                    </div>
                </div>
            </div>
    }
}
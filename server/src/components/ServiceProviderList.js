import  React,{ Component } from 'react';
import { connect } from 'react-redux';
import { FormTextField,FormTextarea,Spinner,SelectField,Reveal, HeaderSection} from './Helper.js';  
import axios from 'axios';
import moment from 'moment';
import {NavLink,Link,withRouter,Switch,Route} from 'react-router-dom';
import qs from 'query-string';

class ServiceProvider extends Component {

    render() {
        const {item} = this.props;
        console.log(item);

        return (
            <div key={`item_${item.id}`} className="w3-col l4 m6 w3-medium" style={{height: '100%'}}>
                <div className="w3-margin w3-white w3-padding">
                    <strong className="w3-text-gray">Contact Name:</strong> {item.contactName}<br/>
                    <strong className="w3-text-gray">Phone:</strong> {item.phoneNumber}<br/>
                    <strong className="w3-text-gray">Type:</strong> {item.type.toUpperCase()}<br/>
                    <strong className="w3-text-gray">Number of People:</strong> {item.peopleCount}<br/>
                    <strong className="w3-text-gray">Number of Kids:</strong> {item.kidsCount}<br/>
                    <strong className="w3-text-gray">Created:</strong> {moment(item.createdAt).fromNow()}<br/>
                </div>
            </div>
        );
    }
}

export const Paginator = ({page,status,data}) => {
    page = page - 10;
    const pages = [];
    if(page < 1){
        page = 1;
    }
    const lastPage = data.page_max;
    for(var idx = page;idx < page + 18 && idx < lastPage;idx++){
        pages.push(idx);
    }

    if (data.total < data.per_page){
        return <div></div>
    }

    return <div className="w3-bar">
        <NavLink to={`/service-providers/1`} className="w3-button">&laquo;</NavLink> 
        {
            pages.map( page=> <NavLink key={`page_${page}`} to={`/service-providers/${page}`} 
                className="w3-button">{page}</NavLink> )
        }
        <NavLink to={`/service-providers/${lastPage}`} className="w3-button">&raquo;</NavLink>
    </div>
}

class ServiceProviderList extends Component {
    constructor(arg){
        super(arg);
        this.state = {
            data:null,
        }
        this.filter = {}
    }

    fetchData(props){
        let {page=1, search=''} = this.props.match.params;
        this.setState({data:null});

        const obj = {
            page: page,
            q: search,
        }
        const str = qs.stringify(obj); 
        axios.get(`/api/v1/service-provider-list?${str}`).then(resp=>{
            this.setState({
                data:resp.data.data
            });
        });
    }

    componentDidMount() {
        this.fetchData(this.props);
    }

    searchRequests(e){
        this.props.history.replace('/service-providers/search/'+e.target.value)
    }

    componentWillReceiveProps(nextProps){
        if (nextProps.match.params  != this.props.match.params){ 
            this.fetchData(nextProps);
        }
    }

    handleFilterData(filterData) {
        this.filter = filterData;
        this.fetchData(this.props);
    }

    render() {
        const {data} = this.state;
        const {page=1} = this.props;

        let pagination = null;
        let content = null;
        let totalCount = '';
        if (!data){
            content = <Spinner />
        } else if (data.list.length == 0){
             content = <div className="w3-padding-64 w3-large w3-center">The List is empty</div>
        } else {
            pagination = <Paginator data={data} page={page} />
            totalCount = `Total: ${data.total}`;
            content = data.list.map(item => 
                <ServiceProvider item={item}  
                    {...this.props} />
            );
        }

        return (
            <div style={{minHeight: "100vh", paddingTop: "64px"}}>
                <HeaderSection authUser={this.props.authUser} />
                <div className="w3-padding">
                    <div className="w3-padding">
                        <input className="w3-input w3-small w3-bar-item" onChange={this.searchRequests.bind(this)} placeholder="Name / Phone number" /> 
                        <div className="w3-bar-item w3-right-align">{totalCount}</div>
                    </div>
                    <div className="w3-row" style={{display: 'flex', flexFlow: 'wrap'}}> 
                        {content}
                    </div>
                    <div className="w3-center ">
                        {pagination}
                    </div>
                </div>
            </div>
        ) 
    }
}

function mapStateToProps(state) {  
    return {
       authUser: state.authUser
    }
}

export default connect(mapStateToProps)(withRouter(ServiceProviderList))
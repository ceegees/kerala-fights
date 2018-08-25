import  React,{ Component } from 'react'; 
import {NavLink,withRouter} from 'react-router-dom';
import { connect } from 'react-redux'; 
import { showMessage, hideMessage,showModal } from './../redux/actions.js';   
import AppMessage from './Common/AppMessage.js'; 
import AddRequestModal from './Request/AddModal';
import Header from './Common/Header';
import RequestPanel from './Request/Panel';
import RequestLister from './Request/Lister';
import Status from './Widgets/Status.js';
import Leaderboard from './Widgets/Leaderboard.js';
import Activity from './Widgets/Activity.js'; 

export class DashboardInfo extends  Component {

    render() {
        return <div className="w3-container kf-manage-container"> 
            <div className="w3-row-padding ">
                    <div className="w3-col l7 s12">
                        <h3>What to do </h3>
                        <ul className="w3-ul">
                            <li><h4>The Workflow</h4>
                                <ul className="w3-ul">
                                    <ol>1.Check - for data correctness / Duplicates</ol>
                                    <ol>2.Call and Confirm - The person might still need help, Call and Confirm the same.  </ol>
                                    <ol>3.Retry - If you are not able to reach on previous step, update status, so that you can retry</ol>
                                    <ol>4.Need Help - The Verified requests that need help which you understood after the call.</ol>
                                    <ol>5.Assinged - The items that are currently being worked on</ol>
                                    <ol>6.Resolved - Shows the resolved issues</ol>
                                </ul>
                            </li>
                            <li>There are lot duplicates, see if the requester have added duplicates. you can do this by copying the phone number and searching on the searchbox above. Look at the list of requests and see if they are same, keep the one with maximum information and mark the rest of them as duplicates, as phone number is available there.</li>
                            <li>If you see data is duplicated, mark it as duplicate and resolve the issue.</li>
                            <li>Mark the duplicates - and that way we will be able understand problem in hand.</li>
                            <li>In the search box help you search with / Name / Phone Number / District - First Letter Caps/ </li>
                            <li><b>If you are facing any issue while operating - 
                            reload the page</b> </li>
                            <li><a target="_blank" href="https://docs.google.com/document/d/1jM_hdHgP-kxkzOtxl0n8mUGY4EzP6di2NyHIEvFp8YI/edit" >How To Use</a> , <a target="_blank"  href="https://docs.google.com/document/d/1oMs4JwHMDS9agR3voVpeGL0SMhfE35fETYNbD5rZLN8/edit">ഉപയോഗക്രമം </a></li>
                        </ul>
                        <NavLink  to="/request/duplicates" 
                            className="w3-button  w3-block w3-blue w3-margin-bottom">
                            Check If duplicates are Marked correctly
                        </NavLink>  
                        <NavLink  to="/request/one_item/new" 
                            className="w3-button w3-hide  w3-block w3-green w3-margin-bottom">
                            Start working on a Help request 
                        </NavLink>   
                        <Status/>
                    </div>
                    <div className="w3-col l5 s12 ">
                        <Activity/>
                        <Leaderboard /> 
                    </div>
                </div> 
        </div>
    }
}
 

class Dashboard extends Component{
    constructor(arg) {
        super(arg);
        this.state =   {
            data:null,
            search:'',
            mobileMenu:'w3-hide', 
            form: {},
            errors: {}, 
            successMessage: ''
        } 
    } 
    componentDidMount(){
        const {requestId} = this.props.match.params;
        console.log('there we go',requestId);
        if (requestId){
            console.log('opening modal');
            this.props.showModal('update_request',{
                id:requestId
            });
            this.props.history.replace('/dashboard');
        }
    }
    componentWillReceiveProps(nextProps){ 
        if (this.props.match.params.requestId == nextProps.match.params.requestId){
            return;
        }
        const {requestId} = nextProps.match.params;
        if (requestId){
            this.props.showModal('update_request',{
                id:requestId
            });
            this.props.history.replace('/dashboard');
        }
    }

    togggleMobile(){
        this.setState({mobileMenu:(this.state.mobileMenu == 'w3-hide')? 'w3-show' : 'w3-hide'})
    }
    render () {
        let { page=1, status='all',requestId } = this.props.match.params; 
        let content = null, subHeader= null;  
        if (this.props.match.url.indexOf('dashboard') >= 0  ){
            content = <DashboardInfo />
            if(this.props.searchText != ""){
                content = <div className="w3-panel"> <RequestLister /></div>
            }  
        } else if (status == 'one_item'){
            content = <OneAtATime status={page} authUser={this.props.authUser}/> 
        } else {
            subHeader = 'requests' 
            content = <RequestPanel page={page}  status={status}  /> 
        }
        return (
            <div >
                <AppMessage />
                <Header subHeader={subHeader} />
                {this.state.modal}
                {content}
            </div>
        )
    }
} 
function mapStateToProps(state) {
    return {
        authUser: state.authUser,
        lastUpdateTime:state.lastUpdateTime,
        statusList:state.statusList,
        districtMap:state.districtMap,
        searchText:state.searchText
    }
}
export default withRouter(connect(mapStateToProps, { 
    showMessage,
    hideMessage,
    showModal
})(Dashboard));

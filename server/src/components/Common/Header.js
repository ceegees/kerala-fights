import React,{Component} from 'react';
import { connect } from 'react-redux'; 
import { NavLink , withRouter} from 'react-router-dom';   
import {setSearch} from '../../redux/actions';
import AddRequestModal from './../Request/AddModal';
import MarkSafe from './../Modals/MarkSafe'; 
import RequestDetailModal from './../Request/Details';

import Reveal from './../Common/Reveal';
import ProviderAddModal from './../Provider/AddModal'; 
import { showModal } from './../../redux/actions.js';   


class Header extends Component {
    constructor(arg) {
        super(arg);
        this.state = {
            mobileMenu: 'w3-hide',
            modalContent:null
        }
    }

    togggleMobile() {
        this.setState({mobileMenu:(this.state.mobileMenu == 'w3-hide')? 'w3-show' : 'w3-hide'})
    }
    componentDidMount(){
        this.props.setSearch('');
    } 

    hideModal() {
        this.props.showModal('empty');
    }

    showModal(name,data){
        let content = null; 
        if (name == 'help_center') {
            content = <ProviderAddModal hideModal={this.hideModal.bind(this)} />
        } else if (name == 'mark_safe') {
            content = <MarkSafe type="SELF" hideModal={this.hideModal.bind(this)} />
        } else if (name == 'mark_other_safe'){
            content = <MarkSafe type="BEHALF" hideModal={this.hideModal.bind(this)}/>
        } else if (name == 'willing_to_help'){
            content = <MarkWillingToHelp  hideModal={this.hideModal.bind(this)}/>
        } else if (name == 'add_request' || name =='request' ){
            content = <AddRequestModal hideModal={this.hideModal.bind(this)}/>;
        }  else if (name == 'update_request') {
            content = <Reveal  onClose={this.hideModal.bind(this)} >
                <RequestDetailModal  hideModal={this.hideModal.bind(this)} 
                  id={data.id} />
            </Reveal>
        }
        this.setState({modalContent:content})
    }
    componentWillReceiveProps(nextProps){ 
        if (nextProps.modalInfo != this.props.modalInfo){
            this.showModal(nextProps.modalInfo.name,
                nextProps.modalInfo.data);
        }
    }
 
    changeSearch(e){  
        this.props.setSearch(e.target.value);
    }
    render(){
        return (
            <section className="top_section w3-small"> 
                <nav className="w3-bar w3-blue header-top-bar">
                    <div className="w3-left">
                        <a className="w3-bar-item w3-button" href="/">Kerala Flood Relief - കേരളം പൊരുതുന്നു , ഒരുമിച്ച് </a>
                        <input style={{width:"380px"}} onChange={this.changeSearch.bind(this)} className="w3-input w3-bar-item w3-small w3-rest"  placeholder="Search by Name / Phone number /Case Id / KeralaRescueId" /> 
                    </div>
                    <button className="w3-bar-item w3-small w3-sand  w3-button  w3-hide-large w3-hide-medium w3-display-topright" onClick={this.togggleMobile.bind(this)}>&#9776;</button>
                    <div className="w3-right w3-hide-small">  
                        <button className="w3-bar-item w3-button w3-green" onClick={e => this.showModal('add_request')}>New Request</button>
                        {this.props.authUser ? <NavLink className="w3-bar-item   w3-button " to="/dashboard">Dasboard</NavLink> :  <a className="w3-bar-item  w3-deep-purple w3-button " href="/dashboard">Volunteer Login</a> } 
                        <NavLink className="w3-bar-item   w3-button "  to="/requests/">Requests</NavLink>  
                        <NavLink className="w3-bar-item w3-button " to="/heatmap/">HeatMap</NavLink>
                       
                        <NavLink className="w3-bar-item w3-button" to="/service-providers/list/">Service Providers</NavLink>
                    </div>
                </nav> 
                <div className={`w3-bar-block w3-border-top w3-hide-large w3-hide-medium ${this.state.mobileMenu}`}>
                    {this.props.authUser ? <a className="w3-bar-item   w3-button " href="/dashboard">Dashboard</a> : <a className="w3-bar-item  w3-yellow w3-button " href="/dashboard">Volunteer Login</a>}  
                    <NavLink className="w3-bar-item w3-button w3-blue" to="/requests/">Requests</NavLink>
                    <NavLink className="w3-bar-item w3-button w3-blue" to="/heatmap/">HeatMap</NavLink>
                    <NavLink className="w3-bar-item w3-button" to="/service-providers/list/">Service Providers</NavLink>
                </div>
                {this.props.subHeader &&
                <div className="w3-bar w3-teal  kf-top-bar">
                    <div className="w3-right "> 
                        {this.props.statusList.map(item=>{
                                return <NavLink key={item.key}
                                activeClassName="active" 
                                className={`w3-bar-item w3-button w3-small ${item.cls}`}
                                to={`/${this.props.subHeader}/${item.key}`}>
                                    {item.title}
                            </NavLink>
                        })} 
                    </div>
                </div>
                }
                {this.props.children}
                {this.state.modalContent}
            </section> 
        )
    }
}
const mapStateToProps = (state) => {
    return {
        authUser: state.authUser, 
        statusList:state.statusList,
        modalInfo:state.modalInfo
    }
}

export default withRouter(connect(mapStateToProps,{
    setSearch,
    showModal
})(Header));
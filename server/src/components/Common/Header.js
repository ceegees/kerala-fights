import React,{Component} from 'react';
import { connect } from 'react-redux'; 
import { NavLink , withRouter} from 'react-router-dom';   
import {setSearch} from '../../redux/actions';

class Header extends Component {
    constructor(arg) {
        super(arg);
        this.state = {
            mobileMenu: 'w3-hide'
        }
    }

    togggleMobile() {
        this.setState({mobileMenu:(this.state.mobileMenu == 'w3-hide')? 'w3-show' : 'w3-hide'})
    }
    componentDidMount(){
        this.props.setSearch('');
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
                        <input style={{width:"400px"}} onChange={this.changeSearch.bind(this)} className="w3-input w3-bar-item w3-small w3-rest"  placeholder="Search by Name / Phone number /Case Id / KeralaRescueId" /> 
                    </div>
                    <button className="w3-bar-item w3-small w3-sand  w3-button  w3-hide-large w3-hide-medium w3-display-topright" onClick={this.togggleMobile.bind(this)}>&#9776;</button>
                    <div className="w3-right w3-hide-small">  
                        {this.props.authUser ? <NavLink className="w3-bar-item   w3-button " to="/dashboard">Dasboard</NavLink> :  <a className="w3-bar-item  w3-yellow w3-button " href="/dashobard">Volunteer Login</a> } 
                        <NavLink className="w3-bar-item   w3-button "  to="/requests/">Requests</NavLink>  
                        <NavLink className="w3-bar-item w3-button " to="/heatmap/">HeatMap</NavLink>
                        <a target="_blank" href="https://www.keralarescue.in/relief_camps/" className="w3-bar-item w3-button w3-hide ">Rescue Centers</a>  
                    </div>
                </nav> 
                <div className={`w3-bar-block w3-border-top w3-hide-large w3-hide-medium ${this.state.mobileMenu}`}>
                    {this.props.authUser ? <a className="w3-bar-item   w3-button " href="/dashboard">Dashboard</a> : <a className="w3-bar-item  w3-yellow w3-button " href="/dashboard">Volunteer Login</a>}  
                    <NavLink className="w3-bar-item w3-button w3-blue" to="/requests/">Requests</NavLink>
                    <NavLink className="w3-bar-item w3-button w3-blue" to="/heatmap/">HeatMap</NavLink>
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
            </section> 
        )
    }
}
const mapStateToProps = (state) => {
    return {
        authUser: state.authUser, 
        statusList:state.statusList
    }
}

export default withRouter(connect(mapStateToProps,{
    setSearch:setSearch
})(Header));
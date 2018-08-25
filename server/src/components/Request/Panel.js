
import  React,{ Component } from 'react';   
import {DemandSupplyTab,Spinner,Paginator ,SelectField,Reveal} from './../Common/Helper.js'; 
import RequestFilter from './Filter';
import {NavLink,Link,withRouter} from 'react-router-dom'; 
import Lister from './Lister';

class RequestPanel extends Component {

    constructor(arg){
        super(arg); 
        this.state = {
            filter:{}
        } 
    }
   
    handleFilterData(filterData) {
        this.setState({filter:filterData});
    }
    render(){
        const {data} = this.state;
        const {page=1 ,status='all'} = this.props;

        let pagination = null;
        let content = null; 
        return <div  style={{minHeight:"100vh"}} > 
            {this.state.modal}
            <div className="w3-row-padding">
                <div className="w3-col l3">
                    <RequestFilter data={data}  
                    handleFilterData={this.handleFilterData.bind(this)} />
                </div>
                <div className="w3-col l9">
                    <DemandSupplyTab>
                        <Lister fitler={this.state.filter} />
                    </DemandSupplyTab>
                </div>
            </div> 
        </div> 
    }
}
export default withRouter(RequestPanel)
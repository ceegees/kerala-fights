
import  React,{ Component } from 'react';   
import {Spinner} from '../Common/Helper';
import axios from 'axios';
import moment from 'moment'

export default class Activity extends Component {
    constructor(arg){
        super(arg);
        this.state = {
            data:null
        };
    }
    componentDidMount(){
        axios.get('/api/v1/my-activity').then(resp => { 
            this.setState({data:resp.data.data});
        })
    }
    render(){

        let content = null;
        if (this.state.data == null) {
            content = <Spinner />;
        }else if (this.state.data.length == 0){
            content = <div>
                <h4 className="w3-center w3-color-grey" >You havent made any contributions</h4>
                </div>
        }else {
            content = this.state.data.map(item => {
                const message = item.statusIn == item.statusOut ? 'Information Edited': 
                `${item.statusIn} to ${item.statusOut}`;
                return <div key={`key_${item.id}`} className="w3-padding" style={{borderBottom:"solid 1px #EEE"}}>
                        <a className="w3-small" href={`/manage/search/id:${item.requestId}`}> 
                        Request Id:{item.requestId} - {message}</a>
                        <div className="w3-small w3-color-grey w3-right-align">
                            {moment(item.createdAt).fromNow()}
                        </div>
                    </div>
            })
        }
        return <div className="w3-white">
            <h4 className="w3-blue-grey w3-center w3-padding">Your Activity</h4>
            <div style={{maxHeight:"500px",overflowX:'auto'}}>
                {content}
            </div>
        </div>
    }
}
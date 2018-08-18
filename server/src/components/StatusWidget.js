
import  React,{ Component } from 'react';    
import axios from 'axios';

export default class StatusWidget extends Component {

    constructor(arg){
        super(arg);
        this.state = { 
            status:[]
        }
        this.timer = null;     
    }
    updateStats(){
        axios.get('/api/v1/rescue-status').then(resp=>{
            this.setState({
                status:resp.data.data
            });
        });
    }
    componentDidMount(){
        this.updateStats();
        this.timer = setInterval(()=>{
            this.updateStats();
        },60*1000);
    }
    componentWillUnmount(){
        clearInterval(this.timer);
    }
    render(){
        return <table className="w3-table w3-table-all">
                <thead>
                    <tr>
                        <th>Status</th>
                        <th>Count</th>
                    </tr>
                </thead>
                <tbody>
            {this.state.status.map(item =>{ 
                return <tr key={item.status}><td>{item.status}</td>
                <td>{item.total}</td>
                </tr>
            })}
            </tbody>
        </table>
    }
}

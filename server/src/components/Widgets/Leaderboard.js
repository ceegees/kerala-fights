
import  React,{ Component } from 'react';   
import {Spinner} from '../Common/Helper';
import axios from 'axios'; 

export default class Leaderboard extends Component {

    constructor(arg){
        super(arg);
        this.state = {
            data:null
        }
    }

    componentDidMount(){
        axios.get('/api/v1/angels').then(resp=>{ 
            this.setState({
                data:resp.data
            })
        });

    }

    render(){
        let content = <Spinner />
        
        if (this.state.data) {
            content = 
            <table className="w3-table ">   
                <tbody className="w3-right-align">
                {
                    this.state.data.map((item, idx) => {
                    return <tr key={`pos_${idx}`} style={{borderBottom:"solid 1px #ccc"}}>
                        <td style={{width:"40px",lineHeight:'32px'}}> {idx + 1} </td>
                        <td style={{width:"40px",lineHeight:'32px'}}>
                        <img src={item.picture} style={{width:"32px",height:"32px"}} />
                        </td>
                        <td style={{lineHeight:'32px'}}>  {item.name}</td>
                        <td  style={{lineHeight:'32px'}}>   {item.total} help requests updated </td>
                    </tr>
                })}
                </tbody>
            </table>
        }
        
        return <div className=" w3-white w3-small">  
            <h4 className="w3-center w3-padding w3-blue-grey">The Fighters</h4> 
            {content}
        </div>
    }
}
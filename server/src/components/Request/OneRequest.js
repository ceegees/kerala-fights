
import  React,{ Component } from 'react'; 
import  axios from 'axios';

export class OneAtATime extends Component {
    constructor(arg){
        super(arg);
        this.state = {
            data:null
        }
    }
    fetchData(){
        this.setState({data:null});
        const {status='new'} = this.props;
        axios.get(`/api/v1/rescue-list?status=${status}&per_page=1`).then(resp=>{
            this.setState({
                data:resp.data.data
            });
        });
    }
    
    componentDidMount(){
        this.fetchData(this.props);
    }
    
    render(){
        return <div >
            {this.state.data ? this.state.data.list.map(item => 
                <DetailsModal  
                authUser={this.props.authUser}
                hideModal={this.fetchData.bind(this)} item={item} />) : null }
        </div>
    }
}
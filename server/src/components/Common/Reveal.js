import  React,{ Component } from 'react'; 
export default class Reveal extends Component {

    static get defaultProps() {
        return {
            openCls: '',
            modalClass:''
        }
    }
    
    render() {
        let cls ='';
 
        return (
            <div className={ this.props.modalClass+" w3-modal w3-show "  } >     
                <div className={"w3-modal-content  "}  >
                    { this.props.onClose ?
                        <button className="w3-button w3-right w3-large close-button" 
                            onClick={this.props.onClose}  type="button">
                            <span aria-hidden="true">&times;</span>
                        </button> : null
                    }
                    {this.props.children}
                </div>  
            </div>
        )
    }
}

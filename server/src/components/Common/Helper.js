import React, {Component} from 'react'; 
import {Link,NavLink} from 'react-router-dom';
import axios from 'axios'; 
    
export class ErrorHelperText extends Component {
    static get defaultProps() {
        return {
            errors: null
        };
    }
    render() {
        let errorContent = null;
        if (!this.props.errors) {
            return <span />;
        }
        if (typeof (this.props.errors) === 'string') {
            errorContent = (<div className="w3-text-red">* {this.props.errors}</div>);
        } else {
            errorContent = (<div className="w3-text-red">* {this.props.errors.join(',')}</div>);
        }
        return errorContent;
    }
}

export const Spinner = (props = {message:'Loading Data', mode:'big' }) => { 
    let  paddingCls = 'w3-padding-64';
    if (props.mode == 'small'){
        paddingCls='w3-padding-small cgs-loader-small';
    }
    return <div className={`w3-center ${paddingCls} w3-block`} > 
        <div className="w3-center w3-padding">
        <div className="cgs-loader"></div>
        </div>
       {props.message}
    </div>
}


export class FormTextField extends Component {
    static get defaultProps() {
        return {
            type: "text",
            valueChange: null,
            inputClass: '',
            textClass: '',
            onBlur: function () {}
        };
    }

    constructor(args) {
        super(args);
        this.state = {
            value: null
        };
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            value: newProps.value
        });
    }

    onChange(evt) {
        var val = evt.target.value;
        this.setState({value: val});
        if (this.props.valueChange) {
            this.props.valueChange(this.props.name, val);
        }
    }

    render() { 
        let {inputClass}   = this.state;
        if (this.state.value === null || this.state.value === undefined) {
            this.state.value = this.props.value;
        }
        var errorClass = '';
        if (this.props.errors != undefined) {
            errorClass = 'is-invalid-input';
        }
        if (this.props.inputClass != undefined) {
            inputClass = this.props.inputClass;
        }
        let mandatoryField = '';
        if (this.props.isMandatory) {
            mandatoryField = (<span className="w3-text-red">*</span>);
        }
        return (
            <div className={"f10t-input-padding"}>
                <label className="w3-text-black">{this.props.label} {mandatoryField} </label>
                <input
                    className={this.props.textClass}
                    type={this.props.type}
                    id={this.props.id}
                    autoComplete={this.props.name}
                    name={this.props.name}
                    defaultValue={this.props.defaultVal}
                    onBlur={this.props.onBlur}
                    value={this.state.value ? this.state.value : ""}
                    onChange = {this.onChange.bind(this)}
                    placeholder={this.props.placeholder || this.props.label}
                    className={`${this.props.inputClass} ${errorClass}`}
                />
                <ErrorHelperText errors={this.props.errors} />
            </div>
        );
    }
}

export class FormTextarea extends Component {
    static get defaultProps() {
        return {
            valueChange: null
        };
    }

    constructor(args) {
        super(args);
        this.state = {
            value:null
        }
    }
  

    componentWillReceiveProps(newProps) {
        this.setState({
            value: newProps.value
        });
    }

    onChange(evt) {
        var val = evt.target.value;
        this.setState({value: val});
        if (this.props.valueChange) {
            this.props.valueChange(this.props.name, val);
        }
    }

    render() {
        if (this.state.value == null) {
            this.state.value = this.props.value;
        }
        var errorClass = '';
        if (this.props.errors != undefined) {
            errorClass = 'is-invalid-input';
        }

        let mandatoryField = '';
        if (this.props.isMandatory) {
            mandatoryField = (<span className="w3-text-red">*</span>);
        }

        return (
            <div className = "f10t-input-padding">
                <label>{this.props.label} {mandatoryField}</label>
                <textarea className="fm-text-input" id={this.props.id}
                    name={this.props.name}
                    onChange = {this.onChange.bind(this)}
                    placeholder={this.props.placeholder ? this.props.placeholder: this.props.label}
                    value={this.state.value  ? this.state.value :''}
                    className={`${this.props.inputClass} ${errorClass}`}/>
                <ErrorHelperText errors={this.props.errors} />
            </div>
        );
    }
}

export class SelectField extends Component {


    constructor(args) {
        super(args);
        this.state = {
            value: null,
        }
    }

    static get defaultProps() {
        return {
            valueChange: null, 
            options: [],  
        };
    }
    
    componentDidMount() {
        this.setState({
            value: this.props.value
        });
    }

    onChange(evt) {
        var val = evt.target.value;
        this.setState({value: val});
        if (this.props.valueChange) {
            this.props.valueChange(this.props.name, val);
        }
    }

    componentWillReceiveProps(nextProps) {
        // if (nextProps.valueChange) {
        //     nextProps.valueChange(nextProps.name, nextProps.defaultValue);
        // }
    }

    componentDidMount() {
        if (this.props.defaultValue) {
            this.props.valueChange(this.props.name, this.props.defaultValue);
        }
    }

    render() {
        if (this.state.value == null) {
            this.state.value = this.props.value;
        }
        let mandatoryField = '';
        if (this.props.isMandatory) {
            mandatoryField = (<span className="w3-text-red">*</span>);
        }
        var errorClass = '';
        if (this.props.errors != undefined) {
            errorClass = 'is-invalid-input';
        } 

        return (
            <div className="" >
                <label>{this.props.label} {mandatoryField}</label>
                <select id={this.props.id}
                    name={this.props.name}
                    defaultValue={this.props.defaultValue}
                    value={this.state.value ? this.state.value : ''}
                    className={this.props.selectClass + " " + errorClass}
                    placeholder={this.props.label} 
                    onChange = {this.onChange.bind(this)}> 
                    {this.props.children}
                </select>
                <ErrorHelperText errors={this.props.errors} />
            </div>
        );
    }
}

export class GooglePlacesAutoComplete extends Component {
    constructor(args){
        super(args);
        this.locationInput = React.createRef();
    }

    componentDidMount(){
        var input = document.getElementById('map_location');
        var autocomplete = new google.maps.places.Autocomplete(input);  
        autocomplete.addListener('place_changed', () => {
            var place = autocomplete.getPlace();
            if (this.props.onPlaceChange) {
                this.props.onPlaceChange(place)
            }
        });
    }
 
    render() {
        return (
            <div id="autocomplete-container">
                <input id="map_location" type="text"
                    label="Album/Event Location"
                    className = "w3-input w3-border"
                    placeholder= {this.props.placeholder} 
                    autoComplete="on"
                    ref={this.locationInput}
                />
            </div>
        )
    }
}

export class DemandSupplyTab extends Component {
    constructor(arg){
        super(arg);
        this.state = {
            tabName : 'demand',
            demandTab:'w3-show',
            supplyTag:'w3-show'
        }
    }
    tabChange(name){
        this.setState({
            tabName:name,
            demandTab: name == 'demand' ? 'w3-show':'w3-hide',
            supplyTab :  name != 'demand' ? 'w3-show':'w3-hide'
        });
    } 
    hideAfterLoad(){
        this.tabChange('demand');
    }
    render(){
        const {tabName} = this.state;
        const demandBtnCls = tabName == 'demand' ? 'w3-white':'w3-light-grey';
        const supplyBtnCls = tabName != 'demand' ? 'w3-white':'w3-light-grey';

        let message = '';
        if (this.state.tabName != 'demand') {
            message = 'Drag and Zoom the map to Kerala / മാപ്പ് കേരളത്തിലേക്ക് സൂം (Zoom ) ചെയ്യുക'
        }
        
        return <div>
            <div className="w3-bar">
                <button className={"w3-button w3-bar-item w3-orange "+demandBtnCls}  
                    onClick={this.tabChange.bind(this,'demand')}> Demand / ആവശ്യക്കാർ </button>
                <button className={"w3-button w3-bar-item w3-green "+supplyBtnCls} 
                    onClick={this.tabChange.bind(this,'supply')}>Supply / സഹായം കൊടുക്കുന്നവർ </button>
                <div className="w3-bar-item" >
                    <span className="w3-small w3-text-red">{message}</span></div>
            </div>
            <div className={this.state.demandTab} style={{minHeight:"100wh"}}>
                {this.props.children[0]}
            </div>
            <div className={`${this.state.supplyTab} google-maps-supply`}   >
                <iframe  src="https://www.google.com/maps/d/embed?mid=19pdXYBAk8RyaMjazX7mjJIJ9EqAyoRs5"  style={{  
                                border:"0"
                            }} onLoad={this.hideAfterLoad.bind(this)}/>
            </div>
        </div> 
    }
}

/*
  
*/
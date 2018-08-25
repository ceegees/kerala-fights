import React from 'react';
export default class FilterSelect extends React.Component {

    render() {
        const optionList = [];
        if (this.props.name != 'Sort On'){
            optionList.push(<option value="" key="nothin">All</option>);
        }
        const { filterOptions } = this.props; 
        if (Array.isArray(filterOptions)) {
            filterOptions.map((item, key) => { 
                optionList.push(
                    <option key={item.value} value={item.value}>{item.name}</option> 
                );
            });
        } else if (!Array.isArray(filterOptions) && typeof(filterOptions) === "object") {
            Object.keys(filterOptions).forEach((key) => {
                optionList.push(
                    <option key={key} > {filterOptions[key]}</option>
                );
            });
        }
        if (this.props.name == 'Request Types'){
            optionList.push(
                <option key="rescue_request"  value="rescue_request">Un Categorized from Kerala rescue</option>);
        }

        return  <div style={{marginBottom:"6px"}}>
            <label>{this.props.name}</label>
        <select onChange={this.props.handleFilterData} className="w3-large" className="w3-select kf-form-input-select" > 
            {optionList}
        </select>
        </div>
    }
}
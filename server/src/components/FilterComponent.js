import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'; 
import moment from 'moment';

class FilterListContent extends React.Component {

    render() {
        const filterLists = [<option value="" key="nothin">All</option>];
        const { filterOptions } = this.props; 
        if (Array.isArray(filterOptions)) {
            filterOptions.map((item, key) => { 
                filterLists.push(
                    <option key={item.value} value={item.value}>{item.name}</option> 
                );
            });
        } else if (!Array.isArray(filterOptions) && typeof(filterOptions) === "object") {
            Object.keys(filterOptions).forEach((key) => {
                filterLists.push(
                    <option key={key} > {filterOptions[key]}</option>
                );
            });
        }
        if (this.props.name == 'Request Types'){
            filterLists.push(
                <option key="rescue_request"  value="rescue_request">Un Categorized from Kerala rescue</option>);
        }

        return  <div style={{marginBottom:"6px"}}>
            <label>{this.props.name}</label>
        <select onChange={this.props.handleFilterData} className="w3-large" className="w3-input w3-select" style={{height:"32px"}}> 
            {filterLists}
        </select>
        </div>
    }
}

class FilterComponent extends React.Component {
    constructor (args) {
        super(args);
        
        let end = moment().endOf('day').add(1,'minute'); 
        let tm = new Date();
        const timeList = [];
        let endStr = 'Now';
        let endRange = moment();
        for(var idx = 0;idx < 12;idx++){
            end = end.subtract(6,"Hours");
            if (end < tm) {
                timeList.push({ 
                    name:end.format('Do hh a')+" - " + endStr, 
                    value: `${endRange.valueOf()}-${end.valueOf()}`
                });
                endRange = end.clone();
                endStr = endRange.format('Do hh a');
            } 
        }

        timeList.push({
            name:'older', 
            value: `${moment().subtract(30,'days').valueOf()}-${end.valueOf()}`
        });
 
        this.state = {
            
            filterLabels: {
                sort: 'Sort',
                time: 'Time',
                severity: 'Severity All',
                district: 'District All',
                type:'Request Type'
            }, 
            filterData: {}, 
            sortConfig: [
                {
                    type: 'sort',
                    value: 'DESC',
                    name: 'Newest First',
                },
                {
                    type: 'sort',
                    value: 'ASC',
                    name: 'Oldest First',
                }
            ],
            timeConfig:timeList,
        }
        
    }

    handleFilterData(type,e) {
    
        const { handleFilterData } = this.props;
        let { filterData } = this.state;
        filterData[type] = e.target.value;
         
        if (handleFilterData) {
            handleFilterData(filterData);
        }
    }

    handleTimeRange(name,e) { 
        const { handleFilterData } = this.props;

        let { filterData } = this.state;
        const combined = e.target.value; 
        const parts = combined.split('-');

        filterData.startAt = parts[0];
        filterData.endAt = parts[1];
        if (handleFilterData) {
            handleFilterData(filterData);
        }
    }

    render() {
        const { districtMap,data } = this.props;
        const { sortConfig, timeConfig } = this.state;
        const {requestTypeList,severityList} = this.props; 
        return (
            <div className=""> 
            {data && <div className="w3-center w3-padding w3-blue w3-margin-bottom">
                <h4 >Total Requests  {data.total}</h4>
            </div>}
              {data && <div className="w3-center w3-padding w3-orange">
              <h4 >Total Demand {data.demand}</h4>
          </div>}
                <FilterListContent
                    name="Request Types" 
                    filterOptions={requestTypeList}
                    handleFilterData={this.handleFilterData.bind(this,'requestType')} 
                /> 
                {/* <FilterListContent
                    name="Status"
                    filterOptions={districtMap}
                    handleFilterData={this.handleFilterData}
                />   */}

                <FilterListContent
                    name="Districts"
                    filterOptions={districtMap}
                    handleFilterData={this.handleFilterData.bind(this,'district')}
                />  
                <FilterListContent
                    name="Time Range"
                    filterOptions={timeConfig}
                    handleFilterData={this.handleTimeRange.bind(this,'time')}
                />  

                <FilterListContent
                    name="Severity"
                    filterOptions={severityList}
                    handleFilterData={this.handleFilterData.bind(this,'severity')}
                /> 

                {/* <FilterListContent
                    name="Sort option"
                    filterOptions={sortConfig}
                    handleFilterData={this.handleFilterData}
                /> */}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        districtMap: state.districtMap,
        statusList: state.statusList,
        severityList:state.severityList,
        requestTypeList:state.requestTypeList
    }
}

export default withRouter(connect(mapStateToProps, {

})(FilterComponent));
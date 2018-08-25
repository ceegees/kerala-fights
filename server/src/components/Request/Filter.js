import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'; 
import moment from 'moment';
import FilterSelect from '../Common/FilterSelect';

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
        const {requestTypeList,severityList,searchText} = this.props; 
        return (
            <div className=""> 
                <div className="w3-aligh-left w3-padding w3-blue w3-margin-bottom">
                    <h4 >Total Requests {data &&  data.total} </h4>
                </div>
                  <div className="w3-align-left w3-padding w3-orange">
                    <h4 >Total Demand {data && data.demand}</h4>
                </div>
                <div className="w3-small w3-margin-top">
                {searchText && `Searching " ${searchText}"`}
                </div>
                <div className="w3-margin-top">
                    <FilterSelect
                        name="Request Types" 
                        filterOptions={requestTypeList}
                        handleFilterData={this.handleFilterData.bind(this,'requestType')} 
                    /> 
                  
                    <FilterSelect
                        name="Districts"
                        filterOptions={districtMap}
                        handleFilterData={this.handleFilterData.bind(this,'district')}
                    />  
                    <FilterSelect
                        name="Time Range"
                        filterOptions={timeConfig}
                        handleFilterData={this.handleTimeRange.bind(this,'time')}
                    />  

                    <FilterSelect
                        name="Severity"
                        filterOptions={severityList}
                        handleFilterData={this.handleFilterData.bind(this,'severity')}
                    /> 
                    
                    <FilterSelect
                        name="Sort On"
                        filterOptions={[
                            {
                                value:'recent',
                                name:'Recent First'
                            },
                            {
                                value:'oldest',
                                name:'Oldest First'
                            },
                            {
                                value:'demand',
                                name:'Demand'
                            },
                            {
                                value:'demand_desc',
                                name:'Demand Unknown First'
                            }
                        ]}
                        handleFilterData={this.handleFilterData.bind(this,'sortOn')}
                    /> 
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        districtMap: state.districtMap,
        statusList: state.statusList,
        searchText:state.searchText,
        severityList:state.severityList,
        requestTypeList:state.requestTypeList
    }
}

export default withRouter(connect(mapStateToProps, {

})(FilterComponent));
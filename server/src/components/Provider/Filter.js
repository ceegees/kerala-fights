import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'; 
import moment from 'moment';
import FilterSelect from '../Common/FilterSelect.js';

class ServiceProviderFilter extends React.Component {
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

    render() {
        const { districtMap,data ,search} = this.props;
        const { sortConfig, timeConfig } = this.state;
        const {requestTypeList,severityList} = this.props; 
        return (
            <div className=""> 
                <div className="w3-center w3-padding w3-blue w3-margin-bottom">
                    <h4 className="w3-left-align">Total Providers:{data &&  data.total} </h4>
                </div>
                <div className="w3-center w3-padding w3-green">
                    <h4 className="w3-left-align">Demand Serviceable:{data &&  data.fulfillableCount} </h4>
                </div>
                <div className="w3-small w3-margin-top">{search && `Search "${search}"`}</div>
                <div className="w3-margin-top">
                    <FilterSelect
                        name="Request Types" 
                        filterOptions={requestTypeList}
                        handleFilterData={this.handleFilterData.bind(this,'requestType')} />

                    <FilterSelect
                        name="Districts"
                        filterOptions={districtMap}
                        handleFilterData={this.handleFilterData.bind(this,'district')} />

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
                            }
                        ]}
                        handleFilterData={this.handleFilterData.bind(this,'sortOn')} />
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        districtMap: state.districtMap,
        statusList: state.statusList,
        search:state.searchText,
        severityList:state.severityList,
        requestTypeList:state.requestTypeList
    }
}

export default withRouter(connect(mapStateToProps, {

})(ServiceProviderFilter));
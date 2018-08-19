import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'; 
import moment from 'moment';

class FilterListContent extends React.Component {

    render() {
        const filterLists = [];
        const { filterOptions } = this.props;

        if (Array.isArray(filterOptions)) {
            filterOptions.map((item, key) => {
                const filterType = item.start ? 'time' : item.type;
                const filterValue = item.start ? item : item.value;
                filterLists.push(
                    <a
                        key={`${item.type}_${key}`}
                        onClick={() => {this.props.handleFilterData(filterType, filterValue, item.name)}}
                        className="w3-bar-item w3-button"
                    >{item.name}</a>
                );
            });
        } else if (!Array.isArray(filterOptions) && typeof(filterOptions) === "object") {
            Object.keys(filterOptions).forEach((key) => {
                filterLists.push(
                    <a  
                        key={`district_${key}`}
                        onClick={() => {this.props.handleFilterData('district', filterOptions[key], filterOptions[key])}}
                        className="w3-bar-item w3-button"
                    >
                        {filterOptions[key]}
                    </a> 
                );
            });
        }

        return (
            filterLists
        );
    }
}

class FilterComponent extends React.Component {
    constructor (props) {
        super(props);
        
        let end = moment().endOf('day').add(1,'minute'); 
        let tm = new Date();
        const timeList = [];
        let endStr = 'Now';
        let endRange = moment();
        for(var idx = 0;idx < 12;idx++){
            end = end.subtract(6,"Hours");
            if (end < tm) {
                timeList.push({
                    key:end.format('T_MMDDHHmm'),
                    name:end.format('Do hh a')+" - " + endStr,
                    start:end.valueOf(),
                    end:endRange.valueOf()
                });
                endRange = end.clone();
                endStr = endRange.format('Do hh a');
            } 
        }
        timeList.push({
            key:'older',
            name:'Older',
            start:moment().subtract(30,'days').valueOf(),
            end:end.valueOf()
        });

        console.log(timeList)
        this.state = {
            timeRange: {
                start: '',
                end: '',
            },
            filterLabels: {
                sort: 'Sort',
                time: 'Time',
                severity: 'Severity All',
                district: 'District All',
            },
            filterData: {},
            severityConfig: [
                {
                    type: 'severity',
                    value: 0,
                    name: 'Moderate',
                },
                {
                    type: 'severity',
                    value: 3,
                    name: 'Needs Help',
                },
                {
                    type: 'severity',
                    value: 4,
                    name: 'Urgent',
                },
                {
                    type: 'severity',
                    value: 6,
                    name: 'Very Urgent',
                },
                {
                    type: 'severity',
                    value: 8,
                    name: 'Life Threatening',
                }
            ],
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

        this.handleFilterData = this.handleFilterData.bind(this);
        this.handleTimeRange = this.handleTimeRange.bind(this);
    }

    handleFilterData(filterType, filterValue, filterName) {
        const { handleFilterData } = this.props;
        const { filterData, filterLabels } = this.state;
        filterData[filterType] = filterValue;
        filterLabels[filterType] = filterName;
        this.setState({
            filterData,
            filterLabels,
        })
        if (handleFilterData) {
            handleFilterData(filterData);
        }
    }

    handleTimeRange(filterType, filterValue, filterName) {
        const { handleFilterData } = this.props;
        let { filterData, timeRange, filterLabels } = this.state;
        timeRange['start'] = filterValue.start;
        timeRange['end'] = filterValue.end;
        filterData = Object.assign({}, filterData);
        filterLabels[filterType] = filterName;
        filterData.timeRange = timeRange;
        this.setState({
            filterData,
            filterLabels,
            timeRange,
        })
        if (handleFilterData) {
            handleFilterData(filterData);
        }
    }

    render() {
        const { districtMap } = this.props;
        const { sortConfig, severityConfig, filterLabels, timeConfig } = this.state;

        return (
            <div className="w3-bar  w3-blue-grey w3-top kf-top-bar-filter">
                <div className="w3-dropdown-hover w3-hide w3-indigo">
                    <button className="w3-button w3-margin-right">
                        {filterLabels['sort']} <span className="kf-carot"></span>
                    </button>
                    <div className="w3-dropdown-content w3-bar-block w3-card-4">
                        <FilterListContent
                            filterOptions={sortConfig}
                            handleFilterData={this.handleFilterData}
                        />
                    </div>
                </div>
                <div className="w3-dropdown-hover w3-hide w3-indigo">
                    <button className="w3-button w3-margin-right">
                        {filterLabels['severity']} <span className="kf-carot"></span>
                    </button>
                    <div className="w3-dropdown-content w3-bar-block w3-card-4">
                        <FilterListContent
                            filterOptions={severityConfig}
                            handleFilterData={this.handleFilterData}
                        />
                    </div>
                </div>
                <div className="w3-dropdown-hover w3-small w3-indigo">
                    <button className="w3-button w3-margin-right">
                        {filterLabels['district']} <span className="kf-carot"></span>
                    </button>
                    <div className="w3-dropdown-content w3-bar-block w3-card-4">
                        <FilterListContent
                            filterOptions={districtMap}
                            handleFilterData={this.handleFilterData}
                        />
                    </div>
                </div>
                <div className="w3-dropdown-hover w3-small
                
                 w3-indigo">
                    <button className="w3-button w3-margin-right">
                        {filterLabels['time']} <span className="kf-carot"></span>
                    </button>
                    <div className="w3-dropdown-content w3-bar-block w3-card-4">
                        <FilterListContent
                            filterOptions={timeConfig}
                            handleFilterData={this.handleTimeRange}
                        />
                    </div>
                </div>
                {this.props.children}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        districtMap: state.districtMap,
        statusList: state.statusList,
    }
}

export default withRouter(connect(mapStateToProps, {

})(FilterComponent));
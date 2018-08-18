import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

class FilterComponent extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            filterLabels: {
                sort: 'Sort',
                severity: 'Severity All',
                district: 'District All',
            },
            filterData: {},
            severityConfig: [
                {
                    value: 0,
                    name: 'Moderate',
                },
                {
                    value: 3,
                    name: 'Needs Help',
                },
                {
                    value: 4,
                    name: 'Urgent',
                },
                {
                    value: 6,
                    name: 'Very Urgent',
                },
                {
                    value: 8,
                    name: 'Life Threatening',
                }
            ],
            sortConfig: [
                {
                    value: 'DESC',
                    name: 'Newest First',
                },
                {
                    value: 'ASC',
                    name: 'Oldest First',
                }
            ],
        }
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

    render() {
        const { districtMap } = this.props;
        const { sortConfig, severityConfig, filterLabels } = this.state;
        const sortList = [];
        const districtList = [];
        const severityList = [];

        Object.keys(districtMap).forEach((key) => {
            districtList.push(
                <a  
                    key={`district_${key}`}
                    onClick={() => {this.handleFilterData('district', districtMap[key], districtMap[key])}}
                    className="w3-bar-item w3-button"
                >
                    {districtMap[key]}
                </a>)
        });

        sortConfig.map((item, key) => {
            sortList.push(
                <a
                    key={`sort_${key}`}
                    onClick={() => {this.handleFilterData('sort', item.value, item.name)}}
                    className="w3-bar-item w3-button"
                >{item.name}</a>
            );
        });
        
        severityConfig.map((item, key) => {
            severityList.push(
                <a
                    key={`severity_${key}`}
                    onClick={() => {this.handleFilterData('severity', item.value, item.name)}}
                    className="w3-bar-item w3-button"
                >{item.name}</a>
            );
        });

        return (
            <div className="w3-bar w3-teal w3-top kf-top-bar-filter">
                <div className="w3-dropdown-hover w3-teal">
                    <button className="w3-button w3-teal w3-margin-right">
                        {filterLabels['sort']} <span className="kf-carot"></span>
                    </button>
                    <div className="w3-dropdown-content w3-bar-block w3-card-4">
                        {sortList}
                    </div>
                </div>
                <div className="w3-dropdown-hover w3-teal">
                    <button className="w3-button w3-teal w3-margin-right">
                        {filterLabels['severity']} <span className="kf-carot"></span>
                    </button>
                    <div className="w3-dropdown-content w3-bar-block w3-card-4">
                        {severityList}
                    </div>
                </div>
                <div className="w3-dropdown-hover">
                    <button className="w3-button w3-margin-right">
                        {filterLabels['district']} <span className="kf-carot"></span>
                    </button>
                    <div className="w3-dropdown-content w3-bar-block w3-card-4">
                        {districtList}
                    </div>
                </div>
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
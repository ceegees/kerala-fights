import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

class FilterListContent extends React.Component {

    render() {
        const filterLists = [];
        const { filterOptions } = this.props;

        if (Array.isArray(filterOptions)) {
            filterOptions.map((item, key) => {
                filterLists.push(
                    <a
                        key={`${item.type}_${key}`}
                        onClick={() => {this.props.handleFilterData(item.type, item.value, item.name)}}
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

        this.state = {
            filterLabels: {
                sort: 'Sort',
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
        }

        this.handleFilterData = this.handleFilterData.bind(this);
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

        return (
            <div className="w3-bar w3-teal w3-top kf-top-bar-filter">
                <div className="w3-dropdown-hover w3-teal">
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
                <div className="w3-dropdown-hover w3-teal">
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
                <div className="w3-dropdown-hover w3-teal">
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
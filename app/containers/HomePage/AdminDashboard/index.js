import classNames from 'classnames';
import _, { map, mapKeys, concat, findIndex, pullAt } from 'lodash';
import moment from 'moment-timezone';
import React, { PropTypes, Component } from 'react';
import Button from 'react-bootstrap/lib/Button';
import Modal from 'react-bootstrap/lib/Modal';
import rd3 from 'react-d3';
import { defaultRanges, DateRange } from 'react-date-range';
import { connect } from 'react-redux';
import { StickyContainer } from 'react-sticky';
import { Field, reduxForm, reset, change } from 'redux-form';
import { createStructuredSelector } from 'reselect';
import LoadingSpinner from '../../../components/LoadingSpinner';

import CenteredModal from '../../../components/CenteredModal';
import FiltersForm from './FiltersForm';
import StudyList from './StudyList';
import Filter from '../../../components/Filter';

import {
  selectFilterFormValues,
  selectLevels,
  selectSiteNames,
  selectSiteLocations,
  selectIndications,
  selectSponsors,
  selectProtocols,
  selectCro,
  selectUsersByRoles,
  selectStudiesTotals,
  selectStudyUpdateProcess,
  selectAllClientUsers,
  selectEditStudyValues,
  selectMessagingNumbers,
  selectPaginationOptions,
} from './selectors';
import {
  fetchStudiesDashboard,
  fetchTotalsDashboard,
  fetchSiteNames,
  fetchSiteLocations,
  updateDashboardStudy,
  clearFilters,
  fetchAllClientUsersDashboard,
  fetchStudyCampaignsDashboard,
  changeStudyStatusDashboard,
  toggleStudy,
  fetchMessagingNumbersDashboard,
  updateTwilioNumbers,
} from './actions';
import { fetchLevels, fetchIndications, fetchSponsors, fetchProtocols, fetchCro, fetchUsersByRole, addEmailNotificationUser } from '../../App/actions';

const PieChart = rd3.PieChart;
const LineChart = rd3.LineChart;

@reduxForm({ form: 'filterPanel', destroyOnUnmount: false })
export class AdminDashboard extends Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    dispatch: PropTypes.func,
    filtersFormValues: PropTypes.object,
    studies: PropTypes.array,
    resetForm: PropTypes.func,
    fetchStudiesDashboard: PropTypes.func,
    fetchTotalsDashboard: PropTypes.func,
    fetchLevels: PropTypes.func,
    levels: PropTypes.array,
    fetchSiteLocations: PropTypes.func,
    fetchSiteNames: PropTypes.func,
    siteNames: PropTypes.array,
    siteLocations: PropTypes.array,
    fetchIndications: PropTypes.func,
    indications: PropTypes.array,
    fetchSponsors: PropTypes.func,
    fetchProtocols: PropTypes.func,
    fetchCro: PropTypes.func,
    sponsors: PropTypes.array,
    protocols: PropTypes.array,
    cro: PropTypes.array,
    fetchUsersByRole: PropTypes.func,
    usersByRoles: PropTypes.object,
    totals: PropTypes.object,
    updateDashboardStudy: PropTypes.func,
    clearFilters: PropTypes.func,
    studyUpdateProcess: PropTypes.object,
    fetchAllClientUsersDashboard: PropTypes.func,
    allClientUsers: PropTypes.object,
    editStudyValues: PropTypes.object,
    addEmailNotificationUser: PropTypes.func,
    fetchStudyCampaignsDashboard: PropTypes.func,
    changeStudyStatusDashboard: PropTypes.func,
    toggleStudy: PropTypes.func,
    fetchMessagingNumbersDashboard: PropTypes.func,
    messagingNumbers: PropTypes.object,
    updateTwilioNumbers: PropTypes.func,
    paginationOptions: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.state = {
      customFilters: [],
      modalFilters: props.filtersFormValues ? props.filtersFormValues : [],
      showDateRangeModal: false,
      rangePicker : {},
      datePicker : null,
      firstDayOfWeek : null,
      dateRange : {
        startDate: moment().clone().subtract(30, 'days'),
        endDate: moment(),
      },
      prevTotalsFilters: [],
      prevOffset: null,
    };

    this.addFilter = this.addFilter.bind(this);
    this.removeFilter = this.removeFilter.bind(this);
    this.openFiltersModal = this.openFiltersModal.bind(this);
    this.closeFiltersModal = this.closeFiltersModal.bind(this);
    this.saveFilters = this.saveFilters.bind(this);
    this.handleChange = this.handleChange.bind(this, 'dateRange');
    this.showDateRangeModal = this.showDateRangeModal.bind(this);
    this.hideDateRangeModal = this.hideDateRangeModal.bind(this);
    this.changeRange = this.changeRange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.fetchStudiesAccordingToFilters = this.fetchStudiesAccordingToFilters.bind(this);
    this.percentageFilterChange = this.percentageFilterChange.bind(this);
    this.percentageFilterSubmit = this.percentageFilterSubmit.bind(this);
    this.nearbyFilterChange = this.nearbyFilterChange.bind(this);
    this.nearbyFilterSubmit = this.nearbyFilterSubmit.bind(this);
    this.searchFilterSubmit = this.searchFilterSubmit.bind(this);
    this.addressFilterSubmit = this.addressFilterSubmit.bind(this);
  }

  componentWillMount() {
    this.props.fetchLevels();
    this.props.fetchSiteLocations();
    this.props.fetchIndications();
    this.props.fetchSponsors();
    this.props.fetchProtocols();
    this.props.fetchCro();
    this.props.fetchUsersByRole();
    this.props.fetchMessagingNumbersDashboard();

    // this.props.fetchStudiesDashboard({ onlyTotals: true }, 10, 0);
    this.props.fetchTotalsDashboard({}, 10, 0);
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      modalFilters: newProps.filtersFormValues,
    });
  }

  addFilter(options) {
    const { customFilters } = this.state;
    if (customFilters.length === 0) {
      const newOptions = {
        ...options,
        name: options.name + customFilters.length,
        onClose: () => this.removeFilter({ name: 'search' }),
        onSubmit: this.searchFilterSubmit,
      };
      customFilters.push(newOptions);
      this.setState({ customFilters });
    }
  }

  removeFilter(filter) {
    const { customFilters, modalFilters } = this.state;

    if (filter.type === 'search') {
      pullAt(customFilters, findIndex(customFilters, filter));
      this.setState({ customFilters });

      pullAt(modalFilters, 'search');
      this.setState({ modalFilters });
    }

    if (filter.name === 'percentage') {
      pullAt(modalFilters, 'percentage');
      this.setState({ modalFilters });
    }

    if (filter.name === 'nearbyStudies') {
      pullAt(modalFilters, 'nearbyStudies');
      this.setState({ modalFilters });
    }

    if (filter.name === 'address') {
      pullAt(modalFilters, 'address');
      this.setState({ modalFilters });
    }

    if (modalFilters[filter.name]) {
      pullAt(modalFilters[filter.name], findIndex(modalFilters[filter.name], ['label', filter.value]));
      pullAt(modalFilters[filter.name], findIndex(modalFilters[filter.name], ['label', 'All']));
      this.setState({ modalFilters });
    }

    this.fetchStudiesAccordingToFilters();
  }

  saveFilters() {

  }

  clearFilters() {
    this.props.clearFilters();
    this.setState({ customFilters: [],
      modalFilters: [] });
    this.props.resetForm();

    this.setState({ prevTotalsFilters: {} });
    this.setState({ prevOffset: null });
    this.props.fetchTotalsDashboard({}, 10, 0);
    // this.props.fetchStudiesDashboard({ onlyTotals: true }, 10, 0);
  }

  openFiltersModal() {
    this.setState({ addUserModalOpen: true });
  }

  closeFiltersModal() {
    this.setState({ addUserModalOpen: false });
  }

  handleUserQueryChange(event) {
    this.setState({
      userName: event.target.value,
    });
  }

  showDateRangeModal(ev) {
    if (ev) {
      ev.preventDefault();
    }
    this.setState({ showDateRangeModal: true });
  }

  hideDateRangeModal(ev) {
    if (ev) {
      ev.preventDefault();
    }
    this.setState({ showDateRangeModal: false });
  }

  changeRange() {
    // TODO: update filter
    this.hideDateRangeModal();
  }

  handleChange(which, payload) {
    this.setState({
      [which] : payload,
    });
  }

  parseDateRange() {
    const { startDate, endDate } = this.state.dateRange;
    const today = moment();
    const fmt = 'MM/DD/YY';
    let prefix = '';

    if (endDate.format(fmt) === today.format(fmt)) {
      prefix = ' Last ';
    }
    const days = endDate.diff(startDate, 'days');
    return `${prefix} ${days} Days: ${startDate.format(fmt)} - ${endDate.format(fmt)}`;
  }

  mapFilterValues(filters) {
    const newFilters = [];
    mapKeys(filters, (filterValues, key) => {
      if (key !== 'campaign' && key !== 'search') {
        if (key === 'percentage') {
          newFilters.push({
            name: key,
            type: 'compare',
            value: filterValues.value,
            onChange: this.percentageFilterChange,
            onSubmit: this.percentageFilterSubmit,
          });
        } else if (key === 'nearbyStudies') {
          newFilters.push({
            name: key,
            type: 'nearby',
            value: filterValues.value,
            onChange: this.nearbyFilterChange,
            onSubmit: this.nearbyFilterSubmit,
          });
        } else if (key === 'address') {
          newFilters.push({
            name: key,
            type: 'address',
            value: filterValues.value,
            onSubmit: this.addressFilterSubmit,
          });
        } else {
          _.forEach(filterValues, (v) => {
            if ((v.label !== 'All') || (v.label === 'All' && filterValues.length === 1)) {
              newFilters.push({
                name: key,
                type: 'value',
                value: v.label,
              });
            }
          });
        }
      }
    });
    return newFilters;
  }

  fetchStudiesAccordingToFilters(value, key, fetchByScroll) {
    let filters = _.cloneDeep(this.props.filtersFormValues);

    if ((value && key) || (key === 'campaign')) {
      const newFilterValues = _.cloneDeep(value);
      filters = { ...filters, [key]:newFilterValues };
    }

    let isEmpty = true;

    _.forEach(filters, (filter, key) => {
      const initFilter = _.cloneDeep(filter);
      if (key !== 'search' && key !== 'percentage' && key !== 'campaign' && key !== 'nearbyStudies' && key !== 'address') {
        const withoutAll = _.remove(filter, (item) => (item.label !== 'All'));
        filters[key] = withoutAll;
      }

      if (!_.isEmpty(initFilter)) {
        isEmpty = false;
      }
    });

    let offset = 0;
    const limit = 10;

    if (fetchByScroll) {
      offset = this.props.paginationOptions.page * 10;
    }

    if (isEmpty) {
      this.props.clearFilters();
      this.props.fetchTotalsDashboard({}, 10, 0);
      // this.props.fetchStudiesDashboard({ onlyTotals: true }, 10, 0);
    } else {
      if (!_.isEqual(this.state.prevTotalsFilters, filters)) {
        this.setState({ prevTotalsFilters: _.cloneDeep(filters) });
        this.props.fetchTotalsDashboard(filters, 10, 0);

        if (this.state.prevOffset === offset) {
          this.props.fetchStudiesDashboard(filters, limit, offset);
          this.setState({ prevOffset: offset });
        }
      }

      if (this.state.prevOffset !== offset) {
        this.props.fetchStudiesDashboard(filters, limit, offset);
        this.setState({ prevOffset: offset });
      }
    }
  }

  percentageFilterChange(e) {
    this.props.dispatch(change('dashboardFilters', 'percentage', e));
  }

  percentageFilterSubmit(e) {
    this.props.dispatch(change('dashboardFilters', 'percentage', { ...this.props.filtersFormValues.percentage, arg: e }));
    this.fetchStudiesAccordingToFilters({ ...this.props.filtersFormValues.percentage, arg: e }, 'percentage');
  }

  nearbyFilterChange(e) {
    this.props.dispatch(change('dashboardFilters', 'nearbyStudies', e));
  }

  nearbyFilterSubmit(e) {
    this.props.dispatch(change('dashboardFilters', 'nearbyStudies', { ...this.props.filtersFormValues.nearbyStudies, arg: e }));
    this.fetchStudiesAccordingToFilters({ ...this.props.filtersFormValues.nearbyStudies, arg: e }, 'nearbyStudies');
  }

  searchFilterSubmit(e) {
    this.props.dispatch(change('dashboardFilters', 'search', { value: e }));
    this.fetchStudiesAccordingToFilters({ value: e }, 'search');
  }

  addressFilterSubmit(e) {
    this.props.dispatch(change('dashboardFilters', 'address', { value: e }));
    this.fetchStudiesAccordingToFilters({ value: e }, 'address');
  }

  formatFilterName(filter) {
    let name = filter.name;
    if (name === 'siteLocation') {
      name = 'Site Location';
    }
    if (name === 'exposureLevel') {
      name = 'Exposure Level';
    }
    if (name === 'siteNumber') {
      name = 'Site Number';
    }
    return { ...filter, name };
  }

  renderDateFooter() {
    const { dateRange } = this.state;
    if (dateRange.startDate) {
      const format = 'MMM D, YYYY';
      if (dateRange.startDate.isSameOrAfter(dateRange.endDate, 'day')) {
        return (
          <span className="time">
            {moment(dateRange.startDate).format(format)}
          </span>
        );
      }
      return (
        <span className="time">{moment(dateRange.startDate).format(format)} - {moment(dateRange.endDate).format(format)}</span>
      );
    }
    return null;
  }

  render() {
    const { customFilters, modalFilters } = this.state;

    const filters = concat(this.mapFilterValues(modalFilters), customFilters);
    const details = this.props.totals.details || {};

    const redCount = parseInt(details.total_red) || 0;
    const yellowCount = parseInt(details.total_yellow) || 0;
    const greenCount = parseInt(details.total_green) || 0;
    const purpleCount = parseInt(details.total_purple) || 0;

    const colorsTotal = redCount + yellowCount + greenCount + purpleCount;

    const redPercent = redCount ? ((redCount / colorsTotal) * 100).toFixed(2) : 0;
    const yellowPercent = yellowCount ? ((yellowCount / colorsTotal) * 100).toFixed(2) : 0;
    const greenPercent = greenCount ? ((greenCount / colorsTotal) * 100).toFixed(2) : 0;
    const purplePercent = purpleCount ? ((purpleCount / colorsTotal) * 100).toFixed(2) : 0;

    const tier1Count = parseInt(details.total_tier_one) || 0;
    const tier2Count = parseInt(details.total_tier_two) || 0;
    const tier3Count = parseInt(details.total_tier_three) || 0;
    const tier4Count = parseInt(details.total_tier_four) || 0;

    const tiersTotal = tier1Count + tier2Count + tier3Count + tier4Count;

    const tier1Percent = tier1Count ? ((tier1Count / tiersTotal) * 100).toFixed(2) : 0;
    const tier2Percent = tier2Count ? ((tier2Count / tiersTotal) * 100).toFixed(2) : 0;
    const tier3Percent = tier3Count ? ((tier3Count / tiersTotal) * 100).toFixed(2) : 0;
    const tier4Percent = tier4Count ? ((tier4Count / tiersTotal) * 100).toFixed(2) : 0;

    const pieData1 = [
      { label: 'RED', value: redCount, percent: redPercent, color: '#dd0000' },
      { label: 'YELLOW', value: yellowCount, percent: yellowPercent, color: '#f9ce15' },
      { label: 'GREEN', value: greenCount, percent: greenPercent, color: '#7dbc00' },
      { label: 'PURPLE', value: purpleCount, percent: purplePercent, color: '#873fbd' },
    ];

    const pieData2 = [
      { label: 'TIER 1', value: tier1Count, percent: tier1Percent, color: '#00afef' },
      { label: 'TIER 2', value: tier2Count, percent: tier2Percent, color: '#f78e1e' },
      { label: 'TIER 3', value: tier3Count, percent: tier3Percent, color: '#a0cf67' },
      { label: 'TIER 4', value: tier4Count, percent: tier4Percent, color: '#949ca1' },
    ];

    const lineData = [
      {
        name: 'Patients',
        values: [{ x: 0, y: 2 }, { x: 1, y: 3 }, { x: 2, y: 1 }, { x: 3, y: 3 }, { x: 4, y: 5 }, { x: 5, y: 1 }, { x: 6, y: 3 }, { x: 7, y: 2 }, { x: 8, y: 4 }, { x: 10, y: 1 }, { x: 12, y: 3 }, { x: 13, y: 1 }, { x: 15, y: 5 }],
      },
    ];

    return (
      <div className="container-fluid admin-dashboard">
        <div className="fixed-header clearfix">
          <h2 className="main-heading pull-left">STUDYKIK DASHBOARD</h2>
          <div className="filters-btns pull-right">
            <Button
              bsStyle="primary"
              onClick={() => this.addFilter({
                name: 'search',
                type: 'search',
                value: '',
              })}
            >
              Search
            </Button>
            <Button bsStyle="primary" onClick={this.openFiltersModal}>
              Filters
            </Button>
            <Button bsStyle="primary" onClick={this.props.updateTwilioNumbers}>
              #
            </Button>
            <Modal dialogComponentClass={CenteredModal} className="filter-modal" id="filter-modal" show={this.state.addUserModalOpen} onHide={this.closeFiltersModal}>
              <Modal.Header>
                <Modal.Title>Filters</Modal.Title>
                <a className="lightbox-close close" onClick={this.closeFiltersModal}>
                  <i className="icomoon-icon_close" />
                </a>
              </Modal.Header>
              <Modal.Body>
                <div className="holder clearfix">
                  <div className="form-lightbox">
                    <FiltersForm
                      handleSubmit={this.addUser}
                      initialValues={this.props.filtersFormValues}
                      fetchStudiesAccordingToFilters={this.fetchStudiesAccordingToFilters}
                      levels={this.props.levels}
                      siteNames={this.props.siteNames}
                      siteLocations={this.props.siteLocations}
                      indications={this.props.indications}
                      sponsors={this.props.sponsors}
                      protocols={this.props.protocols}
                      cro={this.props.cro}
                      usersByRoles={this.props.usersByRoles}
                    />
                  </div>
                </div>
              </Modal.Body>
            </Modal>
          </div>
        </div>
        <StickyContainer className={classNames('filters-section', { 'bar-active': (filters.length > 0) }, { 'filters-added': (filters.length > 0) })}>
          {(filters.length > 0) && (
          <div className="filters-bar">
            <div className="filters-holder search-filters">
              <strong className="title">FILTERS</strong>
              <div className="btns pull-right">
                <Button className="gray-outline" onClick={() => this.clearFilters()}>
                  Clear
                </Button>
              </div>
              <div className="holder">
                {filters.map((filter, index) =>
                  <Field
                    name={filter.name}
                    key={index}
                    options={this.formatFilterName(filter)}
                    component={Filter}
                    onClose={() => this.removeFilter(filter)}
                    onChange={(e) => {
                      if (filter.onChange) {
                        filter.onChange(e);
                      }
                    }}
                    onSubmit={(e) => {
                      if (filter.onSubmit) {
                        filter.onSubmit(e);
                      }
                    }

                    }
                  />
                )}
                <Button
                  bsStyle="primary"
                  className="add-new-filters btn btn-primary"
                  onClick={() => this.addFilter({
                    name: 'search',
                    type: 'search',
                    value: '',
                  })}
                ><i className="glyphicon glyphicon-plus" /></Button>
              </div>
            </div>
          </div>
          )}

          <div className="d-stats clearfix">
            <ul className="list-unstyled info-list  pull-left">
              <li>
                <strong className="heading">TODAY: </strong>
                <span className="number">{details.total_today || 0}</span>
              </li>
              <li>
                <strong className="heading">YESTERDAY: </strong>
                <span className="number">{details.total_yesterday || 0}</span>
              </li>
              <li>
                <strong className="heading">CAMPAIGN TOTAL: </strong>
                <span className="number">{details.total_campaign || 0}</span>
              </li>
              <li>
                <strong className="heading">GRAND TOTAL: </strong>
                <span className="number">{details.total_grand || 0}</span>
              </li>
            </ul>
            <ul className="list-unstyled info-list pull-left">
              {
                map(pieData1, (data, index) => {
                  const colorClass = data.label.toLowerCase();
                  return (
                    <li key={index}>
                      <strong className={`heading color ${colorClass}`}>{data.label}: </strong>
                      <span className="number">{data.value} <span>({`${data.percent}%`})</span></span>
                    </li>
                  );
                })
              }
            </ul>
            <div className="chart pull-left">
              { this.props.totals.fetching && <div className="dashboard-total-spinner"><LoadingSpinner showOnlyIcon /></div> }
              <PieChart
                data={pieData1}
                width={180}
                height={180}
                radius={90}
                innerRadius={0}
                sectorBorderColor="white"
                showOuterLabels={false}
                showInnerLabels={false}
                colors={(data) => data.color}
                colorAccessor={(data) => data}
              />
            </div>
            <ul className="list-unstyled info-list pull-left">
              {
                map(pieData2, (data, index) => {
                  const colorClass = data.label.toLowerCase().replace(' ', '');
                  return (
                    <li key={index}>
                      <strong className={`heading color ${colorClass}`}>{data.label}: </strong>
                      <span className="number">{data.value} <span>({`${data.percent}%`})</span></span>
                    </li>
                  );
                })
              }
            </ul>
            <div className="chart pull-left">
              <PieChart
                data={pieData2}
                width={180}
                height={180}
                radius={90}
                innerRadius={0}
                sectorBorderColor="white"
                showOuterLabels={false}
                showInnerLabels={false}
                colors={(data) => data.color}
                colorAccessor={(data) => data}
              />
            </div>
          </div>
          <div className="graph-area clearfix">
            <div className="head clearfix">
              <h2 className="pull-left">PATIENTS PER DAY</h2>
              <span className="counter pull-left">0% OF GOAL 0.49%</span>
              <Button bsStyle="primary" className="lightbox-opener pull-right" onClick={() => { this.showDateRangeModal(); }}>
                <i className="icomoon-icon_calendar" />
                {this.parseDateRange()}
              </Button>
            </div>
            <div className="graph-holder">
              <LineChart
                data={lineData}
                width="100%"
                height={130}
                viewBoxObject={{
                  x: 0,
                  y: 0,
                  width: 1800,
                  height: 150,
                }}
              />
            </div>
            <Modal
              id="date-range"
              className="date-range-modal"
              dialogComponentClass={CenteredModal}
              show={this.state.showDateRangeModal}
              onHide={() => { this.hideDateRangeModal(); }}
              backdrop
              keyboard
            >
              <Modal.Header>
                <Modal.Title>Date Range</Modal.Title>
                <a className="lightbox-close close" onClick={() => { this.hideDateRangeModal(); }}>
                  <i className="icomoon-icon_close" />
                </a>
              </Modal.Header>
              <Modal.Body>
                <DateRange
                  linkedCalendars
                  ranges={defaultRanges}
                  startDate={this.state.dateRange.startDate ? this.state.dateRange.startDate : moment()}
                  endDate={this.state.dateRange.endDate ? this.state.dateRange.endDate : moment().add(1, 'M')}
                  onInit={this.handleChange}
                  onChange={this.handleChange}
                />
                <div className="dateRange-helper">
                  <div className="emit-border"><br /></div>
                  <div className="right-part">
                    <div className="btn-block text-right">
                      {this.renderDateFooter()}
                      <Button onClick={this.changeRange}>
                        Submit
                      </Button>
                    </div>
                  </div>
                </div>
              </Modal.Body>
            </Modal>
          </div>
          <StudyList
            totals={this.props.totals}
            fetchStudiesAccordingToFilters={this.fetchStudiesAccordingToFilters}
            usersByRoles={this.props.usersByRoles}
            updateDashboardStudy={this.props.updateDashboardStudy}
            siteLocations={this.props.siteLocations}
            sponsors={this.props.sponsors}
            protocols={this.props.protocols}
            cro={this.props.cro}
            levels={this.props.levels}
            indications={this.props.indications}
            studyUpdateProcess={this.props.studyUpdateProcess}
            fetchAllClientUsersDashboard={this.props.fetchAllClientUsersDashboard}
            allClientUsers={this.props.allClientUsers}
            editStudyValues={this.props.editStudyValues}
            addEmailNotificationUser={this.props.addEmailNotificationUser}
            fetchStudyCampaignsDashboard={this.props.fetchStudyCampaignsDashboard}
            changeStudyStatusDashboard={this.props.changeStudyStatusDashboard}
            toggleStudy={this.props.toggleStudy}
            messagingNumbers={this.props.messagingNumbers}
            paginationOptions={this.props.paginationOptions}
            filtersFormValues={this.props.filtersFormValues}
          />
        </StickyContainer>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  filtersFormValues: selectFilterFormValues(),
  levels: selectLevels(),
  siteNames: selectSiteNames(),
  siteLocations: selectSiteLocations(),
  indications: selectIndications(),
  sponsors: selectSponsors(),
  protocols: selectProtocols(),
  cro: selectCro(),
  usersByRoles: selectUsersByRoles(),
  totals: selectStudiesTotals(),
  studyUpdateProcess: selectStudyUpdateProcess(),
  allClientUsers: selectAllClientUsers(),
  editStudyValues: selectEditStudyValues(),
  messagingNumbers: selectMessagingNumbers(),
  paginationOptions: selectPaginationOptions(),
});

function mapDispatchToProps(dispatch) {
  return {
    resetForm: () => dispatch(reset('dashboardFilters')),
    fetchStudiesDashboard: (params, limit, offset) => dispatch(fetchStudiesDashboard(params, limit, offset)),
    fetchTotalsDashboard: (params, limit, offset) => dispatch(fetchTotalsDashboard(params, limit, offset)),
    fetchLevels: () => dispatch(fetchLevels()),
    fetchSiteNames: () => dispatch(fetchSiteNames()),
    fetchSiteLocations: () => dispatch(fetchSiteLocations()),
    fetchIndications: () => dispatch(fetchIndications()),
    fetchSponsors: () => dispatch(fetchSponsors()),
    fetchProtocols: () => dispatch(fetchProtocols()),
    fetchCro: () => dispatch(fetchCro()),
    fetchUsersByRole: () => dispatch(fetchUsersByRole()),
    updateDashboardStudy: (params) => dispatch(updateDashboardStudy(params)),
    clearFilters: () => dispatch(clearFilters()),
    fetchAllClientUsersDashboard: (params) => dispatch(fetchAllClientUsersDashboard(params)),
    addEmailNotificationUser: (payload) => dispatch(addEmailNotificationUser(payload)),
    fetchStudyCampaignsDashboard: (params) => dispatch(fetchStudyCampaignsDashboard(params)),
    changeStudyStatusDashboard: (params, status, isChecked) => dispatch(changeStudyStatusDashboard(params, status, isChecked)),
    toggleStudy: (id, status) => dispatch(toggleStudy(id, status)),
    fetchMessagingNumbersDashboard: () => dispatch(fetchMessagingNumbersDashboard()),
    updateTwilioNumbers: () => dispatch(updateTwilioNumbers()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminDashboard);

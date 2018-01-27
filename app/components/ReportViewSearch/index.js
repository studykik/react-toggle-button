import React, { PropTypes } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Field, reduxForm, change } from 'redux-form';
import { defaultRanges, DateRange } from 'react-date-range';
import { bindActionCreators } from 'redux';
import { actions as toastrActions } from 'react-redux-toastr';
import _ from 'lodash';
import Button from 'react-bootstrap/lib/Button';
import Modal from 'react-bootstrap/lib/Modal';

import CenteredModal from '../CenteredModal/index';
import ReactSelect from '../Input/ReactSelect';
import Input from '../Input/index';
import { exportStudies } from '../../containers/ReportViewPage/actions';
import { getItem } from '../../utils/localStorage';
import {
  selectSocket,
} from '../../containers/GlobalNotifications/selectors';

@reduxForm({ form: 'searchReports' })

export class ReportViewSearch extends React.Component {
  static propTypes = {
    location: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    searchReports: PropTypes.func,
    exportStudies: PropTypes.func,
    formValues: PropTypes.object,
    currentUser: PropTypes.object,
    reportsList: PropTypes.object,
    socket: React.PropTypes.any,
    toastrActions: React.PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      socketBinded: false,
      searchTimer: null,
      showPopup: false,
      predefined : {
        startDate: moment().clone().subtract(30, 'days'),
        endDate: moment(),
      },
      selectedTime : {
        startDate: null,
        endDate: null,
      },
    };

    this.initSearch = this.initSearch.bind(this);

    this.showPopup = this.showPopup.bind(this);
    this.hidePopup = this.hidePopup.bind(this);
    this.handleChange = this.handleChange.bind(this, 'predefined');
    this.changeRange = this.changeRange.bind(this);
    this.renderDateFooter = this.renderDateFooter.bind(this);
    this.download = this.download.bind(this);
  }

  componentWillReceiveProps() {
    const { currentUser, socket } = this.props;

    if (socket && this.state.socketBinded === false) {
      this.setState({ socketBinded: true }, () => {
        socket.on('notifySponsorReportReady', (data) => {
          const authToken = getItem('auth_token');
          if (currentUser.roleForSponsor && data.url && currentUser.roleForSponsor.id === data.sponsorRoleId && authToken === data.authToken) {
            setTimeout(() => { this.props.toastrActions.remove('loadingToasterForExportStudies'); }, 1000);
            location.replace(data.url);
          }
        });
      });
    }
  }

  handleChange(which, payload) {
    this.setState({
      [which] : payload,
    });
  }

  showPopup(ev) {
    ev.preventDefault();
    this.setState({ showPopup: true });
  }

  hidePopup(ev) {
    if (ev) {
      ev.preventDefault();
    }
    this.setState({ showPopup: false });
  }

  initSearch(e, name) {
    const params = this.props.formValues;
    if (e && e.target) {
      params[e.target.name] = e.target.value;
      if (this.state.searchTimer) {
        clearTimeout(this.state.searchTimer);
        this.setState({ searchTimer: null });
      }
      const timerH = setTimeout(() => { this.props.searchReports(params); }, 500);
      this.setState({ searchTimer: timerH });
    } else {
      params[name] = e;
      this.props.searchReports(params);
    }
  }

  changeRange(ev) {
    ev.preventDefault();
    const range = this.state.predefined;

    const startDate = range.startDate.utc().format('YYYY-MM-DD HH:mm:ss');
    const endDate = range.endDate.utc().format('YYYY-MM-DD HH:mm:ss');
    const uiStartDate = range.startDate.utc().format('MM/DD/YY');
    const uiEndDate = range.endDate.utc().format('MM/DD/YY');

    this.props.dispatch(change('searchReports', 'startDate', startDate));
    this.props.dispatch(change('searchReports', 'endDate', endDate));

    this.setState({
      selectedTime: {
        startDate: uiStartDate,
        endDate: uiEndDate,
      },
    }, () => {
      this.props.searchReports({ endDate, startDate });
      this.hidePopup();
    });
  }

  download(ev) {
    ev.preventDefault();
    const { exportStudies, currentUser, formValues } = this.props;
    const protocolNumber = this.props.location.query.protocol || null;
    const indication = this.props.location.query.indication || null;
    const cro = this.props.location.query.cro || null;
    const messaging = this.props.location.query.messaging || null;

    let filters = { sponsorRoleId: currentUser.roleForSponsor.id, protocol: protocolNumber, indication, cro, messaging, timezone: currentUser.timezone };
    filters = _.assign(filters, this.props.formValues, formValues);

    exportStudies(filters);
  }

  renderDateFooter() {
    const { predefined } = this.state;
    if (predefined.startDate) {
      const format = 'MMM D, YYYY';
      if (predefined.startDate.isSameOrAfter(predefined.endDate, 'day')) {
        return (
          <span className="time">
            {moment(predefined.startDate).format(format)}
          </span>
        );
      }
      return (
        <span className="time">
          {moment(predefined.startDate).format(format)} - {moment(predefined.endDate).format(format)}
        </span>
      );
    }
    return null;
  }

  render() {
    const { selectedTime, predefined } = this.state;
    const defaultSourceOptions = [
      {
        label: 'StudyKIK',
        value: 1,
      },
    ];

    const statusOptions = [
      {
        label: 'All',
        value: 'all',
      },
      {
        label: 'Active',
        value: 'active',
      },
      {
        label: 'Inactive',
        value: 'inactive',
      },
    ];

    const timeButtonText = (selectedTime.startDate && selectedTime.endDate) ? `${selectedTime.startDate} - ${selectedTime.endDate}` : 'Date Range';
    let startDate = (predefined.startDate) ? predefined.startDate : moment();
    let endDate = (predefined.endDate) ? predefined.endDate : moment().add(1, 'M');
    if (selectedTime.startDate && selectedTime.endDate) {
      startDate = moment().clone().subtract(30, 'days');
      endDate = moment();
    }

    return (
      <div className="search-controls form-search clearfix">
        <div className="btns-area pull-right full-width">
          {/* TODO: remove tmp styles */}
          <div className="col pull-right">
            <a className="btn btn-primary lightbox-opener" onClick={this.download}><i className="icon-icon_download" /> download</a>
          </div>
          <div className="col pull-right">
            <a className="btn btn-primary lightbox-opener" onClick={this.showPopup}><i className="icomoon-icon_calendar" /> {timeButtonText}</a>
          </div>
        </div>
        <div className={(selectedTime.startDate && selectedTime.endDate) ? 'date-selected fields-holder full-width' : 'fields-holder full-width'}>
          <div className="search-area pull-left">
            <div className="has-feedback">
              <Button className="btn-enter">
                <i className="icomoon-icon_search2" />
              </Button>
              <Field
                name="name"
                component={Input}
                type="text"
                placeholder="Search"
                className="keyword-search"
                onChange={(e) => this.initSearch(e, 'name')}
              />
            </div>
          </div>
          <div className="pull-left custom-select">
            <Field
              name="status"
              component={ReactSelect}
              placeholder="Select Study Status"
              options={statusOptions}
              onChange={(e) => this.initSearch(e, 'status')}
            />
          </div>
          <div className="pull-left custom-select">
            <Field
              name="source"
              component={ReactSelect}
              placeholder="Select Source"
              options={defaultSourceOptions}
              selectedValue={1}
              disabled
            />
          </div>
        </div>
        <Modal
          id="date-range"
          className="date-range-modal"
          dialogComponentClass={CenteredModal}
          show={this.state.showPopup}
          onHide={this.hidePopup}
          backdrop
          keyboard
        >
          <Modal.Header>
            <Modal.Title>Date Range</Modal.Title>
            <a className="lightbox-close close" onClick={this.hidePopup}>
              <i className="icomoon-icon_close" />
            </a>
          </Modal.Header>
          <Modal.Body>
            <DateRange
              linkedCalendars
              ranges={defaultRanges}
              startDate={startDate}
              endDate={endDate}
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
    );
  }
}

const mapStateToProps = createStructuredSelector({
  socket: selectSocket(),
});

function mapDispatchToProps(dispatch) {
  return {
    exportStudies: (payload) => dispatch(exportStudies(payload)),
    toastrActions: bindActionCreators(toastrActions, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReportViewSearch);

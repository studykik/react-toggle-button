/*
 *
 * StudyPage
 *
 */

import React, { PropTypes } from 'react';
import Helmet from 'react-helmet';
import moment from 'moment-timezone';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions as toastrActions } from 'react-redux-toastr';
import { createStructuredSelector } from 'reselect';
import { selectSitePatients, selectCurrentUser } from '../../containers/App/selectors';
import { fetchSources } from '../../containers/App/actions';
import LoadingSpinner from '../../components/LoadingSpinner';
import FilterStudyPatients from './FilterStudyPatients';
import NotFoundPage from '../../containers/NotFoundPage/index';
import StudyStats from './StudyStats';
import PatientBoard from '../../components/PatientBoard/index';
import * as Selector from './selectors';
import { fetchPatients, fetchPatientCategories, fetchStudy, setStudyId, updatePatientSuccess, fetchStudyTextNewStats, downloadReport, textStatsFetched } from './actions';
import { clientOpenedStudyPage, clientClosedStudyPage } from '../../containers/GlobalNotifications/actions';
import {
  selectSocket,
} from '../../containers/GlobalNotifications/selectors';
import { getItem } from '../../utils/localStorage';

export class StudyPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    campaigns: PropTypes.array,
    fetchPatients: PropTypes.func.isRequired,
    downloadReport: PropTypes.func,
    fetchPatientCategories: PropTypes.func.isRequired,
    fetchingPatientCategories: PropTypes.bool.isRequired,
    fetchingPatients: PropTypes.bool.isRequired,
    fetchStudy: PropTypes.func.isRequired,
    fetchingStudy: PropTypes.bool.isRequired,
    patientCategories: PropTypes.array,
    params: PropTypes.object,
    patients: PropTypes.array,
    setStudyId: PropTypes.func.isRequired,
    sources: PropTypes.array,
    protocol: PropTypes.object,
    site: PropTypes.object,
    study: PropTypes.object,
    stats: PropTypes.object,
    socket: React.PropTypes.any,
    updatePatientSuccess: React.PropTypes.func,
    fetchSources: PropTypes.func,
    sitePatients: React.PropTypes.object,
    fetchStudyTextNewStats: React.PropTypes.func,
    fetchingPatientsError: PropTypes.object,
    currentUser: PropTypes.object,
    toastrActions: React.PropTypes.object.isRequired,
    clientOpenedStudyPage: React.PropTypes.func,
    clientClosedStudyPage: React.PropTypes.func,
    textStatsFetched: React.PropTypes.func,
  };

  static defaultProps = {
    fetchingStudy: true,
    fetchingPatients: true,
    fetchingPatientCategories: true,
  };

  constructor(props) {
    super(props);
    this.state = {
      socketBinded: false,
      isSubscribedToUpdateStats: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    const { params, setStudyId, fetchStudy, fetchPatientCategories, fetchSources, socket, clientOpenedStudyPage } = this.props;
    setStudyId(parseInt(params.id));
    fetchStudy(params.id);
    fetchPatientCategories(params.id);
    fetchSources();

    if (socket && socket.connected) {
      this.setState({ isSubscribedToUpdateStats: true }, () => {
        clientOpenedStudyPage(params.id);
      });
    }
  }

  componentWillReceiveProps(newProps) {
    const { params, socket, setStudyId, fetchPatientCategories, currentUser, clientOpenedStudyPage } = this.props;
    if (socket && this.state.socketBinded === false) {
      this.setState({ socketBinded: true }, () => {
        socket.on('connect', () => {
          this.setState({ isSubscribedToUpdateStats: true }, () => {
            clientOpenedStudyPage(params.id);
          });
        });

        socket.on('notifyStudyPageMessage', (message) => {
          let curCategoryId = null;
          let unreadMessageCount = 0;
          const socketMessage = message;

          if (socketMessage.twilioTextMessage.__data) { // eslint-disable-line no-underscore-dangle
            socketMessage.twilioTextMessage = socketMessage.twilioTextMessage.__data; // eslint-disable-line no-underscore-dangle
          }
          if (socketMessage.study.__data) { // eslint-disable-line no-underscore-dangle
            socketMessage.study = socketMessage.study.__data; // eslint-disable-line no-underscore-dangle
          }
          if (socketMessage.patient.__data) { // eslint-disable-line no-underscore-dangle
            socketMessage.patient = socketMessage.patient.__data; // eslint-disable-line no-underscore-dangle
          }

          _.forEach(this.props.patientCategories, (item) => {
            _.forEach(item.patients, (patient) => {
              if (patient.id === socketMessage.patient_id) {
                curCategoryId = item.id;
                unreadMessageCount = patient.unreadMessageCount || 0;
              }
            });
          });

          // fetch the new text stats
          // TODO needs to take into account the stats are filtered based on campaign and source selected
          if (this.props.study && this.props.study.id === socketMessage.study.id) {
            // check is patients is on the board
            let needToUpdateMessageStats = false;
            _.forEach(this.props.patientCategories, (category) => { // eslint-disable-line consistent-return
              _.forEach(category.patients, (patient) => { // eslint-disable-line consistent-return
                if (patient.id === socketMessage.patient_id) {
                  needToUpdateMessageStats = true;
                  return false;
                }
              });
              if (needToUpdateMessageStats) {
                return false;
              }
            });
            if (needToUpdateMessageStats) {
              if (socketMessage.twilioTextMessage.direction !== 'inbound') {
                this.props.textStatsFetched({ total:(this.props.stats.texts + 1), sent:(this.props.stats.textsSent + 1), received:this.props.stats.textsReceived });
              } else {
                this.props.textStatsFetched({ total:(this.props.stats.texts + 1), sent:this.props.stats.textsSent, received:(this.props.stats.textsReceived + 1) });
              }
            }
          }
          if (curCategoryId && socketMessage.twilioTextMessage.direction === 'inbound') {
            this.props.updatePatientSuccess(socketMessage.patient_id, curCategoryId, {
              unreadMessageCount: (unreadMessageCount + 1),
              lastTextMessage: socketMessage.twilioTextMessage,
            });
          } else if (curCategoryId && socketMessage.twilioTextMessage.direction !== 'inbound') {
            this.props.updatePatientSuccess(socketMessage.patient_id, curCategoryId, {
              unreadMessageCount,
              lastTextMessage: socketMessage.twilioTextMessage,
            });
          }
        });

        socket.on('notifyClientReportReady', (data) => {
          const authToken = getItem('auth_token');
          if (currentUser.roleForClient && data.url && currentUser.roleForClient.id === data.clientRoleId && authToken === data.authToken) {
            // this.props.downloadReport(data.reportName);
            setTimeout(() => { this.props.toastrActions.remove('loadingToasterForExportPatients'); }, 1000);
            location.replace(data.url);
          }
        });

        // TODO fix performance issues, since this calls multiple endpoints instead of just updating the landing page view count
        socket.on('notifyLandingPageViewChanged', (data) => {
          if (data.studyId === parseInt(params.id)) {
            fetchStudy(params.id);
          }
        });
      });
    }

    if (socket && this.state.isSubscribedToUpdateStats === false) {
      this.setState({ isSubscribedToUpdateStats: true }, () => {
        clientOpenedStudyPage(params.id);
      });
    }

    if (params.id !== newProps.params.id) {
      setStudyId(parseInt(newProps.params.id));
      fetchPatientCategories(newProps.params.id);
    }
  }

  componentWillUnmount() {
    const { params, socket, clientClosedStudyPage } = this.props;

    if (socket && socket.connected) {
      clientClosedStudyPage(params.id);
    }
  }

  handleSubmit(searchFilter) {
    const { params: { id } } = this.props;
    this.props.fetchPatients(id, searchFilter.text, searchFilter.campaignId, searchFilter.sourceId);
  }

  render() {
    const { fetchingPatientCategories, fetchStudy, fetchingStudy, campaigns, patientCategories, protocol, site, sources, study, stats, fetchingPatients, params } = this.props;
    const ePMS = study && study.patientMessagingSuite;
    if (fetchingStudy || fetchingPatientCategories) {
      return (
        <LoadingSpinner noMessage />
      );
    } else if (!study || !sources || !campaigns) {
      return (
        <div>A problem occurred trying to load the page. Please try refreshing the page.</div>
      );
    }
    const pageTitle = `${study.name} - StudyKIK`;
    const campaignOptions = campaigns.map(campaign => {
      const dateFrom = campaign.dateFrom ? moment(campaign.dateFrom).tz(site.timezone).format('MM/DD/YYYY') : 'TBD';
      const dateTo = campaign.dateTo ? moment(campaign.dateTo).tz(site.timezone).format('MM/DD/YYYY') : 'TBD';
      return {
        label: `${dateFrom} - ${dateTo}`,
        value: campaign.id,
      };
    });
    campaignOptions.unshift({ label: 'All', value: -1 });
    const sourceOptions = sources.map(source => (
      {
        label: source.type,
        value: source.id,
      }
    ));
    sourceOptions.unshift({ label: 'All', value: -1 });
    const siteLocation = site.name;
    let sponsor = 'None';
    if (study.sponsor) {
      sponsor = study.sponsor.name;
    }
    let studyName = study.name;
    if (study.indication && study.indication.name) {
      studyName = study.indication.name;
    }

    if (this.props.fetchingPatientsError && this.props.fetchingPatientsError.status === 404) {
      return <NotFoundPage />;
    }
    return (
      <div className="container-fluid no-padding">
        <Helmet title={pageTitle} />
        <section className="individual-study">
          <header className="main-head">
            <h2 className="main-heading">{study.name}</h2>
            <p>
              <span className="info-cell">Location: {siteLocation}</span>
              <span className="info-cell">Sponsor: {sponsor}</span>
              <span className="info-cell">Protocol: {protocol.number || ''}</span>
            </p>
          </header>
          <FilterStudyPatients
            campaignOptions={campaignOptions}
            sourceOptions={sourceOptions}
            fetchStudy={fetchStudy}
            handleSubmit={this.handleSubmit}
            ePMS={ePMS}
            studyName={studyName}
            fetchStudyTextNewStats={this.props.fetchStudyTextNewStats}
          />
          <StudyStats stats={stats} />
          <PatientBoard
            patientCategories={patientCategories}
            fetchingPatients={fetchingPatients}
            site={site}
            params={params}
            ePMS={ePMS}
          />
        </section>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  campaigns: Selector.selectCampaigns(),
  fetchingPatients: Selector.selectFetchingPatients(),
  fetchingPatientCategories: Selector.selectFetchingPatientCategories(),
  fetchingStudy: Selector.selectFetchingStudy(),
  patientCategories: Selector.selectPatientCategories(),
  sources: Selector.selectSources(),
  site: Selector.selectSite(),
  protocol: Selector.selectProtocol(),
  study: Selector.selectStudy(),
  stats: Selector.selectStudyStats(),
  socket: selectSocket(),
  sitePatients: selectSitePatients(),
  fetchingPatientsError: Selector.selectFetchingPatientsError(),
  currentUser: selectCurrentUser(),
});

function mapDispatchToProps(dispatch) {
  return {
    fetchPatients: (studyId, text, campaignId, sourceId) => dispatch(fetchPatients(studyId, text, campaignId, sourceId)),
    downloadReport: (reportName) => dispatch(downloadReport(reportName)),
    fetchPatientCategories: (studyId) => dispatch(fetchPatientCategories(studyId)),
    fetchStudy: (studyId) => dispatch(fetchStudy(studyId)),
    setStudyId: (id) => dispatch(setStudyId(id)),
    updatePatientSuccess: (patientId, patientCategoryId, payload) => dispatch(updatePatientSuccess(patientId, patientCategoryId, payload)),
    fetchSources: () => dispatch(fetchSources()),
    fetchStudyTextNewStats: (studyId, campaignId, sourceId) => dispatch(fetchStudyTextNewStats(studyId, campaignId, sourceId)),
    toastrActions: bindActionCreators(toastrActions, dispatch),
    clientOpenedStudyPage: (studyId) => dispatch(clientOpenedStudyPage(studyId)),
    clientClosedStudyPage: (studyId) => dispatch(clientClosedStudyPage(studyId)),
    textStatsFetched: (payload) => dispatch(textStatsFetched(payload)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(StudyPage);

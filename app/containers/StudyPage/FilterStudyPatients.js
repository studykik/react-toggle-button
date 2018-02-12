/**
 * Created by mike on 9/19/16.
 */

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { Debounce } from 'react-throttle';
import Button from 'react-bootstrap/lib/Button';
import Input from '../../components/Input/index';
import ReactSelect from '../../components/Input/ReactSelect';
import StudyActionButtons from './StudyActionButtons';

import { fetchPatients, fetchPatientCategoriesTotals } from './actions';

@reduxForm({ form: 'filterStudyPatients' })
class FilterStudyPatientsForm extends Component {

  static propTypes = {
    campaignOptions: PropTypes.array.isRequired,
    sourceOptions: PropTypes.array.isRequired,
    fetchPatients: PropTypes.func.isRequired,
    fetchPatientCategoriesTotals: PropTypes.func.isRequired,
    fetchStudy: PropTypes.func.isRequired,
    fetchStudyStats: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    campaign: PropTypes.number,
    search: PropTypes.string,
    source: PropTypes.any,
    studyId: PropTypes.number.isRequired,
    ePMS: PropTypes.bool,
    studyName: PropTypes.string,
  };
  static defaultProps = {
    submitting: false,
    loading: false,
  };
  constructor(props) {
    super(props);
    this.searchPatient = this.searchPatient.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.state = {
      campaign: null,
    };
  }

  componentWillMount() {
  }

  onSubmit(event) {
    event.preventDefault();
    const { fetchPatients, studyId, campaign, source, search } = this.props;
    let newCampaign = campaign;
    let newSource = source;
    if (campaign === -1) {
      newCampaign = null;
    }
    if (source === -1) {
      newSource = null;
    }
    fetchPatients(studyId, search, newCampaign, newSource, null);
  }

  searchPatient(event, type) {
    const { fetchPatients, fetchPatientCategoriesTotals, fetchStudyStats, studyId, campaign, source, search } = this.props;
    let newCampaign = campaign;
    let newSource = source;
    /* nulling the values if all is selected */
    if (campaign === -1) {
      newCampaign = null;
    }
    if (source === -1) {
      newSource = null;
    }
    if (type === 'search') {
      fetchPatients(studyId, event.target.value, newCampaign, newSource, null);
    } else if (type === 'source') {
      /* -1 means all was selected */
      if (event === -1) {
        fetchPatients(studyId, search, newCampaign, null, null);
        fetchStudyStats(studyId, newCampaign, null);
        fetchPatientCategoriesTotals(studyId, newCampaign, null);
      } else {
        fetchPatients(studyId, search, newCampaign, event, null);
        fetchStudyStats(studyId, newCampaign, event);
        fetchPatientCategoriesTotals(studyId, newCampaign, event);
      }
    } else {
      /* -1 means all was selected */
      this.setState({
        campaign: event,
      });
      if (event === -1) {
        fetchPatients(studyId, search, null, newSource, null);
        fetchStudyStats(studyId, null, newSource);
        fetchPatientCategoriesTotals(studyId, null, newSource);
      } else {
        fetchPatients(studyId, search, event, newSource, null);
        fetchStudyStats(studyId, event, newSource);
        fetchPatientCategoriesTotals(studyId, event, newSource);
      }
    }
  }

  render() {
    const {
      campaignOptions,
      sourceOptions,
      submitting,
      loading,
      studyId,
      search,
      campaign,
      source,
      ePMS,
      studyName,
    } = this.props;
    /* changing the source for display purposes only */
    return (
      <form className="form-search clearfix" onSubmit={this.onSubmit}>
        <StudyActionButtons
          studyId={studyId}
          search={search}
          campaign={campaign}
          source={source}
          ePMS={ePMS}
          studyName={studyName}
        />
        <div className="fields-holder">
          <div className="search-area pull-left no-left-padding">
            <div className="field">
              <Button
                className="btn-enter"
                onClick={this.onSubmit}
                type="submit"
              >
                <i className="icomoon-icon_search2" />
              </Button>
              <Debounce time="200" handler="onChange">
                <Field
                  component={Input}
                  type="text"
                  name="search"
                  id="search"
                  className="keyword-search"
                  placeholder="Search"
                />
              </Debounce>
            </div>
          </div>
          <div className="custom-select pull-left">
            <Field
              name="campaign"
              component={ReactSelect}
              className="field"
              options={campaignOptions}
              disabled={submitting || loading}
              placeholder="Select Campaign"
              onChange={(event) => this.searchPatient(event, 'campaign')}
            />
          </div>
          <div className="custom-select pull-left no-right-padding">
            <Field
              name="source"
              component={ReactSelect}
              className="field"
              options={sourceOptions}
              disabled={submitting || loading}
              placeholder="Select Source"
              onChange={event => this.searchPatient(event, 'source')}
            />
          </div>
        </div>

      </form>
    );
  }
}
const selector = formValueSelector('filterStudyPatients');

const mapStateToProps = (state) => ({
  campaign: selector(state, 'campaign'),
  source: selector(state, 'source'),
  search: selector(state, 'search'),
  studyId: state.studyPage.studyId,
});

function mapDispatchToProps(dispatch) {
  return {
    fetchPatients: (studyId, text, campaignId, sourceId, skip) => dispatch(fetchPatients(studyId, text, campaignId, sourceId, skip)),
    fetchPatientCategoriesTotals: (studyId, campaignId, sourceId) => dispatch(fetchPatientCategoriesTotals(studyId, campaignId, sourceId)),
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(FilterStudyPatientsForm);


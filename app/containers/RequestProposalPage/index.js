/*
 *
 * RequestProposalPage
 *
 */

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { StickyContainer, Sticky } from 'react-sticky';
import Helmet from 'react-helmet';
import { ComingSoon } from '../../components/ComingSoon';
import RequestProposalForm from '../../components/RequestProposalForm';
import RequestProposalCart from '../../components/RequestProposalCart';


import {
  fetchSites,
  fetchIndications,
  fetchLevels,
} from '../../containers/App/actions';
import {
  selectSiteLocations,
  selectIndications,
  selectStudyLevels,
  selectUserRoleType,
} from '../../containers/App/selectors';

import { submitForm, fetchProposal } from '../../containers/RequestProposalPage/actions';
import { selectProposalDetail, selectProposalsFormError, selectProposalsFormValues } from './selectors';

export class RequestProposalPage extends Component {
  static propTypes = {
    siteLocations: PropTypes.array,
    indications: PropTypes.array,
    studyLevels: PropTypes.array,
    proposalDetail: PropTypes.object,
    params: PropTypes.object,
    fetchSites: PropTypes.func,
    fetchIndications: PropTypes.func,
    fetchLevels: PropTypes.func,
    fetchProposal: PropTypes.func,
    onSubmitForm: PropTypes.func.isRequired,
    location: PropTypes.any,
    hasErrors: PropTypes.bool,
    formValues: PropTypes.object,
    userRoleType: PropTypes.string,
  }

  constructor(props) {
    super(props);
    this.submitClick = this.submitClick.bind(this);

    if (!isNaN(props.params.id)) {
      this.props.fetchProposal(props.params.id);
    }
  }

  componentDidMount() {
    this.props.fetchSites();
    this.props.fetchIndications();
    this.props.fetchLevels();
  }

  submitClick() {
    this.props.onSubmitForm(this.props.formValues);
  }

  render() {
    const { siteLocations, indications, studyLevels, proposalDetail, userRoleType } = this.props;

    return (
      <div>
        { userRoleType === 'client' &&
          <StickyContainer className="container-fluid">
            <Helmet title="Request Proposal - StudyKIK" />
            <section className="study-portal">

              <h2 className="main-heading">REQUEST PROPOSAL</h2>

              <div className="row form-study">

                <div className="col-xs-6 form-holder">
                  <RequestProposalForm
                    siteLocations={siteLocations}
                    indications={indications}
                    studyLevels={studyLevels}
                    initialValues={proposalDetail}
                    formValues={this.props.formValues}
                  />
                </div>

                <div className="fixed-block">
                  <div className="fixed-block-holder">
                    <div className="order-summery-container">
                      <Sticky className="sticky-shopping-cart">
                        {/* this will be replaced with a new shopping cart component */}
                        <RequestProposalCart onSubmit={this.onSubmitForm} />
                      </Sticky>
                    </div>
                  </div>
                </div>

              </div>
            </section>
          </StickyContainer>
        }
        {
          userRoleType === 'sponsor' &&
            <div>
              <Helmet title="Request Proposal - StudyKIK" />
              <ComingSoon />
            </div>
        }
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  siteLocations : selectSiteLocations(),
  indications   : selectIndications(),
  studyLevels   : selectStudyLevels(),
  proposalDetail: selectProposalDetail(),
  hasErrors: selectProposalsFormError(),
  formValues: selectProposalsFormValues(),
  userRoleType: selectUserRoleType(),
});

function mapDispatchToProps(dispatch) {
  return {
    fetchSites:       () => dispatch(fetchSites()),
    fetchIndications: () => dispatch(fetchIndications()),
    fetchLevels:      () => dispatch(fetchLevels()),
    fetchProposal:    (id) => dispatch(fetchProposal(id)),
    onSubmitForm:     (values) => dispatch(submitForm(values)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RequestProposalPage);

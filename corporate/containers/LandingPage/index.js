/* eslint-disable react/prefer-stateless-function */

import { browserHistory } from 'react-router';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Helmet from 'react-helmet';
import _ from 'lodash';

import LandingForm from '../../components/LandingForm';
import LandingArticle from '../../components/LandingArticle';
import { normalizePhone } from '../../../app/common/helper/functions';

import {
  selectCurrentUser,
  selectLanding,
  selectLandingIsFetching,
  selectLandingError,
  selectSubscribedFromLanding,
  selectSubscriptionError,
} from '../../../app/containers/App/selectors';
import { fetchLanding, subscribeFromLanding, clearLanding } from '../../../app/containers/App/actions';

import './styles.less';

export class LandingPage extends React.Component {

  static propTypes = {
    params: PropTypes.object,
    param: PropTypes.any,
    siteLocation: PropTypes.any,
    fetchLanding:  PropTypes.func.isRequired,
    subscribeFromLanding:  PropTypes.func.isRequired,
    subscribedFromLanding:  PropTypes.object,
    subscriptionError:  PropTypes.object,
    landingError:  PropTypes.object,
    landingIsFetching:  PropTypes.bool,
    clearLanding:  PropTypes.func.isRequired,
    currentUser: PropTypes.any,
    location: PropTypes.any,
    landing: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.onSubmitForm = this.onSubmitForm.bind(this);

    this.state = {
      invalidStudy: null,
      study: null,
    };
  }

  componentWillMount() {
    const { splat } = this.props.params;
    if (!isNaN(parseInt(splat))) {
      this.props.fetchLanding(splat);
    } else {
      this.props.clearLanding();
      browserHistory.push('/');
    }
  }

  componentWillReceiveProps(newProps) {
    const { subscribedFromLanding } = newProps;
    const { siteLocation } = newProps.params;
    let invalidSite = false;

    if (newProps.landing) {
      const { landing } = newProps;
      if (!landing.studySources.length) {
        this.props.clearLanding();
        browserHistory.push('/');
      }

      let urlPart = null;
      _.forEach(landing.studySources, (item) => {
        if (item.landingPage) {
          urlPart = item.landingPage.url;
        }
      });

      if (urlPart.toLowerCase().replace(/ /ig, '-') !== siteLocation) {
        invalidSite = true;
      }
    }

    if (invalidSite) {
      this.props.clearLanding();
      browserHistory.push('/');
    }

    if (subscribedFromLanding) {
      browserHistory.push('/thankyou-page');
    }
  }

  onSubmitForm(params) {
    const landing = this.props.landing;
    const separateNames = params.name.split(' ');

    const data = {
      firstName: separateNames[0],
      lastName: separateNames[1] || null,
      email: params.email,
      phone: normalizePhone(params.phone),
      landing_page_id: landing.id,
    };

    this.props.subscribeFromLanding(data);
  }

  render() {
    const { subscriptionError, landingIsFetching, location } = this.props;

    let landing = null;
    let study = null;
    if (this.props.landing) {
      study = this.props.landing;

      for (const studySource of study.studySources) {
        if (studySource.landingPage) {
          landing = studySource.landingPage;
        }
      }
    }

    if (landingIsFetching || landing === null) {
      return (
        <div id="main">
          <div className="container">
            <p className="invisible"></p>
          </div>
        </div>
      );
    }

    return (
      <div id="main">
        <Helmet
          meta={[
            {
              name: 'og:description',
              content: study.name,
            },
            {
              name: 'twitter:description',
              content: 'StudyKIK',
            },
          ]}
        />
        <div className="container">
          <LandingForm study={study} landing={landing} onSubmit={this.onSubmitForm} subscriptionError={subscriptionError} />
          <LandingArticle study={study} landing={landing} location={location} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser(),
  subscribedFromLanding: selectSubscribedFromLanding(),
  landingIsFetching: selectLandingIsFetching(),
  landingError: selectLandingError(),
  subscriptionError: selectSubscriptionError(),
  landing: selectLanding(),
});

function mapDispatchToProps(dispatch) {
  return {
    fetchLanding: (studyId) => dispatch(fetchLanding(studyId)),
    subscribeFromLanding: (params) => dispatch(subscribeFromLanding(params)),
    clearLanding: () => dispatch(clearLanding()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LandingPage);

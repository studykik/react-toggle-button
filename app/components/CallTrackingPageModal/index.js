/**
 * Created by Younes on 13/07/16.
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import Form from 'react-bootstrap/lib/Form';
import { createStructuredSelector } from 'reselect';
import { Field, reduxForm, change, FieldArray, touch } from 'redux-form';
import Collapse from 'react-bootstrap/lib/Collapse';
import Button from 'react-bootstrap/lib/Button';

import Toggle from '../../components/Input/Toggle';
import LoadingSpinner from '../LoadingSpinner';
import { selectValues, selectSyncErrorBool, selectFormFieldNames } from '../../common/selectors/form.selector';
import { selectStudyLeadSources, selectMessagingNumbers } from '../../containers/HomePage/AdminDashboard/selectors';
import { fetchStudyLeadSources } from '../../containers/App/actions';
import RenderLeads from '../../components/RenderLeads';
import formValidator from './validator';
import { fetchMessagingNumbersDashboard, editStudyLeadSources } from '../../containers/HomePage/AdminDashboard/actions';

const formName = 'callTrackingPageForm';

@reduxForm({
  form: formName,
  validate: formValidator,
})
@connect(mapStateToProps, mapDispatchToProps)

export class CallTrackingPageModal extends React.Component {
  static propTypes = {
    study: PropTypes.object,
    studyLeadSources: PropTypes.object,
    fetchStudyLeadSources: PropTypes.func,
    formValues: PropTypes.object,
    onClose: PropTypes.func.isRequired,
    openModal: PropTypes.bool.isRequired,
    change: PropTypes.func.isRequired,
    callTrackingFormError: PropTypes.bool,
    touchCallTracking: PropTypes.func,
    fetchMessagingNumbersDashboard: PropTypes.func.isRequired,
    callTrackingFields: PropTypes.array,
    messagingNumbers: PropTypes.object,
    editStudyLeadSources: PropTypes.func,
    isOnTop: PropTypes.bool,
    array: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.state = {
      isLeadSourcesFetched: false,
      isNumbersFetched: false,
    };

    this.submitCallTrackingForm = this.submitCallTrackingForm.bind(this);
    this.onClose = this.onClose.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.openModal && !this.props.openModal && this.props.study.study_id) {
      this.props.fetchMessagingNumbersDashboard();
      this.props.fetchStudyLeadSources(this.props.study.study_id, [1]);
      this.props.change('callTracking', this.props.study.callTracking);
    }

    if (this.props.studyLeadSources.fetching && !newProps.studyLeadSources.fetching) {
      this.setState({ isLeadSourcesFetched: true });

      if (newProps.studyLeadSources.details.length > 0) {
        this.props.array.removeAll('leadSource');
        newProps.studyLeadSources.details.map((newItem) => this.props.array.push('leadSource', newItem));
      } else {
        this.props.change('leadSource', [{ source: null }]);
      }
    }

    if (this.props.messagingNumbers.fetching && !newProps.messagingNumbers.fetching) {
      this.setState({ isNumbersFetched: true });
    }
  }

  onClose() {
    const { onClose } = this.props;
    onClose();
  }

  submitCallTrackingForm(e) {
    const { callTrackingFormError, touchCallTracking, callTrackingFields, study, formValues } = this.props;
    e.preventDefault();

    if (callTrackingFormError) {
      touchCallTracking(callTrackingFields);
      return;
    }

    // transform the Google URL submission to append http:// in front of it in case it isn't specified
    if (formValues.leadSource && formValues.leadSource.length > 0) {
      for (const leadSource of formValues.leadSource) {
        if (leadSource.googleUrl && !/http(s)?:\/\//g.test(leadSource.googleUrl)) {
          leadSource.googleUrl = `http://${leadSource.googleUrl}`;
        }
      }
    }

    this.props.editStudyLeadSources(study.study_id, formValues.leadSource, formValues.callTracking);
  }

  render() {
    const { openModal, messagingNumbers, study } = this.props;
    const landingPageUrl = study ? study.landingPageUrl : '';
    const studyId = study ? study.study_id : null;

    return (
      <Collapse
        dimension="width"
        in={openModal}
        timeout={250}
        className={classNames('landing-slider', (this.props.isOnTop > 0 ? 'slider-on-top' : ''))}
      >
        <div>
          <div className="slider-area">
            <div className="head">
              <div className="inner-head">
                <strong className="title">Media Tracking</strong>
                <a className="btn-right-arrow" onClick={this.onClose}><i className="glyphicon glyphicon-menu-right" /></a>
              </div>
            </div>
            <Form
              className="holder landing-holder"
              onSubmit={this.submitCallTrackingForm}
              noValidate="novalidate"
            >
              <div className="frame">
                <div className="field-row">
                  <strong className="label">
                    <label>MEDIA TRACKING</label>
                  </strong>
                  <div className="field">
                    <Field
                      name="callTracking"
                      component={Toggle}
                    />
                  </div>
                </div>
                <div className="field-row">
                  <FieldArray
                    name="leadSource"
                    component={RenderLeads}
                    formValues={this.props.formValues}
                    isAdmin messagingNumbers={messagingNumbers}
                    initialLeadSources={this.props.studyLeadSources.details}
                    landingPageUrl={landingPageUrl}
                    studyId={studyId}
                  />
                </div>
                <div className="field-row text-right">
                  <Button type="submit" bsStyle="primary" className="fixed-small-btn">
                    {false
                      ? <span><LoadingSpinner showOnlyIcon size={20} className="saving-user" /></span>
                      : <span>Update</span>
                    }
                  </Button>
                </div>
              </div>
            </Form>
          </div>
        </div>
      </Collapse>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  studyLeadSources: selectStudyLeadSources(),
  formValues: selectValues(formName),
  callTrackingFormError: selectSyncErrorBool(formName),
  callTrackingFields: selectFormFieldNames(formName),
  messagingNumbers: selectMessagingNumbers(),
});
function mapDispatchToProps(dispatch) {
  return {
    change: (name, value) => dispatch(change(formName, name, value)),
    fetchStudyLeadSources: (studyId, excludeSourceIds) => dispatch(fetchStudyLeadSources(studyId, excludeSourceIds)),
    touchCallTracking: (fields) => dispatch(touch(formName, ...fields)),
    fetchMessagingNumbersDashboard: () => dispatch(fetchMessagingNumbersDashboard()),
    editStudyLeadSources: (studyId, leadSources, callTracking) => dispatch(editStudyLeadSources(studyId, leadSources, callTracking)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CallTrackingPageModal);
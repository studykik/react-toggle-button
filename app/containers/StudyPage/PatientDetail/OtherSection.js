/**
 * Created by mike on 10/18/16.
 */

import React from 'react';
import { connect } from 'react-redux';
import Button from 'react-bootstrap/lib/Button';
import Form from 'react-bootstrap/lib/Form';
import FormControl from 'react-bootstrap/lib/FormControl';
import Overlay from 'react-bootstrap/lib/Overlay';
import { reset, Field, reduxForm } from 'redux-form';
import classNames from 'classnames';
import moment from 'moment-timezone';
import { createStructuredSelector } from 'reselect';

import ReactSelect from '../../../components/Input/ReactSelect';
import Input from '../../../components/Input/index';
import { fetchIndications } from '../../App/actions';
import { selectIndications } from '../../App/selectors';
import { selectValues, selectSyncErrors, selectFormDidChange } from '../../../common/selectors/form.selector';
import { addPatientIndication, removePatientIndication, submitPatientUpdate, deletePatient, generateReferral, downloadReferral } from '../actions'; import {
  selectSocket,
} from '../../../containers/GlobalNotifications/selectors';
import { selectStudy, selectDeletePatientProcess } from '../selectors';
import IndicationOverlay from './IndicationOverlay';
import formValidator from './otherValidator';
import DateOfBirthPicker from '../../../components/DateOfBirthPicker/index';

const formName = 'PatientDetailModal.Other';

@reduxForm({
  form: formName,
  validate: formValidator,
  enableReinitialize: true,
})
class OtherSection extends React.Component {
  static propTypes = {
    params: React.PropTypes.object,
    active: React.PropTypes.bool.isRequired,
    change: React.PropTypes.func.isRequired,
    site: React.PropTypes.object,
    fetchIndications: React.PropTypes.func.isRequired,
    formSyncErrors: React.PropTypes.object,
    formValues: React.PropTypes.object,
    formDidChange: React.PropTypes.bool,
    indications: React.PropTypes.array,
    initialValues: React.PropTypes.object,
    loading: React.PropTypes.bool,
    submitting: React.PropTypes.bool,
    reset: React.PropTypes.func,
    addPatientIndication: React.PropTypes.func.isRequired,
    removePatientIndication: React.PropTypes.func.isRequired,
    submitPatientUpdate: React.PropTypes.func.isRequired,
    currentStudy: React.PropTypes.object,
    deletePatient: React.PropTypes.func,
    generateReferral: React.PropTypes.func,
    downloadReferral: React.PropTypes.func,
    deletePatientProcess: React.PropTypes.object,
    socket: React.PropTypes.any,
  };

  constructor(props) {
    super(props);
    this.state = {
      showIndicationPopover: false,
      socketBinded: false,
    };
    this.onReset = this.onReset.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.addIndication = this.addIndication.bind(this);
    this.deleteIndication = this.deleteIndication.bind(this);
    this.toggleIndicationPopover = this.toggleIndicationPopover.bind(this);
    this.renderGender = this.renderGender.bind(this);
    this.renderIndications = this.renderIndications.bind(this);
    this.downloadReferral = this.downloadReferral.bind(this);
  }

  componentWillMount() {
    this.props.fetchIndications();
  }

  componentWillReceiveProps() {
    const { params, socket, downloadReferral } = this.props;
    if (socket && this.state.socketBinded === false) {
      this.setState({ socketBinded: true }, () => {
        socket.on('notifyPatientReferralReady', (data) => {
          if (data.studyId && parseInt(params.id) === data.studyId) {
            downloadReferral(data.reportName, data.studyId);
          }
        });
      });
    }
  }

  onReset() {
    const { reset } = this.props;
    reset();
  }

  onSubmit(event) {
    event.preventDefault();
    const { formSyncErrors, initialValues, formValues, reset, submitPatientUpdate } = this.props;
    if (!formSyncErrors.gender && !formSyncErrors.bmi) {
      const data = {
        gender: null,
        bmi: null,
      };
      if (formValues.gender) {
        data.gender = formValues.gender;
      }
      if (formValues.bmi) {
        data.bmi = parseFloat(formValues.bmi);
      }
      if (formValues.dobDay && formValues.dobMonth && formValues.dobYear) {
        const date = moment().year(formValues.dobYear).month(formValues.dobMonth - 1).date(formValues.dobDay).startOf('day');
        data.dob = date.toISOString();
      }
      submitPatientUpdate(initialValues.id, initialValues.patientCategoryId, data);
      reset(formName);
    }
  }

  addIndication(patientId, indication) {
    const { initialValues, addPatientIndication } = this.props;
    addPatientIndication(initialValues.id, initialValues.patientCategoryId, indication);
  }

  deleteIndication(indication) {
    const { initialValues, removePatientIndication } = this.props;
    removePatientIndication(initialValues.id, initialValues.patientCategoryId, indication.id);
  }

  toggleIndicationPopover() {
    this.setState({
      showIndicationPopover: !this.state.showIndicationPopover,
    });
  }

  downloadReferral() {
    const { formValues, params } = this.props;
    this.props.generateReferral(formValues.id, parseInt(params.id));
  }

  renderGender() {
    const { loading, submitting } = this.props;
    const genderOptions = [{
      label: 'N/A',
      value: 'N/A',
    }, {
      label: 'Male',
      value: 'Male',
    }, {
      label: 'Female',
      value: 'Female',
    }];
    return (
      <div className="field-row">
        <strong className="label">
          <label htmlFor="patient-gender">Gender</label>
        </strong>
        <div className="field patient-gender">
          <Field
            name="gender"
            component={ReactSelect}
            options={genderOptions}
            disabled={submitting || loading}
            placeholder="Select Gender"
          />
        </div>
      </div>
    );
  }

  renderIndications() {
    const { initialValues } = this.props;
    if (initialValues.patientIndications) {
      return (
        <div className="category-list">
          {initialValues.patientIndications.map(pi => (
            <div key={pi.indication.id} className="category">
              <span className="link">
                <span className="text">{pi.indication.name}</span>
                { !pi.isOriginal &&
                  <span
                    className="icomoon-icon_trash"
                    onClick={() => {
                      this.deleteIndication(pi.indication);
                    }}
                  />
                }
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  }

  renderUpdateButtons() {
    const { formDidChange, loading, submitting } = this.props;
    if (formDidChange) {
      return (
        <div className="pull-right study-page-update-patient-bttns-container">
          <button className="btn btn-gray-outline" onClick={this.onReset}>Cancel</button>
          <Button type="submit" disabled={submitting || loading}>Update</Button>
        </div>
      );
    }
    return null;
  }

  render() {
    const { active, formValues: { dobDay, dobMonth, dobYear }, indications, initialValues, loading, submitting } = this.props;

    if (initialValues) {
      const overlayValues = { ...initialValues };

      if (initialValues.patientIndications) {
        overlayValues.indications = initialValues.patientIndications.map(pi => pi.indication);
      }

      return (
        <div className={classNames('item others', { active })}>
          <div className="item-holder">
            <Form className="sub-holder form-lightbox" onSubmit={this.onSubmit}>
              <strong className="title">TAGS</strong>
              <div className="field-row">
                <strong className="label">Indications</strong>
                <div
                  className="field add-indications"
                  ref={(parent) => (
                    this.parent = parent
                  )}
                >
                  <Button
                    bsStyle="primary"
                    ref={(target) => (
                      this.target = target
                    )}
                    onClick={this.toggleIndicationPopover}
                  >
                    + Add Indication
                  </Button>
                  <Overlay
                    show={this.state.showIndicationPopover}
                    placement="bottom"
                    container={this.parent}
                    target={() => this.target}
                    rootClose
                    onHide={() => { this.toggleIndicationPopover(); }}
                  >
                    <IndicationOverlay indications={indications} selectIndication={this.addIndication} patient={overlayValues} onClose={this.toggleIndicationPopover} />
                  </Overlay>
                </div>
              </div>
              <div className="field-row remove-indication">
                <span className="label" />
                <div className="field">
                  {this.renderIndications()}
                </div>
              </div>
              <div className="fields-holder">
                <strong className="title">OTHER INFORMATION</strong>
                <DateOfBirthPicker
                  loading={loading}
                  submitting={submitting}
                  dobDay={dobDay}
                  dobMonth={dobMonth}
                  dobYear={dobYear}
                />
                {this.renderGender()}
                <div className="field-row">
                  <strong className="label">
                    <label htmlFor="patient-bmi">BMI</label>
                  </strong>
                  <div className="field">
                    <Field
                      type="text"
                      name="bmi"
                      component={Input}
                    />
                  </div>
                </div>
                <div className="field-row">
                  <strong className="label">
                    <label htmlFor="patient-source5">Source</label>
                  </strong>
                  <div className="field">
                    <FormControl disabled="true" type="text" value={initialValues.source ? initialValues.source.type : ''} />
                  </div>
                </div>
                <div className="field-row">
                  <strong className="label">
                    <label htmlFor="patient-source5">PATIENT REFERRAL</label>
                  </strong>
                  <button
                    type="button"
                    className="btn btn-primary btn-default-padding"
                    onClick={this.downloadReferral}
                  >
                    <i className="icomoon-icon_download" />
                    &nbsp;Download
                  </button>
                </div>
                {
                  this.props.currentStudy.canDeletePatient &&
                  <div className="field-row">
                    <strong className="label">
                      <label htmlFor="patient-source5">DELETE PATIENT</label>
                    </strong>
                    <button
                      type="button"
                      className="btn btn-primary btn-default-padding"
                      onClick={() => { this.props.deletePatient(this.props.initialValues.id); }}
                      disabled={this.props.deletePatientProcess.isDeleting}
                    >
                      DELETE
                    </button>
                  </div>
                }
              </div>
              {this.renderUpdateButtons()}
            </Form>
          </div>
        </div>
      );
    }
    return null;
  }
}

const mapStateToProps = createStructuredSelector({
  formSyncErrors: selectSyncErrors(formName),
  formValues: selectValues(formName),
  formDidChange: selectFormDidChange(formName),
  indications: selectIndications(),
  currentStudy: selectStudy(),
  deletePatientProcess: selectDeletePatientProcess(),
  socket: selectSocket(),
});

const mapDispatchToProps = (dispatch) => ({
  fetchIndications: () => dispatch(fetchIndications()),
  reset: () => dispatch(reset(formName)),
  addPatientIndication: (patientId, patientCategoryId, indication) => dispatch(addPatientIndication(patientId, patientCategoryId, indication)),
  removePatientIndication: (patientId, patientCategoryId, indicationId) => dispatch(removePatientIndication(patientId, patientCategoryId, indicationId)),
  submitPatientUpdate: (patientId, patientCategoryId, fields) => dispatch(submitPatientUpdate(patientId, patientCategoryId, fields)),
  deletePatient: (id) => dispatch(deletePatient(id)),
  generateReferral: (patientId, studyId) => dispatch(generateReferral(patientId, studyId)),
  downloadReferral: (reportName, studyId) => dispatch(downloadReferral(reportName, studyId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(OtherSection);

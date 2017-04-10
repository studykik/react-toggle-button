/**
 * Created by mike on 10/9/16.
 */

import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { blur, Field, reduxForm, reset, touch } from 'redux-form';
import { createStructuredSelector } from 'reselect';

import Button from 'react-bootstrap/lib/Button';
import Modal from 'react-bootstrap/lib/Modal';
import Form from 'react-bootstrap/lib/Form';

import { selectSyncErrorBool, selectValues } from '../../../common/selectors/form.selector';
import { normalizePhoneForServer, normalizePhoneDisplay } from '../../../common/helper/functions';
import { selectSources, selectStudiesFromSites, selectCurrentUserClientId, selectProtocols } from '../../App/selectors';
import Input from '../../../components/Input/index';
import ReactSelect from '../../../components/Input/ReactSelect';
import CenteredModal from '../../../components/CenteredModal/index';
import sanitizeProps from '../../../utils/sanitizeProps';
import { submitAddPatient } from '../actions';
import { selectAddPatientStatus } from '../selectors';
import formValidator, { fields } from './validator';

const formName = 'addPatient';

const mapStateToProps = createStructuredSelector({
  clientId: selectCurrentUserClientId(),
  addPatientStatus: selectAddPatientStatus(),
  formError: selectSyncErrorBool(formName),
  newPatient: selectValues(formName),
  protocols: selectProtocols(),
  sources: selectSources(),
  studies: selectStudiesFromSites(),
});

const mapDispatchToProps = (dispatch) => ({
  blur: (field, value) => dispatch(blur(formName, field, value)),
  resetForm: () => dispatch(reset(formName)),
  submitAddPatient: (patient, onClose) => dispatch(submitAddPatient(patient, onClose)),
  touchFields: () => dispatch(touch(formName, ...fields)),
});

@reduxForm({ form: formName, validate: formValidator })
@connect(mapStateToProps, mapDispatchToProps)
export default class AddPatient extends React.Component {
  static propTypes = {
    clientId: React.PropTypes.number,
    addPatientStatus: React.PropTypes.object,
    blur: React.PropTypes.func.isRequired,
    formError: React.PropTypes.bool.isRequired,
    newPatient: React.PropTypes.object,
    onClose: React.PropTypes.func.isRequired,
    onHide: React.PropTypes.func.isRequired,
    show: React.PropTypes.bool.isRequired,
    sources: React.PropTypes.array.isRequired,
    submitAddPatient: React.PropTypes.func.isRequired,
    resetForm: React.PropTypes.func.isRequired,
    touchFields: React.PropTypes.func.isRequired,
    protocols: React.PropTypes.object,
    studies: React.PropTypes.array,
  };
  constructor(props) {
    super(props);
    this.onClose = this.onClose.bind(this);
    this.onHide = this.onHide.bind(this);
    this.onPhoneBlur = this.onPhoneBlur.bind(this);
    this.addPatient = this.addPatient.bind(this);
  }

  onClose() {
    const { onClose, resetForm } = this.props;
    resetForm();
    onClose();
  }

  onHide() {
    const { onHide, resetForm } = this.props;
    resetForm();
    onHide();
  }

  onPhoneBlur(event) {
    const { blur } = this.props;
    const formattedPhoneNumber = normalizePhoneDisplay(event.target.value);
    blur('phone', formattedPhoneNumber);
  }

  addPatient(event) {
    event.preventDefault();
    const { clientId, formError, newPatient, studies, submitAddPatient, touchFields } = this.props;

    if (formError) {
      touchFields();
      return;
    }

    const patient = Object.assign({}, newPatient);
    patient.client_id = clientId;
    /* normalizing the phone number */
    patient.phone = normalizePhoneForServer(newPatient.phone);
    if (newPatient.protocol) {
      const study = _.find(studies, { protocol_id: newPatient.protocol });
      patient.study_id = study.id;
    }
    delete patient.protocol;
    if (newPatient.source) {
      patient.source_id = newPatient.source;
    }
    delete patient.source;
    submitAddPatient(patient, this.onClose);
  }

  render() {
    const { addPatientStatus, protocols, sources, studies, ...props } = this.props;
    const sourceOptions = sources.map(source => ({
      label: source.type,
      value: source.id,
    }));
    const sanitizedProps = sanitizeProps(props);
    delete sanitizedProps.formError;
    delete sanitizedProps.onClose;
    delete sanitizedProps.newPatient;
    delete sanitizedProps.resetForm;
    delete sanitizedProps.submitAddPatient;
    delete sanitizedProps.touchFields;

    const protocolOptions = studies.map(studyIterator => {
      const protocol = _.find(protocols.details, { id: studyIterator.protocol_id });
      return {
        label: protocol.number,
        value: protocol.id,
      };
    });
    return (
      <Modal
        {...sanitizedProps}
        id="add-patient-info-import"
        dialogComponentClass={CenteredModal}
        onHide={this.onHide}
        backdrop
        keyboard
      >
        <Modal.Header>
          <Modal.Title>
            <strong>Add Patient</strong>
          </Modal.Title>
          <a className="close" onClick={this.onHide}>
            <i className="icomoon-icon_close" />
          </a>
        </Modal.Header>
        <Modal.Body>
          <div className="scroll-holder jcf--scrollable">
            <Form className="form-lightbox" onSubmit={this.addPatient} noValidate="novalidate">
              <div className="field-row">
                <strong className="label required">
                  <label htmlFor="import-patient-first-name">Patient Name</label></strong>
                <div className="field">
                  <div className="row">
                    <Field
                      name="firstName"
                      component={Input}
                      type="text"
                      placeholder="First Name"
                      className="col pull-left"
                      id="import-patient-first-name"
                      required
                    />
                    <Field
                      name="lastName"
                      component={Input}
                      type="text"
                      placeholder="Last Name"
                      className="col pull-left"
                      id="import-patient-last-name"
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="field-row">
                <strong className="label required">
                  <label htmlFor="import-patient-email"> Patient Email </label>
                </strong>
                <Field
                  name="email"
                  component={Input}
                  type="text"
                  className="field"
                  id="import-patient-email"
                  required
                />
              </div>
              <div className="field-row">
                <strong className="label required">
                  <label htmlFor="import-patient-phone"> Patient Phone </label>
                </strong>
                <Field
                  name="phone"
                  component={Input}
                  type="tel"
                  className="field"
                  id="import-patient-phone"
                  required
                  onBlur={this.onPhoneBlur}
                />
              </div>
              <div className="field-row form-group">
                <strong className="label">
                  <label>Protocol</label>
                </strong>
                <Field
                  name="protocol"
                  component={ReactSelect}
                  className="field"
                  placeholder="Select Protocol"
                  options={protocolOptions}
                />
              </div>
              <div className="field-row">
                <strong className="label">
                  <label>Source</label>
                </strong>
                <Field
                  name="source"
                  component={ReactSelect}
                  className="field"
                  placeholder="Select Source"
                  options={sourceOptions}
                />
              </div>
              <div className="text-right">
                <Button type="submit" disabled={addPatientStatus.adding}>Submit</Button>
              </div>
            </Form>
          </div>
        </Modal.Body>
      </Modal>
    );
  }
}

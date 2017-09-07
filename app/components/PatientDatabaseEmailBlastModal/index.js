/**
 * Created by mike on 10/6/16.
 */

import React from 'react';
import { connect } from 'react-redux';
import { change, Field, reduxForm } from 'redux-form';
import { createStructuredSelector } from 'reselect';
import _ from 'lodash';
import classNames from 'classnames';
import { toastr } from 'react-redux-toastr';
import Form from 'react-bootstrap/lib/Form';
import FormControl from 'react-bootstrap/lib/FormControl';
import Modal from 'react-bootstrap/lib/Modal';
import formValidator from './validator';
import CenteredModal from '../CenteredModal/index';
import Input from '../Input/index';
import { submitEmailBlast } from '../../containers/PatientDatabasePage/actions';
import { selectValues, selectSyncErrors } from '../../common/selectors/form.selector';
import { selectCurrentUser } from '../../containers/App/selectors';
import { selectPatients, selectTotalPatients } from '../../containers/PatientDatabasePage/selectors';

const formName = 'PatientDatabase.EmailBlastModal';

@reduxForm({
  form: formName,
  validate: formValidator,
})
class PatientDatabaseEmailBlastModal extends React.Component {
  static propTypes = {
    className: React.PropTypes.any,
    change: React.PropTypes.func.isRequired,
    currentUser: React.PropTypes.object,
    formValues: React.PropTypes.object,
    formSyncErrors: React.PropTypes.object,
    onClose: React.PropTypes.func.isRequired,
    onHide: React.PropTypes.func.isRequired,
    role: React.PropTypes.string,
    show: React.PropTypes.bool.isRequired,
    submitEmailBlast: React.PropTypes.func.isRequired,
    patients: React.PropTypes.object,
    totalPatients: React.PropTypes.number,
  };

  constructor(props) {
    super(props);
    this.submitEmailBlast = this.submitEmailBlast.bind(this);
    this.renderPatientCount = this.renderPatientCount.bind(this);
    this.onHide = this.onHide.bind(this);
    this.onClose = this.onClose.bind(this);
    this.state = {
      total: 0,
    };
  }

  componentWillReceiveProps(newProps) {
    const { formValues, patients, totalPatients } = newProps;
    let total = 0;
    if (patients.total === null) {
      total = totalPatients;
    } else if (!formValues.selectAllUncheckedManually && formValues.patients && formValues.patients.length > 0) {
      total = patients.total - ((formValues.uncheckedPatients && formValues.uncheckedPatients.length > 0) ? formValues.uncheckedPatients.length : 0);
    } else if ((formValues.patients && formValues.patients.length > 0) || (formValues.patients && formValues.patients.length === 0 && formValues.uncheckedPatients.length > 0)) {
      total = formValues.patients.length;
    }

    this.setState({ total });
  }

  onHide() {
    const { onHide } = this.props;
    onHide();
  }

  onClose() {
    const { change, onClose } = this.props;
    // clear message value after the form is submitted and is successful
    onClose();
    change('email', '');
    change('subject', '');
    change('message', '');
  }

  submitEmailBlast(event) {
    event.preventDefault();
    const { formSyncErrors, formValues, submitEmailBlast, currentUser } = this.props;
    if (_.isEmpty(formSyncErrors)) {
      submitEmailBlast(formValues.queryParams.filter, formValues.uncheckedPatients, formValues.message, formValues.email, formValues.subject, currentUser.roleForClient.id, this.onClose);
    } else if (formSyncErrors.message) {
      toastr.error('', formSyncErrors.message);
    } else if (formSyncErrors.patients) {
      toastr.error('', formSyncErrors.patients);
    } else if (formSyncErrors.email) {
      toastr.error('', formSyncErrors.email);
    } else if (formSyncErrors.subject) {
      toastr.error('', formSyncErrors.subject);
    }
  }

  renderPatientCount() {
    const { formValues } = this.props;
    if (formValues.patients && formValues.patients.length > 0) {
      return (
        <span className="emails-counter">
          <span className="counter">{this.state.total}</span>
          <span className="text"> Patients</span>
        </span>
      );
    }
    return null;
  }

  render() {
    const { show, className } = this.props;

    return (
      <Modal
        show={show}
        className={classNames('patient-database-text-blast', className)}
        id="text-blast-popup"
        dialogComponentClass={CenteredModal}
        onHide={this.onHide}
        backdrop
        keyboard
      >
        <Modal.Header>
          <Modal.Title>
            <strong className="title">Email Blast</strong>
          </Modal.Title>
          <a className="close" onClick={this.onHide}>
            <i className="icomoon-icon_close" />
          </a>
        </Modal.Header>
        <Modal.Body>
          <Form
            className="text-email-blast-form no-sidebar user-active"
            onSubmit={this.submitEmailBlast}
          >
            <div className="form-holder">
              <div className="scroll-holder">
                <div className="sub-holder">
                  <div className="subject-field">
                    <FormControl type="text" className="recievers" placeholder="To" disabled />
                    {this.renderPatientCount()}
                  </div>
                  <Field
                    name="email"
                    component={Input}
                    className="sender-field"
                    type="text"
                    placeholder="Enter your email address"
                  />
                  <Field
                    name="subject"
                    component={Input}
                    className="subject-field"
                    type="text"
                    placeholder="Subject"
                  />
                  <Field
                    name="message"
                    component={Input}
                    componentClass="textarea"
                    className="email-message"
                    placeholder="Type a message..."
                  />
                  <div className="footer">
                    <input
                      className="btn btn-default lightbox-opener pull-right"
                      value="Send"
                      type="submit"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  patients: selectPatients(),
  formValues: selectValues(formName),
  formSyncErrors: selectSyncErrors(formName),
  currentUser: selectCurrentUser(),
  totalPatients: selectTotalPatients(),
});

function mapDispatchToProps(dispatch) {
  return {
    change: (field, value) => dispatch(change(formName, field, value)),
    submitEmailBlast: (patients, uncheckedPatients, message, from, subject, clientRoleId, onClose) => dispatch(submitEmailBlast(patients, uncheckedPatients, message, from, subject, clientRoleId, onClose)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PatientDatabaseEmailBlastModal);

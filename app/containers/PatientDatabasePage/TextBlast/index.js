/**
 * Created by mike on 10/6/16.
 */

import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { createStructuredSelector } from 'reselect';
import classNames from 'classnames';
import { actions as toastrActions } from 'react-redux-toastr';
import Button from 'react-bootstrap/lib/Button';
import Form from 'react-bootstrap/lib/Form';
import FormControl from 'react-bootstrap/lib/FormControl';
import Modal from 'react-bootstrap/lib/Modal';
import formValidator from './validator';
import CenteredModal from '../../../components/CenteredModal/index';
import Input from '../../../components/Input/index';
import { removePatientsFromTextBlast, submitTextBlast } from '../actions';
import { selectValues, selectSyncErrors } from '../../../common/selectors/form.selector';
import { selectCurrentUser, selectClientCredits } from '../../App/selectors';
import { selectPatients } from '../selectors';

const formName = 'PatientDatabase.TextBlastModal';

@reduxForm({
  form: formName,
  validate: formValidator,
})
class TextBlastModal extends React.Component {
  static propTypes = {
    bsClass: React.PropTypes.string,
    className: React.PropTypes.any,
    currentUser: React.PropTypes.object,
    dialogClassName: React.PropTypes.string,
    displayToastrError: React.PropTypes.func.isRequired,
    clientCredits: React.PropTypes.object,
    formValues: React.PropTypes.object,
    formSyncErrors: React.PropTypes.object,
    onClose: React.PropTypes.func.isRequired,
    onHide: React.PropTypes.func.isRequired,
    removePatients: React.PropTypes.func.isRequired,
    role: React.PropTypes.string,
    show: React.PropTypes.bool.isRequired,
    style: React.PropTypes.object,
    submitTextBlast: React.PropTypes.func.isRequired,
    patients: React.PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.submitTextBlast = this.submitTextBlast.bind(this);
    this.renderPatientCount = this.renderPatientCount.bind(this);
    this.textAreaChange = this.textAreaChange.bind(this);
    this.state = {
      enteredCharactersLength: 0,
    };
  }

  submitTextBlast(event) {
    event.preventDefault();
    const { displayToastrError, formSyncErrors, formValues, submitTextBlast, onClose, currentUser } = this.props;
    if (!formSyncErrors.message && !formSyncErrors.patients) {
      submitTextBlast(formValues, currentUser.roleForClient.id, onClose);
    } else if (formSyncErrors.message) {
      displayToastrError('', formSyncErrors.message);
    } else if (formSyncErrors.patients) {
      displayToastrError('', formSyncErrors.patients);
    }
  }

  textAreaChange() {
    setTimeout(() => {
      const textarea = this.textarea;
      const value = textarea.value;
      this.setState({ enteredCharactersLength: value ? value.length : 0 }, () => {
      });
    }, 0);
  }

  renderPatientCount() {
    const { formValues, patients } = this.props;
    if (formValues.patients && formValues.patients.length > 0) {
      const remainingPatients = formValues.selectAll ? (patients.total - (formValues.queryParams.filter.skip + formValues.queryParams.filter.limit)) : 0;
      const count = formValues.patients.length + (remainingPatients > 0 ? remainingPatients : 0);
      return (
        <span className="emails-counter">
          <span className="counter">{count}</span>
          <span className="text"> Patients</span>
        </span>
      );
    }
    return null;
  }

  render() {
    const { show, className, onHide } = this.props;
    const { enteredCharactersLength } = this.state;
    const clientCredits = this.props.clientCredits.details.customerCredits;
    const disabled = (clientCredits === 0 || clientCredits === null);
    return (
      <Modal
        show={show}
        className={classNames('patient-database-text-blast', className)}
        id="text-blast-popup"
        dialogComponentClass={CenteredModal}
        onHide={onHide}
        backdrop
        keyboard
      >
        <Modal.Header>
          <Modal.Title>
            <strong className="title">Text Blast</strong>
          </Modal.Title>
          <a className="close" onClick={onHide}>
            <i className="icomoon-icon_close" />
          </a>
        </Modal.Header>
        <Modal.Body>
          <Form className="text-email-blast-form no-sidebar user-active">
            <div className="form-holder">
              <div className="scroll-holder">
                <div className="sub-holder">
                  <div className="subject-field">
                    <FormControl type="text" className="recievers" placeholder="To" disabled />
                    {this.renderPatientCount()}
                  </div>
                  <Field
                    name="message"
                    component={Input}
                    componentClass="textarea"
                    className="message"
                    placeholder="Type a message..."
                    maxLength="160"
                    required
                    onChange={this.textAreaChange}
                    ref={(textarea) => {
                      this.textarea = textarea;
                    }}
                    isDisabled={disabled}
                  />
                  <div className="footer">
                    <span className="characters-counter">
                      {`${160 - enteredCharactersLength}`}
                    </span>
                    <Button
                      type="submit"
                      className="pull-right"
                      onClick={this.submitTextBlast}
                      disabled={disabled || enteredCharactersLength === 0}
                    >
                      Send
                    </Button>
                  </div>
                </div>
              </div>
              <input type="reset" className="hidden btn btn-gray-outline" value="reset" />
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
  clientCredits: selectClientCredits(),
  formSyncErrors: selectSyncErrors(formName),
  currentUser: selectCurrentUser(),
});

function mapDispatchToProps(dispatch) {
  return {
    displayToastrError: (heading, error) => dispatch(toastrActions.error(heading, error)),
    removePatients: () => dispatch(removePatientsFromTextBlast()),
    submitTextBlast: (formValues, clientRoleId, onClose) => dispatch(submitTextBlast(formValues, clientRoleId, onClose)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TextBlastModal);

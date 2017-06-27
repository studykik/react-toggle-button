/**
 * Created by mike on 10/6/16.
 */

import _ from 'lodash';
import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { Field, reduxForm, change } from 'redux-form';
import { createStructuredSelector } from 'reselect';
import { actions as toastrActions } from 'react-redux-toastr';
import Button from 'react-bootstrap/lib/Button';
import Form from 'react-bootstrap/lib/Form';
import FormControl from 'react-bootstrap/lib/FormControl';
import Modal from 'react-bootstrap/lib/Modal';
import formValidator from './validator';
import CenteredModal from '../../../components/CenteredModal/index';
import Checkbox from '../../../components/Input/Checkbox';
import Input from '../../../components/Input/index';
import * as Selector from '../selectors';
import { addPatientsToTextBlast, findPatientsForTextBlast, filterPatientsForTextBlast, removePatientFromTextBlast, removePatientsFromTextBlast, submitTextBlast } from '../actions';
import { selectActiveField, selectValues, selectSyncErrors } from '../../../common/selectors/form.selector';
import { fetchClientCredits } from '../../App/actions';
import { selectCurrentUser, selectClientCredits, selectSources } from '../../App/selectors';

const formName = 'StudyPage.TextBlastModal';

@reduxForm({
  form: formName,
  validate: formValidator,
})
class TextBlastModal extends React.Component {
  static propTypes = {
    activeField: React.PropTypes.any,
    addPatients: React.PropTypes.func.isRequired,
    bsClass: React.PropTypes.string,
    change: React.PropTypes.func.isRequired,
    className: React.PropTypes.any,
    currentUser: React.PropTypes.object,
    clientCredits: React.PropTypes.object,
    fetchClientCredits: React.PropTypes.func,
    dialogClassName: React.PropTypes.string,
    displayToastrError: React.PropTypes.func.isRequired,
    findPatients: React.PropTypes.func.isRequired,
    filterPatients: React.PropTypes.func.isRequired,
    formValues: React.PropTypes.object,
    formSyncErrors: React.PropTypes.object,
    onClose: React.PropTypes.func.isRequired,
    onHide: React.PropTypes.func.isRequired,
    patientCategories: React.PropTypes.array,
    removePatient: React.PropTypes.func.isRequired,
    removePatients: React.PropTypes.func.isRequired,
    role: React.PropTypes.string,
    show: React.PropTypes.bool.isRequired,
    sources: React.PropTypes.array.isRequired,
    studyId: React.PropTypes.number,
    style: React.PropTypes.object,
    submitTextBlast: React.PropTypes.func.isRequired,
    ePMS: React.PropTypes.bool,
    campaign: React.PropTypes.number,
    studyName: React.PropTypes.string,
    initialize: React.PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.selectCategory = this.selectCategory.bind(this);
    this.selectSource = this.selectSource.bind(this);
    this.filterPatients = this.filterPatients.bind(this);
    this.submitTextBlast = this.submitTextBlast.bind(this);
    this.renderPatients = this.renderPatients.bind(this);
    this.renderPatientCount = this.renderPatientCount.bind(this);
    this.textAreaChange = this.textAreaChange.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.checkCategories = this.checkCategories.bind(this);
    this.removeSelectedPatient = this.removeSelectedPatient.bind(this);
    this.state = {
      enteredCharactersLength: 0,
      sourceDisable: true,
    };
  }

  componentWillReceiveProps(newProps) {
    if (newProps.show && !this.props.show) {
      const message = `Hello, please respond yes or no if you are interested in a research study for ${newProps.studyName}.`;
      this.props.initialize({
        message,
      });
      this.textAreaChange(message);
    }
  }

  closeModal() {
    this.setState({
      sourceDisable: true,
    });
    this.props.onHide();
  }

  textAreaChange(message = '') {
    const value = this.textarea ? this.textarea.value : message;
    this.setState({ enteredCharactersLength: value ? value.length : 0 }, () => {});
  }

  selectCategory(checked, categoryId) {
    const { change, findPatients, formValues, patientCategories, sources, studyId, removePatients, campaign } = this.props;
    // find patients for text blast
    let newCampaign = campaign;
    if (campaign === -1 || !campaign) {
      newCampaign = null;
    }
    let sourceIds = null;
    if (!formValues.source) {
      sourceIds = [];
      for (const source of sources) {
        if (formValues[`source-${source.id}`]) {
          sourceIds.push(source.id);
        }
      }
    }
    if (categoryId === 0) {
      for (const category of patientCategories) {
        change(`category-${category.id}`, checked);
      }
      if (checked || (sourceIds && sourceIds.length)) {
        findPatients(studyId, null, null, sourceIds, newCampaign);
      } else {
        removePatients();
      }
    } else {
      // change the all option to unchecked
      change('category', false);
      const categoryIds = [];
      if (checked) {
        categoryIds.push(categoryId);
      }
      for (const category of patientCategories) {
        if (categoryId !== category.id && formValues[`category-${category.id}`]) {
          categoryIds.push(category.id);
        }
      }
      if ((categoryIds && categoryIds.length) || (sourceIds && sourceIds.length)) {
        // if (sourceIds) {
        findPatients(studyId, null, categoryIds, sourceIds, newCampaign);
        // } else {
        //   findPatients(studyId, null, categoryIds, []);
        // }
      } else {
        removePatients();
      }
    }
  }

  selectSource(checked, sourceId) {
    const { change, findPatients, formValues, patientCategories, sources, studyId, removePatients } = this.props;
    // find patients for text blast
    let categoryIds = null;
    if (!formValues.category) {
      categoryIds = [];
      for (const category of patientCategories) {
        if (formValues[`category-${category.id}`]) {
          categoryIds.push(category.id);
        }
      }
    }
    if (sourceId === 0) {
      for (const source of sources) {
        change(`source-${source.id}`, checked);
      }
      if (checked || categoryIds.length) {
        findPatients(studyId, null, categoryIds, null);
      } else {
        removePatients();
      }
    } else {
      // change the all option to unchecked
      change('source', false);
      const sourceIds = [];
      if (checked) {
        sourceIds.push(sourceId);
      }
      for (const source of sources) {
        if (sourceId !== source.id && formValues[`source-${source.id}`]) {
          sourceIds.push(source.id);
        }
      }
      if (sourceIds.length || categoryIds.length) {
        findPatients(studyId, null, categoryIds, sourceIds);
      } else {
        removePatients();
      }
    }
  }

  filterPatients(event) {
    const { formValues, filterPatients } = this.props;
    if (formValues.patientSearchValues) {
      filterPatients(event.target.value, formValues.patients);
      // formValues.patients.map((patient) => {
      //   const firstname = patient.firstName.toUpperCase();
      //   const lastname = patient.lastName.toUpperCase();
      //   if (firstname.includes(event.target.value.toUpperCase() || lastname.includes(event.target.value.toUpperCase()))) {
      //     this.props.removePatient(patient.id);
      //   } else {
      //     this.props.addPatients(patient.id);
      //   }
      // });
    }
  }

  submitTextBlast(event) {
    event.preventDefault();
    const { currentUser, displayToastrError, formSyncErrors, formValues, submitTextBlast, onClose } = this.props;
    if (!formSyncErrors.message && !formSyncErrors.patients) {
      submitTextBlast(formValues.patients, formValues.message, currentUser.roleForClient.id, (err, data) => {
        onClose(err, data);
        this.props.fetchClientCredits(currentUser.id);
      });
    } else if (formSyncErrors.message) {
      displayToastrError('', formSyncErrors.message);
    } else if (formSyncErrors.patients) {
      displayToastrError('', formSyncErrors.patients);
    }
  }

  checkCategories(patient) {
    const { change, formValues, patientCategories } = this.props;
    let newPatientsArr = [];
    if (formValues.patients && formValues.filteredPatientSearchValues) {
      newPatientsArr = formValues.patients.filter((v) => (
        (formValues.filteredPatientSearchValues.indexOf(v) !== -1) && (v !== patient)
      ));
    }
    for (const category of patientCategories) {
      const fOne = _.find(newPatientsArr, { categoryId: category.id });
      if (!fOne) {
        change('category', false);
        change(`category-${category.id}`, false);
      }
    }
  }

  removeSelectedPatient(patient) {
    this.checkCategories(patient);
    this.props.removePatient(patient);
  }

  renderPatients() {
    const { formValues } = this.props;
    let newPatientsArr = [];
    if (formValues.patients && formValues.filteredPatientSearchValues) {
      newPatientsArr = formValues.patients.filter((v) => (
        formValues.filteredPatientSearchValues.indexOf(v) !== -1
      ));
    }
    if (newPatientsArr) {
      return (
        <div className="selected-patients-list">
          {newPatientsArr.map(patient => (
            <div className="patient" key={patient.id}>
              <span className="name">{patient.firstName} {patient.lastName}</span>
              <a
                className="btn-remove"
                onClick={() => {
                  this.removeSelectedPatient(patient);
                }}
              >
                <i className="icomoon-icon_trash" />
              </a>
            </div>
          ))}
        </div>
      );
    }
    return null;
  }

  renderPatientCount() {
    const { formValues, removePatients } = this.props;
    let newPatientsArr = [];
    if (formValues.patients && formValues.filteredPatientSearchValues) {
      newPatientsArr = formValues.patients.filter((v) => (
        formValues.filteredPatientSearchValues.indexOf(v) !== -1
      ));
    }
    if (newPatientsArr && newPatientsArr.length > 0) {
      return (
        <span className="emails-counter">
          <span className="counter">{newPatientsArr.length}</span>
          <span className="text"> Patients</span>
          <a className="btn-close">
            <i className="icomoon-icon_close" onClick={removePatients} />
          </a>
        </span>
      );
    }
    return null;
  }

  render() {
    const { patientCategories, sources, show, role, bsClass, dialogClassName, className, style, ePMS } = this.props;
    const { enteredCharactersLength } = this.state;
    const clientCredits = this.props.clientCredits.details.customerCredits;
    const disabled = (clientCredits === 0 || clientCredits === null);
    return (
      <Modal
        className={classNames('study-text-blast', className)}
        id="text-blast"
        bsClass={bsClass}
        dialogClassName={dialogClassName}
        dialogComponentClass={CenteredModal}
        show={show}
        role={role}
        style={style}
        backdrop
        keyboard
      >
        <Modal.Header>
          <div className="sidebar pull-left">
            <Modal.Title>
              <strong>Select Contacts</strong>
            </Modal.Title>
          </div>
          <Modal.Title>
            <strong className="title">Text Blast</strong>
          </Modal.Title>
          <a className="close" onClick={this.closeModal}>
            <i className="icomoon-icon_close" />
          </a>
        </Modal.Header>
        <Modal.Body>
          <Form className="text-email-blast-form">
            <div className="sidebar pull-left">
              <div className="scroll-holder jcf--scrollable">
                <div className="sub-holder">
                  <div className="custom-select-drop">
                    <div className="search-holder">
                      <div className="field">
                        <Field
                          name="search"
                          type="search"
                          component={Input}
                          onChange={this.filterPatients}
                          className="keyword-search"
                        />
                        <Button className="btn-enter" type="submit">
                          <i className="icomoon-icon_search2" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="category">
                    <strong className="heading">Category</strong>
                    <ul className="check-list list-unstyled">
                      <li>
                        <Field
                          name="category"
                          type="checkbox"
                          component={Checkbox}
                          className="pull-left"
                          onChange={(checked) => {
                            this.selectCategory(checked, 0);
                          }}
                        />
                        All
                      </li>
                      {patientCategories.map(patientCategory => (
                        <li key={patientCategory.id}>
                          <Field
                            name={`category-${patientCategory.id}`}
                            type="checkbox"
                            component={Checkbox}
                            className="pull-left"
                            onChange={(checked) => {
                              this.selectCategory(checked, patientCategory.id);
                            }}
                          />
                          {patientCategory.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="category">
                    <strong className="heading">SOURCE</strong>
                    <ul className="check-list list-unstyled">
                      <li>
                        <Field
                          name="source"
                          type="checkbox"
                          disabled={this.state.sourceDisable}
                          component={Checkbox}
                          className="pull-left"
                          onChange={(checked) => {
                            this.selectSource(checked, 0);
                          }}
                        />
                        All
                      </li>
                      {sources.map(source => (
                        <li key={source.id}>
                          <Field
                            name={`source-${source.id}`}
                            type="checkbox"
                            disabled={this.state.sourceDisable}
                            component={Checkbox}
                            className="pull-left"
                            onChange={(checked) => {
                              this.selectSource(checked, source.id);
                            }}
                          />
                          {source.type}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {this.renderPatients()}
                </div>
              </div>
            </div>
            <div className="form-holder">
              <div className="scroll-holder jcf--scrollable">
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
                    style={{ height: '350px' }}
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
                      disabled={disabled || !ePMS}
                      onClick={this.submitTextBlast}
                    >
                      Send
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <input type="reset" className="hidden btn btn-gray-outline" value="reset" />
          </Form>
        </Modal.Body>
      </Modal>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser(),
  clientCredits: selectClientCredits(),
  activeField: selectActiveField(formName),
  formValues: selectValues(formName),
  formSyncErrors: selectSyncErrors(formName),
  patientCategories: Selector.selectPatientCategories(),
  sources: selectSources(),
  studyId: Selector.selectStudyId(),
});

function mapDispatchToProps(dispatch) {
  return {
    addPatients: (patients) => dispatch(addPatientsToTextBlast(patients)),
    change: (field, value) => dispatch(change(formName, field, value)),
    displayToastrError: (heading, error) => dispatch(toastrActions.error(heading, error)),
    findPatients: (studyId, text, categoryIds, sourceIds, campaignId) => dispatch(findPatientsForTextBlast(studyId, text, categoryIds, sourceIds, campaignId)),
    filterPatients: (text) => dispatch(filterPatientsForTextBlast(text)),
    removePatient: (patient) => dispatch(removePatientFromTextBlast(patient)),
    removePatients: () => dispatch(removePatientsFromTextBlast()),
    submitTextBlast: (patients, message, clientRoleId, onClose) => dispatch(submitTextBlast(patients, message, clientRoleId, onClose)),
    fetchClientCredits: (userId) => dispatch(fetchClientCredits(userId)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TextBlastModal);

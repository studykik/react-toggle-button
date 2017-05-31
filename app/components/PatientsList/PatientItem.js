import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Field, change } from 'redux-form';
import classNames from 'classnames';
import { createStructuredSelector } from 'reselect';

import Checkbox from '../../components/Input/Checkbox';
import { selectSelectedPatient, selectPatients } from '../../containers/PatientDatabasePage/selectors';
import LoadingSpinner from '../../components/LoadingSpinner';
import { fetchPatient, addPatientsToTextBlast,
  removePatientFromTextBlast } from '../../containers/PatientDatabasePage/actions';
import { selectValues } from '../../common/selectors/form.selector';

const formName = 'PatientDatabase.TextBlastModal';

class PatientItem extends Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    addPatientsToTextBlast: PropTypes.func,
    change: PropTypes.func,
    removePatientFromTextBlast: PropTypes.func,
    index: PropTypes.number,
    id: PropTypes.number,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    age: PropTypes.number,
    gender: PropTypes.string,
    bmi: PropTypes.number,
    indications: PropTypes.array,
    source: PropTypes.object,
    studyPatientCategory: PropTypes.object,
    selectedPatient: PropTypes.object,
    fetchPatient: PropTypes.func,
    openChat: PropTypes.func,
    orderNumber: PropTypes.number,
    unsubscribed: PropTypes.bool,
    patients: PropTypes.object,
    formValues: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      hover: false,
    };
    this.showHover = this.showHover.bind(this);
    this.hideHover = this.hideHover.bind(this);
    this.editPatient = this.editPatient.bind(this);
    this.openChat = this.openChat.bind(this);
    this.currentPatientIsBeingFetched = this.currentPatientIsBeingFetched.bind(this);
    this.togglePatientForTextBlast = this.togglePatientForTextBlast.bind(this);
  }

  componentDidMount() {
    const { unsubscribed, change, id, removePatientFromTextBlast } = this.props;
    if (unsubscribed) {
      removePatientFromTextBlast([{ id }]);
      change(`patient-${id}`, false);
    }
  }

  componentWillReceiveProps(newProps) {
    const { unsubscribed, change, id, removePatientFromTextBlast } = newProps;
    if (unsubscribed && this.props.unsubscribed !== unsubscribed) {
      removePatientFromTextBlast([{ id }]);
      change(`patient-${id}`, false);
    }
  }

  showHover() {
    this.setState({ hover: true });
  }

  hideHover() {
    this.setState({ hover: false });
  }

  editPatient() {
    this.props.fetchPatient(this.props.id);
  }

  openChat() {
    const props = this.props;
    props.openChat({
      id: props.id,
      source_id: props.source_id,
      phone: props.phone,
      study_id: props.studyPatientCategory.study_id,
      firstName: props.firstName,
      lastName: props.lastName,
    });
  }

  currentPatientIsBeingFetched() {
    const { selectedPatient, id } = this.props;

    return (selectedPatient.fetching && selectedPatient.id === id);
  }

  togglePatientForTextBlast(checked) {
    const { addPatientsToTextBlast, change, id, removePatientFromTextBlast, patients, formValues } = this.props;
    let totalCount = patients.details.length;
    let newCount;
    let allPatients = false;
    if (checked) {
      addPatientsToTextBlast([{ id }]);
      newCount = formValues.patients.length + 1;
    } else {
      removePatientFromTextBlast([{ id }]);
      newCount = formValues.patients.length - 1;
    }

    for (const detail of patients.details) {
      if (detail.unsubscribed) {
        totalCount--;
      }
    }

    if (newCount === totalCount) {
      allPatients = true;
    }
    change('all-patients', allPatients);
  }

  render() {
    const { id, index, firstName, lastName, email, phone, age, gender, bmi, indications, source, studyPatientCategory, unsubscribed } = this.props;
    let checkClassName = 'pull-left';
    if (unsubscribed) {
      checkClassName += ' none-event';
    }
    const indicationNames = indications.map(indicationIterator => indicationIterator.name).join(', ');
    return (
      <div className={classNames('tr', 'patient-container', { 'tr-active': this.state.hover })} onMouseEnter={this.showHover} onMouseLeave={this.hideHover}>
        <div className="td">
          <Field
            className={checkClassName}
            name={`patient-${id}`}
            type="checkbox"
            disabled={unsubscribed}
            checked={!unsubscribed}
            component={Checkbox}
            onChange={this.togglePatientForTextBlast}
          />
          <span>
            {index + 1}
          </span>
        </div>
        <div className="td name">
          <span>{firstName} {lastName}</span>
        </div>
        <div className="td email">
          <span>{email}</span>
        </div>
        <div className="td phone">
          <span>{phone}</span>
        </div>
        <div className="td indication">
          <span>{indicationNames}</span>
        </div>
        <div className="td age">
          <span>{age}</span>
        </div>
        <div className="td gender">
          <span>{gender}</span>
        </div>
        <div className="td bmi">
          <span>{bmi}</span>
        </div>
        <div className="td status">
          <span>{(studyPatientCategory ? studyPatientCategory.patientCategory.name : '')}</span>
        </div>
        <div className="td source">
          <div className="btn-block">
            <span>{source ? source.type : ''}</span>
            <a className="btn btn-primary lightbox-opener" onClick={this.editPatient} disabled={(this.currentPatientIsBeingFetched())}>
              {(this.currentPatientIsBeingFetched())
                ? <span><LoadingSpinner showOnlyIcon size={20} /></span>
                : <span>Edit</span>
              }
            </a>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  selectedPatient: selectSelectedPatient(),
  patients: selectPatients(),
  formValues: selectValues(formName),
});

function mapDispatchToProps(dispatch) {
  return {
    change: (field, value) => dispatch(change(formName, field, value)),
    addPatientsToTextBlast: (patients) => dispatch(addPatientsToTextBlast(patients)),
    removePatientFromTextBlast: (patient) => dispatch(removePatientFromTextBlast(patient)),
    fetchPatient: id => dispatch(fetchPatient(id)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PatientItem);
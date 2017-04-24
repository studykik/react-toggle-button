import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import _ from 'lodash';
import moment from 'moment-timezone';
import Modal from 'react-bootstrap/lib/Modal';
import { Calendar } from 'react-date-range';
import { createStructuredSelector } from 'reselect';
import * as Selector from '../selectors';
import ReactSelect from '../../../components/Input/ReactSelect';
import CenteredModal from '../../../components/CenteredModal/index';
import Input from '../../../components/Input/index';
import Checkbox from '../../../components/Input/Checkbox';
import validator from './validator';
import { setScheduledFormInitialized } from '../actions';

const fieldName = 'ScheduledPatientModal';

function numberSequenceCreator(start, end) {
  return _.range(start, end).map(n => {
    if (n < 10) {
      return {
        label: `0${n}`,
        value: n.toString(),
      };
    }
    return {
      label: n.toString(),
      value: n.toString(),
    };
  });
}

@reduxForm({
  form: fieldName,
  validate: validator,
})
class ScheduledPatientModal extends React.Component {
  static propTypes = {
    onHide: React.PropTypes.func,
    show: React.PropTypes.bool.isRequired,
    currentPatient: React.PropTypes.object,
    handleSubmit: React.PropTypes.func.isRequired,
    handleDateChange: React.PropTypes.func.isRequired,
    submittingSchedule: React.PropTypes.bool.isRequired,
    initialize: React.PropTypes.func.isRequired,
    scheduledFormInitialized: React.PropTypes.bool,
    setScheduledFormInitialized: React.PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.getTimeComponents = this.getTimeComponents.bind(this);
    this.navigateToday = this.navigateToday.bind(this);
    this.state = {
      date: moment(),
    };
  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
    const { currentPatient } = nextProps;
    let initialValues = {};

    if (!(nextProps.scheduledFormInitialized) && nextProps.show && currentPatient &&
        currentPatient.appointments && currentPatient.appointments.length > 0) {
      const { time, textReminder } = currentPatient.appointments[0];
      initialValues = {
        ...this.getTimeComponents(time),
        textReminder,
      };
      this.props.setScheduledFormInitialized(true);
      this.setState({
        date: moment(currentPatient.appointments[0].time).startOf('date'),
      });
      nextProps.initialize(initialValues);
    }
  }

  getTimeComponents(strTime) {
    const localTime = moment(strTime);

    return {
      hours: (((localTime.hour() + 11) % 12) + 1).toString(),
      minutes: localTime.minute().toString(),
      amPm: localTime.hour() < 12 ? 'AM' : 'PM',
    };
  }

  navigateToday() {
    const today = moment();
    const todayYear = today.year();
    const todayMonth = today.month();
    const calendarYear = this.calendar.getShownDate().year();
    const calendarMonth = this.calendar.getShownDate().month();
    const monthDiff = ((todayYear - calendarYear) * 12) + (todayMonth - calendarMonth);

    this.calendar.changeMonth(monthDiff, { preventDefault: _.noop });
    this.calendar.changeDay(today, { preventDefault: _.noop });
    this.setState({
      date: today,
    });
    this.props.handleDateChange(today);
  }

  render() {
    const { onHide, currentPatient, show, handleSubmit, handleDateChange, submittingSchedule } = this.props;
    if (currentPatient) {
      return (
        <Modal
          className="datepicker-modal scheduled-patient-modal"
          show={show}
          onHide={onHide}
          dialogComponentClass={CenteredModal}
          backdrop
          keyboard
        >
          <Modal.Header>
            <Modal.Title>SCHEDULE PATIENT</Modal.Title>
            <a className="lightbox-close close" onClick={onHide} disabled={submittingSchedule}>
              <i className="icomoon-icon_close" />
            </a>
          </Modal.Header>
          <Modal.Body className="lightbox-card form-lightbox">
            <Calendar
              className="calendar custom-calendar"
              onChange={handleDateChange}
              date={this.state.date}
              ref={(calendar) => { this.calendar = calendar; }}
            />
            <div className="current-date" onClick={this.navigateToday}>
              Today: {moment().format('dddd, MMMM DD, YYYY')}
            </div>
            <form onSubmit={handleSubmit}>
              <div className="text-center">
                <div className="field-row patient-name-field-row">
                  <strong className="label required">
                    <label>PATIENT</label>
                  </strong>
                  <div className="field">
                    <div className="row">
                      <div className="col pull-left">
                        <Field
                          isDisabled
                          name="firstName"
                          placeholder={currentPatient.firstName}
                          component={Input}
                        />
                      </div>
                      <div className="col pull-left">
                        <Field
                          isDisabled
                          name="lastName"
                          placeholder={currentPatient.lastName}
                          component={Input}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="field-row time-field-row">
                  <strong className="label required">
                    <label>TIME</label>
                  </strong>
                  <div className="field time-field">
                    <div className="col-holder row">
                      <div className="col-small pull-left hours">
                        <Field
                          name="hours"
                          placeholder="Hours"
                          options={hourOptions}
                          component={ReactSelect}
                        />
                      </div>
                      <div className="col-small pull-left minutes">
                        <Field
                          name="minutes"
                          placeholder="Minutes"
                          options={minuteOptions}
                          component={ReactSelect}
                        />
                      </div>
                      <div className="col-small pull-left time-mode">
                        <Field
                          name="amPm"
                          placeholder="AM/PM"
                          options={periodOptions}
                          component={ReactSelect}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="field-row">
                  <strong className="label">&nbsp;</strong>
                  <div className="field reminder-field">
                    <Field
                      name="textReminder"
                      type="checkbox"
                      component={Checkbox}
                      className="reminder-container"
                    />
                    <label className="reminder-label"> Text Reminder</label>
                  </div>
                </div>
                <input type="submit" className="btn btn-default pull-right" value="Submit" disabled={submittingSchedule} />
              </div>
            </form>
          </Modal.Body>
        </Modal>
      );
    }
    return null;
  }
}

const hourOptions = numberSequenceCreator(1, 13);
const minuteOptions = numberSequenceCreator(0, 60);
const periodOptions = [
  { label: 'AM', value: 'AM' },
  { label: 'PM', value: 'PM' },
];

const mapStateToProps = createStructuredSelector({
  currentPatient: Selector.selectCurrentPatient(),
  submittingSchedule: Selector.selectSubmittingSchedule(),
  scheduledFormInitialized: Selector.selectScheduledFormInitialized(),
});
const mapDispatchToProps = dispatch => ({
  setScheduledFormInitialized: (formInitialized) => dispatch(setScheduledFormInitialized(formInitialized)),
});
export default connect(mapStateToProps, mapDispatchToProps)(ScheduledPatientModal);

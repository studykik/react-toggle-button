/**
 * Created by mike on 10/18/16.
 */

import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { reduxForm } from 'redux-form';
import { actions as toastrActions } from 'react-redux-toastr';
import Button from 'react-bootstrap/lib/Button';
import { submitPatientText, readStudyPatientMessages, updatePatientSuccess } from '../actions';
import CallItem from '../../../components/GlobalPMSModal/CallItem';
import { fetchClientCredits, markAsReadPatientMessages } from '../../App/actions';
import * as Selector from '../selectors';

import {
  sendStudyPatientMessages,
  fetchStudyPatientMessages,
  setProcessingStatus,
} from '../../GlobalNotifications/actions';

import { selectClientCredits } from '../../App/selectors';

import PatientText from './PatientText';

const formName = 'PatientDetailSection.Text';

@reduxForm({
  form: formName,
})
class TextSection extends React.Component {
  static propTypes = {
    active: React.PropTypes.bool.isRequired,
    currentPatient: React.PropTypes.object,
    currentUser: React.PropTypes.object,
    clientCredits: React.PropTypes.object,
    submitPatientText: React.PropTypes.func.isRequired,
    fetchStudyPatientMessages: React.PropTypes.func,
    sendStudyPatientMessages: React.PropTypes.func,
    setProcessingStatus: React.PropTypes.func,
    socket: React.PropTypes.any,
    studyId: React.PropTypes.any,
    readStudyPatientMessages: React.PropTypes.func.isRequired,
    markAsReadPatientMessages: React.PropTypes.func,
    fetchClientCredits: React.PropTypes.func,
    updatePatientSuccess: React.PropTypes.func,
    ePMS: React.PropTypes.bool,
    currentPatientCategory: React.PropTypes.object,
    displayToastrError: React.PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.renderText = this.renderText.bind(this);
    this.renderTextArea = this.renderTextArea.bind(this);
    this.submitText = this.submitText.bind(this);
    this.textAreaChange = this.textAreaChange.bind(this);
    this.initStudyPatientMessagesFetch = this.initStudyPatientMessagesFetch.bind(this);

    this.state = {
      maxCharacters: 160,
      enteredCharactersLength: 0,
      twilioMessages : [],
      socketBinded: false,
    };
  }

  componentWillReceiveProps(newProps) {
    const { currentUser } = newProps;
    if (!newProps.currentPatient) {
      this.textarea.value = '';
    }

    if (newProps.active && newProps.currentPatient) {
      this.initStudyPatientMessagesFetch(newProps);
    }

    if (this.props.socket && this.state.socketBinded === false) {
      this.props.socket.on('notifyMessage', (newMessage) => {
        this.initStudyPatientMessagesFetch(newProps);
        if (this.props.active && newMessage) {
          this.props.readStudyPatientMessages(this.props.currentPatient.id);
          this.props.markAsReadPatientMessages(this.props.currentPatient.id);
          this.props.updatePatientSuccess({
            patientId: this.props.currentPatient.id,
            patientCategoryId: this.props.currentPatientCategory.id,
            unreadMessageCount: 0,
          });
          this.props.fetchClientCredits(currentUser.id);
        }
      });
      this.setState({ socketBinded: true });
    }
  }

  initStudyPatientMessagesFetch(props) {
    if (props.currentPatient) {
      // otherwise method componentWillReceiveProps
      // receiving data with a missing property currentPatient
      // which leads to an error
      props.fetchStudyPatientMessages({
        studyId: props.studyId,
        patientId: props.currentPatient.id,
        cb: (err, data) => {
          if (!err) {
            if (this.state.twilioMessages !== data.messages) {
              this.setState({ twilioMessages: data.messages });
            }
          } else {
            console.error(err);
          }
          this.props.setProcessingStatus({ status: false });
        },
      });
    }
  }

  textAreaChange() {
    setTimeout(() => {
      const value = this.textarea.value;
      this.setState({ enteredCharactersLength: value ? value.length : 0 }, () => {
      });
    }, 0);
  }

  scrollElement() {
    const scope = this;
    window.requestAnimationFrame(() => {
      const scrollable = scope.scrollable;
      if (scrollable && scope.props.active) {
        scrollable.scrollTop = scrollable.scrollHeight;
      }
    });
  }

  submitText() {
    const { currentUser, currentPatient, studyId } = this.props;
    const textarea = this.textarea;
    const options = {
      studyId,
      currentUserId: currentUser.id,
      patientId: currentPatient.id,
      body: textarea.value,
      to: currentPatient.phone,
    };
    this.props.sendStudyPatientMessages(options, (err, data) => {
      if (!err) {
        this.props.updatePatientSuccess({
          lastTextMessage: { body: data.body, dateCreated: data.dateCreated },
        });
        this.setState({ enteredCharactersLength: 0 }, () => {
          textarea.value = '';
        });
      } else {
        this.props.displayToastrError('', err.errorMessage);
      }
    });
  }

  renderText() {
    const { currentUser, currentPatient } = this.props;
    const { twilioMessages } = this.state;
    if (currentPatient && twilioMessages.length) {
      return (
        <section
          className="postarea text"
          ref={(scrollable) => {
            this.scrollable = scrollable;
          }}
        >
          {twilioMessages.map((twilioMessage, index) => {
            if (twilioMessage.text_message_id) {
              return (<PatientText
                key={index}
                currentPatient={currentPatient}
                currentUser={currentUser}
                textMessage={twilioMessage.twilioTextMessage}
              />);
            }
            return (<CallItem
              messageData={twilioMessage}
              key={index}
              postMsg
            />);
          })}
        </section>
      );
    }
    return (
      <section
        className="postarea text"
        ref={(scrollable) => {
          this.scrollable = scrollable;
        }}
      />
    );
  }

  renderTextArea(disabled) {
    const { maxCharacters } = this.state;

    if (disabled) {
      return (
        <textarea
          className="form-control test"
          placeholder="Type a message..."
          onChange={this.textAreaChange}
          maxLength={maxCharacters}
          disabled
          ref={(textarea) => {
            this.textarea = textarea;
          }}
        />
      );
    }
    return (
      <textarea
        className="form-control test"
        placeholder="Type a message..."
        onChange={this.textAreaChange}
        maxLength={maxCharacters}
        ref={(textarea) => {
          this.textarea = textarea;
        }}
      />
    );
  }

  render() {
    const { currentPatient, active, ePMS } = this.props;
    const clientCredits = this.props.clientCredits.details.customerCredits;
    const unsubscribed = (currentPatient) ? currentPatient.unsubscribed : null;
    const { maxCharacters, enteredCharactersLength } = this.state;
    const disabled = (clientCredits === 0 || clientCredits === null);
    this.scrollElement();
    return (
      <div className={classNames('item text', { active })}>
        {this.renderText()}
        <div className="textarea">
          {this.renderTextArea(disabled || unsubscribed || !ePMS)}
          <span className="remaining-counter">
            {`${maxCharacters - enteredCharactersLength}`}
          </span>
          <Button
            disabled={disabled || unsubscribed || !ePMS}
            onClick={this.submitText}
          >
            Send
          </Button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  clientCredits: selectClientCredits(),
  currentPatientCategory: Selector.selectCurrentPatientCategory(),
});

const mapDispatchToProps = (dispatch) => ({
  displayToastrError: (heading, error) => dispatch(toastrActions.error(heading, error)),
  submitPatientText: (text) => dispatch(submitPatientText(text)),
  sendStudyPatientMessages: (payload, cb) => dispatch(sendStudyPatientMessages(payload, cb)),
  fetchStudyPatientMessages: (payload) => dispatch(fetchStudyPatientMessages(payload)),
  setProcessingStatus: (payload) => dispatch(setProcessingStatus(payload)),
  readStudyPatientMessages: (patientId) => dispatch(readStudyPatientMessages(patientId)),
  markAsReadPatientMessages: (patientId) => dispatch(markAsReadPatientMessages(patientId)),
  fetchClientCredits: (userId) => dispatch(fetchClientCredits(userId)),
  updatePatientSuccess: (payload) => dispatch(updatePatientSuccess(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TextSection);

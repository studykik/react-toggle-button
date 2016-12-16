/**
 * Created by mike on 10/18/16.
 */

import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { reduxForm } from 'redux-form';
import Button from 'react-bootstrap/lib/Button';
import { submitPatientText, readStudyPatientMessages } from '../actions';
import CallItem from 'components/GlobalPMSModal/CallItem';
import { fetchClientCredits } from 'containers/App/actions';

import {
  sendStudyPatientMessages,
  fetchStudyPatientMessages,
  setProcessingStatus,
} from 'containers/GlobalNotifications/actions';

import { markAsReadPatientMessages } from 'containers/App/actions';
import { selectClientCredits } from 'containers/App/selectors';

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
  };

  constructor(props) {
    super(props);
    this.renderText = this.renderText.bind(this);
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

  componentDidMount() {
    const { currentUser } = this.props;
    this.props.fetchClientCredits(currentUser.id);
  }

  componentWillReceiveProps(newProps) {
    const { currentUser } = newProps;
    if (newProps.active && newProps.currentPatient) {
      this.initStudyPatientMessagesFetch(newProps);
    }

    if (this.props.socket && this.state.socketBinded === false) {
      this.props.socket.on('notifyMessage', (newMessage) => {
        this.initStudyPatientMessagesFetch(newProps);
        if (this.props.active && newMessage) {
          this.props.readStudyPatientMessages(this.props.currentPatient.id, this.props.studyId);
          this.props.markAsReadPatientMessages(this.props.currentPatient.id, this.props.studyId);
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

    this.props.sendStudyPatientMessages(options, (err) => {
      if (!err) {
        this.setState({ enteredCharactersLength: 0 }, () => {
          textarea.value = '';
          this.props.fetchClientCredits(currentUser.id);
        });
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

  render() {
    const { active } = this.props;
    const clientCredits = this.props.clientCredits.details.customerCredits;
    const { maxCharacters, enteredCharactersLength } = this.state;
    const disabled = (clientCredits === 0 || clientCredits === null);
    this.scrollElement();
    return (
      <div className={classNames('item text', { active })}>
        {this.renderText()}
        <div className="textarea">
          <textarea
            className="form-control test"
            placeholder="Type a message..."
            onChange={this.textAreaChange}
            maxLength={maxCharacters}
            ref={(textarea) => {
              this.textarea = textarea;
            }}
          />
          <span className="remaining-counter">
            {`${maxCharacters - enteredCharactersLength}`}
          </span>
          <Button
            disabled={disabled}
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
});

const mapDispatchToProps = (dispatch) => ({
  submitPatientText: (text) => dispatch(submitPatientText(text)),
  sendStudyPatientMessages: (payload, cb) => dispatch(sendStudyPatientMessages(payload, cb)),
  fetchStudyPatientMessages: (payload) => dispatch(fetchStudyPatientMessages(payload)),
  setProcessingStatus: (payload) => dispatch(setProcessingStatus(payload)),
  readStudyPatientMessages: (patientId, studyId) => dispatch(readStudyPatientMessages(patientId, studyId)),
  markAsReadPatientMessages: (patientId, studyId) => dispatch(markAsReadPatientMessages(patientId, studyId)),
  fetchClientCredits: (userId) => dispatch(fetchClientCredits(userId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TextSection);

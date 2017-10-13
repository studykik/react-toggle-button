import React, { Component, PropTypes } from 'react';
import moment from 'moment-timezone';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { selectSelectedUser, selectCurrentUser } from '../../containers/App/selectors';

class CallItem extends Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    messageData: PropTypes.object,
    currentUser: PropTypes.object,
    postMsg: PropTypes.bool,
    timezone: React.PropTypes.string,
  };

  render() {
    const { messageData, currentUser } = this.props;
    const cts = messageData.twilioCallRecord.created;

    const timezone = this.props.timezone || currentUser.timezone;

    const cdate = moment(cts).tz(timezone).format('MM/DD/YY [at] h:mm A');

    let containerClassName = 'post-holder call';
    // todo remove and put back Anonymous behavior
    // let senderName = 'Anonymous';
    let senderName = `${currentUser.firstName} ${currentUser.lastName}`;

    if (messageData.twilioCallRecord.direction === 'outbound-api') {
      containerClassName = 'post-holder call even';
      if (messageData.user) {
        senderName = messageData.user.firstName.concat(' '.concat(messageData.user.lastName));
      }
    } else if (messageData.patient) {
      senderName = messageData.patient.firstName.concat(' '.concat(messageData.patient.lastName));
    }

    if (this.props.postMsg) {
      containerClassName = 'post-msg call';
    }

    return (
      <div className={containerClassName} >
        {(() => {
          if (messageData.twilioCallRecord.duration === 0) {
            return (
              <div className="global-pms-chat-call-record-text" data-post="1">
                <i className="icomoon-icon-incoming" />
                <div>Missed call from {senderName}.</div>
                <time >{cdate}</time>
              </div>
            );
          } else if (messageData.type === 'ended') {
            const ms = parseInt(messageData.twilioCallRecord.duration) * 1000;
            const durationStr = moment.utc(ms).format('HH:mm:ss');
            return (
              <div className="global-pms-chat-call-record-text" data-post="1">
                <i className="icomoon-icon-call-end" />
                <div>Call ended, duration {durationStr}.</div>
                <time >{cdate}</time>
              </div>
            );
          }
          return (
            <div className="global-pms-chat-call-record-text" data-post="1">
              <i className="icomoon-icon-outgoing" />
              <div>Call from {senderName}.</div>
              <time >{cdate}</time>
            </div>
          );
        })()}
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  selectedUser: selectSelectedUser(),
  currentUser: selectCurrentUser(),
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(CallItem);

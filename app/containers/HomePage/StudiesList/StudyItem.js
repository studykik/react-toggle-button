import React, { PropTypes, Component } from 'react';
import moment from 'moment-timezone';
import classNames from 'classnames';
import Button from 'react-bootstrap/lib/Button';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';

class StudyItem extends Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    currentUser: PropTypes.object,
    index: PropTypes.number,
    studyId: PropTypes.number,
    indication: PropTypes.object,
    campaign: PropTypes.object,
    location: PropTypes.string,
    siteName: PropTypes.string,
    sponsor: PropTypes.string,
    protocol: PropTypes.string,
    patientMessagingSuite: PropTypes.string,
    unreadMessageCount: PropTypes.number,
    status: PropTypes.string,
    siteUsers: PropTypes.array,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    onRenew: PropTypes.func,
    onUpgrade: PropTypes.func,
    onEdit: PropTypes.func,
    push: PropTypes.func,
    orderNumber: PropTypes.number,
    siteId: PropTypes.number,
    url: PropTypes.string,
  };

  constructor(props) {
    super(props);

    this.state = {
      buttonsShown: false,
    };

    this.onViewClick = this.onViewClick.bind(this);
    this.onRenewClick = this.onRenewClick.bind(this);
    this.onUpgradeClick = this.onUpgradeClick.bind(this);
    this.onEditClick = this.onEditClick.bind(this);
    this.showButtons = this.showButtons.bind(this);
    this.hideButtons = this.hideButtons.bind(this);
  }

  onViewClick() {
    const { push, studyId } = this.props;
    push(`/app/studies/${studyId}`);
  }

  onRenewClick() {
    const { studyId, indication, onRenew, campaign, siteId, location } = this.props;

    onRenew(studyId, indication.id, campaign, siteId, indication.name, location);
  }

  onUpgradeClick() {
    const { studyId, indication, onUpgrade, campaign, siteId, location } = this.props;

    onUpgrade(studyId, indication.id, campaign, siteId, indication.name, location);
  }

  onEditClick() {
    this.props.onEdit(this.props.studyId, this.props.siteUsers, this.props.siteId);
  }

  showButtons() {
    this.setState({ buttonsShown: true });
  }

  hideButtons() {
    this.setState({ buttonsShown: false });
  }

  parseDate(date, timezone) {
    if (!date) {
      return '';
    }
    return moment(date).tz(timezone).format('MM/DD/YYYY');
  }

  render() {
    const { currentUser, indication, location, siteName, sponsor, protocol, patientMessagingSuite, status,
      startDate, endDate, unreadMessageCount, orderNumber, studyId, url } = this.props;
    const buttonsShown = this.state.buttonsShown;
    let purchasable = true;
    if (currentUser.roleForClient) {
      purchasable = currentUser.roleForClient.name === 'Super Admin' ? true : currentUser.roleForClient.canPurchase;
    }
    const landingHref = url ? `/${studyId}-${url.toLowerCase().replace(/ /ig, '-')}` : '';
    let messageCountContent = null;
    if (unreadMessageCount > 0) {
      messageCountContent = (
        <span className="counter-circle">{unreadMessageCount}</span>
      );
    }

    return (
      <tr
        className={classNames('study-container', { 'tr-active': buttonsShown, 'tr-inactive': !buttonsShown })}
        onMouseEnter={this.showButtons} onMouseLeave={this.hideButtons}
      >
        <td className="index">
          <span>{orderNumber}</span>
        </td>
        <td className="indication">
          <a href={landingHref} className="landig-link" target="_blank">{indication.name}</a>
        </td>
        <td className="location">
          <span>{location || siteName}</span>
        </td>
        <td className="sponsor">
          <span>{sponsor}</span>
        </td>
        <td className="protocol">
          <span>{protocol}</span>
        </td>
        <td className={classNames('patient-messaging-suite', { off: (patientMessagingSuite === 'Off') })}>
          <span className="patient-messaging-suite-status">{(patientMessagingSuite === 'Off') ? 'Off' : 'On'}</span>
          <span>{messageCountContent}</span>
        </td>
        <td className={classNames('status', { inactive: (status === 'Inactive') })}>
          <span>{status}</span>
        </td>
        <td className="start-date">
          <span>{startDate ? this.parseDate(startDate, currentUser.timezone) : 'TBD'}</span>
        </td>
        <td className="end-date">
          <span>{endDate ? this.parseDate(endDate, currentUser.timezone) : 'TBD'}</span>
          <div className="btns-slide pull-right">
            <div className="btns">
              <Button bsStyle="default" className="btn-view-patients" onClick={this.onViewClick}>View Patients</Button>
              <Button bsStyle="primary" className="btn-renew" disabled={!purchasable} onClick={this.onRenewClick}>Renew</Button>
              <Button bsStyle="danger" className="btn-upgrade" disabled={!purchasable} onClick={this.onUpgradeClick}>Upgrade</Button>
              <Button bsStyle="info" className="btn-edit" onClick={this.onEditClick}>Edit</Button>
            </div>
          </div>
        </td>
      </tr>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  push: (path) => dispatch(push(path)),
});

export default connect(null, mapDispatchToProps)(StudyItem);

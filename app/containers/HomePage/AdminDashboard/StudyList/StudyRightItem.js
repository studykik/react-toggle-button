import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import moment from 'moment';

class StudyItem extends Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    item: PropTypes.object,
    mouseOverRow: PropTypes.func,
    mouseOutRow: PropTypes.func,
    hoveredRowIndex: PropTypes.any,
  };

  constructor(props) {
    super(props);
    this.state = {
      hover: false,
    };
    this.showHover = this.showHover.bind(this);
    this.hideHover = this.hideHover.bind(this);
  }

  showHover() {
    this.setState({ hover: true });
  }

  hideHover() {
    this.setState({ hover: false });
  }

  render() {
    const { item } = this.props;

    const campaignDateFrom = moment(item.campaign_datefrom);
    const campaignDateTo = moment(item.campaign_dateto);

    const totalDays = campaignDateTo.diff(campaignDateFrom, 'days');
    let daysRan = moment.utc().diff(campaignDateFrom, 'days');
    let daysLeft = campaignDateTo.diff(moment.utc(), 'days');

    if (daysLeft < 0) {
      daysLeft = 0;
    }

    if (daysRan < 0) {
      daysRan = 0;
    }

    if (daysRan > totalDays) {
      daysRan = totalDays;
    }

    const startDate = item.campaign_datefrom ? campaignDateFrom.format('MM/DD/YY') : '';
    const endDate = item.campaign_dateto ? campaignDateTo.format('MM/DD/YY') : '';

    return (
      <tr
        onMouseOver={(e) => this.props.mouseOverRow(e, item.study_id)}
        onMouseOut={this.props.mouseOutRow}
        onFocus={(e) => this.props.mouseOverRow(e, item.study_id)}
        onBlur={this.props.mouseOutRow}

        className={(this.props.hoveredRowIndex === item.study_id) ? 'active-table-row' : ''}
      >
        <td><span className="location">{`${item.site_address ? item.site_address : ''} ${item.site_city ? item.site_city : ''}, ${item.site_state ? item.site_state : ''} ${item.site_zip ? item.site_zip : ''}`}</span></td>
        <td><span className="exposure-level">{item.level_name}</span></td>
        <td>
          <ul className="list-unstyled">
            <li>Goal: <span>{item.goal || 'N/A'}</span></li>
            <li>Custom: <span>{item.custom_patient_goal || 'N/A'}</span></li>
          </ul>
        </td>
        <td>
          <ul className="list-unstyled">
            <li>Today: <span>{item.today_count || 0}</span></li>
            <li>Yesterday: <span>{item.yesterday_count || 0}</span></li>
            <li>Campaign: <span>{item.campaign_count || 0}</span></li>
            <li>Grand Total: <span>{item.count_total || 0}</span></li>
          </ul>
        </td>
        <td>
          <ul className="list-unstyled">
            <li>Total Days: <span>{totalDays || 0}</span></li>
            <li>Days Ran: <span>{daysRan || 0}</span></li>
            <li>Days Left: <span>{daysLeft || 0}</span></li>
          </ul>
        </td>
        <td>
          <ul className="list-unstyled">
            {/* <li><span>{item.campaign_name}</span></li>*/}
            <li><span>{'Newest'}</span></li>
            <li>Start Date: <span>{startDate}</span></li>
            <li>End Date: <span>{endDate}</span></li>
          </ul>
        </td>
        <td>{item.views_count || 0}</td>
        <td>{0}</td>
        <td><a href="#popup-rewards-list" className="lightbox-opener">{item.reward_balance || 0}</a></td>
        <td><a href="#popup-credits-list" className="lightbox-opener">{item.customer_credits || 0}</a></td>
        <td>
          <ul className="list-unstyled">
            <li className="sent">Text Sent: <a href="#popup-text-sent-list" className="lightbox-opener">{item.outbound_text}</a></li>
            <li className="received">Text Received: <a href="#popup-text-received-list" className="lightbox-opener">{item.inbound_text}</a></li>
            <li className="unread">Unread Texts: <a href="#popup-text-unread-list" className="lightbox-opener">{item.unread_text}</a></li>
          </ul>
        </td>
        <td>
          <ul className="list-unstyled">
            <li>{item.count_not_contacted_campaign}</li>
            <li>{item.count_not_contacted}</li>
          </ul>
        </td>
        <td>
          <ul className="list-unstyled">
            <li>{item.call_attempted_campaign}</li>
            <li>{item.call_attempted}</li>
          </ul>
        </td>
        <td>
          <ul className="list-unstyled">
            <li>{item.dnq_campaign}</li>
            <li>{item.dnq}</li>
          </ul>
        </td>
        <td>
          <ul className="list-unstyled">
            <li>{item.action_needed_campaign}</li>
            <li>{item.action_needed}</li>
          </ul>
        </td>
        <td>
          <ul className="list-unstyled">
            <li>{item.scheduled_campaign}</li>
            <li>{item.scheduled}</li>
          </ul>
        </td>
        <td>
          <ul className="list-unstyled">
            <li>{item.consented_campaign}</li>
            <li>{item.consented}</li>
          </ul>
        </td>
        <td>
          <ul className="list-unstyled">
            <li>{item.randomized_campaign}</li>
            <li>{item.randomized}</li>
          </ul>
        </td>
      </tr>
    );
  }
}

const mapStateToProps = createStructuredSelector({
});

export default connect(mapStateToProps)(StudyItem);

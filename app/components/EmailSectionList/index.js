import React from 'react';
import classNames from 'classnames';
import moment from 'moment-timezone';

class EmailSectionList extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    switchCompose: React.PropTypes.func.isRequired,
    emails: React.PropTypes.object,
    active: React.PropTypes.any,
  };

  constructor(props) {
    super(props);
    this.renderProfileImage = this.renderProfileImage.bind(this);
    this.disablePreview = this.disablePreview.bind(this);
    this.enablePreview = this.enablePreview.bind(this);

    this.state = {
      preview: false,
      selected: {},
    };
  }

  disablePreview() {
    this.setState({ preview: false, selected: {} });
  }

  enablePreview(email) {
    this.setState({ preview: true, selected: email });
  }

  renderProfileImage(email) {
    /* eslint-disable global-require */
    const url = require('../../assets/images/Default-User-Img-Dr.png');
    if (email.profile_image_url) {
      return (
        <img alt="" src={email.profile_image_url} />
      );
    }
    return (
      <img alt="" src={url} />
    );
  }

  render() {
    const { switchCompose, active, emails } = this.props;
    const { preview, selected } = this.state;

    return (
      <div className={classNames('item emails-info', { active })}>
        <section className="emails-info-holder">
          {(emails.details.length > 0 && !preview) &&
            emails.details.map((email, index) =>
              <article className="post-email-alert" key={index} onClick={() => { this.enablePreview(email); }}>
                <div className="img-holder">
                  {this.renderProfileImage(email)}
                </div>
                <strong className="subject">
                  {email.subject}
                </strong>
                <div className="email-content">
                  <p>{email.body.split('\n').map((i, k) => <span key={k}>{i}<br /></span>)}</p>
                </div>
                <strong className="author">
                  {`${email.first_name} ${(email.last_name) ? email.last_name : ''}`}
                </strong>
                <time dateTime={email.date_sent}>
                  {moment.tz(email.date_sent, email.timezone).format('MM/DD/YY [at] h:mm A')}
                </time>
              </article>
            )
          }
          {(preview && selected) &&
            <article className="preview-holder">
              <div className="img-holder">
                {this.renderProfileImage(selected)}
              </div>
              <strong className="subject">
                {selected.subject}
              </strong>
              <div className="email-content">
                <p>{selected.body.split('\n').map((i, k) => <span key={k}>{i}<br /></span>)}</p>
              </div>
              <strong className="author">
                {`${selected.first_name} ${(selected.last_name) ? selected.last_name : ''}`}
              </strong>
              <time dateTime={selected.date_sent}>
                {moment.tz(selected.date_sent, selected.timezone).format('MM/DD/YY [at] h:mm A')}
              </time>
            </article>
          }
        </section>
        <div className="textarea">
          {preview && <input type="button" value="back" className="btn btn-gray-outline left" onClick={this.disablePreview} />}
          {!preview && <input type="submit" value="compose" className="btn btn-default pull-right" onClick={switchCompose} />}
        </div>
      </div>
    );
  }
}

export default EmailSectionList;

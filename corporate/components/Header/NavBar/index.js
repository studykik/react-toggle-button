import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { reset } from 'redux-form';
import { Well, Collapse } from 'react-bootstrap';
import classNames from 'classnames';

import {
  clearClinicalTrialsSearch,
} from '../../../../app/containers/App/actions';

const menuItems = [
  { text: 'Study search', link: '/' },
  { text: 'List your trials', link: '/list-your-trials' },
  { text: 'About', link: '/about' },
  { text: 'Blog', link: '/blog' },
  { text: 'Contact', link: '/contact' },
];

export class NavBar extends React.Component { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    menuCollapsed: React.PropTypes.any,
    location: React.PropTypes.any,
    resetForm: React.PropTypes.func,
    clearTrialsList: React.PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.watcher = null;

    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {}

  componentWillReceiveProps() {}

  handleClick(ev) {
    let target;
    const location = window.location;
    if (ev.target.tagName === 'DIV') {
      target = ev.target.parentElement.href;
    } else {
      target = ev.target.href;
    }

    if (location.toString() === target) {
      this.props.resetForm();
      this.props.clearTrialsList();
    }
  }

  render() {
    const { menuCollapsed } = this.props;
    const { pathname } = this.props.location;
    return (
      <Collapse className="navbar-collapse holder" in={!menuCollapsed}>
        <Well>
          <ul className="nav navbar-nav">
            {
              menuItems.map((item, index) =>
                <li
                  key={index}
                  className={classNames({ active: (pathname === item.link) })}
                >
                  <Link
                    to={item.link}
                    onClick={this.handleClick}
                  >
                    <div>{item.text.toUpperCase()}</div>
                  </Link>
                </li>
              )
            }
          </ul>
        </Well>
      </Collapse>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    resetForm: () => dispatch(reset('find-studies')),
    clearTrialsList: () => dispatch(clearClinicalTrialsSearch()),
  };
}

export default connect(null, mapDispatchToProps)(NavBar);

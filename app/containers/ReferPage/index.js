/*
 *
 * ReferPage
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import ReferForm from 'components/ReferForm';

import { selectCompanyTypes } from 'containers/ReferPage/selectors';
import { referFormRequest, companyTypesRequest } from 'containers/ReferPage/actions';

import manImage from 'assets/images/man.svg';
import shadowImage from 'assets/images/shadow.png';

class ReferPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    companyTypes: PropTypes.array,
    fetchCompanyTypes: PropTypes.func,
    onSubmitForm: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.onSubmitForm = this.props.onSubmitForm.bind(this);
  }

  componentDidMount() {
    this.props.fetchCompanyTypes();
  }

  render() {
    const { companyTypes } = this.props;

    return (
      <div className="container-fluid">
        <section className="study-portal">

          <h2 className="main-heading">REFER</h2>

          <div className="row form-study">

            <div className="col-xs-6 form-holder">
              <ReferForm companyTypes={companyTypes} onSubmit={this.onSubmitForm} />
            </div>

            <div className="col-xs-6 refer-info pull-right">
              <div className="textbox text-center pull-left">
                <strong className="title">
                  Refer a new site<br />
                  or Sponsor/CRO<br />
                  project manager by <br />
                  entering their contact!
                </strong>

                <p>
                  When they list a Platinum Study or <br />
                  higher, you will receive 100 reward <br />
                  KIK’s. If they list a multi-site (10+) <br />
                  central recruitment you will <br />
                  receive 300 <br />
                  reward KIKs!
                </p>
              </div>

              <div className="img-holder pull-right">
                <img src={manImage} alt="" width="256" />
                <img className="shadow" src={shadowImage} alt="&nbsp;" width="212" height="39" />
              </div>
            </div>

          </div>
        </section>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  companyTypes: selectCompanyTypes(),
});

function mapDispatchToProps(dispatch) {
  return {
    fetchCompanyTypes: () => dispatch(companyTypesRequest()),
    onSubmitForm: (values) => dispatch(referFormRequest(values)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ReferPage);
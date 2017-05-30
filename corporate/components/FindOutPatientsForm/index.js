import React, { PropTypes } from 'react';
import { Field, reduxForm } from 'redux-form';

import { Parallax } from 'react-parallax';

import FindOutPatientsFormValidator from './validator';
import Input from '../../../app/components/Input';

import img2 from '../../assets/images/img2.svg';
import img3 from '../../assets/images/img3.svg';
import bg1 from '../../assets/images/bg1.jpg';

@reduxForm({
  form: 'find-location',
  validate: FindOutPatientsFormValidator,
})

export class FindOutPatientsForm extends React.Component { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
  };

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  focusField(ev) {
    ev.target.parentElement.classList.add('focus');
    console.log(ev.target.parentElement.classList);
  }

  blurField(ev) {
    ev.target.parentElement.classList.remove('focus');
    console.log(ev.target.parentElement.classList);
  }

  render() {
    const { handleSubmit } = this.props;
    return (
      <form
        action="#"
        className="form-find-location"
        data-formvalidation="true"
        onSubmit={handleSubmit}
      >
        <Parallax bgImage={bg1} bgWidth="auto" bgHeight="1090px" strength={800}>
          <div className="container">
            <h2>FIND OUT HOW MANY PATIENTS ARE NEAR YOUR SITE</h2>
            <div className="form-holder">
              <Field
                name="fullName"
                type="text"
                component={Input}
                placeholder="* Full Name"
                className="field-wrapper"
                bsClass="form-control input-lg"
                onFocus={this.focusField}
                onBlur={this.blurField}
              />
              <Field
                name="email"
                type="text"
                component={Input}
                placeholder="* Email"
                className="field-wrapper"
                bsClass="form-control input-lg"
                onFocus={this.focusField}
                onBlur={this.blurField}
              />
              <Field
                name="company"
                type="text"
                component={Input}
                placeholder="* Company"
                className="field-wrapper"
                bsClass="form-control input-lg"
                onFocus={this.focusField}
                onBlur={this.blurField}
              />
              <Field
                name="postalCode"
                type="text"
                component={Input}
                placeholder="* Postal Code"
                className="field-wrapper"
                bsClass="form-control input-lg"
                onFocus={this.focusField}
                onBlur={this.blurField}
              />
              <Field
                name="indication"
                type="text"
                component={Input}
                placeholder="* Indication"
                className="field-wrapper"
                bsClass="form-control input-lg"
                onFocus={this.focusField}
                onBlur={this.blurField}
              />
              <input type="submit" className="btn btn-block input-lg" value="RECEIVE REPORT" />
              <div className="images">
                <div className="img-holder left">
                  <img src={img2} alt="img2" width="232" height="279" className="img-responsive" />
                </div>
                <div className="img-holder right">
                  <img src={img3} alt="img3" width="193" height="302" className="img-responsive" />
                </div>
              </div>
            </div>
          </div>
        </Parallax>
      </form>
    );
  }
}

export default FindOutPatientsForm;

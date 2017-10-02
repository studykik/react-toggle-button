/**
*
* AddEmailNotificationForm
*
*/

import React from 'react';
import { Field, reduxForm } from 'redux-form';

import Input from '../../components/Input';
import formValidator from './validator';

@reduxForm({
  form: 'addEmailNotificationForm',
  validate: formValidator,
})
class AddEmailNotificationForm extends React.Component {

  static propTypes = {
    custom: React.PropTypes.any,
    handleSubmit: React.PropTypes.func.isRequired,
    submitting: React.PropTypes.bool.isRequired,
  };

  componentDidMount() {
  }

  render() {
    const { handleSubmit, submitting, custom } = this.props;

    const nameFields = (
      <div className="field-row">
        <strong className="label required"><label>Name</label></strong>
        <div className="field">
          <div className="row">
            <div className="col pull-left">
              <Field
                name="firstName"
                component={Input}
                placeholder="First Name"
                type="text"
              />
            </div>
            <div className="col pull-right">
              <Field
                name="lastName"
                component={Input}
                placeholder="Last Name"
                type="text"
              />
            </div>
          </div>
        </div>
      </div>
    );

    return (
      <form onSubmit={handleSubmit} className="form-lightbox">

        {!custom && nameFields}

        <div className="field-row">
          <strong className="label required"><label>Email</label></strong>
          <Field
            name="email"
            component={Input}
            type="email"
            className="field"
          />
        </div>

        <div className="btn-block text-right">
          <input
            type="submit"
            value="SUBMIT"
            className="btn btn-default"
            disabled={submitting}
          />
        </div>
      </form>
    );
  }
}

export default AddEmailNotificationForm;

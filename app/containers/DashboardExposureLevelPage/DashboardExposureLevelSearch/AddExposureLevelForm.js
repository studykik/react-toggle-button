import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Field, reduxForm, change } from 'redux-form';
import Input from '../../../components/Input';
import formValidator from './validator';
import LoadingSpinner from '../../../components/LoadingSpinner';
import Checkbox from '../../../components/Input/Checkbox';

@reduxForm({ form: 'dashboardAddExposureLevelForm', validate: formValidator })

export class AddExposureLevelForm extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    isEdit: PropTypes.bool,
    initialValues: PropTypes.object,
    handleSubmit: PropTypes.func,
    saving: PropTypes.bool,
    deleting: PropTypes.bool,
    onDelete: PropTypes.func,
    change: PropTypes.func,
  }

  componentDidMount() {
    if (this.props.initialValues && this.props.initialValues.active) {
      this.props.change('active', true);
    }
  }

  render() {
    return (
      <form action="#" className="form-lightbox dashboard-lightbox" onSubmit={this.props.handleSubmit}>

        <div className="field-row">
          <strong className="label required">
            <label className="add-exposure-level">Exposure Level</label>
          </strong>
          <div className="field">
            <Field
              name="name"
              component={Input}
              type="text"
            />
          </div>
        </div>

        <div className="field-row">
          <strong className="label required">
            <label className="add-exposure-level">Price</label>
          </strong>
          <div className="field">
            <Field
              name="price"
              component={Input}
              type="text"
            />
          </div>
        </div>

        <div className="field-row">
          <strong className="label">
            <label className="add-exposure-level">Credits</label>
          </strong>
          <div className="field">
            <Field
              name="credits"
              component={Input}
              type="text"
            />
          </div>
        </div>

        <div className="field-row">
          <strong className="label">
            <label className="add-exposure-level">LISTING KIKs</label>
          </strong>
          <div className="field">
            <Field
              name="points"
              component={Input}
              type="text"
            />
          </div>
        </div>

        <div className="field-row">
          <strong className="label">
            <label className="add-exposure-level">ENROLLMENT KIKs</label>
          </strong>
          <div className="field">
            <Field
              name="enrollPoints"
              component={Input}
              type="text"
            />
          </div>
        </div>

        <div className="field-row">
          <strong className="label required">
            <label className="add-exposure-level">Position</label>
          </strong>
          <div className="field">
            <Field
              name="position"
              component={Input}
              type="text"
            />
          </div>
        </div>

        <div className="field-row">
          <strong className="label">
            <label className="add-exposure-level">Active</label>
          </strong>
          <div className="field">
            <Field
              name="active"
              type="checkbox"
              component={Checkbox}
            />
          </div>
        </div>

        <div className="field-row text-right no-margins">
          {this.props.isEdit &&
            <a className="btn btn-gray-outline" onClick={() => { this.props.onDelete(this.props.initialValues.id); }}>
              {this.props.deleting
                ? <span><LoadingSpinner showOnlyIcon size={20} className="saving-user" /></span>
                : <span>{'Delete'}</span>
              }
            </a>
          }
          <button type="submit" className="btn btn-primary">
            {this.props.saving
              ? <span><LoadingSpinner showOnlyIcon size={20} className="saving-user" /></span>
              : <span>{this.props.isEdit ? 'Update' : 'Submit'}</span>
            }
          </button>
        </div>

      </form>
    );
  }
}

const mapStateToProps = createStructuredSelector({
});
function mapDispatchToProps(dispatch) {
  return {
    change: (field, value) => dispatch(change('dashboardAddExposureLevelForm', field, value)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddExposureLevelForm);

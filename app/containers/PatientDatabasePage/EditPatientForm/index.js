import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Field, reduxForm, change } from 'redux-form';
import _, { map } from 'lodash';
import moment from 'moment-timezone';
import Button from 'react-bootstrap/lib/Button';
import Form from 'react-bootstrap/lib/Form';
import Overlay from 'react-bootstrap/lib/Overlay';

import { selectValues, selectSyncErrorBool } from '../../../common/selectors/form.selector';
import DateOfBirthPicker from '../../../components/DateOfBirthPicker/index';
import Input from '../../../components/Input/index';
import ReactSelect from '../../../components/Input/ReactSelect';
import LoadingSpinner from '../../../components/LoadingSpinner';
import Checkbox from '../../../components/Input/Checkbox';
import { selectIndications, selectSources, selectSiteLocations, selectStudiesFromSites } from '../../App/selectors';
import IndicationOverlay from '../../StudyPage/PatientDetail/IndicationOverlay';
import { editPatientSite } from '../actions';
import { selectPatientCategories, selectSavedPatient, selectProtocols } from '../selectors';
import formValidator from './validator';

const formName = 'PatientDatabase.EditPatientModal';

const mapStateToProps = createStructuredSelector({
  formValues: selectValues(formName),
  indications: selectIndications(),
  sources: selectSources(),
  patientCategories: selectPatientCategories(),
  savedPatient: selectSavedPatient(),
  hasError: selectSyncErrorBool(formName),
  sites: selectSiteLocations(),
  protocols: selectProtocols(),
  studies: selectStudiesFromSites(),
});

const mapDispatchToProps = dispatch => ({
  change: (name, value) => dispatch(change(formName, name, value)),
  editPatientSite: (site) => dispatch(editPatientSite(site)),
});

@reduxForm({ form: formName, validate: formValidator })
@connect(mapStateToProps, mapDispatchToProps)
class EditPatientForm extends Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    change: PropTypes.func.isRequired,
    editPatientSite: PropTypes.func.isRequired,
    indications: PropTypes.array,
    initialValues: PropTypes.object,
    loading: React.PropTypes.bool,
    submitting: React.PropTypes.bool,
    formValues: React.PropTypes.object,
    sources: PropTypes.array,
    patientCategories: PropTypes.object,
    savedPatient: PropTypes.object,
    sites: PropTypes.array,
    hasError: PropTypes.bool,
    onSubmit: PropTypes.func,
    protocols: PropTypes.object,
    studies: PropTypes.array,
  };

  constructor(props) {
    super(props);
    this.state = {
      showIndicationPopover: false,
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.renderIndications = this.renderIndications.bind(this);
    this.toggleIndicationPopover = this.toggleIndicationPopover.bind(this);
    this.deleteIndication = this.deleteIndication.bind(this);
    this.selectIndication = this.selectIndication.bind(this);
  }

  onSubmit(event) {
    event.preventDefault();
    const { onSubmit, formValues } = this.props;
    const formattedData = Object.assign({}, formValues);
    if (formValues.dobDay && formValues.dobMonth && formValues.dobYear) {
      const date = moment().year(formValues.dobYear).month(formValues.dobMonth - 1).date(formValues.dobDay).startOf('day');
      formattedData.dob = date.toISOString();
    }
    if (!this.props.hasError) {
      onSubmit(formattedData);
    }
  }

  deleteIndication(indication) {
    const { change, formValues: { indications } } = this.props;
    const newArr = _.remove(indications, (n) => (n.id !== indication.id));
    change('indications', newArr);
  }

  toggleIndicationPopover() {
    this.setState({
      showIndicationPopover: !this.state.showIndicationPopover,
    });
  }

  selectIndication(patientId, indication) {
    const { change, formValues } = this.props;
    change('indications', formValues.indications.concat([indication]));
  }

  renderIndications() {
    const { formValues } = this.props;
    if (formValues.indications) {
      return (
        <div className="category-list">
          {formValues.indications.map((indication) => (
            <div key={indication.id} className="category">
              <span className="link">
                <span className="text">{indication.name}</span>
                { !indication.isOriginal &&
                  <span
                    className="icomoon-icon_trash"
                    onClick={() => {
                      this.deleteIndication(indication);
                    }}
                  />
                }
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  }

  render() {
    const { formValues, formValues: { dobDay, dobMonth, dobYear }, indications, initialValues, sources, patientCategories, loading, submitting, savedPatient, studies, protocols } = this.props;
    const indicationOptions = map(indications, indicationIterator => ({
      label: indicationIterator.name,
      value: indicationIterator.id,
    }));

    const sourceOptions = map(sources, sourceIterator => ({
      label: sourceIterator.type,
      value: sourceIterator.id,
    }));
    const statusOptions = map(patientCategories.details, patientCategoryIterator => ({
      label: patientCategoryIterator.name,
      value: patientCategoryIterator.id,
    }));
    const genderOptions = [
      {
        label: 'Male',
        value: 'Male',
      }, {
        label: 'Female',
        value: 'Female',
      },
    ];
    const patientValues = {
      id: initialValues ? initialValues.id : null,
      indications: formValues.indications,
    };
    const protocolOptions = map(studies, studyIterator => {
      const protocol = _.find(protocols.details, { id: studyIterator.protocol_id });
      return {
        label: protocol.number,
        value: protocol.id,
      };
    });
    return (
      <Form className="form-lightbox form-edit-patient-information" onSubmit={this.onSubmit}>
        <div className="field-row form-group">
          <strong className="label required">
            <label>NAME</label>
          </strong>
          <div className="field">
            <div className="row">
              <div className="col pull-left">
                <Field
                  name="firstName"
                  component={Input}
                  type="text"
                  placeholder="First Name"
                  disabled={savedPatient.saving}
                />
              </div>
              <div className="col pull-right">
                <Field
                  name="lastName"
                  component={Input}
                  type="text"
                  placeholder="Last Name"
                  disabled={savedPatient.saving}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="field-row form-group">
          <strong className="label required">
            <label>Email</label>
          </strong>
          <Field
            name="email"
            component={Input}
            type="text"
            className="field"
            disabled={savedPatient.saving}
          />
        </div>
        <div className="field-row form-group">
          <strong className="label required">
            <label>Phone</label>
          </strong>
          <Field
            name="phone"
            component={Input}
            type="text"
            className="field"
            disabled={savedPatient.saving}
          />
        </div>
        <div className="field-row form-group patient-database-indication-hidden">
          <strong className="label">
            <label>Indications</label>
          </strong>
          <Field
            name="indications"
            component={ReactSelect}
            placeholder="Select Indication"
            options={indicationOptions}
            multi
            joinValues
            objectValue
            clearable={false}
            disabled={savedPatient.saving}
            className="multiSelectWrap field"
          />
        </div>
        <div className="field-row">
          <strong className="label">Indications</strong>
          <div
            className="field add-indications"
            ref={(parent) => (
                    this.parent = parent
                  )}
          >
            <Button
              bsStyle="primary"
              ref={(target) => (
                      this.target = target
                    )}
              onClick={this.toggleIndicationPopover}
            >
              + Add Indication
            </Button>
            <Overlay
              show={this.state.showIndicationPopover}
              placement="bottom"
              container={this.parent}
              target={() => this.target}
              rootClose
              onHide={() => { this.toggleIndicationPopover(); }}
            >
              <IndicationOverlay indications={indications} selectIndication={this.selectIndication} patient={patientValues} onClose={this.toggleIndicationPopover} />
            </Overlay>
          </div>
        </div>
        {
          this.props.formValues.indications && this.props.formValues.indications.length > 0 &&
          <div className="field-row remove-indication">
            <span className="label" />
            <div className="field">
              {this.renderIndications()}
            </div>
          </div>
        }
        <DateOfBirthPicker
          loading={loading}
          submitting={submitting}
          initialValues={initialValues}
          dobDay={dobDay}
          dobMonth={dobMonth}
          dobYear={dobYear}
        />
        <div className="field-row form-group">
          <strong className="label">
            <label>GENDER</label>
          </strong>
          <Field
            name="gender"
            component={ReactSelect}
            className="field"
            placeholder="Select Gender"
            options={genderOptions}
            disabled={savedPatient.saving}
          />
        </div>
        <div className="field-row form-group">
          <strong className="label">
            <label>BMI</label>
          </strong>
          <Field
            name="bmi"
            component={Input}
            className="field"
            type="text"
            disabled={savedPatient.saving}
          />
        </div>
        <div className="field-row form-group">
          <strong className="label">
            <label>STATUS</label>
          </strong>
          <div className="field">
            <Field
              name="status"
              component={ReactSelect}
              placeholder="Select Status"
              options={statusOptions}
              disabled
            />
          </div>
        </div>
        <div className="field-row form-group">
          <strong className="label">
            <label>Protocol</label>
          </strong>
          <Field
            name="protocol"
            component={ReactSelect}
            className="field"
            placeholder="Select Protocol"
            options={protocolOptions}
            disabled={initialValues && initialValues.source && initialValues.source.label === 'StudyKIK'}
          />
        </div>
        <div className="field-row form-group">
          <strong className="label">
            <label>Source</label>
          </strong>
          <Field
            name="source"
            component={ReactSelect}
            className="field"
            placeholder="Select Source"
            options={sourceOptions}
            disabled={(initialValues && initialValues.source && initialValues.source.label === 'StudyKIK') || !formValues.protocol || formValues.protocol === ''}
          />
        </div>
        <div className="field-row">
          <strong className="label" />
          <div className="field">
            <Field
              name="unsubscribed"
              type="checkbox"
              component={Checkbox}
              className="pull-left"
            />
            <label htmlFor="unsubscribed">Unsubscribe</label>
          </div>
        </div>
        <div className="btn-block text-right">
          <Button type="submit" className="btn-add-row" disabled={savedPatient.saving}>
            {savedPatient.saving
              ? <span><LoadingSpinner showOnlyIcon size={20} /></span>
              : <span>Submit</span>
            }
          </Button>
        </div>
      </Form>
    );
  }
}

export default EditPatientForm;

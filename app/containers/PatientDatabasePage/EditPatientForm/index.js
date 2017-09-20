import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Field, reduxForm, change, blur } from 'redux-form';
import _ from 'lodash';
import moment from 'moment-timezone';
import Button from 'react-bootstrap/lib/Button';
import Form from 'react-bootstrap/lib/Form';
import Overlay from 'react-bootstrap/lib/Overlay';

import { normalizePhoneDisplay } from '../../../../app/common/helper/functions';
import { selectValues, selectSyncErrorBool } from '../../../common/selectors/form.selector';
import DateOfBirthPicker from '../../../components/DateOfBirthPicker/index';
import Input from '../../../components/Input/index';
import ReactSelect from '../../../components/Input/ReactSelect';
import LoadingSpinner from '../../../components/LoadingSpinner';
import Checkbox from '../../../components/Input/Checkbox';
import { selectIndications, selectSiteLocations, selectSources, selectCurrentUser } from '../../App/selectors';
import IndicationOverlay from '../../StudyPage/PatientDetail/IndicationOverlay';
import { fetchFilteredProtcols, addPatientIndication, removePatientIndication, updatePatientIndication } from '../actions';
import { selectIsFetchingProtocols, selectPatientCategories, selectProtocols, selectSavedPatient } from '../selectors';
import formValidator from './validator';

const formName = 'PatientDatabase.EditPatientModal';

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser(),
  formValues: selectValues(formName),
  indications: selectIndications(),
  isFetchingProtocols: selectIsFetchingProtocols(formName),
  patientCategories: selectPatientCategories(),
  savedPatient: selectSavedPatient(),
  hasError: selectSyncErrorBool(formName),
  sites: selectSiteLocations(),
  sources: selectSources(),
  protocols: selectProtocols(formName),
});

const mapDispatchToProps = dispatch => ({
  addPatientIndication: (patientId, indicationId, studyId) => dispatch(addPatientIndication(patientId, indicationId, studyId)),
  blur: (field, value) => dispatch(blur(formName, field, value)),
  change: (name, value) => dispatch(change(formName, name, value)),
  removePatientIndication: (patientId, indicationId) => dispatch(removePatientIndication(patientId, indicationId)),
  updatePatientIndication: (patientId, indicationId, studyId) => dispatch(updatePatientIndication(patientId, indicationId, studyId)),
  fetchFilteredProtcols: (clientId, siteId) => dispatch(fetchFilteredProtcols(clientId, siteId)),
});

@reduxForm({ form: formName, validate: formValidator })
@connect(mapStateToProps, mapDispatchToProps)
class EditPatientForm extends Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    addPatientIndication: PropTypes.func.isRequired,
    blur: PropTypes.func.isRequired,
    currentUser: React.PropTypes.object,
    change: PropTypes.func.isRequired,
    formValues: React.PropTypes.object,
    fetchFilteredProtcols: React.PropTypes.func.isRequired,
    indications: PropTypes.array,
    initialValues: PropTypes.object,
    isFetchingProtocols: React.PropTypes.bool.isRequired,
    loading: React.PropTypes.bool,
    submitting: React.PropTypes.bool,
    patientCategories: PropTypes.object,
    protocols: PropTypes.array,
    removePatientIndication: PropTypes.func.isRequired,
    updatePatientIndication: PropTypes.func.isRequired,
    savedPatient: PropTypes.object,
    sites: PropTypes.array,
    sources: PropTypes.array,
    hasError: PropTypes.bool,
    onSubmit: PropTypes.func,
    handleSubmit: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      showIndicationPopover: false,
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.onPhoneBlur = this.onPhoneBlur.bind(this);
    this.deleteIndication = this.deleteIndication.bind(this);
    this.toggleIndicationPopover = this.toggleIndicationPopover.bind(this);
    this.selectIndication = this.selectIndication.bind(this);
    this.changeSiteLocation = this.changeSiteLocation.bind(this);
    this.selectProtocol = this.selectProtocol.bind(this);
    this.renderIndications = this.renderIndications.bind(this);
  }

  componentDidMount() {
    const { initialValues, fetchFilteredProtcols, currentUser } = this.props;
    if (initialValues.site) {
      fetchFilteredProtcols(currentUser.roleForClient.id, initialValues.site);
    }
  }

  componentWillUnmount() {
    // cleanup indication relation to restore isOriginal back to protocol's indication
    const { formValues, protocols, submitting, updatePatientIndication } = this.props;
    if (formValues.protocol && !submitting) {
      const protocol = _.find(protocols, { studyId: formValues.protocol });
      if (protocol) {
        const indication = _.find(formValues.indications, { id: protocol.indicationId });
        if (indication) {
          updatePatientIndication(formValues.id, indication.id, protocol.studyId);
        }
      }
    }
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

  onPhoneBlur(event) {
    const { blur } = this.props;
    const formattedPhoneNumber = normalizePhoneDisplay(event.target.value);
    blur('phone', formattedPhoneNumber);
  }

  selectIndication(patientId, indication) {
    const { change, formValues, addPatientIndication } = this.props;
    change('indications', formValues.indications.concat([indication]));
    addPatientIndication(patientId, indication.id, formValues.protocol);
  }

  deleteIndication(patientId, indication) {
    const { change, formValues: { indications }, removePatientIndication } = this.props;
    const newArr = _.remove(indications, (n) => (n.id !== indication.id));
    change('indications', newArr);
    removePatientIndication(patientId, indication.id);
  }

  toggleIndicationPopover() {
    this.setState({
      showIndicationPopover: !this.state.showIndicationPopover,
    });
  }

  changeSiteLocation(siteId) {
    if (siteId) {
      const { currentUser, fetchFilteredProtcols } = this.props;
      fetchFilteredProtcols(currentUser.roleForClient.id, siteId);
    } else {
      const { change } = this.props;
      // clear the protocol value if there is no site id
      change('protocol', null);
    }
  }

  selectProtocol(studyId) {
    if (studyId) {
      const { change, formValues, indications, protocols, addPatientIndication, updatePatientIndication } = this.props;
      const protocol = _.find(protocols, { studyId });
      const indicationInList = _.find(formValues.indications, { id: protocol.indicationId });
      if (indicationInList) {
        // if the indication exists, make sure we modify it as the original
        const indicationArray = formValues.indications.map(indication => ({
          ...indication,
          isOriginal: indication.id === indicationInList.id,
        }));
        change('indications', indicationArray);
        updatePatientIndication(formValues.id, protocol.indicationId, studyId);
      } else {
        const indication = _.find(indications, { id: protocol.indicationId });
        const formattedIndication = {
          id: indication.id,
          isOriginal: true,
          label: indication.name,
          name: indication.name,
          value: indication.id,
        };
        const indicationArray = formValues.indications.map(indication => ({
          ...indication,
          isOriginal: false,
        })).concat([formattedIndication]);
        change('indications', indicationArray);
        addPatientIndication(formValues.id, protocol.indicationId, studyId);
      }
    }
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
                      this.deleteIndication(formValues.id, indication);
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
    const { formValues, formValues: { dobDay, dobMonth, dobYear }, indications, initialValues, isFetchingProtocols, protocols, sites, sources, patientCategories, loading, submitting, savedPatient } = this.props;
    const indicationOptions = indications.map(indicationIterator => ({
      label: indicationIterator.name,
      value: indicationIterator.id,
    }));

    const siteOptions = sites.map(siteIterator => ({
      label: siteIterator.name,
      value: siteIterator.id,
    }));
    const protocolOptions = protocols.map(protocolIterator => ({
      label: protocolIterator.number,
      value: protocolIterator.studyId,
    }));
    const sourceOptions = sources.map(source => ({
      label: source.type,
      value: source.id,
    }));
    const statusOptions = patientCategories.details.map(patientCategoryIterator => ({
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
      id: formValues ? formValues.id : null,
      indications: formValues.indications,
    };
    return (
      <Form className="form-lightbox form-edit-patient-information" onSubmit={this.props.handleSubmit}>
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
            onBlur={this.onPhoneBlur}
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
            <label>* Site Location</label>
          </strong>
          <Field
            name="site"
            component={ReactSelect}
            className="field"
            placeholder="Select Site Location"
            options={siteOptions}
            onChange={this.changeSiteLocation}
            disabled={initialValues && initialValues.source && initialValues.source === 1}
          />
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
            onChange={this.selectProtocol}
            disabled={isFetchingProtocols || (initialValues && initialValues.source && initialValues.source === 1)}
          />
        </div>
        <div className="field-row form-group">
          <strong className="label">
            <label>* Source</label>
          </strong>
          <Field
            name="source"
            component={ReactSelect}
            className="field"
            placeholder="Select Source"
            options={sourceOptions}
            disabled={initialValues && initialValues.source && initialValues.source === 1}
          />
        </div>
        <div className="field-row">
          <strong className="label">
            <label htmlFor="unsubscribed">Unsubscribe</label>
          </strong>
          <div className="field">
            <Field
              name="unsubscribed"
              type="checkbox"
              component={Checkbox}
              className="pull-left"
            />
          </div>
        </div>
        <div className="btn-block text-right">
          <Button type="submit" className="btn-add-row" disabled={savedPatient.saving}>
            {savedPatient.saving
              ? <span><LoadingSpinner showOnlyIcon size={20} /></span>
              : <span>Update</span>
            }
          </Button>
        </div>
      </Form>
    );
  }
}

export default EditPatientForm;

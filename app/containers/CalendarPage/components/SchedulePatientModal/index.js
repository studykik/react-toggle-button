/* eslint-disable prefer-template, react/jsx-no-bind */

import React, { Component, PropTypes } from 'react';
import { Field, reduxForm } from 'redux-form';
import { Modal } from 'react-bootstrap';
import _ from 'lodash';
import moment from 'moment-timezone';

import { SchedulePatientModalType } from '../../../../common/constants';

import ReactSelect from '../../../../components/Input/ReactSelect';
import Checkbox from '../../../../components/Input/Checkbox';
import CenteredModal from '../../../../components/CenteredModal';

import validator from './validator';

@reduxForm({ form: 'schedulePatient', validate: validator })
export default class SchedulePatientModal extends Component {
  static propTypes = {
    currentUser: PropTypes.object.isRequired,
    siteLocationOptions: PropTypes.array.isRequired,
    isAdmin: PropTypes.bool.isRequired,
    sites: PropTypes.array.isRequired,
    indications: PropTypes.array.isRequired,
    protocols: PropTypes.array.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    handleCloseModal: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    modalType: PropTypes.string,
    selectedCellInfo: PropTypes.object.isRequired,
    patientsByStudy: PropTypes.object.isRequired,
    schedules: PropTypes.array.isRequired,
    fetchPatientsByStudy: PropTypes.func.isRequired,
    fetchingSites: PropTypes.bool,
    fetchingPatientsByStudy: PropTypes.bool.isRequired,
    initialize: PropTypes.func.isRequired,
    hourOptions: PropTypes.array,
    minuteOptions: PropTypes.array,
    periodOptions: PropTypes.array,
  };

  state = {
    siteLocation: null,
    protocol: null,
    patient: null,
    protocolOptions: [],
    patientOptions: [],
  }

  componentWillReceiveProps(nextProps) {
    const { siteLocationOptions, isAdmin } = this.props;

    if (this.props.modalType === SchedulePatientModalType.HIDDEN && nextProps.modalType === SchedulePatientModalType.CREATE) {
      let initialValues = { textReminder: true };

      if (!isAdmin) {
        const site = siteLocationOptions[0];
        if (this.state.siteLocation === null && site) {  // prevent recursive render
          if (site) {
            this.handleSiteLocationChoose(site);
            initialValues = {
              ...initialValues,
              siteLocation: site,   // manually set siteLocation form value
            };
          }
        }
      }
      nextProps.initialize(initialValues);
    } else if (nextProps.modalType === SchedulePatientModalType.HIDDEN) {
      this.setState({
        siteLocation: null,
        protocol: null,
        patient: null,
        protocolOptions: [],
        patientOptions: [],
      });
    }

    if (!nextProps.fetchingPatientsByStudy && nextProps.patientsByStudy !== this.props.patientsByStudy) {
      const patientOptions = _.flatten(nextProps.patientsByStudy.data.map(pBS => pBS.patients.map(p => ({
        label: `${p.firstName} ${p.lastName || ''}`,
        value: p.id,
      }))));
      const availablePatientOptions = _.differenceWith(patientOptions, this.props.schedules, (po, schedule) => po.value === schedule.patient_id);

      this.setState({
        patientOptions: availablePatientOptions,
      });
    }
  }

  handleSiteLocationChoose(siteLocationOption) {
    if (siteLocationOption) {
      const selectedSite = this.props.sites.filter(s => s.id === siteLocationOption.siteId)[0];
      if (!selectedSite) {
        throw new Error('SiteLocation options are not properly populated.');
      }

      const protocolOptions = selectedSite.studies.map(study => {
        const protocolNumber = _.find(this.props.protocols, { id: study.protocol_id });
        if (protocolNumber) {
          return {
            label: protocolNumber.number,
            value: protocolNumber.number,
            indication: _.find(this.props.indications, { id: study.indication_id }).name,
            studyId: study.id,
            siteId: siteLocationOption.siteId,
          };
        }
        return null;
      }).filter((item) => item);
      this.setState({
        siteLocation: siteLocationOption,
        protocol: null,
        patient: null,
        protocolOptions,
      });
    } else {
      this.setState({
        siteLocation: null,
        protocol: null,
        patient: null,
        protocolOptions: [],
        patientOptions: [],
      });
    }
  }

  handleProtocolChoose(protocolOption) {
    if (protocolOption) {
      this.props.fetchPatientsByStudy(protocolOption.studyId, protocolOption.siteId);
      this.setState({
        protocol: protocolOption,
        patient: null,
      });
    } else {
      this.setState({
        protocol: null,
        patient: null,
        patientOptions: [],
      });
    }
  }

  handlePatientChoose(patientOption) {
    if (patientOption) {
      this.setState({
        patient: patientOption,
      });
    } else {
      this.setState({
        patient: null,
      });
    }
  }

  render() {
    const {
      currentUser,
      siteLocationOptions,
      isAdmin,
      handleCloseModal,
      submitting,
      modalType,
      selectedCellInfo,
      hourOptions,
      minuteOptions,
      periodOptions,
      handleSubmit,
    } = this.props;

    const { protocolOptions, patientOptions } = this.state;

    return (
      <Modal dialogComponentClass={CenteredModal} show={modalType === SchedulePatientModalType.CREATE} onHide={handleCloseModal} id="add-schedule-modal">
        <Modal.Header>
          <Modal.Title>SCHEDULE PATIENT</Modal.Title>
          <a className="lightbox-close close" onClick={handleCloseModal}>
            <i className="icomoon-icon_close" />
          </a>
        </Modal.Header>
        <Modal.Body>
          <form className="form-lightbox form-add-schedule show-on-select" onSubmit={handleSubmit}>
            <div className="field-row">
              <strong className="label">* When</strong>
              <div className="field">
                <input type="text" className="form-control add-date scheduleTime" disabled value={selectedCellInfo.selectedDate && moment(selectedCellInfo.selectedDate).tz(currentUser.timezone).format('MM/DD/YY')} />
              </div>
            </div>
            <div className="field-row">
              <strong className="label required"><label htmlFor="patient-time">Time</label></strong>
              <div className="field">
                <div className="col-holder row">
                  <div className="col pull-left hours">
                    <Field
                      id="patient-time"
                      name="hour"
                      component={ReactSelect}
                      placeholder="Hours"
                      options={hourOptions}
                      className="visible-first-del min-height"
                      disabled={submitting}
                    />
                  </div>
                  <div className="col pull-left minutes">
                    <Field
                      id="minutes"
                      name="minute"
                      component={ReactSelect}
                      placeholder="Minutes"
                      options={minuteOptions}
                      className="visible-first-del min-height"
                      disabled={submitting}
                    />
                  </div>
                  <div className="col pull-left time-mode">
                    <Field
                      id="time-period"
                      name="period"
                      component={ReactSelect}
                      placeholder="AM/PM"
                      options={periodOptions}
                      className="visible-first"
                      disabled={submitting}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="field-row">
              <strong className="label required"><label htmlFor="popup-site-location">Site Location</label></strong>
              <div className="field site-location">
                <Field
                  name="siteLocation"
                  component={ReactSelect}
                  placeholder="Select Site Location"
                  options={siteLocationOptions}
                  className="data-search"
                  disabled={submitting || this.props.fetchingSites || !isAdmin}
                  objectValue
                  onChange={this.handleSiteLocationChoose.bind(this)}
                  selectedValue={this.state.siteLocation}
                />
              </div>
            </div>

            <div className="field-row">
              <strong className="label required"><label htmlFor="popup-protocol">protocol</label></strong>
              <div className="field protocol">
                <Field
                  id="popup-protocol"
                  name="protocol"
                  component={ReactSelect}
                  placeholder="Select Protocol"
                  options={protocolOptions}
                  className="data-search"
                  disabled={submitting || !this.state.siteLocation}
                  objectValue
                  onChange={this.handleProtocolChoose.bind(this)}
                  selectedValue={this.state.protocol}
                />
              </div>
            </div>

            <div className="field-row patient-name">
              <strong className="label required"><label htmlFor="patient">Patient</label></strong>
              <div className="field">
                <Field
                  id="patient"
                  name="patient"
                  component={ReactSelect}
                  placeholder="Select Patient"
                  options={patientOptions}
                  className="data-search"
                  disabled={submitting || this.props.fetchingPatientsByStudy || !this.state.protocol}
                  objectValue
                  onChange={this.handlePatientChoose.bind(this)}
                  selectedValue={this.state.patient}
                />
              </div>
            </div>

            <div className="field-row">
              <strong className="label">&nbsp;</strong>
              <Field
                id="text-reminder"
                name="textReminder"
                component={Checkbox}
                type="checkbox"
              />
              <label className="text-reminder-label" htmlFor="text-reminder">Text Reminder</label>
            </div>

            <div className="text-right">
              <input type="reset" className="btn btn-gray-outline hidden" value="reset" />
              <input type="submit" className="btn btn-default" value="Submit" disabled={submitting} />
            </div>
          </form>
        </Modal.Body>
      </Modal>
    );
  }
}

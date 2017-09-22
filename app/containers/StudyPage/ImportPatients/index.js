/**
 * Created by mike on 10/3/16.
 */

import React from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { toastr } from 'react-redux-toastr';
import Modal from 'react-bootstrap/lib/Modal';
import Form from 'react-bootstrap/lib/Form';
import CenteredModal from '../../../components/CenteredModal/index';
import LoadingSpinner from '../../../components/LoadingSpinner';
import sanitizeProps from '../../../utils/sanitizeProps';
import { submitPatientImport, clearForm } from '../actions';

@reduxForm({ form: 'importPatients' })
class ImportPatientsModal extends React.Component {
  static propTypes = {
    clientId: React.PropTypes.number,
    clearForm: React.PropTypes.func,
    fileUploaded: React.PropTypes.string,
    show: React.PropTypes.bool.isRequired,
    onHide: React.PropTypes.func.isRequired,
    toggleAddPatient: React.PropTypes.func.isRequired,
    studyId: React.PropTypes.number,
    submitPatientImport: React.PropTypes.func.isRequired,
    uploadStart: React.PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.uploadFile = this.uploadFile.bind(this);
    this.renderUpload = this.renderUpload.bind(this);
  }

  componentDidMount() {
  }

  uploadFile(event) {
    const { clientId, onHide, submitPatientImport, studyId } = this.props;
    // if the file is a csv
    if (event.target.files && (event.target.files[0].type === 'text/csv' || event.target.files[0].type === '' || event.target.files[0].type === 'application/vnd.ms-excel' || event.target.files[0].type === 'application/excel' || event.target.files[0].type === 'text/anytext' || event.target.files[0].type === 'application/vnd.msexcel' || event.target.files[0].type === 'text/comma-separated-values')) {
      const file = event.target.files[0];
      submitPatientImport(clientId, studyId, file, onHide);
    } else {
      // display error
      toastr.error('Wrong file type');
    }
  }

  renderUpload() {
    const { toggleAddPatient, uploadStart, fileUploaded } = this.props;
    if (uploadStart) {
      return (
        <div className="text-center" style={{ marginTop: '20px', marginBottom: '20px' }}>
          <p>
            <LoadingSpinner showOnlyIcon />
          </p>
          <p className="text-info spinner-text">
            Uploading CSV File...
          </p>
        </div>
      );
    }
    return (
      <div>
        <Form className="upload-patient-info">
          <div className="table">
            <div className="table-cell">
              <i className={fileUploaded ? 'icomoon-icon_check' : 'icomoon-arrow_up_alt'} />
              <span className="text coming-soon-old">Upload Patients</span>
              <span className="text coming-soon-new" />
            </div>
          </div>
        </Form>
        <span className="or">
          <span>or</span>
        </span>
        <a className="add-patient-info-import" onClick={toggleAddPatient}>
          <div className="table">
            <div className="table-cell">
              <i className="icomoon-icon_plus_alt" />
              <span className="text">Add Patient</span>
            </div>
          </div>
        </a>
      </div>
    );
  }

  render() {
    const { onHide, ...props } = this.props;
    const sanitizedProps = sanitizeProps(props);
    delete sanitizedProps.toggleAddPatient;
    delete sanitizedProps.toggleAddPatient;
    delete sanitizedProps.uploadStart;
    delete sanitizedProps.fileUploaded;
    delete sanitizedProps.clearForm;
    delete sanitizedProps.studyId;
    delete sanitizedProps.submitPatientImport;
    return (
      <Modal
        {...sanitizedProps}
        id="import-info"
        dialogComponentClass={CenteredModal}
        onHide={onHide}
        backdrop
        keyboard
      >
        <Modal.Header>
          <Modal.Title>
            <strong>Import</strong>
          </Modal.Title>
          <a className="close" onClick={onHide}>
            <i className="icomoon-icon_close" />
          </a>
        </Modal.Header>
        <Modal.Body>
          {this.renderUpload()}
        </Modal.Body>
      </Modal>
    );
  }
}
const mapStateToProps = (state) => (
  {
    clientId: state.global.userData.roleForClient.client.id,
    studyId: state.studyPage.studyId,
    uploadStart: state.studyPage.uploadStarted,
    fileUploaded: state.studyPage.fileUploaded,
  }
);

function mapDispatchToProps(dispatch) {
  return {
    submitPatientImport: (clientId, studyId, file, onClose) => dispatch(submitPatientImport(clientId, studyId, file, onClose)),
    clearForm: () => dispatch(clearForm()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ImportPatientsModal);

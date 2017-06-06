import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Modal from 'react-bootstrap/lib/Modal';
import moment from 'moment-timezone';
import CenteredModal from '../../../../components/CenteredModal/index';
import { AddNoteForm } from '../AdminDashboardNoteSearch/AddNoteForm';

class RowItem extends Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    item: PropTypes.object,
    editNote: PropTypes.func,
    deleteNote: PropTypes.func,
    editNoteProcess: PropTypes.object,
    hideParentModal: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = {
      addNoteModalOpen: false,
    };

    this.closeAddNoteModal = this.closeAddNoteModal.bind(this);
    this.openAddNoteModal = this.openAddNoteModal.bind(this);
    this.editNote = this.editNote.bind(this);
    this.deleteNote = this.deleteNote.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if ((!newProps.editNoteProcess.saving && this.props.editNoteProcess.saving) ||
      (!newProps.editNoteProcess.deleting && this.props.editNoteProcess.deleting)
    ) {
      this.closeAddNoteModal();
    }
  }

  closeAddNoteModal() {
    this.setState({ addNoteModalOpen: false });
    this.props.hideParentModal(false);
  }

  openAddNoteModal() {
    this.setState({ addNoteModalOpen: true });
    this.props.hideParentModal(true);
  }

  editNote(params) {
    this.props.editNote(params);
  }

  deleteNote(params) {
    this.props.deleteNote(params);
  }

  render() {
    const initialValues = {
      initialValues: {
        noteData: this.props.item.noteData,
        id: this.props.item.id,
      },
    };

    const nDate = moment(this.props.item.created).format('MM/DD/YY');
    const time = moment(this.props.item.created).format('hh:mm A');

    return (
      <tr>
        <td>
          {this.props.item.noteData}
        </td>
        <td>
          {nDate}
        </td>
        <td>
          {time}
        </td>
        <td>
          <a className="btn btn-primary btn-edit-site pull-right" onClick={this.openAddNoteModal}>
            <span>Edit</span>
          </a>
        </td>

        <Modal
          dialogComponentClass={CenteredModal}
          className="new-user"
          id="new-user"
          show={this.state.addNoteModalOpen}
          onHide={this.closeAddNoteModal}
          backdrop={false}
        >
          <Modal.Header>
            <Modal.Title>Edit Note</Modal.Title>
            <a className="lightbox-close close" onClick={this.closeAddNoteModal}>
              <i className="icomoon-icon_close" />
            </a>
          </Modal.Header>
          <Modal.Body>
            <div className="holder clearfix">
              <AddNoteForm
                {...initialValues}
                isEdit
                onSubmit={this.editNote}
                onDelete={this.deleteNote}
                saving={this.props.editNoteProcess.saving}
                deleting={this.props.editNoteProcess.deleting}
              />
            </div>
          </Modal.Body>
        </Modal>
      </tr>
    );
  }
}

const mapStateToProps = createStructuredSelector({
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RowItem);

import React, { Component, PropTypes } from 'react';
import Modal from 'react-bootstrap/lib/Modal';
import { Field, change } from 'redux-form';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import CenteredModal from '../../../components/CenteredModal/index';
import Checkbox from '../../../components/Input/Checkbox';
import { AddExposureLevelForm } from '../DashboardExposureLevelSearch/AddExposureLevelForm';

class RowItem extends Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    item: PropTypes.object,
    editLevel: PropTypes.func,
    deleteLevel: PropTypes.func,
    editLevelProcess: PropTypes.object,
    change: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = {
      addLevelModalOpen: false,
    };

    this.closeAddLevelModal = this.closeAddLevelModal.bind(this);
    this.openAddLevelModal = this.openAddLevelModal.bind(this);
    this.editLevel = this.editLevel.bind(this);
    this.deleteLevel = this.deleteLevel.bind(this);
    this.updateActive = this.updateActive.bind(this);
  }

  componentDidMount() {
    if (this.props.item.is_active) {
      this.props.change(`isActive-${this.props.item.id}`, true);
    }
  }

  componentWillReceiveProps(newProps) {
    if ((!newProps.editLevelProcess.saving && this.props.editLevelProcess.saving) ||
      (!newProps.editLevelProcess.deleting && this.props.editLevelProcess.deleting)
    ) {
      this.closeAddLevelModal();
    }
    if (newProps.item.is_active) {
      this.props.change(`isActive-${this.props.item.id}`, true);
    } else {
      this.props.change(`isActive-${this.props.item.id}`, false);
    }
  }

  closeAddLevelModal() {
    this.setState({ addLevelModalOpen: false });
  }

  openAddLevelModal() {
    this.setState({ addLevelModalOpen: true });
  }

  editLevel(params) {
    const newParam = params;
    newParam.price *= 100;
    this.props.editLevel(newParam);
  }

  updateActive() {

  }

  deleteLevel(params) {
    this.props.deleteLevel(params);
  }

  render() {
    const initialValues = {
      initialValues: {
        name: this.props.item.name,
        id: this.props.item.id,
        price: parseFloat(Math.round(this.props.item.price) / 100).toFixed(2),
        credits: this.props.item.credits,
        points: this.props.item.points,
        enrollPoints: this.props.item.enrollPoints,
        listingTypeId: this.props.item.listingTypeId,
        enrollmentTypeId: this.props.item.enrollmentTypeId,
        position: this.props.item.position,
        active: this.props.item.is_active,
      },
    };

    const formattedNumber = new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: 'USD',
      currencyDisplay: 'symbol',
    }).format(this.props.item.price / 100).replace(/[A-Z]*/, '');

    return (
      <tr>
        <td>
          {this.props.item.name}
        </td>
        <td>
          {formattedNumber}
        </td>
        <td>
          {this.props.item.credits}
        </td>
        <td>
          {this.props.item.points}
        </td>
        <td>
          {this.props.item.enrollPoints}
        </td>
        <td>
          {this.props.item.position}
        </td>
        <td>
          <Field
            name={`isActive-${this.props.item.id}`}
            type="checkbox"
            disabled
            component={Checkbox}
          />
        </td>
        <td>
          <a className="btn btn-primary btn-edit-site pull-right" onClick={this.openAddLevelModal}>
            <span>Edit</span>
          </a>
        </td>

        <Modal dialogComponentClass={CenteredModal} className="new-user" id="new-user" show={this.state.addLevelModalOpen} onHide={this.closeAddLevelModal}>
          <Modal.Header>
            <Modal.Title>Edit Exposure Level</Modal.Title>
            <a className="lightbox-close close" onClick={this.closeAddLevelModal}>
              <i className="icomoon-icon_close" />
            </a>
          </Modal.Header>
          <Modal.Body>
            <div className="holder clearfix">
              <AddExposureLevelForm
                {...initialValues}
                isEdit
                onSubmit={this.editLevel}
                onDelete={this.deleteLevel}
                saving={this.props.editLevelProcess.saving}
                deleting={this.props.editLevelProcess.deleting}
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
    change: (field, value) => dispatch(change('DashboardExposureLevel.LevelList', field, value)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RowItem);

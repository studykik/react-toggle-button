import _ from 'lodash';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Field, reduxForm } from 'redux-form';
import ReactSelect from '../../components/Input/ReactSelect';
import AddCouponModal from './AddCouponModal';
import TableActions from '../TableActions/index';

@reduxForm({ form: 'dashboardCouponForm' })

export class DashboardCouponSearch extends React.Component {
  static propTypes = {
    coupon: PropTypes.object,
    addCoupon: PropTypes.func,
    editCouponProcess: PropTypes.object,
  }

  constructor(props) {
    super(props);

    this.state = {
      addCouponModalOpen: false,
    };

    this.closeAddCouponModal = this.closeAddCouponModal.bind(this);
    this.showAddCouponModal = this.showAddCouponModal.bind(this);
    this.addCoupon = this.addCoupon.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (!newProps.editCouponProcess.saving && this.props.editCouponProcess.saving) {
      this.closeAddCouponModal();
    }
  }

  closeAddCouponModal() {
    this.setState({ addCouponModalOpen: false });
  }

  showAddCouponModal() {
    this.setState({ addCouponModalOpen: true });
  }

  addCoupon(props) {
    const data = props;

    if (data.type === 'amount') {
      data.amountOff = data.amount * 100;
    } else {
      data.percentOff = data.amount;
    }
    delete data.id;
    this.props.addCoupon(props);
  }

  render() {
    const initialValues = {
      code: null,
      isArchived: false,
      type: 'amount',
      validFrom: null,
      validTo: null,
    };
    const options = [];
    _.forEach(this.props.coupon.details, (item) => {
      options.push({
        label: item.code,
        value: item.id,
      });
    });

    return (
      <form action="#" className="form-search clearfix">
        <TableActions
          buttonClickAction={this.showAddCouponModal}
          buttonText="Add Coupon"
          filters={
            <div className="has-feedback">
              <Field
                name="coupon"
                component={ReactSelect}
                placeholder="Select Coupon"
                options={options}
              />
            </div>
          }
        />
        <AddCouponModal
          show={this.state.addCouponModalOpen}
          initialValues={initialValues}
          onHide={this.closeAddCouponModal}
          onShow={this.showAddCouponModal}
          handleSubmit={this.addCoupon}
          saving={this.props.editCouponProcess.saving}
        />
      </form>
    );
  }
}

const mapStateToProps = createStructuredSelector({
});
const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardCouponSearch);

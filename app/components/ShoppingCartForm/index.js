/**
 *
 * Shopping Cart Form
 *
 */

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { sumBy, map } from 'lodash';
import { Field, reduxForm, change } from 'redux-form';
import Button from 'react-bootstrap/lib/Button';
import Modal from 'react-bootstrap/lib/Modal';

import CenteredModal from '../../components/CenteredModal/index';
import Input from '../../components/Input';
import ReactSelect from '../../components/Input/ReactSelect';
import AddNewCardForm from '../../components/AddNewCardForm';
import { selectCouponId, selectTotal } from './selectors';
import { selectCoupon, selectCards, selectCurrentUserStripeCustomerId, selectSavedCard, selectCurrentUserClientId } from '../../containers/App/selectors';
import formValidator from './validator';
import LoadingSpinner from '../../components/LoadingSpinner';
import Money from '../../components/Money';
import { fetchCoupon, clearCoupon, fetchCards, saveCard } from '../../containers/App/actions';

const mapStateToProps = createStructuredSelector({
  clientId: selectCurrentUserClientId(),
  couponId: selectCouponId(),
  total: selectTotal(),
  coupon: selectCoupon(),
  cards: selectCards(),
  currentUserStripeCustomerId: selectCurrentUserStripeCustomerId(),
  savedCard: selectSavedCard(),
});

function mapDispatchToProps(dispatch) {
  return {
    fetchCoupon: (id) => dispatch(fetchCoupon(id)),
    clearCoupon: () => dispatch(clearCoupon()),
    fetchCards: (clientId, customerId) => dispatch(fetchCards(clientId, customerId)),
    saveCard: (clientId, customerId, cardData) => dispatch(saveCard(clientId, customerId, cardData)),
  };
}

@reduxForm({ form: 'shoppingCart', validate: formValidator })
@connect(mapStateToProps, mapDispatchToProps)

class ShoppingCartForm extends Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    clientId: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    currentUserStripeCustomerId: PropTypes.string,
    title: PropTypes.string,
    noBorder: PropTypes.bool,
    addOns: PropTypes.array.isRequired,
    couponId: PropTypes.string,
    total: PropTypes.string,
    coupon: PropTypes.object,
    showCards: PropTypes.bool,
    cards: PropTypes.object,
    savedCard: PropTypes.object,
    submitting: PropTypes.bool,
    fetchCoupon: PropTypes.func,
    clearCoupon: PropTypes.func,
    fetchCards: PropTypes.func,
    saveCard: PropTypes.func,
    validateAndSubmit: PropTypes.func,
    manualDisableSubmit: PropTypes.bool,
    showAddNewCard: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.onFetchCoupon = this.onFetchCoupon.bind(this);
    this.onSaveCard = this.onSaveCard.bind(this);
    this.openAddNewCardModal = this.openAddNewCardModal.bind(this);
    this.closeAddNewCardModal = this.closeAddNewCardModal.bind(this);
    this.onSelectCard = this.onSelectCard.bind(this);
    this.state = {
      addNewCardModalOpen: false,
      showLoading: props.submitting,
    };
  }

  componentWillMount() {
    if (this.props.showCards) {
      this.props.fetchCards(this.props.clientId, this.props.currentUserStripeCustomerId);
    }
  }

  componentWillReceiveProps(newProps) {
    this.changeHiddenTotal();

    if (!this.props.showCards) {
      return;
    }

    if (!newProps.savedCard.saving && this.props.savedCard.saving) {
      this.closeAddNewCardModal();
    }
    this.setState({ showLoading : newProps.submitting });
  }

  componentWillUnmount() {
    this.props.clearCoupon();
  }

  onSaveCard(params) {
    this.props.saveCard(this.props.clientId, this.props.currentUserStripeCustomerId, params);
  }

  onFetchCoupon() {
    this.props.fetchCoupon(this.props.couponId);
  }

  onSelectCard(value) {
    if (value === -1) {
      this.openAddNewCardModal();
      this.props.showAddNewCard();
    }
  }

  changeHiddenTotal() {
    const total = this.calculateTotal().total;
    this.props.dispatch(change('shoppingCart', 'total', total.toString()));
  }

  calculateTotal() {
    const { coupon, addOns } = this.props;
    const subTotal = sumBy(addOns, 'total');
    let discount = 0;
    if (coupon.details) {
      if (coupon.details.amount_off) {
        discount = coupon.details.amount_off;
      } else if (coupon.details.percent_off) {
        discount = subTotal * (coupon.details.percent_off / 100);
      }
    }
    const total = parseFloat((subTotal - discount).toFixed(2));

    return { subTotal, discount, total };
  }

  openAddNewCardModal() {
    this.setState({ addNewCardModalOpen: true });
  }

  closeAddNewCardModal() {
    this.setState({ addNewCardModalOpen: false });
  }

  render() {
    const title = this.props.title || 'Order Summary';
    const noBorderClassName = (this.props.noBorder) ? 'no-border' : '';
    const formClassName = `form-shopping-cart ${noBorderClassName}`;
    const { addOns, coupon, showCards, cards, submitting, validateAndSubmit, manualDisableSubmit } = this.props;
    const { subTotal, discount, total } = this.calculateTotal();
    let addOnsContent = null;

    if (addOns) {
      addOnsContent = addOns.map((product, index) => (
        <tr className="add-on" key={index}>
          <td>{product.title}</td>
          <td className="right"><Money value={product.price / 100} /></td>
          <td className="right">{product.quantity}</td>
          <td className="right"><Money value={product.total / 100} className="price" /></td>
        </tr>
      ));
    }
    let creditCardOptions = [];
    if (cards.details) {
      creditCardOptions = map(cards.details.data, cardIterator => ({
        label: `xxxx xxxx xxxx ${cardIterator.last4}`,
        value: cardIterator.id,
      }));
    }
    creditCardOptions = [{
      label: 'Add New Card',
      value: -1,
    }].concat(creditCardOptions);

    let cardsPanelContent = null;
    if (showCards) {
      cardsPanelContent = (
        <div className="card-selection">
          <div className="row">
            <div className="col-sm-12">
              <Field
                name="creditCard"
                component={ReactSelect}
                placeholder="Select Credit Card"
                options={creditCardOptions}
                disabled={cards.fetching || submitting}
                onChange={this.onSelectCard}
              />
              <Modal
                className="modal-add-new-card"
                show={this.state.addNewCardModalOpen}
                onHide={this.closeAddNewCardModal}
                dialogComponentClass={CenteredModal}
                backdrop
                keyboard
              >
                <Modal.Header>
                  <Modal.Title>Add New Card</Modal.Title>
                  <a className="lightbox-close close" onClick={this.closeAddNewCardModal}>
                    <i className="icomoon-icon_close" />
                  </a>
                </Modal.Header>
                <Modal.Body>
                  <AddNewCardForm onSubmit={this.onSaveCard} />
                </Modal.Body>
              </Modal>
            </div>
          </div>
        </div>
      );
    }

    return (
      <form className={formClassName}>
        <div className="shopping-cart order-summary order-summery scroll jcf--scrollabel">
          <div className="head">
            <h3>{title}</h3>
          </div>
          <div className="scroll-holder">
            <div className="table-holder">
              <table className="table-summary">
                <colgroup>
                  <col style={{ width: '44.2%' }} />
                  <col style={{ width: '22.6%' }} />
                  <col style={{ width: '13.6%' }} />
                  <col style={{ width: 'auto' }} />
                </colgroup>
                <thead>
                  <tr>
                    <th>PRODUCT <i className="caret-arrow" /></th>
                    <th className="right">PRICE <i className="caret-arrow" /></th>
                    <th className="right">QTY <i className="caret-arrow" /></th>
                    <th className="right">TOTAL <i className="caret-arrow" /></th>
                  </tr>
                </thead>
                <tbody>
                  {addOnsContent}
                </tbody>
              </table>
            </div>

            <div className="coupon-area">
              <Field
                name="couponId"
                component={Input}
                type="text"
                placeholder="Coupon"
                disabled={coupon.fetching || submitting}
              />
              <Button
                bsStyle="primary"
                className="coupon-btn"
                onClick={this.onFetchCoupon}
                disabled={coupon.fetching || submitting}
              >
                <span>Apply</span>
              </Button>
            </div>

            <div className="total clearfix">
              <span className="heading">Subtotal</span>
              <Money value={subTotal / 100} className="price subtotal-price" />
            </div>

            <div className="total discount clearfix">
              <span className="heading">discount</span>
              {coupon.fetching
                ? <span className="price">
                  <LoadingSpinner showOnlyIcon size={20} className="price" />
                </span>
                : <Money value={discount / 100} className="price discount-amount" />
              }
            </div>

            <div className="total grand-total clearfix">
              <strong className="heading">Total</strong>
              <Money value={total / 100} className="price total-price" />
            </div>

            <div className="total hidden-value">
              <Field
                name="total"
                component={Input}
                type="hidden"
              />
            </div>
            {cardsPanelContent}
            <Button
              disabled={coupon.fetching || cards.fetching || submitting || manualDisableSubmit}
              onClick={(ev) => {
                this.setState({ showLoading: true });
                validateAndSubmit(ev);
              }}
            >
              <span>Submit</span>
              {(manualDisableSubmit) &&
                <span className="pull-right"><LoadingSpinner showOnlyIcon size={20} /></span>
              }
            </Button>
          </div>
        </div>
      </form>
    );
  }
}

export default ShoppingCartForm;

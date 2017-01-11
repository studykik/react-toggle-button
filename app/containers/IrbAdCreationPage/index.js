/*
 *
 * IrbAdCreationPage
 *
 */

import React, { PropTypes } from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { StickyContainer, Sticky } from 'react-sticky';
import { createStructuredSelector } from 'reselect';
import { touch } from 'redux-form';
import IrbAdCreationForm from 'components/IrbAdCreationForm';
import ShoppingCartForm from 'components/ShoppingCartForm';
import { selectIrbAdCreationFormValues, selectIrbAdCreationFormError } from 'components/IrbAdCreationForm/selectors';
import { fields as irbAdCreationFields } from 'components/IrbAdCreationForm/validator';
import { selectIrbProductList, selectIrbAdCreationDetail } from 'containers/IrbAdCreationPage/selectors';
import { submitForm, fetchIrbProductList, fetchIrbAdCreation } from 'containers/IrbAdCreationPage/actions';
import { selectShoppingCartFormError, selectShoppingCartFormValues } from 'components/ShoppingCartForm/selectors';
import { shoppingCartFields } from 'components/ShoppingCartForm/validator';

import {
  fetchSites,
  fetchIndications,
} from 'containers/App/actions';
import {
  selectSiteLocations,
  selectIndications,
  selectCurrentUser,
} from 'containers/App/selectors';

import _ from 'lodash';

export class IrbAdCreationPage extends React.Component { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    siteLocations: PropTypes.array,
    indications: PropTypes.array,
    submitForm: PropTypes.func.isRequired,
    fetchSites: PropTypes.func,
    fetchIndications: PropTypes.func,
    formValues: PropTypes.object,
    hasError: PropTypes.bool,
    currentUser: PropTypes.object,
    productList: PropTypes.array,
    irbAdCreationDetail: PropTypes.object,
    params: PropTypes.object,
    shoppingCartFormValues: PropTypes.object,
    shoppingCartFormError: PropTypes.object,
    fetchProductList: PropTypes.func,
    fetchIrbAdCreation: PropTypes.func,
    touchIrbAdCreation: PropTypes.func,
    touchShoppingCart: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.submitForm = this.props.submitForm.bind(this);
    this.onSubmitForm = this.onSubmitForm.bind(this);

    if (!isNaN(props.params.id)) {
      this.props.fetchIrbAdCreation(props.params.id);
    }
  }

  componentDidMount() {
    this.props.fetchSites();
    this.props.fetchIndications();
    this.props.fetchProductList();
  }

  onSubmitForm() {
    const { hasError, shoppingCartFormValues, shoppingCartFormError, touchIrbAdCreation, touchShoppingCart } = this.props;
    if (hasError || shoppingCartFormError) {
      touchIrbAdCreation();
      touchShoppingCart();
      return;
    }

    const siteLocation = _.find(this.props.siteLocations, { id: this.props.formValues.siteLocation });
    const indication = _.find(this.props.indications, { id: this.props.formValues.indication_id });
    this.submitForm(shoppingCartFormValues, {
      ...this.props.formValues,
      siteLocationName: siteLocation.name,
      indicationName: indication.name,
      user_id: this.props.currentUser.id,
      stripeProductId: this.props.productList[0].stripeProductId,
      stripeCustomerId: this.props.currentUser.roleForClient.client.stripeCustomerId,
    });
  }

  render() {
    const { siteLocations, indications, productList, irbAdCreationDetail } = this.props;

    if (productList[0]) {
      const addOns = [{
        title: productList[0].name,
        price: productList[0].price * 100,
        quantity: 1,
        total: productList[0].price * 100,
      }];

      return (
        <StickyContainer className="container-fluid">
          <Helmet title="Order IRB Ad Creation - StudyKIK" />
          <section className="study-portal">
            <h2 className="main-heading">ORDER IRB AD CREATION</h2>
            <div className="form-study row">
              <div className="col-xs-6 form-holder">
                <IrbAdCreationForm
                  siteLocations={siteLocations}
                  indications={indications}
                  initialValues={irbAdCreationDetail}
                />
              </div>

              <div className="fixed-block">
                <div className="fixed-block-holder">
                  <div className="order-summery-container">
                    <Sticky className="sticky-shopping-cart">
                      <ShoppingCartForm showCards addOns={addOns} validateAndSubmit={this.onSubmitForm} />
                    </Sticky>
                  </div>
                </div>
              </div>

            </div>
          </section>
        </StickyContainer>
      );
    }
    return <div></div>;
  }
}

const mapStateToProps = createStructuredSelector({
  siteLocations : selectSiteLocations(),
  indications   : selectIndications(),
  formValues: selectIrbAdCreationFormValues(),
  hasError: selectIrbAdCreationFormError(),
  currentUser: selectCurrentUser(),
  productList: selectIrbProductList(),
  irbAdCreationDetail: selectIrbAdCreationDetail(),
  shoppingCartFormValues: selectShoppingCartFormValues(),
  shoppingCartFormError: selectShoppingCartFormError(),
});

function mapDispatchToProps(dispatch) {
  return {
    fetchSites:       () => dispatch(fetchSites()),
    fetchIndications: () => dispatch(fetchIndications()),
    fetchProductList: () => dispatch(fetchIrbProductList()),
    fetchIrbAdCreation: (id) => dispatch(fetchIrbAdCreation(id)),
    submitForm:     (cartValues, formValues) => dispatch(submitForm(cartValues, formValues)),
    touchIrbAdCreation: () => dispatch(touch('irbAdCreation', ...irbAdCreationFields)),
    touchShoppingCart: () => dispatch(touch('shoppingCart', ...shoppingCartFields)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(IrbAdCreationPage);

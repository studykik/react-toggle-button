import React, { PropTypes } from 'react';
import { Field, reduxForm, change } from 'redux-form';
import inViewport from 'in-viewport';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { toastr } from 'react-redux-toastr';

import ClinicalTrialsSearchFormValidator from './validator';
import ReactSelect from '../../../app/components/Input/ReactSelect';
import Input from '../../../app/components/Input';
import { selectSyncErrors } from '../../../app/common/selectors/form.selector';
import { getPostalCodePattern } from '../../../app/common/helper/functions';
import { translate } from '../../../common/utilities/localization';

const formName = 'find-studies';
@reduxForm({
  form: formName,
  validate: ClinicalTrialsSearchFormValidator,
})

export class ClinicalTrialsSearchForm extends React.Component { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    indications: PropTypes.array,
    individual: PropTypes.bool,
    countryCode: PropTypes.string,
    indication: PropTypes.string,
    initialValues: PropTypes.object,
    formErrors: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.watcher = null;

    this.onSubmit = this.onSubmit.bind(this);
    this.setVisible = this.setVisible.bind(this);
    this.state = {
      countryCode: props.initialValues.countryCode ? props.initialValues.countryCode : 'us',
    };
    change('find-studies', 'countryCode', this.state.countryCode);
  }

  componentDidMount() {
    this.watcher = inViewport(this.animatedForm, this.setVisible);
  }

  componentWillUnmount() {
    this.watcher.dispose();
  }

  onSubmit(ev) {
    ev.preventDefault();
    const { formErrors, handleSubmit } = this.props;
    if (Object.keys(formErrors).length) {
      if (formErrors.postalCode) {
        toastr.error('', formErrors.postalCode);
      }
      return;
    }
    handleSubmit(ev);
  }

  setVisible(el) {
    const viewAtr = el.getAttribute('data-view');
    el.classList.add('in-viewport', viewAtr);
  }


  render() {
    const {
      indications,
      individual,
    } = this.props;
    const distances = [
      { id: 10, name: translate('corporate.page.home.searchForm.distancesDropdownTitle', { miles: 10 }) },
      { id: 50, name: translate('corporate.page.home.searchForm.distancesDropdownTitle', { miles: 50 }) },
      { id: 100, name: translate('corporate.page.home.searchForm.distancesDropdownTitle', { miles: 100 }) },
      { id: 250, name: translate('corporate.page.home.searchForm.distancesDropdownTitle', { miles: 250 }) },
    ];

    const countries = [
      {
        name: translate('corporate.page.home.searchForm.countriesDropdownList.br'),
        id: 'br',
      },
      {
        name: translate('corporate.page.home.searchForm.countriesDropdownList.ca'),
        id: 'ca',
      },
      {
        name: translate('corporate.page.home.searchForm.countriesDropdownList.cz'),
        id: 'cz',
      },
      {
        name: translate('corporate.page.home.searchForm.countriesDropdownList.fr'),
        id: 'fr',
      },
      {
        name: translate('corporate.page.home.searchForm.countriesDropdownList.de'),
        id: 'de',
      },
      {
        name: translate('corporate.page.home.searchForm.countriesDropdownList.hu'),
        id: 'hu',
      },
      {
        name: translate('corporate.page.home.searchForm.countriesDropdownList.it'),
        id: 'it',
      },
      {
        name: translate('corporate.page.home.searchForm.countriesDropdownList.jp'),
        id: 'jp',
      },
      {
        name: translate('corporate.page.home.searchForm.countriesDropdownList.pl'),
        id: 'pl',
      },
      {
        name: translate('corporate.page.home.searchForm.countriesDropdownList.uk'),
        id: 'uk',
      },
      {
        name: translate('corporate.page.home.searchForm.countriesDropdownList.us'),
        id: 'us',
      },
    ];

    const localeIndications = indications.map(indication => ({
      id: indication.id,
      name: translate(`common.indication.id${indication.id}`),
    }));

    if (localeIndications.length > 0 && localeIndications[0].id !== -1) {
      localeIndications.unshift({ id: -1, name: 'All' });
    }
    const isUS = this.state.countryCode === 'us';
    const countryCode = this.state.countryCode ? this.state.countryCode : '';
    const pattern = getPostalCodePattern(countryCode);
    const reg = new RegExp(pattern);
    const postal = value => (value && !reg.test(value) ? translate('corporate.page.home.searchForm.invalidPostalCodeMessage') : undefined);

    return (
      <form
        ref={(animatedForm) => { this.animatedForm = animatedForm; }}
        className="form-find-studies"
        data-formvalidation=""
        data-view="fadeInUp"
        onSubmit={this.onSubmit}
      >
        <div className="field-row">
          <div className={classNames({ row: !isUS })}>
            {
              !isUS &&
              <div className="col-xs-6">
                <Field
                  name="countryCode"
                  component={ReactSelect}
                  placeholder={translate('corporate.page.home.searchForm.placeholder1')}
                  options={countries}
                  className="field-lg country-code"
                  selectedValue={this.state.countryCode}
                  onChange={countryCode => {
                    if (countryCode) {
                      this.setState({ countryCode }, () => {
                        let path = '';
                        if (countryCode !== 'us') {
                          path += `/${countryCode}`;
                        }
                        if (individual) {
                          path += `/indication/${this.props.indication}`;
                        }
                        window.location.href = path;
                      });
                    }
                  }}
                />
              </div>
            }
            <div className={classNames({ 'col-xs-6': !isUS })}>
              <Field
                name="postalCode"
                type="text"
                validate={postal}
                component={Input}
                placeholder={translate('corporate.page.home.searchForm.placeholder2')}
                className="field-row"
                bsClass="form-control input-lg"
              />
            </div>
          </div>
        </div>
        <div className="field-row">
          <Field
            name="distance"
            component={ReactSelect}
            placeholder={translate('corporate.page.home.searchForm.placeholder3')}
            options={distances}
            className="field-lg"
            mobileEnabled
          />
        </div>
        {
          !individual &&
          <div className="field-row">
            <Field
              name="indicationId"
              component={ReactSelect}
              placeholder={translate('corporate.page.home.searchForm.placeholder4')}
              options={localeIndications}
              className="field-lg"
              mobileEnabled
            />
          </div>
        }
        <div className="field-row">
          <input
            type="submit"
            className="btn btn-default btn-block input-lg"
            value={translate('corporate.page.home.searchForm.submitButtonText')}
          />
        </div>
      </form>
    );
  }
}


const mapStateToProps = createStructuredSelector({
  formErrors: selectSyncErrors(formName),
});

export default connect(mapStateToProps, null)(ClinicalTrialsSearchForm);

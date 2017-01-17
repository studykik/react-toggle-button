import React, { Component, PropTypes } from 'react';
import Form from 'react-bootstrap/lib/Form';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Button from 'react-bootstrap/lib/Button';
import { Field, reduxForm } from 'redux-form';
import { map } from 'lodash';

import Input from 'components/Input';
import ReactSelect from 'components/Input/ReactSelect';
import { selectSearchProtocolsFormError } from './selectors';
import { selectProtocols, selectProtocolNumbers, selectIndications } from 'containers/HomePage/selectors';
import formValidator from './validator';
import LoadingSpinner from 'components/LoadingSpinner';

const mapStateToProps = createStructuredSelector({
  // clientSites: selectClientSites(),
  protocols: selectProtocols(),
  protocolNumbers: selectProtocolNumbers(),
  indications: selectIndications(),
  hasError: selectSearchProtocolsFormError(),
});

@reduxForm({ form: 'searchProtocols', validate: formValidator })
@connect(mapStateToProps, null)

class SearchProtocolsForm extends Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    // clientSites: PropTypes.object,
    protocols: PropTypes.object,
    protocolNumbers: PropTypes.object,
    indications: PropTypes.object,
    hasError: PropTypes.bool,
    handleSubmit: PropTypes.func,
  };

  render() {
    const { protocols, hasError, handleSubmit, protocolNumbers, indications } = this.props;
    const protocolNumberOptions = [{ label: 'All', value: null }].concat(map(protocolNumbers.details, row => ({
      label: row.protocolNumber,
      value: row.protocolNumber,
    })));
    const indicationOptions = [{ label: 'All', value: null }].concat(map(indications.details, row => ({
      label: row.name,
      value: row.id,
    })));

    return (
      <Form className="form-search form-search-protocols pull-left" onSubmit={handleSubmit}>
        <div className="fields-holder clearfix">
          <div className="search-area pull-left">
            <div className="field">
              <Button className="btn-enter" type="submit">
                <i className="icomoon-icon_search2" />
              </Button>
              <Field
                name="search"
                component={Input}
                type="text"
                className="keyword-search"
                placeholder="Search..."
                disabled={protocols.fetching}
              />
            </div>
          </div>
          <div className="pull-left custom-select">
            <Field
              name="protocol"
              component={ReactSelect}
              placeholder="Select Protocol"
              options={protocolNumberOptions}
              disabled={protocols.fetching}
            />
          </div>
          <div className="pull-left custom-select">
            <Field
              name="indication"
              component={ReactSelect}
              placeholder="Select Indication"
              options={indicationOptions}
              disabled={protocols.fetching}
            />
          </div>
          <div className="hidden">
            <button type="submit" className="btn btn-primary btn-search" disabled={protocols.fetching || hasError}>
              {(protocols.fetching)
                ? <LoadingSpinner showOnlyIcon size={20} />
                : <span>Search</span>
              }
            </button>
          </div>
        </div>
      </Form>
    );
  }
}

export default SearchProtocolsForm;
/**
*
* Input
*
*/

/**
 * Input element for redux-form
 *
 * Not only supports <input> (text, email, password)
 * But also <select> and <textarea>
 */
import React, { PropTypes } from 'react';
import { FormControl, OverlayTrigger, Tooltip } from 'react-bootstrap';
import classNames from 'classnames';

function Input({
  input,
  name,
  type,
  placeholder,
  componentClass,
  className,
  meta: { touched, error, active },
  children,
}) {
  const hasError = touched && error && !active;
  const errorClass = hasError ? 'has-error' : '';

  const tooltip = (
    <Tooltip
      id={`${name}-tooltip`}
      className="tooltip-error"
    >
      {error}
    </Tooltip>
  );
  let inputComponent = (
    <FormControl
      {...input}
      type={type}
      placeholder={placeholder}
      componentClass={componentClass} // Default value is `input`
    >
      {children}
    </FormControl>
  );

  if (hasError) {
    inputComponent = (
      <OverlayTrigger
        placement="right"
        overlay={tooltip}
      >
        {inputComponent}
      </OverlayTrigger>
    );
  }

  return (
    <div className={classNames([className, errorClass].join(' '))}>
      {inputComponent}
    </div>
  );
}

Input.propTypes = {
  input: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  meta: PropTypes.object.isRequired,
  type: PropTypes.string,
  componentClass: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.array,
};

export default Input;
import { validatorFactory } from '../../../utils/reduxForm';

const schema = {
  firstName: {
    presence: {
      message: '^First name cannot be blank',
    },
  },
  lastName: {
    presence: {
      message: '^Last name cannot be blank',
    },
  },
  email: {
    presence: {
      message: '^Email cannot be blank',
    },
    email: {
      message: '^Email not valid',
    },
    emailDomain : {
      message: '^Invalid Email domain',
    },
  },
  phone: {
    presence: {
      message: '^Phone number cannot be blank',
    },
    format: {
      // must be a phone in the format of (123) 456-7890 or E.164 format phone numbers
      pattern: '^\\(\\d{3}\\)\\s?\\d{3}\\-\\d{4}|\\+?[1-9]\\d{1,14}$',
      message: 'Invalid phone number',
    },
  },
  indication: { presence: false },
  age: { presence: false },
  gender: { presence: false },
  bmi: { presence: false },
  site: { presence: true },
  status: { presence: false },
  source: { presence: true },
};

export default validatorFactory(schema);

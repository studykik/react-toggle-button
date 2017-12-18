import { validatorFactory } from '../../../utils/reduxForm';

const schema = {
  firstName: { presence: true },
  lastName: { presence: true },
  email: { presence: true, email: true, emailDomain: true },
  phone: {
    format: {
      // must be a phone in the format of (123) 456-7890 or E.164 format phone numbers
      pattern: '^\\(\\d{3}\\)\\s?\\d{3}\\-\\d{4}|\\+?[1-9]\\d{1,14}$',
      message: 'Invalid phone number',
    },
  },
  role: { presence: true },
};

export default validatorFactory(schema);

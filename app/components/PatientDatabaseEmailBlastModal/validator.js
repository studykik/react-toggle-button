import { validatorFactory } from '../../utils/reduxForm';

const schema = {
  message: { presence: { message: '^Error! Message is required.' } },
  email: {
    presence: {
      message: '^Error! Email is required.',
    },
    email: {
      message: '^Error! Invalid email.',
    },
    emailDomain: {
      message: '^Error! Invalid email domain.',
    },
  },
  subject: { presence: { message: '^Error! Subject is required.' } },
  patients: { presence: { message: '^Error! No patients selected.' } },
};

export default validatorFactory(schema);

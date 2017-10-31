import { validatorFactory } from '../../../app/utils/reduxForm';

const schema = {
  email: { presence: true, email: true, emailDomain: true },
  password: { presence: true },
};

export default validatorFactory(schema);

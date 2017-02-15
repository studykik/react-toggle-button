import { validatorFactory } from '../../../app/utils/reduxForm';

const schema = {
  name: { presence: true },
  email: { presence: true, email: true },
  phone: { presence: true },
};

export default validatorFactory(schema);

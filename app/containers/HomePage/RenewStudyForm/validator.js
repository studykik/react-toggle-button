import { validatorFactory } from 'utils/reduxForm';

const schema = {
  exposureLevel: { presence: true },
  campaignLength: { presence: true },
  patientMessagingSuite: { presence: false },
  callTracking: { presence: false },
  startDate: { presence: true },
  notes: { presence: false },
};

export default validatorFactory(schema);
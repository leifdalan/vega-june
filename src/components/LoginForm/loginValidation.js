import memoize from 'lru-memoize';
import { createValidator, required, email } from 'utils/validation';

const loginValidation = createValidator({
  password: required
});
export default memoize(10)(loginValidation);

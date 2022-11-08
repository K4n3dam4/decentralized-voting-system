import { i18n } from 'next-i18next';

// Regex
const pwRegex = new RegExp('^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\\d]){1,})(?=(.*[\\W]){1,})(?!.*\\s).{8,}$');
const emailRegex = new RegExp('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$');

/**
 * Validation factory
 * @param fields
 * @param validationTypes
 */
export const validationFactory = ({ fields, validationTypes }: validationFactoryParams) =>
  Object.entries(fields).map(([key, value]) => ({
    field: key,
    value,
    validationType: validationTypes.find((type) => {
      if (type.field === key) {
        delete type.field;
        return type;
      }
    })?.validationType,
  }));

/**
 * Validate input fields
 * @param params
 */
const validate = (params: ValidateParam[]) => {
  const errors: { [k: string]: string } = {};
  let hasErrors = false;

  const setError = (field: string, msg: string) => {
    errors[field] = msg;
    hasErrors = true;
  };

  params.forEach(({ field, value, validationType }) => {
    if (validationType.includes('notEmpty')) {
      if (!value) setError(field, i18n.t('error.validate.notEmpty'));
    }

    if (validationType.includes('password')) {
      if (!pwRegex.test(value)) setError(field, i18n.t('error.validate.password'));
    }

    if (validationType.includes('string')) {
      if (typeof value !== 'string') setError(field, i18n.t('error.validate.string'));
    }

    if (validationType.includes('passwordRepeat')) {
      const password = params.find(({ field }) => field === 'password');
      if (!password || password.value !== value) setError(field, i18n.t('error.validate.passwordRepeat'));
    }

    if (validationType.includes('email')) {
      if (!emailRegex.test(value)) setError(field, i18n.t('error.validate.email'));
    }
  });

  return { errors, hasErrors };
};

export default validate;

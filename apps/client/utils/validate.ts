const pwRegex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[@$!%*?&])[A-Za-zd@$!%*?&]{8,}$');
const emailRegex = new RegExp('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$');

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

const validate = (params: ValidateParam[]) => {
  const errors: { [k: string]: string } = {};
  let hasErrors = false;

  const setError = (field: string, msg: string) => {
    errors[field] = msg;
    hasErrors = true;
  };

  params.forEach(({ field, value, validationType }) => {
    if (validationType.includes('notEmpty')) {
      if (!value) setError(field, 'This field must not be empty.');
    }

    if (validationType.includes('password')) {
      if (!pwRegex.test(value))
        setError(
          field,
          'Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character.',
        );
    }

    if (validationType.includes('string')) {
      if (typeof value !== 'string') setError(field, 'You entered invalid characters.');
    }

    if (validationType.includes('passwordRepeat')) {
      const password = params.find(({ field }) => field === 'password');
      if (!password || password.value !== value) setError(field, 'Passwords do not match.');
    }

    if (validationType.includes('email')) {
      if (!emailRegex.test(value)) setError(field, 'Please enter a valid email.');
    }
  });

  if (hasErrors) return { errors, hasErrors };
};

export default validate;

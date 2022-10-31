import create from 'zustand';
import { devtools } from 'zustand/middleware';
import makeRequest from '../utils/makeRequest';
import validate, { validationFactory } from '../utils/validate';

interface AuthStore {
  firstName: string;
  lastName: string;
  street: string;
  postalCode: string;
  city: string;
  ssn: string;
  email: string;
  password: string;
  passwordRepeat: string;
  setRegister: (key: string, value: string) => void;
  register: () => Promise<void>;
  setLogin: (key: string, value: string) => void;
  errors: { [k: string]: string };
  setErrors: (errors: Record<string, any>) => void;
  setError: (field?: string, error?: string) => void;
}

const useAuthStore = create<AuthStore>()(
  devtools(
    (set, get) => ({
      firstName: '',
      lastName: '',
      street: '',
      postalCode: '',
      city: '',
      ssn: '',
      email: '',
      password: '',
      passwordRepeat: '',
      errors: {},
      setErrors: (errors: Record<string, string>) => set({ errors }),
      setError: (field?: string, error?: string) => {
        const errors = get().errors;
        if (!error) {
          delete errors[field];
        } else {
          errors[field] = error;
        }
        set({ errors });
      },
      setRegister: (key, value) => set({ [key]: value }),
      register: async () => {
        const { firstName, lastName, street, postalCode, city, ssn, email, password, passwordRepeat } = get();
        const factory: validationFactoryParams = {
          fields: { firstName, lastName, street, postalCode, city, ssn, email, password, passwordRepeat },
          validationTypes: [
            { field: 'firstName', validationType: ['notEmpty'] },
            { field: 'lastName', validationType: ['notEmpty'] },
            { field: 'street', validationType: ['notEmpty'] },
            { field: 'postalCode', validationType: ['notEmpty'] },
            { field: 'city', validationType: ['notEmpty'] },
            { field: 'ssn', validationType: ['notEmpty'] },
            { field: 'email', validationType: ['notEmpty', 'email'] },
            { field: 'password', validationType: ['notEmpty', 'password'] },
            { field: 'passwordRepeat', validationType: ['notEmpty', 'passwordRepeat'] },
          ],
        };
        const validation = validate(validationFactory(factory));

        if (validation.hasErrors) {
          set({ errors: validation.errors });
        }

        // const errors = validate(validation);

        try {
          const res = await makeRequest(
            { url: 'auth/signin', method: 'POST', data: { email: 'ewji@ew.de', password: 'wejewioj' } },
            {},
          );
          console.log(res);
        } catch (error) {
          console.error(error);
        }
      },
      setLogin: (key, value) => set({ [key]: value }),
    }),
    { name: 'DVS-AuthStore' },
  ),
);

export default useAuthStore;

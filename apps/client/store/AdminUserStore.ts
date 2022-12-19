import { NextRouter } from 'next/router';
import { DVSToastOptions } from '../components/atoms/DVSToast';
import create from 'zustand';
import { devtools } from 'zustand/middleware';
import validate, { validationFactory } from '../utils/validate';

interface State {
  displayAuth: 'register' | 'login';

  firstName: string;
  lastName: string;
  street: string;
  postalCode: number;
  city: string;
  ssn: string;
  email: string;
  password: string;
  passwordRepeat: string;

  errors: { [k: string]: string };
}

interface Actions {
  setUser: (key: string, value: string | number) => void;
  register: (router: NextRouter, showToast: (options: DVSToastOptions) => void) => Promise<void>;

  setErrors: (errors: Record<string, any>) => void;
  setError: (field?: string, error?: string) => void;

  reset: VoidFunction;
}

const initialState: State = {
  displayAuth: 'register',

  firstName: '',
  lastName: '',
  street: '',
  postalCode: undefined,
  city: '',
  ssn: '',
  email: '',
  password: '',
  passwordRepeat: '',

  errors: {},
};

const useAdminUserStore = create<State & Actions>()(
  devtools(
    (set, get) => ({
      ...initialState,

      setUser: (key, value) => set({ [key]: value }),
      register: async (router: NextRouter, showToast: (options: DVSToastOptions) => void) => {
        const { firstName, lastName, street, postalCode, city, ssn, email, password, passwordRepeat } = get();
        const dto: VoterSignup = { firstName, lastName, street, postalCode, city, ssn, email, password };
        const factory: validationFactoryParams = {
          fields: { ...dto, passwordRepeat },
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
          return;
        }

        // try {
        //   const { data } = await makeRequest<Access, VoterSignup>({ url: 'auth/signup', method: 'POST', data: dto });
        //   const { access_token } = data;
        //   if (access_token) {
        //     useUserStore.getState().setUser(access_token);
        //     setCookie('access_token', access_token);
        //
        //     await router.push(Routes.ElectionAll);
        //
        //     set(initialState);
        //   }
        // } catch (error) {
        //   showToast({ status: 'error', description: i18n.t(apiError(error)) });
        // }
      },

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

      reset: () => set(initialState),
    }),
    { name: 'DVS-AdminUserStore' },
  ),
);

export default useAdminUserStore;

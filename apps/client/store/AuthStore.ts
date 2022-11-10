import create from 'zustand';
import { devtools } from 'zustand/middleware';
import makeRequest from '../utils/makeRequest';
import validate, { validationFactory } from '../utils/validate';
import useUserStore from './UserStore';
import { NextRouter } from 'next/router';
import { setCookie } from 'cookies-next';
import Routes from '../config/routes';

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
  setDisplayAuth: () => void;

  setAuth: (key: string, value: string | number) => void;
  register: (router?: NextRouter) => Promise<void>;
  login: (router?: NextRouter) => Promise<void>;

  setErrors: (errors: Record<string, any>) => void;
  setError: (field?: string, error?: string) => void;
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

const useAuthStore = create<State & Actions>()(
  devtools(
    (set, get) => ({
      ...initialState,

      setDisplayAuth: () => {
        const resetState = { ...initialState };
        delete resetState.displayAuth;
        set({ ...resetState, displayAuth: get().displayAuth === 'register' ? 'login' : 'register' });
      },

      setAuth: (key, value) => set({ [key]: value }),
      register: async (router?: NextRouter) => {
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

        try {
          const { data } = await makeRequest<Access, VoterSignup>({ url: 'auth/signup', method: 'POST', data: dto });
          const { access_token } = data;
          if (access_token) {
            useUserStore.getState().setUser(access_token);
            setCookie('access_token', access_token);
            if (router) await router.push(Routes.ElectionAll);
            set(initialState);
          }
        } catch (error) {
          // TODO set exception as error for given field
          console.error(error);
        }
      },
      login: async (router?: NextRouter) => {
        const { email, password } = get();
        const dto = { email, password };
        const factory: validationFactoryParams = {
          fields: { ...dto },
          validationTypes: [
            { field: 'email', validationType: ['notEmpty', 'email'] },
            { field: 'password', validationType: ['notEmpty'] },
          ],
        };
        const validation = validate(validationFactory(factory));

        if (validation.hasErrors) {
          set({ errors: validation.errors });
          return;
        }

        try {
          const { data } = await makeRequest<Access, VoterSignin>({ url: 'auth/signin', method: 'POST', data: dto });
          const { access_token } = data;

          if (access_token) {
            useUserStore.getState().setUser(access_token);
            setCookie('access_token', access_token);
            if (router) await router.push(Routes.ElectionAll);
            set(initialState);
          }
        } catch (error) {
          // TODO set exception as error for given field
          console.error(error);
        }
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
    { name: 'DVS-AuthStore' },
  ),
);

export default useAuthStore;

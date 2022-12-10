import create from 'zustand';
import { devtools } from 'zustand/middleware';
import { NextRouter } from 'next/router';
import { DVSToastOptions } from '../components/atoms/DVSToast';
import validate, { validationFactory } from '../utils/validate';
import { i18n } from 'next-i18next';
import makeRequest, { apiError } from '../utils/makeRequest';

interface State {
  name: string;
  image: string;
  description: string;
  candidates: Candidate[];
  eligibleVoters: string;
  expires: string;

  errors: { [k: string]: string };
}

interface Actions {
  // getters
  getValues: () => Omit<State, 'errors'>;
  // setters
  setElection: (key: string, value: string | number | Candidate[]) => void;
  // api
  createElection: (router: NextRouter, showToast: (options: DVSToastOptions) => void) => Promise<void>;

  setErrors: (errors: Record<string, any>) => void;
  setError: (field?: string, error?: string) => void;

  reset: VoidFunction;
}

const initialState: State = {
  name: '',
  image: '',
  description: '',
  candidates: [],
  eligibleVoters: '',
  expires: '',

  errors: {},
};

const useAdminElectionStore = create<State & Actions>()(
  devtools(
    (set, get) => ({
      ...initialState,
      // getters
      getValues: () => {
        const { name, image, description, candidates, eligibleVoters, expires } = get();
        return { name, image, description, candidates, eligibleVoters, expires };
      },
      // setters
      setElection: (key, value) => set({ [key]: value }),
      // api
      createElection: async (router, showToast) => {
        const dto = get().getValues();
        const factory: validationFactoryParams = {
          fields: { ...dto },
          validationTypes: [
            { field: 'name', validationType: ['notEmpty'] },
            { field: 'image', validationType: ['notEmpty'] },
            { field: 'description', validationType: ['notEmpty'] },
            { field: 'candidates', validationType: ['notEmptyObjArray'] },
            { field: 'eligibleVoters', validationType: ['notEmpty'] },
            { field: 'expires', validationType: ['notEmpty'] },
          ],
        };

        const validation = validate(validationFactory(factory));

        if (validation.hasErrors) {
          set({ errors: validation.errors });
          return;
        }

        try {
          console.log(validation.hasErrors);
        } catch (error) {
          showToast({ status: 'error', description: i18n.t(apiError(error)) });
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
    { name: 'DVS-AdminElectionStore' },
  ),
);

export default useAdminElectionStore;

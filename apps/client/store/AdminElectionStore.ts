import create from 'zustand';
import { devtools } from 'zustand/middleware';
import { NextRouter } from 'next/router';
import { DVSToastOptions } from '../components/atoms/DVSToast';
import validate, { validationFactory } from '../utils/validate';
import { i18n } from 'next-i18next';
import makeRequest, { apiError, createBearer } from '../utils/makeRequest';
import useUserStore from './UserStore';
import useModalStore from './ModalStore';

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
        const values = get().getValues();
        const factory: validationFactoryParams = {
          fields: { ...values },
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

        let splitEligibleVoters: string[];

        if (values.eligibleVoters.includes(', ')) {
          splitEligibleVoters = values.eligibleVoters.split(', ');
        } else if (values.eligibleVoters.includes(',')) {
          splitEligibleVoters = values.eligibleVoters.split(',');
        } else if (values.eligibleVoters.includes(' ')) {
          splitEligibleVoters = values.eligibleVoters.split(' ');
        } else {
          get().setError('eligibleVoters', i18n.t('error.validate.eligibleVoters'));
          return;
        }

        // create dto
        const dto = {
          ...values,
          // timestamp in seconds
          expires: new Date(values.expires).getTime() / 1000,
          eligibleVoters: splitEligibleVoters,
        } as ElectionCreate;

        try {
          useModalStore.getState().setOpen({ type: 'loading', payload: 'Creating election...' });
          await makeRequest<any, ElectionCreate>({
            url: 'admin/election/create',
            headers: createBearer(useUserStore.getState().access_token),
            method: 'POST',
            data: dto,
          });

          useModalStore.getState().setClosed();
          showToast({ status: 'success', description: i18n.t('success.admin.election.create', { name: values.name }) });
          get().reset();
        } catch (error) {
          useModalStore.getState().setClosed();
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

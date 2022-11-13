import create from 'zustand';
import { devtools } from 'zustand/middleware';
import validate, { validationFactory } from '../utils/validate';
import makeRequest, { createBearer } from '../utils/makeRequest';
import useUserStore from './UserStore';
import { NextRouter } from 'next/router';
import Routes from '../config/routes';
import useModalStore from './ModalStore';

interface State {
  ssn: string;
  mnemonic: string[];
  errors: { [k: string]: string };
}

interface Actions {
  setSSN: (ssn: string) => void;
  registerVoter: (electionId: number, router: NextRouter) => Promise<void>;
  setMnemonic: (index: number, value: string) => void;
  submitMnemonic: (electionId: number, router: NextRouter) => Promise<void>;

  setErrors: (errors: Record<string, any>) => void;
  setError: (field?: string, error?: string) => void;
  reset: VoidFunction;
}

const initialState: State = {
  ssn: '',
  mnemonic: ['', '', '', '', '', '', '', '', '', '', '', ''],
  errors: {},
};

const useElectionStore = create<State & Actions>()(
  devtools(
    (set, get) => ({
      ...JSON.parse(JSON.stringify(initialState)),

      setSSN: (ssn: string) => set({ ssn }),
      registerVoter: async (electionId: number, router: NextRouter) => {
        const { ssn } = get();
        const dto: ElectionRegister = { ssn };
        const factory: validationFactoryParams = {
          fields: { ssn },
          validationTypes: [{ field: 'ssn', validationType: ['notEmpty'] }],
        };
        const validation = validate(validationFactory(factory));

        if (validation.hasErrors) {
          set({ errors: validation.errors });
          return;
        }

        try {
          const { data } = await makeRequest<Registered, ElectionRegister>({
            url: `election/register/${electionId}`,
            method: 'POST',
            headers: createBearer(useUserStore.getState().access_token),
            data: dto,
          });

          const mnemonic = data.mnemonic.split(' ');
          set({ mnemonic });
          await router.push(`/${Routes.Election}/${electionId}`);
          useModalStore.getState().setOpen({
            type: 'mnemonic',
            payload: mnemonic,
          });
        } catch (error) {
          // TODO set exception as error for given field
          console.error(error);
        }
      },

      setMnemonic: (index: number, value) => {
        const mnemonic = get().mnemonic;
        mnemonic[index] = value;
        set({ mnemonic });
      },
      submitMnemonic: async (electionId: number, router: NextRouter) => {
        const { mnemonic } = get();
        const dto = { mnemonic: mnemonic.join(' ') };
        const factory: validationFactoryParams = {
          fields: dto,
          validationTypes: [{ field: 'mnemonic', validationType: ['mnemonic'] }],
        };
        const validation = validate(validationFactory(factory));

        if (validation.hasErrors) {
          set({ errors: validation.errors });
          return;
        }

        try {
          await makeRequest({
            url: `election/eligible/${electionId}`,
            headers: createBearer(useUserStore.getState().access_token),
            method: 'POST',
            data: dto,
          });
          useModalStore.getState().setClosed();
          await router.push(`/${Routes.Election}/${electionId}`);
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
    { name: 'DVS-ElectionStore' },
  ),
);

export default useElectionStore;

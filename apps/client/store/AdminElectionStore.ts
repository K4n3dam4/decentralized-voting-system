import create from 'zustand';
import { devtools } from 'zustand/middleware';

interface State {
  displayAuth: 'register' | 'login';

  name: string;
  image: string;
  description: string;
  candidates: Candidate[];
  eligibleVoters: string[];
  expires: string;

  errors: { [k: string]: string };
}

interface Actions {
  setElection: (key: string, value: string | number | Candidate[]) => void;

  setErrors: (errors: Record<string, any>) => void;
  setError: (field?: string, error?: string) => void;

  reset: VoidFunction;
}

const initialState: State = {
  displayAuth: 'register',

  name: '',
  image: '',
  description: '',
  candidates: [],
  eligibleVoters: [],
  expires: '',

  errors: {},
};

const useAdminElectionStore = create<State & Actions>()(
  devtools(
    (set, get) => ({
      ...initialState,

      setElection: (key, value) => set({ [key]: value }),

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

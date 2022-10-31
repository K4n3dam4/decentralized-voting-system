import create from 'zustand';
import { devtools } from 'zustand/middleware';

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
  setLogin: (key: string, value: string) => void;
  errors: { [k: string]: string };
}

const useAuthStore = create<AuthStore>()(
  devtools(
    (set) => ({
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
      setRegister: (key, value) => set({ [key]: value }),
      setLogin: (key, value) => set({ [key]: value }),
    }),
    { name: 'DVS-AuthStore' },
  ),
);

export default useAuthStore;

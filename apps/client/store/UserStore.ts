import create from 'zustand';
import { devtools } from 'zustand/middleware';
import parseJwt from '../utils/jwt';
import { deleteCookie } from 'cookies-next';
import { NextRouter } from 'next/router';

interface State {
  access_token: string;
  user: User;
}

interface Actions {
  setAccessToken: (access_token: string) => void;
  setUser: (token: string) => void;
  resetUser: VoidFunction;
  logout: (router: NextRouter) => Promise<void>;
}

const initialState: State = {
  access_token: null,
  user: null,
};

const useUserStore = create<State & Actions>()(
  devtools(
    (set, get) => ({
      ...initialState,
      setAccessToken: (access_token: string) => set({ access_token }),
      setUser: (token: string) => {
        set({ access_token: token });
        const user = parseJwt(token);
        set({ user });
      },
      resetUser: () => set(initialState),
      logout: async (router: NextRouter) => {
        get().resetUser();
        deleteCookie('access_token');
        await router.push('/');
      },
    }),
    { name: 'DVS-UserStore' },
  ),
);

export default useUserStore;

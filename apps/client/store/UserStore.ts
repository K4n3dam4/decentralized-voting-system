import create from 'zustand';
import { devtools } from 'zustand/middleware';
import parseJwt from '../utils/jwt';
import { deleteCookie } from 'cookies-next';
import { NextRouter } from 'next/router';

interface State {
  access_token: string;
  voter: Voter;
  admin: Admin;
}

interface Actions {
  setAccessToken: (access_token: string) => void;
  setUser: (token: string) => void;
  logout: (router: NextRouter) => Promise<void>;
}

const initialState: State = {
  access_token: null,
  voter: null,
  admin: null,
};

const useUserStore = create<State & Actions>()(
  devtools(
    (set) => ({
      ...initialState,
      setAccessToken: (access_token: string) => set({ access_token }),
      setUser: (token: string) => {
        console.log(token);
        set({ access_token: token });
        const user = parseJwt(token);
        if (user?.serviceNumber) set({ admin: user as Admin });
        if (user?.email) set({ voter: user as Voter });
      },
      logout: async (router: NextRouter) => {
        set({ access_token: null, voter: null, admin: null });
        deleteCookie('access_token');
        await router.push('/');
      },
    }),
    { name: 'DVS-UserStore' },
  ),
);

export default useUserStore;

import create from 'zustand';
import { devtools } from 'zustand/middleware';

interface UserStore {
  access_token: string;
  voter: { email: string };
  admin: { serviceNumber: number };
}

const useAuthStore = create<UserStore>()(
  devtools(
    (set) => ({
      access_token: null,
      voter: null,
      admin: null,
      setUser: (token: string, user: Record<string, any>) => {
        set({ access_token: token });
        if (user?.serviceNumber) set({ admin: user as UserStore['admin'] });
        if (user?.email) set({ voter: user as UserStore['voter'] });
      },
    }),
    { name: 'DVS-UserStore' },
  ),
);

export default useAuthStore;

import create from 'zustand';
import { devtools } from 'zustand/middleware';

interface State {
  isOpen: boolean;
  modal: Modal;
}

interface Actions {
  setOpen: (type: Modal) => void;
  setClosed: VoidFunction;
}

const initialState: State = {
  isOpen: false,
  modal: null,
};

const useModalStore = create<State & Actions>()(
  devtools(
    (set) => ({
      ...initialState,
      setOpen: (modal: Modal) => set({ isOpen: true, modal }),
      setClosed: () => set({ isOpen: false, modal: null }),
    }),
    { name: 'DVS-ModalStore' },
  ),
);

export default useModalStore;

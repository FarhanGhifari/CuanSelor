// via cookie httpOnly - Zustand hanya dipakai untuk UI state tambahan
// BUKAN untuk menyimpan token / user secara manual

import { create } from "zustand";

interface AuthUIState {
  // State UI saja - bukan session (session dari authClient.useSession())
  isLoginModalOpen: boolean;
  redirectAfterLogin: string;
  setRedirectAfterLogin: (path: string) => void;
  openLoginModal: () => void;
  closeLoginModal: () => void;
}

export const useAuthUIStore = create<AuthUIState>((set) => ({
  isLoginModalOpen:    false,
  redirectAfterLogin:  "/dashboard",

  setRedirectAfterLogin: (path) =>
    set({ redirectAfterLogin: path }),

  openLoginModal:  () => set({ isLoginModalOpen: true }),
  closeLoginModal: () => set({ isLoginModalOpen: false }),
}));
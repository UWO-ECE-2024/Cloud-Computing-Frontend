import { useMediaStore } from "@/providers/StoreProvider";
import { MediaState, MediaStore } from "@/types/store";
import { createJSONStorage, persist } from "zustand/middleware";
import { createStore } from "zustand/vanilla";
import {
  loginWithEmailPassword,
  loginWithGoogle as firebaseLoginWithGoogle,
  registerWithFirebase,
  registerWithBackend,
  getUserProfile,
  logoutFirebase,
  UserRegistrationData
} from "@/services/authService";
import { auth } from "@/services/firebase";

export const InitState = {
  user: {},
  token: {
    idToken: "",
    refreshToken: "",
  },
  authStatus: 'idle' as 'idle' | 'loading' | 'authenticated' | 'unauthenticated' | 'registration_required',
  authError: null as string | null,
};

// Create a single store instance to use throughout the application
export const mediaStore = createStore<MediaStore>()(
  persist(
    (set, get) => ({
      ...InitState as MediaState,
      actions: {
        updateTokens: (newToken: any) =>
          set((state: any) => ({ ...state, token: newToken })),
        updateUserInfo: (newInfo: any) =>
          set((state: any) => ({ ...state, user: newInfo })),

        // Auth actions
        login: async (email: string, password: string) => {
          set({ authStatus: 'loading', authError: null } as Partial<MediaStore>);
          try {
            const user = await loginWithEmailPassword(email, password);
            const token = {
              idToken: await user.getIdToken(),
              refreshToken: user.refreshToken
            };

            set({ token });

            // Check if user exists in backend
            const userProfile = await getUserProfile(token.idToken);

            if (userProfile.exists) {
              set({
                user: userProfile.user,
                authStatus: 'authenticated'
              } as Partial<MediaStore>);
            } else {
              set({ authStatus: 'registration_required' } as Partial<MediaStore>);
            }
          } catch (error) {
            set({
              authStatus: 'unauthenticated',
              authError: (error as any).message || "Failed to login"
            } as Partial<MediaStore>);
            throw error;
          }
        },

        loginWithGoogle: async () => {
          set({ authStatus: 'loading', authError: null } as Partial<MediaStore>);
          try {
            const user = await firebaseLoginWithGoogle();
            const token = {
              idToken: await user.getIdToken(),
              refreshToken: user.refreshToken
            };

            set({ token });

            // Check if user exists in backend
            const userProfile = await getUserProfile(token.idToken);

            if (userProfile.exists) {
              set({
                user: userProfile.user,
                authStatus: 'authenticated'
              } as Partial<MediaStore>);
            } else {
              set({ authStatus: 'registration_required' } as Partial<MediaStore>);
            }
          } catch (error) {
            set({
              authStatus: 'unauthenticated',
              authError: (error as any).message || "Failed to login with Google"
            } as Partial<MediaStore>);
            throw error;
          }
        },

        register: async (email: string, password: string) => {
          set({ authStatus: 'loading', authError: null } as Partial<MediaStore>);
          try {
            const user = await registerWithFirebase(email, password);
            const token = {
              idToken: await user.getIdToken(),
              refreshToken: user.refreshToken
            };

            set({
              token,
              authStatus: 'registration_required'
            } as Partial<MediaStore>);
          } catch (error) {
            set({
              authStatus: 'unauthenticated',
              authError: (error as any).message || "Failed to register"
            } as Partial<MediaStore>);
            throw error;
          }
        },

        completeRegistration: async (username: string, displayName: string, bio?: string) => {
          const { token } = get();
          set({ authStatus: 'loading', authError: null } as Partial<MediaStore>);

          try {
            const userData: UserRegistrationData = {
              username,
              displayName,
              ...(bio && { bio })
            };

            const registeredUser = await registerWithBackend(token.idToken, userData);

            set({
              user: registeredUser,
              authStatus: 'authenticated'
            } as Partial<MediaStore>);
          } catch (error) {
            set({
              authError: (error as any).message || "Failed to complete registration"
            } as Partial<MediaStore>);
            throw error;
          }
        },

        logout: async () => {
          try {
            await logoutFirebase();
            set(InitState);
          } catch (error) {
            console.error("Logout error", error);
            throw error;
          }
        },

        refreshUserProfile: async () => {
          const { token } = get();
          if (!token.idToken) return;

          try {
            const userProfile = await getUserProfile(token.idToken);
            if (userProfile.exists) {
              set({
                user: userProfile.user,
                authStatus: 'authenticated'
              } as Partial<MediaStore>);
            }
          } catch (error) {
            console.error("Failed to refresh user profile", error);
          }
        }
      },
    }),
    {
      name: "media-store",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state: any) => {
        return {
          token: state.token,
          user: state.user,
          authStatus: state.authStatus
        };
      },
    },
  ),
);

// For backward compatibility
export const createMediaStore = (initState: MediaState = InitState as MediaState) => {
  return mediaStore;
};

// Listen for auth state changes
if (typeof window !== 'undefined') {
  auth.onAuthStateChanged(async (user) => {
    if (!user) return;

    try {
      const token = {
        idToken: await user.getIdToken(),
        refreshToken: user.refreshToken
      };

      // Access the actions directly from the store instance
      const state = mediaStore.getState();

      // Update tokens is always available
      state.actions.updateTokens(token);

      // Try to refresh profile - might fail due to type issues
      try {
        // TypeScript doesn't recognize this method due to type inference limitations
        // but we know it exists in our implementation
        (state.actions as any).refreshUserProfile();
      } catch (refreshError) {
        console.error("Failed to refresh profile", refreshError);
      }
    } catch (error) {
      console.error("Auth state change error", error);
    }
  });
}

export const useToken = () => useMediaStore((state: any) => state.token);
export const useUser = () => useMediaStore((state: any) => state.user);
export const useActions = () => useMediaStore((state: any) => state.actions);
export const useAuthStatus = () => useMediaStore((state: any) => state.authStatus);
export const useAuthError = () => useMediaStore((state: any) => state.authError);

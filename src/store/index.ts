import { useMediaStore } from "@/providers/StoreProvider";
import { MediaState, MediaStore } from "@/types/store";
import { createJSONStorage, persist } from "zustand/middleware";
import { createStore } from "zustand/vanilla";

export const InitState: MediaState = {
  user: {},
  token: {
    idToken:
      "eyJhbGciOiJSUzI1NiIsImtpZCI6ImEwODA2N2Q4M2YwY2Y5YzcxNjQyNjUwYzUyMWQ0ZWZhNWI2YTNlMDkiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vY2xvdWQtY29tcHV0aW5nLWJhY2tlbmQtZDc3MDIiLCJhdWQiOiJjbG91ZC1jb21wdXRpbmctYmFja2VuZC1kNzcwMiIsImF1dGhfdGltZSI6MTc0MjQxMjU4NCwidXNlcl9pZCI6Im9VRnN1TmY3alpQcFZpYVhtYnM3Z3hJTVp1QzMiLCJzdWIiOiJvVUZzdU5mN2paUHBWaWFYbWJzN2d4SU1adUMzIiwiaWF0IjoxNzQyNDEyNTg0LCJleHAiOjE3NDI0MTYxODQsImVtYWlsIjoic2x1bzI2M0B1d28uY2EiLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsic2x1bzI2M0B1d28uY2EiXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.m1FSGKgrXKePl8i5L6UNAkhiUYAz1acKIHMcqGSUggjUfZIro6gMjyDRUKDZdqvJBgdRTwCld2_p7Gg4UMZam6M-uFl9fhlvFiLa8TQDandDW8Tr1FsZ7pmN1nfP941wo9NtxZWgYF7W09nEsX7iWqxsL0lqVvpopDZhSbKOWA9A7Ynqw5Wid1jjWsfr1dCBgPF8is-35f3il9v1KC3Vum7s5gDQan3sHleO3tPgDSll-6I8A4rCs3BTx7Tz6I58QXlsEnl8mYKHzNI4F0lXH3dmESvIZdwGT2HANWQ7cVogwh6v7dLbPMxA0QgBHpHCYt1s_uoSnWC-wJZaikhcNA",
    refreshToken:
      "AMf-vBwuEtqy2hlj1_3zp_Nl6bx08eNPTCaa4859FSt89h0YuqoU9xMRytdpyChjAzp6q_5GGCIFuQc7gVgbc1-qb-XYpLPWX0QtiHlyTcHU2ap96__KVE9_3Al-3frMORm1C8E3XpYScdpkR1pulZxC8XcAXtVwmXKhnoEm9xjOcR3RoZ3aYGEdUjz5CDZw47lgf0cgGLmO-iSdJ_BwDmphgW486MCDc3ffsgSmsx8fYXNpTMaJ0I8",
  },
};

export const createMediaStore = (initState: MediaState = InitState) => {
  return createStore<MediaStore>()(
    persist(
      (set) => ({
        ...initState,
        actions: {
          updateTokens: (newToken) =>
            set((state) => ({ ...state, token: newToken })),
          updateUserInfo: (newInfo) =>
            set((state) => ({ ...state, user: newInfo })),
        },
      }),
      {
        name: "media-store",
        storage: createJSONStorage(() => sessionStorage),
        partialize: (state) => {
          return { token: state.token, user: state.user };
        },
      },
    ),
  );
};

export const useToken = () => useMediaStore((state) => state.token);
export const useUser = () => useMediaStore((state) => state.user);
export const useActions = () => useMediaStore((state) => state.actions);

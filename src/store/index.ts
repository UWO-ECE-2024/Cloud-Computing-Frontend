import { useMediaStore } from "@/providers/StoreProvider";
import { MediaState, MediaStore } from "@/types/store";
import { createJSONStorage, persist } from "zustand/middleware";
import { createStore } from "zustand/vanilla";

export const InitState: MediaState = {
  user: {},
  token: {
    idToken:
      "eyJhbGciOiJSUzI1NiIsImtpZCI6IjMwYjIyMWFiNjU2MTdiY2Y4N2VlMGY4NDYyZjc0ZTM2NTIyY2EyZTQiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vY2xvdWQtY29tcHV0aW5nLWJhY2tlbmQtZDc3MDIiLCJhdWQiOiJjbG91ZC1jb21wdXRpbmctYmFja2VuZC1kNzcwMiIsImF1dGhfdGltZSI6MTc0MjQzNjE4NSwidXNlcl9pZCI6Im9VRnN1TmY3alpQcFZpYVhtYnM3Z3hJTVp1QzMiLCJzdWIiOiJvVUZzdU5mN2paUHBWaWFYbWJzN2d4SU1adUMzIiwiaWF0IjoxNzQyNDM2MTg1LCJleHAiOjE3NDI0Mzk3ODUsImVtYWlsIjoic2x1bzI2M0B1d28uY2EiLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsic2x1bzI2M0B1d28uY2EiXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.Xyvb6CN3LS9-XMTUvQvlD8dGdoAHaxexs2DeONC45m8SQd7mS7wzUS2166BU3gCW3lSa7xvzXcNFDl8gHauvRC4kddUXiFIOBl-5UK6FqyDXYvuWW7VRMGziBt3zDvnCMuJ1I3jkisWZ0Hh5poopvac7OL7Ap0-O6c-aAtfbaSOz9tCCYHRjpBTvzfX6gDjIzH4aY2YLOrt3JwpKGYteZIEE0k7FDTF88PVRR9Pprziunn-NI5M4laxUu9ozM6UoAZhVtfogwStjrkROULhuEvU4tPLdxQWZpY5TqWh5_RvQg0hsA6HfqTXvMuLBAf2LbHslcFU996LEyyba4oZnlw",
    refreshToken:
      "AMf-vBy8dum58npdQ3Z0M-jIwnqua5glTAUBXi2xRIwLzI59shLuiMX_YnCDN9UpLgQvNz0hhkdAVl4of-9nkcbGkenhXox4onEkQUIJiiDOYo7qKEEUxQMjPiQfDpgopreFC6IcGlXUT3nvWu1hPkbuaaDuo4WjP8lYTjvByWfQKRCc2252N2NY5FdFQuWWuSoEhVd2_H4iMrlRgTqMq26XF9HU5y6N5qVoVTcjyoOlJ0vfEHivybk",
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

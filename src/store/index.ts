import { useMediaStore } from "@/providers/StoreProvider";
import { MediaState, MediaStore } from "@/types/store";
import { createJSONStorage, persist } from "zustand/middleware";
import { createStore } from "zustand/vanilla";

export const InitState: MediaState = {
  config: {},
  flag: false,
};

export const createMediaStore = (initState: MediaState = InitState) => {
  return createStore<MediaStore>()(
    persist(
      (set) => ({
        ...initState,
      }),
      {
        name: "media-store",
        storage: createJSONStorage(() => sessionStorage),
        partialize: (state) => {
          return { config: state.config, flag: state.flag };
        },
      }
    )
  );
};

export const useFlag = () => useMediaStore((state) => state.flag);

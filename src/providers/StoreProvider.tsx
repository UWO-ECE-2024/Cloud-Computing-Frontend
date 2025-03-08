"use client";

import { createMediaStore } from "@/store";
import { MediaStore } from "@/types/store";
import { createContext, ReactNode, useContext, useRef } from "react";
import { useStore } from "zustand";

export type MediaStoreApi = ReturnType<typeof createMediaStore>;

export const MediaStoreContext = createContext<MediaStoreApi | undefined>(
  undefined,
);

export interface MediaStoreProviderProps {
  children: ReactNode;
}

export const MediaStoreProvider = ({ children }: MediaStoreProviderProps) => {
  const storeRef = useRef<MediaStoreApi | undefined>(undefined);
  if (!storeRef.current) {
    storeRef.current = createMediaStore();
  }

  return (
    <MediaStoreContext.Provider value={storeRef.current}>
      {children}
    </MediaStoreContext.Provider>
  );
};

export const useMediaStore = <T,>(selector: (store: MediaStore) => T): T => {
  const mediaStoreContext = useContext(MediaStoreContext);
  if (!mediaStoreContext) {
    throw new Error("useMediaStore must be used within a MediaStoreProvider");
  }
  return useStore(mediaStoreContext, selector);
};

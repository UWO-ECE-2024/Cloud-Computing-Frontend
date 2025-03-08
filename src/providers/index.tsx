"use client";
import QueriesProvider from "./QueriesProvider";
import { MediaStoreProvider } from "./StoreProvider";

const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <MediaStoreProvider>
      <QueriesProvider>{children}</QueriesProvider>
    </MediaStoreProvider>
  );
};

export default Providers;

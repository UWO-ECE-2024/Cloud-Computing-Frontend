"use client";
import { MediaStoreProvider } from "./StoreProvider";
import { ThemeProvider } from "./ThemeProvider";
import { SWRConfig } from "swr";

const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <SWRConfig>
      <MediaStoreProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </MediaStoreProvider>
    </SWRConfig>
  );
};

export default Providers;

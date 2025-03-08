"use client";
import { MediaStoreProvider } from "./StoreProvider";
import { ThemeProvider } from "./ThemeProvider";

const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
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
  );
};

export default Providers;

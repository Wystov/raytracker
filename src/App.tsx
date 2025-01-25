/* eslint-disable mobx/missing-observer */
import { Header } from './components/header';
import { MainContent } from './components/main-content';
import { ThemeProvider } from './components/theme-provider';

export const App = () => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="raytracker-theme">
      <Header />
      <main
        className="flex flex-1 flex-col items-center w-full max-w-96 m-auto  p-2 py-6 gap-2"
        data-vaul-drawer-wrapper
      >
        <MainContent />
      </main>
    </ThemeProvider>
  );
};

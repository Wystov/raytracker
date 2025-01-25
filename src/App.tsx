/* eslint-disable mobx/missing-observer */
import { Header } from '@/components/Header';
import { MainContent } from '@/components/MainContent';
import { ThemeProvider } from '@/components/actions/ThemeProvider';

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

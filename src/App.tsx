/* eslint-disable mobx/missing-observer */
import { ThemeProvider } from '@/components/actions/ThemeProvider';
import { Header } from '@/components/Header';
import { MainContent } from '@/components/MainContent';

export const App = () => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="raytracker-theme">
      <Header />
      <main
        className="flex flex-1 flex-col items-center w-full max-w-[400px] m-auto  p-2 py-6 gap-2"
        data-vaul-drawer-wrapper
      >
        <MainContent />
      </main>
    </ThemeProvider>
  );
};

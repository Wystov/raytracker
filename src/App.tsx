import { observer } from 'mobx-react-lite';

import { Lamp } from '@/components/lamp';
import { Login } from '@/components/login';
import { user } from '@/store/user';

import { ThemeProvider } from './components/theme-provider';
import { ThemeToggle } from './components/theme-toggle';

export const App = observer(function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="raytracker-theme">
      <main
        className="flex flex-1 flex-col items-center p-4 max-w-fit mx-auto"
        data-vaul-drawer-wrapper
      >
        <ThemeToggle />
        {user.initialized ? (
          <>
            <Login />
            {user.data?.profile && <Lamp />}
          </>
        ) : (
          <div>Loading...</div>
        )}
      </main>
    </ThemeProvider>
  );
});

import { observer } from 'mobx-react-lite';

import { Lamp } from '@/components/lamp';
import { Login } from '@/components/login';
import { user } from '@/store/user';

import { Sessions } from './components/sessions';
import { ThemeProvider } from './components/theme-provider';
import { ThemeToggle } from './components/theme-toggle';
import { lamp } from './store/lamp';

export const App = observer(function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="raytracker-theme">
      <main
        className="flex flex-1 flex-col items-center min-w-80 max-w-fit mx-auto p-4"
        data-vaul-drawer-wrapper
      >
        <ThemeToggle />
        {user.initialized ? (
          <>
            <Login />
            {user.data?.profile && <Lamp />}
            {user.data?.profile && lamp.exists && <Sessions />}
          </>
        ) : (
          <div>Loading...</div>
        )}
      </main>
    </ThemeProvider>
  );
});

import { observer } from 'mobx-react-lite';

import { Lamp } from '@/components/lamp';
import { Login } from '@/components/login';
import { user } from '@/store/user';

import { Header } from './components/header';
import { Sessions } from './components/sessions';
import { ThemeProvider } from './components/theme-provider';
import { lamp } from './store/lamp';

export const App = observer(function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="raytracker-theme">
      <Header />
      <main
        className="flex flex-1 flex-col items-center w-full max-w-96 m-auto  p-2 py-6 gap-2"
        data-vaul-drawer-wrapper
      >
        {user.initialized ? (
          <>
            {!user.data?.profile ? <Login /> : <Lamp />}
            {user.data?.profile && lamp.exists && <Sessions />}
          </>
        ) : (
          <div>Loading...</div>
        )}
      </main>
    </ThemeProvider>
  );
});

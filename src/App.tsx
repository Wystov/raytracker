import { observer } from 'mobx-react-lite';

import { Lamp } from '@/components/Lamp';
import { Login } from '@/components/login';
import { user } from '@/store/user';

export const App = observer(function App() {
  return (
    <main className="flex flex-1 flex-col items-center p-4">
      {user.initialized ? (
        <>
          <Login />
          {user.profile && <Lamp />}
        </>
      ) : (
        <div>Loading...</div>
      )}
    </main>
  );
});

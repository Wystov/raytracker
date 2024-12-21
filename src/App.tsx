import { observer } from 'mobx-react-lite';

import { Lamp } from './components/lamp';
import { Login } from './components/Login';
import { user } from './store/user';

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

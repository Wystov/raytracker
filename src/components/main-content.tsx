import { observer } from 'mobx-react-lite';

import { Lamp } from '@/components/lamp';
import { Loader } from '@/components/ui/loader';
import { lamp } from '@/store/lamp';
import { user } from '@/store/user';

import { Login } from './login';
import { Sessions } from './sessions';

export const MainContent = observer(function MainContent() {
  if (user.isLoading) {
    return <Loader />;
  }

  if (!user.data?.profile) {
    return <Login />;
  }

  return (
    <>
      <Lamp />
      {lamp.exists && <Sessions />}
    </>
  );
});

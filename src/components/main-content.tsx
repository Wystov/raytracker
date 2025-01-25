import { observer } from 'mobx-react-lite';

import { Lamp } from '@/components/Lamp/lamp';
import { Login } from '@/components/login';
import { Sessions } from '@/components/Sessions/sessions';
import { Loader } from '@/components/ui/loader';
import { lamp } from '@/store/lamp';
import { user } from '@/store/user';

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

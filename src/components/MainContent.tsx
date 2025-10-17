import { observer } from 'mobx-react-lite';

import { Lamp } from '@/components/Lamp';
import { Login } from '@/components/Login';
import { Sessions } from '@/components/Sessions';
import { SessionDrawer } from '@/components/Sessions/SessionDrawer';
import { Drawer } from '@/components/ui/drawer';
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
      {lamp.exists && (
        <div className="fixed bottom-4 right-4">
          <Drawer repositionInputs={false}>
            <SessionDrawer type="add" />
          </Drawer>
        </div>
      )}
    </>
  );
});

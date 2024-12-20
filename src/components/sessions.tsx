import { observer } from 'mobx-react-lite';

import { SessionInputForm } from './session-input-form.tsx.tsx';
import { SessionsList } from './sessons-list.tsx';
import { Button } from './ui/button.tsx';
import { Drawer, DrawerContent, DrawerTrigger } from './ui/drawer.tsx';

export const Sessions = observer(function Sessions() {
  return (
    <>
      <Drawer>
        <DrawerTrigger asChild>
          <Button className="mb-2">Add session</Button>
        </DrawerTrigger>
        <DrawerContent>
          <SessionInputForm />
        </DrawerContent>
      </Drawer>
      <SessionsList />
    </>
  );
});

/* eslint-disable mobx/missing-observer */
import { Pencil } from 'lucide-react';

import { SessionInputForm } from './session-input-form.tsx';
import { Button } from './ui/button';
import { Drawer, DrawerContent, DrawerTrigger } from './ui/drawer';

interface SessionDrawerProps {
  type: 'add' | 'edit';
  id?: number;
}
export const SessionDrawer = ({ type, id }: SessionDrawerProps) => {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        {type === 'add' ? (
          <Button className="mb-2">Add session</Button>
        ) : (
          <Button size="icon" variant={'outline'} className="mr-2">
            <Pencil />
          </Button>
        )}
      </DrawerTrigger>
      <DrawerContent>
        <SessionInputForm type={type} editSessionId={id} />
      </DrawerContent>
    </Drawer>
  );
};

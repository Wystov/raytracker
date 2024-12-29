/* eslint-disable mobx/missing-observer */
import { Pencil, Plus } from 'lucide-react';

import { SessionInputForm } from './session-input-form.tsx';
import { Button } from './ui/button';
import { Drawer, DrawerContent, DrawerTrigger } from './ui/drawer';

interface SessionDrawerProps {
  type: 'add' | 'edit';
  id?: string;
}
export const SessionDrawer = ({ type, id }: SessionDrawerProps) => {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        {type === 'add' ? (
          <Button size="icon">
            <Plus />
          </Button>
        ) : (
          <Button
            size="icon"
            variant={'outline'}
            onClick={(e) => e.stopPropagation()}
          >
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

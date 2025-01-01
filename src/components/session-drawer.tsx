/* eslint-disable mobx/missing-observer */
import { Plus } from 'lucide-react';

import { SessionInputForm } from './session-input-form.tsx';
import { Button } from './ui/button';
import { DrawerContent, DrawerTrigger } from './ui/drawer';

export interface SessionDrawerProps {
  type: 'add' | 'edit';
  id?: string;
}
export const SessionDrawer = ({ type, id }: SessionDrawerProps) => {
  return (
    <>
      <DrawerTrigger asChild>
        {type === 'add' && (
          <Button size="icon">
            <Plus />
          </Button>
        )}
      </DrawerTrigger>
      <DrawerContent>
        <SessionInputForm type={type} editSessionId={id} />
      </DrawerContent>
    </>
  );
};

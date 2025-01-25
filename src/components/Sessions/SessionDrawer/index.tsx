/* eslint-disable mobx/missing-observer */
import { CalendarPlus } from 'lucide-react';

import { SessionInputForm } from '@/components/Sessions/SessionDrawer/SessionsInputForm';
import { Button } from '@/components/ui/button';
import { DrawerContent, DrawerTrigger } from '@/components/ui/drawer';

export interface SessionDrawerProps {
  type: 'add' | 'edit';
  id?: string;
}
export const SessionDrawer = ({ type, id }: SessionDrawerProps) => {
  return (
    <>
      {type === 'add' && (
        <DrawerTrigger asChild>
          <Button className="self-start">
            <CalendarPlus />
            Add
          </Button>
        </DrawerTrigger>
      )}
      <DrawerContent>
        <SessionInputForm type={type} editSessionId={id} />
      </DrawerContent>
    </>
  );
};

/* eslint-disable mobx/missing-observer */
import { CalendarPlus } from 'lucide-react';

import { SessionInputForm } from '@/components/Sessions/SessionDrawer/SessionsInputForm';
import { Button } from '@/components/ui/button';
import { DrawerContent, DrawerTrigger } from '@/components/ui/drawer';

export interface SessionDrawerProps {
  type: 'add' | 'edit';
  text?: string;
  id?: string;
}
export const SessionDrawer = ({ type, id, text }: SessionDrawerProps) => {
  return (
    <>
      {type === 'add' && (
        <DrawerTrigger asChild>
          <Button
            className={`self-start ${!text ? 'rounded-full' : ''}`}
            {...(text ? {} : { size: 'icon' })}
          >
            <CalendarPlus />
            {text ?? ''}
          </Button>
        </DrawerTrigger>
      )}
      <DrawerContent>
        <SessionInputForm type={type} editSessionId={id} />
      </DrawerContent>
    </>
  );
};

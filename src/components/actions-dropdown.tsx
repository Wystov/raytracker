/* eslint-disable mobx/missing-observer */
import { AlertDialog } from '@radix-ui/react-alert-dialog';
import { DropdownMenuArrow } from '@radix-ui/react-dropdown-menu';
import { EllipsisVertical, Pencil, Trash2 } from 'lucide-react';

import { lamp } from '@/store/lamp';
import { sessions } from '@/store/sessions';

import { LampDrawer, LampDrawerProps } from './Lamp/LampDrawer/lamp-drawer';
import { RemoveWithConfirmation } from './remove-with-confirmation';
import { SessionDrawer, SessionDrawerProps } from './session-drawer';
import { AlertDialogTrigger } from './ui/alert-dialog';
import { Button } from './ui/button';
import { Drawer, DrawerTrigger } from './ui/drawer';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface ActionsDropdownProps {
  type: 'lamp' | 'session';
  id: string;
}

export const ActionsDropdown = ({ id, type }: ActionsDropdownProps) => {
  const drawerProps: LampDrawerProps | SessionDrawerProps = {
    type: 'edit',
    id,
  };

  const removeWithConfirmationProps =
    type === 'session'
      ? {
          text: 'It will permanently delete this session from our servers.',
          onClick: () => sessions.removeSession(id),
        }
      : {
          text: 'This will remove the lamp and all related sessions.',
          onClick: () => {
            sessions.delete();
            lamp.delete();
          },
        };

  return (
    <AlertDialog>
      <Drawer>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <EllipsisVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="left"
            sideOffset={-6}
            className="flex gap-2 min-w-fit p-3"
          >
            <DropdownMenuItem className="p-0">
              <DrawerTrigger asChild>
                <Button size="icon" variant={'outline'}>
                  <Pencil />
                </Button>
              </DrawerTrigger>
            </DropdownMenuItem>
            <DropdownMenuItem className="p-0">
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="transition-colors  hover:bg-destructive hover:border-none focus-visible:"
                  size="icon"
                >
                  <Trash2 />
                </Button>
              </AlertDialogTrigger>
            </DropdownMenuItem>
            <DropdownMenuArrow className="fill-muted -translate-y-[1px]" />
          </DropdownMenuContent>
        </DropdownMenu>
        {type === 'session' ? (
          <SessionDrawer {...drawerProps} />
        ) : (
          <LampDrawer {...drawerProps} />
        )}
        <RemoveWithConfirmation {...removeWithConfirmationProps} />
      </Drawer>
    </AlertDialog>
  );
};

import { Pencil, Plus } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { lamp } from '@/store/lamp';

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './ui/drawer';

interface LampDrawerProps {
  type: 'add' | 'edit';
  lampName?: string;
}

/* eslint-disable mobx/missing-observer */
export const LampDrawer = ({ type, lampName }: LampDrawerProps) => {
  const [lampInputValue, setLampInputValue] = useState(lampName ?? '');

  const icon = type === 'add' ? <Plus /> : <Pencil />;
  const title = type === 'add' ? 'Add' : 'Edit';
  const description =
    type === 'add'
      ? 'Add a new lamp to start tracking time.'
      : 'Edit your existing lamp.';

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!lampInputValue) {
      console.error('Input is empty');
      return;
    }
    if (type === 'add') lamp.addLamp(lampInputValue);
    if (type === 'edit' && lampName !== lampInputValue)
      lamp.editLamp(lampInputValue);
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" size="icon">
          {icon}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm flex flex-col">
          <DrawerHeader>
            <DrawerTitle>{title} lamp</DrawerTitle>
            <DrawerDescription>{description}</DrawerDescription>
          </DrawerHeader>
          <form className="flex flex-col" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2 px-4">
              <label>Lamp name</label>
              <Input
                placeholder="Lamp name"
                onInput={(e) =>
                  setLampInputValue((e.target as HTMLInputElement).value)
                }
                value={lampInputValue}
              />
            </div>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button type="submit">{title}</Button>
              </DrawerClose>
              <DrawerClose asChild>
                <Button variant={'outline'}>Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

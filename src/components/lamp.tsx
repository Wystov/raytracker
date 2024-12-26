import { observer } from 'mobx-react-lite';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toHumanReadableTime } from '@/lib/human-readable-time';
import { lamp } from '@/store/lamp';
import { sessions } from '@/store/sessions';

import { RemoveWithConfirmation } from './remove-with-confirmation';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
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

export const Lamp = observer(function Lamp() {
  const [lampInputValue, setLampInputValue] = useState('');

  return (
    <Card className="w-full min-w-sm mb-2">
      <CardHeader>
        <CardTitle>Your lamp</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-between">
        {lamp.exists ? (
          <>
            <div className="flex items-center">
              {lamp.name}: {toHumanReadableTime(lamp.time)}
            </div>
            <RemoveWithConfirmation
              text="This will remove the lamp and all related sessions."
              onClick={() => {
                sessions.delete();
                lamp.delete();
              }}
            />
          </>
        ) : (
          <Drawer>
            <DrawerTrigger asChild>
              <Button>Add lamp</Button>
            </DrawerTrigger>
            <DrawerContent>
              <div className="mx-auto w-full max-w-sm flex flex-col">
                <DrawerHeader>
                  <DrawerTitle>Add lamp</DrawerTitle>
                  <DrawerDescription>
                    Add a new lamp to start tracking time.
                  </DrawerDescription>
                </DrawerHeader>
                <form
                  className="flex flex-col"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!lampInputValue) {
                      console.error('Input is empty');
                      return;
                    }
                    lamp.addLamp(lampInputValue);
                  }}
                >
                  <div className="px-4">
                    <Input
                      placeholder="Lamp name"
                      onInput={(e) =>
                        setLampInputValue((e.target as HTMLInputElement).value)
                      }
                    />
                  </div>
                  <DrawerFooter>
                    <DrawerClose asChild>
                      <Button type="submit">Add</Button>
                    </DrawerClose>
                    <DrawerClose asChild>
                      <Button variant={'outline'}>Cancel</Button>
                    </DrawerClose>
                  </DrawerFooter>
                </form>
              </div>
            </DrawerContent>
          </Drawer>
        )}
      </CardContent>
    </Card>
  );
});

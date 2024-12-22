import { observer } from 'mobx-react-lite';
import { useState } from 'react';

import { Sessions } from '@/components/sessions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toHumanReadableTime } from '@/lib/human-readable-time';
import { lamp } from '@/store/lamp';

import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './ui/drawer';

export const Lamp = observer(function Lamp() {
  const [lampInputValue, setLampInputValue] = useState('');

  return (
    <div className="w-full min-w-fit">
      {lamp.exists ? (
        <>
          <Card className="w-full mb-2">
            <CardHeader>
              <CardTitle>Your lamp</CardTitle>
            </CardHeader>
            <CardContent>
              {lamp.name}: {toHumanReadableTime(lamp.time)}
            </CardContent>
          </Card>
          <Sessions />
        </>
      ) : (
        <Card className="w-72 mb-2">
          <CardHeader>
            <CardTitle>No lamp</CardTitle>
          </CardHeader>
          <CardContent>
            <Drawer>
              <DrawerTrigger asChild>
                <Button>Add lamp</Button>
              </DrawerTrigger>
              <DrawerContent>
                <div className="mx-auto w-full max-w-sm flex flex-col">
                  <DrawerHeader>
                    <DrawerTitle>Add lamp</DrawerTitle>
                  </DrawerHeader>
                  <form
                    className="flex flex-col"
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!lampInputValue) return;
                      lamp.addLamp(lampInputValue);
                    }}
                  >
                    <div className="px-4">
                      <Input
                        placeholder="Lamp name"
                        onInput={(e) =>
                          setLampInputValue(
                            (e.target as HTMLInputElement).value
                          )
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
          </CardContent>
        </Card>
      )}
    </div>
  );
});

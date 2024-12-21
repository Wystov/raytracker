import { observer } from 'mobx-react-lite';
import { useState } from 'react';

import { Sessions } from '@/components/sessions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toHumanReadableTime } from '@/lib/human-readable-time';
import { lamp } from '@/store/lamp';

import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export const Lamp = observer(function Lamp() {
  const [addMode, setAddMode] = useState(false);
  const [lampInputValue, setLampInputValue] = useState('');

  return (
    <div>
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
            <Button onClick={() => setAddMode(true)}>create lamp</Button>
          </CardContent>
        </Card>
      )}
      {addMode && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!lampInputValue) return;
            lamp.addLamp(lampInputValue);
            setAddMode(false);
          }}
        >
          <Input
            onInput={(e) =>
              setLampInputValue((e.target as HTMLInputElement).value)
            }
          />
          <Button type="submit">+</Button>
        </form>
      )}
    </div>
  );
});

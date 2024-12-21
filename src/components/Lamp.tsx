import { observer } from 'mobx-react-lite';
import { useState } from 'react';

import { Sessions } from '@/components/sessions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { lamp } from '@/store/lamp';

export const Lamp = observer(function Lamp() {
  const [addMode, setAddMode] = useState(false);
  const [lampInputValue, setLampInputValue] = useState('');

  return (
    <div>
      {lamp.exists ? (
        <>
          <p>
            {lamp.name}: {lamp.time}s
          </p>
          <Sessions />
        </>
      ) : (
        <Button onClick={() => setAddMode(true)}>create lamp</Button>
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

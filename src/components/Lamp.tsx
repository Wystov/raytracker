import { observer } from 'mobx-react-lite';
import { lamp } from '@/store/lamp';
import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Sessions } from './Sessions';

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
          <Input onInput={(e) => setLampInputValue(e.target.value)} />
          <Button type="submit">+</Button>
        </form>
      )}
    </div>
  );
});

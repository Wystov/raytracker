import { observer } from 'mobx-react-lite';
import { lamp } from '@/store/lamp';
import { useEffect } from 'react';
import { Button } from './ui/button';

export const Lamp = observer(function Lamp() {
  useEffect(() => {
    lamp.getLamp();
  }, []);
  return (
    <div>
      {lamp.exists ? (
        <p>
          {lamp.name}: {lamp.time}
        </p>
      ) : (
        <Button>create lamp</Button>
      )}
    </div>
  );
});

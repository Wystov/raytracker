import { sessions } from '@/store/sessions';
import { observer } from 'mobx-react-lite';
import { Button } from './ui/button';
import { useState } from 'react';
import { SessionInputForm } from './session-input-form.tsx';

export const Sessions = observer(function Sessions() {
  const [addMode, setAddMode] = useState(false);

  return (
    <div>
      {!addMode ? (
        <Button onClick={() => setAddMode(true)}>Add session</Button>
      ) : (
        <SessionInputForm onClose={() => setAddMode(false)} />
      )}
      <div>Sessions: {JSON.stringify(sessions.list)}</div>
    </div>
  );
});

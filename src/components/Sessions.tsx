import { observer } from 'mobx-react-lite';
import { Button } from './ui/button';
import { useState } from 'react';
import { SessionInputForm } from './session-input-form.tsx';
import { SessionsList } from './SessonsList.tsx';

export const Sessions = observer(function Sessions() {
  const [addMode, setAddMode] = useState(false);

  return (
    <div>
      {!addMode ? (
        <Button onClick={() => setAddMode(true)}>Add session</Button>
      ) : (
        <SessionInputForm onClose={() => setAddMode(false)} />
      )}
      <SessionsList />
    </div>
  );
});

import { observer } from 'mobx-react-lite';
import { useState } from 'react';

import { SessionInputForm } from './session-input-form.tsx.tsx';
import { SessionsList } from './sessons-list.tsx';
import { Button } from './ui/button.tsx';

export const Sessions = observer(function Sessions() {
  const [addMode, setAddMode] = useState(false);

  return (
    <div>
      {!addMode ? (
        <Button className="mb-2" onClick={() => setAddMode(true)}>
          Add session
        </Button>
      ) : (
        <SessionInputForm onClose={() => setAddMode(false)} />
      )}
      <SessionsList />
    </div>
  );
});

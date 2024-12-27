import { observer } from 'mobx-react-lite';

import { toHumanReadableTime } from '@/lib/human-readable-time';
import { lamp } from '@/store/lamp';
import { sessions } from '@/store/sessions';

import { LampDrawer } from './lamp-drawer';
import { RemoveWithConfirmation } from './remove-with-confirmation';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export const Lamp = observer(function Lamp() {
  return (
    <Card className="w-full mb-2">
      <CardHeader>
        <CardTitle>Your lamp</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-between w-full">
        {lamp.exists ? (
          <>
            <div className="flex items-center">
              {lamp.name}: {toHumanReadableTime(lamp.time)}
            </div>
            <div className="flex gap-2">
              <LampDrawer type="edit" lampName={lamp.name} />
              <RemoveWithConfirmation
                text="This will remove the lamp and all related sessions."
                onClick={() => {
                  sessions.delete();
                  lamp.delete();
                }}
              />
            </div>
          </>
        ) : (
          <LampDrawer type="add" />
        )}
      </CardContent>
    </Card>
  );
});

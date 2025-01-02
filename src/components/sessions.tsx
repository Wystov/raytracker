import { observer } from 'mobx-react-lite';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { sessions } from '@/store/sessions';

import { SessionDrawer } from './session-drawer';
import { SessionsTable } from './sessions-table';
import { Drawer } from './ui/drawer';

export const Sessions = observer(function SessionsList() {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col gap-4">
        <CardTitle>Sessions</CardTitle>
        <Drawer>
          <SessionDrawer type="add" />
        </Drawer>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {sessions.list.length ? <SessionsTable /> : <p>No records</p>}
      </CardContent>
    </Card>
  );
});

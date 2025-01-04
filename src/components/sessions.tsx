import { observer } from 'mobx-react-lite';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { sessions } from '@/store/sessions';

import { SessionDrawer } from './session-drawer';
import { SessionsCalendar } from './sessions-calendar';
import { SessionsTable } from './sessions-table';
import { Drawer } from './ui/drawer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

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
        {sessions.list.length ? (
          <Tabs defaultValue="table">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="table">Table</TabsTrigger>
              <TabsTrigger value="Calendar">Calendar</TabsTrigger>
            </TabsList>
            <TabsContent value="table">
              <SessionsTable data={sessions.listWithDates} mode="latest" />
            </TabsContent>
            <TabsContent value="Calendar">
              <SessionsCalendar />
            </TabsContent>
          </Tabs>
        ) : (
          <p>No records</p>
        )}
      </CardContent>
    </Card>
  );
});

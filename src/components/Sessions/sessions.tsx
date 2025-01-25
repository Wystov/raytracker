import { observer } from 'mobx-react-lite';

import { SessionDrawer } from '@/components/session-drawer';
import { SessionsCalendar } from '@/components/sessions-calendar';
import { SessionsTable } from '@/components/sessions-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Drawer } from '@/components/ui/drawer';
import { Loader } from '@/components/ui/loader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { sessions } from '@/store/sessions';

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
        {!sessions.isFetching && sessions.list.length === 0 && (
          <p>No records</p>
        )}
        {sessions.list.length > 0 && (
          <Tabs defaultValue="latest">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="latest">Latest</TabsTrigger>
              <TabsTrigger value="Calendar">Calendar</TabsTrigger>
            </TabsList>
            <TabsContent value="latest">
              <SessionsTable data={sessions.list} mode="latest" />
            </TabsContent>
            <TabsContent value="Calendar">
              <SessionsCalendar />
            </TabsContent>
          </Tabs>
        )}
        {sessions.isFetching && <Loader />}
      </CardContent>
    </Card>
  );
});

import { observer } from 'mobx-react-lite';

import { SessionDrawer } from '@/components/Sessions/SessionDrawer';
import { SessionsCalendar } from '@/components/Sessions/SessionsCalendar';
import { SessionsTable } from '@/components/Sessions/SessionsTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Drawer } from '@/components/ui/drawer';
import { Loader } from '@/components/ui/loader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { sessions } from '@/store/sessions';

export const Sessions = observer(function SessionsList() {
  const { isFetching, list } = sessions;

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col gap-4">
        <CardTitle>Sessions</CardTitle>
        <Drawer repositionInputs={false}>
          <SessionDrawer type="add" />
        </Drawer>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {!isFetching && list.length === 0 && <p>No records</p>}
        {list.length > 0 && (
          <Tabs defaultValue="latest">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="latest">Latest</TabsTrigger>
              <TabsTrigger value="Calendar">Calendar</TabsTrigger>
            </TabsList>
            <TabsContent value="latest">
              <SessionsTable data={list} mode="latest" />
            </TabsContent>
            <TabsContent value="Calendar">
              <SessionsCalendar />
            </TabsContent>
          </Tabs>
        )}
        {isFetching && <Loader />}
      </CardContent>
    </Card>
  );
});

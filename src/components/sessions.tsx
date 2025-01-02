import { observer } from 'mobx-react-lite';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toHumanReadableTime } from '@/lib/human-readable-time';
import { lamp } from '@/store/lamp';
import { sessions } from '@/store/sessions';

import { ActionsDropdown } from './actions-dropdown';
import { SessionDrawer } from './session-drawer';
import { Button } from './ui/button';
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
        {sessions.list.length ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-start">Date</TableHead>
                <TableHead className="text-center">Time</TableHead>
                <TableHead className="text-center">Uses</TableHead>
                <TableHead className="text-center">Total</TableHead>
                <TableHead className="w-0"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions.list.map((session) => {
                const { dateTime, id } = session;
                const date =
                  dateTime instanceof Date ? dateTime : dateTime.toDate();

                const day = date.toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                });
                const time = date.toLocaleTimeString(undefined, {
                  hour12: false,
                  hour: 'numeric',
                  minute: 'numeric',
                });

                return (
                  <TableRow key={id}>
                    <TableCell className="font-medium">
                      <p className="text-nowrap">{day}</p>
                      <p>{time}</p>
                    </TableCell>
                    <TableCell className="text-center">
                      {toHumanReadableTime(session.timeInSeconds)}
                    </TableCell>
                    <TableCell className="text-center">
                      {session.uses}
                    </TableCell>
                    <TableCell className="text-center">
                      {toHumanReadableTime(session.totalSessionTime)}
                    </TableCell>
                    <TableCell className="pl-0 min-w-fit">
                      <ActionsDropdown type="session" id={id}></ActionsDropdown>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <p>No records</p>
        )}
      </CardContent>
      <CardFooter className="flex-col gap-4 justify-between">
        <span className="text-sm font-medium text-muted-foreground">
          Showing {sessions.list.length} of {lamp.sessionsCount}
        </span>
        {sessions.list.length < lamp.sessionsCount && (
          <Button
            variant={'outline'}
            onClick={() => sessions.getSessions('more')}
          >
            Load more
          </Button>
        )}
      </CardFooter>
    </Card>
  );
});

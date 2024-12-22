import { observer } from 'mobx-react-lite';

import { RemoveWithConfirmation } from '@/components/remove-with-confirmation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toHumanReadableTime } from '@/lib/human-readable-time';
import { sessions } from '@/store/sessions';

export const SessionsList = observer(function SessionsList() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sessions</CardTitle>
      </CardHeader>
      <CardContent>
        {sessions.list.length ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Uses</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions.list.map((session) => {
                const { dateTime, id } = session;
                const date =
                  dateTime instanceof Date ? dateTime : dateTime.toDate();

                const day = date.toLocaleDateString(undefined, {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                });
                const time = date.toLocaleTimeString(undefined, {
                  hour12: false,
                });

                return (
                  <TableRow key={day + time}>
                    <TableCell className="font-medium">
                      <p className="text-nowrap">{day}</p>
                      <p>{time}</p>
                    </TableCell>
                    <TableCell>
                      {toHumanReadableTime(session.timeInSeconds)}
                    </TableCell>
                    <TableCell>{session.uses}</TableCell>
                    <TableCell className="text-right">
                      {toHumanReadableTime(session.totalSessionTime)}
                    </TableCell>
                    <TableCell>
                      <RemoveWithConfirmation
                        text="It will permanently delete this session from our servers."
                        onClick={() => sessions.removeSession(id)}
                      />
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
    </Card>
  );
});

import { observer } from 'mobx-react-lite';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toHumanReadableTime } from '@/lib/human-readable-time';
import { sessions } from '@/store/sessions';

export const SessionsList = observer(function SessionsList() {
  return (
    <Table>
      <TableCaption>A list of your sessions.</TableCaption>
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
          const { dateTime } = session;
          const date =
            dateTime instanceof Date
              ? dateTime.toString()
              : dateTime.toDate().toString();

          return (
            <TableRow key={date}>
              <TableCell className="font-medium">{date}</TableCell>
              <TableCell>
                {toHumanReadableTime(session.timeInSeconds)}
              </TableCell>
              <TableCell>{session.uses}</TableCell>
              <TableCell className="text-right">
                {toHumanReadableTime(session.totalSessionTime)}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
});

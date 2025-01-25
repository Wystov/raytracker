/* eslint-disable mobx/missing-observer */
import { ActionsDropdown } from '@/components/actions-dropdown';
import { SessionsLoadMoreWithCounter } from '@/components/Sessions/SessionsTable/SessionsLoadMoreWithCounter';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toHumanReadableTime } from '@/lib/human-readable-time';
import { NarrowedToDate, SessionDataWithId } from '@/types';

interface SessionsTableProps {
  data: NarrowedToDate<SessionDataWithId>[];
  mode: 'latest' | 'calendar';
}

export const SessionsTable = ({ data, mode }: SessionsTableProps) => {
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-start">
              {mode === 'latest' ? 'Date' : 'Time'}
            </TableHead>
            <TableHead className="text-center">Duration</TableHead>
            <TableHead className="text-center">Uses</TableHead>
            <TableHead className="text-center">Total</TableHead>
            <TableHead className="w-0"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((session) => {
            const { dateTime, id } = session;

            const day = dateTime.toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            });
            const time = dateTime.toLocaleTimeString(undefined, {
              hour12: false,
              hour: 'numeric',
              minute: 'numeric',
            });

            return (
              <TableRow key={id}>
                <TableCell>
                  {mode === 'latest' && <p className="text-nowrap">{day}</p>}
                  <p>{time}</p>
                </TableCell>
                <TableCell className="text-center">
                  {toHumanReadableTime(session.timeInSeconds)}
                </TableCell>
                <TableCell className="text-center">{session.uses}</TableCell>
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

      {mode === 'latest' && (
        <SessionsLoadMoreWithCounter dataLength={data.length} />
      )}
    </>
  );
};

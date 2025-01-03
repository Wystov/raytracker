import { observer } from 'mobx-react-lite';
import { useMemo, useState } from 'react';

import { sessions } from '@/store/sessions';
import { NarrowedToDate, SessionDataWithId } from '@/types';

import { SessionsTable } from './sessions-table';
import { Calendar } from './ui/calendar';

interface SessionsCalendarProps {
  data: NarrowedToDate<SessionDataWithId>[];
}

export const SessionsCalendar = observer(function SessionsCalendar({
  data,
}: SessionsCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const sessionsForSelectedDate = useMemo(() => {
    if (!selectedDate) return [];
    return data.filter(
      (session) =>
        session.dateTime.getFullYear() === selectedDate.getFullYear() &&
        session.dateTime.getMonth() === selectedDate.getMonth() &&
        session.dateTime.getDate() === selectedDate.getDate()
    );
  }, [selectedDate, data]);

  return (
    <div className="flex flex-col gap-2">
      <div className="max-w-fit mx-auto">
        <Calendar
          mode={'single'}
          modifiers={{
            datesWithSessions: sessions.listWithDates.map(
              (session) => session.dateTime
            ),
          }}
          selected={selectedDate}
          onSelect={setSelectedDate}
          modifiersClassNames={{
            datesWithSessions: 'bg-blue-500 text-white',
          }}
        />
      </div>
      {selectedDate && (
        <>
          {sessionsForSelectedDate.length ? (
            <SessionsTable data={sessionsForSelectedDate} mode="calendar" />
          ) : (
            <p className="text-center">No records for this day</p>
          )}
        </>
      )}
    </div>
  );
});

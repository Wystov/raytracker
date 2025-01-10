import { observer } from 'mobx-react-lite';
import { useEffect, useMemo, useState } from 'react';

import { sessions } from '@/store/sessions';
import { NarrowedToDate, SessionDataWithId } from '@/types';

import { SessionsTable } from './sessions-table';
import { Calendar } from './ui/calendar';

export const SessionsCalendar = observer(function SessionsCalendar() {
  const [showMonth, setShowMonth] = useState(new Date());
  const [data, setData] = useState<NarrowedToDate<SessionDataWithId>[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    const fetchSessions = async (date: Date) => {
      const fetchedSessions = await sessions.getSessionsForMonth(date);
      setData(fetchedSessions);
    };

    fetchSessions(showMonth);
  }, [showMonth]);

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
          showOutsideDays={false}
          modifiers={{
            datesWithSessions: data.map((session) => session.dateTime),
          }}
          selected={selectedDate}
          onSelect={setSelectedDate}
          onMonthChange={setShowMonth}
          modifiersClassNames={{
            datesWithSessions: 'bg-primary text-foreground rounded-3xl',
          }}
          className="rounded-xl border shadow"
        />
      </div>
      {!selectedDate && (
        <p className="text-center">Select a day to view sessions</p>
      )}
      {selectedDate && (
        <>
          {sessionsForSelectedDate.length ? (
            <>
              <p className="text-center">
                Sessions for{' '}
                {selectedDate.toLocaleDateString(undefined, {
                  day: 'numeric',
                  month: 'long',
                })}
              </p>
              <SessionsTable data={sessionsForSelectedDate} mode="calendar" />
            </>
          ) : (
            <p className="text-center">
              No sessions for{' '}
              {selectedDate.toLocaleDateString(undefined, {
                day: 'numeric',
                month: 'long',
              })}
            </p>
          )}
        </>
      )}
    </div>
  );
});

import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';

import { SessionsTable } from '@/components/Sessions/SessionsTable';
import { Calendar } from '@/components/ui/calendar';
import { Loader } from '@/components/ui/loader';
import { getYYYYMMKey } from '@/lib/get-YYYY-MM-key';
import { sessions } from '@/store/sessions';

export const SessionsCalendar = observer(function SessionsCalendar() {
  const [showMonth, setShowMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const { listByMonth } = sessions;

  useEffect(() => {
    sessions.getSessionsForMonth(showMonth);
  }, [showMonth, listByMonth]);

  const onMonthChange = (date: Date) => {
    setSelectedDate(undefined);
    setShowMonth(date);
  };

  const sessionsForMonth = listByMonth.get(getYYYYMMKey(showMonth)) ?? [];

  const sessionsForSelectedDate = selectedDate
    ? sessionsForMonth.filter(
        (session) =>
          session.dateTime.getFullYear() === selectedDate.getFullYear() &&
          session.dateTime.getMonth() === selectedDate.getMonth() &&
          session.dateTime.getDate() === selectedDate.getDate()
      )
    : [];

  return (
    <div className="flex flex-col gap-2 relative">
      {sessions.isMonthDataFetching && (
        <div className="absolute bg-background/50 z-50 top-0 left-0 right-0 bottom-0 flex items-center justify-center">
          <Loader />
        </div>
      )}
      <div className="max-w-fit mx-auto">
        <Calendar
          mode={'single'}
          showOutsideDays={false}
          modifiers={{
            datesWithSessions: sessionsForMonth.map(
              (session) => session.dateTime
            ),
          }}
          selected={selectedDate}
          onSelect={setSelectedDate}
          onMonthChange={onMonthChange}
          modifiersClassNames={{
            datesWithSessions: 'bg-primary text-primary-foreground rounded-md',
          }}
          className="rounded-xl border shadow-sm"
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

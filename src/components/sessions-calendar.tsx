import { observer } from 'mobx-react-lite';
import { useState } from 'react';

import { sessions } from '@/store/sessions';
import { NarrowedToDate, SessionDataWithId } from '@/types';

import { SessionsTable } from './sessions-table';
import { Calendar } from './ui/calendar';

export const SessionsCalendar = observer(function SessionsCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [sessionsForSelectedDate, setSessionsForSelectedDate] = useState<
    NarrowedToDate<SessionDataWithId>[]
  >([]);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);

    if (!date) {
      setSessionsForSelectedDate([]);
      return;
    }

    const filteredRecords = sessions.listWithDates.filter((session) => {
      return (
        session.dateTime.getFullYear() === date.getFullYear() &&
        session.dateTime.getMonth() === date.getMonth() &&
        session.dateTime.getDate() === date.getDate()
      );
    });

    setSessionsForSelectedDate(filteredRecords);
  };

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
          onSelect={handleDateSelect}
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

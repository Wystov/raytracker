import { NarrowedToDate, SessionDataWithId } from '@/types';

export const getListWithDates = (
  list: SessionDataWithId[]
): NarrowedToDate<SessionDataWithId>[] =>
  list.map((session) => ({
    ...session,
    dateTime:
      session.dateTime instanceof Date
        ? session.dateTime
        : session.dateTime.toDate(),
  }));

import { NarrowedToDate, SessionDataWithId } from '@/types';

import { timestampToDate } from './timestamp-to-date';

export const getListWithDates = (
  list: SessionDataWithId[]
): NarrowedToDate<SessionDataWithId>[] =>
  list.map((session) => ({
    ...session,
    dateTime: timestampToDate(session.dateTime),
  }));

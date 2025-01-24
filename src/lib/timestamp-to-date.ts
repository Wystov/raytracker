import { Timestamp } from 'firebase/firestore';

export const timestampToDate = (date: Date | Timestamp) =>
  date instanceof Date ? date : date.toDate();

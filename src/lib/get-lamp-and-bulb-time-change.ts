import { FieldValue, increment, Timestamp } from 'firebase/firestore';

export const getLampAndBulbTimeChange = (
  sessionDate: Timestamp | Date | undefined,
  sessionTime: number,
  bulbChangeDate: Timestamp | Date | null
): { lampTime: FieldValue; bulbTime?: FieldValue } => {
  const sessionDateTimestamp =
    sessionDate instanceof Date ? Timestamp.fromDate(sessionDate) : sessionDate;
  const bulbChangeDateTimestamp =
    bulbChangeDate instanceof Date
      ? Timestamp.fromDate(bulbChangeDate)
      : bulbChangeDate;

  const isCurrentBulb =
    sessionDateTimestamp && bulbChangeDateTimestamp
      ? sessionDateTimestamp > bulbChangeDateTimestamp
      : false;

  const updatedTime: { lampTime: FieldValue; bulbTime?: FieldValue } = {
    lampTime: increment(-sessionTime),
  };

  if (isCurrentBulb) {
    updatedTime.bulbTime = increment(-sessionTime);
  }

  return updatedTime;
};

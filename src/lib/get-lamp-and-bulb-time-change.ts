import { FieldValue, increment, Timestamp } from 'firebase/firestore';

export const getLampAndBulbTimeChange = (
  sessionDate: Timestamp | Date | undefined,
  sessionTime: number,
  bulbChangeDate: Timestamp | Date | null,
  type?: 'delete'
): { lampTime: FieldValue; bulbTime?: FieldValue } => {
  const sessionDateTimestamp =
    sessionDate instanceof Date ? Timestamp.fromDate(sessionDate) : sessionDate;
  const bulbChangeDateTimestamp =
    bulbChangeDate instanceof Date
      ? Timestamp.fromDate(bulbChangeDate)
      : bulbChangeDate;

  const isCurrentBulb = () => {
    if (!bulbChangeDateTimestamp) return true;

    return sessionDateTimestamp! > bulbChangeDateTimestamp;
  };

  const changeValue = type === 'delete' ? -sessionTime : sessionTime;

  const updatedTime: { lampTime: FieldValue; bulbTime?: FieldValue } = {
    lampTime: increment(changeValue),
  };

  if (isCurrentBulb()) {
    updatedTime.bulbTime = increment(changeValue);
  }

  return updatedTime;
};

import { Timestamp } from 'firebase/firestore';

export type LampData = {
  lampName: string;
  lampTime: number;
};

export type SessionData = {
  dateTime: Date | Timestamp;
  timeInSeconds: number;
  totalSessionTime: number;
  uses: number;
};

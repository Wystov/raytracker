import { Timestamp } from 'firebase/firestore';

export type LampData = {
  lampName: string;
  lampTime: number;
};

export type SessionData = {
  id: number;
  dateTime: Date | Timestamp;
  timeInSeconds: number;
  totalSessionTime: number;
  uses: number;
};

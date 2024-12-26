import { Timestamp } from 'firebase/firestore';

export type LampData = {
  lampName: string;
  lampTime: number;
  lampId: string;
};

export type SessionData = {
  id: number;
  dateTime: Date | Timestamp;
  timeInSeconds: number;
  totalSessionTime: number;
  uses: number;
};

export type UserProfile = {
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  uid: string;
};

export type UserData = {
  profile: UserProfile;
  lampList: string[];
};

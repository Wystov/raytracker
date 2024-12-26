import {
  CollectionReference,
  DocumentReference,
  Timestamp,
} from 'firebase/firestore';

export type LampData = {
  lampName: string;
  lampTime: number;
  lampId: string;
};

export type SessionData = {
  dateTime: Date | Timestamp;
  timeInSeconds: number;
  totalSessionTime: number;
  uses: number;
};

export type SessionDataWithId = SessionData & {
  id: string;
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

export type DBRefs = {
  userDoc?: DocumentReference;
  lampDoc?: DocumentReference;
  lampsCollection?: CollectionReference;
  sessionsCollection?: CollectionReference;
  sessionDoc?: (sessionId: string) => DocumentReference;
};

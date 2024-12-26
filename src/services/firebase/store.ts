import { collection, doc, getFirestore } from 'firebase/firestore';

import { DBRefs } from '@/types';

import { app } from '.';

export const db = getFirestore(app);

export const dbRefs: DBRefs = {};

export const setDbRefs = ({
  uid,
  lampId,
  reset,
}: {
  uid?: string;
  lampId?: string;
  reset?: boolean;
}) => {
  if (reset) {
    Object.keys(dbRefs).forEach((key) => {
      delete dbRefs[key as keyof DBRefs];
    });
    return;
  }
  if (uid) {
    dbRefs.userDoc = doc(db, 'users', uid);
    dbRefs.lampsCollection = collection(db, 'users', uid, 'lamps');
  }
  if (lampId && dbRefs.lampsCollection) {
    dbRefs.lampDoc = doc(dbRefs.lampsCollection, lampId);
    dbRefs.sessionsCollection = collection(dbRefs.lampDoc, 'sessions');
    dbRefs.sessionDoc = (sessionId: string) => {
      if (!dbRefs.sessionsCollection) {
        throw new Error('Sessions collection is not defined');
      }
      return doc(dbRefs.sessionsCollection, sessionId);
    };
  }
};

import {
  deleteDoc,
  doc,
  getDocs,
  increment,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { makeAutoObservable } from 'mobx';

import { dbRefs } from '@/services/firebase/store';
import { SessionData, SessionDataWithId } from '@/types';

import { lamp } from './lamp';

class Sessions {
  list = [] as SessionDataWithId[];

  constructor() {
    makeAutoObservable(this);
  }

  async reset() {
    if (!dbRefs.lampDoc) {
      console.error('db ref for lamp doc is not set');
      return;
    }

    await deleteDoc(dbRefs.lampDoc);

    this.setList([]);
  }

  setList(list: SessionDataWithId[]) {
    this.list = list;
  }

  async getSessions() {
    if (!dbRefs.sessionsCollection) {
      console.error('db ref for sessions collection is not set');
      return;
    }

    const res = await getDocs(dbRefs.sessionsCollection);

    res.forEach((session) =>
      this.list.push(session.data() as SessionDataWithId)
    );
  }

  async addSession(session: SessionData) {
    if (!dbRefs.sessionsCollection || !dbRefs.lampDoc) {
      console.error(
        'db refs for sessions collection or lamp doc is not set',
        'Sessions collection ref: ',
        dbRefs.sessionsCollection,
        'lamp doc ref: ',
        dbRefs.lampDoc
      );
      return;
    }

    const sessionDocRef = doc(dbRefs.sessionsCollection);

    const sessionDataWithId: SessionDataWithId = {
      ...session,
      id: sessionDocRef.id,
    };
    await setDoc(sessionDocRef, sessionDataWithId);
    await updateDoc(dbRefs.lampDoc, {
      lampTime: increment(session.totalSessionTime),
    });

    this.list.push(sessionDataWithId);
    lamp.increaseTime(session.totalSessionTime);
  }

  async removeSession(sessionId: string) {
    if (!dbRefs.sessionDoc || !dbRefs.lampDoc) {
      console.error(
        'db ref sessionDoc or lamp doc is not set',
        'session doc: ',
        dbRefs.sessionDoc?.toString(),
        'lamp doc: ',
        dbRefs.lampDoc
      );
      return;
    }

    const sessionTime =
      this.list.find((session) => session.id === sessionId)?.totalSessionTime ??
      0;

    this.setList(this.list.filter((session) => session.id !== sessionId));

    await deleteDoc(dbRefs.sessionDoc(sessionId.toString()));
    await setDoc(
      dbRefs.lampDoc,
      { lampTime: increment(-sessionTime) },
      { merge: true }
    );

    lamp.decreaseTime(sessionTime);
  }

  async editSession(data: SessionDataWithId) {
    if (!dbRefs.lampDoc || !dbRefs.sessionDoc) {
      console.error(
        'No session id or no db ref lamp doc or no db ref session doc',
        'db ref lamp doc: ',
        dbRefs.lampDoc,
        'db ref session doc: ',
        dbRefs.sessionDoc?.toString()
      );
      return;
    }

    const oldSession = this.list.find((s) => s.id === data.id);
    if (!oldSession) {
      console.error('no old session found');
      return;
    }

    const timeDiff = data.totalSessionTime - oldSession.totalSessionTime;

    await updateDoc(dbRefs.sessionDoc(data.id), data);
    await updateDoc(dbRefs.lampDoc, {
      lampTime: increment(timeDiff),
    });
    this.setList(this.list.map((s) => (s.id === data.id ? data : s)));

    lamp.increaseTime(timeDiff);
  }
}

export const sessions = new Sessions();

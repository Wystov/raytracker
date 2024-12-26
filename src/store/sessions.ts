import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  increment,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { makeAutoObservable } from 'mobx';

import { db } from '@/services/firebase/store';
import { SessionData } from '@/types';

import { lamp } from './lamp';
import { user } from './user';

class Sessions {
  list = [] as SessionData[];

  constructor() {
    makeAutoObservable(this);
  }

  async reset() {
    const uid = user?.data?.profile?.uid;
    const { id } = lamp;

    if (!uid || !id) return;

    await deleteDoc(doc(db, 'users', uid, 'lamps', id));

    this.setList([]);
  }

  setList(list: SessionData[]) {
    this.list = list;
  }

  async getSessions() {
    const uid = user?.data?.profile?.uid;
    const { id } = lamp;
    if (!uid || !id) return;

    const res = await getDocs(
      collection(db, 'users', uid, 'lamps', id, 'sessions')
    );

    res.forEach((session) => this.list.push(session.data() as SessionData));
  }

  async addSession(session: SessionData) {
    const uid = user?.data?.profile?.uid;
    const { id } = lamp;

    if (!uid || !id) return;

    const sessionsCollectionRef = collection(
      db,
      'users',
      uid,
      'lamps',
      id,
      'sessions'
    );

    const sessionDocRef = doc(sessionsCollectionRef);

    const sessionDataWithId = { ...session, id: sessionDocRef.id };
    await setDoc(sessionDocRef, sessionDataWithId);
    await updateDoc(doc(db, 'users', uid, 'lamps', id), {
      lampTime: increment(session.totalSessionTime),
    });

    this.list.push(session);
    lamp.increaseTime(session.totalSessionTime);
  }

  async removeSession(sessionId: number) {
    const uid = user?.data?.profile?.uid;
    const { id } = lamp;

    if (!uid || !id) return;

    const sessionTime =
      this.list.find((session) => session.id === sessionId)?.totalSessionTime ??
      0;

    this.setList(this.list.filter((session) => session.id !== sessionId));

    await deleteDoc(
      doc(db, 'users', uid, 'lamps', id, 'sessions', sessionId.toString())
    );
    await setDoc(
      doc(db, 'users', uid, 'lamps', id),
      { lampTime: increment(-sessionTime) },
      { merge: true }
    );

    lamp.decreaseTime(sessionTime);
  }

  async editSession(data: SessionData, sessionId?: number) {
    const uid = user?.data?.profile?.uid;
    const { id } = lamp;

    if (!uid || !id || sessionId === undefined) return;

    const oldSession = this.list.find((s) => s.id === sessionId);
    if (!oldSession) return;

    const timeDiff = data.totalSessionTime - oldSession.totalSessionTime;

    await updateDoc(
      doc(db, 'users', uid, 'lamps', id, 'sessions', sessionId.toString()),
      data
    );
    await updateDoc(doc(db, 'users', uid, 'lamps', id), {
      lampTime: increment(timeDiff),
    });
    this.setList(this.list.map((s) => (s.id === sessionId ? data : s)));

    lamp.increaseTime(timeDiff);
  }
}

export const sessions = new Sessions();

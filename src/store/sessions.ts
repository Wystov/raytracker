import {
  deleteField,
  doc,
  getDoc,
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
    const id = user?.profile?.uid;
    const { name } = lamp;

    if (!id || !name) return;

    await updateDoc(doc(db, 'sessions', id), { [name]: deleteField() });
    this.setList([]);
  }

  setList(list: SessionData[]) {
    this.list = list;
  }

  async getSessions() {
    const id = user?.profile?.uid;
    const { name } = lamp;
    if (!id || !name) return;

    const res = (await getDoc(doc(db, 'sessions', id))).data();
    if (!res?.[name]) return;

    this.setList(res[name]);
  }

  async addSession(session: SessionData) {
    const id = user?.profile?.uid;
    const { name } = lamp;

    if (!id || !name) return;

    this.list.push(session);
    await setDoc(doc(db, 'sessions', id), { [name]: this.list });
    await setDoc(
      doc(db, 'user', id),
      { lampTime: increment(session.totalSessionTime) },
      { merge: true }
    );
    lamp.increaseTime(session.totalSessionTime);
  }

  async removeSession(id: number) {
    const uid = user?.profile?.uid;
    const { name } = lamp;

    if (!uid || !name) return;

    const sessionTime =
      this.list.find((session) => session.id === id)?.totalSessionTime ?? 0;

    this.setList(this.list.filter((session) => session.id !== id));

    await setDoc(doc(db, 'sessions', uid), { [name]: this.list });
    await setDoc(
      doc(db, 'user', uid),
      { lampTime: increment(-sessionTime) },
      { merge: true }
    );

    lamp.decreaseTime(sessionTime);
  }
}

export const sessions = new Sessions();

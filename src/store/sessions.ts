import { doc, getDoc, increment, setDoc } from 'firebase/firestore';
import { makeAutoObservable } from 'mobx';

import { db } from '@/services/firebase/store';

import { lamp } from './lamp';
import { user } from './user';

class Sessions {
  initialized: boolean = false;
  list = [];

  constructor() {
    makeAutoObservable(this);
  }

  setInitialized() {
    this.initialized = true;
  }

  setList(list) {
    this.list = list;
  }

  async getSessions() {
    const id = user?.profile?.uid;
    const { name } = lamp;
    if (!id || !name) return;

    const res = (await getDoc(doc(db, 'sessions', id))).data();

    if (!res) return;

    this.setList(res[name]);
  }

  async addSession(session) {
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
}

export const sessions = new Sessions();

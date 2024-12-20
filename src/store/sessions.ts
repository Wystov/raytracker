import { makeAutoObservable } from 'mobx';
import { lamp } from './lamp';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/services/firebase/store';
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

  async getSessions() {
    const id = user?.profile?.uid;
    const { name } = lamp;
    console.log(id, name);
    if (!id || !name) return;

    const res = (await getDoc(doc(db, 'sessions', id))).data();

    if (!res) return;

    this.list = res[name];
  }

  async addSession(session) {
    const id = user?.profile?.uid;
    const { name } = lamp;

    if (!id || !name) return;

    this.list.push(session);
    await setDoc(doc(db, 'sessions', id), { [name]: this.list });
  }
}

export const sessions = new Sessions();

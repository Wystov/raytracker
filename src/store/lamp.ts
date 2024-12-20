import { makeAutoObservable } from 'mobx';
import { user } from './user';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/services/firebase/store';

class Lamp {
  exists = false;
  name = '';
  time = 0;

  constructor() {
    makeAutoObservable(this);
  }

  setLamp(data) {
    if (!data) return;
    this.exists = true;
    this.name = data.lampName;
    this.time = data.lampTime;
  }

  increaseTime(time) {
    this.time += time;
  }

  async getLamp() {
    const id = user?.profile?.uid;
    if (!id) return;
    const res = (await getDoc(doc(db, 'user', id))).data();
    this.setLamp(res);
  }

  async addLamp(name, time = 0) {
    const id = user?.profile?.uid;
    if (!id) return;
    await setDoc(doc(db, 'user', id), { lampName: name, lampTime: time }, { merge: true });
    this.setLamp({ name, time });
  }
}

export const lamp = new Lamp();

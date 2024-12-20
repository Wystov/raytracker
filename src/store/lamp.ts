import { makeAutoObservable } from 'mobx';
import { user } from './user';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/services/firebase/store';

class Lamp {
  exists = false;
  name = '';
  time = 0;

  constructor() {
    makeAutoObservable(this);
  }

  setLamp(lamp) {
    if (!lamp) return;
    this.exists = true;
    this.name = lamp.name;
    this.time = lamp.time;
  }

  async getLamp() {
    const id = user?.profile.uid;
    if (!id) return;
    const res = (await getDoc(doc(db, 'user', id))).data();
    this.setLamp(res);
  }
}

export const lamp = new Lamp();

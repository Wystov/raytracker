import {
  deleteField,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { makeAutoObservable } from 'mobx';

import { db } from '@/services/firebase/store';
import type { LampData } from '@/types';

import { user } from './user';

class Lamp {
  exists = false;
  name = '';
  time = 0;

  constructor() {
    makeAutoObservable(this);
  }

  async reset() {
    const id = user?.profile?.uid;
    const { name } = lamp;

    if (!id || !name) return;

    await updateDoc(doc(db, 'user', id), {
      lampName: deleteField(),
      lampTime: deleteField(),
    });

    this.exists = false;
    this.name = '';
    this.time = 0;
  }

  setLamp(data: LampData) {
    if (!data) return;
    this.exists = true;
    this.name = data.lampName;
    this.time = data.lampTime;
  }

  increaseTime(time: number) {
    this.time += time;
  }

  decreaseTime(time: number) {
    this.time -= time;
  }

  async getLamp() {
    const id = user?.profile?.uid;
    if (!id) return;
    const res = (await getDoc(doc(db, 'user', id))).data();
    if (res?.lampName?.length === undefined || res?.lampTime === undefined)
      return;
    this.setLamp(res as LampData);
  }

  async addLamp(name: string, time = 0) {
    const id = user?.profile?.uid;
    if (!id) return;
    await setDoc(
      doc(db, 'user', id),
      { lampName: name, lampTime: time },
      { merge: true }
    );
    this.setLamp({ lampName: name, lampTime: time });
  }
}

export const lamp = new Lamp();

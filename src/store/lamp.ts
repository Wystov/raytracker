import {
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';
import { makeAutoObservable } from 'mobx';

import { dbRefs, setDbRefs } from '@/services/firebase/store';
import type { LampData } from '@/types';

import { user } from './user';

class Lamp {
  exists = false;
  name = '';
  time = 0;
  bulbTime = 0;
  bulbLifetime = 0;
  bulbChangeDate: Date | Timestamp | null = null;
  id = '';

  constructor() {
    makeAutoObservable(this);
  }

  async delete() {
    if (!dbRefs.lampDoc) {
      console.error('db ref for lamp doc is not set');
      return;
    }
    await deleteDoc(dbRefs.lampDoc);
    user.modifyLampList(this.id, 'delete');

    this.reset();
  }

  reset() {
    this.exists = false;
    this.name = '';
    this.time = 0;
    this.bulbTime = 0;
    this.bulbLifetime = 0;
    this.id = '';
  }

  setLamp(data: LampData) {
    if (!data) {
      console.error('No lamp data passed to setLamp');
      return;
    }
    this.exists = true;
    this.name = data.lampName;
    this.time = data.lampTime;
    this.id = data.lampId;
    this.bulbTime = data.bulbTime;
    this.bulbLifetime = data.bulbLifetime;
    this.bulbChangeDate = data.bulbChangeDate;
  }

  increaseTime(time: number) {
    this.time += time;
    this.bulbTime += time;
  }

  decreaseTime(time: number) {
    this.time -= time;
    this.bulbTime -= time;
  }

  async getLamp() {
    if (!dbRefs.lampDoc) {
      console.error('db ref for lamp doc is not set');
      return;
    }

    const res = await getDoc(dbRefs.lampDoc);

    this.setLamp(res.data() as LampData);
  }

  async addLamp(name: string, time = 0) {
    if (!dbRefs.lampsCollection) {
      console.error('db ref for lamps collections is not set');
      return;
    }

    const lampDocRef = doc(dbRefs.lampsCollection);

    const lampDataWithId = {
      lampName: name,
      lampTime: time,
      bulbTime: time,
      bulbLifetime: 1000,
      lampId: lampDocRef.id,
      bulbChangeDate: null,
    };
    await setDoc(lampDocRef, lampDataWithId);

    setDbRefs({ uid: user.data?.profile.uid, lampId: lampDocRef.id });

    user.modifyLampList(lampDocRef.id, 'add');

    this.setLamp(lampDataWithId);
  }

  async editLamp(name: string) {
    if (!dbRefs.lampDoc) {
      console.error('db ref for lamp doc is not set');
      return;
    }

    await updateDoc(dbRefs.lampDoc, { lampName: name });
    this.name = name;
  }
}

export const lamp = new Lamp();

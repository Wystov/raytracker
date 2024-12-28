import {
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';
import { makeAutoObservable } from 'mobx';

import { getLampAndBulbTimeChange } from '@/lib/get-lamp-and-bulb-time-change';
import { dbRefs, setDbRefs } from '@/services/firebase/store';
import type { LampData } from '@/types';

import { user } from './user';

class Lamp {
  exists = false;
  name = '';
  time = 0;
  initTime = 0;
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
    this.initTime = data.initTime;
  }

  increaseTime(sessionTime: number, sessionDate?: Date | Timestamp) {
    const timeChanges = getLampAndBulbTimeChange(
      sessionDate,
      sessionTime,
      this.bulbChangeDate
    );

    this.time += sessionTime;
    if (timeChanges.bulbTime) {
      this.bulbTime += sessionTime;
    }
  }

  decreaseTime(sessionTime: number, sessionDate?: Date | Timestamp) {
    const timeChanges = getLampAndBulbTimeChange(
      sessionDate,
      sessionTime,
      this.bulbChangeDate
    );

    this.time -= sessionTime;
    if (timeChanges.bulbTime) {
      this.bulbTime -= sessionTime;
    }
  }

  async getLamp() {
    if (!dbRefs.lampDoc) {
      console.error('db ref for lamp doc is not set');
      return;
    }

    const res = await getDoc(dbRefs.lampDoc);

    this.setLamp(res.data() as LampData);
  }

  async addLamp(name: string, initTime = 0, changeAfter = 1000) {
    if (!dbRefs.lampsCollection) {
      console.error('db ref for lamps collections is not set');
      return;
    }

    const initTimeInSec = initTime * 3600;

    const lampDocRef = doc(dbRefs.lampsCollection);

    const lampDataWithId = {
      lampName: name,
      lampTime: initTimeInSec,
      bulbTime: initTimeInSec,
      bulbLifetime: changeAfter,
      lampId: lampDocRef.id,
      bulbChangeDate: null,
      initTime: initTimeInSec,
    };

    await setDoc(lampDocRef, lampDataWithId);

    setDbRefs({ uid: user.data?.profile.uid, lampId: lampDocRef.id });

    user.modifyLampList(lampDocRef.id, 'add');

    this.setLamp(lampDataWithId);
  }

  async editLamp(name: string, initTime: number, changeAfter: number) {
    if (!dbRefs.lampDoc) {
      console.error('db ref for lamp doc is not set');
      return;
    }

    const initTimeInSec = initTime * 3600;

    const initDiff = Math.abs(this.initTime - initTimeInSec);
    const isInitIncrease = initTimeInSec > this.initTime;

    const newData = {
      lampName: name,
      lampTime: isInitIncrease
        ? this.bulbTime + initDiff
        : this.bulbTime - initDiff,
      bulbLifetime: changeAfter,
      initTime: initTimeInSec,
      bulbTime: this.bulbTime,
      lampId: this.id,
      bulbChangeDate: this.bulbChangeDate,
    };

    if (this.bulbChangeDate === null) {
      newData.bulbTime = newData.lampTime;

      await updateDoc(dbRefs.lampDoc, newData);
      this.setLamp(newData);
    }
  }

  get bulbProgress() {
    const lifetimeInSeconds = this.bulbLifetime * 60 * 60;
    const progress = (this.bulbTime / lifetimeInSeconds) * 100;
    return Math.min(Math.max(progress, 1), 100);
  }
}

export const lamp = new Lamp();

import { collection, deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { makeAutoObservable } from 'mobx';

import { db } from '@/services/firebase/store';
import type { LampData } from '@/types';

import { user } from './user';

class Lamp {
  exists = false;
  name = '';
  time = 0;
  id = '';

  constructor() {
    makeAutoObservable(this);
  }

  async reset() {
    const uid = user?.data?.profile?.uid;
    const { id } = lamp;

    if (!uid || !id) return;

    await deleteDoc(doc(db, 'users', uid, 'lamps', id));
    user.modifyLampList(id, 'delete');

    this.exists = false;
    this.name = '';
    this.time = 0;
  }

  setLamp(data: LampData) {
    if (!data) return;
    this.exists = true;
    this.name = data.lampName;
    this.time = data.lampTime;
    this.id = data.lampId;
  }

  increaseTime(time: number) {
    this.time += time;
  }

  decreaseTime(time: number) {
    this.time -= time;
  }

  async getLamp() {
    const id = user?.data?.profile?.uid;

    const lampId = user.data?.lampList.at(-1);

    if (!id || !lampId) return;
    const res = await getDoc(doc(db, 'users', id, 'lamps', lampId));

    this.setLamp(res.data() as LampData);
  }

  async addLamp(name: string, time = 0) {
    const uid = user?.data?.profile?.uid;
    if (!uid) return;

    const lampsCollectionRef = collection(db, 'users', uid, 'lamps');

    const lampDocRef = doc(lampsCollectionRef);

    const lampDataWithId = {
      lampName: name,
      lampTime: time,
      lampId: lampDocRef.id,
    };
    await setDoc(lampDocRef, lampDataWithId);

    user.modifyLampList(lampDocRef.id, 'add');

    this.setLamp({ lampName: name, lampTime: time, lampId: lampDocRef.id });
  }
}

export const lamp = new Lamp();

import { UserInfo } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { makeAutoObservable } from 'mobx';

import { db, dbRefs } from '@/services/firebase/store';
import { UserData } from '@/types';

class User {
  isLoading: boolean = true;
  data: UserData | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  get lampId() {
    return this.data?.lampList.at(-1);
  }

  setIsLoading(isLoading: boolean) {
    this.isLoading = isLoading;
  }

  setData(data: UserData) {
    this.data = data;
  }

  async setUser(user: UserInfo | null) {
    if (user === null) {
      this.data = null;
      return;
    }

    const { uid, email, displayName, photoURL } = user;

    if (!uid) {
      console.error('no uid');
      return;
    }

    const userDocRef = doc(db, 'users', uid);
    const userDocSnapshot = await getDoc(userDocRef);

    if (userDocSnapshot.exists()) {
      this.setData(userDocSnapshot.data() as UserData);
      return;
    }

    const userData: UserData = {
      profile: {
        uid,
        email,
        displayName,
        photoURL,
      },
      lampList: [],
    };

    await setDoc(userDocRef, userData);

    this.setData(userData);
  }

  async modifyLampList(lampId: string, action: 'add' | 'delete') {
    if (!dbRefs.userDoc || !this.data) {
      console.error('db ref user doc is not set');
      return;
    }

    let newLampList = this.data?.lampList ?? [];

    if (action === 'delete') {
      newLampList = newLampList.filter((lamp) => lamp !== lampId);
    } else if (action === 'add') {
      newLampList.push(lampId);
    }

    await updateDoc(dbRefs.userDoc, {
      lampList: newLampList,
    });

    this.data.lampList = newLampList;
  }
}

export const user = new User();

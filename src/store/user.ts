import { UserInfo } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { makeAutoObservable } from 'mobx';

import { db, dbRefs } from '@/services/firebase/store';
import { UserData } from '@/types';

class User {
  initialized: boolean = false;
  data: UserData | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setInitialized() {
    this.initialized = true;
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
      this.data = userDocSnapshot.data() as UserData;
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

    this.data = userData;
  }

  async modifyLampList(lampId: string, action: 'add' | 'delete') {
    if (!dbRefs.userDoc) {
      console.error('db ref user doc is not set');
      return;
    }

    if (action === 'delete' && this.data !== null) {
      this.data.lampList = this.data?.lampList.filter(
        (lamp) => lamp !== lampId
      );
    } else if (action === 'add') {
      this.data?.lampList.push(lampId);
    }

    await updateDoc(dbRefs.userDoc, {
      lampList: this.data?.lampList,
    });

    this.data?.lampList.push(lampId);
  }
}

export const user = new User();

import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { runInAction } from 'mobx';

import { lamp } from '@/store/lamp';
import { sessions } from '@/store/sessions';
import { user } from '@/store/user';

import { app } from './index';
import { setDbRefs } from './store';

export const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  const { user: UserData } = await signInWithPopup(auth, provider);
  user.setUser(UserData);
};

export const signOutUser = () => {
  signOut(auth);
};

onAuthStateChanged(auth, async (data) => {
  await user.setUser(data);
  user.setInitialized();
  if (!data?.uid) {
    setDbRefs({ reset: true });
    lamp.reset();
    sessions.reset();
    return;
  }

  setDbRefs({ uid: data.uid, lampId: runInAction(() => user.lampId) });
  await lamp.getLamp();
  sessions.getSessions();
});

import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { runInAction } from 'mobx';

import { loginOneSignal, logoutOneSignal } from '@/services/onesignal';
import { lamp } from '@/store/lamp';
import { sessions } from '@/store/sessions';
import { user } from '@/store/user';

import { app } from './index';
import { setDbRefs } from './store';

export const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  user.setIsLoading(true);
  try {
    await signInWithPopup(auth, provider);
  } catch (error) {
    console.error(error);
    user.setIsLoading(false);
  }
};

export const signOutUser = () => {
  signOut(auth);
};

onAuthStateChanged(auth, async (data) => {
  user.setIsLoading(true);

  try {
    await user.setUser(data);
    if (!data?.uid) {
      setDbRefs({ reset: true });
      lamp.reset();
      sessions.reset();
      logoutOneSignal();
      return;
    }

    setDbRefs({ uid: data.uid, lampId: runInAction(() => user.lampId) });
    await lamp.getLamp();
    await sessions.getSessions();
    loginOneSignal(data.uid);
  } catch (error) {
    console.error(error);
  } finally {
    user.setIsLoading(false);
  }
});

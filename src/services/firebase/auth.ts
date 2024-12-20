import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { app } from './index';
import { user } from '@/store/user';
import { lamp } from '@/store/lamp';
import { sessions } from '@/store/sessions';

export const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export const signInWithGoogle = () => {
  signInWithPopup(auth, provider);
};

export const signOutUser = () => {
  signOut(auth);
};

onAuthStateChanged(auth, async (data) => {
  user.setUser(data);
  user.setInitialized();
  await lamp.getLamp();
  sessions.getSessions();
});

import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { app } from './index';
import { user } from '@/store/user';

export const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export const signInWithGoogle = () => {
  signInWithPopup(auth, provider);
};

export const signOutUser = () => {
  signOut(auth);
};

onAuthStateChanged(auth, (data) => {
  user.setUser(data);
  user.setInitialized();
});

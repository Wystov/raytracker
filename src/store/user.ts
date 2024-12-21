import { UserInfo } from 'firebase/auth';
import { makeAutoObservable } from 'mobx';

class User {
  initialized: boolean = false;
  profile: UserInfo | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setInitialized() {
    this.initialized = true;
  }

  setUser(user: UserInfo | null) {
    this.profile = user;
  }
}

export const user = new User();

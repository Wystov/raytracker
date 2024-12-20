import { makeAutoObservable } from 'mobx';

class User {
  initialized: boolean = false;
  profile = null;

  constructor() {
    makeAutoObservable(this);
  }

  setInitialized() {
    this.initialized = true;
  }

  setUser(user) {
    this.profile = user;
  }
}

export const user = new User();

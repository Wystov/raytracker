import {
  deleteDoc,
  doc,
  DocumentData,
  getDocs,
  increment,
  limit,
  orderBy,
  query,
  QueryConstraint,
  QueryDocumentSnapshot,
  setDoc,
  startAfter,
  updateDoc,
  where,
} from 'firebase/firestore';
import { makeAutoObservable } from 'mobx';

import { getLampAndBulbTimeChange } from '@/lib/get-lamp-and-bulb-time-change';
import { dbRefs } from '@/services/firebase/store';
import { NarrowedToDate, SessionData, SessionDataWithId } from '@/types';

import { lamp } from './lamp';

class Sessions {
  list = [] as SessionDataWithId[];
  itemsPerPage = 5;
  lastKey: QueryDocumentSnapshot<DocumentData> | null = null;
  listByMonth = new Map<string, NarrowedToDate<SessionDataWithId>[]>();

  constructor() {
    makeAutoObservable(this);
  }

  async delete() {
    if (!dbRefs.lampDoc) {
      console.error('db ref for lamp doc is not set');
      return;
    }

    await deleteDoc(dbRefs.lampDoc);

    this.reset();
  }

  reset() {
    this.setList([]);
  }

  setList(list: SessionDataWithId[]) {
    this.list = list;
  }

  addToList(session: SessionDataWithId) {
    this.list.push(session);
  }

  removeFromList(sessionId: string) {
    this.list = this.list.filter((session) => session.id !== sessionId);
  }

  async getSessions(load: 'more' | 'init' = 'init') {
    if (!dbRefs.sessionsCollection) {
      console.error('db ref for sessions collection is not set');
      return;
    }

    const constraints: QueryConstraint[] = [
      orderBy('dateTime', 'desc'),
      limit(this.itemsPerPage),
    ];

    if (load === 'more' && this.lastKey) {
      constraints.push(startAfter(this.lastKey));
    }

    const res = await getDocs(query(dbRefs.sessionsCollection, ...constraints));

    res.forEach((session) =>
      this.addToList(session.data() as SessionDataWithId)
    );

    this.lastKey = res.docs[res.docs.length - 1];
  }

  async getSessionsForMonth(date: Date) {
    const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;

    if (this.listByMonth.has(monthKey)) {
      return this.listByMonth.get(monthKey)!;
    }

    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    );

    const res = await getDocs(
      query(
        dbRefs.sessionsCollection!,
        where('dateTime', '>=', startOfMonth),
        where('dateTime', '<=', endOfMonth)
      )
    );

    const data = res.docs.map((doc) => {
      const data = doc.data() as SessionDataWithId;
      return {
        ...data,
        dateTime:
          data.dateTime instanceof Date
            ? data.dateTime
            : data.dateTime.toDate(),
      };
    }) as NarrowedToDate<SessionDataWithId>[];

    this.listByMonth.set(monthKey, data);

    return data;
  }

  async addSession(session: SessionData) {
    if (!dbRefs.sessionsCollection || !dbRefs.lampDoc) {
      console.error(
        'db refs for sessions collection or lamp doc is not set',
        'Sessions collection ref: ',
        dbRefs.sessionsCollection,
        'lamp doc ref: ',
        dbRefs.lampDoc
      );
      return;
    }

    const sessionDocRef = doc(dbRefs.sessionsCollection);

    const sessionDataWithId: SessionDataWithId = {
      ...session,
      id: sessionDocRef.id,
    };
    await setDoc(sessionDocRef, sessionDataWithId);
    await updateDoc(dbRefs.lampDoc, {
      lampTime: increment(session.totalSessionTime),
      bulbTime: increment(session.totalSessionTime),
      sessionsCount: increment(1),
    });

    this.list.unshift(sessionDataWithId);

    lamp.increaseSessionsCount();
    lamp.increaseTime(session.totalSessionTime, session.dateTime);
  }

  async removeSession(sessionId: string) {
    if (!dbRefs.sessionDoc || !dbRefs.lampDoc) {
      console.error(
        'db ref sessionDoc or lamp doc is not set',
        'session doc: ',
        dbRefs.sessionDoc?.toString(),
        'lamp doc: ',
        dbRefs.lampDoc
      );
      return;
    }

    const session = this.list.find((session) => session.id === sessionId);

    if (!session) {
      console.error('no session found');
      return;
    }

    const newTime = getLampAndBulbTimeChange(
      session?.dateTime,
      session?.totalSessionTime,
      lamp.bulbChangeDate,
      'delete'
    );

    await deleteDoc(dbRefs.sessionDoc(sessionId.toString()));

    this.removeFromList(sessionId);

    await updateDoc(dbRefs.lampDoc, {
      ...newTime,
      sessionsCount: increment(-1),
    });

    lamp.decreaseSessionsCount();

    lamp.decreaseTime(session.totalSessionTime, session.dateTime);
  }

  async editSession(data: SessionDataWithId) {
    if (!dbRefs.lampDoc || !dbRefs.sessionDoc) {
      console.error(
        'No session id or no db ref lamp doc or no db ref session doc',
        'db ref lamp doc: ',
        dbRefs.lampDoc,
        'db ref session doc: ',
        dbRefs.sessionDoc?.toString()
      );
      return;
    }

    const oldSession = this.list.find((s) => s.id === data.id);
    if (!oldSession) {
      console.error('no old session found');
      return;
    }

    const timeDiff = data.totalSessionTime - oldSession.totalSessionTime;

    await updateDoc(dbRefs.sessionDoc(data.id), data);

    const lampData = getLampAndBulbTimeChange(
      oldSession.dateTime,
      timeDiff,
      lamp.bulbChangeDate
    );

    await updateDoc(dbRefs.lampDoc, lampData);
    this.setList(this.list.map((s) => (s.id === data.id ? data : s)));

    lamp.increaseTime(timeDiff, data.dateTime);
  }

  get listWithDates(): NarrowedToDate<SessionDataWithId>[] {
    return this.list.map((session) => ({
      ...session,
      dateTime:
        session.dateTime instanceof Date
          ? session.dateTime
          : session.dateTime.toDate(),
    }));
  }
}

export const sessions = new Sessions();

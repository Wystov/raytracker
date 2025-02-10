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
import { action, makeAutoObservable, observable, runInAction } from 'mobx';
import { toast } from 'sonner';

import { getLampAndBulbTimeChange } from '@/lib/get-lamp-and-bulb-time-change';
import { getListWithDates } from '@/lib/get-list-with-dates';
import { getYYYYMMKey } from '@/lib/get-YYYY-MM-key';
import { timestampToDate } from '@/lib/timestamp-to-date';
import { dbRefs } from '@/services/firebase/store';
import { NarrowedToDate, SessionData, SessionDataWithId } from '@/types';

import { lamp } from './lamp';

class Sessions {
  listData = [] as SessionDataWithId[];
  itemsPerPage = 5;
  lastKey: QueryDocumentSnapshot<DocumentData> | null = null;
  listByMonth = observable.map<string, NarrowedToDate<SessionDataWithId>[]>();
  isFetching = false;
  isMonthDataFetching = false;

  constructor() {
    makeAutoObservable(this);
  }

  get list() {
    return getListWithDates(this.listData).sort(
      (a, b) => b.dateTime.getTime() - a.dateTime.getTime()
    );
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
    this.listByMonth.clear();
  }

  setList(list: SessionDataWithId[]) {
    this.listData = list;
  }

  addToList(session: SessionDataWithId) {
    this.listData.push(session);
  }

  setLastKey(key: QueryDocumentSnapshot<DocumentData>) {
    this.lastKey = key;
  }

  setIsFetching(isFetching: boolean, type: 'list' | 'month') {
    if (type === 'list') this.isFetching = isFetching;
    if (type === 'month') this.isMonthDataFetching = isFetching;
  }

  removeFromList(sessionId: string) {
    const date = this.listData.find((s) => s.id === sessionId)?.dateTime;

    this.listData = this.listData.filter((session) => session.id !== sessionId);

    if (!date) return;
    const monthKey = getYYYYMMKey(timestampToDate(date));
    if (this.listByMonth.has(monthKey))
      this.listByMonth.set(
        monthKey,
        this.listByMonth.get(monthKey)!.filter((s) => s.id !== sessionId)
      );
    if (this.listByMonth.get(monthKey)?.length === 0)
      this.listByMonth.delete(monthKey);
  }

  async getSessions(load: 'more' | 'init' = 'init') {
    if (this.isFetching) return;

    if (!dbRefs.sessionsCollection) {
      console.error('db ref for sessions collection is not set');
      return;
    }

    this.setIsFetching(true, 'list');

    const constraints: QueryConstraint[] = [
      orderBy('dateTime', 'desc'),
      limit(this.itemsPerPage),
    ];

    if (load === 'more' && this.lastKey) {
      constraints.push(startAfter(this.lastKey));
    }

    try {
      const res = await getDocs(
        query(dbRefs.sessionsCollection, ...constraints)
      );

      res.forEach((session) =>
        this.addToList(session.data() as SessionDataWithId)
      );

      this.setLastKey(res.docs[res.docs.length - 1]);
    } catch (error) {
      console.error(error);
    } finally {
      this.setIsFetching(false, 'list');
    }
  }

  async getSessionsForMonth(date: Date) {
    const monthKey = getYYYYMMKey(date);
    if (this.listByMonth.has(monthKey)) {
      return this.listByMonth.get(monthKey)!;
    }

    if (this.isMonthDataFetching) return;

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

    try {
      this.setIsFetching(true, 'month');

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

      runInAction(() => {
        this.listByMonth.set(monthKey, data);

        for (const session of data) {
          if (!this.listData.find((s) => s.id === session.id))
            this.addToList(session);
        }
      });
    } catch (error) {
      console.error(error);
    } finally {
      this.setIsFetching(false, 'month');
    }
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

    toast.success('Session added');
    this.addToList(sessionDataWithId);

    const monthKey = getYYYYMMKey(timestampToDate(sessionDataWithId.dateTime));

    action(() => {
      if (!this.listByMonth.has(monthKey)) {
        this.listByMonth.set(monthKey, []);
      }
      this.listByMonth.get(monthKey)!.push({
        ...sessionDataWithId,
        dateTime: timestampToDate(sessionDataWithId.dateTime),
      });
    });

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

    const session = this.listData.find((session) => session.id === sessionId);

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

    toast.success('Session deleted');

    lamp.decreaseSessionsCount();

    runInAction(() =>
      lamp.decreaseTime(session.totalSessionTime, session.dateTime)
    );
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

    const oldSession = this.listData.find((s) => s.id === data.id);
    if (!oldSession) {
      console.error('no old session found');
      return;
    }

    const timeDiff = data.totalSessionTime - oldSession.totalSessionTime;

    await updateDoc(dbRefs.sessionDoc(data.id), data);

    const lampData = runInAction(() =>
      getLampAndBulbTimeChange(
        oldSession.dateTime,
        timeDiff,
        lamp.bulbChangeDate
      )
    );

    await updateDoc(dbRefs.lampDoc, lampData);

    toast.success('Session edited');
    runInAction(() => {
      this.setList(this.listData.map((s) => (s.id === data.id ? data : s)));
    });

    lamp.increaseTime(timeDiff, data.dateTime);
  }
}

export const sessions = new Sessions();

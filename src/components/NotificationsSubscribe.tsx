/* eslint-disable mobx/missing-observer */
import { runInAction } from 'mobx';
import { useState } from 'react';

import { scheduleNotification, subscribeOneSignal } from '@/services/onesignal';
import { user } from '@/store/user';

export const NotificationsSubscribe = () => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const onSubscribe = () => {
    subscribeOneSignal();
  };

  const onShedule = () => {
    const uid = runInAction(() => user.data?.profile.uid);

    scheduleNotification(date, time, uid);
  };

  return (
    <div>
      <button onClick={onSubscribe}>Subscribe</button>

      <input type="date" onChange={(e) => setDate(e.target.value)} />
      <input type="time" onChange={(e) => setTime(e.target.value)} />
      <button onClick={onShedule}>Schedule Reminder</button>
    </div>
  );
};

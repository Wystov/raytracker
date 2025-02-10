import OneSignal from 'react-onesignal';
import { toast } from 'sonner';

export const initOneSignal = async () => {
  try {
    await OneSignal.init({
      appId: import.meta.env.VITE_ONESIGNAL_APP_ID,
      allowLocalhostAsSecureOrigin: import.meta.env.DEV,
      autoResubscribe: true,
    });
  } catch (error) {
    console.error('Error initializing OneSignal: ', error);
  }
};

export const subscribeOneSignal = async () => {
  try {
    await OneSignal.Notifications.requestPermission();
  } catch (error) {
    console.error('Error subscribing to OneSignal: ', error);
  }
};

export const loginOneSignal = async (userId?: string) => {
  if (!userId) {
    console.error('No user ID provided. Skipping OneSignal login.');
    return;
  }

  try {
    await OneSignal.login(userId);
  } catch (error) {
    console.error('Error logging in to OneSignal: ', error);
  }
};

export const logoutOneSignal = async () => {
  try {
    await OneSignal.logout();
  } catch (error) {
    console.error('Error loging out from OneSignal: ', error);
  }
};

export const scheduleNotification = async (dateTime: Date, userId?: string) => {
  if (!userId) {
    console.error(
      "Can't get user ID. Skipping OneSignal notification scheduling."
    );
    return;
  }

  try {
    const scheduledDateTime = dateTime.toString();
    if (isNaN(new Date(scheduledDateTime).getTime())) {
      console.error('Invalid date or time.');
      return;
    }

    const response = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Key ${import.meta.env.VITE_ONESIGNAL_API_KEY}`,
      },
      body: JSON.stringify({
        app_id: import.meta.env.VITE_ONESIGNAL_APP_ID,
        include_aliases: {
          external_id: [userId],
        },
        target_channel: 'push',
        contents: { en: 'Time to use your UVB lamp!' },
        send_after: scheduledDateTime,
      }),
    });

    const result = await response.json();

    if (!result.id) throw new Error('No result id in response');
    toast.success('Reminder scheduled successfully');
  } catch (error) {
    console.error('Error scheduling notification:', error);
    toast.error('Failed to schedule reminder');
  }
};

export const isNotificationsEnabled = () => OneSignal.Notifications.permission;

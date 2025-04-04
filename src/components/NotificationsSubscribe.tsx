/* eslint-disable mobx/missing-observer */
import { zodResolver } from '@hookform/resolvers/zod';
import { runInAction } from 'mobx';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { DateTimePicker } from '@/components/ui/DateTimePicker';
import { Form, FormField } from '@/components/ui/form';
import {
  isPushSupported,
  isSubscribed,
  scheduleNotification,
  subscribeOneSignal,
} from '@/services/onesignal';
import { user } from '@/store/user';

const formSchema = z.object({
  reminderDateTime: z.date(),
});

type FormSchemaType = z.infer<typeof formSchema>;

export const NotificationsSubscribe = () => {
  const [pushPermission, setPushPermission] = useState<NotificationPermission>(
    Notification.permission
  );

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reminderDateTime: new Date(),
    },
  });

  const onSubscribe = async () => {
    await subscribeOneSignal();
    setPushPermission(Notification.permission);
  };

  const onSubmit = (data: FormSchemaType) => {
    const uid = runInAction(() => user.data?.profile.uid);
    scheduleNotification(data.reminderDateTime, uid);
  };

  const renderContent = () => {
    if (!isPushSupported()) {
      return <p>Push notifications are not supported by your browser.</p>;
    }

    if (pushPermission === 'denied') {
      return (
        <p>
          Notifications are blocked for this site. Please enable them in your
          browser settings if you want to receive reminders.
        </p>
      );
    }

    if (pushPermission === 'granted' && isSubscribed()) {
      return (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="reminderDateTime"
              render={({ field }) => (
                <DateTimePicker field={field} className="px-0" />
              )}
            />
            <Button type="submit" className="my-4">
              Remind me
            </Button>
          </form>
        </Form>
      );
    }

    return (
      <Button onClick={onSubscribe} className="self-start">
        Subscribe to notifications
      </Button>
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <p>Notifications</p>
      {renderContent()}
    </div>
  );
};

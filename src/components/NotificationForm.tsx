/* eslint-disable mobx/missing-observer */
import { zodResolver } from '@hookform/resolvers/zod';
import { runInAction } from 'mobx';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { DateTimePicker } from '@/components/ui/DateTimePicker';
import { Form, FormField } from '@/components/ui/form';
import { scheduleNotification } from '@/services/onesignal';
import { user } from '@/store/user';

const formSchema = z.object({
  reminderDateTime: z.date(),
});

type FormSchemaType = z.infer<typeof formSchema>;

export const NotificationForm = () => {
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reminderDateTime: new Date(),
    },
  });

  const onSubmit = (data: FormSchemaType) => {
    const uid = runInAction(() => user.data?.profile.uid);
    scheduleNotification(data.reminderDateTime, uid);
  };

  return (
    <div className="flex flex-col gap-4">
      <p>Notifications</p>
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
    </div>
  );
};

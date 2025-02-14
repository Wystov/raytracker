import { zodResolver } from '@hookform/resolvers/zod';
import { add } from 'date-fns';
import { runInAction } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { DateTimePicker } from '@/components/ui/DateTimePicker';
import {
  DrawerClose,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { NumberInput } from '@/components/ui/number-input';
import { Switch } from '@/components/ui/switch';
import { TimePicker } from '@/components/ui/time-picker';
import { REMINDER_DEFAULT_OFFSET_DAYS } from '@/constants';
import { toHumanReadableTime } from '@/lib/human-readable-time';
import { scheduleNotification } from '@/services/onesignal';
import { sessions } from '@/store/sessions';
import { user } from '@/store/user';
import { SessionDataWithId } from '@/types';

const formSchema = z.object({
  dateTime: z.date(),
  duration: z.date(),
  uses: z.number().int().positive(),
  scheduleReminder: z.boolean().optional(),
  reminderDateTime: z.date().optional(),
});

type FormSchemaType = z.infer<typeof formSchema>;

interface SessionInputFormProps {
  type: 'add' | 'edit';
  editSessionId?: string;
}

export const SessionInputForm = observer(function SessionInputForm({
  type,
  editSessionId,
}: SessionInputFormProps) {
  const session =
    type === 'add'
      ? sessions.list[0]
      : sessions.list.find((s) => s.id === editSessionId);

  const date = type === 'add' ? new Date() : session?.dateTime;

  const defaultUses = session?.uses ?? 1;
  const defaultUseDuration = session?.timeInSeconds ?? 30;

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dateTime: date,
      duration: new Date(new Date().setHours(0, 0, defaultUseDuration, 0)),
      uses: defaultUses,
      scheduleReminder: session?.isReminderNeeded ?? false,
      reminderDateTime: add(new Date(), { days: REMINDER_DEFAULT_OFFSET_DAYS }),
    },
  });

  const [duration, uses] = form.watch(['duration', 'uses']);
  const scheduleReminder = form.watch('scheduleReminder');

  const getTotalSessionTime = (duration: Date, uses: number) => {
    const minutes = duration.getMinutes();
    const seconds = duration.getSeconds();
    const timeInSeconds = minutes * 60 + seconds;
    const totalSessionTime = timeInSeconds * uses;
    return { timeInSeconds, totalSessionTime };
  };

  const { timeInSeconds, totalSessionTime } = getTotalSessionTime(
    duration,
    uses
  );

  const onSubmit = (data: FormSchemaType) => {
    const formattedData: SessionDataWithId = {
      dateTime: data.dateTime,
      uses: data.uses,
      timeInSeconds,
      totalSessionTime,
      id: '',
      isReminderNeeded: data.scheduleReminder,
    };
    if (type === 'add') {
      sessions.addSession(formattedData);

      if (scheduleReminder && data.reminderDateTime) {
        const uid = runInAction(() => user.data?.profile.uid);
        scheduleNotification(data.reminderDateTime, uid);
      }
      return;
    }

    if (!editSessionId) {
      console.error('no session id passed for edit');
      return;
    }

    formattedData.id = editSessionId;
    sessions.editSession(formattedData);
  };

  return (
    <div className="mx-auto w-full max-w-sm">
      <DrawerHeader>
        <DrawerTitle>{type === 'add' ? 'Add new' : 'Edit'} session</DrawerTitle>
        <DrawerDescription>
          Pick date and time of use. Uses is an amount of uses per session e.g.
          you used your lamp for 3 spots 1 minute each. Total session time will
          be 3 minutes.
        </DrawerDescription>
      </DrawerHeader>
      <Form {...form}>
        <form
          className="flex flex-col gap-4 justify-center"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="dateTime"
            render={({ field }) => <DateTimePicker field={field} />}
          />
          <div className="flex">
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem className="flex flex-col basis-2/4 px-4">
                  <FormLabel className="text-left">Duration per use</FormLabel>
                  <FormControl>
                    <TimePicker
                      type={'mmss'}
                      date={field.value}
                      setDate={field.onChange}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="uses"
              render={({ field }) => (
                <FormItem className="flex flex-col justify-between px-4">
                  <FormLabel className="text-left">Uses</FormLabel>
                  <FormControl>
                    <NumberInput
                      value={field.value}
                      setValue={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <p className="px-4">
            <span className="font-medium">Total session time:</span>{' '}
            {toHumanReadableTime(totalSessionTime)}
          </p>
          {type === 'add' && (
            <FormField
              control={form.control}
              name="scheduleReminder"
              render={({ field }) => (
                <FormItem className="flex justify-start items-center gap-2 px-4">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="m-0"
                    />
                  </FormControl>
                  <FormLabel className="mt-0!">Schedule reminder</FormLabel>
                </FormItem>
              )}
            />
          )}
          {scheduleReminder && (
            <FormField
              control={form.control}
              name="reminderDateTime"
              render={({ field }) => <DateTimePicker field={field} />}
            />
          )}
          <DrawerFooter className="flex-row gap-2 py-0 mb-12">
            <DrawerClose asChild>
              <Button variant={'outline'} className="flex-1">
                Cancel
              </Button>
            </DrawerClose>
            <DrawerClose asChild>
              <Button type="submit" className="flex-1">
                {type === 'add' ? 'Add' : 'Edit'}
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </form>
      </Form>
    </div>
  );
});

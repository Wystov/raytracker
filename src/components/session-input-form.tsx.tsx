import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { sessions } from '@/store/sessions';

import {
  DrawerClose,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from './ui/drawer';
import { NumberInput } from './ui/number-input';
import { TimePicker } from './ui/time-picker';

const formSchema = z.object({
  dateTime: z.date(),
  duration: z.date(),
  uses: z.number().int().positive(),
});

type FormSchemaType = z.infer<typeof formSchema>;

interface SessionInputFormProps {
  type: 'add' | 'edit';
  editSessionId?: number;
}

export const SessionInputForm = observer(function SessionInputForm({
  type,
  editSessionId,
}: SessionInputFormProps) {
  const session =
    type === 'add'
      ? sessions.list.at(-1)
      : sessions.list.find((s) => s.id === editSessionId);

  const id = editSessionId ?? session?.id;
  let date = type === 'add' ? new Date() : session?.dateTime;
  if (!(date instanceof Date)) date = date?.toDate();

  const uses = session?.uses ?? 1;
  const useDuration = session?.timeInSeconds ?? 30;

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dateTime: date,
      duration: new Date(new Date().setHours(0, 0, useDuration, 0)),
      uses: uses,
    },
  });

  function onSubmit(data: FormSchemaType) {
    const minutes = data.duration.getMinutes();
    const seconds = data.duration.getSeconds();
    const timeInSeconds = minutes * 60 + seconds;
    const totalSessionTime = timeInSeconds * data.uses;
    const formattedData = {
      id: id ?? -1,
      dateTime: data.dateTime,
      uses: data.uses,
      timeInSeconds,
      totalSessionTime,
    };
    if (type === 'add') {
      formattedData.id += 1;
      sessions.addSession(formattedData);
      return;
    }

    sessions.editSession(formattedData, id);
  }

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
            render={({ field }) => (
              <FormItem className="flex flex-col px-4">
                <FormLabel className="text-left">Date and time</FormLabel>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  <Popover>
                    <FormControl>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            'w-[280px] justify-start text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'PPP HH:mm:ss')
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                    </FormControl>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <TimePicker
                  type="hhmm"
                  setDate={field.onChange}
                  date={field.value}
                  hasIcon
                />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem className="flex flex-col px-4">
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
              <FormItem className="flex flex-col px-4">
                <FormLabel className="text-left">Uses</FormLabel>
                <FormControl>
                  <NumberInput value={field.value} setValue={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
          <DrawerFooter>
            <DrawerClose asChild>
              <Button type="submit">{type === 'add' ? 'Add' : 'Edit'}</Button>
            </DrawerClose>
            <DrawerClose asChild>
              <Button variant={'outline'}>Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </form>
      </Form>
    </div>
  );
});

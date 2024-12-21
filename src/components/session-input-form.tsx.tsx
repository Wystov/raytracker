import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
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

import { Input } from './ui/input';
import { TimePicker } from './ui/time-picker';

const formSchema = z.object({
  dateTime: z.date(),
  duration: z.date(),
  uses: z.number().int().positive(),
});

type FormSchemaType = z.infer<typeof formSchema>;

export const SessionInputForm = observer(function SessionInputForm({ onClose }: { onClose: () => void }) {
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dateTime: new Date(),
      duration: new Date(new Date().setHours(0, 0, 30, 0)),
      uses: 1,
    },
  });

  function onSubmit(data: FormSchemaType) {
    const minutes = data.duration.getMinutes();
    const seconds = data.duration.getSeconds();
    const timeInSeconds = minutes * 60 + seconds;
    const totalSessionTime = timeInSeconds * data.uses;
    const formattedData = {
      dateTime: data.dateTime,
      uses: data.uses,
      timeInSeconds,
      totalSessionTime,
    };
    sessions.addSession(formattedData);
    onClose();
  }

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4 justify-center"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="dateTime"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="text-left">Date and time</FormLabel>
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
                      <CalendarIcon className="mr-2 h-4 w-4" />
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
                  <div className="p-3 border-t border-border">
                    <TimePicker
                      type="hhmm"
                      setDate={field.onChange}
                      date={field.value}
                      hasIcon
                    />
                  </div>
                </PopoverContent>
              </Popover>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem className="flex flex-col">
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
            <FormItem className="flex flex-col">
              <FormLabel className="text-left">Uses</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  className="w-[70px] text-center"
                  min="1"
                  max="99"
                  {...field}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === '' ? undefined : +e.target.value
                    )
                  }
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit">Add</Button>
      </form>
    </Form>
  );
})

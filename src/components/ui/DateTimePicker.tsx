import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { FieldValues } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { FormControl, FormItem, FormLabel } from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { TimePicker } from '@/components/ui/time-picker';
import { cn } from '@/lib/utils';

type DateTimePickerProps = {
  field: FieldValues;
  className?: string;
};

/* eslint-disable mobx/missing-observer */
export const DateTimePicker = ({ field, className }: DateTimePickerProps) => {
  return (
    <FormItem className={`flex flex-col px-4 ${className}`}>
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
                  format(field.value, 'PPP')
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
              onSelect={(e) => {
                if (!e) {
                  console.error('No selected date');
                  return;
                }
                const currentDateTime = field.value ?? new Date();

                const hours = currentDateTime.getHours();
                const minutes = currentDateTime.getMinutes();
                const seconds = currentDateTime.getSeconds();

                const newDate = new Date(e);
                newDate.setHours(hours, minutes, seconds, 0);

                field.onChange(newDate);
              }}
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
  );
};

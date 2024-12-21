import { Clock } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import * as React from 'react';

import { Label } from '@/components/ui/label';

import { TimePickerInput } from './time-picker-input';

interface TimePickerProps {
  date: Date;
  setDate: (date: Date) => void;
  type: 'hh' | 'mm' | 'ss' | 'hhmm' | 'hhmmss' | 'mmss';
  hasIcon?: boolean;
}

export const TimePicker = observer(function TimePicker({
  date,
  setDate,
  type,
  hasIcon,
}: TimePickerProps) {
  const minuteRef = React.useRef<HTMLInputElement>(null);
  const hourRef = React.useRef<HTMLInputElement>(null);
  const secondRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className="flex items-end gap-2">
      {type.includes('hh') && (
        <div className="grid gap-1 text-center">
          <Label htmlFor="hours" className="text-xs">
            Hours
          </Label>
          <TimePickerInput
            picker="hours"
            date={date}
            setDate={setDate}
            ref={hourRef}
            onRightFocus={() => minuteRef.current?.focus()}
          />
        </div>
      )}
      {type.includes('mm') && (
        <div className="grid gap-1 text-center">
          <Label htmlFor="minutes" className="text-xs">
            Minutes
          </Label>
          <TimePickerInput
            picker="minutes"
            date={date}
            setDate={setDate}
            ref={minuteRef}
            onLeftFocus={() => hourRef.current?.focus()}
            onRightFocus={() => secondRef.current?.focus()}
          />
        </div>
      )}

      {type.includes('ss') && (
        <div className="grid gap-1 text-center">
          <Label htmlFor="seconds" className="text-xs">
            Seconds
          </Label>
          <TimePickerInput
            picker="seconds"
            date={date}
            setDate={setDate}
            ref={secondRef}
            onLeftFocus={() => minuteRef.current?.focus()}
          />
        </div>
      )}
      {hasIcon && (
        <div className="flex h-10 items-center">
          <Clock className="ml-2 h-4 w-4" />
        </div>
      )}
    </div>
  );
});

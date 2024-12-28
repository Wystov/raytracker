/* eslint-disable mobx/missing-observer */
import { useState } from 'react';

import { cn } from '@/lib/utils';

import { Input } from './input';

interface NumberInputProps {
  value: number;
  setValue: (value: number) => void;
  maxLength?: number;
  max?: number;
  min?: number;
}

export const NumberInput: React.FC<NumberInputProps> = ({
  value,
  setValue,
  maxLength = 2,
  max = 99,
  min = 1,
}) => {
  const [lastInputTime, setLastInputTime] = useState<number | null>(null);
  const inputWidthClass = `w-${12 * Math.ceil(maxLength / 2)}`;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key >= '0' && e.key <= '9') {
      e.preventDefault();

      const currentTime = Date.now();
      const timeSinceLastInput = lastInputTime
        ? currentTime - lastInputTime
        : 2001;
      const isOverwrite =
        value.toString().length >= maxLength || timeSinceLastInput > 2000;

      const newDigit = e.key;
      const newValue = isOverwrite
        ? parseInt(newDigit, 10)
        : parseInt(value.toString() + newDigit, 10);

      setValue(Math.max(min, Math.min(newValue, max)));
      setLastInputTime(currentTime);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    if (isNaN(newValue)) {
      console.error('Input value is NaN');
      return;
    }
    setValue(Math.max(min, Math.min(newValue, max)));
  };

  return (
    <Input
      type="number"
      inputMode="numeric"
      value={value}
      onKeyDown={handleKeyDown}
      onChange={handleChange}
      className={cn(
        'text-center font-mono text-base  tabular-nums caret-transparent focus:bg-accent focus:text-accent-foreground [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
        inputWidthClass
      )}
    />
  );
};

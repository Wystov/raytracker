/* eslint-disable mobx/missing-observer */
import { useState } from 'react';

import { Input } from './input';

interface NumberInputProps {
  value: number;
  setValue: (value: number) => void;
}

export const NumberInput: React.FC<NumberInputProps> = ({
  value,
  setValue,
}) => {
  const [lastInputTime, setLastInputTime] = useState<number | null>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key >= '0' && e.key <= '9') {
      e.preventDefault();

      const currentTime = Date.now();
      const timeSinceLastInput = lastInputTime
        ? currentTime - lastInputTime
        : 2001;
      const isOverwrite =
        value.toString().length >= 2 || timeSinceLastInput > 2000;

      const newDigit = e.key;
      const newValue = isOverwrite
        ? parseInt(newDigit, 10)
        : parseInt(value.toString() + newDigit, 10);

      setValue(Math.max(1, Math.min(newValue, 99)));
      setLastInputTime(currentTime);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    if (isNaN(newValue)) {
      console.error('Input value is NaN');
      return;
    }
    setValue(Math.max(1, Math.min(newValue, 99)));
  };

  return (
    <Input
      type="number"
      inputMode="numeric"
      value={value}
      onKeyDown={handleKeyDown}
      onChange={handleChange}
      className="w-12 text-center font-mono text-base  tabular-nums caret-transparent focus:bg-accent focus:text-accent-foreground [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
    />
  );
};

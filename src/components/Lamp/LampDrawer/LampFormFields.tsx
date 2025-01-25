/* eslint-disable mobx/missing-observer */
import { useForm } from 'react-hook-form';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { NumberInput } from '@/components/ui/number-input';

import { LampFormSchemaType } from '.';

type LampFormFieldsProps = {
  form: ReturnType<typeof useForm<LampFormSchemaType>>;
};
export const LampFormFields = ({ form }: LampFormFieldsProps) => {
  return (
    <div className="flex flex-col gap-2 px-4 mb-4">
      <FormField
        control={form.control}
        name="lampName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Lamp name</FormLabel>
            <FormControl>
              <Input placeholder="Lamp name" {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="lampInitTime"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Initial time</FormLabel>
            <div className="flex gap-2 items-center">
              <FormControl>
                <NumberInput
                  value={field.value}
                  setValue={field.onChange}
                  maxLength={4}
                  min={0}
                  max={9999}
                />
              </FormControl>
              <span>hours</span>
            </div>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="lampToChangeTime"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Lamp change after</FormLabel>
            <div className="flex gap-2 items-center">
              <FormControl>
                <NumberInput
                  value={field.value}
                  setValue={field.onChange}
                  maxLength={4}
                  min={1}
                  max={9999}
                />
              </FormControl>
              <span>hours</span>
            </div>
          </FormItem>
        )}
      />
    </div>
  );
};

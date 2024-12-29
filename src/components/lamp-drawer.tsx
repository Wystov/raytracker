import { zodResolver } from '@hookform/resolvers/zod';
import { Pencil, Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { lamp } from '@/store/lamp';

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './ui/drawer';
import { Form, FormControl, FormField, FormItem, FormLabel } from './ui/form';
import { NumberInput } from './ui/number-input';

const formSchema = z.object({
  lampName: z.string().min(1),
  lampInitTime: z.number().min(0),
  lampToChangeTime: z.number().min(10),
});

type FormSchemaType = z.infer<typeof formSchema>;

interface LampDrawerProps {
  type: 'add' | 'edit';
  lampName?: string;
  initTime?: number;
  changeAfter?: number;
}

/* eslint-disable mobx/missing-observer */
export const LampDrawer = ({
  type,
  lampName,
  initTime,
  changeAfter,
}: LampDrawerProps) => {
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      lampName: lampName ?? '',
      lampInitTime: (initTime ?? 0) / 3600,
      lampToChangeTime: changeAfter ?? 1000,
    },
  });

  const icon = type === 'add' ? <Plus /> : <Pencil />;
  const title = type === 'add' ? 'Add' : 'Edit';
  const description =
    type === 'add'
      ? 'Add a new lamp to start tracking time.'
      : 'Edit your existing lamp.';
  const buttonVariant = type === 'add' ? 'default' : 'outline';

  const onSubmit = ({
    lampName,
    lampInitTime,
    lampToChangeTime,
  }: FormSchemaType) => {
    if (type === 'add') lamp.addLamp(lampName, lampInitTime, lampToChangeTime);
    if (type === 'edit')
      lamp.editLamp(lampName, lampInitTime, lampToChangeTime);
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant={buttonVariant}
          size="icon"
          onClick={(e) => e.stopPropagation()}
        >
          {icon}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm flex flex-col">
          <DrawerHeader>
            <DrawerTitle>{title} lamp</DrawerTitle>
            <DrawerDescription>{description}</DrawerDescription>
          </DrawerHeader>
          <Form {...form}>
            <form
              className="flex flex-col"
              onSubmit={form.handleSubmit(onSubmit)}
            >
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
              <DrawerFooter className="flex-row gap-2 py-0 mb-12">
                <DrawerClose asChild>
                  <Button variant={'outline'} className="flex-1">
                    Cancel
                  </Button>
                </DrawerClose>
                <DrawerClose asChild>
                  <Button type="submit" className="flex-1">
                    {title}
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </form>
          </Form>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { LampFormFields } from '@/components/Lamp/LampDrawer/LampFormFields';
import { Button } from '@/components/ui/button';
import {
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Form } from '@/components/ui/form';
import { lamp } from '@/store/lamp';

const formSchema = z.object({
  lampName: z.string().min(1),
  lampInitTime: z.number().min(0),
  lampToChangeTime: z.number().min(10),
});

export type LampFormSchemaType = z.infer<typeof formSchema>;

export interface LampDrawerProps {
  type: 'add' | 'edit';
}

export const LampDrawer = observer(function LampDrawer({
  type,
}: LampDrawerProps) {
  const { name, initTime, bulbLifetime } = lamp;
  const defaultValues = {
    lampName: type === 'add' ? '' : name,
    lampInitTime: type === 'add' ? 0 : initTime / 3600,
    lampToChangeTime: type === 'add' ? 1000 : bulbLifetime,
  };

  const form = useForm<LampFormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const title = type === 'add' ? 'Add' : 'Edit';
  const description =
    type === 'add'
      ? 'Add a new lamp to start tracking time.'
      : 'Edit your existing lamp.';

  const onSubmit = ({
    lampName,
    lampInitTime,
    lampToChangeTime,
  }: LampFormSchemaType) => {
    if (type === 'add') lamp.addLamp(lampName, lampInitTime, lampToChangeTime);
    if (type === 'edit')
      lamp.editLamp(lampName, lampInitTime, lampToChangeTime);
  };

  return (
    <>
      {type === 'add' && (
        <DrawerTrigger asChild>
          <Button variant="default" size="icon">
            <Plus />
          </Button>
        </DrawerTrigger>
      )}
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
              <LampFormFields form={form} />
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
    </>
  );
});
